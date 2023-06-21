import React, { useContext } from "react";
import { City } from "../types/City";
import {
  searchCities,
  calculateDistances,
  isValidCity,
  isValidCities,
  getCities,
} from "../api/fakeApi";

interface CitiesContextType {
  cities: City[];
  searchCities: (keyword: string) => Promise<City[]>;
  calculateDistances: (cities: City[]) => Promise<number[]>;
  isValidCity: (cityName: string) => Promise<boolean>;
  isValidCities: (citiesArray: string[]) => Promise<boolean[]>;
  getCities: (cityNames: string[]) => Promise<City[]>;
}

interface CitiesProviderProps {
  children: React.ReactNode;
}

const CitiesProvider: React.FC<CitiesProviderProps> = ({ children }) => {
  const contextValues: CitiesContextType = {
    cities: [],
    searchCities,
    calculateDistances,
    isValidCity,
    isValidCities,
    getCities,
  };

  return (
    <CitiesContext.Provider value={contextValues}>
      {children}
    </CitiesContext.Provider>
  );
};

const CitiesContext = React.createContext<CitiesContextType>({
  cities: [],
  searchCities: async () => [],
  calculateDistances: async () => [],
  isValidCity: async () => false,
  isValidCities: async () => [],
  getCities: async () => [],
});

const useCitiesContext = (): CitiesContextType =>
  useContext(CitiesContext) as CitiesContextType;

export { CitiesProvider, useCitiesContext };
