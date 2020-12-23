import React, { useState, useEffect } from "react";
import SectionHeader from "../SectionHeader/SectionHeader";
import "./Group.css";
import SectionStaff from "../SectionStaff/SectionStaff";
import { useDict } from "../../../UI/Translations";

const Group = ({
  campus,
  deleteGroup,
  grade,
  group,
  groupSubjectTeachersList,
  level,
  typeId,
  usersList,
  studentsList
}) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [minimized, setMinimized] = useState(true);

  const dict = useDict("/configuration-page/school");

  const errorMessageHandler = (isError) => {
    isError
      ? setErrorMessage(dict("group/message/error/group-not-empty"))
      : setErrorMessage("");
  };

  return (
    <div className="config-group-container">
      <SectionHeader
        campus={group}
        deleteGroup={deleteGroup}
        errorMessageHandler={errorMessageHandler}
        groupingsLength={group.mainTeacher}
        minimized={minimized}
        onMinimizeClick={setMinimized}
        type={dict("main/type/group")}
        typeEn="group"
        typeId={typeId}
      />

      {!minimized && (
        <div className="config-groupings-contaier">
          <SectionStaff
            groupSubjectTeachersList={groupSubjectTeachersList}
            id={group.id}
            type="groups"
            typeForStudent="group"
            tree={{
              campus: campus.id,
              level: level.id,
              grade: grade.id,
              group: group.id
            }}
            usersList={usersList}
            studentsList={studentsList}
          />
        </div>
      )}
    </div>
  );
};

export default Group;
