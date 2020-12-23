import React, { useState, createRef, useEffect } from 'react';

import MinimizeIcon from '../../../../../SchoolAPP Assets/Minimize.svg';
import PlusIcon from '../../../../../SchoolAPP Assets/BlackPlus';

import Directors from './Directors';
import Level from './Level';
import LoadingSpinner from '../../../../UI/LoadingSpinner';

import '../../AdminStaffConfig.css';

const Campus = props => {
  const accordionRef = createRef();

  const { campusInfo, campusKeyIdx, levels, users, campusesPrincipals, levelsPrincipals, setUpdated, queryStrings } = props;
  const { id, name } = campusInfo;

  const [minimize, setMinimized] = useState(false);
  const [levelsList, setLevelsList] = useState(levels);
  const [isLoading, setIsLoading] = useState(true);

  const handleMinimizeClick = () => {
    setMinimized(!minimize);
  };

  useEffect(() => {
		setLevelsList(levels);
		setIsLoading(false);
  }, [levels])


  useEffect(() => {
		if (String(queryStrings.campus) === String(id)) {
      setMinimized(true);
      accordionRef.current.classList.add('show');
    }
  }, [queryStrings]);

  return (
    <div key={`${id}-${name}-${campusKeyIdx}`} className="card" id={`${id}-${name}-${campusKeyIdx}`}>
      <div className="card-header" id={`card-header-${id}-${name}-${campusKeyIdx}`}>
        {/* START :: Listing campuses */}
        <div id={`accordion-${id}-${name}-${campusKeyIdx}`}>
          <div className="accordion-card">
            <div className="accordion-card-header" id={`accordion-${id}-${name}-heading-${campusKeyIdx}`}>
              <h5 className="mb-0">
                {name || ''}
              </h5>
              <div className="pull-right">
                <a 
                  className="btn-collapse btn-open" 
                  onClick={handleMinimizeClick} 
                  role="button" 
                  data-toggle="collapse" 
                  href={`#accordion-${id}-${name}-collapse-${campusKeyIdx}`} 
                  aria-expanded="true" 
                  aria-controls={`accordion-${id}-${name}-collapse-${campusKeyIdx}`}>
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
            <div id={`accordion-${id}-${name}-collapse-${campusKeyIdx}`} ref={accordionRef}
            className="collapse" data-parent={`#accordion-${id}-${name}-${campusKeyIdx}`} aria-labelledby={`accordion-${id}-${name}-heading-${campusKeyIdx}`}>
              <div className="card-body accordion-card-body" id={`directors-${id}-${name}-${campusKeyIdx}`}>
                <Directors
                  campusId={id}
                  campusName={name}
                  campusKeyIdx={campusKeyIdx} 
                  ids={`${id}-${name}-${campusKeyIdx}`}
                  users={users}
                  campusesPrincipals={campusesPrincipals}
                  setUpdated={setUpdated}
                />
              </div>
            </div>
          </div>
        </div>
        {/* END :: Listing campuses */}
        {isLoading ? <LoadingSpinner /> : (
          levelsList.filter(level => {
            return id === level.campusId
          }).map((level, levelKeyIdx) => {
            return (
              <Level
                level={level} 
                queryStrings={queryStrings}
                campusId={id}
                campusName={name}
                campusKeyIdx={campusKeyIdx}
                levelKeyIdx={levelKeyIdx}
                users={users}
                setUpdated={setUpdated}
                levelsPrincipals={levelsPrincipals}
              />
            )
          })
        )}
      </div>
    </div>
  )
}

export default Campus;
