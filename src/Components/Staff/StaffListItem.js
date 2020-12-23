import React, { useState, useEffect, useRef } from "react";
import DotsIcon from "../../SchoolAPP Assets/DotsHorizontal";
import "./StaffListItem.css";
import DeleteRenameModal from "./StaffModals/StaffListDeleteRenameModal";
import useOnClickOutside from "../../CustomHooks/useOnClickOutside";

import { MdCheckBox } from "react-icons/md";
import moment from "moment";
import 'moment/locale/es'

import { getLocale, useDict } from "../UI/Translations"

const StaffListItem = (props) => {
  const [checkBox, setCheckBox] = useState(false);
  const [deleteRenameModal, setDeleteRenameModal] = useState(false);

  const dict = useDict("/staff-members-page")

  const ref = useRef();
  useOnClickOutside(ref, () => {
    setDeleteRenameModal(false);
  });

  const user = props.user;

  const handleCheckBox = () => {
    if (checkBox === true) {
      return props.switchCheck(user.id, "removeOne");
    } else if (!checkBox) {
      return props.switchCheck(user.id, "addOne");
    }
  };

  useEffect(() => {
    setCheckBox(props.checkBoxCheck);
  }, [props.checkBoxCheck]);

  const checkIfNull = (list, isArr) => {
    if (list) {
      if (isArr) {
        return list.map(item => {
          return (<span key={item.id}>{item.name}{`${list.length > 1 ? ',' : ''}`} </span>);
        })
      } else {
        return list.name
      }
    } else {
      return <span>{dict("staff-table/body/empty-placeholder")}</span>;
    }
  };

  moment.locale(getLocale())

  return (
    <React.Fragment>
      <>
        <td role="cell" className="staff-table-label-checkbox-wrapper">
          {checkBox ? (
            <div className="test-box">
              <MdCheckBox className="checkbox-icon" onClick={handleCheckBox} />
            </div>
          ) : (
              <div className="test-box">
                <div
                  className="unchecked-staff-list-item-box"
                  onClick={handleCheckBox}
                ></div>
              </div>
            )}
        </td>
        <td role="cell">
          <p className="staff-list-item-text">
              {user.name} <span className="gray-color">({user.email})</span>
          </p>
          {/* <div className="tooltip">
            <p className="staff-list-item-text">
              {user.name} <span className="gray-color">({user.email})</span>
            </p>
            <span className="tooltiptext">{user.name} ({user.email})</span>
          </div> */}
        </td>
        <td role="cell">
          <p className="staff-list-item-text">{user.Role.name}</p>
          {/* <div className="tooltip">
            <p className="staff-list-item-text">{user.Role.name}</p>
            <span className="tooltiptext">{user.Role.name}</span>
          </div> */}
        </td>
        <td role="cell">
          <p className="staff-list-item-text">{checkIfNull(user.Campus, false)}</p>
          {/* <div className="tooltip">
            <p className="staff-list-item-text">{checkIfNull(user.Campus, false)}</p>
            <span className="tooltiptext">{checkIfNull(user.Campus, false)}</span>
          </div> */}
        </td>
        <td role="cell">
          <p className="staff-list-item-text">{checkIfNull(user.Levels, true)}</p>
          {/* <div className="tooltip">
            <p className="staff-list-item-text">{checkIfNull(user.Level, false)}</p>
            <span className="tooltiptext">{checkIfNull(user.Level, false)}</span>
          </div> */}
        </td>
        <td role="cell">
          <p className="staff-list-item-text">{checkIfNull(user.Grades, true)}</p>
          {/* <div className="tooltip">
            <p className="staff-list-item-text">{checkIfNull(user.Grades, true)}</p>
            <span className="tooltiptext" style={{color: "#fff"}}>{checkIfNull(user.Grades, true)}</span>
          </div> */}
        </td>
        <td role="cell">
          <p className="staff-list-item-text">{checkIfNull(user.Groups, true)}</p>
          {/* <div className="tooltip">
            <p className="staff-list-item-text">{checkIfNull(user.Groups, true)}</p>
            <span className="tooltiptext" style={{color: "#fff"}}>{checkIfNull(user.Groups, true)}</span>
          </div> */}
        </td>
        <td role="cell">
          <p className="staff-list-item-text">{checkIfNull(user.AfterSchoolGroups, true)}</p>
          {/* <div className="tooltip">
            <p className="staff-list-item-text">{checkIfNull(user.AfterSchoolGroups, true)}</p>
            <span className="tooltiptext" style={{color: "#fff"}}>{checkIfNull(user.AfterSchoolGroups, true)}</span>
          </div> */}
        </td>
        <td role="cell">
          <div style={{ justifyContent: 'center', alignItems: 'center' }}>
            <p style={{ textAlign: "center" }}>{user.lastLogin ? moment(user.lastLogin).fromNow(): '-'}</p>
          </div>
        </td>
        <td role="cell">
          <div className="inner-div">
            <p className="staff-list-item-text staff-list-more-button" onClick={() => { setDeleteRenameModal(true) }}>
              {`${dict("staff-table/body/button/more") }`}
              <DotsIcon
                height="15px"
                width="15px"
                stroke="none"
                fill="#000000"
                style={{ marginLeft: "5px", paddingTop: "6px" }}
              />
            </p>
          </div>
        </td>
      </>
      {deleteRenameModal ? (
          <div ref={ref} className="staff-list-delete-rename-modal">
            <DeleteRenameModal handleDeleteRenameResendSingleItem={props.handleDeleteRenameResendSingleItem} userId={user.id} />
          </div>
        ) : null}
    </React.Fragment>
  );
};

export default StaffListItem;
