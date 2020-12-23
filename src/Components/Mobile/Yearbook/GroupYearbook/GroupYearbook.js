import React, { useEffect, useState } from "react";
import "./GroupYearbook.css";

import { uploadPhotos } from "../../../../services/yearbookService";

import PhotosList from "./PhotosList";

import { getChildren } from "../../../../utils";

import Button from "../../../UI/Button";
import MinimizeButton from "../../../UI/MinimizeButton";
import { useDict } from "../../../UI/Translations";

const GroupYearbook = ({ book, depth, setUpdated }) => {
  const [minimized, setMinimized] = useState(true);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [children, level] = getChildren(book);

  const dict = useDict("/mobile/yearbook");

  const uploadFiles = async (yearbookId, files) => {
    try {
      setUploading(true);
      await uploadPhotos(yearbookId, files);
      setFiles([]);
      setUpdated(true);
      setUploading(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (files.length) {
      uploadFiles(book.bookId, files);
    }
  }, [files]);

  return (
    <div className="yearbook-group-container">
      <div className="yearbook-group-header-container">
        <div className="yearbook-group-header-title-container">
          <span className="yearbook-group-header-title-text">{book.name}</span>
          {!!book.bookId && (
            <>
              <button
                type="button"
                disabled={uploading}
                className={
                  !uploading
                    ? "yearbook-group-upload-button"
                    : "yearbook-group-upload-button yearbook-group-upload-button-disabled"
                }
                onClick={(e) => {
                  const elementId = "fileUpload" + book.bookId;
                  const inputField = document.getElementById(elementId);
                  inputField.click();
                }}
              >
                {dict("group/upload-button")}
              </button>
              <input
                id={"fileUpload" + book.bookId}
                type="file"
                name="photos"
                accept="*"
                placeholder="Upload Photos"
                capture
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files);
                  setFiles(files);
                }}
                hidden={true}
              />
              {uploading && (
                <span className="yearbook-group-uploading">
                  {dict("group/upload-indicator")}
                </span>
              )}
            </>
          )}
        </div>
        {book.photos.length || children.length ? (
          <MinimizeButton
            handleClick={() => setMinimized(!minimized)}
            minimized={minimized}
            style={{ bgcolor: "transparent" }}
          />
        ) : null}
      </div>
      {!minimized && !!book.photos && book.photos.length ? (
        <PhotosList photos={book.photos} setUpdated={setUpdated} />
      ) : null}
      {!minimized && children && children.length
        ? children.map((book, i) => (
            <div
              className="yearbook-config-content"
              key={book.bookId + book.id + book.name}
              style={{ marginLeft: 33 }}
            >
              <GroupYearbook
                book={book}
                depth={level}
                setUpdated={setUpdated}
              />
            </div>
          ))
        : null}
    </div>
  );
};

export default GroupYearbook;
