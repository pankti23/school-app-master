import React, {useRef, useState, useLayoutEffect} from "react";
import {Formik, Form, Field, FieldArray, ErrorMessage} from "formik";

import './CalendarItemForm.css';

import validationSchema from "./ValidationSchema";

import VisibilityFilter from "../VisibilityFilter";
import LoadingSpinner from "../../UI/LoadingSpinner"

import {
  prepareFiles,
  initVisibilityFilters,
  filterStudents,
  getFilenameFromUrl,
  searchTree,
  getVisibleTo, deepCloneArray,
} from "../../../utils";

import {getStudentList} from "../../../services/studentService";

import TimeInput from "../../UI/TimeInput";
import DateInput from "../../UI/DateInput";
import Dialog from "../../UI/Modal/Dialog";

import { useDict } from "../../UI/Translations"

// const moment = require('moment');

const offset = (new Date()).getTimezoneOffset();

const emptyValues = {
  subject: '',
  location: '',
  description: '',
  typeId: 0,
  startDate: '',
  startTime: '',
  endDate: null,
  endTime: null,
  allDay: false,
  repeats: false,
  repeatInterval: null,
  repeatIntervalType: 'none',
  repeatDays: [],
  repetitionEnds: false,
  repetitionEndsOnDate: null,
  repetitionEndsAfterOccurrences: null,
  visibleTo: {},
  files: [],
  filesToUpload: [],
  students: []
};

const CalendarItemForm = ({
                            item, onClose, onSave, types,
                            campuses, levels, grades, groups, afterSchoolGroups,
                          }) => {
  const subjectRef = useRef(null);

  const [loading, setLoading] = useState(true);

  const [openDialog, setOpenDialog] = useState(false);

  const [fileList, setFileList] = useState([]);

  const [studentList, setStudentList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);

  const dict = useDict("/calendar")

  const dayNamesShort = dict("calendar/value/day-names-short", [])

  let tempVisibleTo = null;

  const initialValues = {...emptyValues, ...item};
  if (item.startDate < item.date) {
    initialValues.startDate = item.date;
    if (item.endDate) {
      initialValues.endDate = item.date;
    }
  }
  // console.log(item.startDate);
  initialValues.startDate = new Date(initialValues.startDate);
  initialValues.endDate = new Date(initialValues.endDate);
  initialValues.startDate.setMinutes(offset);
  initialValues.endDate.setMinutes(offset);

  if (initialValues.repetitionEndsOnDate) {
    initialValues.repetitionEndsOnDate = new Date(initialValues.repetitionEndsOnDate);
    initialValues.repetitionEndsOnDate.setMinutes(offset);
  }

  // console.log(initialValues.students);


  initVisibilityFilters(initialValues.visibleTo, campuses, levels, grades, groups, afterSchoolGroups);

  useLayoutEffect(() => {
    setLoading(true);
    const list = prepareFiles(item.files);
    setFileList(list);

    async function getData() {
      const students = await getStudentList();
      setStudentList(students);
      const filteredList = filterStudents(students, item.students);
      setFilteredList(filteredList);
      setLoading(false);
      subjectRef.current.focus();
    }

    try {
      getData();
    } catch (e) {
      console.log(e);
    }
  }, []);

  const toggleDialog = () => {
    setOpenDialog(!openDialog);
  };


// Form Actions
  const onCancel = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onClose();
  };

  const onSubmit = async (values, {setSubmitting, setErrors}) => {
    if (values.allDay) {
      values.startTime = null;
      values.endTime = null;
      if (parseInt(values.typeId, 10) !== 7) {
        values.endDate = null;
      }
    }
    if (!values.repeats) {
      values.repeatInterval = null;
      values.repeatIntervalType = 'none';
      values.repeatDays = [];
      values.repetitionEnds = false;
      values.repetitionEndsOnDate = null;
      values.repetitionEndsAfterOccurrences = null;
    } else {
      // Fix values if user does not change defaults from 1 & day
      if (!values.repeatIntervalType || values.repeatIntervalType === 'none') {
        values.repeatIntervalType = 'day';
      }
      if (!values.repeatInterval) {
        values.repeatInterval = 1;
      }

      if (values.repeatIntervalType !== 'week') {
        values.repeatDays = [];
      }
      if (!values.repetitionEnds) {
        values.repetitionEndsOnDate = null;
        values.repetitionEndsAfterOccurrences = null;
      }
      if (values.repetitionEndsOnDate) {
        values.repetitionEndsAfterOccurrences = null;
      } else {
        values.repetitionEndsOnDate = null;
      }
    }
    if (tempVisibleTo) {
      values.visibleTo = tempVisibleTo;
    }
    if (values.repeats && values.id) {
      toggleDialog();
      return;
    }
    try {
      await onSave(values);
      setSubmitting(false);
      onClose();
    } catch (error) {
      if (error.status && error.status == 400) {
        setErrors({ startDate: error.message })
      }
    }
  };

  const setVisibleTo = (tree) => {
    const filters = searchTree(tree, (item) => item.isChecked, true);
    tempVisibleTo = getVisibleTo(deepCloneArray(tree));
    return filters;
  };

  const onRemoveSelectedFile = (filename, values, setFieldValue) => {
    const list = values.filesToUpload.filter(file => file.name !== filename);
    setFieldValue('filesToUpload', list);
  };

  const onRemoveFile = (filename, values) => {
    const list = fileList.filter(file => file.name !== filename);
    const files = values.files.filter(file => getFilenameFromUrl(file) !== filename);
    values.files = [...files];
    setFileList(list);
  };

  const removeStudent = (students, studentId) => {
    if (!students || !Array.isArray(students) || !students.length) {
      return [];
    }
    const newList = students.filter(s => s.id !== studentId);

    const filteredList = filterStudents(studentList, newList);
    setFilteredList(filteredList);

    return newList;
  };

// End Form Actions

  if (loading) {
    return <LoadingSpinner/>;
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >{({isSubmitting, values, handleChange, handleSubmit, setFieldValue}) =>
      <Form className="form-container">
        <header className="form-header">
          <h3>{values.id ? dict("calendar/item-modal/title/update") : dict("calendar/item-modal/title/create")}</h3>
        </header>
        <div className="form-content" onSubmit={handleSubmit}>
          <div className="form-main-content">

            <div className="form-field">
              <label className="form-label" htmlFor="itemType">{dict("calendar/item-modal/input/item-type")}</label>
              <Field className="form-input" as="select"
                     name="typeId" id="itemType"
                     value={values.typeId || 1}
                     onChange={handleChange}
              >
                {
                  types.map(t => <option key={t.id + t.name} value={t.id}>{t.name}</option>)
                }
              </Field>
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="subject">{dict("calendar/item-modal/input/subject")}</label>
              <Field className="form-input" as="input" name="subject" id="subject"
                     value={values.subject}
                     onChange={handleChange}
                     innerRef={subjectRef}
              />
              <ErrorMessage className="form-input-error" name="subject" component="div"/>
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="location">{dict("calendar/item-modal/input/location")}</label>
              <Field className="form-input" as="input" name="location" id="location"
                     value={values.location}
                     onChange={handleChange}
              />
              <ErrorMessage className="form-input-error" name="location" component="div"/>
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="startDate">{dict("calendar/item-modal/input/schedule/label")}</label>
            </div>

            <div className="form-row">
              {/*
              <Field className="form-input" as="input" type="date"
                     name="startDate" id="startDate"
                     value={values.startDate}
                     onChange={handleChange}
              />
*/}
              {parseInt(values.typeId, 10) !== 7 && <DateInput
                customClassName="date-picker-custom"
                name="startDate" id="startDate"
                value={values.startDate}
                onChange={(date) => {
                  setFieldValue('startDate', date);
                  if (values.endDate < date) {
                    setFieldValue('endDate', date);
                  }
                }}
                format="dd/MM/y"
              />}

              {!values.allDay &&
              <React.Fragment>
                {/*
                <Field className="form-input" as="input" type="time"
                       name="startTime" id="startTime"
                       value={values.startTime || ''}
                       onChange={handleChange}
                />
*/}
                <TimeInput
                  value={values.startTime || ''}
                  name="startTime"
                  onChange={(name, value) => {
                    setFieldValue(name, value);
                  }}
                />
                <label className="form-label" htmlFor="endDate">&nbsp;&nbsp;{dict("calendar/item-modal/input/schedule/until")}</label>
                {/*
                <Field className="form-input" as="input" type="time"
                       name="endTime" id="endTime"
                       value={values.endTime || ''}
                       onChange={handleChange}
                />
*/}
                <TimeInput
                  value={values.endTime || ''}
                  name="endTime"
                  onChange={(name, value) => {
                    setFieldValue(name, value);
                  }}
                />
              </React.Fragment>
              }
              {(!values.allDay || parseInt(values.typeId, 10) === 7) &&
              <DateInput
                customClassName="date-picker-custom"
                name="endDate" id="endDate"
                value={values.endDate}
                onChange={(date) => {
                  setFieldValue('endDate', date);
                  if (parseInt(values.typeId, 10) === 7) {
                    setFieldValue('startDate', date);
                  }
                }}
                format="dd/MM/y"
              />
              }
            </div>
            <div className="form-row">
              <ErrorMessage className="form-input-error" name="startDate" component="div"/>
              <ErrorMessage className="form-input-error" name="endDate" component="div"/>
              <ErrorMessage className="form-input-error" name="endTime" component="div"/>
            </div>

            <div className="form-row">
              <label className="form-label" htmlFor="allDay">
                <Field className="form-input" type="checkbox"
                       name="allDay" id="allDay"
                       value={values.allDay}
                       checked={values.allDay}
                       onChange={(e) => {
                         // console.log(e.target.value, e.target.checked);
                         const {checked} = e.target;
                         setFieldValue('allDay', checked);
                         if (!checked) {
                           setFieldValue('startTime', initialValues.startTime);
                           setFieldValue('endDate', values.startDate);
                           setFieldValue('endTime', initialValues.endTime);
                         }
                       }}
                />
                {dict("calendar/item-modal/input/schedule/checkbox/all-day")}
              </label>
              <label className="form-label" htmlFor="repeats">
                <Field className="form-input" type="checkbox"
                       name="repeats" id="repeats"
                       value={values.repeats}
                       checked={values.repeats}
                       onChange={handleChange}
                />
                {dict("calendar/item-modal/input/schedule/checkbox/repeat")}
              </label>
            </div>

            {
              values.repeats && <React.Fragment>
                <div className="form-row">
                  <label className="form-label" htmlFor="repeatInterval">{dict("calendar/item-modal/input/schedule/repeat/label")}</label>
                  <Field className="form-input" as="input" type="number"
                         name="repeatInterval" id="repeatInterval"
                         value={values.repeatInterval || 1}
                         onChange={handleChange}
                  />
                  <Field className="form-input" as="select"
                         name="repeatIntervalType" id="repeatIntervalType"
                         value={values.repeatIntervalType === 'none' ? 'day' : values.repeatIntervalType}
                         onChange={handleChange}
                  >
                    <option value="none">{dict("calendar/item-modal/input/schedule/repeat/option/none")}</option>
                    <option value="day">{dict("calendar/item-modal/input/schedule/repeat/option/day")}</option>
                    <option value="week">{dict("calendar/item-modal/input/schedule/repeat/option/week")}</option>
                    <option value="month">{dict("calendar/item-modal/input/schedule/repeat/option/month")}</option>
                    <option value="year">{dict("calendar/item-modal/input/schedule/repeat/option/year")}</option>
                  </Field>
                  {
                    values.repeatIntervalType === 'week' &&
                    <FieldArray
                      name="repeatDays"
                      render={(arrayHelpers) => (
                        <>
                          {dayNamesShort.map((day, i) => (
                            <label key={day + i} className="form-label">
                              <Field
                                className="form-input"
                                name="repeatDays"
                                type="checkbox"
                                value={day.toLowerCase()}
                                checked={values.repeatDays.includes(day.toLowerCase())}
                                onChange={e => {
                                  if (e.target.checked) {
                                    arrayHelpers.push(day.toLowerCase());
                                  } else {
                                    const idx = values.repeatDays.indexOf(day.toLowerCase());
                                    arrayHelpers.remove(idx);
                                  }
                                }}
                              />
                              {day}
                            </label>
                          ))}
                        </>
                      )}
                    />
                  }
                </div>
                <div className="form-row">
                  <label className="form-label" htmlFor="repetitionEnds">
                    <Field className="form-input" type="checkbox"
                           name="repetitionEnds" id="repetitionEnds"
                           value={values.repetitionEnds}
                           checked={values.repetitionEnds}
                           onChange={handleChange}
                    />
                    {dict("calendar/item-modal/input/schedule/repeat/repetition-end")}
                  </label>
                  {
                    values.repetitionEnds && <>
                      <label className="form-label" htmlFor="repetitionEndsOnDate">On:</label>
                      <DateInput
                        customClassName="date-picker-custom"
                        name="repetitionEndsOnDate" id="repetitionEndsOnDate"
                        value={values.repetitionEndsOnDate}
                        onChange={(date) => setFieldValue('repetitionEndsOnDate', date)}
                        format="dd/MM/y"
                      />

                      {/*
                      <Field className="form-input" as="input" type="date"
                             name="repetitionEndsOnDate" id="repetitionEndsOnDate"
                             value={values.repetitionEndsOnDate || ''}
                             onChange={handleChange}
                      />
*/}
                      {
                        !!!values.repetitionEndsOnDate && <>
                          <label className="form-label" htmlFor="repetitionEndsAfterOccurrences">After:</label>
                          <Field className="form-input" style={{maxWidth: '70px'}}
                                 as="input" type="number"
                                 name="repetitionEndsAfterOccurrences" id="repetitionEndsAfterOccurrences"
                                 value={values.repetitionEndsAfterOccurrences || 1}
                                 onChange={handleChange}
                          />
                          <label className="form-label">occurrences</label>
                        </>
                      }
                    </>
                  }
                </div>
                <div className="form-row">
                  <ErrorMessage className="form-input-error" name="repetitionEndsOnDate" component="div"/>
                </div>
              </React.Fragment>
            }
            <div className="form-field">
              <label className="form-label" htmlFor="description">{dict("calendar/item-modal/input/description")}</label>
              <Field className="form-input" as="textarea" rows="3"
                     style={{resize: 'none', padding: '10px', maxWidth: '98%'}}
                     name="description" id="description"
                     value={values.description}
                     onChange={handleChange}
              />
            </div>
            <div className="form-field">
              <label className="form-label">{dict("calendar/item-modal/input/attach/label")}</label>
              <button
                type="button"
                className="form-button"
                onClick={(e) => {
                  const inputField = document.getElementById('fileUpload');
                  inputField.click();
                }}
              >{dict("calendar/item-modal/input/attach/button")}
              </button>
              <input
                id="fileUpload"
                type="file"
                name="attachments"
                accept="*"
                placeholder="Attachment"
                capture
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files);
                  const filesToUpload = values.filesToUpload.concat(files);
                  setFieldValue('filesToUpload', filesToUpload);
                }}
                hidden={true}
              />
              <div className="form-field">
                {
                  values.filesToUpload.map(file => {
                    return <label key={file.name} className="form-filename">
                      <span
                        className="form-x-button"
                        title="Remove this attachment"
                        onClick={() => onRemoveSelectedFile(file.name, values, setFieldValue)}>X</span>
                      {file.name}
                    </label>
                  })
                }
                {
                  fileList.map((file, i) =>
                    (<label
                      key={i} className="form-filename">
                      <span
                        className="form-x-button"
                        title="Remove this attachment"
                        onClick={() => onRemoveFile(file.name, values)}>X</span>
                      <a href={file.url} target="_blank">{file.name}</a>
                    </label>))
                }
              </div>
            </div>
          </div>
          <div className="form-side-content">
            <div className="form-side-top">
              <ErrorMessage className="form-input-error" name="visibleTo" component="div"/>
              <VisibilityFilter
                isFrom="CalendarItemForm"
                title={dict("calendar/item-modal/visibility/title")}
                campuses={campuses}
                levels={levels}
                grades={grades}
                groups={groups}
                afterSchoolGroups={afterSchoolGroups}
                updateVisibilityFilters={(tree) => setFieldValue('visibleTo', setVisibleTo(tree))}
              />
            </div>
            {
              parseInt(values.typeId, 10) === 5 &&
              <div className="form-side-bottom">
                <label className="form-label">Who is assigned to this item?</label>
                <div className="form-field">
                  <label className="form-label" htmlFor="students">Select Students:</label>
                  <Field className="form-input" as="select" multiple
                         name="students" id="students"
                         value={values.students}
                         onChange={(evt) => {
                           const selected = [].slice
                             .call(evt.target.selectedOptions)
                             .map(option => option.value);
                           const selectedStudents = studentList.filter(s => selected.includes(s.id + ""));
                           setFieldValue(
                             "students",
                             (values.students || []).concat(selectedStudents)
                           );
                           const newList = filterStudents(filteredList, selectedStudents);
                           setFilteredList(newList);
                         }}
                  >
                    {
                      filteredList.map(s => <option key={s.id + s.name} value={s.id}>{s.name}</option>)
                    }
                  </Field>
                </div>
                {
                  (values.students || []).map((s, i) =>
                    (<label
                      key={s.name + s.id + i} className="form-filename">
                      <span
                        className="form-x-button"
                        title="Remove this student"
                        onClick={() => setFieldValue('students', removeStudent(values.students, s.id))}>X</span>
                      {s.name}
                    </label>))
                }
              </div>
            }
          </div>
        </div>
        <div className="form-actions-container">
          <button
            type="button"
            className="dialog-button dialog-button-secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            {dict("calendar/item-modal/button/cancel")}
          </button>
          <button
            className="dialog-button dialog-button-primary"
            type="submit" disabled={isSubmitting}
          >
            {isSubmitting ? dict("calendar/item-modal/button/saving") : dict("calendar/item-modal/button/save")}
          </button>
        </div>
        <Dialog
          header={dict("calendar/item-modal/change-repeat")}
          labelPrimary={dict("calendar/item-modal/button/save")}
          labelSecondary={dict("calendar/item-modal/button/cancel")}
          open={openDialog}
          onClose={toggleDialog}
          repeats={values.repeats}
          closeOnOverlayClick={false}
          onClickPrimary={onSave}
          data={values}
        />
      </Form>
    }
    </Formik>
  );
};


export default CalendarItemForm;
