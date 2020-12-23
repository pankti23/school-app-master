import React, {useContext, useLayoutEffect} from 'react'
import {Redirect} from 'react-router-dom'

import {UserContext} from "../../Contexts/UserContext";

import {isUserLoggedIn} from "../../services/authService";

const ProtectedRoute = ({component: Component, location}) => {
  const userState = useContext(UserContext);

  // console.log('3. Location', location);

  useLayoutEffect(() => {
    async function authenticate() {
      const user = await isUserLoggedIn();
      if (!user) {
        userState.logout();
      } else {
        userState.login(user);
      }
    }

    authenticate();
  }, [userState.isLoggedIn]);

  return userState.isLoggedIn ? (
    <Component/>
  ) : (
    <Redirect to={{pathname: '/'}}/>
  );

}

export default ProtectedRoute;
