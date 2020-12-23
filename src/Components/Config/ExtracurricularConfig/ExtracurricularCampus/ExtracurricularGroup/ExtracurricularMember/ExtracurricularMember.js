import React from "react";
import { Link } from "react-router-dom";

import ExternalIcon from "../../../../../../SchoolAPP Assets/external.svg";
import ReadHumanIcon from "../../../../../../SchoolAPP Assets/read-human.svg";
import SchoolTeacherIcon from "../../../../../../SchoolAPP Assets/school-teacher.svg";
import { useDict } from "../../../../../UI/Translations";

import "./ExtracurricularMember.css";

const ExtracurricularMember = (props) => {
  const { link, memberCount, memberType } = props;

  const dict = useDict("/configuration-page/extracurricular");

  return (
    <div className="extracurricular-campus-group-member-button">
      <div className="extracurricular-campus-group-member-button-container">
        <div className="extracurricular-campus-group-member-left-container">
          {memberType === dict("group/member/type/teachers") ? (
            <img
              alt="school-teacher-icon"
              src={SchoolTeacherIcon}
              style={{ minWidth: "18px" }}
            />
          ) : (
            <img
              alt="read-human-icon"
              src={ReadHumanIcon}
              style={{ minWidth: "17px" }}
            />
          )}

          <span className="extracurricular-campus-group-member-left-text">
            {memberCount +
              " " +
              (memberCount / 1 === 1
                ? memberType === dict("group/member/type/teachers")
                  ? dict("group/member/type/teachers-2")[0]
                  : dict("group/member/type/students-2")[0]
                : memberType === dict("group/member/type/teachers")
                ? dict("group/member/type/teachers-2")[1]
                : dict("group/member/type/students-2")[1])}
          </span>
        </div>

        <div className="extracurricular-campus-group-member-right-container">
          <Link to={link}>
            <span className="extracurricular-campus-group-member-right-text">
              {`${dict("group/member/external")} ${memberType}`}
            </span>

            <img
              alt="external-icon"
              src={ExternalIcon}
              style={{ minWidth: "12px" }}
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ExtracurricularMember;
