import React, { useEffect } from "react";

import "./PhotoListTableRow.css";

import UncheckedIcon from "../../../../../../SchoolAPP Assets/unchecked.svg";
import CheckGreenIcon from "../../../../../../SchoolAPP Assets/check-green.svg";

import { deletePhoto } from "../../../../../../services/yearbookService";

import Button from "../../../../../UI/Button";
import { useDict } from "../../../../../UI/Translations";

const PhotoListTableRow = (props) => {
  const {
    checked,
    index,
    selectAll,
    setChecked,
    setSelectAll,
    setUncheckAll,
    photo,
    uncheckAll,
    setUpdated
  } = props;

  const dict = useDict("/mobile/yearbook");

  const handleChecked = () => {
    if (checked) {
      setChecked(index, false);
    } else {
      setChecked(index, true);
    }

    if (selectAll) {
      setSelectAll(false);
    }
  };

  useEffect(() => {
    if (uncheckAll) {
      setChecked(index, false);
      setUncheckAll(false);
    }
  }, [uncheckAll, setUncheckAll]);

  const handleRemove = async (id, filename) => {
    try {
      await deletePhoto(id, filename);
      setSelectAll(false);
      setUpdated(true);
    } catch (e) {
      alert(e);
    }
  };

  return (
    <tr className="photo-list-table-rows-row">
      <td className="photo-list-checkbox-column">
        <div className="photo-list-table-rows-checkbox-cell-container">
          {checked || false ? (
            <img
              alt="green check"
              className="checked-box-icon"
              onClick={handleChecked}
              src={CheckGreenIcon}
            />
          ) : (
            <img
              alt="unchecked"
              className="unchecked-box-icon"
              onClick={handleChecked}
              src={UncheckedIcon}
            />
          )}
        </div>
      </td>

      <td className="photo-list-preview-column">
        <span className="photo-list-table-rows-preview-cell-text">
          <img
            src={photo.photo}
            className="photo-preview"
            alt={photo.filename}
          />
        </span>
      </td>

      <td className="photo-list-filename-column">
        <span className="photo-list-table-rows-filename-cell-text">
          <a href={photo.photo} target="_blank">
            {photo.filename}
          </a>
        </span>
      </td>

      <td className="photo-list-actions-column">
        <Button
          color="white"
          disabled={!checked}
          onClick={() => handleRemove(photo.yearbookId, photo.filename)}
          size="medium"
          style={{ backgroundColor: "#fafafc" }}
        >
          <span className="photo-list-table-rows-remove-cell-text">
            {dict("photos-list/table/remove-button")}
          </span>
        </Button>
      </td>
    </tr>
  );
};

export default PhotoListTableRow;
