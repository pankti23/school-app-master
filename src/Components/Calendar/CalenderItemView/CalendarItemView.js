import React, {useRef, useLayoutEffect, useState, useContext} from "react";
import './CalendarItemView.css';

import {getDivisionsList} from "../../../services/schoolInfoService";

import Dialog from "../../UI/Modal/Dialog";

import LoadingSpinner from "../../UI/LoadingSpinner"

import { UserContext } from "../../../Contexts/UserContext";

import {
  prepareFiles,
  getVisibilityLabel,
  convertToTime, getItemDescription,
} from "../../../utils";

import { getLocale, useDict } from "../../UI/Translations"

import 'moment/locale/es'

import dompurify from 'dompurify';

const moment = require('moment');

moment.locale(getLocale())

// const offset = (new Date()).getTimezoneOffset();

const getItemStyles = (color) => ({backgroundColor: color});

const CalendarItemView = ({item, onClose, onDelete, onEdit}) => {
  const sanitizer = dompurify.sanitize;

  const buttonRef = useRef(null);

  const [openDialog, setOpenDialog] = useState(false);

  const [fileList, setFileList] = useState([]);
  const [divisions, setDivisions] = useState(null);

  const [loading, setLoading] = useState(true);

  const userState = useContext(UserContext);

  const dict = useDict("/calendar")

  if (item.startDate < item.date) {
    item.startDate = item.date;
    if (item.endDate) {
      item.endDate = item.date;
    }
  }


  useLayoutEffect(() => {
    setLoading(true);
    const list = prepareFiles(item.files);
    setFileList(list);

    async function getData() {
      const divisions = await getDivisionsList();
      // console.log(divisions);
      setDivisions(divisions);
      setLoading(false);
      if (buttonRef.current) {
        buttonRef.current.focus();
      }
    }

    try {
      getData();
    } catch (e) {
      console.log(e);
    }

  }, []);


// Dialog Actions
  const toggleDialog = () => {
    setOpenDialog(!openDialog);
  };

  const onDeleteItem = async (e, deleteAllDates = false) => {
    e.preventDefault();
    e.stopPropagation();
    await onDelete(item.id, item.date, deleteAllDates);
    toggleDialog();
    onClose();
  };
// End Dialog Actions

  if (loading || !divisions) {
    return <LoadingSpinner />;
  }

  let itemDescriptionHTML = '';
  /** @type { string[] } */
  const descriptionElements = item.description.split(' ');
  let curID = 0;

  const linkIndicators = [
    'www.',
    'http://',
    'https://',
    '.com',
    '.net',
    '.org',
  ];

  let lastWasLink = false;
  descriptionElements.forEach((element) => {
    let foundLink = false;

    const getLink = (uri) => {
      let https = false;

      uri = uri.trim();
      // If link was https, keep it otherwise keep http
      if (uri.startsWith('https')) {
        uri = uri.replace('https', '');
        https = true;
      }
      if (uri.startsWith('http')) uri = uri.replace('http', '');

      // We use three separate statements in case uri is improperly formatted
      // eg. 'https//facebook.com' as was the case in gitlab issue
      if (uri.startsWith(':')) uri = uri.replace(':', '');
      if (uri.startsWith('/')) uri = uri.replace('/', '');
      if (uri.startsWith('/')) uri = uri.replace('/', '');

      // Finally, prepend http/https accordingly
      uri = `http${https ? 's' : ''}://${uri}`;

      return uri;
    };

    for (let i = 0; i < linkIndicators.length; ++i) {
      if (element.includes(linkIndicators[i])) {
        foundLink = true;
        lastWasLink = true;
        itemDescriptionHTML += `<a
            href="${getLink(element)}"
            style="color: 'blue'; textDecorationLine: 'underline';"
            target="_blank">
            ${element}
          </a>`;
        break;
      }
    }

    if (!foundLink) {
      itemDescriptionHTML += `${lastWasLink ? ' ' : ''}${element} `;
      lastWasLink = false;
    }
  });

  return (
    <div className="view-form-container">
      <header className="view-form-header">
        <h3>{item.subject}</h3>
        <button
          id="hidden-button-to-focus"
          style={{width: 0, height: 0, opacity: 0, margin: 0, border: 'none', padding: 0}}
          ref={buttonRef}
        >
        </button>
        {
          (item.id && (userState.id === item.createdBy.user.id || userState.roleId === 2)) && <div>
            <button
              className="view-form-button" type="button"
              onClick={() => toggleDialog()}
              title="Delete this Item"
            >
              {dict("calendar/view-modal/button/delete")}
            </button>
            <button
              className="view-form-button" type="button"
              onClick={() => {
                onClose();
                onEdit();
              }}
              title="Edit this Item"
            >
              {dict("calendar/view-modal/button/edit")}
            </button>
          </div>
        }
      </header>
      <div className="view-form-content">
        <div className="view-form-main-content">

          <div className="view-form-row">
            <div className="view-form-field view-form-rectangle">
              <label className="view-form-label">{dict("calendar/view-modal/rectangle/calendar-item")}</label>
              <div className="view-form-input">
                <span className="view-form-circle" style={getItemStyles(item.ItemType.color)}>{''}</span>
                {item.ItemType.name}
              </div>
            </div>
            <div className="view-form-field view-form-rectangle">
              <label className="view-form-label">{dict("calendar/view-modal/rectangle/visible/label")}</label>
              <div className="view-form-input">
                <span className="view-form-bold">{dict("calendar/view-modal/rectangle/visible/all")}</span> {getVisibilityLabel(item.visibleTo, divisions)}
              </div>
            </div>
          </div>

          <div className="view-form-row">
            <div className="view-form-field view-form-rectangle">
              <label className="view-form-label">{dict("calendar/view-modal/rectangle/date-time")}</label>
              <div className="view-form-input">
                {moment(item.startDate).format("dddd Do of MMMM, YYYY")} {convertToTime(item.startTime)} {item.endTime ? ' - ' + convertToTime(item.endTime) : ''}
              </div>
            </div>
            <div className="view-form-field view-form-rectangle">
              <label className="view-form-label">{dict("calendar/view-modal/rectangle/location")}</label>
              <div className="view-form-input">
                {item.location}
              </div>
            </div>
          </div>

          <div className="view-form-row">
            <div className="view-form-field">
              <label className="view-form-label">{dict("calendar/view-modal/description")}</label>
              <p className="view-form-input" style={{maxWidth: '98%'}} dangerouslySetInnerHTML={{__html: sanitizer(itemDescriptionHTML)}}>
              </p>
            </div>
          </div>
          <div className="view-form-field">
            <label className="view-form-label">{dict("calendar/view-modal/attachment/label")}</label>
            {
              !fileList.length && <div className="view-form-input">
                {dict("calendar/view-modal/attachment/none")}
              </div>
            }
            {
              fileList.map((file, i) =>
                (<label
                  key={i} className="view-form-filename">
                  <a href={file.url} target="_blank">{file.name}</a>
                </label>))
            }
          </div>
          {
            parseInt(item.typeId, 10) === 5 &&
            <div className="view-form-field">
              <label className="view-form-label">{dict("calendar/view-modal/students")}</label>
              {
                (item.students || []).map((s, i) =>
                  (<label
                    key={s.name + s.id + i}
                    className="view-form-filename"
                    style={{cursor: 'text'}}
                  >
                    {s.name}
                  </label>))
              }
            </div>
          }

          <div className="view-form-row">
            <div className="view-form-field">
              <label className="view-form-label">{dict("calendar/view-modal/creator")}</label>
              <div className="view-form-input">
                {item.createdBy.user.name}
              </div>
            </div>
          </div>

        </div>
      </div>
      <Dialog
        header={dict("calendar/view-modal/delete-confirmation")}
        labelPrimary={dict("calendar/view-modal/button/delete")}
        labelSecondary={dict("calendar/view-modal/button/cancel")}
        open={openDialog}
        onClose={toggleDialog}
        repeats={item.repeats}
        closeOnOverlayClick={false}
        onClickPrimary={onDeleteItem}
      />
    </div>
  );
};


export default CalendarItemView;
