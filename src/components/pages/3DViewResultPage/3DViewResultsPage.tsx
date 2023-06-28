import React, { useEffect, useState } from "react";
import styles from "./3DViewResultsPage.module.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { isObjectOfArraysOfStrings, sumArray } from "../../../utils/array";
import Button from "../../atoms/Button/Button";
import { City, CityDistanceData } from "../../../types/City";
import { useCitiesContext } from "../../../context/CitiesContext";
import TripResultView from "../../organisms/TripResultView/TripResultView";
import EarthCanvas from "../../molecules/EarthGlobeCanvas/EarthGlobeCanvas";
import Modal from "../../atoms/Modal/Modal";

const ThreeDimentioanalResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const [distancesData, setDistancesData] = useState<CityDistanceData>();
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();
  const [cities, setCities] = useState<City[]>([]);
  const [searchParams] = useSearchParams();
  const passengerCount = searchParams.get("passengerCount");
  const tripDate = searchParams.get("tripDate");
  const tripDestinations = searchParams.get("tripDestinations");
  const [ selectedCity, setSelectedCity] = useState<City | undefined>(undefined); 
  const [destinations] = useState<string[]>(JSON.parse(tripDestinations!));
  const { getCities, isValidCity, calculateDistances } = useCitiesContext();
  const isParametersValid = () => {
    if (tripDate && passengerCount && tripDestinations) {
      const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
      if (!dateRegex.test(tripDate)) {
        return false;
      }
      try {
        if (
          typeof destinations !== "object" &&
          !isObjectOfArraysOfStrings(destinations)
        ) {
          return false;
        }

        destinations.forEach(function (item) {
          if (!isValidCity(item)) {
            return false;
          }
        });

        if (isNaN(Number(passengerCount))) {
          return false;
        }
      } catch (e) {
        return false;
      }
    } else {
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (tripDestinations && !isLoaded) {
      const destinationStrings = JSON.parse(tripDestinations);
      getCities(destinationStrings)
        .then((cities: City[]) => {
          setCities(cities);
          calculateDistances(cities)
            .then((distances) => {
              const distanceData: CityDistanceData = {
                totalDistance: sumArray(distances),
                distanceBetween: distances,
              };
              setDistancesData(distanceData);
            })
            .catch(() => {
              setError("Error occured while parsing city data.");
            })
            .finally(() => setIsLoaded(true));
        })
        .catch(() => {
          setError("Error occured while parsing your request.");
          setIsLoaded(true);
        });
    }
  }, [calculateDistances, getCities, isLoaded, tripDestinations]);

  return (
    <div className={styles.ResultsPage}>
      {isParametersValid() ? (
        isLoaded ? (
          error ? (
            <p>{error}</p>
          ) : (
            <>
              <EarthCanvas cities={cities} setSelectedCity={setSelectedCity}/>
              <Modal className={styles.tripResultModalWrapper}>
                <TripResultView
                  destinations={destinations}
                  distancesData={distancesData}
                  passengerCount={passengerCount}
                  tripDate={tripDate}
                />
              </Modal>
              {selectedCity && <Modal className={styles.cityModalWrapper}>
                <Button onClick={() => setSelectedCity(undefined)} className={styles.cityModalXButton}>X</Button>
                <p>{selectedCity.name}</p>
                </Modal>}
            </>
          )
        ) : (
          <p>Loading...</p>
        )
      ) : (
        <p>Your search is invalid.</p>
      )}
      <Modal className={styles.controlGroupModalWrapper}>
      <div className={styles.controlGroup}>
        <Button
          onClick={() =>
            navigate(
              `../?passengerCount=${passengerCount}&tripDate=${tripDate}&tripDestinations=${tripDestinations}`
            )
          }
        >
          Back
        </Button>
      </div>
      </Modal>
      
    </div>
  );
};

export default ThreeDimentioanalResultsPage;
