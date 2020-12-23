import React, {useState, useEffect} from "react";
import {Redirect, useLocation} from "react-router-dom";
import Logo from "../../SchoolAPP Assets/schoolapp-login-logo.svg";

import { setNewPassword } from "../../services/authService";
import { setNextToken, setNextPage, getNextTokenFromLocalStorage } from "../../services/localStorageService";

import { useDict } from "../UI/Translations"

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [secondPassword, setSecondPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successCheck, setSuccessCheck] = useState(false);

  const dict = useDict("/login")

  let location = useLocation();

  const {pathname: nextPage, search} = location;
  let token = !!search ? search.split('=')[1] : null;
  if (token) {
    // console.log('4. RESET', token);
    setNextToken(token);
    setNextPage(nextPage);
  } else {
    token = getNextTokenFromLocalStorage();
  }

  const resetPassword = async (event) => {
    event.preventDefault ? event.preventDefault() : (event.returnValue = false);
    const data = {
      resetPasswordToken: token,
      newPassword: password,
    };

    const passwordCheck = comparePassword();
    if (passwordCheck) {
      let error = false;
      try {
        await setNewPassword(data);
      } catch (err) {
        console.error(err.message);
        setErrorMessage(dict("reset-password/form/message/error/invalid-token"));
        error = true;
      } finally {
        setNextToken('');
        setNextPage('');
        if (!error) {
          setSuccessCheck(true);
        }
      }
    }
  };

  const comparePassword = () => {
    if (password === "" || secondPassword === "") {
      setErrorMessage(dict("reset-password/form/message/error/missing-password"));
      return false;
    } else if (password !== secondPassword) {
      setErrorMessage(dict("reset-password/form/message/error/mismatched-passwords"));
      return false;
    } else {
      setErrorMessage("");
      return true;
    }
  };

  useEffect(() => {
  }, [successCheck]);

  if (successCheck) {
    return <Redirect to="/"/>;
  }

  return (
    <div className="forgot-password">
      <section className="forgot-password-container">
        <img alt="login logo" src={Logo}/>
        <h1>{dict("reset-password/title")}</h1>
        <div className="login-error-message">{errorMessage}</div>
        <form
          className="forgot-password-form"
          onSubmit={resetPassword}
        >
          <div className="login-input-wrapper">
            <p
              className="login-input-title"
              style={errorMessage ? {color: "red"} : null}
            >
              {dict("reset-password/form/input/password/label")}
            </p>
            <input
              onChange={(e) => {
                setErrorMessage('');
                setPassword(e.target.value)
              }}
              type="password"
              placeholder={dict("reset-password/form/input/password/placeholder")}
              className="login-input"
              style={errorMessage ? {borderColor: "red"} : null}
            />
          </div>
          <div className="login-input-wrapper">
            <p
              className="login-input-title"
              style={errorMessage ? {color: "red"} : null}
            >
              {dict("reset-password/form/input/confirm-password/label")}
            </p>
            <input
              onChange={(e) => {
                setErrorMessage('');
                setSecondPassword(e.target.value);
              }}
              type="password"
              placeholder={dict("reset-password/form/input/confirm-password/placeholder")}
              className="login-input"
              style={errorMessage ? {borderColor: "red"} : null}
            />
          </div>
          <button className="login-button" onClick={resetPassword}>
            {dict("reset-password/form/reset-button")}
          </button>
        </form>
      </section>
    </div>
  );
};

export default ResetPassword;
