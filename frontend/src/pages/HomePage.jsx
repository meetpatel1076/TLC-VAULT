import React from "react";
import Header from "../components/Header";
import DotField from "../bg/DotField";
import CreateProject from "../components/CreateProject";

const HomePage = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 w-full h-full z-0">
        <DotField />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Header />
        <CreateProject />
      </div>

    </div>
  );
};

export default HomePage;