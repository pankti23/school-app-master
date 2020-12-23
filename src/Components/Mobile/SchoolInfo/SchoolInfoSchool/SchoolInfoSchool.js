import React from "react";
import { FiCheck } from "react-icons/fi";

import Button from "../../../UI/Button";
import MinimizeButton from "../../../UI/MinimizeButton";
import {
  updateSchoolInfo,
  uploadSchoolLogo
} from "../../../../services/schoolInfoService";
import { useDict } from "../../../UI/Translations";

import "./SchoolInfoSchool.css";

const SchoolInfoSchool = (props) => {
  const { disabled, handleDisabled, loadData, schoolInfo } = props;

  const [errorMessage, setErrorMessage] = React.useState("");

  const [errorUploadMessage, setErrorUploadMessage] = React.useState("");

  const [fileName, setFileName] = React.useState("");

  const [logo, setLogo] = React.useState(schoolInfo.logo);

  const [minimized, setMinimized] = React.useState(true);

  const [selectedColor, setSelectedColor] = React.useState(-1);

  const [schoolName, setSchoolName] = React.useState(schoolInfo.name);

  const [uploading, setUploading] = React.useState(false);

  const colors = [
    { backgroundColor: "#d1e8ff", highlightColor: "#33408e" },
    { backgroundColor: "#e2f9b4", highlightColor: "#738d3d" },
    { backgroundColor: "#ffdbd3", highlightColor: "#924544" },
    { backgroundColor: "#dbd5ff", highlightColor: "#7a4592" },
    { backgroundColor: "#f4f5c7", highlightColor: "#928044" },
    { backgroundColor: "#fadef5", highlightColor: "#924584" }
  ];

  const dict = useDict("/mobile/school-info");

  const getColorId = (color) => {
    return color === "#d1e8ff"
      ? 0
      : color === "#e2f9b4"
      ? 1
      : color === "#ffdbd3"
      ? 2
      : color === "#dbd5ff"
      ? 3
      : color === "#f4f5c7"
      ? 4
      : color === "#fadef5"
      ? 5
      : -1;
  };

  const handleColorButtonClick = (color) => {
    setSelectedColor(getColorId(color));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      const size = [];

      const uploadedLogo = new Image();

      uploadedLogo.src = window.URL.createObjectURL(file);

      uploadedLogo.onload = async () => {
        size[0] = uploadedLogo.width;

        size[1] = uploadedLogo.height;

        if (file.type !== "image/png") {
          setErrorUploadMessage(
            dict("school/input/logo/upload-button/message/error/type")
          );
        } else if (size[0] < 500) {
          setErrorUploadMessage(
            dict("school/input/logo/upload-button/message/error/width")
          );
        } else if (size[1] < 250) {
          setErrorUploadMessage(
            dict("school/input/logo/upload-button/message/error/height")
          );
        } else {
          try {
            setErrorUploadMessage("");

            setFileName(file.name);

            setUploading(true);

            const prevLogo = schoolInfo.logo;

            const response = await uploadSchoolLogo(file);

            await updateSchoolInfo({ logo: prevLogo });

            setLogo(response.logo);

            setUploading(false);
          } catch (e) {
            setErrorUploadMessage(
              dict("school/input/logo/upload-button/message/error/api")
            );
          }
        }
      };
    }
  };

  const handleLogoUploadButtonClick = () => {
    if (!uploading) {
      document
        .getElementById("school-info-school-info-logo-upload-input")
        .click();
    }
  };

  const handleSaveButtonClick = async () => {
    if (!disabled && !uploading) {
      handleDisabled();

      const info = {};

      if (
        schoolName.trim() !== "" &&
        schoolName.trim() !== schoolInfo.name.trim()
      )
        info["name"] = schoolName;

      if (
        selectedColor >= 0 &&
        colors[selectedColor].backgroundColor !== schoolInfo.backgroundColor
      ) {
        info["backgroundColor"] = colors[selectedColor].backgroundColor;

        info["highlightColor"] = colors[selectedColor].highlightColor;
      }

      if (logo !== schoolInfo.logo) {
        info["logo"] = logo;
      }

      try {
        if (Object.keys(info).length > 0) {
          await updateSchoolInfo(info);

          setErrorMessage(dict("school/save-button/message/success"));
        } else {
          setErrorMessage(dict("school/save-button/message/info/no-changes"));
        }
      } catch (e) {
        setErrorMessage(
          `${dict("school/save-button/message/error/api")} ${e.status}.`
        );
      }

      loadData();
    }
  };

  const handleSchoolNameInputChange = (e) => {
    setSchoolName(e.target.value);
  };

  React.useEffect(() => {
    if (
      errorMessage === dict("school/save-button/message/success") ||
      errorMessage === dict("school/save-button/message/info/no-success")
    )
      setTimeout(() => setErrorMessage(""), 3000);
  }, [errorMessage]);

  React.useEffect(() => {
    setSelectedColor(getColorId(schoolInfo.backgroundColor));
  }, []);

  return (
    <div className="school-info-school-container">
      <div className="school-info-school-header-container">
        <div className="school-info-school-header-title-container">
          <span className="school-info-school-header-title-text">
            {dict("school/header-title")}
          </span>
        </div>

        <MinimizeButton
          handleClick={() => setMinimized(!minimized)}
          minimized={minimized}
          style={{ bgcolor: "transparent" }}
        />
      </div>

      {!minimized && (
        <div className="school-info-school-info-container">
          <div className="school-info-school-info-name-container">
            <div className="school-info-school-info-name-title-container">
              <span className="school-info-school-info-name-title-text">
                {dict("school/input/name")}
              </span>
            </div>

            <input
              className="school-info-school-info-name-input"
              onChange={handleSchoolNameInputChange}
              value={schoolName ?? ""}
            />
          </div>

          <div className="school-info-school-info-logo-container">
            <div className="school-info-school-info-logo-title-container">
              <span className="school-info-school-info-logo-title-text">
                {dict("school/input/logo/title")}
              </span>
            </div>

            {logo && (
              <div className="school-info-school-info-logo-image-container">
                <img alt="school-logo" src={logo} style={{ height: "30px" }} />
              </div>
            )}

            <div className="school-info-school-info-logo-upload-container">
              <Button
                color="grey"
                onClick={handleLogoUploadButtonClick}
                size="medium"
                style={{ margin: "8px 8px 8px 0" }}
                width="160px"
              >
                <span className="school-info-school-info-logo-upload-button-text">
                  {dict("school/input/logo/upload-button/text")}
                </span>
              </Button>

              {errorUploadMessage !== "" ? (
                <span className="school-info-school-info-logo-upload-error-text">
                  {errorUploadMessage}
                </span>
              ) : (
                fileName && (
                  <span className="school-info-school-info-logo-upload-filename-text">
                    {fileName}
                  </span>
                )
              )}

              <input
                accept="*"
                capture
                hidden={true}
                id="school-info-school-info-logo-upload-input"
                name="logo"
                onChange={handleLogoUpload}
                placeholder="Upload School Logo"
                type="file"
              />
            </div>

            <div className="school-info-school-info-logo-upload-info-container">
              <p className="school-info-school-info-logo-upload-info-title-text">
                {dict("school/input/logo/requirements/title")}
              </p>

              <p className="school-info-school-info-logo-upload-info-text">
                {dict("school/input/logo/requirements/file-type")}
              </p>

              <p className="school-info-school-info-logo-upload-info-text">
                {dict("school/input/logo/requirements/dimensions")}
              </p>
            </div>
          </div>

          <div className="school-info-school-info-color-container">
            <div className="school-info-school-info-color-title">
              <span className="school-info-school-info-color-title-text">
                {dict("school/input/palette")}
              </span>
            </div>

            <div className="school-info-school-info-color-row-container">
              {colors.map((v, i) => (
                <button
                  className="school-info-school-info-color-row-cell-button"
                  onClick={() => handleColorButtonClick(v.backgroundColor)}
                  key={i}
                >
                  <div
                    className="school-info-school-info-color-row-cell-top-container"
                    style={{ backgroundColor: v.backgroundColor }}
                  >
                    {selectedColor === i && (
                      <FiCheck color={v.highlightColor} size={24} />
                    )}
                  </div>

                  <div
                    className="school-info-school-info-color-row-cell-bottom-container"
                    style={{ backgroundColor: v.highlightColor }}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="school-info-school-info-save-container">
            <div className="school-info-school-info-save-text-container">
              {errorMessage === dict("school/save-button/message/success") ? (
                <span className="school-info-school-info-save-success-text">
                  {errorMessage}
                </span>
              ) : errorMessage ===
                dict("school/save-button/message/info/no-changes") ? (
                <span className="school-info-school-info-save-text">
                  {errorMessage}
                </span>
              ) : (
                <span className="school-info-school-info-save-error-text">
                  {errorMessage || "\xa0"}
                </span>
              )}
            </div>

            <Button
              color="grey"
              onClick={handleSaveButtonClick}
              size="medium"
              style={{ marginTop: "8px" }}
              width="100%"
            >
              <span className="school-info-school-info-save-button-text">
                {dict("school/save-button/text")}
              </span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchoolInfoSchool;
