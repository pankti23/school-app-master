import React from "react";
import { FaTimes } from "react-icons/fa";

import Button from "../../../../UI/Button";
import LoadingSpinner from "../../../../UI/LoadingSpinner";
import ReadIcon from "../../../../../SchoolAPP Assets/read.svg";
import WriteIcon from "../../../../../SchoolAPP Assets/write.svg";
import { updatePermissions } from "../../../../../services/permissionsService";
import { useDict } from "../../../../UI/Translations";

import "./PermissionsRoleGroup.css";

const PermissionsRoleGroup = (props) => {
  const {
    handleLoading,
    handlePermissionsState,
    loadData,
    loading,
    permissions,
    permissionsIdMap,
    permissionsState,
    title
  } = props;

  const dict = useDict("/configuration-page/permissions");

  const [modifiedPermissions, setModifiedPermissions] = React.useState(
    permissionsState
  );

  const handleDisableAllButtonClick = async () => {
    const permissionsStateData = {};

    Object.keys(permissionsState).forEach((permission) => {
      permissionsStateData[permission] = "disabled";
    });

    setModifiedPermissions(permissionsStateData);
  };

  const handleReadAllButtonClick = async () => {
    const permissionsStateData = {};

    Object.keys(permissionsState).forEach((permission) => {
      permissionsStateData[permission] = "read";
    });

    setModifiedPermissions(permissionsStateData);
  };

  const handleStatusButtonClick = async (permissionName, status) => {
    if (!loading) {
      const permissionsStateData = {};

      const nextStatus =
        status === "disabled"
          ? "read"
          : status === "read"
          ? "write"
          : "disabled";

      Object.entries(modifiedPermissions).forEach((permission) => {
        permissionsStateData[permission[0]] = permission[1];
      });

      permissionsStateData[permissionName] = nextStatus;

      setModifiedPermissions(permissionsStateData);
    }
  };

  const handlePermissionSaveButton = async () => {
    if (!loading) {
      const promises = [];

      const filteredPermissions = Object.entries(modifiedPermissions).filter(
        (permission) => permissionsState[permission[0]] !== permission[1]
      );

      if (filteredPermissions.length > 0) {
        filteredPermissions.forEach((permission) => {
          if (permission[1] === "disabled") {
            Object.values(permissionsIdMap[permission[0]])
              .filter((permissionId) => permissionId[1] === true)
              .forEach((permissionId) => {
                promises.push(
                  updatePermissions({
                    id: permissionId[0],
                    isAuthorized: false
                  })
                );
              });
          } else if (permission[1] === "read") {
            Object.entries(permissionsIdMap[permission[0]])
              .filter((permissionId) => permissionId[0] === "get")
              .filter((permissionId) => permissionId[1][1] === false)
              .forEach((permissionId) => {
                promises.push(
                  updatePermissions({
                    id: permissionId[1][0],
                    isAuthorized: true
                  })
                );
              });

            Object.entries(permissionsIdMap[permission[0]])
              .filter(
                (permissionId) =>
                  permissionId[0] === "delete" ||
                  permissionId[0] === "post" ||
                  permissionId[0] === "put"
              )
              .filter((permissionId) => permissionId[1][1] === true)
              .forEach((permissionId) => {
                promises.push(
                  updatePermissions({
                    id: permissionId[1][0],
                    isAuthorized: false
                  })
                );
              });
          } else {
            Object.values(permissionsIdMap[permission[0]])
              .filter((permissionId) => permissionId[1] === false)
              .forEach((permissionId) => {
                promises.push(
                  updatePermissions({
                    id: permissionId[0],
                    isAuthorized: true
                  })
                );
              });
          }
        });

        try {
          handleLoading(true);

          await Promise.all(promises);

          handlePermissionsState(modifiedPermissions);

          await loadData();
        } catch (e) {
          console.log(dict("role/group/message/error/api"));

          console.error(e);
        } finally {
          setTimeout(() => handleLoading(false), 1200);
        }
      }
    }
  };

  const handleWriteAllButtonClick = async () => {
    const permissionsStateData = {};

    Object.keys(permissionsState).forEach((permission) => {
      permissionsStateData[permission] = "write";
    });

    setModifiedPermissions(permissionsStateData);
  };

  React.useEffect(() => {
    setModifiedPermissions(permissionsState);
  }, [permissionsState]);

  return (
    <div className="permissions-role-group-container">
      <div className="permissions-role-group-header-container">
        <div className="permissions-role-group-header-left-container">
          <span className="permissions-role-group-header-left-text">
            {title}
          </span>
        </div>

        <div className="permissions-role-group-header-right-container">
          <button
            className="permissions-role-group-header-right-button"
            onClick={handleDisableAllButtonClick}
          >
            <span className="permissions-role-group-header-right-button-text">
              {dict("role/group/button/disable-all")}
            </span>
          </button>

          <button
            className="permissions-role-group-header-right-button"
            onClick={handleReadAllButtonClick}
          >
            <span className="permissions-role-group-header-right-button-text">
              {dict("role/group/button/read-all")}
            </span>
          </button>

          <button
            className="permissions-role-group-header-right-button"
            onClick={handleWriteAllButtonClick}
            style={{ borderRadius: "0 6px 0 0" }}
          >
            <span className="permissions-role-group-header-right-button-text">
              {dict("role/group/button/write-all")}
            </span>
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div>
          {Object.entries(permissions).map((permissionGroup) => (
            <div
              className="permissions-role-group-body-container"
              key={permissionGroup[0]}
            >
              <div className="permissions-role-group-body-title-container">
                <span className="permissions-role-group-body-title-text">
                  {permissionGroup[0].toUpperCase()}
                </span>
              </div>

              <div className="permissions-role-group-body-content-container">
                {Object.entries(permissionGroup[1])
                  .sort()
                  .map((permission) => (
                    <div
                      className="permissions-role-group-body-content-cell-container"
                      key={permission[0]}
                    >
                      <div className="permissions-role-group-body-content-cell-status-container">
                        <button
                          className="permissions-role-group-body-content-cell-status-button"
                          onClick={() =>
                            handleStatusButtonClick(
                              permission[0],
                              modifiedPermissions[permission[0]]
                            )
                          }
                          style={{
                            justifyContent:
                              modifiedPermissions[permission[0]] === "disabled"
                                ? "flex-start"
                                : modifiedPermissions[permission[0]] === "read"
                                ? "center"
                                : "flex-end"
                          }}
                        >
                          {modifiedPermissions[permission[0]] === "disabled" ? (
                            <div className="permissions-role-group-body-content-cell-status-disabled">
                              <FaTimes color="#ffffff" size="12" />
                            </div>
                          ) : modifiedPermissions[permission[0]] === "read" ||
                            modifiedPermissions[permission[0]] === "write" ? (
                            <img
                              alt="status-icon"
                              src={
                                modifiedPermissions[permission[0]] ===
                                "disabled"
                                  ? ReadIcon
                                  : modifiedPermissions[permission[0]] ===
                                    "read"
                                  ? ReadIcon
                                  : WriteIcon
                              }
                            />
                          ) : (
                            <div />
                          )}
                        </button>
                      </div>

                      <div className="permissions-role-group-body-content-cell-text-container">
                        <span className="permissions-role-group-body-content-cell-text">
                          {dict(`role/permissions/${permission[0]}`) ||
                            permission[0]}
                        </span>
                      </div>
                    </div>
                  ))}

                {Object.keys(permissionGroup[1]).length % 2 === 1 && (
                  <div className="permissions-role-group-body-content-cell-container" />
                )}
              </div>
            </div>
          ))}

          <div style={{ borderTop: "1px solid #dbdbdb", padding: "8px" }}>
            <Button
              color="grey"
              onClick={handlePermissionSaveButton}
              size="medium"
              width="100%"
            >
              <span className="school-info-school-info-save-button-text">
                {dict("role/group/button/save")}
              </span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PermissionsRoleGroup;
