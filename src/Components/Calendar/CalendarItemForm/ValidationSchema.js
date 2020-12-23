import * as Yup from 'yup';

const moment = require('moment');

export default Yup.object().shape({
  subject: Yup.string("Enter Title").required("Title is required"),
  startDate: Yup.date("Start Date")
    .required("Start Date it required")
    .min(moment().format("YYYY-MM-DD"), "Start Date must be equal to or greater than today"),
  endDate: Yup.date("End Date")
    .test("is-greater", "End Date must be equal to or greater than Start Date", function (value) {
      const {startDate, allDay} = this.parent;
      return allDay || !value || moment(value, "YYYY-MM-DD").isSameOrAfter(moment(startDate, "YYYY-MM-DD"));
    }).nullable(),
  repetitionEndsOnDate: Yup.date("Repetition Ends Date")
    .test("is-greater", "Repetition End Date must be equal to or greater than Start/End Date", function (value) {
      const {startDate, endDate, allDay, repeats, repetitionEnds} = this.parent;
      const checkDate = !!endDate && !allDay ? endDate : startDate;
      return !repeats || !repetitionEnds ||
        !value || moment(value, "YYYY-MM-DD").isSameOrAfter(moment(checkDate, "YYYY-MM-DD"));
    }).nullable(),
  endTime: Yup.string()
    .test("is-greater", "End Time must be greater than Start Time", function (value) {
      const {startTime, endDate, allDay} = this.parent;
      return allDay || !endDate || moment(value, "HH:mm").isAfter(moment(startTime, "HH:mm"));
    }).nullable(),
  visibleTo: Yup.mixed()
    .test("is-not-empty", "Please define who can see this item", function (value) {
      return value && (Object.keys(value).length);
    })

});
