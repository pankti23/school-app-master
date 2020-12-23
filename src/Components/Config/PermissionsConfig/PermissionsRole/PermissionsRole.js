import React from "react";

import MinimizeButton from "../../../UI/MinimizeButton";
import PermissionsRoleGroup from "./PermissionsRoleGroup";
import { useDict } from "../../../UI/Translations";

import "./PermissionsRole.css";

const PermissionsRole = (props) => {
  const { disable, loadData, permissions, role } = props;

  const [loading, setLoading] = React.useState(false);

  const [minimized, setMinimized] = React.useState(true);

  const [permissionsState, setPermissionsState] = React.useState({});

  const dict = useDict("/configuration-page/permissions");

  const permissionsIdMap = {};

  const permissionsMap = {};

  const permissionsGroupMap = {
    "/afterSchoolGroupStudents": dict("role/permission-type/configuration"),
    "/afterSchoolGroupTeachers": dict("role/permission-type/configuration"),
    "/afterSchoolGroups": dict("role/permission-type/configuration"),
    "/calendarItems": dict("role/permission-type/calendar"),
    "/campusChatRooms": dict("role/permission-type/communication"),
    "/campuses": dict("role/permission-type/configuration"),
    "/eventLogs": dict("role/permission-type/other"),
    "/gradeChatRooms": dict("role/permission-type/communication"),
    "/grades": dict("role/permission-type/configuration"),
    "/gradingSystems": dict("role/permission-type/configuration"),
    "/groupChatRooms": dict("role/permission-type/communication"),
    "/groupSubjectTeachers": dict("role/permission-type/school-staff"),
    "/groups": dict("role/permission-type/configuration"),
    "/levelChatRooms": dict("role/permission-type/communication"),
    "/levels": dict("role/permission-type/configuration"),
    "/permissions": dict("role/permission-type/configuration"),
    "/pushTokens": dict("role/permission-type/other"),
    "/schoolInfo": dict("role/permission-type/configuration"),
    "/scores": dict("role/permission-type/students"),
    "/studentParents": dict("role/permission-type/configuration"),
    "/students": dict("role/permission-type/students"),
    "/subjectTeachers": dict("role/permission-type/school-staff"),
    "/subjects": dict("role/permission-type/configuration"),
    "/users": dict("role/permission-type/configuration"),
    "/yearbooks": dict("role/permission-type/configuration")
  };

  permissions.forEach((permission) => {
    if (permissionsMap[permissionsGroupMap[permission.path]]) {
      if (
        permissionsMap[permissionsGroupMap[permission.path]][permission.route]
      ) {
        permissionsMap[permissionsGroupMap[permission.path]][
          permission.route
        ].push({
          action: permission.action,
          permission: permission
        });
      } else {
        permissionsMap[permissionsGroupMap[permission.path]][
          permission.route
        ] = [{ action: permission.action, permission: permission }];
      }
    } else {
      permissionsMap[permissionsGroupMap[permission.path]] = {};

      permissionsMap[permissionsGroupMap[permission.path]][permission.route] = [
        { action: permission.action, permission: permission }
      ];
    }

    if (permissionsIdMap[permission.route]) {
      permissionsIdMap[permission.route][permission.action] = [
        permission.id,
        permission.isAuthorized
      ];
    } else {
      permissionsIdMap[permission.route] = {
        [permission.action]: [permission.id, permission.isAuthorized]
      };
    }
  });

  React.useEffect(() => {
    const permissionsStateData = {};

    Object.values(permissionsMap).forEach((permissionGroup) => {
      Object.entries(permissionGroup).forEach((permission) => {
        const action_delete = permission[1].find((v) => v.action === "delete")
          .permission.isAuthorized;

        const action_get = permission[1].find((v) => v.action === "get")
          .permission.isAuthorized;

        const action_post = permission[1].find((v) => v.action === "post")
          .permission.isAuthorized;

        const action_put = permission[1].find((v) => v.action === "put")
          .permission.isAuthorized;

        const read = action_get;

        const write = action_delete && action_post && action_put;

        permissionsStateData[permission[0]] = write
          ? "write"
          : read
          ? "read"
          : "disabled";
      });
    });

    setPermissionsState(permissionsStateData);
  }, []);

  return (
    <div className="permissions-role-container">
      <div className="permissions-role-header-container">
        <div className="permissions-role-header-left-container">
          <span className="permissions-role-header-left-text">{role.name}</span>
        </div>

        <div className="permissions-role-header-right-container">
          <MinimizeButton
            disable={loading || disable}
            handleClick={() => setMinimized(!minimized)}
            minimized={minimized}
            style={{ bgcolor: "transparent" }}
          />
        </div>
      </div>

      {!minimized && (
        <div className="permissions-role-content-container">
          <PermissionsRoleGroup
            handleLoading={(state) => setLoading(state)}
            handlePermissionsState={(state) => setPermissionsState(state)}
            loadData={loadData}
            loading={loading}
            permissions={permissionsMap}
            permissionsIdMap={permissionsIdMap}
            permissionsState={permissionsState}
            title={dict("role/administrative-permissions")}
          />
        </div>
      )}
    </div>
  );
};

export default PermissionsRole;
