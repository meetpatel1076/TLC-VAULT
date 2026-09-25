import React from "react";
import { Route, Routes } from "react-router-dom";

import HomePage from "./pages/HomePage";
import ProjectPage from "./pages/ProjectPage";
import Layout from "./layout/layout";
import Login from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import IndexPage from "./pages/Index";

import AdminPage from "./pages/AdminPage";
import AdminRoute from "./components/AdminRoute";

const App = () => {
  return (
    <Routes>

      <Route element={<Layout />}>

        <Route
          path="/dashboard"
          element={<HomePage />}
        />

        <Route
          path="/repo/:repoId"
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

      <Route element={<AdminRoute />}>
        <Route
          path="/admin"
          element={<AdminPage />}
        />
      </Route>

      <Route
        path="/"
        element={<IndexPage />}
      />

    </Routes>
  );
};

export default App;