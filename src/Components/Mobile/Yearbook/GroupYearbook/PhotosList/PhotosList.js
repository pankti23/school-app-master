import React, { useState } from "react";

import PhotoListTableRow from "./PhotoListTableRow";

import CheckGreenIcon from "../../../../../SchoolAPP Assets/check-green.svg";
import UncheckedIcon from "../../../../../SchoolAPP Assets/unchecked.svg";

import { deletePhotos } from "../../../../../services/yearbookService";

import { useDict } from "../../../../UI/Translations";

import "./PhotosList.css";

const PhotosList = ({ photos, setUpdated }) => {
  const [selectAll, setSelectAll] = useState(false);
  const [uncheckAll, setUncheckAll] = useState(false);
  const [checkedArray, setCheckedArray] = useState([]);

  const dict = useDict("/mobile/yearbook");

  const selectedPhotosCount = checkedArray.filter((v) => v).length;

  const handleCheck = (index, bool) => {
    const arr = checkedArray.map((v) => v);
    arr[index] = bool;
    setCheckedArray(arr);
  };

  const handleSelectAll = () => {
    if (!selectAll) {
      setSelectAll(true);
      setCheckedArray(photos.map((photo) => true));
    } else {
      setUncheckAll(true);
      setSelectAll(false);
      setCheckedArray(checkedArray.map((v) => false));
    }
  };

  const handleSelectedRemove = async () => {
    const tempPhotos = photos.filter((v, i) => checkedArray[i]);
    try {
      await deletePhotos(photos[0].yearbookId, tempPhotos);
      const tempCheckedArray = checkedArray.map((v) => false);
      setCheckedArray(tempCheckedArray);
      setSelectAll(false);
      setUpdated(true);
    } catch (e) {
      alert(e);
    }
  };
  return (
    <div className="photo-config-list">
      <div className="photo-config-list-table-wrapper">
        <table className="photo-config-list-table">
          <thead>
            <tr className="photo-config-list-table-head-top">
              <th
                className="photo-config-list-table-head-top-remove-cell"
                colSpan="3"
              >
                {!!selectedPhotosCount ? (
                  <button
                    className="photo-config-list-table-buttons photo-config-list-table-head-top-remove-cell-button"
                    onClick={handleSelectedRemove}
                  >
                    <span className="photo-config-list-table-head-top-remove-cell-text">
                      {`${
                        dict("photos-list/remove-selected")[0]
                      } ${selectedPhotosCount} ${
                        selectedPhotosCount !== 1
                          ? dict("photos-list/remove-selected")[2]
                          : dict("photos-list/remove-selected")[1]
                      }`}
                    </span>
                  </button>
                ) : (
                  <div className="photo-config-list-table-buttons photo-config-list-table-head-top-remove-cell-button"></div>
                )}
              </th>
            </tr>

            <tr className="photo-config-list-table-head-bottom">
              <th className="photo-config-list-table-head-bottom-checkbox-cell">
                <div className="photo-config-list-table-head-bottom-checkbox-cell-container">
                  {selectAll ? (
                    <img
                      alt="green check"
                      className="checked-box-icon"
                      onClick={handleSelectAll}
                      src={CheckGreenIcon}
                    />
                  ) : (
                    <img
                      alt="unchecked"
                      className="unchecked-box-icon"
                      onClick={handleSelectAll}
                      src={UncheckedIcon}
                    />
                  )}
                </div>
              </th>

              <th className="photo-config-list-table-head-bottom-photo-cell">
                <span className="photo-config-list-table-head-bottom-cell-text">
                  {dict("photos-list/table/head/photo-preview").toUpperCase()}
                </span>
              </th>

              <th className="photo-config-list-table-head-bottom-teachers-cell">
                <span className="photo-config-list-table-head-bottom-cell-text">
                  {dict("photos-list/table/head/filename").toUpperCase()}
                </span>
              </th>

              <th className="photo-config-list-table-head-bottom-actions-cell">
                <span className="photo-config-list-table-head-bottom-actions-cell-text">
                  {dict("photos-list/table/head/actions").toUpperCase()}
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {!!photos &&
              photos.map((photo, index) => {
                return (
                  <PhotoListTableRow
                    checked={checkedArray[index]}
                    key={index}
                    index={index}
                    selectAll={selectAll}
                    setChecked={handleCheck}
                    setSelectAll={setSelectAll}
                    setUncheckAll={setUncheckAll}
                    photo={photo}
                    uncheckAll={uncheckAll}
                    setUpdated={setUpdated}
                  />
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PhotosList;
