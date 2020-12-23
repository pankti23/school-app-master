import React, { useState, useEffect, createRef } from 'react'
import axios from "axios"

import '../TeachersConfig.css';
import MinimizeIcon from '../../../../SchoolAPP Assets/Minimize.svg';
import PlusIcon from '../../../../SchoolAPP Assets/BlackPlus';
import CampusLevels from './CampusLevels/CampusLevels';
import LoadingSpinner from "../../../UI/LoadingSpinner";

import { useDict } from "../../../UI/Translations"

const baseUrl = process.env.REACT_APP_BASE_URL;

const MainGroupsTeachers = (props) => {
	const accordionRef = createRef();

	const { campus, users, levels, grades, groups, setUpdated, updated, mainTeachers, setWarning, setMainTeacherExistInGroup, queryStrings, isMainTeacherExistInGroup } = props;

	const [levelsList, setLevelsList] = useState(levels);
	const [isLoading, setIsLoading] = useState(true);

	const [minimized, setMinimized] = useState(false);

  const dict = useDict("/configuration-page/teachers")

	const handleMinimizeButtonClick = () => {
		setMinimized(!minimized);
	};

	useEffect(() => {
		setLevelsList(levels);
		setIsLoading(false);
	}, [levels]);

	useEffect(() => {
		if (String(queryStrings.campus) === String(campus.id) && String(queryStrings.type) === 'main') {
      setMinimized(true);
      accordionRef.current.classList.add('show');
    }
  }, [queryStrings]);

	return (
		<div id={`accordion-${campus.id}-main-teachers`}>
			<div className="card">
				<div className="card-header" id={`accordion-${campus.id}-main-teachers-heading-1-1`}>
					<h5 className="mb-0">
            {dict("main-teachers/title")}
                </h5>
					<div className="pull-right">
						<a className="collapsed btn-collapse btn-open" onClick={handleMinimizeButtonClick} role="button" data-toggle="collapse" href={`#accordion-${campus.id}-main-teachers-collapse-1-1`} aria-expanded="false" aria-controls="main-teachers-collapse-1-1">
							{minimized ? (
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
							{minimized ? "Minimize" : "Open"}
            </a>
					</div>
				</div>
				<div id={`accordion-${campus.id}-main-teachers-collapse-1-1`} ref={accordionRef} className="collapse" data-parent={`#accordion-${campus.id}-main-teachers`} aria-labelledby={`accordion-${campus.id}-main-teachers-heading-1-1`}>
					<div className="card-body">
						{isLoading ? <LoadingSpinner /> : (
							levelsList.filter(level => {
								return campus.id === level.campusId
							}).map((level) => {
								return (
									<CampusLevels
										updated={updated}
										queryStrings={queryStrings}
										level={level}
										key={level.id}
										jwt={props.jwt}
										users={users}
										mainTeachers={mainTeachers}
										grades={grades}
										groups={groups}
										setUpdated={setUpdated}
										setWarning={setWarning}
										setMainTeacherExistInGroup={setMainTeacherExistInGroup}
                    isMainTeacherExistInGroup={isMainTeacherExistInGroup}
									/>
								)
							})
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

export default MainGroupsTeachers;
