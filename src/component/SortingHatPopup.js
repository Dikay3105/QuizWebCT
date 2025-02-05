import React from "react";
import Modal from "react-modal";
import "./SortingHatPopup.scss"; // File CSS riêng để tạo hiệu ứng

const SortingHatPopup = ({ isOpen, onClose, resultMessage }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="sorting-hat-modal"
            overlayClassName="sorting-hat-overlay"
            ariaHideApp={false}
        >
            <div className="popup-content">
                <img
                    src={`${process.env.PUBLIC_URL}/hat.png`}
                    alt="Sorting Hat"
                    className="sorting-hat-image"
                />
                <p className="sorting-text">{resultMessage}</p>
                <button className="close-button" onClick={onClose}>
                    Đóng
                </button>
            </div>
        </Modal>
    );
};

export default SortingHatPopup;
