import React, { useEffect } from "react";
import styles from "./TripPlanner.module.css";
import Input from "../../atoms/Input/Input";
import Dot from "../../../assets/images/svgs/ellipse.svg";
import Line from "../../../assets/images/svgs/line.svg";
import Plus from "../../../assets/images/svgs/plus.svg";
import LocationTag from "../../../assets/images/svgs/locationTag.svg";
import { useCitiesContext } from "../../../context/CitiesContext";
import { upperCaseFirst } from "../../../utils/string";
import {
  DestinationSelection,
  exampleDestinationSelection,
} from "../../../types/DestinationSelection";
import Link from "../../atoms/Link/Link";
import { City } from "../../../types/City";

interface TripPlannerProps {
  setIsValid: (input: boolean) => void;
  destinations: DestinationSelection[];
  setDestinations: (input: DestinationSelection[]) => void;
}

const TripPlanner: React.FC<TripPlannerProps> = ({
  setIsValid,
  destinations,
  setDestinations,
}) => {
  const { searchCities } = useCitiesContext();
  const setDestination = (
    input: string,
    index: number,
    key: "name" | "error" = "name",
    isSuggestedSelected: boolean | undefined = undefined
  ) => {
    let currentDestinations = [...destinations];
    currentDestinations[index][key] = input;
    currentDestinations[index].isSuggestedSelected = isSuggestedSelected;
    setDestinations(currentDestinations);
  };

  const addDestination = () => {
    setDestinations([...destinations, { ...exampleDestinationSelection }]);
  };

  const removeDestination = (index: number) => {
    let currentDestinations = [...destinations];
    currentDestinations.splice(index, 1);
    setDestinations(currentDestinations);
  };

  const setDestinationValidity = (input: boolean, index: number) => {
    let currentDestinations = [...destinations];
    currentDestinations[index].isValid = input;
    setDestinations(currentDestinations);
  };

  const setDestinationSuggestions = (
    input: City[] | undefined | "error",
    index: number
  ) => {
    let currentDestinations = [...destinations];
    currentDestinations[index].suggestions = input;
    setDestinations(currentDestinations);
  };

  const checkDestination = (input: DestinationSelection, index: number) => {
    if (input.name.trim().length > 0) {
      searchCities(input.name)
        .then((result) => {
          if (result.some((city) => city.name === input.name)) {
            setDestination("", index, "error");
            setDestinationValidity(true, index);
          } else {
            setDestination("Its not a valid city", index, "error");
            setDestinationValidity(false, index);
          }
        })
        .catch(() => {
          setDestination(
            "Server failed to validate this city.",
            index,
            "error"
          );
          setDestinationValidity(false, index);
        });
    } else {
      setDestination("This field is mandatory.", index, "error");
      setDestinationValidity(false, index);
    }
  };

  useEffect(() => {
    setIsValid(
      destinations.filter((d) => d.isValid).length === destinations.length
    );
  }, [destinations, setIsValid]);

  const handleDestinationSuggestions = (idx: number) => {
    if (destinations[idx].name.trim().length > 0) {
      searchCities(destinations[idx].name)
        .then((result) => {
          setDestinationSuggestions(result, idx);
        })
        .catch((x) => setDestinationSuggestions("error", idx));
    } else {
      setDestinationSuggestions(undefined, idx);
    }
  };

  const handleBubbleContent = (
    value: DestinationSelection
  ): React.ReactNode | undefined => {
    if (
      value.isSuggestedSelected ||
      value.isValid ||
      value.name.trim().length < 1
    ) {
      return;
    }
    if (value.suggestions) {
      const isEmpty = value.suggestions?.length === 0;
      return (
        <>
          {isEmpty ? (
            <p className={styles.bubbleInfo}>No result found.</p>
          ) : (
            value.suggestions &&
            (value.suggestions !== "error" ? (
              value.suggestions.map((city) => {
                return (
                  <p
                    key={"suggestedCity_" + city.name}
                    onClick={() => {
                      setDestination(
                        city.name,
                        destinations.indexOf(value),
                        "name",
                        true
                      );
                    }}
                    className={styles.suggestedCity}
                  >
                    {city.name}
                  </p>
                );
              })
            ) : (
              <p className={styles.bubbleInfo}>Server error.</p>
            ))
          )}
        </>
      );
    } else {
      return <p className={styles.bubbleInfo}>Loading...</p>;
    }
  };

  return (
    <div className={styles.TripPlanner}>
      <div className={styles.dotArea}>
        {destinations.length &&
          [...Array(destinations.length - 1)].map((e, i) => (
            <React.Fragment key={"dotsOf" + i}>
              <img
                key={"dotsOf" + i}
                className={styles.dot}
                alt="dot"
                src={Dot}
              ></img>
              <img
                key={"lineOf" + i}
                className={styles.dot}
                alt="line"
                src={Line}
              ></img>
            </React.Fragment>
          ))}

        <img className={styles.dot} alt="dot" src={LocationTag}></img>
        {destinations.length < 5 && (
          <img className={styles.plus} alt="dot" src={Plus}></img>
        )}
      </div>
      <div className={styles.inputArea}>
        {destinations.map((destination, idx) => (
          <div className={styles.inputContainer} key={idx + "_dest"}>
            <Input
              onBlur={() => checkDestination(destination, idx)}
              onChange={(e) => {
                let previousValue = destination.name;
                let newValue = e.target.value.replace(/\d+/g, "");
                setDestination(upperCaseFirst(newValue), idx, "name", false);
                if (
                  newValue.toLocaleLowerCase() !== previousValue &&
                  destination.isValid
                ) {
                  setDestinationValidity(false, idx);
                }
                handleDestinationSuggestions(idx);
              }}
              bubbleContent={
                destination.name.length > 0 && handleBubbleContent(destination)
              }
              onClear={() => {
                setDestination("", idx);
                checkDestination(destination, idx);
              }}
              onDestroy={
                destinations.length > 2 && idx > 0
                  ? () => {
                      removeDestination(idx);
                    }
                  : undefined
              }
              value={destination.name}
              error={
                destination.error && destination.error.length > 0
                  ? destination.error
                  : undefined
              }
              label={idx === 0 ? "City of Origin" : "City of Destination"}
            />
          </div>
        ))}
        {destinations.length < 5 && (
          <Link
            onClick={() => {
              addDestination();
            }}
            label={"Add destination"}
          />
        )}
      </div>
    </div>
  );
};

export default TripPlanner;
