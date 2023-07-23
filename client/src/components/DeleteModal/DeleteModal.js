import { useEffect, useState } from "react";
import "./deleteModal.css";
import { useDispatch, useSelector } from "react-redux";
import { deleteParkomat } from "../Slots/slotsSlice";


import {
  addIndexParkomat,
  changeClickedParkomat,
} from "../SlotItem/slotItemSlice";
import { deleteParkomatItem } from "../../services/requests";
const DeleteModal = ({ closeDeleteModal, setCloseDeleteModal }) => {

  const dispatch = useDispatch();
  const { indexOfParkomat } = useSelector((state) => state.slotItemSlice);
  useEffect(() => console.log(indexOfParkomat), [indexOfParkomat]);
  useEffect(() => {
   
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        setCloseDeleteModal(true);
      }
    });
  }, []);

  const handleDeleteItem = async () => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      const res=await deleteParkomatItem({  indexOfParkomat })
    
   
    if (res&&res.data.status === "deleted") {
      dispatch(deleteParkomat(indexOfParkomat));
      dispatch(addIndexParkomat(null));
      setCloseDeleteModal(true);
    }
    } catch (error) {
      console.log(error)
    }
    
  };

  const handleClearIndex = () => {
    setCloseDeleteModal(true);
    dispatch(addIndexParkomat(null));
    dispatch(changeClickedParkomat(false));
  };
  return (
    <div
      className="modal-background add-parkomat"
      style={{ display: closeDeleteModal ? "none" : "flex" }}
    >
      <div className="modal-window">
        <div className="modal-question">Are you sure?</div>
        <div className="modal-btns">
          <div className="modal-yes" onClick={handleDeleteItem}>
            Yes
          </div>
          <div className="modal-no" onClick={handleClearIndex}>
            No
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
