import React, {useState, useEffect} from "react";

import './WeekCalendar.css';
import {
  getDateString,
  getWeekName, getWeekDates,
  getNextWeekDate,
  getPriorWeekDate,
  prepareWeekData,
  applyAllFilters,
  adjustDatesForTZ, getNumberAsString,
} from "../../../utils";
import {
  getDatesInWeek,
  getDataForWeek,
  removeCalendarItem,
  uploadAttachments,
  updateCalendarItem
} from "../../../services/calendarService";

import WeekHeader from "./WeekHeader";
import TimeView from "./TimeView";
import EmptyItem from './EmptyItem';
import CalendarItem from "./CalendarItem";

import {FormModal} from "../../UI/Modal";
import CalendarItemView from "../CalenderItemView";
import CalendarItemForm from "../CalendarItemForm";

var moment = require('moment');

const WeekCalendar = ({
                        weekDate, filters, visibility, types, newItem,
                        campuses, levels, grades, groups, afterSchoolGroups,
                      }) => {
  const [currentDate, setCurrentDate] = useState(weekDate);
  const [currentWeek, setCurrentWeek] = useState([]);

  const [calendarData, setCalendarData] = useState([]);
  const [filteredCalendarData, setFilteredCalendarData] = useState([]);

  const [weekName, setWeekName] = useState('');
  const [weekDates, setWeekDates] = useState([]);

  const [selectedItem, setSelectedItem] = useState({});
  const [refreshData, setRefreshData] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => {
    setIsOpen(!isOpen);
  };

  const [isOpenForm, setIsOpenForm] = useState(false);
  const toggleForm = () => {
    setIsOpenForm(!isOpenForm);
  };

  const applyFilters = (weekData, filters, visibility) => {
    const filteredData = applyAllFilters(weekData, filters, visibility);
    setFilteredCalendarData(filteredData);
  };

  async function getData() {
    const dates = await getDatesInWeek(currentDate);

    const weekName = getWeekName(dates);
    const weekDates = getWeekDates(dates);
    
    const padIt = n => n < 10 ? `0${n}` : `${n}`

    if (dates.length) {
      let startDate = dates[0].date;
      const dow = parseInt(dates[0].dow, 10);
      if (dow > 0) {
        const _startDate = moment(startDate, 'YYYY-MM-DD').subtract(dow, 'days');
        weekDates.unshift(getNumberAsString(_startDate.date(), 2));
        for (let i = 1; i < dow; i++) {
          weekDates.splice(i, 0, padIt(_startDate.add(1, 'days').date()));
        }
      }

      const endDate = dates[dates.length - 1].date;
      const data = await getDataForWeek(startDate, endDate);

      const weekData = prepareWeekData(data);
      await setCalendarData(weekData);
      applyFilters(weekData, filters, visibility);
    }
    setCurrentWeek(dates);
    setWeekName(weekName);
    setWeekDates(weekDates);
    setRefreshData(false);
  }

  useEffect(() => {
    setCurrentDate(weekDate);
  }, [weekDate]);

  useEffect(() => {
    getData();
  }, [currentDate, refreshData, newItem]);

  useEffect(() => {
    applyFilters(calendarData, filters, visibility);
  }, [calendarData, filters, visibility]);

  const handleNextWeek = () => {
    const nextWeekDate = getNextWeekDate(currentWeek);
    setCurrentDate(nextWeekDate);
  };

  const handlePriorWeek = () => {
    const priorWeekDate = getPriorWeekDate(currentWeek);
    setCurrentDate(priorWeekDate);
  };

  const handleSelectItem = (item) => {
    setSelectedItem(item);
    toggle();
  };

  const onSave = async (item, saveAll = true) => {
    let newItem;
    if (item.id) {
      const updates = adjustDatesForTZ(item);
      newItem = await updateCalendarItem(updates, saveAll);
    }
    if (item.filesToUpload.length) {
      await uploadFiles(newItem.id, item.filesToUpload);
    }
    console.log('Saved Calendar Item!');
    toggleForm();
    setRefreshData(true);
  };

  const uploadFiles = async (itemId, files) => {
    try {
      await uploadAttachments(itemId, files);
    } catch (err) {
      console.log(err);
    }
  };

  const onDelete = async (itemId, date, deleteAllDates) => {
    await removeCalendarItem(itemId, date, deleteAllDates);
    setRefreshData(true);
  };

  const onEdit = async () => {
    toggle();
    toggleForm();
  };

  return (
    <div className="calendar-week">
      <div className="week-header center-flex-items">
        <div className="week-buttons">
          <span className="week-nav-button" onClick={handlePriorWeek}>&lt;</span>
          <span className="week-nav-button" onClick={handleNextWeek}>&gt;</span>
        </div>
        <div className="week-name">{weekName}</div>
      </div>

      <div className="week-body">
        <WeekHeader dates={weekDates}/>
        {
          filteredCalendarData.map((time, index) => {
            return (
              <div className="week-data-row" key={time.startTime + index}>
                <TimeView time={time}/>
                {
                  time.data.map((date, i) => (
                    <span className="week-cell week-data" key={date + (i + 1)}>
                      {
                        !date.items.length && (<EmptyItem/>)
                      }
                      {
                        date.items.map(item => (
                          <CalendarItem
                            key={item.id}
                            item={item}
                            onClick={() => handleSelectItem(item)}
                          />
                        ))
                      }
                    </span>))
                }
              </div>)
          })
        }
      </div>
      <FormModal
        open={isOpen}
        onClose={toggle}
      >
        <CalendarItemView
          item={selectedItem}
          onClose={toggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      </FormModal>

      <FormModal
        open={isOpenForm}
        onClose={toggleForm}
      >
        <CalendarItemForm
          item={selectedItem}
          onClose={toggleForm}
          onSave={onSave}
          types={[...types]}
          campuses={[...campuses]}
          levels={[...levels]}
          grades={[...grades]}
          groups={[...groups]}
          afterSchoolGroups={[...afterSchoolGroups]}
        />
      </FormModal>
    </div>
  );
};

export default WeekCalendar;

/*

<FormModal
  open={isOpen}
  onClose={toggle}
>
  <CalendarItemForm
    item={selectedItem}
    onClose={toggle}
    onDelete={onDelete}
    onSave={onSave}
    types={[...types]}
    campuses={[...campuses]}
    levels={[...levels]}
    grades={[...grades]}
    groups={[...groups]}
    afterSchoolGroups={[...afterSchoolGroups]}
  />
</FormModal>
*/
