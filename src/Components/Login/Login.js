import React, { useState, useContext, useEffect } from "react";
import { Link, Redirect, useLocation } from "react-router-dom";
import "./Login.css";

import { UserContext } from "../../Contexts/UserContext";
import LoginLogo from "../../SchoolAPP Assets/SchoolAppLoginInfo";
import LegalLinks from "./LegalLinks";

import LoadingSpinner from "../UI/LoadingSpinner";

import { login, getSchoolCodes, getSchoolYears } from "../../services/authService";
import {
  saveUserToLocalStorage,
  saveTokenToLocalStorage,
  getTokenFromLocalStorage,
  getCurrentPageFromLocalStorage,
  getNextPageFromLocalStorage,
  saveSchoolCodeToLocalStorage,
  getSchoolCodeFromLocalStorage,
  saveSchoolYearToLocalStorage,
  getSchoolYearFromLocalStorage
} from "../../services/localStorageService";

import { useDict } from "../UI/Translations";

const Login = () => {
  // state for the input fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const code = getSchoolCodeFromLocalStorage(); // || "-- Please Select an Option --";
  const savedYear = getSchoolYearFromLocalStorage();
  // console.log(code);
  const [schoolCode, setSchoolCode] = useState(code);
  const [year, setYear] = useState(savedYear);

  const [list, setList] = useState([]);
  const [yearsList, setYearsList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const dict = useDict("/login");

  const userState = useContext(UserContext);
  let token = getTokenFromLocalStorage();

  let location = useLocation();

  const nextPage = getNextPageFromLocalStorage();
  // console.log('2. LOGIN', location, userState.isLoggedIn, nextPage);

  const loginHandler = async (event) => {
    event.preventDefault ? event.preventDefault() : (event.returnValue = false);
    setIsLoading(true);
    try {
      const credentials = { schoolCode, year, email, password };
      const data = await login(credentials);
      userState.login(data);
      saveUserToLocalStorage(data);
      saveTokenToLocalStorage(data.jwt);
      saveSchoolCodeToLocalStorage(schoolCode);
      saveSchoolYearToLocalStorage(year);
      token = data.jwt;
      setIsLoading(false);
    } catch (e) {
      console.log(e);
      setIsLoading(false);
      setErrorMessage(dict("login/form/message/error/invalid-credentials"));
    }
  };

  const handleCodeChange = async (code) => {
    setSchoolCode(code);
    const years = await getSchoolYears(code);
    setYearsList(years);
  }

  const getData = async () => {
    try {
      const codes = await getSchoolCodes();
      // console.log(codes);
      setList(codes);
      if (schoolCode) {
        const years = await getSchoolYears(schoolCode);
        setYearsList(years);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  if (userState.isLoggedIn) {
    if (userState.roleId > 3 && !userState.campusId) {
      return <Redirect to="/unauthorized" />;
    }
    const page = getCurrentPageFromLocalStorage() || "/calendar";
    // console.log('REDIRECTING FROM LOGIN');
    // console.log(page);
    return <Redirect to={page} />;
  } else if (nextPage) {
    return <Redirect to={nextPage} />;
  }

  if (token) {
    return null;
  }

  return (
    <div className="login">
      <section className="login-container">
        <div className="login-logo-center">
          <LoginLogo
            width="126px"
            height="21px"
            style={{ alignSelf: "center" }}
          />
        </div>
        <h1>{dict("login/title")}</h1>
        <h2>{dict("login/form/title")}</h2>
        <div className="login-error-message">{errorMessage}</div>
        <form onSubmit={loginHandler}>
          <div className="login-input-wrapper">
            <p
              className="login-input-title"
              style={errorMessage ? { color: "red" } : null}
            >
              {dict("login/form/input/email/label")}
            </p>
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder={dict("login/form/input/email/placeholder")}
              className="login-input"
              style={errorMessage ? { borderColor: "red" } : null}
            />
          </div>
          <div className="login-input-wrapper">
            <p
              className="login-input-title"
              style={errorMessage ? { color: "red" } : null}
            >
              {dict("login/form/input/password/label")}
            </p>
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder={dict("login/form/input/password/placeholder")}
              className="login-input"
              style={errorMessage ? { borderColor: "red" } : null}
            />
          </div>
          <div className="login-input-wrapper">
            <p
              className="login-input-title"
              style={errorMessage ? { color: "red" } : null}
            >
              {dict("login/form/input/school-code/label")}
            </p>
            <select
              className="login-input"
              value={schoolCode}
              style={
                schoolCode ===
                `-- ${dict("login/form/input/school-code/placeholder")} --`
                  ? { color: "#717c95" }
                  : null
              }
              onChange={(e) => handleCodeChange(e.target.value)}
            >
              <option
                style={{ color: "#717c95" }}
                value={`-- ${dict(
                  "login/form/input/school-code/placeholder"
                )} --`}
              >
                {`-- ${dict("login/form/input/school-code/placeholder")} --`}
              </option>
              {list.map((code) => {
                return (
                  <option key={code.schoolCode} value={code.schoolCode}>
                    {code.schoolCode}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="login-input-wrapper">
            <p
              className="login-input-title"
              style={errorMessage ? { color: "red" } : null}
            >
              {dict("login/form/input/school-year/label")}
            </p>
            <select
              className="login-input"
              value={year}
              style={
                year ===
                `-- ${dict("login/form/input/school-year/placeholder")} --`
                  ? { color: "#717c95" }
                  : null
              }
              onChange={(e) => setYear(e.target.value)}
            >
              <option
                style={{ color: "#717c95" }}
                value={`-- ${dict(
                  "login/form/input/school-year/placeholder"
                )} --`}
              >
                {`-- ${dict("login/form/input/school-year/placeholder")} --`}
              </option>
              {yearsList.map((year) => {
                return (
                  <option key={year.year} value={year.year}>
                    {year.year}
                  </option>
                );
              })}
            </select>
          </div>

          {isLoading ? (
            <div className="login-loading-wrapper">
              <LoadingSpinner />
            </div>
          ) : (
            <button className="login-button">
              {dict("login/form/sign-in-button")}
            </button>
          )}
        </form>
        <LegalLinks />
        <div className="login-fp-link-wrapper">
          <Link to="/forgot-password">
            {dict("login/form/forgot-password")}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Login;
