import React from "react";

import Button from "../../../UI/Button";
import ExtracurricularCampusAddModal from "./ExtracurricularCampusAddModal/ExtracurricularCampusAddModal";
import ExtracurricularGroup from "./ExtracurricularGroup/ExtracurricularGroup";
import MinimizeButton from "../../../UI/MinimizeButton";
import { useDict } from "../../../UI/Translations"

import "./ExtracurricularCampus.css";

const ExtracurricularCampus = (props) => {
  const { campus, loadData } = props;

  const [displayAddModal, setDisplayAddModal] = React.useState(false);

  const [minimized, setMinimized] = React.useState(true);

  const dict = useDict("/configuration-page/extracurricular")

  const findGroup = (name) => {
    return campus.extracurricularGroup.find((v) => v.name === name);
  };

  const handleAddButtonClick = () => {
    setDisplayAddModal(true);
  };

  return (
    <div className="extracurricular-campus-container">
      <div className="extracurricular-campus-header-container">
        <div className="extracurricular-campus-header-title-container">
          <span className="extracurricular-campus-header-title-text">
            {campus.name}
          </span>
        </div>

        {campus.extracurricularGroup.length === 0 ? (
          <Button
            color="green"
            onClick={handleAddButtonClick}
            size="medium"
            style={{ borderRadius: "6px" }}
          >
            <span className="extracurricular-campus-header-add-button-text">
              {dict("campus/add-group-button")}
            </span>
          </Button>
        ) : (
          <MinimizeButton
            handleClick={() => setMinimized(!minimized)}
            minimized={minimized}
            style={{ bgcolor: "transparent" }}
          />
        )}
      </div>

      {campus.extracurricularGroup.length > 0 && !minimized && (
        <div className="extracurricular-campus-groups-container">
          {campus.extracurricularGroup.map((v) => (
            <ExtracurricularGroup
              findGroup={findGroup}
              group={v}
              key={v.id}
              loadData={loadData}
            />
          ))}

          <div className="extracurricular-campus-groups-add-long-button-wrapper">
            <Button
              color="grey"
              onClick={handleAddButtonClick}
              size="medium"
              width="100%"
            >
              <div className="extracurricular-campus-groups-add-long-button-container">
                <span
                  className="extracurricular-campus-groups-add-long-button-text"
                  style={{
                    fontSize: "18px",
                    transform: "translate(-2px, -2px)"
                  }}
                >
                  +
                </span>

                <span className="extracurricular-campus-groups-add-long-button-text">
                  {dict("campus/add-group-button")}
                </span>
              </div>
            </Button>
          </div>
        </div>
      )}

      {displayAddModal && (
        <ExtracurricularCampusAddModal
          campus={campus}
          closeAddModal={() => setDisplayAddModal(false)}
          findGroup={findGroup}
          loadData={loadData}
        />
      )}
    </div>
  );
};

export default ExtracurricularCampus;
