import { useEffect, useState } from "react";
import "./deleteModal.css";
import { useDispatch, useSelector } from "react-redux";
import { deleteParkomat } from "../Slots/slotsSlice";
import Map from "../map/map";

import {
  addIndexParkomat,
  changeClickedParkomat,
} from "../SlotItem/slotItemSlice";
import { deleteParkomatItem } from "../../services/requests";
import { useTranslation } from "../../services/translations";
const DeleteModal = ({ closeDeleteModal, setCloseDeleteModal }) => {
  const { language  } = useSelector(
    (state) => state.slotsSlice
  );
  const {t}= useTranslation(language)
  const dispatch = useDispatch();
  const { indexOfParkomat } = useSelector((state) => state.slotItemSlice);

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
        <div className="modal-question">{t('deleteText')}</div>
        <div className="modal-btns">
          <div className="modal-yes" onClick={handleDeleteItem}>
          {t('yes')}
          </div>
          <div className="modal-no" onClick={handleClearIndex}>
          {t('no')}
          </div>
        </div>
      </div>
 
    </div>
  );
};

export default DeleteModal;
