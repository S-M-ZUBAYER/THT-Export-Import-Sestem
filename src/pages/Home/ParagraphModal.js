import React, { useState } from "react";
import Modal from "react-modal";

const ParagraphModal = ({ text }) => {
  const [showModal, setShowModal] = useState(false);
  const [content, setContent] = useState(
    text.split(" ").slice(0, 15).join(" ")
  );
  const handleSeeMore = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
  return (
    <div className="">
      <p className="text-sm leading-7 my-3 font-light opacity-80">
        {content}
        {text.split(" ").length > 15 && (
          <button
            onClick={handleSeeMore}
            className="text-blue-500 hover:underline cursor-pointer">
            See More
          </button>
        )}
      </p>
      <Modal
        isOpen={showModal}
        onRequestClose={handleCloseModal}
        contentLabel="Full Text Modal">
        <p className="text-sm leading-7 font-light opacity-80">{text}</p>
        <button
          onClick={handleCloseModal}
          className="text-blue-500 hover:underline cursor-pointer mt-3">
          Close
        </button>
      </Modal>
    </div>
  );
};

export default ParagraphModal;
