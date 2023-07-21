import "./slots.css";

import SlotItem from "../SlotItem/SlotItem";
import AddParkomat from "../AddParkomat/AddParkomat";
import DeleteModal from "../DeleteModal/DeleteModal";

import { useEffect, useState } from "react";
import { handleGET, useHandlePOST } from "../../services/requests";
import { useDispatch, useSelector } from "react-redux";
import { addParkomats, addOneMore, changeTypeOfModal } from "./slotsSlice";
import {
  editingParkomat,
  clearForm,
  setDeleteIco,
} from "../AddParkomat/addParkomatSlice";
import { getListAPI } from "../../services/requests";

const Slots = () => {
  const handlePOST = useHandlePOST();
  const [closeModal, setCloseModal] = useState(true);
  const [closeDeleteModal, setCloseDeleteModal] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken")
  );
  const dispatch = useDispatch();
  const { parkomatArray } = useSelector((state) => state.slotsSlice);
  const { indexOfParkomat, typeOfmodal } = useSelector(
    (state) => state.slotItemSlice
  );
  console.log(parkomatArray)
  const getParkomatList = async (accessToken) => {

    const response = await handlePOST(getListAPI, {
      accessToken,
    });
    console.log(response)
    if (
      response &&
      response.parkomatList &&
      response.parkomatList.parkomatItemsArray >= 1
    ) {
      const {
        parkomatList: { parkomatItemsArray },
      } = response;
      dispatch(addParkomats(parkomatItemsArray));
    } else {
      return;
    }
  };

  const filterSearch = (searchTerm, searchArr) => {
    if (!searchArr) return;

    return searchArr.filter((e) => {
      return e.nameOfslot.toLowerCase().includes(searchTerm.toLowerCase());
    });
  };

  useEffect(() => {
    const debounce = setTimeout(async () => {
      const accessToken = localStorage.getItem("accessToken");

      const res = await handlePOST(getListAPI, {
        accessToken,
      });
      if (res && res.parkomatList) {
        const filteredArray = filterSearch(
          searchTerm,
          res.parkomatList.parkomatItemsArray
        );
        dispatch(addParkomats(filteredArray));
      }

      
    }, 300);
    return () => clearTimeout(debounce);
  }, [searchTerm]);

  const addOneMoreParkomat = (e) => {
    dispatch(addOneMore(e));

  };

  const handleDeleteBtn = () => {
    if (indexOfParkomat == null) return;
    setCloseDeleteModal(false);
  };
  const handleOpenEdit = () => {
    if (indexOfParkomat == null) return;
    dispatch(changeTypeOfModal("update"));

    const editingParkomatItem = parkomatArray.filter((e) => {
      return e.uid == indexOfParkomat;
    });
    dispatch(editingParkomat(editingParkomatItem[0]));

    dispatch(setDeleteIco(true));
    setCloseModal(false);
  };
  useEffect(() => {
    console.log("4isas1");
    getParkomatList(accessToken);
  }, []);

  const handleOpenAddModal = () => {
    dispatch(changeTypeOfModal("create"));
    setCloseModal(false);
    dispatch(clearForm());
    dispatch(setDeleteIco(false));
  };
  return (
    <div className="slots__background">
      <div className="slots wrapper">
        <div className="slots__upper-container">
          <input
            type="text"
            value={searchTerm}
            placeholder="Search"
        
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="slots__btns">
            <div
              className="slots__edit-btn slot-btn"
              onClick={handleOpenEdit}
            ></div>
            <div
              className="slots__delete-btn slot-btn"
              onClick={handleDeleteBtn}
            ></div>
          </div>
        </div>
        <div className="slots__down-container ">
          {parkomatArray &&
            parkomatArray.map((e, i) => {
              return <SlotItem key={i} slotInfo={e} index={i} />;
            })}
          <div className="slots__add-item" onClick={handleOpenAddModal}>
            <div className="slots__title">
              <div className="slots__plus">&#43;</div>
              <div className="slots__add-text">Add new</div>
            </div>
          </div>
        </div>
        <AddParkomat
          closeModal={closeModal}
          setCloseModal={setCloseModal}
          addOneMoreParkomat={addOneMoreParkomat}
        />
        <DeleteModal
          closeDeleteModal={closeDeleteModal}
          setCloseDeleteModal={setCloseDeleteModal}
        />
      </div>
    </div>
  );
};

export default Slots;
