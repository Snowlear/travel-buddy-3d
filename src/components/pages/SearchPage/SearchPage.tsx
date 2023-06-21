import React, { useEffect, useState } from "react";
import styles from "./SearchPage.module.css";
import Button from "../../atoms/Button/Button";
import TripPlanner from "../../organisms/TripPlanner/TripPlanner";
import Input from "../../atoms/Input/Input";
import {
  DestinationSelection,
  exampleDestinationSelection,
} from "../../../types/DestinationSelection";
import { isDMY, isYMD, toDMYOrder } from "../../../utils/date";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCitiesContext } from "../../../context/CitiesContext";
import DatePicker from "../../molecules/DatePicker/DatePicker";

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { isValidCities } = useCitiesContext();
  const intitialEmptyDestSelection = [
    { ...exampleDestinationSelection },
    { ...exampleDestinationSelection },
  ];
  const initialPassengerCount = Number(searchParams.get("passengerCount")) || 0;
  const intialTripDate = searchParams.get("tripDate") || "";
  const tripDestinations = searchParams.get("tripDestinations") || "";
  const navigate = useNavigate();
  const handleInitialDate = (input: string) => {
    if (isYMD(input)) {
      return toDMYOrder(input);
    } else if (isDMY(input)) {
      return input;
    }
    return "";
  };

  const prepareDestinations = (
    paramDestinationsRaw: string
  ): DestinationSelection[] => {
    try {
      if (paramDestinationsRaw) {
        const paramDestinations: string[] = JSON.parse(paramDestinationsRaw);
        if (paramDestinations.length < 2) {
          return intitialEmptyDestSelection;
        }
        return paramDestinations.map((item): DestinationSelection => {
          if (typeof item === "number") {
            return { name: "", isValid: false };
          }
          return { name: item.replace(/\d+/g, ""), isValid: false };
        });
      } else {
        return intitialEmptyDestSelection;
      }
    } catch (e) {
      return intitialEmptyDestSelection;
    }
  };

  const [isDestinationsValid, setIsDestinationsValid] = useState(false);
  const [destinations, setDestinations] = useState<DestinationSelection[]>(
    prepareDestinations(tripDestinations)
  );
  const [isFormValid, setIsFormValid] = useState(false);
  const [passengerCount, setPassengerCount] = useState(initialPassengerCount);
  const [date, setDate] = useState(handleInitialDate(intialTripDate));
  useEffect(() => {
    setIsFormValid(
      isDestinationsValid && passengerCount > 0 && date.length > 0
    );
  }, [date.length, isDestinationsValid, passengerCount]);

  useEffect(() => {
    let currentDestinations = [...destinations];
    isValidCities(destinations.map((destination) => destination.name)).then(
      (validityArray) => {
        currentDestinations.forEach((item, idx) => {
          item.isValid = validityArray[idx];
          if (item.name.trim().length > 0) {
            item.error = validityArray[idx] ? undefined : "Invalid city";
          }
        });
        setDestinations(currentDestinations);
      }
    );
  }, []);

  useEffect(() => {
    navigate(
      `?passengerCount=${passengerCount}&tripDate=${toDMYOrder(
        date
      )}&tripDestinations=${JSON.stringify(
        destinations.map((item) => item.name)
      )}`
    );
  }, [navigate, passengerCount, date, destinations]);

  return (
    <div className={styles.searchPage}>
      <div className={styles.formItems}>
        <div className={styles.leftInput}>
          <TripPlanner
            setIsValid={setIsDestinationsValid}
            destinations={destinations}
            setDestinations={setDestinations}
          />
        </div>
        <div className={styles.rightInputs}>
          <Input
            value={passengerCount + ""}
            type="number"
            onNumberChange={(value) => setPassengerCount(value)}
            onChange={(e) => setPassengerCount(Number(e.target.value))}
            label={"Passenger"}
          />
          <DatePicker
            onChange={(newDate) => setDate(newDate)}
            value={date}
            label="Date"
          />
        </div>
      </div>
      <div className={styles.controlGroup}>
        <Button
          onClick={() =>
            navigate(
              `results?passengerCount=${passengerCount}&tripDate=${date}&tripDestinations=${JSON.stringify(
                destinations.map((item) => item.name)
              )}`
            )
          }
          disabled={!isFormValid}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default SearchPage;
