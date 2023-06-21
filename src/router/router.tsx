import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFoundPage from "../components/pages/NotFoundPage/NotFoundPage";
import ResultsPage from "../components/pages/ResultsPage/ResultsPage";
import SearchPage from "../components/pages/SearchPage/SearchPage";
import { CitiesProvider } from "../context/CitiesContext";

const AppRouter = () => {
  return (
    <CitiesProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" Component={SearchPage} />
          <Route
            path="/results/:passengerCount?:tripDate?:tripDestinations?"
            Component={ResultsPage}
          />
          <Route path="*" Component={NotFoundPage} />
        </Routes>
      </BrowserRouter>
    </CitiesProvider>
  );
};

export default AppRouter;
