import "./endpoints.css";
import EndpointItem from "../EndpointItem/EndpointItem";
import { getEndpointItems,saveEndpointInfo } from "../../services/requests";
import CheckEndpoint from "../CheckEndpoint/CheckEndpoint";
import RequestConfig from "../RequestConfig/RequestConfig";
import { useEffect, useState } from "react";
const Endpoints = () => {
  const [endpointsList, setEndpointsList] = useState([]);
  useEffect(() => {
    getEndpointItems()
      .then((res) => {
        console.log(res);
        setEndpointsList(res.data);
      })
      .catch((err) => console.error(err));
  }, []);
  const addEndpoint = () => {
    const newItem = 
    {
      
      endpoint:'',
      method:'Get',
     headers: '',
      autherizationContent: '',
      autherizationMethod:'Bearer Token',
      amount: '',
      currency: '',
      period: '',
     
    }
    saveEndpointInfo(newItem)
    .then(e=>{
      console.log(e)
      setEndpointsList(prev=>[...prev,e.data])
    })
    .catch(err=>console.error(err))
   
  }
  // useEffect(()=>{console.log(endpointsList)},[endpointsList])
  
  return (
    <div className="enpoints-container wrapper">
      {endpointsList &&
        endpointsList.map((e) => {
          return   <RequestConfig endpointInfo={e}/>
        })}
      <div className="add-endpoint-button" onClick={addEndpoint}>&#43; ADD ENDPOINT</div>
  {/* <EndpointItem endpointInfo={endpointsList[0]}/>
  <EndpointItem endpointInfo={endpointsList[1]}/> */}
    </div>
  );
};

export default Endpoints;
