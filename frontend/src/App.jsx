import React from "react";
import { Route, Routes } from "react-router-dom";

import HomePage from "./pages/HomePage";
import ProjectPage from "./pages/ProjectPage";
import Layout from "./layout/layout";


const App = () => {
  return (
    <Routes>

      <Route element={<Layout/>}>

        <Route
          path="/dashboard"
          element={<HomePage />}
        />

        <Route
          path="/repo"
          element={<ProjectPage />}
        />

      </Route>

    </Routes>
  );
};

export default App;