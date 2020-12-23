import React, { Component, createContext } from "react";
import { Redirect } from "react-router-dom"

export const UserContext = createContext();

const initialState = {
  id: 0,
  name: "",
  email: "",
  photo: null,
  isActive: false,
  emailVerified: false,
  roleId: 0,
  Role: {
    id: 0,
    name: "",
    description: ""
  },
  jwt: "",
  campusId: null,
  isLoggedIn: false
};

class UserContextProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {...initialState};
  }

  login = userData => {
    this.setState({...userData, isLoggedIn: true});
  };
  logout = () => {
    this.setState({...initialState});
    console.log("state was reset");
  }
  updatePhoto = photoPath => {
    const newState = {...this.state};
    newState.photo = photoPath
    this.setState(newState)
  }
  render() {
    return (
      <UserContext.Provider value={{ ...this.state, login: this.login, logout: this.logout, updatePhoto: this.updatePhoto }}>
        {this.props.children}
        {this.state.name ? null : <Redirect to="/" />}
      </UserContext.Provider>
    );
  }
}

export default UserContextProvider;

/*
{
  "id": 1,
  "name": "John Doe",
  "email": "john.doe@example.com",
  "isActive": true,
  "emailVerified": true,
  "roleId": 2,
  "Role": {
    "id": 2,
    "name": "Admin"
  },
  "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwic2NoZW1hTmFtZSI6ImFiY19zY2hvb2wiLCJpc1N1cGVyVXNlciI6ZmFsc2UsImlzQWRtaW4iOnRydWUsImV4cCI6MTU4OTMwMjI3NiwiaWF0IjoxNTg0MTE4Mjc2fQ.8CohaWrC6YqrEPSXC_Pke1G-5y_lB4BmKQumEAuUxPo",
  "campusId": null,
  "Campus": null,
  "levelId": null,
  "Level": null,
  "Grades": null,
  "Groups": null,
  "Subjects": null,
  "Students": null,
  "AfterSchoolGroups": null
}
*/

// state = {
//   id: 1,
//   name: "John Doe",
//   email: "john.doe@example.com",
//   photo: null,
//   isActive: true,
//   emailVerified: true,
//   roleId: 2,
//   Role: {
//     id: 2,
//     name: "Admin"
//   },
//   jwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwic2NoZW1hTmFtZSI6ImFiY19zY2hvb2wiLCJpc1N1cGVyVXNlciI6ZmFsc2UsImlzQWRtaW4iOnRydWUsImV4cCI6MTU4OTMwMjI3NiwiaWF0IjoxNTg0MTE4Mjc2fQ.8CohaWrC6YqrEPSXC_Pke1G-5y_lB4BmKQumEAuUxPo",
// }
