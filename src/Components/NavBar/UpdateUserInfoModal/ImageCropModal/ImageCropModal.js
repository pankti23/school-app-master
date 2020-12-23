import React, { useState, useEffect } from "react";
import Cropper from 'react-easy-crop';
import './ImageCropModal.css';
import '../UpdateUserInfoModal.css';

import getCroppedImg from "./cropImage";

const ImageCropModal = (props) => {
	const [crop, setCrop]= useState({
		x: 0, y: 0 
	});
	const [zoomLevel, setZoomLevel]= useState(1);
	const [aspect, setAspect]= useState(4/3);

	const [image, setImage] = useState(null);
	const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

	useEffect(() => {
		if(props.image){
			setImage(props.image);
		}
	},[props.image]);

	const onCropChange = crop => {
    setCrop(crop)
	};
	
	const onCropComplete = (croppedArea, croppedAreaPixels) => {
    console.log(croppedArea, croppedAreaPixels)
    setCroppedAreaPixels(croppedAreaPixels)
	};
	
	const onZoomChange = (event, isFromCrop = false) => {
		if(isFromCrop){
			setZoomLevel(event);
		} else {
			setZoomLevel(event.target.value);
		}
	}
	
	const croppedPhoto = async () => {
		try {
			const croppedImage = await getCroppedImg(image,croppedAreaPixels);
			props.setCroppedPhoto(croppedImage);
			props.setCropped(true)
			props.close(false);
		} catch (error) {
			console.error(error)
		}
	}
    
	return (
		<div className="user-info-modal-wrapper crop-modal">
			<div className="user-info-modal-container">
				<div className="crop-container">
					<Cropper
							image={image}
							crop={crop}
							zoom={zoomLevel}
							aspect={aspect}
							// cropShape="round"
							// showGrid={false}
							onCropChange={onCropChange}
							onCropComplete={onCropComplete}
							onZoomChange={(zoom) => onZoomChange(zoom, true)}
					/>
				</div>
				<div className="input-action-scroll">
					<input type="range" min="1" max="3" value={zoomLevel} aria-labelledby="Zoom" step={0.1} onChange={(e) => onZoomChange(e)}/>
				</div>
				<div className="user-info-button-container">
					<div className="user-info-button-wrapper">
						<button className="cancelButton" onClick={() => { props.close(false); props.setCroppedPhoto(null); }}>
							Cancel
						</button>
						<button
							className="createButton"
							onClick={() => croppedPhoto()}
						>
							Save
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ImageCropModal;
