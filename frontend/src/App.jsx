import React from "react";
import { Route, Routes } from "react-router-dom";

import HomePage from "./pages/HomePage";
import ProjectPage from "./pages/ProjectPage";
import Layout from "./layout/layout";
import Login from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage";


const App = () => {
  return (
    <Routes>

      <Route element={<Layout />}>

        <Route
          path="/dashboard"
          element={<HomePage />}
        />

        <Route
          path="/repo"
          element={<ProjectPage />}
        />

      </Route>

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<SignupPage />}
      />

    </Routes>
  );
};

export default App;