import React from "react";
import { Route, Routes } from "react-router-dom";

import HomePage from "./pages/HomePage";
import ProjectPage from "./pages/ProjectPage";
import Layout from "./layout/layout";
import Login from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import EmailVerificationPendingPage from "./pages/EmailVerificationPendingPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import IndexPage from "./pages/Index";

import AdminPage from "./pages/AdminPage";
import AdminRoute from "./components/AdminRoute";
import AdminUsers from "./pages/AdminUsersPage";
import AdminRepositories from "./pages/AdminRepositoriesPage";
import AdminCodeFiles from "./pages/AdminCodeFilesPage";

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

      <Route
        path="/verify-email/pending"
        element={<EmailVerificationPendingPage />}
      />

      <Route
        path="/verify-email"
        element={<VerifyEmailPage />}
      />

      <Route element={<AdminRoute />}>
        <Route
          path="/admin"
          element={<AdminPage />}
        />

        <Route
          path="/admin/users"
          element={<AdminUsers />}
        />

        <Route
          path="/admin/repositories"
          element={<AdminRepositories />}
        />

        <Route
          path="/admin/codefiles"
          element={<AdminCodeFiles />}
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