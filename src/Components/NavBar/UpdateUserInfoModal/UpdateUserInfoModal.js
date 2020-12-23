import React, { useState, useEffect, useContext, useRef } from "react";
import { UserContext } from "../../../Contexts/UserContext";
import { FaTrash } from "react-icons/fa";
import "./UpdateUserInfoModal.css";
import { FaUserCircle } from "react-icons/fa";

import useOutsideClick from "../../../CustomHooks/useOutsideClick";

import Axios from "axios";

import { useDict } from "../../UI/Translations";

import { isUserLoggedIn } from "../../../services/authService";
import ImageCropModal from "./ImageCropModal/ImageCropModal";
import { getRotatedImage } from "./ImageCropModal/rotateImage";

const baseUrl = process.env.REACT_APP_BASE_URL;

function readFile(file) {
  return new Promise(resolve => {
    const reader = new FileReader()
    reader.addEventListener('load', () => resolve(reader.result), false)
    reader.readAsDataURL(file)
  })
}

const UpdateUserInfoModal = (props) => {
  const [photo, setPhoto] = useState(null);
  const [image, setImage] = useState(null);
  const [deleted, setIsDeleted] = useState(false);
  const [cropModal, setCropModalState] = useState(false);
  const [cropped, setCropped] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const userState = useContext(UserContext);

  const ref = React.useRef(null);

  const dict = useDict("/navbar");

  useEffect(() => {
    if(userState && userState.photo) {
      setImage(userState.photo);
    }
  }, [userState]);

  useEffect(() => {
    setName(userState.name);
    setEmail(userState.email);
  }, []);

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    let imageDataUrl = await readFile(file);

    imageDataUrl = await getRotatedImage(imageDataUrl);
    setPhoto(imageDataUrl);
    setCropModalState(true);
  };

  async function authenticate() {
    const user = await isUserLoggedIn();
    if (!user) {
      userState.logout();
    } else {
      userState.login(user);
    }
  }

  const handleUserInfoUpdate = async (event) => {
    props.setIsLoading(true);
    event.preventDefault ? event.preventDefault() : (event.returnValue = false);
    const userId = userState.id;
    const formData = new FormData();
    formData.append("photo", photo);
    const photoConfig = {
      method: "put",
      url: `${baseUrl}/users/photo/${userId}`,
      data: formData,
      headers: {
        Authorization: userState.jwt,
        "Content-Type": "application/json"
      }
    };
    const textConfig = {
      method: "put",
      url: `${baseUrl}/users/${userId}`,
      data: { name: name, email: email },
      headers: {
        Authorization: userState.jwt,
        "Content-Type": "application/json"
      }
    };
    try {
      if (photo) {
        const photoUpload = await Axios(photoConfig);
        userState.updatePhoto(photoUpload.data.photo);
      }

      if(deleted && image === null){
        const updateUserConfig = {
          method: 'PUT',
          url: `${baseUrl}/users/${userId}`,
          data: {
            photo: null
          },
          headers: {
            Authorization: userState.jwt,
            "Content-Type": "application/json"
          }
        };
        await Axios(updateUserConfig);
      }
      const textUpload = await Axios(textConfig);
      setErrorMessage("");
      authenticate();
      props.closeModal();
      props.setIsLoading(false);
      setTimeout(() => {
        props.setSuccess(true);
      }, 100)
    } catch (err) {
      setErrorMessage(err.toString());
      props.setIsLoading(false);
      console.error(err);
    }
  };

  useOutsideClick(props.closeModal, ref);

  return (
    <div>
      {cropModal ? 
      (<ImageCropModal 
        image={photo} 
        close={setCropModalState}
        setCroppedPhoto={setPhoto}
        setCropped={setCropped}
      />) : (
      <div className="user-info-modal-wrapper">
        <form
          className="user-info-modal-container"
          onSubmit={handleUserInfoUpdate}
          ref={ref}
        >
          <h1 className="user-info-modal-heading">
            {dict("profile-modal/title")}
          </h1>
          <div className="user-info-modal-gray-bar"></div>
          <p style={{ color: "red" }}>{errorMessage}</p>
          <div className="user-info-photo-upload-container">
            <div className={`${(photo || image) ? 'user-profile-image' : ''}`}>
              {photo ? (
                <img
                  className="preview-image-user-photo"
                  alt="profile-img"
                  src={cropped ? URL.createObjectURL(photo) : photo}
                />
              ) : image ? (
                <img
                  className="preview-image-user-photo"
                  alt="profile-img"
                  src={image}
                />
              ) : (
                <FaUserCircle className="modal-user-image" />
              )}
            </div>
            <div className="input-actions-wrapper">
              <div
                className="input-file-container"
                style={{ marginLeft: "10px" }}
              >
                <input
                  className="input-file input-user-file-selection"
                  id="my-file"
                  type="file"
                  onChange={(event) => {
                    if(cropped){
                      setCropped(false);
                    }
                    handlePhotoUpload(event);
                  }}
                />
                <label
                  tabIndex="0"
                  htmlFor="my-file"
                  className="input-file-trigger"
                >
                  {dict("profile-modal/button/file-select")}
                </label>
              </div>
              <span onClick={async () => {
                setPhoto(null);
                if(userState && userState.photo) {
                  setIsDeleted(true);
                  setImage(null);
                }
              }}>
                <FaTrash className="user-info-trash-icon" />
              </span>
            </div>
          </div>
          <div className="user-info-input-container">
            <div className="login-input-wrapper">
              <p
                className="user-info-input-title"
                style={errorMessage ? { color: "red" } : null}
              >
                {dict("profile-modal/input/full-name")}
              </p>
              <input
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder="John Doe"
                defaultValue={name}
                className="login-input"
                style={errorMessage ? { borderColor: "red" } : null}
              />
            </div>
            <div className="login-input-wrapper">
              <p
                className="user-info-input-title"
                style={errorMessage ? { color: "red" } : null}
              >
                {dict("profile-modal/input/email")}
              </p>
              <input
                onChange={(e) => setEmail(e.target.value)}
                type="text"
                placeholder="your@email.com"
                defaultValue={email}
                className="login-input"
                style={errorMessage ? { borderColor: "red" } : null}
              />
            </div>
          </div>
          <div className="user-info-modal-gray-bar"></div>
          <div className="user-info-button-container">
            <div className="user-info-button-wrapper">
              <button className="cancelButton" onClick={props.closeModal}>
                {dict("profile-modal/button/cancel")}
              </button>
              <button
                className="createButton"
                onClick={(event) => handleUserInfoUpdate(event)}
              >
                {dict("profile-modal/button/save")}
              </button>
            </div>
          </div>
        </form>
      </div>)}
    </div>
  );
};

export default UpdateUserInfoModal;
