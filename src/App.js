import React from "react";
import "./App.css";
import UserContextProvider from "./Contexts/UserContext";
import HomePage from "./Components/HomePage/HomePage";

// import 'jquery';
// import { Switch, Route } from "react-router-dom";
// import DashboardMain from "./Components/Dashboard/DashboardMain";
// import { FaBookOpen } from "react-icons/fa";

const App = () => {
  return (
    <div className="App">
      <UserContextProvider>
        <HomePage />
      </UserContextProvider>
    </div>
  );
};

export default App;
