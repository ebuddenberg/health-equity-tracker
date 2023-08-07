import { type DataSourceMetadata } from '../utils/DatasetTypes'

export const GEOGRAPHIES_DATASET_ID = 'geographies'

// ALERT!!! Keep this file in sync with DatasetMetadata while it is present
// All dataset IDs should be in the DatasetMetadata

export const dataSourceMetadataList: DataSourceMetadata[] = [
  {
    id: 'cdc_restricted',
    data_source_name: 'CDC Case Surveillance Restricted Access Detailed Data',
    data_source_pretty_site_name: 'data.cdc.gov',
    data_source_link:
      'https://data.cdc.gov/Case-Surveillance/COVID-19-Case-Surveillance-Restricted-Access-Detai/mbd7-r32t',
    geographic_level: 'National, State, County',
    time_period_range: 'January 2020 - Current',
    demographic_granularity: 'Race/ethnicity, age, sex',
    update_frequency: 'Monthly',
    description:
      'The numbers of confirmed COVID-19 deaths, cases, and hospitalizations nationally and at the state and county levels. The data source is Centers for Disease Control and Prevention, COVID-19 Response. COVID-19 Case Surveillance Data Access, Summary, and Limitations. The last case data included is two (2) weeks before they most recent release from the CDC. The CDC does not take responsibility for the scientific validity or accuracy of methodology, results, statistical analyses, or conclusions presented. We only present the data as rates that are calculated with the American Community Survey (ACS) 2019 5-year estimates, to view the raw data you must apply for access on the CDC website linked above.',
    dataset_ids: [
      'cdc_restricted_data-by_race_national_processed-with_age_adjust',
      'cdc_restricted_data-by_race_county_processed',
      'cdc_restricted_data-by_race_state_processed-with_age_adjust',
      'cdc_restricted_data-by_age_national_processed',
      'cdc_restricted_data-by_age_county_processed',
      'cdc_restricted_data-by_age_state_processed',
      'cdc_restricted_data-by_sex_national_processed',
      'cdc_restricted_data-by_sex_county_processed',
      'cdc_restricted_data-by_sex_state_processed',
      'cdc_restricted_data-by_race_national_processed_time_series',
      'cdc_restricted_data-by_race_county_processed_time_series',
      'cdc_restricted_data-by_race_state_processed_time_series',
      'cdc_restricted_data-by_age_national_processed_time_series',
      'cdc_restricted_data-by_age_county_processed_time_series',
      'cdc_restricted_data-by_age_state_processed_time_series',
      'cdc_restricted_data-by_sex_national_processed_time_series',
      'cdc_restricted_data-by_sex_county_processed_time_series',
      'cdc_restricted_data-by_sex_state_processed_time_series',
    ],
    downloadable: true,
  },
  {
    id: 'acs',
    data_source_name: 'American Community Survey (ACS) 5-year estimates',
    data_source_pretty_site_name: 'census.gov',
    data_source_link:
      'https://www.census.gov/data/developers/data-sets/acs-5year.html',
    geographic_level: 'National, State, County',
    demographic_granularity: 'Race/ethnicity, age, sex',
    update_frequency: 'Annual',
    description:
      'Yearly population percentages, health insurance rates, and poverty rates at the national, state and county levels.',
    dataset_ids: [
      'acs_population-by_race_county',
      'acs_population-by_race_state',
      'acs_population-by_race_national',
      'acs_population-by_age_county',
      'acs_population-by_age_state',
      'acs_population-by_age_national',
      'acs_population-by_sex_county',
      'acs_population-by_sex_state',
      'acs_population-by_sex_national',
      'acs_condition-by_race_county_time_series',
      'acs_condition-by_race_state_time_series',
      'acs_condition-by_race_national_time_series',
      'acs_condition-by_age_county_time_series',
      'acs_condition-by_age_state_time_series',
      'acs_condition-by_age_national_time_series',
      'acs_condition-by_sex_county_time_series',
      'acs_condition-by_sex_state_time_series',
      'acs_condition-by_sex_national_time_series',
    ],
    downloadable: true,
  },
  {
    id: 'decia_2010_territory_population',
    data_source_name: 'Census 2010 Decennial Island Areas',
    data_source_pretty_site_name: 'census.gov',
    data_source_link:
      'https://www.census.gov/data/datasets/2010/dec/virgin-islands.html',
    geographic_level: 'Territory',
    demographic_granularity: 'Race/ethnicity, age, sex',
    update_frequency: 'None',
    description:
      'Population totals and percent shares for 2010 at the territory level for U.S. Virgin Islands, Guam, American Samoa, and the Northern Mariana Islands, which are not available in the Census 5 year American Community Survey (ACS) estimates.',
    dataset_ids: [
      'decia_2010_territory_population-by_race_and_ethnicity_territory_state_level',
      'decia_2010_territory_population-by_sex_territory_state_level',
      'decia_2010_territory_population-by_age_territory_state_level',
    ],
    downloadable: true,
  },
  {
    id: 'decia_2020_territory_population',
    data_source_name: 'Census 2020 Decennial Island Areas',
    data_source_pretty_site_name: 'census.gov',
    data_source_link:
      'https://www.census.gov/data/datasets/2020/dec/virgin-islands.html',
    geographic_level: 'Territory/County-Equivalent',
    demographic_granularity: 'Race/ethnicity, age, sex',
    update_frequency: 'None',
    description:
      'Population totals and percent shares for 2020 at the territory and county-equivalent level for U.S. Virgin Islands, Guam, American Samoa, and the Northern Mariana Islands, which are not available in the 5 year American Community Survey (ACS) estimates.',
    dataset_ids: [
      'decia_2020_territory_population-by_race_and_ethnicity_territory_state_level',
      'decia_2020_territory_population-by_sex_territory_state_level',
      'decia_2020_territory_population-by_age_territory_state_level',
      'decia_2020_territory_population-by_race_and_ethnicity_territory_county_level',
      'decia_2020_territory_population-by_sex_territory_county_level',
      'decia_2020_territory_population-by_age_territory_county_level',
    ],
    downloadable: true,
  },
  {
    id: 'census_pop_estimates',
    data_source_name: 'County Population by Characteristics: 2010-2019',
    data_source_pretty_site_name: 'census.gov',
    data_source_link:
      'https://www.census.gov/data/tables/time-series/demo/popest/2010s-counties-detail.html',
    geographic_level: 'State/County',
    demographic_granularity: 'Race/ethnicity, age, sex',
    update_frequency: 'None',
    description:
      'Population percentage estimates by race/ethnicity, age, and sex to the ' +
      'county level provided by the U.S Census Bureau. We use the single year ' +
      'estimates from 2019.',
    dataset_ids: ['census_pop_estimates-race_and_ethnicity'],
    downloadable: true,
  },
  {
    id: 'cdc_svi_county',
    data_source_name: 'CDC SVI County Rankings',
    data_source_pretty_site_name: 'atsdr.cdc.gov',
    data_source_link:
      'https://www.atsdr.cdc.gov/placeandhealth/svi/documentation/SVI_documentation_2018.html',
    geographic_level: 'County',
    demographic_granularity: 'None',
    update_frequency: 'Biannual',
    description:
      'Every community must prepare for and respond to hazardous events, whether a natural disaster like a tornado or a disease outbreak, or an anthropogenic event such as a harmful chemical spill. The degree to which a community exhibits certain social conditions, including high poverty, low percentage of vehicle access, or crowded households, may affect that community’s ability to prevent human suffering and financial loss in the event of disaster. These factors describe a community’s social vulnerability.',
    dataset_ids: ['cdc_svi_county-age'],
    downloadable: true,
  },
  {
    id: 'cdc_vaccination_county',
    data_source_name: 'CDC COVID-19 Vaccinations in the United States, County',
    data_source_pretty_site_name: 'data.cdc.gov',
    data_source_link:
      'https://data.cdc.gov/Vaccinations/COVID-19-Vaccinations-in-the-United-States-County/8xkx-amqh',
    geographic_level: 'County',
    demographic_granularity: 'None',
    update_frequency: 'Daily',
    description:
      'Overall US COVID-19 Vaccine administration and vaccine equity data at county level ' +
      'Data represents all vaccine partners including jurisdictional partner clinics, ' +
      'retail pharmacies, long-term care facilities, dialysis centers, ' +
      'Federal Emergency Management Agency and Health Resources and Services ' +
      'Administration partner sites, and federal entity facilities.',
    dataset_ids: ['cdc_vaccination_county-race_and_ethnicity_processed'],
    downloadable: true,
  },
  {
    id: 'cdc_vaccination_national',
    data_source_name:
      'CDC COVID-19 Vaccination Demographics in the United States, National',
    data_source_pretty_site_name: 'data.cdc.gov',
    data_source_link:
      'https://data.cdc.gov/Vaccinations/COVID-19-Vaccination-Demographics-in-the-United-St/km4m-vcsb',
    geographic_level: 'National',
    demographic_granularity: 'Race/ethnicity, age, sex',
    update_frequency: 'Daily',
    description:
      'Overall Demographic Characteristics of People Receiving COVID-19 Vaccinations ' +
      'in the United States at national level. Data represents all vaccine partners ' +
      'including jurisdictional partner clinics, retail pharmacies, long-term care facilities, ' +
      'dialysis centers, Federal Emergency Management Agency and Health Resources and Services ' +
      'Administration partner sites, and federal entity facilities. (CDC 2021)',
    dataset_ids: [
      'cdc_vaccination_national-age_processed',
      'cdc_vaccination_national-race_processed',
      'cdc_vaccination_national-sex_processed',
    ],
    downloadable: true,
  },
  {
    id: 'cdc_atlas',
    data_source_name: 'CDC NCHHSTP AtlasPlus',
    data_source_pretty_site_name: 'cdc.gov',
    data_source_link: 'https://www.cdc.gov/nchhstp/atlas/index.htm',
    geographic_level: 'National, State, County',
    demographic_granularity: 'Race/ethnicity, age, sex',
    update_frequency: 'Yearly',
    description:
      'The Centers for Disease Control and Prevention (CDC) is a primary source of HIV data in the United States, gathering and sharing essential information on HIV diagnoses, deaths, prevalence, linkage to HIV care, and PrEP coverage. Their annual surveillance report comprehensively summarizes diagnosed HIV cases nationwide and its dependent areas. This crucial data enables public health partners, government agencies, nonprofits, academia, and the public to effectively target prevention strategies, allocate resources, develop policies, and track HIV trends, ensuring a well-informed and coordinated response to the epidemic.',
    dataset_ids: [
      'cdc_hiv_data-age_county_time_series',
      'cdc_hiv_data-age_national_time_series',
      'cdc_hiv_data-age_state_time_series',
      'cdc_hiv_data-sex_county_time_series',
      'cdc_hiv_data-sex_national_time_series',
      'cdc_hiv_data-sex_state_time_series',
      'cdc_hiv_data-race_and_ethnicity_county_time_series',
      'cdc_hiv_data-race_and_ethnicity_national_time_series',
      'cdc_hiv_data-race_and_ethnicity_state_time_series',
      'cdc_hiv_data-race_and_ethnicity_national_time_series-with_age_adjust',
      'cdc_hiv_data-race_and_ethnicity_state_time_series-with_age_adjust',
    ],
    downloadable: true,
  },
  {
    id: 'kff_vaccination',
    data_source_name: 'Kaiser Family Foundation COVID-19 Indicators',
    data_source_pretty_site_name: 'kff.org',
    data_source_link: 'https://www.kff.org/state-category/covid-19/',
    geographic_level: 'State',
    demographic_granularity: 'Race/ethnicity',
    update_frequency: 'Biweekly',
    description:
      'State level vaccination information based off of Kaiser Family Foundation ' +
      'analysis of publicly available data from state websites. Per 100k metrics are found on ' +
      "'COVID-19 Vaccinations by Race/Ethnicity', percent share metrics are found on " +
      "'Percent of Total Population that has Received a COVID-19 Vaccine by Race/Ethnicity' " +
      "and the All metric is found on 'COVID-19 Vaccines Delivered and Administered'",
    dataset_ids: ['kff_vaccination-race_and_ethnicity_processed'],
    downloadable: true,
  },
  {
    id: 'ahr',
    data_source_name: "America's Health Rankings",
    data_source_pretty_site_name: 'americashealthrankings.org',
    data_source_link:
      'https://www.americashealthrankings.org/explore/annual/measure/Overall_a/state/ALL',
    geographic_level: 'National, State',
    demographic_granularity: 'Race/ethnicity, age, sex',
    update_frequency: 'Annual',
    description:
      'The prevalence of multiple conditions at the state level, including chronic diseases (COPD, diabetes, chronic kidney disease, cardiovascular diseases), behavioral health indicators (suicide, depression, frequent mental distress, excessive drinking, opioid and other substance misuse), and other social determinants of health (care avoidance due to cost, preventable hospitalizations).',
    dataset_ids: [
      'ahr_data-age_national',
      'ahr_data-race_and_ethnicity_national',
      'ahr_data-sex_national',
      'ahr_data-age_state',
      'ahr_data-race_and_ethnicity_state',
      'ahr_data-sex_state',
    ],
    downloadable: true,
  },
  {
    id: 'bjs',
    data_source_name: 'Bureau of Justice Statistics (BJS)',
    data_source_pretty_site_name: 'bjs.ojp.gov',
    data_source_link: 'https://bjs.ojp.gov',
    geographic_level: 'National, State',
    demographic_granularity: 'Race/ethnicity, age, sex',
    update_frequency: 'Annually',
    description:
      'Rates of individuals, including children, who are confined in a local adult jail facility, or under the jurisdiction of a federal, state, or territory adult prison facility.',
    dataset_ids: [
      'bjs_incarceration_data-race_and_ethnicity_national',
      'bjs_incarceration_data-race_and_ethnicity_state',
      'bjs_incarceration_data-age_national',
      'bjs_incarceration_data-age_state',
      'bjs_incarceration_data-sex_national',
      'bjs_incarceration_data-sex_state',
    ],
    downloadable: true,
  },
  {
    id: 'vera',
    data_source_name: 'Vera Institute of Justice',
    data_source_pretty_site_name: 'vera.org',
    data_source_link: 'https://www.vera.org/projects/incarceration-trends',
    geographic_level: 'County',
    demographic_granularity: 'Race/ethnicity, sex',
    update_frequency: 'None',
    description:
      'Rates of individuals, including children, who are confined in local adult jail facilities, or under the jurisdiction of a state prison system on charges arising from a criminal case in a specific county.',
    dataset_ids: [
      'vera_incarceration_county-by_sex_county_time_series',
      'vera_incarceration_county-by_race_and_ethnicity_county_time_series',
      'vera_incarceration_county-by_age_county_time_series',
    ],
    downloadable: true,
  },
  {
    id: 'cawp',
    data_source_name: 'Center for American Women in Politics (CAWP)',
    data_source_pretty_site_name: 'cawpdata.rutgers.edu',
    data_source_link: 'https://cawpdata.rutgers.edu/',
    geographic_level: 'National, State',
    time_period_range:
      'U.S. Congress: 1915 - Current, State Legislatures: 1983 - Current',
    demographic_granularity: 'Race/ethnicity',
    update_frequency: 'Monthly',
    description:
      'Detailed information on women legislators, by race/ethnicity, in the US Congress and state legislatures, and historical counts of total state legislators of any gender by year by state. A separate table is also available containing legislator names and positions.',
    dataset_ids: [
      'cawp_time_data-race_and_ethnicity_national_time_series',
      'cawp_time_data-race_and_ethnicity_state_time_series',
      'cawp_time_data-race_and_ethnicity_state_time_series_names',
    ],
    downloadable: true,
  },
  {
    id: 'the_unitedstates_project',
    data_source_name: 'The @unitedstates Project',
    data_source_pretty_site_name: 'theunitedstates.io',
    data_source_link: 'https://github.com/unitedstates/congress-legislators',
    geographic_level: 'National, State',
    demographic_granularity: 'N/A',
    update_frequency: 'At least monthly',
    description:
      'Total members of the United States Congress (Senate and House of Representatives including Delegates) both nationally and by state/territory. This dataset is viewable and downloadable in the CAWP datasets.',
    dataset_ids: ['the_unitedstates_project'],
    downloadable: false,
  },
  // {
  //   id: 'phrma',
  //   data_source_name: 'Medicare Administrative Data',
  //   data_source_pretty_site_name: 'cms.gov',
  //   data_source_link:
  //     'https://www.cms.gov/research-statistics-data-and-systems/cms-information-technology/accesstodataapplication',
  //   geographic_level: 'National, State, County',
  //   demographic_granularity:
  //     'Race/ethnicity, sex, age, low-income subsidy (LIS), Medicare eligibility',
  //   update_frequency: 'None',
  //   description:
  //     'Disease rates and medication adherence amongst Medicare fee-for-service beneficiaries 18 years and older, for multiple HIV and cardiovascular conditions.',
  //   dataset_ids: [
  //     'phrma_data-race_and_ethnicity_national',
  //     'phrma_data-race_and_ethnicity_state',
  //     'phrma_data-race_and_ethnicity_county',
  //     'phrma_data-age_national',
  //     'phrma_data-age_state',
  //     'phrma_data-age_county',
  //     'phrma_data-sex_national',
  //     'phrma_data-sex_state',
  //     'phrma_data-sex_county',
  //     'phrma_data-lis_national',
  //     'phrma_data-lis_state',
  //     'phrma_data-lis_county',
  //     'phrma_data-eligibility_national',
  //     'phrma_data-eligibility_state',
  //     'phrma_data-eligibility_county',
  //   ],
  //   downloadable: true,
  // },
  {
    id: 'covid_tracking_project',
    data_source_name: 'Covid Tracking Project’s Racial Data Tracker',
    data_source_pretty_site_name: 'covidtracking.com',
    data_source_link: 'https://covidtracking.com/race',
    geographic_level: 'State',
    demographic_granularity: 'Race/ethnicity',
    update_frequency: 'Final update was March 7 2021',
    description:
      'The numbers of confirmed COVID-19 deaths, cases, hospitalizations, and tests at the state level. ' +
      'Please note that Covid Tracking Project data is not used for any visualizations on the tracker, ' +
      'it is only available for download.',
    dataset_ids: [
      'covid_tracking_project-cases_by_race_state',
      'covid_tracking_project-deaths_by_race_state',
      'covid_tracking_project-hospitalizations_by_race_state',
      'covid_tracking_project-tests_by_race_state',
    ],
    downloadable: true,
  },
]

// SHOW_PHRMA
// console.log('need to uncomment above once feature flag removed')

export const DataSourceMetadataMap: Record<string, DataSourceMetadata> =
  Object.fromEntries(dataSourceMetadataList.map((m) => [m.id, m]))
