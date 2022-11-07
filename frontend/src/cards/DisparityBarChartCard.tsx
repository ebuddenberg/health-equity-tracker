import React from "react";
import Alert from "@material-ui/lab/Alert";
import { DisparityBarChart } from "../charts/disparityBarChart/Index";
import { CardContent } from "@material-ui/core";
import { Fips } from "../data/utils/Fips";
import {
  Breakdowns,
  BreakdownVar,
  BREAKDOWN_VAR_DISPLAY_NAMES_LOWER_CASE,
} from "../data/query/Breakdowns";
import { MetricQuery } from "../data/query/MetricQuery";
import { MetricConfig, VariableConfig } from "../data/config/MetricConfig";
import CardWrapper from "./CardWrapper";
import MissingDataAlert from "./ui/MissingDataAlert";
import { exclude } from "../data/query/BreakdownFilter";
import { NON_HISPANIC, ALL, RACE, HISPANIC } from "../data/utils/Constants";
import UnknownsAlert from "./ui/UnknownsAlert";
import {
  shouldShowAltPopCompare,
  splitIntoKnownsAndUnknowns,
} from "../data/utils/datasetutils";
import { CAWP_DETERMINANTS } from "../data/variables/CawpProvider";
import { useGuessPreloadHeight } from "../utils/hooks/useGuessPreloadHeight";
import { reportProviderSteps } from "../reports/ReportProviderSteps";
import { ScrollableHashId } from "../utils/hooks/useStepObserver";
import { useCreateChartTitle } from "../utils/hooks/useCreateChartTitle";

export interface DisparityBarChartCardProps {
  key?: string;
  breakdownVar: BreakdownVar;
  variableConfig: VariableConfig;
  fips: Fips;
}

// This wrapper ensures the proper key is set to create a new instance when
// required rather than relying on the card caller.
export function DisparityBarChartCard(props: DisparityBarChartCardProps) {
  return (
    <DisparityBarChartCardWithKey
      key={props.variableConfig.variableId + props.breakdownVar}
      {...props}
    />
  );
}

function DisparityBarChartCardWithKey(props: DisparityBarChartCardProps) {
  const preloadHeight = useGuessPreloadHeight(
    [700, 1000],
    props.breakdownVar === "sex"
  );

  const metricConfig = props.variableConfig.metrics["pct_share"];
  const locationName = props.fips.getSentenceDisplayName();

  const breakdowns = Breakdowns.forFips(props.fips).addBreakdown(
    props.breakdownVar,
    exclude(ALL, NON_HISPANIC)
  );

  // Population Comparison Metric is required for the Disparity Bar Chart.
  // If MetricConfig supports known breakdown metric, prefer this metric.
  let metricIds = [
    metricConfig.metricId,
    metricConfig.populationComparisonMetric!.metricId,
  ];
  if (metricConfig.knownBreakdownComparisonMetric) {
    metricIds.push(metricConfig.knownBreakdownComparisonMetric.metricId);
  }
  if (metricConfig.secondaryPopulationComparisonMetric) {
    metricIds.push(metricConfig.secondaryPopulationComparisonMetric.metricId);
  }

  const query = new MetricQuery(metricIds, breakdowns);

  const chartTitle = useCreateChartTitle(
    metricConfig.populationComparisonMetric as MetricConfig,
    locationName
  );

  const filename = `${metricConfig.populationComparisonMetric?.chartTitle}${locationName}`;

  const HASH_ID: ScrollableHashId = "population-vs-distribution";

  return (
    <CardWrapper
      queries={[query]}
      title={<>{reportProviderSteps[HASH_ID].label}</>}
      scrollToHash={HASH_ID}
      minHeight={preloadHeight}
    >
      {([queryResponse]) => {
        const validData = queryResponse.getValidRowsForField(
          metricConfig.metricId
        );

        const [knownData] = splitIntoKnownsAndUnknowns(
          validData,
          props.breakdownVar
        );

        // include a note about percents adding to over 100%
        // if race options include hispanic twice (eg "White" and "Hispanic" can both include Hispanic people)
        // also require at least some data to be available to avoid showing info on suppressed/undefined states
        const shouldShowDoesntAddUpMessage =
          props.breakdownVar === RACE &&
          queryResponse.data.every(
            (row) =>
              !row[props.breakdownVar].includes("(NH)") ||
              row[props.breakdownVar] === HISPANIC
          ) &&
          queryResponse.data.some((row) => row[metricConfig.metricId]);

        const isCawp = CAWP_DETERMINANTS.includes(metricConfig.metricId);

        const dataAvailable =
          knownData.length > 0 &&
          !queryResponse.shouldShowMissingDataMessage([metricConfig.metricId]);

        return (
          <>
            {/* Display either UnknownsAlert OR MissingDataAlert */}
            {dataAvailable ? (
              <UnknownsAlert
                metricConfig={metricConfig}
                queryResponse={queryResponse}
                breakdownVar={props.breakdownVar}
                displayType="chart"
                known={true}
                overrideAndWithOr={props.breakdownVar === RACE}
                fips={props.fips}
              />
            ) : (
              <CardContent>
                <MissingDataAlert
                  dataName={metricConfig.fullCardTitleName}
                  breakdownString={
                    BREAKDOWN_VAR_DISPLAY_NAMES_LOWER_CASE[props.breakdownVar]
                  }
                  fips={props.fips}
                />
              </CardContent>
            )}
            {dataAvailable && knownData.length !== 0 && (
              <>
                <CardContent>
                  <DisparityBarChart
                    chartTitle={chartTitle}
                    data={knownData}
                    lightMetric={metricConfig.populationComparisonMetric!}
                    darkMetric={
                      metricConfig.knownBreakdownComparisonMetric ||
                      metricConfig
                    }
                    breakdownVar={props.breakdownVar}
                    metricDisplayName={metricConfig.shortLabel}
                    filename={filename}
                    showAltPopCompare={shouldShowAltPopCompare(props)}
                  />
                </CardContent>{" "}
              </>
            )}
            {shouldShowDoesntAddUpMessage && !isCawp && (
              <Alert severity="info" role="note">
                Population percentages on this graph add up to over 100% because
                the racial categories reported for{" "}
                {metricConfig.fullCardTitleName} in{" "}
                {props.fips.getSentenceDisplayName()} include Hispanic
                individuals in each racial category. As a result, Hispanic
                individuals are counted twice.
              </Alert>
            )}
            {isCawp && (
              <Alert severity="info" role="note">
                Percentages reported for{" "}
                {props.variableConfig.variableDisplayName} cannot be summed, as
                these racial categories are not mutually exclusive. Individuals
                who identify with multiple specific races (e.g. both "White" and
                "Black") are represented multiple times in the visualization:
                across each corresponding category, and also as "Two or more
                races & Unrepresented race".
              </Alert>
            )}
          </>
        );
      }}
    </CardWrapper>
  );
}
