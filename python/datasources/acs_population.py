import pandas as pd

from ingestion.standardized_columns import (HISPANIC_COL, RACE_COL,
                                            STATE_FIPS_COL, COUNTY_FIPS_COL,
                                            STATE_NAME_COL, COUNTY_NAME_COL,
                                            POPULATION_COL, AGE_COL, SEX_COL,
                                            Race, RACE_CATEGORY_ID_COL,
                                            RACE_INCLUDES_HISPANIC_COL,
                                            TOTAL_VALUE, POPULATION_PCT_COL,
                                            add_race_columns_from_category_id)
from ingestion import url_file_to_gcs, gcs_to_bq_util, census
from datasources.data_source import DataSource
from ingestion.census import (get_census_params, parse_acs_metadata,
                              get_vars_for_group, standardize_frame)
from ingestion.dataset_utils import add_sum_of_rows, generate_pct_share_col

# TODO pass this in from message data.
BASE_ACS_URL = "https://api.census.gov/data/2019/acs/acs5"


HISPANIC_BY_RACE_CONCEPT = "HISPANIC OR LATINO ORIGIN BY RACE"


GROUPS = {
  # Hispanic/latino separate. When doing it this way, we don't get sex/age
  # breakdowns. This is the best way to get cannonical race/ethnicity categories
  "B03002": HISPANIC_BY_RACE_CONCEPT,

  # By sex and age, for various races.
  "B01001": "SEX BY AGE",
  "B01001A": "SEX BY AGE (WHITE ALONE)",
  "B01001B": "SEX BY AGE (BLACK OR AFRICAN AMERICAN ALONE)",
  "B01001C": "SEX BY AGE (AMERICAN INDIAN AND ALASKA NATIVE ALONE)",
  "B01001D": "SEX BY AGE (ASIAN ALONE)",
  "B01001E": "SEX BY AGE (NATIVE HAWAIIAN AND OTHER PACIFIC ISLANDER ALONE)",
  "B01001F": "SEX BY AGE (SOME OTHER RACE ALONE)",
  "B01001G": "SEX BY AGE (TWO OR MORE RACES)",
  "B01001H": "SEX BY AGE (WHITE ALONE, NOT HISPANIC OR LATINO)",
  "B01001I": "SEX BY AGE (HISPANIC OR LATINO)"
}


SEX_BY_AGE_CONCEPTS_TO_RACE = {
  # These include Hispanic/Latino, so they're not standardized categories.
  "SEX BY AGE": Race.TOTAL.value,
  "SEX BY AGE (WHITE ALONE)": Race.WHITE.value,
  "SEX BY AGE (BLACK OR AFRICAN AMERICAN ALONE)": Race.BLACK.value,
  "SEX BY AGE (AMERICAN INDIAN AND ALASKA NATIVE ALONE)": Race.AIAN.value,
  "SEX BY AGE (ASIAN ALONE)": Race.ASIAN.value,
  "SEX BY AGE (NATIVE HAWAIIAN AND OTHER PACIFIC ISLANDER ALONE)": Race.NHPI.value,
  "SEX BY AGE (SOME OTHER RACE ALONE)": Race.OTHER_STANDARD.value,
  "SEX BY AGE (TWO OR MORE RACES)": Race.MULTI.value,
  "SEX BY AGE (HISPANIC OR LATINO)": Race.HISP.value,

  # Doesn't include Hispanic/Latino
  "SEX BY AGE (WHITE ALONE, NOT HISPANIC OR LATINO)": Race.WHITE_NH.value
}


RACE_STRING_TO_CATEGORY_ID_INCLUDE_HISP = {
    "American Indian and Alaska Native alone": Race.AIAN.value,
    "Asian alone": Race.ASIAN.value,
    "Black or African American alone": Race.BLACK.value,
    "Native Hawaiian and Other Pacific Islander alone": Race.NHPI.value,
    "Some other race alone": Race.OTHER_STANDARD.value,
    "Two or more races": Race.MULTI.value,
    "White alone": Race.WHITE.value
}


RACE_STRING_TO_CATEGORY_ID_EXCLUDE_HISP = {
    "American Indian and Alaska Native alone": Race.AIAN_NH.value,
    "Asian alone": Race.ASIAN_NH.value,
    "Black or African American alone": Race.BLACK_NH.value,
    "Native Hawaiian and Other Pacific Islander alone": Race.NHPI_NH.value,
    "Some other race alone": Race.OTHER_STANDARD_NH.value,
    "Two or more races": Race.MULTI_NH.value,
    "White alone": Race.WHITE_NH.value
}


def get_decade_age_bucket(age_range):
    if age_range in {'0-4', '5-9'}:
        return '0-9'
    elif age_range in {'10-14', '15-17', '18-19'}:
        return '10-19'
    elif age_range in {'20-20', '21-21', '22-24', '25-29'}:
        return '20-29'
    elif age_range in {'30-34', '35-39'}:
        return '30-39'
    elif age_range in {'40-44', '45-49'}:
        return '40-49'
    elif age_range in {'50-54', '55-59'}:
        return '50-59'
    elif age_range in {'60-61', '62-64', '65-66', '67-69'}:
        return '60-69'
    elif age_range in {'70-74', '75-79'}:
        return '70-79'
    elif age_range in {'80-84', '85+'}:
        return '80+'
    elif age_range == 'Total':
        return 'Total'
    else:
        return 'Unknown'


def get_uhc_age_bucket(age_range):
    if age_range in {'18-19', '20-24', '20-20', '21-21', '22-24', '25-29', '30-34', '35-44', '35-39', '40-44'}:
        return '18-44'
    elif age_range in {'45-54', '45-49', '50-54', '55-64', '55-59', '60-61', '62-64'}:
        return '45-64'
    elif age_range in {'65-74', '65-66', '67-69', '70-74', '75-84', '75-79', '80-84', '85+'}:
        return '65+'
    elif age_range == 'Total':
        return 'Total'


def rename_age_bracket(bracket):
    """Converts ACS age bracket label to standardized bracket format of "a-b",
       where a is the lower end of the bracket and b is the upper end,
       inclusive.

       bracket: ACS age bracket."""
    parts = bracket.split()
    if len(parts) == 3 and parts[0] == "Under":
        return "0-" + str(int(parts[1]) - 1)
    elif len(parts) == 4 and parts[1] == "to" and parts[3] == "years":
        return parts[0] + "-" + parts[2]
    elif len(parts) == 4 and parts[1] == "and" and parts[3] == "years":
        return parts[0] + "-" + parts[2]
    elif len(parts) == 2 and parts[1] == "years":
        return parts[0] + "-" + parts[0]
    elif len(parts) == 4 and " ".join(parts[1:]) == "years and over":
        return parts[0] + "+"
    else:
        return bracket


def update_col_types(frame):
    """Returns a new DataFrame with the column types replaced with int64 for
       population columns and string for other columns.

       frame: The original DataFrame"""
    colTypes = {}
    for col in frame.columns:
        if col != "NAME" and col != "state" and col != "county":
            colTypes[col] = "int64"
        else:
            colTypes["state"] = "string"
    frame = frame.astype(colTypes)
    return frame


class ACSPopulationIngester():
    """American Community Survey population data in the United States from the
       US Census."""

    def __init__(self, county_level, base_acs_url):
        # The base ACS url to use for API calls.
        self.base_acs_url = base_acs_url

        # Whether the data is at the county level. If false, it is at the state
        # level
        self.county_level = county_level

        # The base columns that are always used to group by.
        self.base_group_by_cols = (
            [STATE_FIPS_COL, COUNTY_FIPS_COL, COUNTY_NAME_COL] if county_level
            else [STATE_FIPS_COL, STATE_NAME_COL])

        # The base columns that are always used to sort by
        self.base_sort_by_cols = (
            [STATE_FIPS_COL, COUNTY_FIPS_COL] if county_level
            else [STATE_FIPS_COL])

    def upload_to_gcs(self, gcs_bucket):
        """Uploads population data from census to GCS bucket."""
        metadata = census.fetch_acs_metadata(self.base_acs_url)
        var_map = parse_acs_metadata(metadata, list(GROUPS.keys()))

        concepts = list(SEX_BY_AGE_CONCEPTS_TO_RACE.keys())
        concepts.append(HISPANIC_BY_RACE_CONCEPT)

        file_diff = False
        for concept in concepts:
            group_vars = get_vars_for_group(concept, var_map, 2)
            cols = list(group_vars.keys())
            url_params = get_census_params(cols, self.county_level)
            concept_file_diff = url_file_to_gcs.url_file_to_gcs(
                self.base_acs_url, url_params, gcs_bucket,
                self.get_filename(concept))
            file_diff = file_diff or concept_file_diff

        return file_diff

    def write_to_bq(self, dataset, gcs_bucket):
        """Writes population data to BigQuery from the provided GCS bucket

        dataset: The BigQuery dataset to write to
        gcs_bucket: The name of the gcs bucket to read the data from"""
        # TODO change this to have it read metadata from GCS bucket
        metadata = census.fetch_acs_metadata(self.base_acs_url)
        var_map = parse_acs_metadata(metadata, list(GROUPS.keys()))

        race_and_hispanic_frame = gcs_to_bq_util.load_values_as_dataframe(
            gcs_bucket, self.get_filename(HISPANIC_BY_RACE_CONCEPT))
        race_and_hispanic_frame = update_col_types(race_and_hispanic_frame)

        race_and_hispanic_frame = standardize_frame(
            race_and_hispanic_frame,
            get_vars_for_group(HISPANIC_BY_RACE_CONCEPT, var_map, 2),
            [HISPANIC_COL, RACE_COL],
            self.county_level,
            POPULATION_COL)

        sex_by_age_frames = {}
        for concept in SEX_BY_AGE_CONCEPTS_TO_RACE:
            sex_by_age_frame = gcs_to_bq_util.load_values_as_dataframe(
                gcs_bucket, self.get_filename(concept))
            sex_by_age_frame = update_col_types(sex_by_age_frame)
            sex_by_age_frames[concept] = sex_by_age_frame

        frames = {
            self.get_table_name_by_race(): self.get_all_races_frame(
                race_and_hispanic_frame),
            self.get_table_name_by_sex_age_race(): self.get_sex_by_age_and_race(
                var_map, sex_by_age_frames)
        }

        frames['by_sex_age_%s' % self.get_geo_name()] = self.get_by_sex_age(
                frames[self.get_table_name_by_sex_age_race()], get_decade_age_bucket)

        by_sex_age_uhc = None
        if not self.county_level:
            by_sex_age_uhc = self.get_by_sex_age(frames[self.get_table_name_by_sex_age_race()], get_uhc_age_bucket)

        frames['by_age_%s' % self.get_geo_name()] = self.get_by_age(
            frames['by_sex_age_%s' % self.get_geo_name()],
            by_sex_age_uhc)

        frames['by_sex_%s' % self.get_geo_name()] = self.get_by_sex(
                frames[self.get_table_name_by_sex_age_race()])

        for table_name, df in frames.items():
            # All breakdown columns are strings
            column_types = {c: 'STRING' for c in df.columns}
            column_types[POPULATION_COL] = 'INT64'
            if RACE_INCLUDES_HISPANIC_COL in df.columns:
                column_types[RACE_INCLUDES_HISPANIC_COL] = 'BOOL'

            if POPULATION_PCT_COL in df.columns:
                column_types[POPULATION_PCT_COL] = 'FLOAT'

            gcs_to_bq_util.add_dataframe_to_bq(
                df, dataset, table_name, column_types=column_types)

    def get_table_geo_suffix(self):
        return "_county" if self.county_level else "_state"

    def get_geo_name(self):
        return 'county' if self.county_level else 'state'

    def get_fips_col(self):
        return COUNTY_FIPS_COL if self.county_level else STATE_FIPS_COL

    def get_geo_name_col(self):
        return COUNTY_NAME_COL if self.county_level else STATE_NAME_COL

    def get_table_name_by_race(self):
        return "by_race" + self.get_table_geo_suffix() + "_std"

    def get_table_name_by_sex_age_race(self):
        return "by_sex_age_race" + self.get_table_geo_suffix() + "_std"

    def get_filename(self, concept):
        """Returns the name of a file for the given ACS concept

        concept: The ACS concept description, eg 'SEX BY AGE'"""
        return self.add_filename_suffix(concept.replace(" ", "_"))

    def add_filename_suffix(self, root_name):
        """Adds geography and file type suffix to the root name.

        root_name: The root file name."""
        return root_name + self.get_table_geo_suffix() + ".json"

    def sort_race_frame(self, df):
        sort_cols = self.base_sort_by_cols.copy()
        sort_cols.append(RACE_CATEGORY_ID_COL)
        return df.sort_values(sort_cols).reset_index(drop=True)

    def sort_sex_age_race_frame(self, df):
        sort_cols = self.base_sort_by_cols.copy()
        # Note: This sorts alphabetically, which isn't ideal for the age column.
        # However, it doesn't matter how these are sorted in the backend, this
        # is just for convenience when looking at the data in BigQuery.
        sort_cols.extend([RACE_CATEGORY_ID_COL, SEX_COL, AGE_COL])
        return df.sort_values(sort_cols).reset_index(drop=True)

    def standardize_race_exclude_hispanic(self, df):
        """Standardized format using mutually exclusive groups by excluding
           Hispanic or Latino from other racial groups. Summing across all race
           categories equals the total population."""

        def get_race_category_id_exclude_hispanic(row):
            if (row[HISPANIC_COL] == 'Hispanic or Latino'):
                return Race.HISP.value
            else:
                return RACE_STRING_TO_CATEGORY_ID_EXCLUDE_HISP[row[RACE_COL]]

        standardized_race = df.copy()
        standardized_race[RACE_CATEGORY_ID_COL] = standardized_race.apply(
            get_race_category_id_exclude_hispanic, axis=1)
        standardized_race.drop(HISPANIC_COL, axis=1, inplace=True)

        group_by_cols = self.base_group_by_cols.copy()
        group_by_cols.append(RACE_CATEGORY_ID_COL)
        standardized_race = standardized_race.groupby(
            group_by_cols).sum().reset_index()
        return standardized_race

    def standardize_race_include_hispanic(self, df):
        """Alternative format where race categories include Hispanic/Latino.
           Totals are also included because summing over the column will give a
           larger number than the actual total."""
        by_hispanic = df.copy()
        group_by_cols = self.base_group_by_cols.copy()
        group_by_cols.append(HISPANIC_COL)
        by_hispanic = by_hispanic.groupby(group_by_cols).sum().reset_index()
        by_hispanic[RACE_CATEGORY_ID_COL] = by_hispanic.apply(
            lambda r: (Race.HISP.value
                       if r[HISPANIC_COL] == 'Hispanic or Latino'
                       else Race.NH.value),
            axis=1)
        by_hispanic.drop(HISPANIC_COL, axis=1, inplace=True)

        by_race = df.copy()
        group_by_cols = self.base_group_by_cols.copy()
        group_by_cols.append(RACE_COL)
        by_race = by_race.groupby(group_by_cols).sum().reset_index()
        by_race[RACE_CATEGORY_ID_COL] = by_race.apply(
            lambda r: RACE_STRING_TO_CATEGORY_ID_INCLUDE_HISP[r[RACE_COL]],
            axis=1)

        return pd.concat([by_hispanic, by_race])

    def get_all_races_frame(self, race_and_hispanic_frame):
        """Includes all race categories, both including and not including
           Hispanic/Latino."""
        all_races = self.standardize_race_include_hispanic(
            race_and_hispanic_frame)
        standardized_race = self.standardize_race_exclude_hispanic(
            race_and_hispanic_frame)
        standardized_race = standardized_race.copy()
        # both variants of standardized race include a "Hispanic or Latino"
        # group, so remove from one before concatenating.
        standardized_race = standardized_race[
            standardized_race[RACE_CATEGORY_ID_COL] != Race.HISP.value]
        all_races = pd.concat([all_races, standardized_race])

        # Drop extra columns before adding derived rows so they don't interfere
        # with grouping.
        all_races.drop(RACE_COL, axis=1, inplace=True)

        # Add derived rows.
        all_races = add_sum_of_rows(
            all_races, RACE_CATEGORY_ID_COL, POPULATION_COL, Race.TOTAL.value,
            list(RACE_STRING_TO_CATEGORY_ID_INCLUDE_HISP.values()))
        all_races = add_sum_of_rows(
            all_races, RACE_CATEGORY_ID_COL, POPULATION_COL,
            Race.MULTI_OR_OTHER_STANDARD_NH.value,
            [Race.MULTI_NH.value, Race.OTHER_STANDARD_NH.value])
        all_races = add_sum_of_rows(
            all_races, RACE_CATEGORY_ID_COL, POPULATION_COL,
            Race.MULTI_OR_OTHER_STANDARD.value,
            [Race.MULTI.value, Race.OTHER_STANDARD.value])

        all_races = generate_pct_share_col(
            all_races, POPULATION_COL, POPULATION_PCT_COL,
            RACE_CATEGORY_ID_COL, Race.TOTAL.value)

        add_race_columns_from_category_id(all_races)
        return self.sort_race_frame(all_races)

    def get_sex_by_age_and_race(self, var_map, sex_by_age_frames):
        """Returns a DataFrame of population by sex and age and race.

           var_map: ACS metadata variable map, as returned by
                    `parse_acs_metadata`
           sex_by_age_frames: Map of concept to non-standardized DataFrame for
                              that concept."""
        frames = []
        for concept, race in SEX_BY_AGE_CONCEPTS_TO_RACE.items():
            frame = sex_by_age_frames[concept]
            group_vars = get_vars_for_group(concept, var_map, 2)
            sex_by_age = standardize_frame(frame, group_vars,
                                           [SEX_COL, AGE_COL],
                                           self.county_level, POPULATION_COL)

            sex_by_age[RACE_CATEGORY_ID_COL] = race
            frames.append(sex_by_age)
        result = pd.concat(frames)
        result[AGE_COL] = result[AGE_COL].apply(rename_age_bracket)

        result = add_sum_of_rows(result, AGE_COL, POPULATION_COL, TOTAL_VALUE)
        result = add_sum_of_rows(result, SEX_COL, POPULATION_COL, TOTAL_VALUE)

        add_race_columns_from_category_id(result)
        return self.sort_sex_age_race_frame(result)

    def get_by_sex_age(self, by_sex_age_race_frame, age_aggregator_func):
        by_sex_age = by_sex_age_race_frame.loc[by_sex_age_race_frame[RACE_CATEGORY_ID_COL] == Race.TOTAL.value]

        cols = [
            STATE_FIPS_COL,
            self.get_fips_col(),
            self.get_geo_name_col(),
            SEX_COL,
            AGE_COL,
            POPULATION_COL,
        ]

        by_sex_age = by_sex_age[cols] if self.county_level else by_sex_age[cols[1:]]
        by_sex_age[AGE_COL] = by_sex_age[AGE_COL].apply(age_aggregator_func)

        groupby_cols = cols[:-1] if self.county_level else cols[1: -1]
        by_sex_age = by_sex_age.groupby(groupby_cols)[POPULATION_COL].sum().reset_index()

        return by_sex_age

    def get_by_age(self, by_sex_age, by_sex_age_uhc=None):
        by_age = by_sex_age.loc[by_sex_age[SEX_COL] == TOTAL_VALUE]

        cols = [
            STATE_FIPS_COL,
            self.get_fips_col(),
            self.get_geo_name_col(),
            AGE_COL,
            POPULATION_COL,
        ]

        by_age = by_age[cols] if self.county_level else by_age[cols[1:]]

        if not self.county_level:
            by_age_uhc = by_sex_age_uhc.loc[by_sex_age_uhc[SEX_COL] == TOTAL_VALUE]
            by_age_uhc = by_age_uhc[cols[1:]]

            by_age = pd.concat([by_age, by_age_uhc]).drop_duplicates().reset_index(drop=True)

        by_age = generate_pct_share_col(
            by_age, POPULATION_COL, POPULATION_PCT_COL, AGE_COL, TOTAL_VALUE)

        by_age = by_age.sort_values(by=cols[1:-1]).reset_index(drop=True)
        return by_age

    def get_by_sex(self, by_sex_age_race_frame):
        by_sex = by_sex_age_race_frame.loc[
                (by_sex_age_race_frame[RACE_CATEGORY_ID_COL] == Race.TOTAL.value) &
                (by_sex_age_race_frame[AGE_COL] == TOTAL_VALUE)]

        cols = [
            STATE_FIPS_COL,
            self.get_fips_col(),
            self.get_geo_name_col(),
            SEX_COL,
            POPULATION_COL,
        ]

        by_sex = by_sex[cols] if self.county_level else by_sex[cols[1:]]

        by_sex = generate_pct_share_col(
            by_sex, POPULATION_COL, POPULATION_PCT_COL, SEX_COL, TOTAL_VALUE)

        by_sex = by_sex.sort_values(by=cols[1:-1]).reset_index(drop=True)
        return by_sex


class ACSPopulation(DataSource):

    @staticmethod
    def get_table_name():
        # Writes multiple tables, so this is not applicable.
        pass

    @staticmethod
    def get_id():
        """Returns the data source's unique id. """
        return 'ACS_POPULATION'

    def upload_to_gcs(self, gcs_bucket, **attrs):
        file_diff = False
        for ingester in self._create_ingesters():
            next_file_diff = ingester.upload_to_gcs(gcs_bucket)
            file_diff = file_diff or next_file_diff
        return file_diff

    def write_to_bq(self, dataset, gcs_bucket, **attrs):
        for ingester in self._create_ingesters():
            ingester.write_to_bq(dataset, gcs_bucket)

    def _create_ingesters(self):
        return [
            ACSPopulationIngester(False, BASE_ACS_URL),
            ACSPopulationIngester(True, BASE_ACS_URL)
        ]
