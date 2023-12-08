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
  changeMerchantId,
  changeIsSupportedByCarNumber
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
 
  const { typeOfmodal,paymentsInfo } = useSelector((state) => state.slotsSlice);
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
  const res = await getAddresses(formValues.address)
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
  }, [formValues.address]);
const [isNamePayment,setIsNamePayment] = useState(false)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(formValues.paymentValue.namePayment===''||formValues.paymentValue.namePayment==='...') return setIsNamePayment(true)
try {

  
  const res = await createParkomat({formValues})

if(res&&res.data) {
addOneMoreParkomat(res.data)
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
  if (res&&res.data) {
    dispatch(updateParkomat({ indexOfParkomat, updatedParkomat:res.data }));
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

  const [isPaymentsInfo,setIsPaymentsInfo] = useState(false)
  const changeSelect = (e) => {
   setIsNamePayment(false)
dispatch(changePaymentValue(e.target.value))
if(e.target.value==='fondy') {
  dispatch(changePaymentSecretKey(paymentsInfo.fondy.secretKey))
  dispatch(changeMerchantId(paymentsInfo.fondy.merchantId))
} 


  }
  useEffect(()=>{
    if(paymentsInfo&&
      paymentsInfo.fondy&&paymentsInfo.fondy.merchantId&&
      paymentsInfo.fondy.secretKey
      ){

       setIsPaymentsInfo(true) 
     
     }else {
      setIsPaymentsInfo(false)
     }
  },[paymentsInfo])
  useEffect(()=>{console.log(formValues.isSupportedByCarNumber)},[formValues.isSupportedByCarNumber])
  return (
    
    <div
      className="add-parkomat parkomat-modal"
      onClick={()=>setCloseModal(true)}
      style={{ display: closeModal ? "none" : "flex" }}
    >
      <form
        className="add-parkomat__form"
        onSubmit={typeOfmodal == "update" ? handleEditParkomat : handleSubmit}
        onClick={e => e.stopPropagation()}
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
            value={formValues.address}
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
      {!closeModal&&<div className="" style={{width:'90%'}}>
                <Map checkedAddress={checkedAddress} />
          </div>}    
        </div>
        
        <select
          value={formValues.paymentValue.namePayment}
          onChange={changeSelect}
          
        >
          <option value="..." >Payment System</option>
          <option value="fondy"style={{display:isPaymentsInfo?'block':'none'}}>fondy</option>
          <option value="privat24">privat 24</option>
          <option value="card">card</option>
        </select>
        {isNamePayment&&<span>Choose payment method firstly</span>}
        <div className="typeByPayment" style={{display:'flex',alignItems:'center',margin:'10px 0 10px 0',width:'62%'}}>
        <input checked={formValues.isSupportedByCarNumber} onChange={(e)=>dispatch(changeIsSupportedByCarNumber(e.target.checked))} type="checkbox" style={{margin:'0 10px -0.5px 0',height:20,width:15}}/>
        <span >Payment by car number</span>
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
        <button style={{cursor:'pointer'}}> {typeOfmodal}</button>
      </form>

      <div></div>
    </div>
  );
};

export default AddParkomat;
