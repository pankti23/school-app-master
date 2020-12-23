import React, {useState, useEffect} from "react";
import { Redirect, useLocation } from "react-router-dom";
import Logo from "../../SchoolAPP Assets/schoolapp-login-logo.svg";
import LegalLinks from "./LegalLinks";
import { getSchoolCodes, activateUser } from "../../services/authService";

import {getNextTokenFromLocalStorage, setNextPage, setNextToken} from "../../services/localStorageService";

import { useDict } from "../UI/Translations"

const CreatePassword = () => {
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [secondPassword, setSecondPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorMessageTwo, setErrorMessageTwo] = useState("");
  const [successCheck, setSuccessCheck] = useState(false);

  const dict = useDict("/login")

  let location = useLocation();

  const {pathname: nextPage, search} = location;
  let token = !!search ? search.split('=')[1] : null;
  if (token) {
    console.log('5. ACTIVATE', token);
    setNextToken(token);
    setNextPage(nextPage);
  } else {
    token = getNextTokenFromLocalStorage();
  }


  const activateUserAccount = async (event) => {
    event.preventDefault ? event.preventDefault() : (event.returnValue = false);
    const data = {
      activationToken: token,
      password: password,
      name: fullName,
    };

    const passwordCheck = comparePassword();
    if (passwordCheck && fullName !== "") {
      let error = false;
      try {
        await activateUser(data);
      } catch (err) {
        console.error(err);
        setErrorMessageTwo(dict("create-password/form/message/error/invalid-token"));
        error = true;
      } finally {
        setNextToken('');
        setNextPage('');
        if (!error) {
          setSuccessCheck(true);
        }
      }
    } else {
      setErrorMessageTwo(dict("create-password/form/message/error/mismatched-passwords-name"));
    }
  };

  const comparePassword = () => {
    if (password === "" || secondPassword === "") {
      setErrorMessage(dict("create-password/form/message/error/missing-password"));
      return false;
    } else if (password !== secondPassword) {
      setErrorMessage(dict("create-password/form/message/error/mismatched-passwords"));
      return false;
    } else {
      setErrorMessage("");
      return true;
    }
  };

  useEffect(() => {
  }, [setSuccessCheck]);

  if (successCheck || !token) {
    return <Redirect to="/"/>;
  }

  return (
    <div className="forgot-password">
      <section className="forgot-password-container">
        <img alt="login logo" src={Logo}/>
        <h1>{dict("create-password/title")}</h1>
        <div className="login-error-message">{errorMessageTwo}</div>
        <div className="login-error-message">{errorMessage}</div>
        <form
          className="forgot-password-form"
          onSubmit={(e) => activateUserAccount(e)}
        >
          <div className="login-input-wrapper">
            <p
              className="login-input-title"
              style={errorMessage ? {color: "red"} : null}
            >
              {dict("create-password/form/input/name/label")}
            </p>
            <input
              onChange={(e) => {
                setErrorMessage('');
                setErrorMessageTwo('');
                setFullName(e.target.value);
              }}
              type="text"
              placeholder={dict("create-password/form/input/name/placeholder")}
              className="login-input"
              style={errorMessage ? {borderColor: "red"} : null}
            />
          </div>
          <div className="login-input-wrapper">
            <p
              className="login-input-title"
              style={errorMessage ? {color: "red"} : null}
            >
              {dict("create-password/form/input/password/label")}
            </p>
            <input
              onChange={(e) => {
                setErrorMessage('');
                setErrorMessageTwo('');
                setPassword(e.target.value);
              }}
              type="password"
              placeholder={dict("create-password/form/input/password/placeholder")}
              className="login-input"
              style={errorMessage ? {borderColor: "red"} : null}
            />
          </div>
          <div className="login-input-wrapper">
            <p
              className="login-input-title"
              style={errorMessage ? {color: "red"} : null}
            >
              {dict("create-password/form/input/confirm-password/label")}
            </p>
            <input
              onChange={(e) => {
                setErrorMessage('');
                setErrorMessageTwo('');
                setSecondPassword(e.target.value);
              }}
              type="password"
              placeholder={dict("create-password/form/input/confirm-password/placeholder")}
              className="login-input"
              style={errorMessage ? {borderColor: "red"} : null}
            />
          </div>
          <button type="submit" className="login-button">
            {dict("create-password/form/login-button")}
          </button>
        </form>
        <LegalLinks/>
      </section>
    </div>
  );
};

export default CreatePassword;
