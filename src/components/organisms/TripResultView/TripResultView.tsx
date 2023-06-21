import React from "react";
import styles from "./TripResultView.module.css";
import classnames from "classnames";
import { formatDate } from "../../../utils/date";
import { roundNumber } from "../../../utils/number";
import ArrowBubble from "../../atoms/ArrowBubble/ArrowBubble";
import { CityDistanceData } from "../../../types/City";
import LocationTag from "../../../assets/images/svgs/locationTag.svg";
import ThreeDots from "../../../assets/images/svgs/3dots.svg";

interface TripResultViewProps {
  distancesData: CityDistanceData | undefined;
  destinations: string[];
  passengerCount: string | null;
  tripDate: string | null;
}

const TripResultView: React.FC<TripResultViewProps> = ({
  distancesData,
  destinations,
  passengerCount,
  tripDate,
}) => {
  return (
    <>
      <div className={classnames(styles.pathWrapper, styles.blueText)}>
        <div className={styles.distancesBox}>
          {distancesData?.distanceBetween?.map((distance) => (
            <ArrowBubble key={"dist" + distance} isRelative direction="right">
              <p className={styles.bubbleText}>{roundNumber(distance, 2)} km</p>
            </ArrowBubble>
          ))}
        </div>
        <div className={styles.dotContainer}>
          {destinations?.map((x, idx) => {
            if (idx === destinations.length - 1) {
              return (
                <img
                  key="locationTag"
                  className={styles.dot}
                  alt="dot"
                  src={LocationTag}
                ></img>
              );
            }
            return <img alt="3dots" key={"dotsOf" + idx} src={ThreeDots}></img>;
          })}
        </div>
        <div className={styles.citiesContainer}>
          {destinations?.map((x) => (
            <p key={"city_" + x}>{x}</p>
          ))}
        </div>
      </div>
      <p className={styles.text}>
        <span className={classnames(styles.boldText, styles.blueText)}>
          {roundNumber(distancesData?.totalDistance!, 2)} km
        </span>{" "}
        is total distance
      </p>
      <p className={styles.text}>
        <span className={classnames(styles.boldText, styles.blueText)}>
          {passengerCount}
        </span>{" "}
        passengers
      </p>
      <p className={classnames(styles.boldText, styles.blueText)}>
        {tripDate && formatDate(tripDate)}
      </p>
    </>
  );
};

export default TripResultView;
