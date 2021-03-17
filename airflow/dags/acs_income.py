# Ignore the Airflow module, it is installed in both dev and prod
from airflow import DAG  # type: ignore
from airflow.utils.dates import days_ago  # type: ignore

import util

_ACS_BASE_URL = 'https://api.census.gov/data/2019/acs/acs5'
_ACS_WORKFLOW_ID = 'ACS_INCOME'
_ACS_DATASET_NAME = 'acs_income'

default_args = {
    'start_date': days_ago(0),
}

data_ingestion_dag = DAG(
    'acs_income_ingestion_dag',
    default_args=default_args,
    schedule_interval='@yearly',
    description='Ingestion configuration for ACS Health Insurance')

acs_income_gcs_task_id = 'acs_income_to_gcs'
acs_income_gcs_payload = util.generate_gcs_payload(
    _ACS_WORKFLOW_ID, url=_ACS_BASE_URL)
acs_income_gcs_operator = util.create_gcs_ingest_operator(
    acs_income_gcs_task_id, acs_income_gcs_payload, data_ingestion_dag)

acs_income_gcs_short_op = util.create_gcs_short_circuit_operator(
    'did_acs_income_files_download', acs_income_gcs_task_id, data_ingestion_dag)

acs_income_bq_payload = util.generate_bq_payload(
    _ACS_WORKFLOW_ID, _ACS_DATASET_NAME, url=_ACS_BASE_URL)
acs_income_bq_operator = util.create_bq_ingest_operator(
    'acs_income_to_bq', acs_income_bq_payload, data_ingestion_dag)

acs_income_aggregator_payload = {'dataset_name': _ACS_DATASET_NAME}
acs_income_aggregator_operator = util.create_aggregator_operator(
    'acs_income_aggregator', acs_income_aggregator_payload, data_ingestion_dag)

acs_income_exporter_payload = {'dataset_name': _ACS_DATASET_NAME}
acs_income_exporter_operator = util.create_exporter_operator(
    'acs_income_exporter', acs_income_exporter_payload, data_ingestion_dag)

# Ingestion DAG
(acs_income_gcs_operator >> acs_income_gcs_short_op >>
 acs_income_bq_operator >> acs_income_aggregator_operator >> acs_income_exporter_operator)
