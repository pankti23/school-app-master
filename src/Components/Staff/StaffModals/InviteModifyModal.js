import React, { useEffect, useState } from 'react';
import axios from "axios"
import { getTokenFromLocalStorage } from "../../../services/localStorageService";

import { useDict } from "../../UI/Translations"

import "./InviteModifyModal.css"

const baseUrl = process.env.REACT_APP_BASE_URL;

function getRoleBaseAccess(roleId){
    switch (roleId) {
        case 4:
            return {
                'role': true,
                'campus': true,
                'level': false,
                'grades': false,
                'groups': false,
                'afterSchoolGroups': false 
            };
        case 5:
            return {
                'role': true,
                'campus': true,
                'level': true,
                'grades': false,
                'groups': false,
                'afterSchoolGroups': false 
            };
        case 6:
            return {
                'role': true,
                'campus': true,
                'level': true,
                'grades': true,
                'groups': true,
                'afterSchoolGroups': true 
            };
        case 7:
            return {
                'role': true,
                'campus': true,
                'level': false,
                'grades': false,
                'groups': false,
                'afterSchoolGroups': true 
            };
        default:
            return {
                'role': true,
                'campus': false,
                'level': false,
                'grades': false,
                'groups': false,
                'afterSchoolGroups': false 
            };
    }
}

const InviteModifyModal = props => {

    const { setUpdated, setListOfCheckedBoxes } = props;

    const [mainDivisionsList, setMainDivisionsList] = useState([]);
    const [mainRolesList, setMainRolesList] = useState([]);
    const [mainUserList, setMainUserList] = useState([]);
    const [mainLevelsList, setMainLevelsList] = useState([]);
    const [mainGradesList, setMainGradesList] = useState([]);
    const [mainGroupsList, setMainGroupsList] = useState([]);
    const [mainASGroupsList, setMainASGroupsList] = useState([]);

    const [role_access, setRoleAccess] = useState(false);
    const [campus_access, setCampusAccess] = useState(false);
    const [level_access, setLevelAccess] = useState(false);
    const [grade_access, setGradeAccess] = useState(false);
    const [group_access, setGroupAccess] = useState(false);
    const [after_school_group_access, setAfterSchoolGroupAccess] = useState(false);

    const [role, setRole] = useState("");
    const [campus, setCampus] = useState("");
    const [level, setLevel] = useState("");
    const [grade, setGrade] = useState("");
    const [group, setGroup] = useState("");
    const [afterSchoolGroup, setAfterSchoolGroup] = useState("");

    const dict = useDict("/staff-members-page")

    const getUsersById = async () => {
        const list = []
        await props.modifyList.forEach(async (id) => {
            const token = getTokenFromLocalStorage();
            const config = {
                method: 'GET',
                url: `${baseUrl}/users/${id}`,
                headers: {
                    Authorization: token,
                },
            };
            try {
                const { data } = await axios(config);
                list.push(data)
            } catch (err) {
                console.error(err.toString());
            }
        })
        setMainUserList(list);
    }

    const getDivisions = async () => {
        if(props.staffList && props.staffList.length > 0){
            const temp_campus = props.staffList.filter((staff)=> props.modifyList.includes(staff.id)).map((opt) => opt.Campus);
            if(temp_campus && temp_campus.length > 0){
                setCampus(temp_campus);
            }
        }
        const token = getTokenFromLocalStorage();
        const config = {
            method: "get",
            url: `${baseUrl}/schoolInfo/divisions/all`,
            headers: {
                Authorization: token,
            },
        };
        try {
            const { data } = await axios(config);
            console.log(data)
            setMainDivisionsList(data);
        } catch (err) {
            console.error(err.toString());
        }
    };

    const getRoles = async () => {
        if(props.staffList && props.staffList.length > 0){
            const temp_role = props.staffList.filter((staff)=> props.modifyList.includes(staff.id)).map((opt) => opt.Role);
            if(temp_role && temp_role.length > 0){
                setRole(temp_role);
                const { role, campus, level, grades, groups, afterSchoolGroups } = getRoleBaseAccess(temp_role[0].id);
                setRoleAccess(role);
                setCampusAccess(campus);
                setLevelAccess(level);
                setGradeAccess(grades);
                setGroupAccess(groups);
                setAfterSchoolGroupAccess(afterSchoolGroups);
            }
        }
        const token = getTokenFromLocalStorage();
        const config = {
            method: "get",
            url: `${baseUrl}/roles`,
            headers: {
                Authorization: token,
            },
        };
        try {
            const { data } = await axios(config);
            setMainRolesList(data);
        } catch (err) {
            console.error(err.toString());
        }
    };

    const getLevels = async () => {
        const token = getTokenFromLocalStorage();
        const config = {
            method: "get",
            url: `${baseUrl}/levels`,
            headers: {
                Authorization: token,
            },
        };
        try {
            const { data } = await axios(config);
            setMainLevelsList(data);
        } catch (err) {
            console.error(err.toString());
        }
    }

    useEffect(() => {
        if(props.staffList && props.staffList.length > 0){
            const temp_level = props.staffList.filter((staff)=> props.modifyList.includes(staff.id)).map((opt) => opt.Levels)[0];
            if(temp_level && temp_level.length > 0){
                const temp = mainLevelsList.filter((opt) => temp_level.some((x) => (opt.id === x.id))).map((v) => {
                    return {
                        ...v,
                        checked: true
                    }
                });
                setLevel(temp);
            }
        }
    }, [mainLevelsList]);

    const getGrades = async () => {
        const token = getTokenFromLocalStorage();
        const config = {
            method: "get",
            url: `${baseUrl}/grades`,
            headers: {
                Authorization: token,
            },
        };
        try {
            const { data } = await axios(config);
            setMainGradesList(data);
        } catch (err) {
            console.error(err.toString());
        }
    }

    useEffect(() => {
        if(props.staffList && props.staffList.length > 0){
            const temp_grades = props.staffList.filter((staff)=> props.modifyList.includes(staff.id)).map((opt) => opt.Grades)[0];
            if(temp_grades && temp_grades.length > 0){
                const temp = mainGradesList.filter((opt) => temp_grades.some((x) => (opt.id === x.id))).map((v) => {
                    return {
                        ...v,
                        checked: true
                    }
                });
                setGrade(temp);
            }
        }
    }, [mainGradesList]);

    const getGroups = async () => {
        const token = getTokenFromLocalStorage();
        const config = {
            method: "get",
            url: `${baseUrl}/groups`,
            headers: {
                Authorization: token,
            },
        };
        try {
            const { data } = await axios(config);
            setMainGroupsList(data);
        } catch (err) {
            console.error(err.toString());
        }
    }

    useEffect(() => {
        if(props.staffList && props.staffList.length > 0){
            const temp_groups = props.staffList.filter((staff)=> props.modifyList.includes(staff.id)).map((opt) => opt.Groups)[0];
            if(temp_groups && temp_groups.length > 0){
                const temp = mainGroupsList.filter((opt) => temp_groups.some((g) => g.id === opt.id && g.name === opt.name)).map((v) => {
                    return {
                        ...v,
                        checked: true
                    }
                });
                setGroup(temp);
            }
        }
    }, [mainGroupsList]);

    const getASGroups = async () => {
        const token = getTokenFromLocalStorage();
        const config = {
            method: "get",
            url: `${baseUrl}/afterSchoolGroups`,
            headers: {
                Authorization: token,
            },
        };
        try {
            const { data } = await axios(config);
            setMainASGroupsList(data);
        } catch (err) {
            console.error(err.toString());
        }
    }

    useEffect(() => {
        if(props.staffList && props.staffList.length > 0){
            const temp_after_school_groups = props.staffList.filter((staff)=> props.modifyList.includes(staff.id)).map((opt) => opt.AfterSchoolGroups)[0];
            if(temp_after_school_groups && temp_after_school_groups.length > 0){
                const temp = mainASGroupsList.filter((opt) => temp_after_school_groups.some((g) => g.id === opt.id)).map((v) => {
                    return {
                        ...v,
                        checked: true
                    }
                });
                setAfterSchoolGroup(temp);
            }
        }
    }, [mainASGroupsList]);


    const updateUser = async (id) => {
        const token = getTokenFromLocalStorage();

        // if User is campus principal 
        if(role && role[0] && role[0].id === 4){
            let config;
            if(campus && campus[0]){
                config = {
                    method: 'PUT',
                    url: `${baseUrl}/campuses/${campus[0].id}`,
                    data: {
                      "principalId": parseInt(id)
                    },
                    headers: {
                      'Authorization': token,
                      'Content-Type': 'application/json'
                    }
                }
            } else {
                return;
            }

            try {
                config && await axios(config);
                setUpdated(true);
                props.closeModal();
            } catch (err) {
                console.error(err)
            }
        }

        // if User is Level principal 
        if(role && role[0] && role[0].id === 5){
            if(((campus && campus[0]) && (level && level.length > 0))){

                const addRemoveSelectedLevelPrincipal = async () => {
                    level.forEach(async levelId => {
                        if(campus[0].id === levelId.campusId && levelId.checked === true){
                            const config_level = {
                                method: 'PUT',
                                url: `${baseUrl}/levels/${levelId.id}`,
                                data: {
                                  "principalId": parseInt(id),
                                  "campusId": parseInt(campus[0].id),
                                },
                                headers: {
                                  'Authorization': token,
                                  'Content-Type': 'application/json'
                                }
                            }
                            await axios(config_level);
                        } else if(campus[0].id === levelId.campusId && levelId.checked === false) {
                            const config_level = {
                                method: 'PUT',
                                url: `${baseUrl}/levels/${levelId.id}`,
                                data: {
                                  "principalId": null,
                                  "campusId": parseInt(campus[0].id),
                                },
                                headers: {
                                  'Authorization': token,
                                  'Content-Type': 'application/json'
                                }
                            }
                            await axios(config_level);
                        }
                    });
                }

                try {
                    await Promise.all([addRemoveSelectedLevelPrincipal()])
                    setUpdated(true);
                    props.closeModal();
                } catch (err) {
                    console.error(err)
                }
            } else {
                return;
            }
        }

        // if User is Main Teacher 
        if(role && role[0] && role[0].id === 6){
            if((grade && grade.length > 0) && (group && group.length > 0) || (afterSchoolGroup && afterSchoolGroup.length > 0)){
                const addRemoveSelectedMainGroupTeachers = async () => {
                    if((grade && grade.length > 0) && (group && group.length > 0)){
                        grade.forEach(async gradeId => {
                            group.forEach(async groupId => {
                                if(gradeId.id === groupId.gradeId && groupId.checked === true){
                                    const config = {
                                        method: 'PUT',
                                        url: `${baseUrl}/groups/${groupId.id}`,
                                        data: {
                                            "name": groupId.name,
                                            "gradeId": gradeId.id,
                                            "mainTeacherId": parseInt(id)
                                        },
                                        headers: {
                                            'Authorization': token,
                                            'Content-Type': 'application/json'
                                        }
                                    }                                
                                    await axios(config);
                                } else if(gradeId.id === groupId.gradeId && groupId.checked === false) {
                                    const config = {
                                        method: 'PUT',
                                        url: `${baseUrl}/groups/${groupId.id}`,
                                        data: {
                                            "name": groupId.name,
                                            "gradeId": parseInt(gradeId.id),
                                            "mainTeacherId": null
                                        },
                                        headers: {
                                            'Authorization': token,
                                            'Content-Type': 'application/json'
                                        }
                                    }                                
                                    await axios(config);
                                }
                            });
                        })
                    }
                    return;
                };

                const addOrRemoveSelectedMainTeacherToOrFromASGroups = async () => { 
                    if(afterSchoolGroup && afterSchoolGroup.length > 0) {
                        afterSchoolGroup.forEach(async aSGroup => {
                            if(aSGroup && aSGroup.id && aSGroup.checked === true) {
                                const config = {
                                    method: 'POST',
                                    url: `${baseUrl}/afterSchoolGroupTeachers`,
                                    data: {
                                        "groupId": parseInt(aSGroup.id),
                                        "userId": parseInt(id)
                                    },
                                    headers: {
                                        'Authorization': token,
                                        'Content-Type': 'application/json'
                                    }
                                }
        
                                await axios(config);
                            } else if(aSGroup && aSGroup.id && aSGroup.checked === false){
                                const config = {
                                    method: 'DELETE',
                                    url: `${baseUrl}/afterSchoolGroupTeachers/group/${parseInt(aSGroup.id)}/user/${parseInt(id)}`,
                                    headers: {
                                        'Authorization': token,
                                        'Content-Type': 'application/json'
                                    }
                                }
        
                                await axios(config);
                            }
                        });
                    }
                };
        
                try {
                    await Promise.all([
                        addRemoveSelectedMainGroupTeachers(),
                        addOrRemoveSelectedMainTeacherToOrFromASGroups()
                    ]);
                    setUpdated(true);
                    setListOfCheckedBoxes([]);
                    props.closeModal();
                } catch (e) {
                    console.log(e);
                }
            } else {
                return;
            }
        }

        // if User is Subject Teacher 
        if(role && role[0] && role[0].id === 7){
            if((campus && campus[0]) || (afterSchoolGroup && afterSchoolGroup.length > 0)){

                const addSubjectTeacherToCampus = async () => {
                    if(campus && campus[0]){
                        const config = {
                            method: 'PUT',
                            url: `${baseUrl}/users/${parseInt(id)}`,
                            data: {
                              "campusId": parseInt(campus[0].id)
                            },
                            headers: {
                              'Authorization': token,
                              'Content-Type': 'application/json'
                            }
                        }
    
                        config && await axios(config);
                    }
                };

                const addSubjectTeacherToAfterSchoolGroups = async () => {
                    if(afterSchoolGroup && afterSchoolGroup.length > 0) {
                        afterSchoolGroup.forEach(async aSGroup => {
                            if(aSGroup && aSGroup.id && aSGroup.checked === true) {
                                const config = {
                                    method: 'POST',
                                    url: `${baseUrl}/afterSchoolGroupTeachers`,
                                    data: {
                                        "groupId": parseInt(aSGroup.id),
                                        "userId": parseInt(id)
                                    },
                                    headers: {
                                        'Authorization': token,
                                        'Content-Type': 'application/json'
                                    }
                                }
        
                                await axios(config);
                            } else if(aSGroup && aSGroup.id && aSGroup.checked === false){
                                const config = {
                                    method: 'DELETE',
                                    url: `${baseUrl}/afterSchoolGroupTeachers/group/${parseInt(aSGroup.id)}/user/${parseInt(id)}`,
                                    headers: {
                                        'Authorization': token,
                                        'Content-Type': 'application/json'
                                    }
                                }
        
                                await axios(config);
                            }
                        });
                    }
                }

                try {
                    await Promise.all([
                        addSubjectTeacherToCampus(),
                        addSubjectTeacherToAfterSchoolGroups()
                    ]);
                    setUpdated(true);
                    props.closeModal();
                    setListOfCheckedBoxes([]);
                } catch (err) {
                    console.error(err)
                }
            } else {
                return;
            }
        }
		}
		
		const onChangeDropDownValuesForRoleCampus = async (isFromRole = false) => {
			const id = props.modifyList.join();
			const token = getTokenFromLocalStorage();
			// if User is Level principal 
			if(role && role[0] && role[0].id === 5){						
				if(level && level.length > 0){
					const removePrincipalFromLevels = async () => {
						level.forEach(async levelId => {
							if(campus[0].id === levelId.campusId) {
								const config_level = {
									method: 'PUT',
									url: `${baseUrl}/levels/${levelId.id}`,
									data: {
										"principalId": null,
										"campusId": parseInt(campus[0].id),
									},
									headers: {
										'Authorization': token,
										'Content-Type': 'application/json'
									}
								}
								await axios(config_level);
							}
						});
					}

					try {
						await Promise.all([removePrincipalFromLevels()])
					} catch (err) {
						console.error(err)
					}
				}
			}
			// if User is Main Teacher 
			if(role && role[0] && role[0].id === 6){
				if((grade && grade.length > 0) && (group && group.length > 0) || (afterSchoolGroup && afterSchoolGroup.length > 0)){
					const removeSelectedMainGroupTeachers = async () => {
						if((grade && grade.length > 0) && (group && group.length > 0)){
								grade.forEach(async gradeId => {
										group.forEach(async groupId => {
												if(gradeId.id === groupId.gradeId) {
													const config = {
															method: 'PUT',
															url: `${baseUrl}/groups/${groupId.id}`,
															data: {
																	"name": groupId.name,
																	"gradeId": parseInt(gradeId.id),
																	"mainTeacherId": null
															},
															headers: {
																	'Authorization': token,
																	'Content-Type': 'application/json'
															}
													}                                
													await axios(config);
												}
										});
								})
						}
						return;
					};

					const removeSelectedMainTeacherToOrFromASGroups = async () => { 
						if(afterSchoolGroup && afterSchoolGroup.length > 0) {
								afterSchoolGroup.forEach(async aSGroup => {
										if(aSGroup && aSGroup.id){
											const config = {
													method: 'DELETE',
													url: `${baseUrl}/afterSchoolGroupTeachers/group/${parseInt(aSGroup.id)}/user/${parseInt(id)}`,
													headers: {
															'Authorization': token,
															'Content-Type': 'application/json'
													}
											}
											await axios(config);
										}
								});
						}
						return;
					};

					try {
						await Promise.all([
							removeSelectedMainGroupTeachers(),
							removeSelectedMainTeacherToOrFromASGroups()
						]);
					} catch (e) {
						console.log(e);
					}
				}
			}
			// if User is Subject Teacher 
			if(role && role[0] && role[0].id === 7){
				if((grade && grade.length > 0) && (group && group.length > 0) || (afterSchoolGroup && afterSchoolGroup.length > 0)){
					let subjectTeacherExistInSubjects = [];
					if(mainUserList && mainUserList.length > 0){
						mainUserList.map((user) => {
							if(user.Subjects && user.Subjects.length > 0){
								subjectTeacherExistInSubjects.push(...user.Subjects)
							}
						});
					}

					const removeSubjectTeacherFromCampus = async () => {
						if(campus && campus[0]){
							const config = {
								method: 'PUT',
								url: `${baseUrl}/users/${parseInt(id)}`,
								data: {
									"campusId": null
								},
								headers: {
									'Authorization': token,
									'Content-Type': 'application/json'
								}
							}
							config && await axios(config);
						}
						return;
					};

					const removeSubjectTeacherFromGroups = async () => {
						if((subjectTeacherExistInSubjects && subjectTeacherExistInSubjects.length > 0) && (grade && grade.length > 0) && (group && group.length > 0)){
							subjectTeacherExistInSubjects.forEach(async subjectId => {
								group.forEach(async groupId => {
									const config = {
										method: 'DELETE',
										url: `${baseUrl}/groupSubjectTeachers/group/${parseInt(groupId.id)}/subject/${parseInt(subjectId.id)}/teacher/${parseInt(id)}`,
										data: {
											"groupId": parseInt(groupId.id),
											"subjectId": parseInt(subjectId.id),
											"userId": parseInt(id)
										},
										headers: {
												'Authorization': token,
												'Content-Type': 'application/json'
										}
									}                                
									await axios(config);
								});
							});
						}
						return;
					};

					const removeSubjectTeacherFromSubjects = async () => {
						if(subjectTeacherExistInSubjects && subjectTeacherExistInSubjects.length > 0){
							subjectTeacherExistInSubjects.forEach(async subjectId => {
								const config = {
										method: 'DELETE',
										url: `${baseUrl}/subjectTeachers/subject/${parseInt(subjectId.id)}/teacher/${parseInt(id)}`,
										headers: {
												'Authorization': token,
												'Content-Type': 'application/json'
										}
								}                                
								await axios(config);	
							});
						}
						return;
					};
	
					const removeSubjectTeacherFromAfterSchoolGroups = async () => {
						if(afterSchoolGroup && afterSchoolGroup.length > 0) {
								afterSchoolGroup.forEach(async aSGroup => {
									if(aSGroup && aSGroup.id){
										const config = {
												method: 'DELETE',
												url: `${baseUrl}/afterSchoolGroupTeachers/group/${parseInt(aSGroup.id)}/user/${parseInt(id)}`,
												headers: {
													'Authorization': token,
													'Content-Type': 'application/json'
												}
										}
										await axios(config);
									}
								});
						}
						return;
					}
	
					try {
						await Promise.all([
							removeSubjectTeacherFromCampus(),
							removeSubjectTeacherFromGroups(),
							removeSubjectTeacherFromAfterSchoolGroups(),
							removeSubjectTeacherFromSubjects(),
						]);
					} catch (err) {
						console.error(err)
					}
				}
			}
		}

    const handleRoleChange = async (roleId) => {
        const token = getTokenFromLocalStorage();
        if (roleId) {
            const filtering = mainRolesList.filter(item => {
                return item.id == roleId
            });
            setRole(filtering);
            const idsArray = props.modifyList;
            const assignRoleToUsers = async () => { 
                if(idsArray){
									idsArray.forEach(async id => {
										const config = {
												method: 'PUT',
												url: `${baseUrl}/users/${id}`,
												data: { roleId },
												headers: {
													Authorization: token,
													"Content-Type": "application/json",
												},
										};

										await axios(config);
									});
							}
            }

            try {
                await Promise.all([
									assignRoleToUsers(),
									onChangeDropDownValuesForRoleCampus(true)
                ]);
                setUpdated(true);
            } catch (e) {
                console.log(e);
						}
						setCampus("")
            setLevel("");
						setGrade("");
						setGroup("");
            setAfterSchoolGroup("");
        } else {
            setRole("")
        }
    }

    const handleCampusChange = async (campusId) => {
				if (campusId) {
					if(campus && campus[0] && campus[0].id !== campusId){
						await Promise.all([onChangeDropDownValuesForRoleCampus()]);
					}
					(async () => {
						const filtering = mainDivisionsList.campuses.filter(item => {
							return item.id == campusId
						});
						setCampus(filtering);
						setLevel("");
						setGrade("");
						setGroup("");
						setAfterSchoolGroup("");
					})();
				} else {
          setCampus("")
        }
    }

    const handleLevelChange = (levelId, event) => {
        let isChecked = event.target.checked;
        if (levelId) {
            const newList = level && level.length ? [...level] : []
            if (newList && newList.length > 0 && newList.some(level => level.id == levelId)) {
                const filtering = newList.map(item => {
                    if(item.id === levelId) {
                        return {
                            ...item,
                            checked: isChecked
                        }
                    }
                    return item;
                });
                return setLevel(filtering)
            }
            const filtering = mainDivisionsList.levels.filter(item => {
                return item.id == levelId
            }).map((t) => { return {...t, checked: true }});
            newList.push(filtering[0])
						setLevel(newList);
						// setGrade("");
						// setGroup("");
        } else {
            setLevel("")
        }
    }
    

    const handleGradeChange = (gradeId, event) => {
        let isChecked = event.target.checked;
        if (gradeId) {
            const newList = grade && grade.length ? [...grade] : []
            if (newList && newList.length > 0 && newList.some(grade => grade.id == gradeId)) {
                const filtering = newList.map(item => {
                    if(item.id === gradeId) {
                        return {
                            ...item,
                            checked: isChecked
                        }
                    }
                    return item;
                });
                return setGrade(filtering)
            }
            const filtering = mainDivisionsList.grades.filter(item => {
                return item.id == gradeId
            }).map((t) => { return {...t, checked: true }});
            newList.push(filtering[0])
						setGrade(newList);
						// setGroup("");
        } else {
            setGrade("")
        }
    }

    const handleGroupChange = (groupId, event) => {
        let isChecked = event.target.checked;
        if (groupId) {
            const newList = group && group.length ? [...group] : []
            if (newList && newList.length > 0 && newList.some(group => group.id == groupId)) {
                const filtering = newList.map(item => {
                    if(item.id === groupId){
                        return {
                            ...item,
                            checked: isChecked
                        }
                    }
                    return item;
                })
                return setGroup(filtering)
            } else {
                const filtering = mainGroupsList.filter(item => {
                    return item.id == groupId
                }).map((t) => { return {...t, checked: true }});
                newList.push(filtering[0])
                setGroup(newList)
            }
        } else {
            setGroup("")
        }
    }

    const handleASGroupChange = (aSGroupId, event) => {
        let isChecked = event.target.checked;
        if (aSGroupId) {
            const newList = afterSchoolGroup && afterSchoolGroup.length ? [...afterSchoolGroup] : []
            if (newList && newList.length > 0 && newList.some(aSGroup => aSGroup.id == aSGroupId)) {
                const filtering = newList.map(item => {
                    if(item.id === aSGroupId){
                        return {
                            ...item,
                            checked: isChecked
                        }
                    }
                    return item;
                })
                return setAfterSchoolGroup(filtering)
            } else {
                const filtering = mainASGroupsList.filter(item => {
                    return item.id == aSGroupId
                }).map((t) => { return {...t, checked: true }});
                newList.push(filtering[0])
                console.log('newList', newList);
                setAfterSchoolGroup(newList)
            }
        } else {
            setAfterSchoolGroup("")
        }
    }

    useEffect(() => {
        getDivisions();
        getRoles();
        getUsersById();
        getLevels();
        getGrades();
        getGroups();
        getASGroups();
    }, [props.staffList]);

    useEffect(() => {
        console.log(role, campus, level, grade, group, afterSchoolGroup);
    }, [role, campus, level, grade, group, afterSchoolGroup])

    return (
        <div className="filter-model-open">
            <div className="delete-confirmation-modal-container" style={{ padding: "10px 0", minWidth: "500px" }}>
                <h3 className="filter-model-h2">{`${dict("modify-modal/title", [])[0]} 1 ${dict("modify-modal/title", [])[1]}`}</h3>
                <div className="filter-model-grey-line"></div>
                <div className="filter-model-body">
                    <p className="staff-list-modify-select-label">{dict("modify-modal/input/role")}</p>
                    <select disabled={!role_access} onChange={(e) => { handleRoleChange(e.target.value) }} value={role && role[0] && role[0].id || ''} className="staff-list-modify-select-bar select-filter-model">
                        <option value="">{`-- ${dict("modify-modal/input/placeholder")} --`}</option>
                        {mainRolesList.map((role) => {
                            return (
                                <option key={role.id} value={role.id}>
                                    {role.name}
                                </option>
                            );
                        })}
                    </select>
                    {campus_access ? (
                        <>
                            <p className="staff-list-modify-select-label">{dict("modify-modal/input/campus")}</p>
                            <select className="staff-list-modify-select-bar select-filter-model" value={campus && campus[0] &&campus[0].id || ''} onChange={(e) => handleCampusChange(e.target.value)}>
                                <option value="">{`-- ${dict("modify-modal/input/placeholder")} --`}</option>
                                {mainDivisionsList.length !== 0
                                    ? mainDivisionsList.campuses.map((campus) => {
                                        return (
                                            <option key={campus.id} value={campus.id}>
                                                {campus.name}
                                            </option>
                                        );
                                    })
                                    : null}
                            </select>
                        </>
                    ) : null}
                    {level_access && campus && campus[0] ?
                        <React.Fragment>
                            <p className="staff-list-modify-select-label">{dict("modify-modal/input/level")}</p>
                            <div className="invite-checkbox-container">
                            {campus
                                ? mainLevelsList.filter(level => {
                                    return level.campusId === campus[0].id
                                }).map((l) => {
                                    return (
                                        <div className="invite-checkbox-wrapper" key={`${l.name}-${l.id}`}>
                                            <input
                                                id={`${l.name}-${l.id}`}
                                                type="checkbox"
                                                checked={level && level.length > 0 && level.some(opt => opt.id === l.id && opt.checked)}
                                                name={l.name}
                                                onClick={(e) => handleLevelChange(l.id, e)}
                                            />
                                            <label htmlFor={`${l.name}-${l.id}`}>{l.name}</label>
                                        </div>
                                    );
                                })
                                : null}
                            </div>
                        </React.Fragment>
                        : null}
                    {(grade_access && ((level && level.length > 0) && (campus && campus[0]))) ?
                        <React.Fragment>
                            <p className="staff-list-modify-select-label">{dict("modify-modal/input/grado")}</p>
                            <div className="invite-checkbox-container">
                                {mainGradesList.filter(main_grade => (level && level.length && level.some((opt) => ((opt.id === main_grade.levelId && opt.checked) && (opt.campusId === campus[0].id))))).map(gradeOpt => {
                                    return (
                                        <div className="invite-checkbox-wrapper" key={`${gradeOpt.name}-${gradeOpt.id}`}>
                                            <input
                                                id={`${gradeOpt.name}-${gradeOpt.id}`}
                                                type="checkbox"
                                                checked={grade && grade.length > 0 && grade.some(opt => opt.id === gradeOpt.id && opt.checked)}
                                                name={gradeOpt.name}
                                                onClick={(e) => handleGradeChange(gradeOpt.id, e)}
                                            />
                                            <label htmlFor={`${gradeOpt.name}-${gradeOpt.id}`}>{gradeOpt.name}</label>
                                        </div>
                                    )
                                })}
                            </div>
                        </React.Fragment> : null
                    }
                    {(group_access && (grade && grade.length > 0) && ((level && level.length > 0) && (campus && campus[0]))) ?
                        <React.Fragment>
                            <p className="staff-list-modify-select-label">{dict("modify-modal/input/group")}</p>
                            <div className="invite-checkbox-container">
                                {mainGroupsList.filter(main_group => 
                                    (grade && grade.length && grade.some((opt) => ((opt.id === main_group.gradeId && opt.checked) && (level && level.length && level.some((levelOpt) => (levelOpt.id === opt.levelId && levelOpt.campusId === campus[0].id))))))
                                ).map(group_opt => {
                                    return (
                                        <div className="invite-checkbox-wrapper" key={`${group_opt.name}-${group_opt.id}`}>
                                            <input
                                                id={`${group_opt.name}-${group_opt.id}`}
                                                type="checkbox"
                                                checked={group && group.length > 0 && group.some(opt => opt.id == group_opt.id && opt.checked)}
                                                name={group_opt.name}
                                                onClick={(e) => handleGroupChange(group_opt.id, e)}
                                            />
                                            <label htmlFor={`${group_opt.name}-${group_opt.id}`}>{group_opt.name}</label>
                                        </div>
                                    )
                                })}
                            </div>
                        </React.Fragment> : null
                    }
                    {after_school_group_access && campus && campus[0] ?
                        <React.Fragment>
                            <p className="staff-list-modify-select-label">{dict("modify-modal/input/after-school-group")}</p>
                            <div className="invite-checkbox-container">
                                {mainASGroupsList.filter(aSGroup => {
                                    return aSGroup.campusId === campus[0].id
                                }).map(aSGRoup => {
                                    return (
                                        <div className="invite-checkbox-wrapper" key={`${aSGRoup.name}-${aSGRoup.id}`}>
                                            <input
                                                id={`${aSGRoup.name}-${aSGRoup.id}`}
                                                type="checkbox"
                                                checked={afterSchoolGroup && afterSchoolGroup.length > 0 && afterSchoolGroup.some(opt => opt.id == aSGRoup.id && opt.checked)}
                                                name={aSGRoup.name}
                                                onClick={(e) => handleASGroupChange(aSGRoup.id, e)}
                                            />
                                            <label htmlFor={`${aSGRoup.name}-${aSGRoup.id}`}>{aSGRoup.name}</label>
                                        </div>
                                    )
                                })}
                            </div>
                        </React.Fragment>
                        : null}
                </div>
                <div className="filter-model-grey-line"></div>
                <div className="staff-list-modify-buttons-container filter-model-footer" style={{}}>
                    <button className="cancel-button" onClick={() => {props.closeModal(); setUpdated(true);}}>{dict("modify-modal/button/cancel")}</button>
                    <button className="create-button" onClick={() => updateUser(props.modifyList.join())}>{dict("modify-modal/button/confirm")}</button>
                </div>
            </div>
        </div>
    );
}

export default InviteModifyModal;
