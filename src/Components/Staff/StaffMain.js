import React, { useState, useEffect, useRef } from "react";
import StaffListHeader from "./StaffListHeader";
import StaffListWrapper from "./StaffListWrapper";
import axios from "axios";
import { getTokenFromLocalStorage } from "../../services/localStorageService";
import "./StaffMain.css";
import { setCurrentPage } from "../../services/localStorageService";
import FilterByModal from "./StaffModals/FilterByModal";
import useOnClickOutside from "../../CustomHooks/useOnClickOutside";

const baseUrl = process.env.REACT_APP_BASE_URL;

const StaffMain = () => {

  const [mainStaffList, setMainStaffList] = useState([]);
  const [filteredStaffList, setFilteredStaffList] = useState([]);
  const [filterModal, setFilterModal] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [currentPage, setCurrentPageFromFilter] = useState(null);

  const [filterBy, setFilterBy] = useState({});
  const [isApplied, setApplied] = useState(false);

  setCurrentPage("/staff-members-page");

  const ref = useRef();
  useOnClickOutside(ref, () => {
    setFilterModal(false);
  });

  
  const getStaffList = async () => {
    const token = getTokenFromLocalStorage();
    const usersConfig = {
      method: "get",
      url: `${baseUrl}/users`,
      headers: {
        Authorization: token,
      },
    };
    try {
      const { data } = await axios(usersConfig);
      // ! need role id for students, parents, subject teachers, owner
      // TODO: const filteredData = data.filter(user => user.roleId !== 8 && user.roleId !== 6)
      // user.roleId !== 8 && user.roleId !== 9 && user.roleId !== 7 &&
      const filteredData = data.filter((user) => (user.roleId !== 3 && user.roleId !== 8));
      const alphaData = filteredData.sort(function (a, b) {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      });
      console.log(alphaData);
      setMainStaffList(alphaData);
      if (updated) {
        setUpdated(false);
      }
    } catch (err) {
      console.error(err.toString());
    }
  };

  const closeFilterModal = () => {
    setFilterModal(false);
  };

  const openFilterModal = () => {
    setFilterModal(true);
  };

  const rerenderList = () => {
    getStaffList();
  };

  useEffect(() => {
    getStaffList();
  }, [updated]);

  // let isFilterApplied = Object.keys(filterBy).length > 0 ? true : false;

  return (
    <>
      {filterModal ? (
        <div className="confirm-section-header-school-config">
          <span ref={ref}>
            <FilterByModal
              closeFilterModal={closeFilterModal}
              staffList={mainStaffList}
              filterBy={filterBy}
              setFilterBy={setFilterBy}
              newStaffList={setFilteredStaffList}
              setUpdated={setUpdated}
              setApplied={setApplied}
              setCurrentPageFromFilter={setCurrentPageFromFilter}
            />
          </span>
        </div>
      ) : null}
      <div className="staff-page-main-container">
        <div className="staff-page-top-container-style">
          <div className="staff-page-main-double-container">
            <StaffListHeader 
              setUpdated={setUpdated} 
            />
          </div>
        </div>
        <div className="staff-page-main-double-container" style={{ padding: "40px" }}>
          <StaffListWrapper
            mainStaffList={isApplied ? filteredStaffList : mainStaffList}
            openFilterModal={openFilterModal}
            rerenderList={rerenderList}
            setUpdated={setUpdated}
            currentPage={currentPage}
            setCurrentPageFromFilter={setCurrentPageFromFilter}
          />
        </div>
      </div>
    </>
  );
};

export default StaffMain;
