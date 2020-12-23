import React, { useRef, useState, useEffect } from "react";
import { readRemoteFile, readString } from "react-papaparse";

import FileCSV from "../../../SchoolAPP Assets/FileCSV";
import DownloadSVG from "../../../SchoolAPP Assets/Download";
import EmailSVG from "../../../SchoolAPP Assets/Email";
import ExternalLinkOutline from "../../../SchoolAPP Assets/ExternalLinkOutline";
import { FaTrash } from "react-icons/fa";
import { createStudentsBulk, createStudentsBulkCsv } from "../../../services/studentService";

import LoadingSpinner from "../../UI/LoadingSpinner";
import Button from "../../UI/Button";
import Select from "../../UI/Select";
import useOnClickOutside from "../../../CustomHooks/useOnClickOutside";

import { useDict } from "../../UI/Translations"

import './InviteNew.css';

const template = [
  ['name', 'campus', 'level', 'grade', 'group', 'afterSchoolGroup', 'email1', 'email2'],
  ['John Doe', '', '', '', '', '', 'john.parent1@email.com', 'john.parent2@email.com'],
  ['Jane Doe', '', '', '', '', '', 'jane.parent1@email.com', 'jane.parent2@email.com']
];

const columns = [{
  label: 'Student Name',
  key: 'name',
  required: true
}, {
  label: 'Campus',
  key: 'campus',
  required: false
}, {
  label: 'Level',
  key: 'level',
  required: false
}, {
  label: 'Grade',
  key: 'grade',
  required: false
}, {
  label: 'Group',
  key: 'group',
  required: false
}, {
  label: 'After school group',
  key: 'afterSchoolGroup',
  required: false
}, {
  label: 'Parent email 1',
  key: 'email1',
  required: false
}, {
  label: 'Parent email 2',
  key: 'email2',
  required: false
}];

const emptyEmailRow = {
  name: '',
  groupId: null,
  parent1Email: '',
  parent2Email: ''
};

const createFormData = (file, columns) => {
  const formdata = new FormData();
  let columnNames = {};

  columns.map((column) => {
    columnNames[column.original] = column.received;
  });

  formdata.append('csv', file);
  formdata.append('columnNames', JSON.stringify(columnNames));

  return formdata;
};


const InviteNew = ({ divisions, closeModal, onRefresh }) => {
  const [method, setMethod] = useState(null); // null / "csv" / "email"
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const [csvData, setCsvData] = useState(null);
  const [csvFile, setCsvFile] = useState(null);
  const [csvColumns, setCsvColumns] = useState(null);

  const [createStudentsErrors, setCreateStudentsError] = useState([]);

  const [emailList, setEmailList] = useState(JSON.parse(JSON.stringify([emptyEmailRow])));

  const dict = useDict("/students-page")

  const ref = useRef();

  const clearCsv = () => {
    setCsvData(null);
    setCsvFile(null);
    setCsvColumns(null);
  };

  const close = () => {
    closeModal();
    setMethod(null);
    clearCsv();
    setEmailList(JSON.parse(JSON.stringify([emptyEmailRow])));
  };

  const goBack = () => {
    setMethod(null);
    clearCsv();
    setEmailList(JSON.parse(JSON.stringify([emptyEmailRow])));
  };

  const downloadTemplate = () => {
    let csv = '';
    let hiddenElement = document.createElement('a');

    template.forEach(function (row) {
      csv += row.join(',');
      csv += '\n';
    });

    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'template.csv';
    hiddenElement.click();
  };

  const parseCSVFile = (file) => {
    readRemoteFile(URL.createObjectURL(file), {
      header: true,
      complete: (results) => {
        const columnsMap = [];
        const keys = Object.keys(results.data[0]);

        for (let column of columns) {
          columnsMap.push({
            original: column.key,
            received: keys.find((key) => key === column.key) ? column.key : null
          });
        }

        setCsvColumns(columnsMap);
        setCsvData(results.data);
      }
    });
  };

  const addEmptyRowToEmailList = () => {
    const emailListCopy = [...emailList];

    emailListCopy.push(JSON.parse(JSON.stringify(emptyEmailRow)));

    setEmailList(emailListCopy);
  };

  const updateCsvColumns = (original, received) => {
    const csvColumnsCopy = [...csvColumns];
    const index = csvColumnsCopy.findIndex((column) => column.original === original);

    csvColumnsCopy[index].received = received || null;

    setCsvColumns(csvColumnsCopy);
  };

  const updateEmailRow = (index, key, value) => {
    const emailListCopy = [...emailList];

    emailListCopy[index][key] = value;

    setEmailList(emailListCopy);
  };

  const submitCsv = () => {
    setLoading(true);
    setCreateStudentsError([]);

    createStudentsBulkCsv(createFormData(csvFile, csvColumns)).then(() => {
      onRefresh();
      setSuccess(true);
      setLoading(false);
    });
  };

  const submitEmail = () => {
    setLoading(true);
    setCreateStudentsError([]);

    createStudentsBulk({ students: emailList }).then(response => {
      setLoading(false);
      const { errors } = response;
      if (errors.length == 0) {
        onRefresh();
        setSuccess(true);
      } else {
        setCreateStudentsError(errors);
      }
    })
  };

  const divisionUpdate = (index, key, value) => {
    const emailListCopy = [...emailList];

    emailListCopy[index][key] = value.id;

    if (['campusId', 'levelId', 'gradeId'].indexOf(key) !== -1) {
      updateEmailRow(index, 'groupId', null);
    }

    setEmailList(emailListCopy);
  };

  const csvColumnsIsValid = () => {
    if (csvColumns === null) return false;

    let result = true;
    let required = null;

    for (let column of csvColumns) {
      required = columns.find((c) => c.key === column.original).required;

      if (!column.received && required) result = false;
    }

    return result;
  };

  useOnClickOutside(ref, close);

  return (
    <div className="invite-new-modal-wrapper">
      <div ref={ref} className="invite-new-modal-container">
        {!method && !success && !loading && <>
          <div className="invite-new-modal-header">
            <p>{dict("invite-modal/title")}</p>
          </div>

          <div className="invite-new-modal-content">
            <div className={[
              'invite-new-modal-option',
              method === 'csv' ? 'invite-new-modal-option-selected' : ''
            ].join(' ')} onClick={() => setMethod('csv')}>
              <FileCSV height="25px" width="25px" fill="#0037F6" stroke="none" />{dict("invite-modal/button/import-csv")}
            </div>
            <div className={[
              'invite-new-modal-option',
              method === 'email' ? 'invite-new-modal-option-selected' : ''
            ].join(' ')} onClick={() => setMethod('email')}>
              <EmailSVG height="25px" width="25px" fill="#0037F6" stroke="none" />{dict("invite-modal/button/invite-email")}
            </div>
          </div>
        </>}

        {method === 'csv' && !success && !loading && <>
          <div className="invite-new-modal-header">
            <p>{dict("invite-modal/csv/title")}</p>
            <div className="invite-new-modal-header-template" onClick={downloadTemplate}>
              <DownloadSVG height="18px" width="18px" stroke="none" fill="#0037F6" />{dict("invite-modal/csv/template-download")}
            </div>
          </div>

          <div className="invite-new-modal-content">
            {!csvData && <div className="input-file-container" style={{ padding: "none", width: "100%" }} >
              <input type="file" id="my-file" className="input-file" onChange={(e) => { setCsvFile(e.target.files[0]); parseCSVFile(e.target.files[0]) }} />
              <p>{dict("invite-modal/csv/upload-csv")}</p>
              <label tabIndex="0" htmlFor="my-file" className="input-file-trigger" style={{ marginBottom: "25px" }} >{dict("invite-modal/csv/button/upload")}</label>
            </div>}

            {csvData && <>
              <div className="invite-new-modal-content-file-preview">
                <div className="invite-new-modal-content-file-preview-icon">
                  <ExternalLinkOutline width="15px" height="15px" fill="#838383" stroke="none" />
                </div>
                <div className="invite-new-modal-content-file-preview-name">
                  {csvFile ? csvFile.name : ''}
                  <span onClick={() => clearCsv()}><FaTrash /></span>
                </div>
              </div>

              <div className="invite-new-modal-content-csv-columns">
                <div className="invite-new-modal-content-csv-columns-title">{dict("invite-modal/csv/import-columns/header/title")}</div>
                <div className="invite-new-modal-content-csv-columns-sub-title">{dict("invite-modal/csv/import-columns/header/paragraph")}</div>
                <div className="invite-new-modal-content-csv-columns-sub-title warning-message">{dict("invite-modal/csv/import-columns/header/warning-message")}</div>
                
                <ul className="invite-new-modal-content-csv-columns-list">
                  {columns.map((column) => <li>
                    <label>{`"${column.label}" ${dict("invite-modal/csv/import-columns/label/column")}`}</label>

                    <Select onChange={(e) => updateCsvColumns(column.key, e.target.value)} size="default">
                      <option value="">{`-- ${dict("invite-modal/csv/import-columns/label/placeholder")}`}</option>
                      {csvData && Object.keys(csvData[0]).map((header) => <option key={header} value={header} selected={column.key === header}>
                        {header}
                      </option>)}
                    </Select>
                  </li>)}
                </ul>
              </div>
            </>}
          </div>

          <div className="invite-new-modal-bottom">
            <div className="invite-new-modal-bottom-back" onClick={() => goBack()}>{dict("invite-modal/csv/button/back")}</div>
            <div>
              <Button size="default"
                color="white"
                margin="0 15px 0 0"
                onClick={close}>{dict("invite-modal/csv/button/cancel")}</Button>
              <Button size="default"
                disabled={!csvColumnsIsValid()}
                onClick={() => submitCsv()}
                color="green">{dict("invite-modal/csv/button/create")}</Button>
            </div>
          </div>
        </>}

        {method === 'email' && !success && !loading && <>
          <div className="invite-new-modal-header">
            <p>{dict("invite-modal/email/title")}</p>
          </div>
          <div className="invite-new-modal-header modify-student-modal-warning-message">
                  {createStudentsErrors.map(createStudentError => <p style={{color: 'red'}}>{createStudentError}</p>)}
          </div>
          <div className="invite-new-modal-content">
            <ul className="invite-new-modal-content-list">
              {emailList.map((item, i) => {
                const campuses = divisions.campuses;
                const levels = campuses ? (campuses.find((campus) => campus.id === item.campusId) || {}).levels : [];
                const grades = levels ? (levels.find((level) => level.id === item.levelId) || {}).grades : [];
                const groups = grades ? (grades.find((grade) => grade.id === item.gradeId) || {}).groups : [];

                return <li key={i}>
                  <div className="invite-new-modal-content-list-top">
                    <div>
                      <label>{dict("invite-modal/email/email-input/name")}</label>
                      <input type="text" value={item.name} onChange={(e) => updateEmailRow(i, 'name', e.target.value)} placeholder="Nombre completo" />
                    </div>
                    <div>
                      <label>{dict("invite-modal/email/email-input/email1")}</label>
                      <input type="text" value={item.parent1Email} onChange={(e) => updateEmailRow(i, 'parent1Email', e.target.value)} placeholder="Correo electrónico" />
                    </div>
                    <div>
                      <label>{dict("invite-modal/email/email-input/email2")}</label>
                      <input type="text" value={item.parent2Email} onChange={(e) => updateEmailRow(i, 'parent2Email', e.target.value)} placeholder="Correo electrónico" />
                    </div>
                  </div>

                  <div className="invite-new-modal-content-list-bottom">
                    <div>
                      <label>{dict("invite-modal/email/email-input/campus")}</label>
                      <Select onChange={(e) => divisionUpdate(i, 'campusId', JSON.parse(e.target.value))} size="default">
                        <option value="">{`-- ${dict("invite-modal/email/email-input/placeholder")} --`}</option>
                        {campuses && campuses.map((campus) => <option key={campus.id} value={JSON.stringify(campus)} selected={(item.campusId || {}).id === campus.id} width="100%">
                          {campus.name}
                        </option>)}
                      </Select>
                    </div>
                    <div>
                      <label>{dict("invite-modal/email/email-input/level")}</label>
                      <Select onChange={(e) => divisionUpdate(i, 'levelId', JSON.parse(e.target.value))} size="default">
                        <option value="">{`-- ${dict("invite-modal/email/email-input/placeholder")} --`}</option>
                        {levels && levels.map((level) => <option key={level.id} value={JSON.stringify(level)} selected={(item.levelId || {}).id === level.id} width="100%">
                          {level.name}
                        </option>)}
                      </Select>
                    </div>
                    <div>
                      <label>{dict("invite-modal/email/email-input/grade")}</label>
                      <Select onChange={(e) => divisionUpdate(i, 'gradeId', JSON.parse(e.target.value))} size="default">
                        <option value="">{`-- ${dict("invite-modal/email/email-input/placeholder")} --`}</option>
                        {grades && grades.map((grade) => <option key={grade.id} value={JSON.stringify(grade)} selected={(item.gradeId || {}).id === grade.id} width="100%">
                          {grade.name}
                        </option>)}
                      </Select>
                    </div>
                    <div>
                      <label>{dict("invite-modal/email/email-input/group")}</label>
                      <Select onChange={(e) => divisionUpdate(i, 'groupId', JSON.parse(e.target.value))} size="default">
                        <option value="">{`-- ${dict("invite-modal/email/email-input/placeholder")} --`}</option>
                        {groups && groups.map((group) => <option key={group.id} value={JSON.stringify(group)} selected={(item.groupId || {}).id === group.id} width="100%">
                          {group.name}
                        </option>)}
                      </Select>
                    </div>
                  </div>
                </li>;
              })}
            </ul>

            <Button size="default"
              color="grey"
              margin="20px 0"
              width="100%"
              onClick={addEmptyRowToEmailList}>{dict("invite-modal/email/email-input/more-button")}</Button>
          </div>

          <div className="invite-new-modal-bottom">
            <div className="invite-new-modal-bottom-back" onClick={() => goBack()}>{dict("invite-modal/email/button/back")}</div>
            <div>
              <Button size="default"
                color="white"
                margin="0 15px 0 0"
                onClick={close}>{dict("invite-modal/email/button/cancel")}</Button>
              <Button size="default"
                onClick={() => submitEmail()}
                color="green">{dict("invite-modal/email/button/create")}</Button>
            </div>
          </div>
        </>}

        {loading && <>
          <div className="invite-new-modal-content-center">
            <LoadingSpinner />
          </div>
        </>}

        {success && !loading && <>
          <div className="invite-new-modal-content-center">
            {dict("invite-modal/message/info/add")}
          </div>
        </>}
      </div>
    </div>
  );
};

export default InviteNew;
