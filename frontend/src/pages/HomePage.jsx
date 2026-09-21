import React from "react";
import { useOutletContext } from "react-router-dom";

import Header from "../components/Header";
import DotField from "../bg/DotField";
import CreateProject from "../components/CreateProject";

const HomePage = () => {

  const { fetchProjects } = useOutletContext();

  return (
    <div className="relative min-h-screen overflow-hidden">

      <div className="absolute inset-0 w-full h-full z-0">
        <DotField />
      </div>

      <div className="relative z-10">
        <Header />

        <CreateProject
          fetchProjects={fetchProjects}
        />
      </div>


    </div>
  );
};

export default HomePage;