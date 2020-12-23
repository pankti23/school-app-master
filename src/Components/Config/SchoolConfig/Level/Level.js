import React, { useState, useEffect, useRef } from "react";
import SectionHeader from "../SectionHeader/SectionHeader";
import axios from "axios";
import "./Level.css";
import Grade from "../Grade/Grade";
import AddGrade from "../SchoolConfigModals/AddGrade/AddGrade";
import SectionStaff from "../SectionStaff/SectionStaff";
import AddIcon from "../../../../SchoolAPP Assets/plus.svg";
import InfoIcon from "../../../../SchoolAPP Assets/info-circle.svg";
import LoadingSpinner from "../../../UI/LoadingSpinner";
import Button from "../../../UI/Button";
import useOnClickOutside from "../../../../CustomHooks/useOnClickOutside";
import { useDict } from "../../../UI/Translations";

const baseUrl = process.env.REACT_APP_BASE_URL;

const Level = (props) => {
  const [gradesList, setGradesList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [levelName, setLevelName] = useState(props.level.name);
  const [aNGModal, setANGModal] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [minimized, setMinimized] = useState(true);

  const { level, jwt, studentsList } = props;

  const dict = useDict("/configuration-page/school");

  const ref = useRef();
  useOnClickOutside(ref, () => setANGModal(false));

  const getData = async () => {
    const config = {
      method: "get",
      url: `${baseUrl}/grades`,
      headers: {
        Authorization: jwt
      }
    };
    const { data } = await axios(config);
    setIsLoading(false);
    setGradesList(data);
  };

  const errorMessageHandler = (isError) => {
    isError
      ? setErrorMessage(dict("level/message/error/level-not-empty"))
      : setErrorMessage("");
  };

  const closeModal = () => {
    setANGModal(false);
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {}, [aNGModal]);

  const addNewGradeToList = (gradeData) => {
    setGradesList([gradeData, ...gradesList]);
  };

  const setNewLevelName = (name) => {
    setLevelName(name);
  };

  const deleteGrade = async (id, canDeleteGrade) => {
    const config = {
      method: "delete",
      url: `${baseUrl}/grades/${id}`,
      headers: {
        Authorization: jwt
      }
    };
    console.log("delete Level Check", id, canDeleteGrade);
    setIsLoading(true);
    if (canDeleteGrade === 0) {
      let newList = gradesList.filter((grade) => grade.id !== id);
      try {
        const deletion = await axios(config);
        setIsLoading(false);
        setGradesList(newList);
      } catch (e) {
        setIsLoading(false);
        setDeleteError(dict("level/message/error/level-not-empty"));
        console.error(e, deleteError);
      }
    }
  };

  const grades = gradesList.filter((grade) => level.id === grade.levelId);

  return (
    <div className="config-level-container">
      {aNGModal ? (
        <div
          className="add-campus-modal-wrapper"
          style={aNGModal ? { display: "flex" } : { display: "none" }}
        >
          <span ref={ref}>
            <AddGrade
              campusId={level.id}
              levelName={level.name}
              closeModal={closeModal}
              addNewGradeToList={addNewGradeToList}
            />
          </span>
        </div>
      ) : null}
      <SectionHeader
        type={dict("main/type/level")}
        typeEn="level"
        typeId={props.typeId}
        campus={level}
        errorMessageHandler={errorMessageHandler}
        gradesLength={gradesList}
        deleteLevel={props.deleteLevel}
        minimized={minimized}
        setNewLevelName={setNewLevelName}
        onMinimizeClick={setMinimized}
      />

      {isLoading && !minimized && <LoadingSpinner />}

      {!isLoading && !minimized && (
        <>
          <SectionStaff
            groupSubjectTeachersList={props.groupSubjectTeachersList}
            id={props.level.id}
            margin="0 0 20px 0"
            tree={{
              campus: props.campus.id,
              level: level.id,
              grade: null,
              group: null
            }}
            studentsList={studentsList}
            type="levels"
            typeForStudent="level"
            usersList={props.usersList}
          />

          <Button
            size="default"
            color="grey"
            width="100%"
            image={AddIcon}
            onClick={() => setANGModal(!aNGModal)}
          >
            {`${dict("level/add-grade-button")} ${levelName}`}
          </Button>

          {grades.length === 0 && (
            <div className="empty-structure">
              <img src={InfoIcon} alt="" />
              {dict("level/message/error/grade-structure-empty")}
            </div>
          )}

          {grades.length > 0 &&
            grades.map((grade) => (
              <Grade
                campus={props.campus}
                deleteError={deleteError}
                deleteGrade={deleteGrade}
                grade={grade}
                gradeName={grade.name}
                groupSubjectTeachersList={props.groupSubjectTeachersList}
                jwt={jwt}
                key={grade.id}
                level={level}
                typeId={`${props.typeId}-${grade.id}`}
                usersList={props.usersList}
                studentsList={studentsList}
              />
            ))}
        </>
      )}
    </div>
  );
};

export default Level;
