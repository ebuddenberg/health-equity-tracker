# TODO: THIS FILE SCHEDULED FOR DELETION ONCE DECIA_2010 IS UP AND RUNNING


# Resources and routines for ACS population ingestion.

# Create a BigQuery dataset for ACS population data.
resource "google_bigquery_dataset" "bq_acs_2010_population" {
  dataset_id = "acs_2010_population"
  location   = "US"
}