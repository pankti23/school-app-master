import React, { useState, useEffect, useRef } from "react";
import "./Grade.css";
import SectionHeader from "../SectionHeader/SectionHeader";
import axios from "axios";
import AddGroup from "../SchoolConfigModals/AddGroup/AddGroup";
import Group from "../Group/Group";
import AddIcon from "../../../../SchoolAPP Assets/plus.svg";
import InfoIcon from "../../../../SchoolAPP Assets/info-circle.svg";
import LoadingSpinner from "../../../UI/LoadingSpinner";
import Button from "../../../UI/Button";
import useOnClickOutside from "../../../../CustomHooks/useOnClickOutside";
import { useDict } from "../../../UI/Translations";

const baseUrl = process.env.REACT_APP_BASE_URL;

const Grade = (props) => {
  const [groupsList, setGroupsList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [gradeName, setGradeName] = useState(props.grade.name);
  const [aNGrModal, setANGrModal] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [minimized, setMinimized] = useState(true);

  const { grade, jwt, studentsList } = props;

  const dict = useDict("/configuration-page/school");

  const ref = useRef();
  useOnClickOutside(ref, () => setANGrModal(false));

  const getData = async () => {
    const config = {
      method: "get",
      url: `${baseUrl}/groups`,
      headers: {
        Authorization: jwt
      }
    };
    const { data } = await axios(config);
    setIsLoading(false);
    setGroupsList(data);
  };

  const deleteGroup = async (id, canDeleteGroup) => {
    const config = {
      method: "delete",
      url: `${baseUrl}/groups/${id}`,
      headers: {
        Authorization: jwt
      }
    };
    console.log("delete Group Check", id, canDeleteGroup);
    setIsLoading(true);
    if (canDeleteGroup === true) {
      let newList = groupsList.filter((grade) => grade.id !== id);
      try {
        const deletion = await axios(config);
        setIsLoading(false);
        setGroupsList(newList);
      } catch (e) {
        setIsLoading(false);
        setDeleteError(dict("grade/message/error/level-not-empty"));
        console.error(e, deleteError);
      }
    }
  };

  const errorMessageHandler = (isError) => {
    isError
      ? setErrorMessage(dict("grade/message/error/grade-not-empty"))
      : setErrorMessage("");
  };

  const closeModal = () => {
    setANGrModal(false);
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {}, [aNGrModal]);

  const addNewGroupToList = (groupData) => {
    setGroupsList([...groupsList, groupData]);
  };

  const setNewGradeName = (name) => {
    setGradeName(name);
  };

  const groups = groupsList.filter((group) => grade.id === group.gradeId);

  return (
    <div className="config-grade-container">
      {aNGrModal ? (
        <div
          className="add-campus-modal-wrapper"
          style={aNGrModal ? { display: "flex" } : { display: "none" }}
        >
          <span ref={ref}>
            <AddGroup
              campusId={grade.id}
              gradeName={grade.name}
              closeModal={closeModal}
              addNewGroupToList={addNewGroupToList}
            />
          </span>
        </div>
      ) : null}
      <SectionHeader
        type={dict("main/type/grade")}
        typeEn="grade"
        typeId={props.typeId}
        campus={grade}
        errorMessageHandler={errorMessageHandler}
        groupsLength={groupsList}
        deleteGrade={props.deleteGrade}
        minimized={minimized}
        setNewGradeName={setNewGradeName}
        onMinimizeClick={setMinimized}
      />
      <div
        className="config-groups"
        style={{
          marginBottom: groupsList.length > 0 && !minimized ? "30px" : 0
        }}
      >
        {isLoading && <LoadingSpinner />}

        {!isLoading && !minimized && (
          <>
            {groups.length === 0 && (
              <div className="empty-structure">
                <img src={InfoIcon} alt="" />
                {dict("grade/message/error/group-structure-empty")}
              </div>
            )}
            {groups.length > 0 &&
              groups.map((group) => (
                <Group
                  deleteError={deleteError}
                  deleteGroup={deleteGroup}
                  campus={props.campus}
                  level={props.level}
                  grade={props.grade}
                  group={group}
                  groupSubjectTeachersList={props.groupSubjectTeachersList}
                  jwt={jwt}
                  key={group.id}
                  typeId={`${props.typeId}-${group.id}`}
                  usersList={props.usersList}
                  studentsList={studentsList}
                />
              ))}
          </>
        )}
      </div>
      {!minimized && (
        <Button
          size="default"
          color="grey"
          width="100%"
          image={AddIcon}
          onClick={() => setANGrModal(!aNGrModal)}
        >
          {`${dict("grade/add-group-button")} ${gradeName}`}
        </Button>
      )}
    </div>
  );
};

export default Grade;
