import React, {useEffect, useLayoutEffect, useState} from "react";
import "./CalendarContainer.css"

import {getDatesInYear, uploadAttachments, createCalendarItem} from "../../services/calendarService";
import {getTypesList} from "../../services/calendarService";

import {getCampusList} from "../../services/campusService";
import {getLevelList} from "../../services/levelService";
import {getGradeList} from "../../services/gradeService";
import {getGroupList} from "../../services/groupService";
import {getAfterSchoolGroupList} from "../../services/afterSchoolGroupService";

import LoadingSpinner from "../UI/LoadingSpinner"

import MonthCalendar from "./MonthCalendar";
import ItemTypesFilter from "./ItemTypesFilter";
import VisibilityFilter from "./VisibilityFilter";

import {FormModal} from "../UI/Modal";
import CalendarItemForm from "./CalendarItemForm/CalendarItemForm";

import {getDateString, searchTree, deepCloneArray, adjustDatesForTZ, getSelectedDate} from "../../utils";

import WeekCalendar from "./WeekCalendar";

import { setCurrentPage } from "../../services/localStorageService";

import { useDict } from "../UI/Translations"

const todayStr = getDateString(new Date());

async function getDataFromServer() {
  const promises = [
    getDatesInYear(),
    getTypesList(),
    getCampusList(),
    getLevelList(),
    getGradeList(),
    getGroupList(),
    getAfterSchoolGroupList(),
  ];
  return Promise.all(promises);
}

const CalendarContainer = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [dates, setDates] = useState([]);
  const [types, setTypes] = useState([]);

  const [campuses, setCampuses] = useState([]);
  const [levels, setLevels] = useState([]);
  const [grades, setGrades] = useState([]);
  const [groups, setGroups] = useState([]);
  const [afterSchoolGroups, setAfterSchoolGroups] = useState([]);

  const [campuses2, setCampuses2] = useState([]);
  const [levels2, setLevels2] = useState([]);
  const [grades2, setGrades2] = useState([]);
  const [groups2, setGroups2] = useState([]);
  const [afterSchoolGroups2, setAfterSchoolGroups2] = useState([]);

  const [typeFilters, setTypeFilters] = useState([]);
  const [visibilityFilters, setVisibilityFilters] = useState([]);

  const [weekDate, setWeekDate] = useState(todayStr);

  const [selectedDate, setSelectedDate] = useState(todayStr);

  const [newItem, setNewItem] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [allCheckedCalendarItems, setAllCheckedCalendarItems] = useState(false);
  const [allCheckedItems, setAllCheckedItems] = useState(false);

  const dict = useDict('/calendar')

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  setCurrentPage('/calendar');

  useLayoutEffect(() => {
    async function getData() {
      const [
        dates,
        types,
        campuses,
        levels,
        grades,
        groups,
        afterSchoolGroups
      ] = await getDataFromServer();

      setDates(dates);
      setTypes(types.map(t => ({ ...t, isChecked: true })));
      setAllCheckedCalendarItems(true);
      setTypeFilters(types.map(t => ({ ...t, isChecked: true })));
      setCampuses(campuses);
      setLevels(levels);
      setGrades(grades);
      setGroups(groups);
      setAfterSchoolGroups(afterSchoolGroups);

      setSelectedDate(getSelectedDate(todayStr, dates));
      setWeekDate(getSelectedDate(todayStr, dates));

      const campuses2 = deepCloneArray(campuses);
      const levels2 = deepCloneArray(levels);
      const grades2 = deepCloneArray(grades);
      const groups2 = deepCloneArray(groups);
      const afterSchoolGroups2 = deepCloneArray(afterSchoolGroups);

      setCampuses2(campuses2);
      setLevels2(levels2);
      setGrades2(grades2);
      setGroups2(groups2);
      setAfterSchoolGroups2(afterSchoolGroups2);

      setLoading(false);
    }

    try {
      getData();
    } catch (e) {
      console.log(e);
      setLoading(false);
      setError(true); // show error page
    }
  }, [newItem]);

  useEffect(() => {
    setNewItem(false);
  }, [newItem]);

  useEffect(() => {
    setNewItem(false);
  }, [newItem]);

  const addTypeFilter = (id) => {
    let filters = typeFilters.filter(t => t.isChecked);

    if(typeof id === "object"){
      let itemName = id.target.name;
      let checked = id.target.checked;

      if (itemName === "Select All") {
        setAllCheckedCalendarItems(checked);
        if(!checked){
          setTypeFilters([]);
        } else {
          setTypeFilters(types.map(t => ({ ...t, isChecked: checked })));
        }
        setTypes(types.map(t => ({ ...t, isChecked: checked })));
      }
    }

    if(typeof id === "number"){
      const updatedTypes = types.map((t) => {
        if (t.id !== id) {
          return t;
        }
        t.isChecked = !(t.isChecked || false);

        if (t.isChecked) {
          filters.push(t);
        } else {
          filters = typeFilters.filter(t => t.id !== id);
        }
        return t;
      });
      setAllCheckedCalendarItems(types.every(t => t.isChecked));
      setTypeFilters(filters);
      setTypes(updatedTypes);
    }
  };

  const updateVisibilityFilters = (tree) => {
    const filters = searchTree(tree, (item) => item.isChecked, true);
    // console.dir(filters);
    setVisibilityFilters(filters);
  };

  const handleDateClick = (date) => {
    // console.log("DATE CLICKED", date);
    setWeekDate(date);
    setSelectedDate(date);
  };

  const onSave = async (item) => {
    // console.log(item.file);
    let newItem  = adjustDatesForTZ(item);
    newItem = await createCalendarItem(newItem);
    if (item.filesToUpload.length) {
      await uploadFiles(newItem.id, item.filesToUpload);
    }
    console.log('Saved New Calendar Item!');
    setNewItem(true);
  };

  const uploadFiles = async (itemId, files) => {
    try {
      await uploadAttachments(itemId, files);
    } catch (err) {
      console.log(err);
    }
  };

  return (<>
    {
      loading ? <LoadingSpinner /> :
        (<div className="calender-wrapper">
          <div className="sidebar">
            <button
              type="button"
              onClick={toggle}
              className="add-button sidebar-content center-flex-items"
            >
              <span className="plus">+</span>{` ${dict("sidebar/add-button")}`}
            </button>
            <MonthCalendar
              dates={dates}
              handleDateClick={handleDateClick}
              selectedDate={selectedDate}
            />
            <ItemTypesFilter allChecked={allCheckedCalendarItems} types={types} addTypeFilter={addTypeFilter}/>
            <VisibilityFilter
              isFrom="CalendarContainer"
              title={dict("sidebar/visibility/title")}
              campuses={campuses}
              levels={levels}
              grades={grades}
              groups={groups}
              afterSchoolGroups={afterSchoolGroups}
              updateVisibilityFilters={updateVisibilityFilters}
              allChecked={allCheckedItems}
              setAllCheckedItems={setAllCheckedItems}
            />
          </div>

          <div className="content">
            <WeekCalendar
              weekDate={weekDate}
              filters={typeFilters}
              visibility={visibilityFilters}
              newItem={newItem}
              types={[...types]}
              campuses={campuses2}
              levels={levels2}
              grades={grades2}
              groups={groups2}
              afterSchoolGroups={afterSchoolGroups2}
            />
          </div>
          <FormModal
            open={isOpen}
            onClose={toggle}
          >
            <CalendarItemForm
              item={{
                typeId: 1,
                startDate: selectedDate > todayStr ? selectedDate : todayStr,
                endDate: selectedDate > todayStr ? selectedDate : todayStr,
                startTime: '09:00', endTime: '09:15'
              }}
              onClose={toggle}
              onSave={onSave}
              types={[...types]}
              campuses={campuses2}
              levels={levels2}
              grades={grades2}
              groups={groups2}
              afterSchoolGroups={afterSchoolGroups2}
            />
          </FormModal>
        </div>)
    }
  </>);
};

export default CalendarContainer;
