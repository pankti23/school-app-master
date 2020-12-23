import React, { useState } from "react";
import "./GradeSystem.css";
import GradeSystemHeader from "./GradeSystemHeader/GradeSystemHeader";
import GradingSystemConfigTable from "./GradingSystemConfigTable/GradingSystemConfigTable";
import GradeSystemMinimized from "../GradeSystemMinimized/GradeSystemMinimized";

const GradeSystem = (props) => {
  const { gradeSystem, loadData } = props;
  const { name: gradeSystemName, Campus, id: gradeSystemId } = gradeSystem;

  const [minimized, setMinimized] = useState(true);

  const toggleMinimizedState = () => {
    setMinimized(!minimized);
  };

  return (
    <div style={{ marginTop: "20px" }}>
      {minimized ? (
        <GradeSystemMinimized
          minimized={minimized}
          toggleMinimizedState={toggleMinimizedState}
          campusName={Campus.name}
        />
      ) : (
        <div className="grade-system-container">
          <GradeSystemHeader
            campuId={Campus.id}
            campusName={Campus.name}
            gradeSystem={gradeSystem}
            gradeSystemName={gradeSystemName}
            loadData={loadData}
            minimized={minimized}
            toggleMinimizedState={toggleMinimizedState}
          />
          <div className="grade-system-body">
            <GradingSystemConfigTable
              gradeSystem={gradeSystem}
              loadData={loadData}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default GradeSystem;
