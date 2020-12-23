import React, { useState, useEffect, useRef } from "react";
import DownloadSVG from "../../../SchoolAPP Assets/Download";
import { FaTrash } from "react-icons/fa";
import CSVReader from "react-csv-reader";
import axios from "axios";
import { jsonToCSV, readRemoteFile } from "react-papaparse"
import ExternalLinkOutline from "../../../SchoolAPP Assets/ExternalLinkOutline";
import { getTokenFromLocalStorage } from "../../../services/localStorageService";

import { useDict } from "../../UI/Translations"

import LoadingSpinner from "../../UI/LoadingSpinner";

import "./InviteByCSV.css";

const createFormData = (file, body) => {
  const formdata = new FormData();
  formdata.append("csv", file);
  formdata.append("columnNames", JSON.stringify(body));
  return formdata;
};

const template = [
  ['Email', 'Full Name', 'Role', 'Campus', 'Level', 'Grade', 'Group', 'After School Group'],
  ['john.doe@example.com', 'John Doe', 'Principal (Campus)', '', '', '', '', ''],
  ['jane.doe@example.com', 'Jane Doe', 'Principal (Level)', '', '', '', '', ''],
  ['amy.smith@example.com', 'Amy Smith', 'Main Teacher', '', '', '', '', ''],
  ['adam.smith@example.com', 'Adam Smith', 'Subject Teacher', '', '', '', '', ''],
];

const downloadTemplate = () => {
  let csv = '';
  let hiddenElement = document.createElement('a');

  template.forEach(function (row) {
    csv += row.join(',');
    csv += '\n';
  });

  hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
  hiddenElement.target = '_blank';
  hiddenElement.download = 'StaffTemplate.csv';
  hiddenElement.click();
};

const baseUrl = process.env.REACT_APP_BASE_URL;
const InviteByCSV = (props) => {
  const [csvData, setCsvData] = useState(null);
  const [csvFile, setCsvFile] = useState(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [campus, setCampus] = useState("");
  const [level, setLevel] = useState("");
  const [grade, setGrade] = useState("");
  const [group, setGroup] = useState("");
  const [extraCurricularGroup, setExtraCurricularGroup] = useState("");

  const dict = useDict("/staff-members-page")

  const [loading, setLoading] = useState(false);
  
  const sendInviteByCsv = async () => {
    setLoading(true);
    const token = getTokenFromLocalStorage();
    const columnNameList = {
      email,
      name,
      role,
      campus,
      level,
      grade,
      group,
      'afterSchoolGroup': extraCurricularGroup
    };
    const formData = createFormData(csvFile, columnNameList);

    const postConfig = {
      method: "post",
      url: `${baseUrl}/users/create/bulk/csv`,
      data: formData,
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    };

    try {
      await axios(postConfig);
      setTimeout(() => {
        props.setUpdated(true);
        props.closeModal();
        setLoading(false);
      }, 1000)
    } catch (err) {
      const stringErr = err.toString();
      console.error(stringErr);
      props.closeModal();
      setLoading(false);
    }
  };

  const parseCSVFile = (file) => {
    console.log(file)
    readRemoteFile(URL.createObjectURL(file), {
      complete: (results) => {
        console.log("results:", results)
        setCsvData(results.data);
        if(results.data && results.data[0]){
          // Email
          if(results.data[0] && results.data[0][0]){
            setEmail(results.data[0][0]);
          }
          // Full Name
          if(results.data[0] && results.data[0][1]){
            setName(results.data[0][1]);
          }
          // Role
          if(results.data[0] && results.data[0][2]){
            setRole(results.data[0][2]);
          }
          // Campus
          if(results.data[0] && results.data[0][3]){
            setCampus(results.data[0][3]);
          }
          // Level
          if(results.data[0] && results.data[0][4]){
            setLevel(results.data[0][4]);
          }
          // Grade
          if(results.data[0] && results.data[0][5]){
            setGrade(results.data[0][5]);
          }
          // Group
          if(results.data[0] && results.data[0][6]){
            setGroup(results.data[0][6]);
          }
          // After School Group
          if(results.data[0] && results.data[0][7]){
            setExtraCurricularGroup(results.data[0][7]);
          }
        }
      }
    })
  }

  return (
    <React.Fragment>
      {loading ?  <div className="invite-new-loader-wrapper"> <LoadingSpinner /></div> :
      <>
        <div className="invite-heading-wrapper">
          <h1 className="invite-heading-h1">
            {dict("invite-modal/csv/title")}
          </h1>
          <div className="invite-csv-download-template-wrapper" onClick={downloadTemplate}>
            <DownloadSVG
              style={{ marginRight: "5px" }}
              height="18px"
              width="18px"
              stroke="none"
              fill="#0037F6"
            />
            <a href="javascript:void(0)">{dict("invite-modal/csv/template-download")}</a>
          </div>
        </div>
        <div className="user-info-modal-gray-bar"></div>
        <div className="invite-upload-button-wrapper">
          <p className="invite-upload-button-label">{dict("invite-modal/csv/upload-csv")}</p>
          {!csvData ? (
            <div
              className="input-file-container"
              style={{ padding: "none", width: "100%" }}
            >
              <input type="file" id="my-file" className="input-file" onChange={(e) => { setCsvFile(e.target.files[0]); parseCSVFile(e.target.files[0]) }} />
              <label
                tabIndex="0"
                htmlFor="my-file"
                className="input-file-trigger"
              >
                {dict("invite-modal/csv/button/upload")}
              </label>
            </div>
          ) : (
              <>
              <div className="invite-csv-file-read-wrapper">
                <section className="upload-square-icon">
                  <ExternalLinkOutline
                    style={{}}
                    width="15px"
                    height="15px"
                    fill="#838383"
                    stroke="none"
                  />
                </section>
                <section className="invite-file-name">
                  <div>{csvFile ? csvFile.name : null}</div>
                  <div
                    className="invite-garbage-can-icon-wrapper"
                    onClick={() => {
                      setCsvData(null);
                      setCsvFile(null);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <FaTrash />
                  </div>
                </section>
              </div>
              </>
            )}
        </div>
        {csvData ? (
          <>
          <hr className="csv-upload-data-hr"/>
          <div className="invite-select-container">
            <h2>{dict("invite-modal/csv/import-columns/header/title")}</h2>
            <p>
              {dict("invite-modal/csv/import-columns/header/paragraph")}
            </p>
            <br />
            <div className="invite-select-wrapper">
              <label htmlFor="email">{dict("invite-modal/csv/import-columns/label/email")}</label>
              <select
                id="email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                value={csvData[0][0] && csvData[0][0] || ''}
              >
                <option value="">{`-- ${dict("invite-modal/csv/import-columns/label/placeholder")} --`}</option>
                {csvData
                  ? csvData[0].map((header) => {
                    return (
                      <option key={header} value={header}>
                        {header}
                      </option>
                    );
                  })
                  : null}
              </select>
            </div>
            <div className="invite-select-wrapper">
              <label htmlFor="name">{dict("invite-modal/csv/import-columns/label/name")}</label>
              <select
                id="name"
                onChange={(e) => {
                  setName(e.target.value);
                }}
                value={csvData[0][1] && csvData[0][1] || ''}
              >
                <option value="">{`-- ${dict("invite-modal/csv/import-columns/label/placeholder")} --`}</option>
                {csvData
                  ? csvData[0].map((header) => {
                    return (
                      <option key={header} value={header}>
                        {header}
                      </option>
                    );
                  })
                  : null}
              </select>
            </div>
            <div className="invite-select-wrapper">
              <label htmlFor="role">{dict("invite-modal/csv/import-columns/label/role")}</label>
              <select
                id="role"
                onChange={(e) => {
                  setRole(e.target.value);
                }}
                value={csvData[0][2] && csvData[0][2] || ''}
              >
                <option value="">{`-- ${dict("invite-modal/csv/import-columns/label/placeholder")} --`}</option>
                {csvData
                  ? csvData[0].map((header) => {
                    return (
                      <option key={header} value={header}>
                        {header}
                      </option>
                    );
                  })
                  : null}
              </select>
            </div>
            <div className="invite-select-wrapper">
              <label htmlFor="campus">{dict("invite-modal/csv/import-columns/label/campus")}</label>
              <select
                id="campus"
                onChange={(e) => {
                  setCampus(e.target.value);
                }}
                value={csvData[0][3] && csvData[0][3] || ''}
              >
                <option value="">{`-- ${dict("invite-modal/csv/import-columns/label/placeholder")} --`}</option>
                {csvData
                  ? csvData[0].map((header) => {
                    return (
                      <option key={header} value={header}>
                        {header}
                      </option>
                    );
                  })
                  : null}
              </select>
            </div>
            <div className="invite-select-wrapper">
              <label htmlFor="level">{dict("invite-modal/csv/import-columns/label/level")}</label>
              <select
                id="level"
                onChange={(e) => {
                  setLevel(e.target.value);
                }}
                value={csvData[0][4] && csvData[0][4] || ''}
              >
                <option value="">{`-- ${dict("invite-modal/csv/import-columns/label/placeholder")} --`}</option>
                {csvData
                  ? csvData[0].map((header) => {
                    return (
                      <option key={header} value={header}>
                        {header}
                      </option>
                    );
                  })
                  : null}
              </select>
            </div>
            <div className="invite-select-wrapper">
              <label htmlFor="grade">{dict("invite-modal/csv/import-columns/label/grade")}</label>
              <select
                id="grade"
                onChange={(e) => {
                  setGrade(e.target.value);
                }}
                value={csvData[0][5] && csvData[0][5] || ''}
              >
                <option value="">{`-- ${dict("invite-modal/csv/import-columns/label/placeholder")} --`}</option>
                {csvData
                  ? csvData[0].map((header) => {
                    return (
                      <option key={header} value={header}>
                        {header}
                      </option>
                    );
                  })
                  : null}
              </select>
            </div>
            <div className="invite-select-wrapper">
              <label htmlFor="grupo">{dict("invite-modal/csv/import-columns/label/group")}</label>
              <select
                id="grupo"
                onChange={(e) => {
                  setGroup(e.target.value);
                }}
                value={csvData[0][6] && csvData[0][6] || ''}
              >
                <option value="">{`-- ${dict("invite-modal/csv/import-columns/label/placeholder")} --`}</option>
                {csvData
                  ? csvData[0].map((header) => {
                    return (
                      <option key={header} value={header}>
                        {header}
                      </option>
                    );
                  })
                  : null}
              </select>
            </div>
            <div className="invite-select-wrapper">
              <label htmlFor="grupo">{dict("invite-modal/csv/import-columns/label/extracurricular")}</label>
              <select
                id="extra-escolar"
                onChange={(e) => {
                  setExtraCurricularGroup(e.target.value);
                }}
                value={csvData[0][7] && csvData[0][7] || ''}
              >
                <option value="">{`-- ${dict("invite-modal/csv/import-columns/label/placeholder")} --`}</option>
                {csvData
                  ? csvData[0].map((header) => {
                    return (
                      <option key={header} value={header}>
                        {header}
                      </option>
                    );
                  })
                  : null}
              </select>
            </div>
          </div>
          </>
        ) : null}
        <div className="user-info-modal-gray-bar"></div>
        <div className="invite-button-wrapper">
          <div
            className="invite-back-button-wrapper"
            onClick={() => props.handleViewChange("")}
          >
            <div className="invite-back-button">{dict("invite-modal/csv/button/back")}</div>
          </div>
          <div className="invite-cancel-submit-button-wrapper">
            <button
              className="invite-cancel-button"
              onClick={() => props.closeModal()}
            >
              {dict("invite-modal/csv/button/cancel")}
            </button>
            <button
              className="invite-submit-button"
              onClick={() => sendInviteByCsv()}
              disabled={csvData ? false : true}
            >
              {dict("invite-modal/csv/button/create")}
            </button>
          </div>
        </div>
      </>}
    </React.Fragment>
  );
};

export default InviteByCSV;
