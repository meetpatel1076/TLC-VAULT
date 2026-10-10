import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import HomePage from "./pages/HomePage";
import ProjectPage from "./pages/ProjectPage";
import Layout from "./layout/layout";
import Login from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import EmailVerificationPendingPage from "./pages/EmailVerificationPendingPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import IndexPage from "./pages/Index";
import FeaturesPage from "./pages/FeaturesPage";
import SEO from "./components/SEO";

import AdminPage from "./pages/AdminPage";
import AdminRoute from "./components/AdminRoute";
import AdminUsers from "./pages/AdminUsersPage";
import AdminRepositories from "./pages/AdminRepositoriesPage";
import AdminCodeFiles from "./pages/AdminCodeFilesPage";
import AdminLayout from "./layout/AdminLayout";

const HOME_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "TLC Vault",
  alternateName: "TLC-Vault",
  url: "https://vault.thelastcommit.xyz/",
  description:
    "A browser-based workspace to save code, run supported programs, and track coding consistency.",
};

function NoIndex({ children, title = "TLC Vault account" }) {
  const location = useLocation();

  return (
    <>
      <SEO
        title={`${title} | TLC Vault`}
        description="Private account and workspace page for TLC Vault."
        path={location.pathname}
        noIndex
      />
      {children}
    </>
  );
}

const App = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route
          path="/dashboard"
          element={
            <NoIndex title="Your dashboard">
              <HomePage />
            </NoIndex>
          }
        />
        <Route
          path="/repo/:repoId"
          element={
            <NoIndex title="Your code workspace">
              <ProjectPage />
            </NoIndex>
          }
        />
      </Route>

      <Route
        path="/login"
        element={
          <NoIndex title="Log in">
            <Login />
          </NoIndex>
        }
      />
      <Route
        path="/register"
        element={
          <NoIndex title="Create an account">
            <SignupPage />
          </NoIndex>
        }
      />
      <Route
        path="/verify-email/pending"
        element={
          <NoIndex title="Email verification pending">
            <EmailVerificationPendingPage />
          </NoIndex>
        }
      />
      <Route
        path="/verify-email"
        element={
          <NoIndex title="Verify your email">
            <VerifyEmailPage />
          </NoIndex>
        }
      />

      <Route element={<AdminRoute />}>
        <Route
          path="/admin"
          element={
            <NoIndex title="Administration">
              <AdminLayout />
            </NoIndex>
          }
        >
          <Route index element={<AdminPage />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="repositories" element={<AdminRepositories />} />
          <Route path="codefiles" element={<AdminCodeFiles />} />
        </Route>
      </Route>

      <Route
        path="/features"
        element={<FeaturesPage />}
      />
      <Route
        path="/"
        element={
          <>
            <SEO
              title="TLC Vault — Save and Access Your Code Online | The Last Commit"
              description="Save and organize programming code online, run supported code in an embedded compiler, and track your coding consistency with TLC Vault by The Last Commit."
              path="/"
              structuredData={HOME_SCHEMA}
            />
            <IndexPage />
          </>
        }
      />
    </Routes>
  );
};

export default App;
