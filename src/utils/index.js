import React from "react";
import * as cloneDeep from 'lodash/cloneDeep';

const _ = require('lodash');

export function getDateString(date) {
  // console.log('Original Date', date, typeof date, date.getUTCHours());
  if (date.getUTCHours() > 0) {
    date.setHours(0, 0, 0);
    // console.log('Date after setting time to 0', date);
    date.setMinutes(-1 * date.getTimezoneOffset());
  }
  const dateStr = date.toISOString().slice(0, 10);
  // console.log('Date String', dateStr);
  return dateStr;
}

export function getDatesForMonth(dates, month, year, today, DayComponent, selectedDate, handleDateClick) {
  // console.log(dates, month, year);
  const list = dates.filter(d => d.month === month && d.year === year);
  const firstDay = list[0].dow;
  // console.log(firstDay);
  let blanks = [];
  for (let i = 0; i < firstDay; i++) {
    blanks.push(
      <DayComponent key={(i + 1) * firstDay} date={null}/>
    );
  }

  const daysInMonth = list.map((d) => {
    const isToday = d.date === today;
    return <DayComponent
      key={d.date}
      handleDateClick={handleDateClick}
      date={d}
      isToday={isToday}
      selectedDate={selectedDate}
    />;
  });

  const totalDays = [...blanks, ...daysInMonth];
  // console.log(totalDays);
  const rows = [];
  let cells = [];
  totalDays.forEach((row, i) => {
    if (i % 7 !== 0) {
      cells.push(row); // do not go to next week
    } else {
      rows.push(cells); // when reach next week, put all cells in last week to rows
      cells = []; // empty container
      cells.push(row); // still need to push current row to new container
    }
    if (i === totalDays.length - 1) { // when end loop we add remaining cells
      rows.push(cells);
    }
  });

  return rows;
}

export function getNumberAsString(number, width) {
  const str = number + (10 ** width) + '';
  return str.substr(1, width);
}

export function getNextMonth(currentMonth) {
  let nextMonth = parseInt(currentMonth, 10) + 1;
  if (nextMonth > 12) {
    nextMonth = 1;
  }
  return getNumberAsString(nextMonth, 2);
}

export function getPriorMonth(currentMonth) {
  let priorMonth = parseInt(currentMonth, 10) - 1;
  if (priorMonth < 1) {
    priorMonth = 12;
  }
  return getNumberAsString(priorMonth, 2);
}

export function getNextWeekDate(weekDates) {
  if (!weekDates || !Array.isArray(weekDates) || !weekDates.length) {
    return '';
  }
  const l = weekDates.length - 1;
  const date = new Date(weekDates[l].date);
  date.setDate(date.getDate() + 1);
  return getDateString(date);
}

export function getPriorWeekDate(weekDates) {
  if (!weekDates || !Array.isArray(weekDates) || !weekDates.length) {
    return '';
  }
  const date = new Date(weekDates[0].date);
  date.setDate(date.getDate() - 1);
  return getDateString(date);
}

export function getTree(campuses, levels, grades, groups, afterSchoolGroups) {
  const tree = [];
  const lvls = _.groupBy(levels, 'campusId');
  const grds = _.groupBy(grades, 'levelId');
  const grps = _.groupBy(groups, 'gradeId');
  const asgs = _.groupBy(afterSchoolGroups, 'campusId');

  const gradeNodes = {};
  for (const g of grades) {
    const {id, name, levelId, isChecked} = g;
    const grade = {id, name, isChecked, levelId, depth: 2, children: grps[id] || []};
    if (gradeNodes[levelId]) {
      gradeNodes[levelId] = [...gradeNodes[levelId], grade];
    } else {
      gradeNodes[levelId] = [grade];
    }
  }

  const levelNodes = {};
  for (const l of levels) {
    const {id, name, campusId, isChecked} = l;
    const level = {id, name, isChecked, campusId, depth: 1, children: gradeNodes[id] || []};
    if (levelNodes[campusId]) {
      levelNodes[campusId] = [...levelNodes[campusId], level];
    } else {
      levelNodes[campusId] = [level];
    }
  }

  const asgNodes = {};
  for (const g of afterSchoolGroups) {
    const {id, name, campusId, isChecked, Teachers} = g;
    const group = {id, name, isChecked, campusId, Teachers, depth: 1};
    if (asgNodes[campusId]) {
      asgNodes[campusId] = [...asgNodes[campusId], group];
    } else {
      asgNodes[campusId] = [group];
    }
  }

  for (const c of campuses) {
    const {id, name, isChecked} = c;
    tree.push({id, name, isChecked, depth: 0, children: (levelNodes[id] || []).concat(asgNodes[id] || [])});
  }
  // console.dir(tree);
  return tree;
}

export function findInTree(item, treeItems) {
  let i = 0, found;

  for (; i < treeItems.length; i++) {
    const thisItem = treeItems[i];

    if (thisItem.id === item.id && thisItem.name === item.name) {
      return thisItem;
    } else if (_.isArray(thisItem.children)) {
      found = findInTree(item, thisItem.children);
      if (found) {
        return found;
      }
    }
  }
}

export function updateParentNodes(tree) {
  const children = {checked: null};
  for (const node of tree) {
    if (node.children && _.isArray(node.children)) {
      const checked = updateParentNodes(node.children);
      if (checked !== null) {
        node.isChecked = checked;
      }
    }

    // children.children.push(node);
    if (children.checked === null) {
      children.checked = node.isChecked;
    } else {
      children.checked = children.checked && (node.isChecked || false);
    }
  }
  return children.checked;
}

export function deepCloneArray(arr) {
  return arr.map(e => cloneDeep(e));
}

export function checkUpTheTree(tree) {
  const children = {checked: false};
  for (const node of tree) {
    if (node.children && _.isArray(node.children)) {
      const checked = checkUpTheTree(node.children);
      if (checked !== null) {
        node.isChecked = checked;
      }
    }
    // console.log('In check up the tree', node.name, node.isChecked);
    if (node.isChecked) {
      children.checked = true
    }
  }
  return children.checked;
}

export function getVisibleTo(tree) {
  // console.log("Before checkUpTheTree");
  // console.dir(tree);

  checkUpTheTree(tree);

  // console.log("After checkUpTheTree");
  // console.dir(tree);

  const campuses = [];
  const levels = [];
  const grades = [];
  const groups = [];
  const asgs = [];

  for (const c of tree) {
    // console.log(c.name, c.isChecked);
    if (c.isChecked) {
      campuses.push(c.id);
    }
    if (!c.children) {
      continue;
    }

    for (const l of c.children) {
      // console.log(l);
      if (l.isChecked) {
        if (!('Teachers' in l)) {
          levels.push(l.id);
        } else {
          asgs.push(l.id);
        }
      }
      if (!l.children) {
        continue;
      }

      for (const grd of l.children) {
        if (grd.isChecked) {
          grades.push(grd.id);
        }
        if (!grd.children) {
          continue;
        }

        for (const grp of grd.children) {
          if (grp.isChecked) {
            groups.push(grp.id);
          }
        }
      }
    }
  }
  const visibleTo = {};
  if (campuses.length) {
    visibleTo['campuses'] = campuses;
  }

  if (levels.length) {
    visibleTo['levels'] = levels;
  }

  if (grades.length) {
    visibleTo['grades'] = grades;
  }

  if (groups.length) {
    visibleTo['groups'] = groups;
  }

  if (asgs.length) {
    visibleTo['afterSchoolGroups'] = asgs;
  }
  // console.dir(visibleTo);
  return visibleTo;
}

function updateUpperLevels(treeObj, Campuses, Levels, Grades) {
  for (const item of Grades) {
    const thisItem = findInTree(item, treeObj);
    item.isChecked = thisItem ? thisItem.isChecked || false : false;
  }
  for (const item of Levels) {
    const thisItem = findInTree(item, treeObj);
    item.isChecked = thisItem ? thisItem.isChecked || false : false;
  }

  for (const item of Campuses) {
    const thisItem = findInTree(item, treeObj);
    item.isChecked = thisItem ? thisItem.isChecked || false : false;
  }
}

export function initVisibilityFilters(visibleTo = {}, Campuses, Levels, Grades, Groups, AfterSchoolGroups) {
  const treeObj = getTree(Campuses, Levels, Grades, Groups, AfterSchoolGroups);

  const {groups, afterSchoolGroups} = visibleTo;

  if (afterSchoolGroups) {
    for (const group of AfterSchoolGroups) {
      group.isChecked = !!afterSchoolGroups.includes(group.id);
      if (group.isChecked) {
        const thisItem = findInTree(group, treeObj);
        updateAllNodes(thisItem, true);
      }
    }
  } else {
    for (const group of AfterSchoolGroups) {
      group.isChecked = false;
    }
  }

  if (groups) {
    for (const group of Groups) {
      group.isChecked = !!groups.includes(group.id);
      if (group.isChecked) {
        const thisItem = findInTree(group, treeObj);
        updateAllNodes(thisItem, true);
      }
    }
  } else {
    for (const group of Groups) {
      group.isChecked = false;
    }
  }
  updateParentNodes(treeObj);
  updateUpperLevels(treeObj, Campuses, Levels, Grades);

  return treeObj;

  /*
    if (grades) {
      for (const grade of Grades) {
        grade.isChecked = !!grades.includes(grade.id);
      }
    } else {
      for (const grade of Grades) {
        grade.isChecked = false;
      }
    }

    if (levels) {
      for (const level of Levels) {
        level.isChecked = !!levels.includes(level.id);
      }
    } else {
      for (const level of Levels) {
        level.isChecked = false;
      }
    }

    if (campuses) {
      for (const campus of Campuses) {
        campus.isChecked = !!campuses.includes(campus.id);
      }
    } else {
      for (const campus of Campuses) {
        campus.isChecked = false;
      }
    }
  */
}

export function updateAllNodes(item, isChecked) {
  item.isChecked = isChecked;
  if (item.children && item.children.length) {
    item.children.map(c => updateAllNodes(c, isChecked));
  }
}

/**
 * searches through all arrays of the tree
 * @param aTree the tree array
 * @param fCompare This function will receive each node. It's upon you to define which
 *        condition is necessary for the match. It must return true if the condition is matched. Example:
 *        function(oNode){ if(oNode["Name"] === "AA") return true; }
 * @param bGreedy? use true to do not stop after the first match, default is false
 * @return an array with references to the nodes for which fCompare was true; In case no node was found an empty array
 *         will be returned
 */
export function searchTree(aTree, fCompare, bGreedy) {
  const aInnerTree = []; // will contain the inner children
  let oNode; // always the current node
  const aReturnNodes = []; // the nodes array which will returned

  // 1. loop through all root nodes so we don't touch the tree structure
  for (const keysTree in aTree) {
    aInnerTree.push(aTree[keysTree]);
  }
  while (aInnerTree.length > 0) {
    oNode = aInnerTree.pop();
    // check current node
    if (fCompare(oNode)) {
      aReturnNodes.push(oNode);
      if (!bGreedy) {
        return aReturnNodes;
      }
    } else { // if (node.children && node.children.length) {
      // find other objects, 1. check all properties of the node if they are arrays
      for (const keysNode in oNode) {
        // true if the property is an array
        if (oNode[keysNode] instanceof Array) {
          // 2. push all array object to aInnerTree to search in those later
          for (let i = 0; i < oNode[keysNode].length; i++) {
            aInnerTree.push(oNode[keysNode][i]);
          }
        }
      }
    }
  }
  return aReturnNodes; // someone was greedy
}

export function getWeekName(weekDates) {
  if (!weekDates || !Array.isArray(weekDates) || !weekDates.length) {
    return '';
  }
  const l = weekDates.length - 1;
  const startYear = weekDates[0].year;
  const endYear = weekDates[l].year;

  const startMonth = weekDates[0].shortMonth;
  const endMonth = weekDates[l].shortMonth;

  let str = startYear !== endYear ? startYear + ' ' : '';
  str += `${startMonth} ${weekDates[0].day} - ${weekDates[l].day}`;
  str += startMonth !== endMonth ? ' ' + endMonth : '';
  str += `, ${endYear}`;
  // `${startYear !== endYear ? startYear + ' ': ''}${weekDates[0].shortMonth} ${weekDates[0].day} - ${weekDates[l].day} ${weekDates[l].shortMonth} ${endYear}`
  return str;
}

export function getWeekDates(weekDates) {
  if (!weekDates || !Array.isArray(weekDates) || !weekDates.length) {
    return [];
  }
  return weekDates.map(d => d.day);
}

export function prepareWeekData(weekData) {
  const weekDates = [];
  // console.dir(weekData);

  const emptyItem = {
    date: (new Date()).toISOString().slice(0, 10),
    items: []
  };
  const emptyRow = _.fill(new Array(7), emptyItem);
  const allTimes = [
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
  ];

  const totalTimes = weekData.length;
  let t = 0;

  // Iterating over times = Rows in Week
  while (t < totalTimes) {
    const time = weekData[t];
    // console.log(t, time.startTime);

    const timeData = {
      allDay: time.allDay,
      startTime: time.startTime,
      data: []
    };
    if (!time.allDay) {
      let thisHour = allTimes.shift();
      while (thisHour < time.startTime) {
        const emptyTime = {
          allDay: false,
          startTime: thisHour,
          data: [...emptyRow]
        };
        weekDates.push(emptyTime);
        thisHour = allTimes.shift()
      }
      if (thisHour > time.startTime) {
        allTimes.unshift(thisHour);
      }
    }

    const totalDates = time.data.length;
    let d = 0;
    const dateData = [];

    // Iterating over dates in each time = Columns in Each row of the week
    let count = 0;
    while (d < totalDates) {
      let thisDate = time.data[d];

      const date = thisDate.date;
      let dow = (new Date(date)).getUTCDay();
      // console.log(d, thisDate.date, count, dow);

      let dataItem = {
        date,
        items: []
      };

      if (count < dow) {
        while (count < dow) {
          dataItem.items = [];
          dateData.push(dataItem);
          count += 1;
        }
        dataItem = {
          date,
          items: []
        };
      }
      // if dates are same group the items for that date
      while (d < totalDates && date === thisDate.date) {
        dataItem.items.push({date, ...thisDate.CalendarItem, students: thisDate.Students});
        thisDate = time.data[++d];
      }
      count++;
      dateData.push(dataItem);
    } // while (d < totalDates)
    // console.log(d, count);
    while (count < 7) {
      dateData.push(emptyItem);
      count += 1;
    }


    timeData.data = [...dateData];
    weekDates.push(timeData);
    t++;
  } // while (t < totalTimes)


  for (const thisHour of allTimes) {
    const emptyTime = {
      allDay: false,
      startTime: thisHour,
      data: [...emptyRow]
    };
    weekDates.push(emptyTime);
  }

  // console.dir(weekDates);
  return weekDates;
}

export function groupVisibilityFilters(visibility) {
  const filters = {campuses: [], levels: [], grades: [], groups: [], afterSchoolGroups: []};
  for (const item of visibility) {
    const {id} = item;
    if (item.depth === 0) {
      filters.campuses.push(id);
    } else if (item.depth === 1) {
      if (!('Teachers' in item)) {
        filters.levels.push(id);
        if (!filters.campuses.includes(item.campusId)) {
          filters.campuses.push(item.campusId);
        }
      } else {
        filters.afterSchoolGroups.push(id);
        if (!filters.campuses.includes(item.campusId)) {
          filters.campuses.push(item.campusId);
        }
      }
    } else if (item.depth === 2) {
      filters.grades.push(id);
      if (!filters.levels.includes(item.levelId)) {
        filters.levels.push(item.levelId);
      }
    } else if (!('depth' in item)) {
      filters.groups.push(id);
      if (!filters.grades.includes(item.gradeId)) {
        filters.grades.push(item.gradeId);
      }
    }
  }
  // console.log(filters);
  return filters;
}

export function applyAllFilters(weekData, filters, visibility) {
  let filteredData = [];
  let campuses = [], levels = [], grades = [], groups = [], afterSchoolGroups = [];
  if (visibility.length) {
    const visibilityFilters = groupVisibilityFilters(visibility);
    campuses = visibilityFilters.campuses;
    levels = visibilityFilters.levels;
    grades = visibilityFilters.grades;
    groups = visibilityFilters.groups;
    afterSchoolGroups = visibilityFilters.afterSchoolGroups;
  }
  if (filters.length || visibility.length) {
    for (const time of weekData) {
      const timeObj = {
        startTime: time.startTime,
        allDay: time.allDay,
        data: []
      };
      for (const date of time.data) {
        const dateObj = {
          date: date.date,
          items: []
        };
        for (const i of date.items) {
          // console.log(!i.visibleTo);
          if (!filters.length || !i.typeId || filters.some(f => i.typeId === f.id)) {
            if (!visibility.length || !i.visibleTo ||
              ((!campuses.length || (i.visibleTo.campuses && campuses.some(c => i.visibleTo.campuses.some(v => v === c)))) &&
                (!levels.length || (i.visibleTo.levels && levels.some(l => i.visibleTo.levels.some(v => v === l)))) &&
                (!grades.length || (i.visibleTo.grades && grades.some(g => i.visibleTo.grades.some(v => v === g)))) &&
                (!groups.length || (i.visibleTo.groups && groups.some(p => i.visibleTo.groups.some(v => v === p)))) &&
                (!afterSchoolGroups.length ||
                  (i.visibleTo.afterSchoolGroups && afterSchoolGroups.some(a => i.visibleTo.afterSchoolGroups.some(v => v === a))))
              )
            ) {
              dateObj.items.push(i);
            }
          }
        }
        timeObj.data.push(dateObj);
      }
      filteredData.push(timeObj);
    }
  }
  // else {
  //   filteredData = [...weekData];
  // }
  return filteredData;
}

export function prepareFiles(files) {
  let list = [];
  if (!files || !_.isArray(files) || !files.length) {
    return list;
  }

  list = files.map(f => ({
    name: f.substring(f.lastIndexOf('/') + 1),
    url: f
  }));

  return list;
}

export function getFilenameFromUrl(url) {
  return url.substring(url.lastIndexOf('/') + 1);
}

export function filterStudents(students, filterOutStudents) {
  if (!filterOutStudents || !_.isArray(filterOutStudents) || !filterOutStudents.length) {
    return students;
  }

  return students.filter(s => !filterOutStudents.find(i => i.id === s.id));
}

export function getVisibilityLabel(visibleTo, divisions) {
  let label = '';
  const campuses = [], levels = [], grades = [], groups = [], afterSchoolGroups = [];

   const {
    campuses: allCampuses,
    levels: allLevels,
    grades: allGrades,
    groups: allGroups,
    afterSchoolGroups: allAfterSchoolGroups
  } = divisions;

  const tree = initVisibilityFilters(visibleTo, allCampuses, allLevels, allGrades, allGroups, allAfterSchoolGroups);

  for (const c of tree) {
    if (c.isChecked) {
      campuses.push(c.name);
      continue;
    }
    if (!c.children) {
      continue;
    }

    for (const l of c.children) {
      // console.log(l);
      if (l.isChecked) {
        if (!('Teachers' in l)) {
          levels.push(l.name);
          continue;
        } else {
          afterSchoolGroups.push(l.name);
        }
      }
      if (!l.children) {
        continue;
      }

      for (const grd of l.children) {
        if (grd.isChecked) {
          grades.push(grd.name)
          continue;
        }
        if (!grd.children) {
          continue;
        }

        for (const grp of grd.children) {
          if (grp.isChecked) {
            groups.push(grp.name);
          }
        }
      }
    }
  }

  // console.log(campuses, levels, grades, groups, afterSchoolGroups);

  const labels = [].concat(campuses).concat(levels).concat(grades).concat(groups).concat(afterSchoolGroups)
  label = labels.join(', ');
  return label;
}


export function convertToTime(timeStr) {
  if (!timeStr) {
    return '';
  }
  // Check correct time format and split into components
  let time = timeStr.match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [timeStr];

  if (time.length > 1) { // If time format correct
    time = time.slice(1);  // Remove full string match value
    time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
    time[0] = +time[0] % 12 || 12; // Adjust hours
  }
  return time.join(''); // return adjusted time or original string
}

export function adjustDatesForTZ(itemToFix) {
  // console.log(itemToFix.startDate);
  const item = JSON.parse(JSON.stringify(itemToFix));

  item.startDate = getDateString(new Date(item.startDate));
  if (item.endDate) {
    item.endDate = getDateString(new Date(item.endDate));
  }

  if (item.repetitionEndsOnDate) {
    item.repetitionEndsOnDate = getDateString(new Date(item.repetitionEndsOnDate));
  }
  /*
    console.log(item.startDate, itemToFix.startDate);
    console.log(item.students);
  */
  return item;
}


export function getTreeWithBooks(tree, yearbooks) {
  const {campuses} = tree;
  let book;
  if (campuses) {
    for (const campus of campuses) {
      book = _.find(yearbooks, {campusId: campus.id, levelId: null, afterSchoolGroupId: null});
      campus.bookId = !!book ? book.id : null;
      campus.photos = !!book && !!book.photos ? [...book.photos] : [];

      if (campus.levels) {
        for (const level of campus.levels) {
          book = _.find(yearbooks, {levelId: level.id, gradeId: null});
          level.bookId = !!book ? book.id : null;
          level.photos = !!book && !!book.photos ? [...book.photos] : [];

          if (level.grades) {
            for (const grade of level.grades) {
              book = _.find(yearbooks, {gradeId: grade.id, groupId: null});
              grade.bookId = !!book ? book.id : null;
              grade.photos = !!book && !!book.photos ? [...book.photos] : [];

              if (grade.groups) {
                for (const group of grade.groups) {
                  book = _.find(yearbooks, {groupId: group.id});
                  group.bookId = !!book ? book.id : null;
                  group.photos = !!book && !!book.photos ? [...book.photos] : [];
                }
              }

            }
          }

        }
      }

      if (campus.afterSchoolGroups) {
        for (const asg of campus.afterSchoolGroups) {
          book = _.find(yearbooks, {afterSchoolGroupId: asg.id});
          asg.bookId = !!book ? book.id : null;
          asg.photos = !!book && !!book.photos ? [...book.photos] : [];
        }
      }

    }
  }
  // console.log(campuses);
  return campuses;
}

export function getChildren(book) {
  let depth, children = [];
  if (book.levels) {
    depth = 2;
    children = book.levels;
    if (book.afterSchoolGroups) {
      children = children.concat(book.afterSchoolGroups);
    }
  } else if (book.grades) {
    depth = 3;
    children = book.grades;
  } else if (book.groups) {
    depth = 4;
    children = book.groups;
  }

  return [children, depth];
}
/*

            [{
            id: Math.random() * (count + 10001),
            subject : 'empty',
          }];

  */

export const getFields = (input, field) => {
	var output = [];
	for (var i=0; i < input.length ; ++i)
			output.push(input[i][field]);
	return output;
}

export function getCurrentMonth(today, dates) {
  const month = today.substring(5, 7);
  const thisDate = dates.find(d => d.date === today);
  if (thisDate) {
    return month;
  }
  return dates[0].month;
}

export function getCurrentYear(today, dates) {
  const year = today.substring(0, 4);

  const thisDate = dates.find(d => d.date === today);
  if (thisDate) {
    return year;
  }
  return dates[0].year;
}

export function getSelectedDate(today, dates) {
  const thisDate = dates.find(d => d.date === today);
  if (thisDate) {
    return today;
  }
  return dates[0].date;
}

export function getItemDescription(text) {
  if (!text.length) {
    return text;
  }
  const words = text.split(' ');
  let string = '';
  words.forEach(w => {
    let word = ''
    if (w.substr(0, 4) === 'http') {
      // console.log(w);
      word = `<span><a href="${w}" target="_blank">${w}</a></span>${' '}`;
    } else {
      word = `<span>${w}</span>${' '}`;
    }
    string += word;
  });
  // console.log(string);
  return <p className="view-form-input" style={{maxWidth: '98%'}} dangerouslySetInnerHTML={{__html: string}}></p>
}
