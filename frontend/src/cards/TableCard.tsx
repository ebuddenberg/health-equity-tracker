import React from "react";
import { TableChart } from "../charts/TableChart";
import CardWrapper from "./CardWrapper";
import { MetricQuery } from "../data/query/MetricQuery";
import { Fips } from "../data/utils/Fips";
import {
  Breakdowns,
  BreakdownVar,
  BREAKDOWN_VAR_DISPLAY_NAMES,
} from "../data/query/Breakdowns";
import { CardContent } from "@material-ui/core";
import {
  MetricConfig,
  MetricId,
  VariableConfig,
} from "../data/config/MetricConfig";
import { exclude } from "../data/query/BreakdownFilter";
import { NON_HISPANIC } from "../data/utils/Constants";
import MissingDataAlert from "./ui/MissingDataAlert";

export interface TableCardProps {
  fips: Fips;
  breakdownVar: BreakdownVar;
  metrics: MetricConfig[];
  variableConfig: VariableConfig;
}

export function TableCard(props: TableCardProps) {
  const breakdowns = Breakdowns.forFips(props.fips).addBreakdown(
    props.breakdownVar,
    props.breakdownVar === "race_and_ethnicity"
      ? exclude(NON_HISPANIC)
      : undefined
  );
  let metricConfigs: Record<string, MetricConfig> = {};
  props.metrics.forEach((metricConfig) => {
    // We prefer to show the known breakdown metric over the vanilla metric, if
    // it is available.
    if (metricConfig.knownBreakdownComparisonMetric) {
      metricConfigs[metricConfig.knownBreakdownComparisonMetric.metricId] =
        metricConfig.knownBreakdownComparisonMetric;
    } else {
      metricConfigs[metricConfig.metricId] = metricConfig;
    }

    if (metricConfig.populationComparisonMetric) {
      metricConfigs[metricConfig.populationComparisonMetric.metricId] =
        metricConfig.populationComparisonMetric;
    }
  });
  const metricIds = Object.keys(metricConfigs);
  const query = new MetricQuery(metricIds as MetricId[], breakdowns);

  return (
    <CardWrapper
      queries={[query]}
      title={
        <>{`${props.variableConfig.variableFullDisplayName} by ${
          BREAKDOWN_VAR_DISPLAY_NAMES[props.breakdownVar]
        } in ${props.fips.getFullDisplayName()}`}</>
      }
    >
      {([queryResponse]) => {
        return (
          <>
            {queryResponse.shouldShowMissingDataMessage(metricIds) && (
              <CardContent>
                <MissingDataAlert
                  dataName={props.variableConfig.variableFullDisplayName + " "}
                  breakdownString={
                    BREAKDOWN_VAR_DISPLAY_NAMES[props.breakdownVar]
                  }
                />
              </CardContent>
            )}
            {!queryResponse.dataIsMissing() && (
              <TableChart
                data={queryResponse.data}
                breakdownVar={props.breakdownVar}
                metrics={Object.values(metricConfigs)}
              />
            )}
          </>
        );
      }}
    </CardWrapper>
  );
}
