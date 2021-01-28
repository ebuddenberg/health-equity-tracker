import { USA_FIPS, USA_DISPLAY_NAME } from "../../utils/madlib/Fips";
import { Breakdowns, BreakdownVar } from "../Breakdowns";
import FakeDataFetcher from "../../testing/FakeDataFetcher";
import VariableProvider from "./VariableProvider";
import { MetricQuery, MetricQueryResponse } from "../MetricQuery";
import { MetricId } from "../MetricConfig";

export interface FipsSpec {
  code: string;
  name: string;
}
export const CHATAM: FipsSpec = {
  code: "37037",
  name: "Chatam County",
};
export const DURHAM: FipsSpec = {
  code: "37063",
  name: "Durham County",
};
export const NC: FipsSpec = {
  code: "37",
  name: "North Carolina",
};
export const AL: FipsSpec = {
  code: "01",
  name: "Alabama",
};
export const MARIN: FipsSpec = {
  code: "06041",
  name: "Marin County",
};
export const USA: FipsSpec = {
  code: USA_FIPS,
  name: USA_DISPLAY_NAME,
};

export function createWithAndWithoutTotalEvaluator(
  metricId: MetricId,
  dataFetcher: FakeDataFetcher,
  variableProvider: VariableProvider
) {
  return async (
    datasetId: string,
    rawData: any[],
    baseBreakdown: Breakdowns,
    breakdownVar: BreakdownVar,
    nonTotalRows: any[],
    totalRows: any[]
  ) => {
    dataFetcher.setFakeDatasetLoaded(datasetId, rawData);

    // Evaluate the response with requesting total field
    const responseWithTotal = await variableProvider.getData(
      new MetricQuery(
        metricId,
        baseBreakdown.addBreakdown(breakdownVar, /*includeTotal=*/ true)
      )
    );
    expect(responseWithTotal).toEqual(
      new MetricQueryResponse(totalRows, [datasetId])
    );

    // Evaluate the response without requesting total field
    const responseWithoutTotal = await variableProvider.getData(
      new MetricQuery(
        metricId,
        baseBreakdown.addBreakdown(breakdownVar, /*includeTotal=*/ false)
      )
    );
    expect(responseWithoutTotal).toEqual(
      new MetricQueryResponse(nonTotalRows, [datasetId])
    );
  };
}
