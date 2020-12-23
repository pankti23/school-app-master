import React, { useState, useEffect } from "react";
import { MdPlayArrow } from "react-icons/md";

import { useDict } from "../UI/Translations"

import "./StaffListPagination.css";

import Pagination from "react-js-pagination";
require("bootstrap/less/bootstrap.less");

const StaffListPagination = (props) => {
  const [displayAmount, setDisplayAmount] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [numberOfPages, setNumberOfPages] = useState(1);
  const [goToPageNum, setGoToPageNum] = useState(1);

  const dict = useDict("/staff-members-page")

  useEffect(() => {
    if(props.selectedPage){
      console.log('here')
      setCurrentPage(1);
      props.handlePageChange(1);
      props.setCurrentPageFromFilter(null);
    }
  }, [props.selectedPage]);

  const limit = (value, min, max) => {
    return Math.max(min, Math.min(max, value));
  };

  const pageLabel = (page, limit, total) => {
    const from = Math.min(((page - 1) * limit) + 1, total);
    const to = Math.min((page * limit), total);
    return (
            <>
              <span>{from} - {to}</span> {dict("staff-table/pagination/entries")[1]} <span>{total}</span>
            </>
          );
  }


  const handlePageChange = (num, type) => {
    console.log(num, type);
    if (type === "leftArrow") {
      setCurrentPage(currentPage - 1);
      props.handlePageChange(currentPage - 1);
    } else if (type === "rightArrow") {
      setCurrentPage(currentPage + 1);
      props.handlePageChange(currentPage + 1);
    } else if (type === "number") {
      setCurrentPage(num);
      props.handlePageChange(num);
    } else if (type === "input") {
      setCurrentPage(num);
      props.handlePageChange(num);
    }
  };

  const handlePageInput = (event) => {
    if (parseInt(goToPageNum) <= 0) {
      return;
    } else if (typeof parseInt(goToPageNum) !== typeof 1) {
      return;
    }
    event.preventDefault ? event.preventDefault() : (event.returnValue = false);
    setCurrentPage(parseInt(goToPageNum));
    props.handlePageChange(parseInt(goToPageNum));
  };

  const currentNumberOfPages = () => {
    const parsedInt = parseInt(displayAmount);
    if (props.staffListLength) {
      const pagesLength = props.staffListLength / parsedInt;
      const pageLengthChecker = pagesLength.toString();
      const splitNum = pageLengthChecker.split(".");
      const convertToNum = Number(splitNum[0]);
      if (pagesLength > convertToNum) {
        setNumberOfPages(convertToNum + 1);
      } else if (pagesLength <= convertToNum) {
        setNumberOfPages(convertToNum);
      }
    }
  };

  useEffect(() => {
    props.handleDisplayAmount(parseInt(displayAmount));
    currentNumberOfPages();
  }, [displayAmount, props.staffListLength, props.mappedUsersLength]);

  const totalPages = props.search ? props.mappedUsersLength : props.staffListLength;

  return (
    <React.Fragment>
      <div className="staff-list-pagination-wrapper">
        <div className="staff-list-pagination-left-wrapper">
          {totalPages > 0 && (
            <div className="staff-list-pagination-display-description">
                <p className="staff-list-pagination-display-description-reg-text">
                  {`${dict("staff-table/pagination/entries")[0]}` } {pageLabel(currentPage, displayAmount, totalPages)} { `${dict("staff-table/pagination/entries")[2]}`}
                </p>
            </div>
          )}
          <div className="staff-list-pagination-display-dropdown-wrapper">
            {totalPages > 10 ? (
              <React.Fragment>
                <p>{dict("staff-table/pagination/display")[0]}</p>
                <select
                  className="staff-list-dropdown-pagination"
                  onChange={(e) => {
                    setDisplayAmount(e.target.value);
                    setCurrentPage(1);
                    props.handlePageChange(1);
                  }}
                >
                  <option value="10">10</option>
                  {totalPages > 10 ? (
                    <option value="25">25</option>
                  ) : null}
                  {totalPages > 25 ? (
                    <option value="50">50</option>
                  ) : null}
                </select>
                <p>{dict("staff-table/pagination/display")[1]}</p>
              </React.Fragment>
            ) : null}
          </div>
        </div>
        {totalPages > parseInt(displayAmount) ? (
          <React.Fragment>
            <div className="staff-list-pagination-right-wrapper">
              <div className='staff-list-pagination-page-pick-wrapper'>
                <Pagination
                  pageRangeDisplayed={3}
                  activePage={currentPage}
                  itemsCountPerPage={displayAmount}
                  totalItemsCount={totalPages}
                  onChange={(num) => { handlePageChange(num, 'number')}}
                />
              </div>
              <div className="staff-list-pagination-dynamic-page-pick-wrapper">
                <p className="staff-list-pagination-dynamic-page-pick-text">
                  {dict("staff-table/pagination/go-to-page")}
                </p>
                <form onSubmit={handlePageInput}>
                  <input
                    className="staff-list-pagination-dynamic-page-pick-input"
                    type="number"
                    min="1"
                    defaultValue="1"
                    max={numberOfPages}
                    onChange={(e) => {
                      setGoToPageNum(e.target.value);
                    }}
                  />
                  <span
                    className="staff-list-pagination-button-wrapper"
                    style={{ cursor: "pointer" }}
                    onClick={() => handlePageChange(goToPageNum, "input")}
                  >
                    <p className="staff-list-pagination-dynamic-page-pick-button">
                      {dict("staff-table/pagination/go")}
                    </p>
                    <div className="staff-list-right-arrow-two">
                      <MdPlayArrow />
                    </div>
                  </span>
                </form>
              </div>
            </div>
          </React.Fragment>
        ) : null}
      </div>
    </React.Fragment>
  );
};

export default StaffListPagination;
