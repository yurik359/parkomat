import "./addParkomat.css";
import { useState, useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";
import {
  changeNameOfslotValue,
  changeLocationValue,
  changePaymentValue,
  changePicValue,
  changeNotesValue,
  setDeleteIco,
  changeCoordinate,
  changePaymentSecretKey,
  changeMerchantId
} from "./addParkomatSlice";
import { updateParkomat } from "../Slots/slotsSlice";
import cheerio from 'cheerio';
import Map from "../map/map";
import deleteIco from "../../services/img/DeleteButton.png";
import axios from 'axios';
import { createParkomat,editParkomat,getPlaceId,getAddresses} from "../../services/requests";
import { v4 as uuidv4 } from "uuid";
import { baseUrl } from "../../services/requests";
const AddParkomat = ({ closeModal, setCloseModal, addOneMoreParkomat }) => {
  const uniqueId = uuidv4();

  const [addressSuggestion, setAddressSuggestion] = useState(null);
  const [checkedAddress, setCheckedAddress] = useState({
    lat: 50.456561,
    lon: 30.501512,
  });
  const [closeAddressesList, setCloseAddressesList] = useState(false);
  const [onFocusInput, setOnFocusInput] = useState(false);
  const [secretKey,setSecretKey] = useState('')
  const { typeOfmodal } = useSelector((state) => state.slotsSlice);
  const { formValues, deleteIcon } = useSelector(
    (state) => state.addParkomatSlice
  );
  const { indexOfParkomat } = useSelector((state) => state.slotItemSlice);
  const { accessToken } = useSelector((state) => state.mainSlice);
  const dispatch = useDispatch();

  const addModalAPI = 'http://localhost:4001/'+`${
    typeOfmodal == "update" ? "updateParkomat" : "addParkomat"
  }`;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
    
        dispatch(changePicValue(reader.result));
        dispatch(setDeleteIco(true));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGeoCode = async () => {
 try {
  const res = await getAddresses(formValues.locationValue.address)
 if (res&&res.data.predictions&&res.data.predictions.length>0) {
  
  setAddressSuggestion(res.data.predictions);
 }
 } catch (error) {
  console.log(error)
 }
 
    
  };

  useEffect(() => {
    const geoTimeOut = setTimeout(()=>{
      if (onFocusInput) {
        console.log('hop')
        setCloseAddressesList(false);
        handleGeoCode();
      }
    },500)
    
    return () => clearTimeout(geoTimeOut);
  }, [formValues.locationValue.address]);

  const handleSubmit = async (e) => {
    e.preventDefault();
try {
  // const nameOfslot = formValues.nameOfslotValue;
  // const location = {
  //   address: formValues.locationValue.address,
  //   coordinate: formValues.locationValue.coordinate,
  // };
  // const payment = formValues.paymentValue;

  // const formPic = formValues.picValue;

  // const notes = formValues.notesValue;

 
  // const res = await createParkomat({nameOfslot,
  //   location,
  //   payment,
  //   formPic,
  //   notes,
  //   uniqueId,})
  console.log({formValues})
  const res = await createParkomat({formValues,uniqueId})
if(res&&res.data) {
addOneMoreParkomat(res.data.lastObject)
} 
 

  setCloseModal(true);
} catch (error) {
  console.log(error)
}
   
  };

  const handleEditParkomat = async (e) => {
    e.preventDefault();

 try {
  const res = await editParkomat({
    formValues,
  indexOfParkomat,
  })
  if (res&&res.data.updatedParkomat) {
    dispatch(updateParkomat({ indexOfParkomat, updatedParkomat:res.data.updatedParkomat }));
  }
  
  setCloseModal(true);
 } catch (error) {
  console.log(error)
 }
   
  };

 

  useEffect(() => {
    
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        setCloseModal(true);
      }
    });
  }, []);

  const handleGetCoordinate =async (e) => {
    try {
      const res = await getPlaceId(e.place_id)
  
      if(res&&res.status=='200') {
  
        const $ = cheerio.load(res.data.result.adr_address);
        
           const street= $('.street-address').text().length>1?$('.street-address').text()+',':''
         const  locality= $('.locality').text().length>1?$('.locality').text()+',':''
           const region =$('.region').text().length>1?$('.region').text()+',':''
  
  const lat = res.data.result.geometry.location.lat
  const lon = res.data.result.geometry.location.lng
      
      dispatch(changeLocationValue(`${street} ${locality} ${region} ${lat}, ${lon}`));
      dispatch(changeCoordinate({ lat, lon}));
      }
     
     
      setCloseAddressesList(true);
    } catch (error) {
      console.log(error)
    }
   
   
  };

  const handleDeleteIcon = () => {
    dispatch(setDeleteIco(false));
    dispatch(changePicValue(null));
  };

  const changeSelect = (e) => {
   
dispatch(changePaymentValue(e.target.value))
//  if(formValues.paymentValue==='fondy'){
// setShowSecretKeyInput(true);
// }
  }
  return (
    <div
      className="add-parkomat parkomat-modal"
      style={{ display: closeModal ? "none" : "flex" }}
    >
      <form
        className="add-parkomat__form"
        onSubmit={typeOfmodal == "update" ? handleEditParkomat : handleSubmit}
      >
        <div
          className="add-parkomat__close"
          onClick={() => setCloseModal(true)}
        >
          Close
        </div>
        <div className="add-parkomat__title">Add New</div>
        <input
          className="add-parkomat__name-input"
          value={formValues.nameOfslotValue}
          onChange={(e) => dispatch(changeNameOfslotValue(e.target.value))}
          type="text"
          required
          placeholder="Name of the slots"
        />
        <div className="add-parkoma__location-section">
          <input
            type="text"
            value={formValues.locationValue.address}
            onFocus={() => setOnFocusInput(true)}
            onBlur={() => setOnFocusInput(false)}
            placeholder="Location"
            required
            onChange={(e) => dispatch(changeLocationValue(e.target.value))}
          />
          <div
            className="add-parkomat__address-list"
            style={{ display: closeAddressesList ? "none" : "block" }}
          >
            {addressSuggestion &&
              addressSuggestion.map((e, i) => {
                return (
                  <div
                    key={i}
                    className="add-parkomat__list-item"
                    onClick={() => handleGetCoordinate(e)}
                  >
                    {e.description}
                  </div>
                );
              })}
          </div>
          <div className="" style={{width:'90%'}}>
          <Map checkedAddress={checkedAddress} />
          </div>
        </div>
        
        <select
          value={formValues.paymentValue.namePayment}
          onChange={changeSelect}
        >
          <option value="...">Payment System</option>
          <option value="fondy">fondy</option>
          <option value="privat24">privat 24</option>
          <option value="card">card</option>
        </select>
        <div className="inputs-container" style={{display:formValues.paymentValue.namePayment==='fondy'?'block':'none'}} >
          <input type="text" placeholder="enter merchant_id"
          value={formValues.paymentValue.merchantId}
          onChange={(e)=>dispatch(changeMerchantId(e.target.value))}
          />
        <input type="text" placeholder="enter secret key"  
        value={formValues.paymentValue.secretKey} onChange={(e)=>dispatch(changePaymentSecretKey(e.target.value))} 
        className="secret-key-input" />
        </div>  
        <label class="file-upload">
          <input type="file" class="file-input" onChange={handleImageChange} />
          <span class="file-label">Upload File</span>
        </label>

        <div
          className="add-parkomat__ico"
          style={{ display: deleteIcon ? "block" : "none" ,display:formValues.picValue?'block':'none'}}
        >
          <img
            src={formValues.picValue}
            alt=""
            style={{ width: "120px", height: "70px" }}
          />
          <img src={deleteIco} alt="" onClick={handleDeleteIcon} />
        </div>

        <textarea
          value={formValues.notesValue}
          onChange={(e) => dispatch(changeNotesValue(e.target.value))}
          name=""
          id=""
          cols="30"
          rows="10"
          placeholder="Notes"
        ></textarea>
        <button> {typeOfmodal}</button>
      </form>

      <div></div>
    </div>
  );
};

export default AddParkomat;
