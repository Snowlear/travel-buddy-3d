import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFoundPage from "../components/pages/NotFoundPage/NotFoundPage";
import ResultsPage from "../components/pages/ResultsPage/ResultsPage";
import SearchPage from "../components/pages/SearchPage/SearchPage";
import { CitiesProvider } from "../context/CitiesContext";
import ThreeDimentioanalResultsPage from "../components/pages/3DViewResultPage/3DViewResultsPage";

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
          <Route
            path="/3dresults/:passengerCount?:tripDate?:tripDestinations?"
            Component={ThreeDimentioanalResultsPage}
          />
          <Route path="*" Component={NotFoundPage} />
        </Routes>
      </BrowserRouter>
    </CitiesProvider>
  );
};

export default AppRouter;
