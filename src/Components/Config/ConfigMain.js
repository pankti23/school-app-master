import React from "react";
import "./ConfigMain.css"
import NavBarConfig from "./NavBarConfig/NavBarConfig";
import { Switch, Route, useParams } from "react-router-dom";
import SchoolConfig from "./SchoolConfig/SchoolConfig";
import GradeSystemConfig from "./GradeSystemConfig/GradeSystemConfig";
import SubjectsConfig from "./SubjectsConfig/SubjectsConfig";
import AdminStaffConfig from "./AdminStaffConfig/AdminStaffConfig";
import TeachersConfig from "./TeachersConfig/TeachersConfig";
import PermissionsConfig from "./PermissionsConfig/PermissionsConfig";
// import VocalParentsConfig from "./VocalParentsConfig/VocalParentsConfig";
import ExtracurricularConfig from "./ExtracurricularConfig/ExtracurricularConfig";

const ConfigMain = () => {

  return (
    <div className="ConfigMain">
      {/* this will show what is the current page*/}
      <div className="config-navbar">
        <NavBarConfig />
      </div>

      <div className="config-wrapper">
       <Switch>
        <Route exact path="/configuration-page/school">
          <SchoolConfig />
        </Route>

        <Route exact path="/configuration-page/grade-system">
          <GradeSystemConfig />
        </Route>

        <Route exact path="/configuration-page/subjects">
          <SubjectsConfig />
        </Route>

        <Route exact path="/configuration-page/admin-staff" component={AdminStaffConfig} />

        <Route path="/configuration-page/teachers" component={TeachersConfig} />

        <Route path="/configuration-page/extracurricular">
          <ExtracurricularConfig />
        </Route>

        <Route path="/configuration-page/permissions">
          <PermissionsConfig />
        </Route>

        {/** this will be the default route and component that will render for this page */}
        <Route path="/configuration-page/"> 
          <SchoolConfig />
        </Route>
      </Switch>
      </div>
    </div>
  );
};

export default ConfigMain;
