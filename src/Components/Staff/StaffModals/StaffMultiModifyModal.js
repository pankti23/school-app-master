import React, { useEffect, useState } from 'react';
import axios from "axios"
import { getTokenFromLocalStorage } from "../../../services/localStorageService";

import { useDict } from "../../UI/Translations"

import "./InviteModifyModal.css"

const baseUrl = process.env.REACT_APP_BASE_URL;

const StaffMultiModifyModal = props => {

    const { setUpdated, setListOfCheckedBoxes } = props;

    // const [mainDivisionsList, setMainDivisionsList] = useState([]);
    const [mainRolesList, setMainRolesList] = useState([]);
    
    const [role, setRole] = useState("");

    const dict = useDict("/staff-members-page")

    // const [campus, setCampus] = useState("");

    // const getDivisions = async () => {
    //     const token = getTokenFromLocalStorage();
    //     const config = {
    //         method: "get",
    //         url: `${baseUrl}/schoolInfo/divisions/all`,
    //         headers: {
    //             Authorization: token,
    //         },
    //     };
    //     try {
    //         const { data } = await axios(config);
    //         console.log(data)
    //         setMainDivisionsList(data);
    //     } catch (err) {
    //         console.error(err.toString());
    //     }
    // };

    const getRoles = async () => {
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

    const updateSelectedStaffMembers = async () => {
        // if((role && role[0]) && (campus && campus[0])){
        if(role && role[0]){
            const token = getTokenFromLocalStorage();

            const idsArray = props.modifyList;
            const assignCampusToSelectedStaff = async () => { 
                if(idsArray){
                    idsArray.forEach(async id => {
                        const config = {
                            method: 'PUT',
                            url: `${baseUrl}/users/${id}`,
                            data: { 
                                // campusId: campus[0].id,
                                roleId: role[0].id
                            },
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
                    assignCampusToSelectedStaff()
                ]);
                setUpdated(true);
                props.closeModal();
                setListOfCheckedBoxes([]);
            } catch (e) {
                console.log(e);
            } 
        }
        return;
    }

    const handleRoleChange = async (roleId) => {
        if (roleId) {
            const filtering = mainRolesList.filter(item => {
                return item.id == roleId
            });
            setRole(filtering); 
        } else {
            setRole("")
        }
    }

    // const handleCampusChange = (campusId) => {
    //     if (campusId) {
    //         const filtering = mainDivisionsList.campuses.filter(item => {
    //             return item.id == campusId
    //         })
    //         setCampus(filtering);
    //     } else {
    //         setCampus("")
    //     }
    // }

    useEffect(() => {
        // getDivisions();
        getRoles();
    }, [props.staffList]);

    useEffect(() => {
        console.log(role);
    }, [role])

    return (
        <div className="delete-confirmation-modal-container" style={{ padding: "10px 0", minWidth: "500px" }}>
            <h3 style={{ padding: "10px" }}>{`${dict("modify-modal/title")[0]} ${props.modifyList.length} ${dict("modify-modal/title")[1]}`} </h3>
            <div className="grey-line"></div>
            <div style={{ padding: "10px 40px 10px 10px" }}>
                <p className="staff-list-modify-select-label">{dict("modify-modal/input/role")}</p>
                <select onChange={(e) => { handleRoleChange(e.target.value) }} value={role && role[0] && role[0].id || ''} className="staff-list-modify-select-bar">
                    <option value="">{`-- ${dict("modify-modal/input/placeholder")} --`}</option>
                    {mainRolesList.map((role) => {
                        return (
                            <option key={role.id} value={role.id}>
                                {role.name}
                            </option>
                        );
                    })}
                </select>
                {/* <p className="staff-list-modify-select-label">Plantel</p>
                <select className="staff-list-modify-select-bar" value={campus && campus[0] &&campus[0].id || ''} onChange={(e) => handleCampusChange(e.target.value)}>
                    <option value="">-- Choose One --</option>
                    {mainDivisionsList.length !== 0
                        ? mainDivisionsList.campuses.map((campus) => {
                            return (
                                <option key={campus.id} value={campus.id}>
                                    {campus.name}
                                </option>
                            );
                        })
                        : null}
                </select> */}
            </div>
            <div className="grey-line"></div>
            <div className="staff-list-modify-buttons-container" style={{}}>
                <button className="cancel-button" onClick={() => props.closeModal()}>Cancelar</button>
                <button className="create-button" onClick={() => updateSelectedStaffMembers()}>Confirmar</button>
            </div>
        </div>
    );
}

export default StaffMultiModifyModal;
