import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

import SearchIcon from "../../SchoolAPP Assets/Search";
import StaffListItem from "./StaffListItem";
import StaffListPagination from "./StaffListPagination";
import StaffListDelete from "./StaffModals/StaffListDelete";
import StaffListModify from "./StaffModals/InviteModifyModal";
import StaffMultiModifyModal from "./StaffModals/StaffMultiModifyModal";
import useOnClickOutside from "../../CustomHooks/useOnClickOutside";

import { useDict } from "../UI/Translations"

import { MdCheckBox } from "react-icons/md";

import "./StaffListWrapper.css";
import { resendEmailActivationToken } from "../../services/authService";

const baseUrl = process.env.REACT_APP_BASE_URL;

const StaffListWrapper = (props) => {
  const { setUpdated } = props;
  const [search, setSearch] = useState("");
  const [listOfCheckedBoxes, setListOfCheckedBoxes] = useState([]);
  const [displayIndexStart, setDisplayIndexStart] = useState(0);
  const [displayIndexEnd, setDisplayIndexEnd] = useState(0);
  const [displayAmount, setDisplayAmount] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
  const [modifyModal, setModifyModal] = useState(false);
  const [multiModifyModal, setMultiModifyModal] = useState(false);

  const dict = useDict("/staff-members-page")

  const [successResend, setSuccessResend] = useState(false);
  const [message, setResendMessage] = useState("");

  let staffList = props.mainStaffList;

  const ref = useRef();
  
  useOnClickOutside(ref, () => {
    setConfirmDeleteModal(false);
  });

  const refSuccessResend = useRef();
  useOnClickOutside(refSuccessResend, () => setSuccessResend(false));

  const modRef = useRef();
  useOnClickOutside(modRef, () => {
    setModifyModal(false);
  });

  const handleDisplayAmount = (amount) => {
    setDisplayAmount(amount);
  };

  const handleDisplayRange = (minUserNum, maxUserNum) => {
    setDisplayIndexStart(minUserNum);
    setDisplayIndexEnd(maxUserNum);
  };

  const handlePageChange = (pageNum) => {
    setPageNumber(pageNum);
  };

  const handleListOfCheckedBoxes = (id, type) => {
    if (type === "addAll") {
      const users = staffList
        .slice(displayIndexStart, displayAmount)
        .map((user) => {
          return user.id;
        });
      setListOfCheckedBoxes(users);
    } else if (type === "removeAll") {
      setListOfCheckedBoxes([]);
    } else if (type === "addOne") {
      setListOfCheckedBoxes([id]);
    } else if (type === "removeOne") {
      const newList = listOfCheckedBoxes.filter((listId) => {
        return listId !== id;
      });
      setListOfCheckedBoxes(newList);
    }
  };

  const updateSliceParamsForDisplay = () => {
    const minUserNum = ((displayAmount * pageNumber) - displayAmount);
    const maxUserNum = displayAmount * pageNumber;
    handleDisplayRange(minUserNum, maxUserNum);
  };

  const handleDeleteRenameResendSingleItem = async (type, id) => {
    if (type === "delete") {
      setListOfCheckedBoxes([id])
      setConfirmDeleteModal(true)
    } else if (type === "edit") {
      setListOfCheckedBoxes([id])
      setModifyModal(true)
    } else if (type === 'resend') {
      try {
        const data = await resendEmailActivationToken(id);
        if(data){
          if (data.message === "A new activation token was generated and an email sent to the user.") {
            setResendMessage(dict("staff-table/body/resend/message/success/sent"));
          } else {
            setResendMessage(data.message);
          }
          setSuccessResend(true);
        }
      } catch (e) {
        if(e && e.message && e.message === 'User Not Found!'){
          setResendMessage(dict("staff-table/body/resend/message/error/activated"));  
        } else {
          setResendMessage(e.message);
        }
        setSuccessResend(true);
      }

    }
  }

  useEffect(() => {
    updateSliceParamsForDisplay();
  }, [pageNumber, listOfCheckedBoxes, displayAmount]);

  const mappedUsers = staffList
    .slice(displayIndexStart, displayIndexEnd)
    .map((user) => {
      return (
        <tr role="row" className="staff-list-item-border" key={user.id}>
          <StaffListItem
            checkBoxCheck={listOfCheckedBoxes.includes(user.id) ? true : false}
            switchCheck={handleListOfCheckedBoxes}
            user={user}
            handleDeleteRenameResendSingleItem={handleDeleteRenameResendSingleItem}
          />
        </tr>
      );
    });

  const searchMappedUsers = staffList
    .filter((user) => user.name.toLowerCase().includes(search.toLowerCase()))
    .map((user) => {
      return (
        <tr role="row" className="staff-list-item-border" key={user.id}>
          <StaffListItem
            checkBoxCheck={listOfCheckedBoxes.includes(user.id) ? true : false}
            switchCheck={handleListOfCheckedBoxes}
            user={user}
            handleDeleteRenameResendSingleItem={handleDeleteRenameResendSingleItem}
          />
        </tr>
      );
    });

  return (
    <div className="position-relative">
      {successResend ? (
        <div className="confirm-section-header-school-config">
          <div ref={refSuccessResend} className="user-save-success">
            <h1 className="user-info-modal-heading">
              {message}
            </h1>
          </div>
        </div>
      ) : null}
      {confirmDeleteModal ? (
        <div className="confirm-section-header-school-config">
          <span ref={ref}>
            <StaffListDelete
              closeModal={setConfirmDeleteModal}
              deleteList={listOfCheckedBoxes}
              setUpdated={setUpdated}
              setListOfCheckedBoxes={setListOfCheckedBoxes}
            />
          </span>
        </div>
      ) : null}
      {multiModifyModal ? (
         <div className="confirm-section-header-school-config">
          <span ref={modRef}>
            <StaffMultiModifyModal
              closeModal={setMultiModifyModal}
              modifyList={listOfCheckedBoxes}
              staffList={staffList}
              setUpdated={setUpdated}
              setListOfCheckedBoxes={setListOfCheckedBoxes}
            />
          </span>
        </div>
      ) : null}
      {modifyModal ? (
        <div className="confirm-section-header-school-config">
          <span ref={modRef}>
            <StaffListModify
              isMultipleModify={false}
              closeModal={setModifyModal}
              modifyList={listOfCheckedBoxes}
              staffList={staffList}
              setUpdated={setUpdated}
              setListOfCheckedBoxes={setListOfCheckedBoxes}
            />
          </span>
        </div>
      ) : null}
      <div className="staff-table">
        <div className="staff-table-wrapper">
          <div className="staff-table-head-row">
            <div className="staff-table-head-row-search">
              <SearchIcon
                style={{}}
                width="1rem"
                height="1rem"
                fill="#000000"
                stroke="none"
              />
              <input
                onChange={(e) => {
                  setSearch(e.target.value);
                  // setListOfCheckedBoxes([]);
                }}
                type="text"
                placeholder={dict("staff-table/search-input")}
              />
            </div>
            <ul className="staff-table-head-row-actions">
              <li>
                <span onClick={() => props.openFilterModal(true)}>{dict("staff-table/button/filter")}</span>
              </li>
              {listOfCheckedBoxes.length > 0 && (
              <li>
                <span onClick={() => {
                    listOfCheckedBoxes.length > 1 ?  setMultiModifyModal(true) : setModifyModal(true)
                  }}>{dict("staff-table/button/modify")}</span>
              </li>)}
            </ul>
          </div>
          <div className="table-responsive staff-table-new">
            <table className="table table-bordered staff-tbl">
              <thead>
                <tr role="row">
                  <th className="w1">
                    <span></span>
                  </th>
                  <th className="w2">
                    <span>{dict("staff-table/head/name")}</span>
                  </th>
                  <th className="w3">
                    <span>{dict("staff-table/head/role")}</span>
                  </th>
                  <th className="w4">
                    <span>{dict("staff-table/head/campus")}</span>
                  </th>
                  <th className="w5">
                    <span>{dict("staff-table/head/level")}</span>
                  </th>
                  <th className="w6">
                    <span>{dict("staff-table/head/grade")}</span>
                  </th>
                  <th className="w7">
                    <span>{dict("staff-table/head/group")}</span>
                  </th>
                  <th className="w8">
                    <span>{dict("staff-table/head/after-school")}</span>
                  </th>
                  <th className="w9">
                    <span>{dict("staff-table/head/last-active")}</span>
                  </th>
                  <th className="w10">
                    <span>{dict("staff-table/head/actions")}</span>
                  </th>
                </tr>
              </thead>
              <tbody role="rowgroup">
                {!search ? mappedUsers : searchMappedUsers}
              </tbody>
            </table>
          </div>
          {search ? (
            <StaffListPagination
              search={searchMappedUsers.length}
              staffListLength={staffList ? staffList.length : 0}
              mappedUsersLength={mappedUsers ? searchMappedUsers.length : 0}
              handleDisplayAmount={handleDisplayAmount}
              handleDisplayRange={handleDisplayRange}
              handlePageChange={handlePageChange}
              selectedPage={props.currentPage}
              setCurrentPageFromFilter={props.setCurrentPageFromFilter}
            />
          ) : (
              <StaffListPagination
                staffListLength={staffList ? staffList.length : 0}
                totalItems={searchMappedUsers === 0 ? mappedUsers : searchMappedUsers}
                mappedUsersLength={searchMappedUsers === 0 ? mappedUsers.length : searchMappedUsers.length}
                handleDisplayAmount={handleDisplayAmount}
                handleDisplayRange={handleDisplayRange}
                handlePageChange={handlePageChange}
                selectedPage={props.currentPage}
                setCurrentPageFromFilter={props.setCurrentPageFromFilter}
              />
            )}
        </div>
      </div>
    </div>
  );
};

export default StaffListWrapper;
