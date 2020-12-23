import React, {useState, useEffect} from "react";
import { useHistory } from "react-router-dom";
import {getSchoolCodes, getSchoolYears, sendRestPasswordLink} from "../../services/authService";

import Logo from "../../SchoolAPP Assets/schoolapp-login-logo.svg";
import "./ForgotPassword.css";

import { useDict } from "../UI/Translations"

const ForgotPassword = () => {
  const [emailAddress, setEmailAddress] = useState("");
  const [schoolCode, setSchoolCode] = useState("");
  const [year, setYear] = useState('');

  const [list, setList] = useState([]);
  const [yearsList, setYearsList] = useState([]);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const dict = useDict("/login")

  const history = useHistory();

  const forgotPasswordHandler = async (event) => {
    event.preventDefault ? event.preventDefault() : (event.returnValue = false);
    const data = {
      email: emailAddress,
      schoolCode,
      year
    };
    if (schoolCode !== "" && emailAddress !== "") {
      try {
        await sendRestPasswordLink(data);
        setSuccessMessage(dict("forgot-password/form/message/success/email-sent"));
        setErrorMessage("")
      } catch (err) {
        console.error(err);
        setErrorMessage(
          dict("forgot-password/form/message/error/invalid-email-school-code")
        );
        setSuccessMessage("");
      }
    } else {
      setErrorMessage(dict("forgot-password/form/message/error/missing-email-school-code"));
    }
  };

  const getSchoolCodeList = async () => {
    try {
      const data = await getSchoolCodes();
      setList(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCodeChange = async (code) => {
    setSchoolCode(code);
    const years = await getSchoolYears(code);
    setYearsList(years);
  }

  useEffect(() => {
    getSchoolCodeList();
  }, []);

  return (
    <div className="forgot-password">
      <section className="forgot-password-container">
        <p
          style={{marginBottom: "50px", cursor: "pointer"}}
          onClick={() => history.goBack()}
        >
          {`<-- ${dict("forgot-password/back-link")}`}
        </p>
        <img alt="login logo" src={Logo}/>
        <h1>{dict("forgot-password/title")}</h1>
        <div className="login-error-message">{errorMessage}</div>
        <div className="login-error-message" style={{color: "green"}}>
          {successMessage}
        </div>
        <form className="forgot-password-form" onSubmit={forgotPasswordHandler}>
          <div className="login-input-wrapper">
            <p
              className="login-input-title"
              style={errorMessage ? {color: "red"} : null}
            >
              {dict("forgot-password/form/input/school-code/label")}
            </p>
            <select
              className="login-input"
              style={
                schoolCode === ""
                  ? {color: "#717c95"}
                  : null
              }
              onChange={(e) => {
                setErrorMessage('');
                handleCodeChange(e.target.value);
              }}
            >
              <option
                style={{color: "#717c95"}}
                value=""
              >
                {`-- ${dict("forgot-password/form/input/school-code/placeholder")} --`}
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
              style={errorMessage ? {color: "red"} : null}
            >
              {dict("forgot-password/form/input/school-year/label")}
            </p>
            <select
              className="login-input"
              style={
                year === ""
                  ? {color: "#717c95"}
                  : null
              }
              onChange={(e) => {
                setErrorMessage('');
                setYear(e.target.value);
              }}
            >
              <option
                style={{color: "#717c95"}}
                value=""
              >
                {`-- ${dict("forgot-password/form/input/school-year/placeholder")} --`}
              </option>
              {yearsList.map((y) => {
                return (
                  <option key={y.year} value={y.year}>
                    {y.year}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="login-input-wrapper">
            <p
              className="login-input-title"
              style={errorMessage ? {color: "red"} : null}
            >
              {dict("forgot-password/form/input/email/label")}
            </p>
            <input
              onChange={(e) => {
                setErrorMessage('');
                setEmailAddress(e.target.value);
              }}
              type="text"
              placeholder={dict("forgot-password/form/input/email/placeholder")}
              className="login-input"
              style={errorMessage ? {borderColor: "red"} : null}
            />
          </div>
          <button className="login-button">{dict("forgot-password/form/link-button")}</button>
        </form>
      </section>
    </div>
  );
};

export default ForgotPassword;
