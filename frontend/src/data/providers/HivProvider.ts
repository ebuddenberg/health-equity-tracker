import { getDataManager } from '../../utils/globals'
import { type DataTypeId, type MetricId } from '../config/MetricConfig'
import { type Breakdowns } from '../query/Breakdowns'
import { type MetricQuery, MetricQueryResponse } from '../query/MetricQuery'
import { appendFipsIfNeeded } from '../utils/datasetutils'
import VariableProvider from './VariableProvider'

export const DATATYPES_NEEDING_13PLUS: DataTypeId[] = [
  'hiv_care',
  'hiv_deaths',
  'hiv_diagnoses',
  'hiv_prevalence',
  'hiv_deaths_black_women',
  'hiv_diagnoses_black_women',
  'hiv_prevalence_black_women',
]

export const BLACK_WOMEN_METRICS: MetricId[] = [
  'hiv_deaths_black_women_pct_relative_inequity',
  'hiv_deaths_black_women_pct_share',
  'hiv_deaths_black_women_per_100k',
  'hiv_deaths_black_women_ratio_age_adjusted',
  'hiv_diagnoses_black_women_pct_relative_inequity',
  'hiv_diagnoses_black_women_pct_share',
  'hiv_diagnoses_black_women_per_100k',
  'hiv_diagnoses_black_women_ratio_age_adjusted',
  'hiv_prevalence_black_women_pct_relative_inequity',
  'hiv_prevalence_black_women_pct_share',
  'hiv_prevalence_black_women_per_100k',
  'hiv_prevalence_black_women_ratio_age_adjusted',
  'black_women_population_pct',
]

export const CARE_METRICS: MetricId[] = [
  'hiv_care_linkage',
  'hiv_care_pct_relative_inequity',
  'hiv_care_pct_share',
  'hiv_care_population_pct',
  'hiv_care_ratio_age_adjusted',
]

export const DEATHS_METRICS: MetricId[] = [
  'hiv_deaths_pct_relative_inequity',
  'hiv_deaths_pct_share',
  'hiv_deaths_per_100k',
  'hiv_deaths_ratio_age_adjusted',
]

export const DIAGNOSES_METRICS: MetricId[] = [
  'hiv_diagnoses_pct_relative_inequity',
  'hiv_diagnoses_pct_share',
  'hiv_diagnoses_per_100k',
  'hiv_diagnoses_ratio_age_adjusted',
]

export const PREP_METRICS: MetricId[] = [
  'hiv_prep_coverage',
  'hiv_prep_pct_relative_inequity',
  'hiv_prep_pct_share',
  'hiv_prep_population_pct',
  'hiv_prep_ratio_age_adjusted',
]

export const PREVALENCE_METRICS: MetricId[] = [
  'hiv_prevalence_pct_relative_inequity',
  'hiv_prevalence_pct_share',
  'hiv_prevalence_per_100k',
  'hiv_prevalence_ratio_age_adjusted',
]

export const HIV_DETERMINANTS: MetricId[] = [
  ...BLACK_WOMEN_METRICS,
  ...CARE_METRICS,
  ...DEATHS_METRICS,
  ...DIAGNOSES_METRICS,
  ...PREP_METRICS,
  ...PREVALENCE_METRICS,
  'hiv_population_pct', // population shares of 13+
]

class HivProvider extends VariableProvider {
  constructor() {
    super('hiv_provider', HIV_DETERMINANTS)
  }

  getDatasetId(breakdowns: Breakdowns): string {
    if (breakdowns.geography === 'national') {
      if (breakdowns.hasOnlyRace()) {
        return 'cdc_hiv_data-race_and_ethnicity_national_time_series'
      }
      if (breakdowns.hasOnlyAge()) {
        return 'cdc_hiv_data-age_national_time_series'
      }
      if (breakdowns.hasOnlySex()) {
        return 'cdc_hiv_data-sex_national_time_series'
      }
    }
    if (breakdowns.geography === 'state') {
      if (breakdowns.hasOnlyRace()) {
        return 'cdc_hiv_data-race_and_ethnicity_state_time_series'
      }
      if (breakdowns.hasOnlyAge()) return 'cdc_hiv_data-age_state_time_series'
      if (breakdowns.hasOnlySex()) return 'cdc_hiv_data-sex_state_time_series'
    }

    if (breakdowns.geography === 'county') {
      if (breakdowns.hasOnlyRace()) {
        return appendFipsIfNeeded(
          'cdc_hiv_data-race_and_ethnicity_county_time_series',
          breakdowns
        )
      }
      if (breakdowns.hasOnlyAge()) {
        return appendFipsIfNeeded(
          'cdc_hiv_data-age_county_time_series',
          breakdowns
        )
      }
      if (breakdowns.hasOnlySex()) {
        return appendFipsIfNeeded(
          'cdc_hiv_data-sex_county_time_series',
          breakdowns
        )
      }
    }
    throw new Error('Not implemented')
  }

  async getDataInternal(
    metricQuery: MetricQuery
  ): Promise<MetricQueryResponse> {
    const breakdowns = metricQuery.breakdowns
    const timeView = metricQuery.timeView
    const datasetId = this.getDatasetId(breakdowns)
    const hiv = await getDataManager().loadDataset(datasetId)
    let df = hiv.toDataFrame()

    df = this.filterByGeo(df, breakdowns)

    const mostRecentYear = '2019'

    df = this.filterByTimeView(df, timeView, mostRecentYear)
    df = this.renameGeoColumns(df, breakdowns)

    const consumedDatasetIds = [datasetId]

    df = this.applyDemographicBreakdownFilters(df, breakdowns)
    df = this.removeUnrequestedColumns(df, metricQuery)

    return new MetricQueryResponse(df.toArray(), consumedDatasetIds)
  }

  allowsBreakdowns(breakdowns: Breakdowns, metricIds: MetricId[]): boolean {
    const validDemographicBreakdownRequest =
      !breakdowns.time && breakdowns.hasExactlyOneDemographic()

    const noCountyData = [...BLACK_WOMEN_METRICS, ...DEATHS_METRICS]
    const hasNoCountyData = metricIds.some((metricId) =>
      noCountyData.includes(metricId)
    )

    return hasNoCountyData
      ? (breakdowns.geography === 'state' ||
          breakdowns.geography === 'national') &&
          validDemographicBreakdownRequest
      : (breakdowns.geography === 'county' ||
          breakdowns.geography === 'state' ||
          breakdowns.geography === 'national') &&
          validDemographicBreakdownRequest
  }
}

export default HivProvider