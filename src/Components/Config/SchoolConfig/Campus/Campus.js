import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Campus.css";
import SectionHeader from "../SectionHeader/SectionHeader";
import SectionStaff from "../SectionStaff/SectionStaff";
import Level from "../Level/Level";
import AddLevel from "../SchoolConfigModals/AddSubLevel/AddSubLevel";
import AddIcon from "../../../../SchoolAPP Assets/plus.svg";
import InfoIcon from "../../../../SchoolAPP Assets/info-circle.svg";
import LoadingSpinner from "../../../UI/LoadingSpinner";
import Button from "../../../UI/Button";
import useOnClickOutside from "../../../../CustomHooks/useOnClickOutside";
import { useDict } from "../../../UI/Translations";

const baseUrl = process.env.REACT_APP_BASE_URL;

const Campus = (props) => {
  const [aNLModal, setANLModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [campusName, setCampusName] = useState(props.campus.name);
  const [levelsList, setLevelsList] = useState([]);
  const [deleteError, setDeleteError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [minimized, setMinimized] = useState(true);

  const {
    campus,
    deleteCampus,
    usersList,
    studentsList,
    groupSubjectTeachersList,
    closeEditDeleteModal
  } = props;

  const ref = useRef();

  const dict = useDict("/configuration-page/school");

  useOnClickOutside(ref, () => setANLModal(false));

  const getData = async () => {
    let config = {
      method: "get",
      url: `${baseUrl}/levels`,
      headers: {
        Authorization: props.jwt
      }
    };
    const { data } = await axios(config);
    setIsLoading(false);
    setLevelsList(data);
  };

  const addNewLevelToList = (levelData) => {
    setLevelsList([levelData, ...levelsList]);
  };

  const errorMessageHandler = (isError) => {
    isError
      ? setErrorMessage(dict("campus/message/error/campus-not-empty"))
      : setErrorMessage("");
    setTimeout(setErrorMessage(""), 3000);
  };

  const deleteLevel = async (id, canDeleteLevel) => {
    const config = {
      method: "delete",
      url: `${baseUrl}/levels/${id}`,
      headers: {
        Authorization: props.jwt
      }
    };

    setIsLoading(true);
    if (canDeleteLevel === 0) {
      let newList = levelsList.filter((level) => level.id !== id);
      try {
        const deletion = await axios(config);
        setIsLoading(false);
        setLevelsList(newList);
      } catch (e) {
        setIsLoading(false);
        setDeleteError(dict("campus/message/error/level-not-empty"));
        console.error(e, deleteError);
      }
    }
  };

  const setNewCampusName = (name) => {
    setCampusName(name);
  };

  const closeModal = () => {
    setANLModal(false);
  };

  useEffect(() => {}, [aNLModal]);

  useEffect(() => {
    getData();
  }, []);

  const levels = levelsList.filter(
    (level) => props.campus.id === level.campusId
  );

  return (
    <div className="config-campus-container">
      {aNLModal ? (
        <div
          className="add-campus-modal-wrapper"
          style={aNLModal ? { display: "flex" } : { display: "none" }}
        >
          <span ref={ref}>
            <AddLevel
              campusId={props.campus.id}
              campusName={props.campus.name}
              closeModal={closeModal}
              addNewLevelToList={addNewLevelToList}
            />
          </span>
        </div>
      ) : null}

      <div className="config-campus-container-align">
        {/* the type will determine which class to use */}
        <SectionHeader
          type={dict("main/type/campus")}
          typeEn="campus"
          typeId={campus.id}
          campus={campus}
          levelsLength={levelsList}
          deleteCampus={deleteCampus}
          minimized={minimized}
          errorMessageHandler={errorMessageHandler}
          setNewCampusName={setNewCampusName}
          onMinimizeClick={setMinimized}
        />

        {isLoading && !minimized && <LoadingSpinner />}

        {!isLoading && !minimized && (
          <>
            <SectionStaff
              type="campus"
              typeForStudent="campus"
              id={campus.id}
              tree={{
                campus: campus.id,
                level: null,
                grade: null,
                group: null
              }}
              usersList={usersList}
              studentsList={studentsList}
              groupSubjectTeachersList={groupSubjectTeachersList}
              margin="0 0 20px 0"
            />

            {errorMessage && (
              <p style={{ color: "red", alignSelf: "flex-end" }}>
                {errorMessage}
              </p>
            )}

            {!minimized && (
              <Button
                color="grey"
                image={AddIcon}
                onClick={() => setANLModal(!aNLModal)}
                size="default"
                width="100%"
              >
                {`${dict("campus/add-level-button")} ${campusName}`}
              </Button>
            )}

            {levels.length === 0 && (
              <div className="empty-structure">
                <img src={InfoIcon} alt="" />

                {dict("campus/message/error/level-structure-empty")}
              </div>
            )}

            {levels.length > 0 &&
              levels.map((level) => (
                <Level
                  campus={campus}
                  deleteError={deleteError}
                  deleteLevel={deleteLevel}
                  groupSubjectTeachersList={groupSubjectTeachersList}
                  jwt={props.jwt}
                  key={level.id}
                  level={level}
                  typeId={`${campus.id}-${level.id}`}
                  usersList={usersList}
                  studentsList={studentsList}
                />
              ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Campus;
