import React, { useState, useContext, useEffect } from 'react';

// modals
import { FormModal } from "../../../../../UI/AddStaffModal";

import '../../../AdminStaffConfig.css';

const AddSchoolAdministrators = props => {

  const handleChange = (event) => {
   
  }

  const handleAdd = async () => {
   
  }


  return (
    <FormModal
        open={props.isOpenModalForStaffMember}
        onClose={props.closeModal}
      >
        <div className="modal-header">
          <h5 className="modal-title">Add members</h5>
          <span className="modal-mini-title">School administrators</span>
        </div>
        <div class="modal-body">
          <form className="add-staff-members-form" onSubmit={() => {}}>
            <div className="searchbox">
              <a href="javascript:void(0)" className="search-icon">
                  <i className="fa fa-search" aria-hidden="true"></i>
              </a>
              <input 
                type="text"
                onChange={handleChange} 
                placeholder="Search staff" />
            </div>
            <div className="checkbox-row">
              <div className="form-group check-box">
                <input type="checkbox" id="name-1" />
                <label for="name-1">Elvis Ge (elvis@school.com)</label>
              </div>
              <div className="form-group check-box">
                <input type="checkbox" id="name-2"/>
                <label for="name-2">Fred Demo (fred@school.com)</label>
              </div>
              <div className="form-group check-box">
                <input type="checkbox" id="name-3"/>
                <label for="name-3">Reese Morisson (reese@school.com)</label>
              </div>
            </div>
          </form>
        </div>
        <div className="modal-footer">
            <div class="buttons">
              <button class="cancelButton" type="button" onClick={props.closeModal}>Cancel</button>
              <button class="createButton" onClick={handleAdd}>Add</button>
            </div>
        </div>
    </FormModal>
  );
}

export default AddSchoolAdministrators;
