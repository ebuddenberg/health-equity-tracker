import { DatasetMetadata } from "../utils/DatasetTypes";
import { DataSourceMetadataMap, GEOGRAPHIES_DATASET_ID } from "./MetadataMap";

const datasetMetadataList: DatasetMetadata[] = [
  {
    id: "acs_population-by_race_county_std",
    name: "Population by Race and County",
    update_time: "2019",
  },
  {
    id: "acs_population-by_race_state_std",
    name: "Population by Race and State",
    update_time: "2019",
  },
  {
    id: "acs_population-by_race_national",
    name: "Population by Race Nationally",
    update_time: "2019",
  },
  {
    id: "acs_population-by_age_county",
    name: "Population by Age and County",
    update_time: "2019",
  },
  {
    id: "acs_population-by_age_state",
    name: "Population by Age and State",
    update_time: "2019",
  },
  {
    id: "acs_population-by_age_national",
    name: "Population by Age Nationally",
    update_time: "2019",
  },
  {
    id: "acs_population-by_sex_county",
    name: "Population by Sex and County",
    update_time: "2019",
  },
  {
    id: "acs_population-by_sex_state",
    name: "Population by Sex and State",
    update_time: "2019",
  },
  {
    id: "acs_population-by_sex_national",
    name: "Population by Sex Nationally",
    update_time: "2019",
  },
  {
    id: "acs_2010_population-by_race_and_ethnicity_territory",
    name: "Population by Race and Territory",
    update_time: "2010",
  },
  {
    id: "acs_2010_population-by_sex_territory",
    name: "Population by Sex and Territory",
    update_time: "2010",
  },
  {
    id: "acs_2010_population-by_age_territory",
    name: "Population by Age and Territory",
    update_time: "2010",
  },
  {
    id: "covid_tracking_project-cases_by_race_state",
    name: "COVID-19 Cases by Race and State",
    update_time: "April 2021",
  },
  {
    id: "covid_tracking_project-deaths_by_race_state",
    name: "COVID-19 Deaths by Race and State",
    update_time: "April 2021",
  },
  {
    id: "covid_tracking_project-hospitalizations_by_race_state",
    name: "COVID-19 Hospitalizations by Race and State",
    update_time: "April 2021",
  },
  {
    id: "covid_tracking_project-tests_by_race_state",
    name: "COVID-19 Tests by Race and State",
    update_time: "April 2021",
  },
  {
    id: "acs_health_insurance-health_insurance_by_sex_age_county",
    name: "Health Insurance by Sex, Age and County",
    update_time: "2019",
  },
  {
    id: "acs_health_insurance-health_insurance_by_sex_age_state",
    name: "Health Insurance by Sex, Age and State",
    update_time: "2019",
  },
  {
    id: "acs_health_insurance-health_insurance_by_race_age_state",
    name: "Health Insurance by Race, Age and State",
    update_time: "2019",
  },
  {
    id: "acs_health_insurance-health_insurance_by_race_age_county",
    name: "Health Insurance by Race, Age and County",
    update_time: "2019",
  },
  {
    id: "acs_poverty_dataset-poverty_by_race_state",
    name: "Poverty by Race and State",
    update_time: "2019",
  },
  {
    id: "acs_poverty_dataset-poverty_by_race_county",
    name: "Poverty by Race and County",
    update_time: "2019",
  },
  {
    id: "acs_poverty_dataset-poverty_by_sex_state",
    name: "Poverty by Sex and State",
    update_time: "2019",
  },
  {
    id: "acs_poverty_dataset-poverty_by_sex_county",
    name: "Poverty by Sex and County",
    update_time: "2019",
  },
  {
    id: "acs_poverty_dataset-poverty_by_age_state",
    name: "Poverty by Age and State",
    update_time: "2019",
  },
  {
    id: "acs_poverty_dataset-poverty_by_age_county",
    name: "Poverty by Age and County",
    update_time: "2019",
  },
  {
    id: "cdc_restricted_data-by_race_county",
    name: "COVID-19 Deaths, Cases, and Hospitalizations by Race and County",
    update_time: "May 2022",
  },
  {
    id: "cdc_restricted_data-by_race_state-with_age_adjust",
    name: "COVID-19 Deaths, Cases, and Hospitalizations by Race and State",
    update_time: "May 2022",
  },
  {
    id: "cdc_restricted_data-by_age_county",
    name: "COVID-19 Deaths, Cases, and Hospitalizations by Age and County",
    update_time: "May 2022",
  },
  {
    id: "cdc_restricted_data-by_age_state",
    name: "COVID-19 Deaths, Cases, and Hospitalizations by Age and State",
    update_time: "May 2022",
  },
  {
    id: "cdc_restricted_data-by_sex_county",
    name: "COVID-19 Deaths, Cases, and Hospitalizations by Sex and County",
    update_time: "May 2022",
  },
  {
    id: "cdc_restricted_data-by_sex_state",
    name: "COVID-19 Deaths, Cases, and Hospitalizations by Sex and State",
    update_time: "May 2022",
  },
  {
    id: "cdc_vaccination_county-race_and_ethnicity",
    name: "COVID-19 Vaccinations by County",
    update_time: "May 2022",
  },
  {
    id: "cdc_vaccination_national-age",
    name: "COVID-19 Vaccination Demographics by Age",
    update_time: "May 2022",
  },
  {
    id: "cdc_vaccination_national-sex",
    name: "COVID-19 Vaccination Demographics by Sex",
    update_time: "May 2022",
  },
  {
    id: "cdc_vaccination_national-race_and_ethnicity",
    name: "COVID-19 Vaccination Demographics by Race",
    update_time: "May 2022",
  },
  {
    id: "kff_vaccination-race_and_ethnicity",
    name: "COVID-19 Indicators",
    update_time: "May 2022",
  },
  {
    id: "uhc_data-age",
    name: "Prevalence of multiple chronic disease, behavioral health, and social determinants of health by Age and State",
    update_time: "2021",
  },
  {
    id: "uhc_data-race_and_ethnicity",
    name: "Prevalence of multiple chronic disease, behavioral health, and social determinants of health by Race and State",
    update_time: "2021",
  },
  {
    id: "uhc_data-sex",
    name: "Prevalence of multiple chronic disease, behavioral health, and social determinants of health by Sex and State",
    update_time: "2021",
  },
  {
    id: "cawp_data-race_and_ethnicity_national",
    name: "National representation of women by race/ethnicity in the US Congress and across state and territory legislatures",
    update_time: "2022",
  },
  {
    id: "cawp_data-race_and_ethnicity_state",
    name: "Representation of women by race/ethnicity from each state and territory to the US Congress and their respective state legislature",
    update_time: "2022",
  },
  {
    id: "propublica_congress",
    name: "The ProPublica Congress API provides near real-time access to legislative data from the House of Representatives, the Senate and the Library of Congress. It includes details about members, votes, bills and other aspects of congressional activity.",
    update_time: "2022",
  },
  {
    id: GEOGRAPHIES_DATASET_ID,
    name: "U.S. Geographic Data",
    update_time: "2020",
  },
  {
    id: "census_pop_estimates-race_and_ethnicity",
    name: "Census County Population by Characteristics: 2010-2019",
    update_time: "2019",
  },
];

export const DatasetMetadataMap: Record<string, DatasetMetadata> =
  Object.fromEntries(
    datasetMetadataList.map((m) => {
      let metadataWithSource = m;
      const dataSource = Object.values(DataSourceMetadataMap).find((metadata) =>
        metadata.dataset_ids.includes(m.id)
      );
      metadataWithSource.source_id = dataSource ? dataSource.id : "error";
      return [m.id, metadataWithSource];
    })
  );
