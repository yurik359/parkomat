import "./slots.css";

import SlotItem from "../SlotItem/SlotItem";
import AddParkomat from "../AddParkomat/AddParkomat";
import DeleteModal from "../DeleteModal/DeleteModal";
import QRCodeComponent from "../QRCodeComponent/QRCodeComponent";
import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { addParkomats, addOneMore, changeTypeOfModal } from "./slotsSlice";
import {
  editingParkomat,
  clearForm,
  setDeleteIco,
} from "../AddParkomat/addParkomatSlice";
import { getListItems } from "../../services/requests";


const Slots = () => {

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
  const [showQr,setShowQr] = useState(false)
  
  const getParkomatList = async (accessToken) => {
    
   try {
    const response =await getListItems();
 
    if (
      response &&
      response.data.parkomatList &&
      response.data.parkomatList.parkomatItemsArray >= 1
    ) {
  
      const {
        parkomatList: { parkomatItemsArray },
      } = response.data;
     
      dispatch(addParkomats(parkomatItemsArray));

    } else {
      return;
    }
   } catch (error) {
    console.log(error)
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

      
      const res = await getListItems()
      console.log(res)
      if (res && res.data.parkomatList) {
        const filteredArray = filterSearch(
          searchTerm,
          res.data.parkomatList.parkomatItemsArray
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
    console.log(editingParkomatItem[0])
    dispatch(editingParkomat(editingParkomatItem[0]));

    dispatch(setDeleteIco(true));
    setCloseModal(false);
  };
  useEffect(() => {
    console.log("4isas1");
    getParkomatList(accessToken);
  }, []);

  const handleOpenAddModal = () => {
    dispatch(clearForm());
    dispatch(changeTypeOfModal("create"));
    setCloseModal(false);
   
    dispatch(setDeleteIco(false));
  };
  
  //qr-code
  const qrCodeGenetating = () => {
    if (indexOfParkomat == null) return;
    setShowQr(true)
  }

  useEffect(() => {
    
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        setShowQr(false);
      }
    });
  }, []);
  
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
            <div className="slots__qr-btn slot-btn"
            onClick={qrCodeGenetating}
            >
             Get <span >Qr-code</span>
            </div>
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
       < QRCodeComponent showQr={showQr} setShowQr={setShowQr} data={`http://localhost:19006/?parkomatId=${indexOfParkomat}`}/>
      </div>
    </div>
  );
};

export default Slots;
