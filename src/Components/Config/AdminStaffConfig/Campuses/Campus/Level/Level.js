import React, { useState, createRef, useEffect } from 'react';

import MinimizeIcon from '../../../../../../SchoolAPP Assets/Minimize.svg';
import PlusIcon from '../../../../../../SchoolAPP Assets/BlackPlus';

import Directors from './Directors';

import '../../../AdminStaffConfig.css';

const Level = props => {
  const levelRef = createRef();

  const { level, campusId, campusName, campusKeyIdx, levelKeyIdx, users, setUpdated, levelsPrincipals, queryStrings } = props;
  const { id, name } = level;

  const [minimize, setMinimized] = useState(false);

  const handleMinimizeClick = () => {
    setMinimized(!minimize);
  };

  useEffect(() => {
		if (String(queryStrings.level) === String(id)) {
      setMinimized(true);
      levelRef.current.classList.add('show');
    }
  }, [queryStrings]);

  let uniqueId = `${campusId}-${campusName}-${campusKeyIdx}-${id}-${name}`;
  let accordionId = `accordion-${uniqueId}-${levelKeyIdx}`
  let cardHeaderHeading = `accordion-${uniqueId}-heading-${levelKeyIdx}`;
  let accordionCollapseId = `accordion-${uniqueId}-collapse-${levelKeyIdx}`

  return (
    <div id={`${accordionId}`} key={`${uniqueId}-${levelKeyIdx}`}>
      <div className="accordion-card">
        <div className="accordion-card-header" id={`${cardHeaderHeading}`}>
          <h5 className="mb-0">
            {name || ''}
          </h5>
          <div className="pull-right">
            <a 
              className="btn-collapse btn-open" 
              onClick={handleMinimizeClick} 
              role="button" 
              data-toggle="collapse" 
              href={`#${accordionCollapseId}`} 
              aria-expanded="true" 
              aria-controls={`${accordionCollapseId}`}>
                {minimize ? (
                    <img
                    alt="minimize-icon"
                    src={MinimizeIcon}
                    style={{ minWidth: "12px" }}
                    />
                ) : (
                    <PlusIcon
                        fill="#000000"
                        width="13px"
                        height="13px"
                        stroke="none"
                        style={{ minWidth: "13px" }}
                    />
                    )}
                {minimize ? "Minimize" : "Open"}
              </a>
          </div>
        </div>
        <div id={`${accordionCollapseId}`} ref={levelRef} className="collapse" data-parent={`#${accordionId}`} aria-labelledby={`${cardHeaderHeading}`}>
          <div className="card-body accordion-card-body" id={`directors-${uniqueId}-${levelKeyIdx}`}>
            <Directors
              campusId={campusId}
              campusName={campusName}
              campusKeyIdx={campusKeyIdx} 
              ids={`${uniqueId}-${levelKeyIdx}`}
              level={level}
              levelKeyIdx={levelKeyIdx}
              users={users}
              setUpdated={setUpdated}
              levelsPrincipals={levelsPrincipals}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Level;
