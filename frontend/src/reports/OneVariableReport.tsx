import { Grid } from "@material-ui/core";
import React, { useEffect, useState, Fragment, useRef } from "react";
import LazyLoad from "react-lazyload";
import { DisparityBarChartCard } from "../cards/DisparityBarChartCard";
import { MapCard } from "../cards/MapCard";
import { PopulationCard } from "../cards/PopulationCard";
import { SimpleBarChartCard } from "../cards/SimpleBarChartCard";
import { AgeAdjustedTableCard } from "../cards/AgeAdjustedTableCard";
import { UnknownsMapCard } from "../cards/UnknownsMapCard";
import { TableCard } from "../cards/TableCard";
import {
  DropdownVarId,
  METRIC_CONFIG,
  VariableConfig,
  COVID_VAXX,
} from "../data/config/MetricConfig";
import { BreakdownVar, DEMOGRAPHIC_BREAKDOWNS } from "../data/query/Breakdowns";
import { RACE } from "../data/utils/Constants";
import { Fips } from "../data/utils/Fips";
import {
  CardId,
  DATA_TYPE_1_PARAM,
  DATA_TYPE_2_PARAM,
  DEMOGRAPHIC_PARAM,
  getParameter,
  HIGHLIGHT_SCROLL_DELAY,
  psSubscribe,
  setParameter,
  setParameters,
  swapOldParams,
} from "../utils/urlutils";
import { SINGLE_COLUMN_WIDTH } from "./ReportProvider";
import NoDataAlert from "./ui/NoDataAlert";
import ReportToggleControls from "./ui/ReportToggleControls";
import styles from "./Report.module.scss";

export function jumpToCard(ref: any): void {
  if (ref?.current) {
    ref.current.scrollIntoView({ block: "center", behavior: "smooth" });
    ref.current = null;
    ref = null;
  }
}

export function highlightMatch(matchId: CardId, propsId?: CardId | undefined) {
  return propsId === matchId ? { className: styles.HighlightedCard } : {};
}

export interface OneVariableReportProps {
  key: string;
  dropdownVarId: DropdownVarId;
  fips: Fips;
  updateFipsCallback: Function;
  hidePopulationCard?: boolean;
  jumpToDefinitions: Function;
  jumpToData: Function;
  targetScrollRef?: CardId;
}

export function OneVariableReport(props: OneVariableReportProps) {
  const mapRef = useRef<HTMLInputElement>(null);
  const barRef = useRef<HTMLInputElement>(null);
  const unknownsRef = useRef<HTMLInputElement>(null);
  const disparityRef = useRef<HTMLInputElement>(null);
  const tableRef = useRef<HTMLInputElement>(null);
  const ageAdjRef = useRef<HTMLInputElement>(null);

  let target: any = null;

  // handle incoming #hash link request
  useEffect(() => {
    switch (props.targetScrollRef) {
      case "#map":
        /* eslint-disable react-hooks/exhaustive-deps */
        target = mapRef;
        break;
      case "#bar":
        target = barRef;
        break;
      case "#unknowns":
        target = unknownsRef;
        break;
      case "#disparity":
        target = disparityRef;
        break;
      case "#table":
        target = tableRef;
        break;
      case "#age-adjusted":
        target = ageAdjRef;
        break;
    }

    window.setTimeout(() => {
      jumpToCard(target);
    }, HIGHLIGHT_SCROLL_DELAY);
    // remove hash from URL
    // eslint-disable-next-line no-restricted-globals
    history.pushState(
      "",
      document.title,
      window.location.pathname + window.location.search
    );
  }, [props.targetScrollRef]);

  const [currentBreakdown, setCurrentBreakdown] = useState<BreakdownVar>(
    getParameter(DEMOGRAPHIC_PARAM, RACE)
  );

  const [variableConfig, setVariableConfig] = useState<VariableConfig | null>(
    Object.keys(METRIC_CONFIG).includes(props.dropdownVarId)
      ? METRIC_CONFIG[props.dropdownVarId][0]
      : null
  );

  const setVariableConfigWithParam = (v: VariableConfig) => {
    setParameters([
      { name: DATA_TYPE_1_PARAM, value: v.variableId },
      { name: DATA_TYPE_2_PARAM, value: null },
    ]);
    setVariableConfig(v);
  };

  const setDemoWithParam = (str: BreakdownVar) => {
    setParameter(DEMOGRAPHIC_PARAM, str);
    setCurrentBreakdown(str);
  };

  useEffect(() => {
    const readParams = () => {
      const demoParam1 = getParameter(
        DATA_TYPE_1_PARAM,
        undefined,
        (val: string) => {
          val = swapOldParams(val);
          return METRIC_CONFIG[props.dropdownVarId].find(
            (cfg) => cfg.variableId === val
          );
        }
      );
      setVariableConfig(
        demoParam1 ? demoParam1 : METRIC_CONFIG[props.dropdownVarId][0]
      );

      const demo: BreakdownVar = getParameter(DEMOGRAPHIC_PARAM, RACE);
      setCurrentBreakdown(demo);
    };
    const psHandler = psSubscribe(readParams, "vardisp");
    readParams();
    return () => {
      if (psHandler) {
        psHandler.unsubscribe();
      }
    };
  }, [props.dropdownVarId]);

  const breakdownIsShown = (breakdownVar: BreakdownVar) =>
    currentBreakdown === breakdownVar;

  return (
    <Grid
      item
      container
      xs={12}
      alignItems="center"
      spacing={1}
      justifyContent="center"
    >
      {!props.hidePopulationCard && (
        // POPULATION CARD
        <Grid item xs={12} md={SINGLE_COLUMN_WIDTH} id="population">
          <PopulationCard jumpToData={props.jumpToData} fips={props.fips} />
        </Grid>
      )}

      {!variableConfig && <NoDataAlert dropdownVarId={props.dropdownVarId} />}

      {variableConfig && (
        <Grid container spacing={1} justifyContent="center">
          {/* DEMOGRAPHIC / DATA TYPE TOGGLE(S) */}
          {!(props.dropdownVarId === COVID_VAXX && props.fips.isCounty()) && (
            <Grid item container xs={12} md={SINGLE_COLUMN_WIDTH}>
              <ReportToggleControls
                dropdownVarId={props.dropdownVarId}
                variableConfig={variableConfig}
                setVariableConfig={setVariableConfigWithParam}
                currentBreakdown={currentBreakdown}
                setCurrentBreakdown={setDemoWithParam}
              />
            </Grid>
          )}

          {/* 100k MAP CARD */}
          <Grid
            item
            xs={12}
            md={SINGLE_COLUMN_WIDTH}
            ref={mapRef}
            {...highlightMatch("#map", props.targetScrollRef)}
          >
            <MapCard
              variableConfig={variableConfig}
              fips={props.fips}
              updateFipsCallback={(fips: Fips) => {
                props.updateFipsCallback(fips);
              }}
              currentBreakdown={currentBreakdown}
              jumpToDefinitions={props.jumpToDefinitions}
              jumpToData={props.jumpToData}
            />
          </Grid>

          {/* 100K BAR CHART CARD */}
          <Grid
            item
            xs={12}
            sm={12}
            md={SINGLE_COLUMN_WIDTH}
            ref={barRef}
            {...highlightMatch("#bar", props.targetScrollRef)}
          >
            <LazyLoad offset={600} height={750} once>
              {DEMOGRAPHIC_BREAKDOWNS.map((breakdownVar) => (
                <Fragment key={breakdownVar}>
                  {breakdownIsShown(breakdownVar) &&
                    variableConfig.metrics["per100k"] && (
                      <SimpleBarChartCard
                        variableConfig={variableConfig}
                        breakdownVar={breakdownVar}
                        fips={props.fips}
                      />
                    )}
                </Fragment>
              ))}
            </LazyLoad>
          </Grid>

          {/* UNKNOWNS MAP CARD */}
          <Grid
            item
            xs={12}
            sm={12}
            md={SINGLE_COLUMN_WIDTH}
            ref={unknownsRef}
            {...highlightMatch("#unknowns", props.targetScrollRef)}
          >
            <LazyLoad offset={800} height={750} once>
              {variableConfig.metrics["pct_share"] && (
                <UnknownsMapCard
                  overrideAndWithOr={currentBreakdown === RACE}
                  variableConfig={variableConfig}
                  fips={props.fips}
                  updateFipsCallback={(fips: Fips) => {
                    props.updateFipsCallback(fips);
                  }}
                  currentBreakdown={currentBreakdown}
                />
              )}
            </LazyLoad>
          </Grid>

          {/* DISPARITY BAR CHART COMPARE VS POPULATION */}
          <Grid
            item
            xs={12}
            sm={12}
            md={SINGLE_COLUMN_WIDTH}
            ref={disparityRef}
            {...highlightMatch("#disparity", props.targetScrollRef)}
          >
            <LazyLoad offset={800} height={750} once>
              {DEMOGRAPHIC_BREAKDOWNS.map((breakdownVar) => (
                <Fragment key={breakdownVar}>
                  {breakdownIsShown(breakdownVar) &&
                    variableConfig.metrics["pct_share"] && (
                      <DisparityBarChartCard
                        variableConfig={variableConfig}
                        breakdownVar={breakdownVar}
                        fips={props.fips}
                      />
                    )}
                </Fragment>
              ))}
            </LazyLoad>
          </Grid>

          {/* DATA TABLE CARD */}
          <Grid
            item
            xs={12}
            md={SINGLE_COLUMN_WIDTH}
            ref={tableRef}
            {...highlightMatch("#table", props.targetScrollRef)}
          >
            <LazyLoad offset={800} height={750} once>
              {DEMOGRAPHIC_BREAKDOWNS.map((breakdownVar) => (
                <Fragment key={breakdownVar}>
                  {breakdownIsShown(breakdownVar) && (
                    <TableCard
                      fips={props.fips}
                      variableConfig={variableConfig}
                      breakdownVar={breakdownVar}
                    />
                  )}
                </Fragment>
              ))}
            </LazyLoad>
          </Grid>

          {/* AGE ADJUSTED TABLE CARD */}
          <Grid
            item
            xs={12}
            md={SINGLE_COLUMN_WIDTH}
            ref={ageAdjRef}
            {...highlightMatch("#age-adjusted", props.targetScrollRef)}
          >
            <LazyLoad offset={800} height={800} once>
              <AgeAdjustedTableCard
                fips={props.fips}
                variableConfig={variableConfig}
                dropdownVarId={props.dropdownVarId}
                breakdownVar={currentBreakdown}
                setVariableConfigWithParam={setVariableConfigWithParam}
              />
            </LazyLoad>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}
