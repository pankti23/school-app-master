import React, { useContext, useState, useEffect, useRef } from "react";
import "./SchoolConfig.css";
import Campus from "./Campus/Campus";
import { UserContext } from "../../../Contexts/UserContext";
import useOnClickOutside from "../../../CustomHooks/useOnClickOutside";

import axios from "axios";
import AddCampus from "./SchoolConfigModals/AddCampus/AddCampus";
import LoadingSpinner from "../../UI/LoadingSpinner";
import Button from "../../UI/Button";
import { getUsersList } from "../../../services/userService";
import { getGroupSubjectTeachersList } from "../../../services/groupSubjectTeachersService";
import { useDict } from "../../UI/Translations";

import { setCurrentPage } from "../../../services/localStorageService";
import { getStudentList } from "../../../services/studentService";

const baseUrl = process.env.REACT_APP_BASE_URL;

const SchoolConfig = () => {
  const [aNCModal, setANCModal] = useState(false);
  const [campusList, setCampusList] = useState([]);
  const [studentsList, setStudentsList] = useState([]);

  const [usersList, setUsersList] = useState([]);
  const [groupSubjectTeachersList, setGroupSubjectTeachersList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteError, setDeleteError] = useState("");

  const dict = useDict("/configuration-page/school");

  const userData = useContext(UserContext);

  setCurrentPage("/configuration-page/school");

  const ref = useRef();
  useOnClickOutside(ref, () => setANCModal(false));

  const getCampuses = async () => {
    const config = {
      method: "get",
      url: `${baseUrl}/campuses`,
      headers: {
        Authorization: userData.jwt
      }
    };
    const { status, data } = await axios(config);
    setIsLoading(false);
    setCampusList(data);
  };

  const getUsers = async () => {
    const result = await getUsersList();

    setUsersList(result);
  };

  const getStudents = async () => {
    const result = await getStudentList();

    setStudentsList(result);
  };

  const getGroupSubjectTeachers = async () => {
    const result = await getGroupSubjectTeachersList();

    setGroupSubjectTeachersList(result);
  };

  const deleteCampus = async (id, canDelete) => {
    const config = {
      method: "delete",
      url: `${baseUrl}/campuses/${id}`,
      headers: {
        Authorization: userData.jwt
      }
    };
    setIsLoading(true);
    if (canDelete) {
      let newList = campusList.filter((campus) => campus.id !== id);
      try {
        const { status, data } = await axios(config);
        setCampusList(newList);
        setIsLoading(false);
      } catch (e) {
        setIsLoading(false);
        console.error(e);
        setDeleteError(dict("main/message/error/not-empty"));
        setTimeout(function () {
          setDeleteError("");
        }, 3000);
      }
    }
  };

  const addNewCampusToList = (campusData) => {
    setCampusList([...campusList, campusData]);
  };

  useEffect(() => {
    getCampuses();
    getUsers();
    getStudents();
    getGroupSubjectTeachers();
  }, []);

  useEffect(() => {}, [aNCModal]);

  const closeModal = () => {
    setANCModal(false);
  };

  return (
    <div>
      {aNCModal ? (
        <div
          className="add-campus-modal-wrapper"
          style={aNCModal ? { display: "flex" } : { display: "none" }}
        >
          <span ref={ref}>
            <AddCampus
              closeModal={closeModal}
              addNewCampusToList={addNewCampusToList}
            />
          </span>
        </div>
      ) : null}
      <div className="config-school-container">
        <div className="config-header-container">
          <p className="config-school-header">{dict("main/header/title")}</p>
          <p className="config-school-paragraph">
            {dict("main/header/paragraph")}
          </p>
        </div>
        <div className="config-body-container config-school-container-align">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              {campusList.map((campus) => {
                return (
                  <Campus
                    campus={campus}
                    key={campus.id}
                    usersList={usersList}
                    studentsList={studentsList}
                    groupSubjectTeachersList={groupSubjectTeachersList}
                    deleteCampus={deleteCampus}
                    errorMessage={deleteError}
                    jwt={userData.jwt}
                  />
                );
              })}

              <Button
                size="large"
                color="green"
                width="100%"
                onClick={() => setANCModal(true)}
              >
                {dict("main/add-campus-button")}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SchoolConfig;
