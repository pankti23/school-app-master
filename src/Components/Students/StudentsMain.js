import React, { useEffect, useState, useRef } from 'react';
import { useLocation} from "react-router-dom";
import moment from "moment";

import './StudentsMain.css';
import StudentsTable from './StudentsTable';
import InviteNew from './StudentsModals/InviteNew';
import ModifyModal from './StudentsModals/ModifyModal';
import ConfirmDeleteModal from './StudentsModals/ConfirmDeleteModal';
import Button from "../UI/Button";
import AddIcon from "../../SchoolAPP Assets/plus.svg";
import DotsIcon from "../../SchoolAPP Assets/DotsHorizontal";
import useOnClickOutside from "../../CustomHooks/useOnClickOutside";
import { MdFilterList } from "react-icons/md";
import LoadingSpinner from "../UI/LoadingSpinner";

import { getStudentList, removeStudent } from "../../services/studentService";
import { setCurrentPage, getUserFromLocalStorage } from "../../services/localStorageService";
import { getDivisionsTree } from "../../services/schoolInfoService";
import { regenerateUserActivationToken, getUsersList } from '../../services/userService';
import { getLoggedInUserPermissionForRoute } from '../../services/permissionsService';

import { useDict } from "../UI/Translations"

const SelectColumnFilter = ({
  column: { filterValue, setFilter, preFilteredRows, id }
}) => {
  const options = React.useMemo(() => {
    const options = new Set();

    preFilteredRows.forEach(row => {
      if (row.values[id]) options.add(row.values[id]);
    });

    return [...options.values()];
  }, [id, preFilteredRows]);

  return (
    <div className="students-page-table-filter-wrapper">
      <MdFilterList size="1.4em" color={!filterValue ? '#373737' : '#0037F6'} />

      <select value={filterValue}
        onChange={(e) => setFilter(e.target.value || undefined)}>
        <option value="">All</option>
        {options.map((option, i) => <option key={i} value={option}>
          {option}
        </option>)}
      </select>
    </div>
  )
};

const Actions = ({ row, index, onModify, onDelete, onSendAgain }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const ref = useRef();

  const dict = useDict("/students-page")

  useOnClickOutside(ref, () => setShowDropdown(false));

  return <div className="students-page-table-actions-wrapper">
    <div className="students-page-table-actions" onClick={() => setShowDropdown(!showDropdown)}>
      {dict("students-table/row/more")}<DotsIcon height="15px" width="15px" stroke="none" fill="#000000" style={{ position: 'relative', top: 2, margin: '0 0 0 10px' }} />
    </div>

    {showDropdown && <>
      <div className="students-page-table-actions-cover" />

      <ul className="students-page-table-actions-dropdown" ref={ref}>
        <li onClick={() => onModify([row])}>{dict("students-table/row/button/modify")}</li>
        {(row.Parents && row.Parents.length > 0) && <li onClick={() => onSendAgain(row)}>{dict("students-table/row/button/resend")}</li>}
        <li onClick={() => onDelete([row])}>{dict("students-table/row/button/delete")}</li>
      </ul>
    </>}
  </div>;
};

const StudentsMain = () => {
  let location = useLocation();
  let { pathname } = location;

  const currentLoggedUser = getUserFromLocalStorage();

  const [showInviteNewModal, setShowInviteNewModal] = useState(false);
  const [showModifyModal, setShowModifyModal] = useState(false);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [showRoleAssignedAlert, setShowRoleAssignedAlert] = useState(false);

  const [loading, setLoading] = useState(false);

  const [studentsList, setStudentsList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [modifyStudentsList, setModifyStudentsList] = useState([]);
  const [deleteStudentsList, setDeleteStudentsList] = useState([]);
  const [divisionsTree, setDivisionsTree] = useState({});
  const [userPermissions, setUserPermissions] = useState([]);

  const [successResend, setSuccessResend] = useState(false);
  const [message, setResendMessage] = useState("");

  const [unAuthorizedAlert, setUnAuthorized] = useState(false);

  const dict = useDict("/students-page");

  const fetchData = async () => {
    setLoading(true);

    const responseStudentList = await getStudentList();
    const responseUserList = await getUsersList();
    const responseDivisionsTree = await getDivisionsTree();
    const responseUserPermissions = await getLoggedInUserPermissionForRoute('students');

    setStudentsList(responseStudentList);
    setUsersList(responseUserList);
    setDivisionsTree(responseDivisionsTree);
    setUserPermissions(responseUserPermissions);
    setLoading(false)
  };

  useEffect(() => {
    setCurrentPage('/students-page');

    fetchData();
  }, []);

  const refRoleAlert = useRef();
  useOnClickOutside(refRoleAlert, () => setShowRoleAssignedAlert(false));

  const refPermissionAlert = useRef();
  useOnClickOutside(refPermissionAlert, () => setUnAuthorized(false));

  const refSuccessResend = useRef();
  useOnClickOutside(refSuccessResend, () => setSuccessResend(false));

  const checkIfAutorized = (filters) => userPermissions.filter(function(item) {
    for (var key in filters) {
      if((Array.isArray(filters[key]) && !filters[key].includes(item[key])) && item[key] !== filters[key]){
        return false;
      }
    }
    return true;
  }).map((p) => p.isAuthorized);

  const handleModify = (students) => {
    const query = {
      action: ["put", "post"]
    }

    var result = checkIfAutorized(query);
    let checker = result => result.every(v => v === true);

    if(checker(result)){
      if (students.length === 0) return;

      setModifyStudentsList(students);
      setShowModifyModal(true);
    } else {
      setUnAuthorized(true);
    }
  };

  const handleDelete = (students) => {
    const query = {
      action: ["delete"]
    }

    var result = checkIfAutorized(query);
    let checker = result => result.every(v => v === true);

    if(checker(result)){
      if (students.length === 0) return;

      setDeleteStudentsList(students);
      setShowConfirmDeleteModal(true);
    } else {
      setUnAuthorized(true);
    }
  };

  const handleSendAgain = (student) => {
    const promises = [];

    if (!student.Parents || student.Parents.length === 0) return;

    setLoading(true);

    for (let parent of student.Parents) {
      if (!parent.id) continue;

      promises.push(regenerateUserActivationToken(parent.id));
    }

    Promise.all(promises).then((res) => {
      if(res && res.length > 0){
        if(res[0].message === "A new activation token was generated and an email sent to the user."){
          setResendMessage(dict("students-table/row/resend/message/success/sent"));
        }
      }
      setLoading(false);
      setSuccessResend(true);
    }).catch((e) => {
      setLoading(false)
      if(e && e.message && e.message === 'User Not Found!'){
        setResendMessage(dict("students-table/row/resend/message/error/activated"));  
      } else {
        setResendMessage(e.message);
      }
      setSuccessResend(true);
    });
  };

  const handleConfirmDelete = () => {
    const query = {
      action: ["delete"]
    }

    var result = checkIfAutorized(query);
    let checker = result => result.every(v => v === true);

    if(checker(result)){
      const promises = [];

      setShowConfirmDeleteModal(false);

      deleteStudentsList.map((student) => {
        promises.push(removeStudent(student.id));
      });

      Promise.all(promises).then(fetchData).catch(() => { });
    } else {
      setUnAuthorized(true);
    }
  };

  const handleRefresh = () => fetchData();

  const columns = React.useMemo(() => [{
    Header: dict("students-table/head/student-name"),
    accessor: 'name'
  }, {
    id: 'campus',
    Header: dict("students-table/head/campus"),
    accessor: 'Campus.name',
    Filter: SelectColumnFilter
  }, {
    id: 'level',
    Header: dict("students-table/head/level"),
    accessor: 'Level.name',
    Filter: SelectColumnFilter
  }, {
    id: 'grade',
    Header: dict("students-table/head/grade"),
    accessor: 'Grade.name',
    Filter: SelectColumnFilter
  }, {
    id: 'group',
    Header: dict("students-table/head/group"),
    accessor: 'Group.name',
    Filter: SelectColumnFilter
  }, {
    id: 'asg',
    Header: dict("students-table/head/asg"),
    accessor: (d) => d.AfterSchoolGroups ? d.AfterSchoolGroups.filter((asg) => asg.id !== null).map((asg) => asg.name).join(', ') : '',
    Filter: SelectColumnFilter
  }, {
    id: 'parent1',
    Header: dict("students-table/head/parent1"),
    accessor: (d) => d.Parents && d.Parents[0] ? d.Parents[0].email : ''
  }, {
    id: 'parent2',
    Header: dict("students-table/head/parent2"),
    accessor: (d) => d.Parents && d.Parents[1] ? d.Parents[1].email : ''
  }, 
  {
    id: 'lastLogin',
    Header: dict("students-table/head/last-active"),
    accessor: (d) => {
      return d.Parents && d.Parents.length > 0 ? Math.max.apply(null, d.Parents.map(function(e) {
        if(e.lastLogin !== null || e.lastLogin !== ''){
          return new Date(e.lastLogin);
        } else {
          return null;
        }
      })) !== 0 ? moment(Math.max.apply(null, d.Parents.map(function(e) {
        return new Date(e.lastLogin);
      }))).fromNow() : '' : ''
      // return d.Parents && d.Parents[0] && d.Parents[0].lastLogin ? moment(d.Parents[0].lastLogin).fromNow() : '' || d.Parents && d.Parents[1] && d.Parents[1].lastLogin ? moment(d.Parents[1].lastLogin).fromNow() : ''
    }
  },
  {
    id: 'actions',
    Header: dict("students-table/head/actions"),
    accessor: (d, index) => <Actions row={d} index={index} onModify={handleModify} onDelete={handleDelete} onSendAgain={handleSendAgain} />,
  }], [dict]);

  return (
    <>
      {showConfirmDeleteModal && <ConfirmDeleteModal students={deleteStudentsList}
        onConfirmDelete={handleConfirmDelete}
        closeModal={() => setShowConfirmDeleteModal(false)} />}
      {showInviteNewModal && <InviteNew divisions={divisionsTree}
        closeModal={() => setShowInviteNewModal(false)}
        onRefresh={handleRefresh} />}
      {showModifyModal && <ModifyModal closeModal={() => {
        setShowModifyModal(false);
        setModifyStudentsList([]);
      }} rows={modifyStudentsList} setShowRoleAssignedAlert={setShowRoleAssignedAlert} usersList={usersList} divisions={divisionsTree} onRefresh={handleRefresh} />}
      {showRoleAssignedAlert && (
        <div className="student-page-alert-modal-wrapper">
          <div className="student-page-alert-content">
            <div ref={refRoleAlert} className="student-page-alert-content-center">
              {dict("errors/role-already-assigned")}
            </div>
          </div>
        </div>
      )}

      {unAuthorizedAlert && (
        <div className="student-page-alert-modal-wrapper">
          <div className="student-page-alert-content">
            <div ref={refPermissionAlert} className="student-page-alert-content-center">
              {dict("errors/unauthorized-access")}
            </div>
          </div>
        </div>
      )}

      {successResend && (
        <div className="student-page-alert-modal-wrapper">
          <div className="student-page-alert-content">
            <div ref={refSuccessResend} className="student-page-alert-content-center">
              {message}
            </div>
          </div>
        </div>
      )}
      <div className="students-page-main">
        <div className="students-page-main-header">
          <div>
            <h1>{dict("main/header/title")}</h1>
            <Button size="default"
              color="grey"
              margin="0 0 0 20px"
              image={AddIcon}
              onClick={() => {
                const query = {
                  action: ["put", "post"]
                }
            
                var result = checkIfAutorized(query);
                let checker = result => result.every(v => v === true);
            
                if(checker(result)){
                  setShowInviteNewModal(true)
                } else {
                  setUnAuthorized(true);
                }
              }}>{dict("main/header/add-button")}</Button>
          </div>
          <h2>{dict("main/header/paragraph")}</h2>
        </div>
        <div className="students-page-main-content">
          {loading && <LoadingSpinner />}
          {!loading && <StudentsTable columns={columns} data={studentsList} onModify={handleModify} onDelete={handleDelete} />}
        </div>
      </div>
    </>
  );
};

export default StudentsMain;
