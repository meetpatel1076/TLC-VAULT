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
import AdminLayout from "./layout/AdminLayout";


const App = () => {
  return (
    <Routes>

      <Route element={<Layout />}>

        <Route path="/dashboard" element={<HomePage />} />

        <Route path="/repo/:repoId" element={<ProjectPage />} />
        

      </Route>

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<SignupPage />} />

      <Route
        path="/verify-email/pending"
        element={<EmailVerificationPendingPage />}
      />

      <Route
        path="/verify-email"
        element={<VerifyEmailPage />}
      />

      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminPage />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="repositories" element={<AdminRepositories />} />
          <Route path="codefiles" element={<AdminCodeFiles />} />
        </Route>
      </Route>


      <Route
        path="/"
        element={<IndexPage />}
      />


    </Routes>
  );
};

export default App;