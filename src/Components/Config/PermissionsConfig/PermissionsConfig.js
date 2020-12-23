import React from "react";

import LoadingSpinner from "../../UI/LoadingSpinner";
import PermissionsRole from "./PermissionsRole";
import { getPermissionsList } from "../../../services/permissionsService";
import { getRolesList } from "../../../services/rolesService";
import { setCurrentPage } from "../../../services/localStorageService";
import { useDict } from "../../UI/Translations";

import "./PermissionsConfig.css";

const PermissionsConfig = () => {
  const [disable, setDisable] = React.useState(true);

  const [loading, setLoading] = React.useState(true);

  const [permissions, setPermissions] = React.useState([]);

  const [roles, setRoles] = React.useState([]);

  const dict = useDict("/configuration-page/permissions");

  const loadData = async () => {
    setDisable(true);

    const promises = [getPermissionsList(), getRolesList()];

    try {
      const [permissionsData, rolesData] = await Promise.all(promises);

      setPermissions(permissionsData);

      setRoles(rolesData);
    } catch (e) {
      console.log("Error loading data.");

      console.error(e);
    } finally {
      setDisable(false);

      setLoading(false);
    }
  };

  React.useEffect(() => {
    setCurrentPage("/configuration-page/permissions");

    loadData();
  }, []);

  return (
    <div className="permissions-config-container">
      <div className="permissions-config-header-container">
        <div className="permissions-config-header-title-container">
          <span className="permissions-config-header-title-text">
            {dict("main/header/title")}
          </span>
        </div>

        <div className="permissions-config-header-paragraph-container">
          <span className="permissions-config-header-paragraph-text">
            {dict("main/header/paragraph")}
          </span>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="permissions-config-content-wrapper">
          {roles.map((role) => (
            <div className="permissions-config-content-container" key={role.id}>
              <PermissionsRole
                disable={disable}
                loadData={loadData}
                permissions={permissions.filter(
                  (permission) => permission.roleId === role.id
                )}
                role={role}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PermissionsConfig;
