import React, { useState, useContext, useRef } from "react";
import "./SectionStaff.css";

import Grouping from "../Grouping/Grouping";

import StaffIcon from "../../../../SchoolAPP Assets/school-teacher.svg";
import StudentsIcon from "../../../../SchoolAPP Assets/read-human.svg";
import SubjectsIcon from "../../../../SchoolAPP Assets/task-list-multiple.svg";

import { useDict } from "../../../UI/Translations";
const _ = require('lodash');

const SectionStaff = ({
  id,
  type,
  typeForStudent,
  tree,
  usersList,
  studentsList,
  groupSubjectTeachersList,
  margin
}) => {
  const dict = useDict("/configuration-page/school");

  const typeKey = type.charAt(0).toUpperCase() + type.slice(1);
  const typeKeyForStudent = typeForStudent.charAt(0).toUpperCase() + typeForStudent.slice(1);

  const users = usersList.filter(
    (user) => {
      if(user[typeKey] && !_.isArray(user[typeKey]) && user[typeKey].id === id){
        return user;
      } else if(_.isArray(user[typeKey])) {
        return user[typeKey].some((f) => {
          return f.id === id;
        });
      }
    }
  );

  const students = studentsList.filter(
    (student) => {
      if(student[typeKeyForStudent] && !_.isArray(student[typeKeyForStudent]) && student[typeKeyForStudent].id === id){
        return student;
      } else if(_.isArray(student[typeKeyForStudent])) {
        return student[typeKeyForStudent].some((f) => {
          return f.id === id;
        });
      }
    }
  );

  let subjectsLength = [];
  const campusPrincipalsLength = users.filter((user) => user.roleId === 4)
    .length;
  const levelPrincialsLength = users.filter((user) => user.roleId === 5).length;
  const teachersLength = users.filter(
    (user) => user.roleId === 6 || user.roleId === 7
  ).length;
  const studentsLength = students.length;
  const mainTeachersLength = users.filter((user) => user.roleId === 6).length;
  const subjectTeachersLength = users.filter((user) => user.roleId === 7)
    .length;

  if (type === "groups" || type === "group") {
    subjectsLength = groupSubjectTeachersList.filter(
      (subject) => subject.Group.id === id
    ).length;
  }

  const isIn = (arr) => arr.indexOf(type) !== -1;

  const getAdminStaffUrl = () => {
    let url = "/configuration-page/admin-staff";

    if (tree.campus !== null) url = `${url}?campus=${tree.campus}`;
    if (tree.level !== null) url = `${url}&level=${tree.level}`;

    return url;
  };

  const getTeachersUrl = (type) => {
    let url = "/configuration-page/teachers";

    if (tree.campus !== null) url = `${url}?campus=${tree.campus}`;
    if (tree.level !== null) url = `${url}&level=${tree.level}`;
    if (tree.grade !== null) url = `${url}&grade=${tree.grade}`;
    if (tree.group !== null) url = `${url}&group=${tree.group}`;
    if (type) url = `${url}&type=${type}`;

    return url;
  };

  return (
    <div className="config-section-staff">
      {isIn(["campus"]) && (
        <Grouping
          count={campusPrincipalsLength}
          fullWidth={true}
          type={
            campusPrincipalsLength === 1
              ? dict("group/members/principals")[0]
              : dict("group/members/principals")[1]
          }
          icon={StaffIcon}
          linkText={`${dict("group/members/go-to")} ${dict(
            "group/members/staff"
          )}`}
          link={getAdminStaffUrl()}
        />
      )}

      {isIn(["levels", "level"]) && (
        <Grouping
          count={levelPrincialsLength}
          type={dict("group/members/staff")}
          icon={StaffIcon}
          linkText={`${dict("group/members/go-to")} ${dict(
            "group/members/staff"
          )}`}
          link={getAdminStaffUrl()}
        />
      )}

      {isIn(["levels", "level"]) && (
        <Grouping
          count={teachersLength}
          type={
            teachersLength === 1
              ? dict("group/members/teachers")[0]
              : dict("group/members/teachers")[1]
          }
          icon={StudentsIcon}
          linkText={`${dict("group/members/go-to")} ${
            dict("group/members/teachers")[1]
          }`}
          link={getTeachersUrl()}
        />
      )}

      {isIn(["groups", "group"]) && (
        <Grouping
          count={mainTeachersLength}
          type={
            mainTeachersLength === 1
              ? dict("group/members/main-teachers")[0]
              : dict("group/members/main-teachers")[1]
          }
          icon={StudentsIcon}
          linkText={`${dict("group/members/go-to")} ${
            dict("group/members/teachers")[1]
          }`}
          link={getTeachersUrl("main")}
        />
      )}

      {isIn(["groups", "group"]) && (
        <Grouping
          count={subjectTeachersLength}
          type={
            subjectTeachersLength === 1
              ? dict("group/members/subject-teachers")[0]
              : dict("group/members/subject-teachers")[1]
          }
          icon={StudentsIcon}
          linkText={`${dict("group/members/go-to")} ${
            dict("group/members/teachers")[1]
          }`}
          link={getTeachersUrl("subject")}
        />
      )}

      {isIn(["groups", "group", "levels", "level"]) && (
        <Grouping
          count={studentsLength}
          type={
            studentsLength === 1
              ? dict("group/members/students")[0]
              : dict("group/members/students")[1]
          }
          icon={StudentsIcon}
          linkText={`${dict("group/members/go-to")} ${
            dict("group/members/students")[1]
          }`}
          link="/students-page"
        />
      )}

      {isIn(["groups", "group"]) && (
        <Grouping
          count={subjectsLength}
          type={
            subjectsLength === 1
              ? dict("group/members/subjects")[0]
              : dict("group/members/subjects")[1]
          }
          icon={SubjectsIcon}
          linkText={`${dict("group/members/go-to")} ${
            dict("group/members/subjects")[1]
          }`}
          link="/configuration-page/subjects"
        />
      )}
    </div>
  );
};

export default SectionStaff;
