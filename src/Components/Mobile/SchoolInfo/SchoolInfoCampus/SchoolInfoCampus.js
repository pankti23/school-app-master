import React from "react";

import Button from "../../../UI/Button";
import MinimizeButton from "../../../UI/MinimizeButton";
import { getCampus, updateCampus } from "../../../../services/campusService";
import { getLevelList } from "../../../../services/levelService";
import { updateLevel } from "../../../../services/levelService";
import { useDict } from "../../../UI/Translations";

import "./SchoolInfoCampus.css";

const SchoolInfoCampus = (props) => {
  const { campus, disabled, handleDisabled, getCampusNames } = props;

  const [campusInfo, setCampusInfo] = React.useState({
    email: campus.email,
    facebook: campus.facebook,
    instagram: campus.instagram,
    linkedin: campus.linkedin,
    name: campus.name,
    phone1: campus.phone1,
    phone2: campus.phone3,
    phone3: campus.phone3,
    street: campus.street,
    twitter: campus.twitter,
    website: campus.website,
    youtube: campus.youtube
  });

  const [campusName, setCampusName] = React.useState(campus.name);

  const [errorMessage, setErrorMessage] = React.useState("");

  const [levelPhoneInfo, setLevelPhone] = React.useState(
    campus.levels.map((v) => [v.phone1, v.phone2])
  );

  const [minimized, setMinimized] = React.useState(true);

  const dict = useDict("/mobile/school-info");

  const handleInputChange = (e) => {
    const name = e.target.name;

    const value = e.target.value;

    setCampusInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneLevelInputChange = (e) => {
    const index = e.target.attributes.index.value / 1;

    const name = e.target.name / 1;

    const temp = levelPhoneInfo.map((v) => v);

    const value = e.target.value;

    temp[index][name] = value;

    setLevelPhone(temp);
  };

  const handleSaveButtonClick = async () => {
    if (!disabled) {
      handleDisabled(true);

      const campusNames = await getCampusNames();

      const info = {};

      const promises = [];

      const updatedCampus = await getCampus(campus.id);

      const updatedLevels = await getLevelList();

      updatedCampus.levels = [];

      updatedLevels.forEach((level) => {
        if (level.campusId === updatedCampus.id) {
          updatedCampus.levels.push(level);
        }
      });

      Object.entries(campusInfo).forEach((v) => {
        if (v[1] != null && !(v[0] === "name" && v[1].trim() === "")) {
          if (v[1] === "") {
            info[v[0]] = null;

            setCampusInfo((prev) => ({ ...prev, [v[0]]: null }));
          } else if (
            !updatedCampus[v[0]] ||
            v[1].trim() !== updatedCampus[v[0]].trim()
          ) {
            info[v[0]] = v[1].trim();
          }
        }
      });

      try {
        levelPhoneInfo.forEach((v, i) => {
          if (
            (v[0] != null &&
              v[0].trim() !==
                (updatedCampus.levels[i].phone1
                  ? updatedCampus.levels[i].phone1.trim()
                  : null)) ||
            (v[1] != null &&
              v[1].trim() !==
                (updatedCampus.levels[i].phone2
                  ? updatedCampus.levels[i].phone2.trim()
                  : null))
          ) {
            promises.push(
              updateLevel({
                id: updatedCampus.levels[i].id,
                phone1: v[0] === "" ? null : v[0],
                phone2: v[1] === "" ? null : v[1]
              })
            );

            if (v[0] === "") {
              setLevelPhone(() => {
                const levels = levelPhoneInfo.map((v) => v);

                levels[i][0] = null;

                return levels;
              });
            }

            if (v[1] === "") {
              setLevelPhone(() => {
                const levels = levelPhoneInfo.map((v) => v);

                levels[i][1] = null;

                return levels;
              });
            }
          }
        });

        await Promise.all(promises);

        if (info.name && campusNames.includes(info.name.toLowerCase())) {
          setErrorMessage(dict("campus/save-button/message/error/name-exists"));
        } else if (Object.keys(info).length > 0) {
          info.id = updatedCampus.id;

          await updateCampus(info);

          if (campusInfo.name !== campusName && campusInfo.name !== "")
            setCampusName(campusInfo.name);

          setErrorMessage(dict("campus/save-button/message/success"));
        } else if (promises.length > 0) {
          setErrorMessage(dict("campus/save-button/message/success"));
        } else {
          setErrorMessage(dict("campus/save-button/message/info/no-changes"));
        }
      } catch (e) {
        setErrorMessage(
          `${dict("campus/save-button/message/api")} ${e.status}.`
        );
      }

      handleDisabled(false);
    }
  };

  React.useEffect(() => {
    if (
      errorMessage === dict("campus/save-button/message/success") ||
      errorMessage === dict("campus/save-button/message/info/no-changes")
    )
      setTimeout(() => setErrorMessage(""), 3000);
  }, [errorMessage]);

  return (
    <div className="school-info-campus-container">
      <div className="school-info-campus-header-container">
        <div className="school-info-campus-header-title-container">
          <span className="school-info-campus-header-title-text">
            {`${
              dict("campus/header-title")[0] &&
              dict("campus/header-title")[0].length > 0
                ? dict("campus/header-title")[0] + " "
                : ""
            }${campusName}${
              dict("campus/header-title")[1] &&
              dict("campus/header-title")[1].length > 0
                ? " " + dict("campus/header-title")[1]
                : ""
            }`}
          </span>
        </div>

        <MinimizeButton
          handleClick={() => setMinimized(!minimized)}
          minimized={minimized}
          style={{ bgcolor: "transparent" }}
        />
      </div>

      {!minimized && (
        <div className="school-info-campus-info-container">
          <div className="school-info-campus-info-form-top-container">
            <div className="school-info-campus-info-form-inputs-container">
              <div className="school-info-campus-info-form-input-container">
                <div className="school-info-campus-info-form-input-title-container">
                  <span className="school-info-campus-info-form-input-title-text">
                    {dict("campus/input/campus")}
                  </span>
                </div>

                <input
                  className="school-info-campus-info-form-input"
                  name="name"
                  onChange={handleInputChange}
                  value={campusInfo.name ?? ""}
                />
              </div>

              <div className="school-info-campus-info-form-input-container">
                <div className="school-info-campus-info-form-input-title-container">
                  <span className="school-info-campus-info-form-input-title-text">
                    {dict("campus/input/address")}
                  </span>
                </div>

                <input
                  className="school-info-campus-info-form-input"
                  name="street"
                  onChange={handleInputChange}
                  value={campusInfo.street ?? ""}
                />
              </div>

              <div className="school-info-campus-info-form-input-container">
                <div className="school-info-campus-info-form-input-title-container">
                  <span className="school-info-campus-info-form-input-title-text">
                    {dict("campus/input/website")}
                  </span>
                </div>

                <input
                  className="school-info-campus-info-form-input"
                  name="website"
                  onChange={handleInputChange}
                  value={campusInfo.website ?? ""}
                />
              </div>
            </div>
          </div>

          <div className="school-info-campus-info-form-divider" />

          <div className="school-info-campus-info-form-phone-container">
            <div className="school-info-campus-info-form-title-container">
              <span className="school-info-campus-info-form-title-text">
                {dict("campus/input/phone")}
              </span>
            </div>

            <div className="school-info-campus-info-form-inputs-container">
              <div className="school-info-campus-info-form-input-container">
                <div className="school-info-campus-info-form-input-title-container">
                  <span className="school-info-campus-info-form-input-title-text">
                    {`${campusName} ${dict("campus/input/phone")} 1`}
                  </span>
                </div>

                <input
                  className="school-info-campus-info-form-input"
                  name="phone1"
                  onChange={handleInputChange}
                  value={campusInfo.phone1 ?? ""}
                />
              </div>

              <div className="school-info-campus-info-form-input-container">
                <div className="school-info-campus-info-form-input-title-container">
                  <span className="school-info-campus-info-form-input-title-text">
                    {`${campusName} ${dict("campus/input/phone")} 2`}
                  </span>
                </div>

                <input
                  className="school-info-campus-info-form-input"
                  name="phone2"
                  onChange={handleInputChange}
                  value={campusInfo.phone2 ?? ""}
                />
              </div>

              <div className="school-info-campus-info-form-input-container">
                <div className="school-info-campus-info-form-input-title-container">
                  <span className="school-info-campus-info-form-input-title-text">
                    {`${campusName} ${dict("campus/input/phone")} 3`}
                  </span>
                </div>

                <input
                  className="school-info-campus-info-form-input"
                  name="phone3"
                  onChange={handleInputChange}
                  value={campusInfo.phone3 ?? ""}
                />
              </div>
            </div>

            {campus.levels.map((v, i) => (
              <div
                className="school-info-campus-info-form-inputs-container"
                key={v.id}
              >
                <div className="school-info-campus-info-form-input-container">
                  <div className="school-info-campus-info-form-input-title-container">
                    <span className="school-info-campus-info-form-input-title-text">
                      {`${v.name} ${dict("campus/input/phone")} 1`}
                    </span>
                  </div>

                  <input
                    className="school-info-campus-info-form-input"
                    index={i}
                    name="0"
                    onChange={handlePhoneLevelInputChange}
                    value={levelPhoneInfo[i][0] ?? ""}
                  />
                </div>

                <div className="school-info-campus-info-form-input-container">
                  <div className="school-info-campus-info-form-input-title-container">
                    <span className="school-info-campus-info-form-input-title-text">
                      {`${v.name} ${dict("campus/input/phone")} 2`}
                    </span>
                  </div>

                  <input
                    className="school-info-campus-info-form-input"
                    index={i}
                    name="1"
                    onChange={handlePhoneLevelInputChange}
                    value={levelPhoneInfo[i][1] ?? ""}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="school-info-campus-info-form-divider" />

          <div className="school-info-campus-info-form-email-container">
            <div className="school-info-campus-info-form-title-container">
              <span className="school-info-campus-info-form-title-text">
                {dict("campus/input/email")}
              </span>
            </div>

            <div className="school-info-campus-info-form-inputs-container">
              <div className="school-info-campus-info-form-input-container">
                <div className="school-info-campus-info-form-input-title-container">
                  <span className="school-info-campus-info-form-input-title-text">
                    {dict("campus/input/email")}
                  </span>
                </div>

                <input
                  className="school-info-campus-info-form-input"
                  name="email"
                  onChange={handleInputChange}
                  value={campusInfo.email ?? ""}
                />
              </div>
            </div>
          </div>

          <div className="school-info-campus-info-form-divider" />

          <div className="school-info-campus-info-form-social-container">
            <div className="school-info-campus-info-form-title-container">
              <span className="school-info-campus-info-form-title-text">
                {dict("campus/input/social-media/title")}
              </span>
            </div>

            <div className="school-info-campus-info-form-inputs-container">
              <div className="school-info-campus-info-form-input-container">
                <div className="school-info-campus-info-form-input-title-container">
                  <span className="school-info-campus-info-form-input-title-text">
                    {dict("campus/input/social-media/facebook")}
                  </span>
                </div>

                <input
                  className="school-info-campus-info-form-input"
                  name="facebook"
                  placeholder="https://www.facebook.com/"
                  onChange={handleInputChange}
                  value={campusInfo.facebook ?? ""}
                />
              </div>

              <div className="school-info-campus-info-form-input-container">
                <div className="school-info-campus-info-form-input-title-container">
                  <span className="school-info-campus-info-form-input-title-text">
                    {dict("campus/input/social-media/twitter")}
                  </span>
                </div>

                <input
                  className="school-info-campus-info-form-input"
                  name="twitter"
                  placeholder="https://www.twitter.com/"
                  onChange={handleInputChange}
                  value={campusInfo.twitter ?? ""}
                />
              </div>
            </div>

            <div className="school-info-campus-info-form-inputs-container">
              <div className="school-info-campus-info-form-input-container">
                <div className="school-info-campus-info-form-input-title-container">
                  <span className="school-info-campus-info-form-input-title-text">
                    {dict("campus/input/social-media/youtube")}
                  </span>
                </div>

                <input
                  className="school-info-campus-info-form-input"
                  name="youtube"
                  placeholder="https://www.youtube.com/"
                  onChange={handleInputChange}
                  value={campusInfo.youtube ?? ""}
                />
              </div>

              <div className="school-info-campus-info-form-input-container">
                <div className="school-info-campus-info-form-input-title-container">
                  <span className="school-info-campus-info-form-input-title-text">
                    {dict("campus/input/social-media/linkedin")}
                  </span>
                </div>

                <input
                  className="school-info-campus-info-form-input"
                  name="linkedin"
                  placeholder="https://www.linkedin.com/"
                  onChange={handleInputChange}
                  value={campusInfo.linkedin ?? ""}
                />
              </div>
            </div>

            <div className="school-info-campus-info-form-inputs-container">
              <div className="school-info-campus-info-form-input-container">
                <div className="school-info-campus-info-form-input-title-container">
                  <span className="school-info-campus-info-form-input-title-text">
                    {dict("campus/input/social-media/instagram")}
                  </span>
                </div>

                <input
                  className="school-info-campus-info-form-input"
                  name="instagram"
                  placeholder="https://www.instagram.com/"
                  onChange={handleInputChange}
                  value={campusInfo.instagram ?? ""}
                />
              </div>
            </div>
          </div>

          <div className="school-info-campus-info-save-container">
            <div className="school-info-campus-info-save-text-container">
              {errorMessage === dict("campus/save-button/message/success") ? (
                <span className="school-info-campus-info-save-success-text">
                  {errorMessage}
                </span>
              ) : errorMessage ===
                dict("campus/save-button/message/info/no-changes") ? (
                <span className="school-info-campus-info-save-text">
                  {errorMessage}
                </span>
              ) : (
                <span className="school-info-campus-info-save-error-text">
                  {errorMessage || "\xa0"}
                </span>
              )}
            </div>

            <Button
              color="grey"
              onClick={handleSaveButtonClick}
              size="medium"
              style={{ marginTop: "8px" }}
              width="100%"
            >
              <span
                className="school-info-campus-info-save-button-text"
                onClick={handleSaveButtonClick}
              >
                {dict("campus/save-button/text")}
              </span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchoolInfoCampus;
