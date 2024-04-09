import "./endpoints.css";
import EndpointItem from "../EndpointItem/EndpointItem";
import { getEndpointItems,saveEndpointInfo } from "../../services/requests";
import CheckEndpoint from "../CheckEndpoint/CheckEndpoint";
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
      endpointId:undefined,
      endpoint: '',
      method: 'Get',
      contentType: '',
      autherizationMethodContent: '',
      autherizationMethod: 'Bearer Token',
      amount: '',
      currency: '',
      period: '',
      parkomatsId: []
    }
    saveEndpointInfo(newItem)
    .then(e=>{
      setEndpointsList(prev=>[...prev,{...newItem,_id:e.data.newItemData.endpointId,userId:e.data.newItemData.userId}])
    })
    .catch(err=>console.error(err))
   
  }
  useEffect(()=>{console.log(endpointsList)},[endpointsList])
  return (
    <div className="enpoints-container wrapper">
      {endpointsList &&
        endpointsList.map((e) => {
          return <EndpointItem endpointInfo={e} />;
        })}
      <div className="add-endpoint-button" onClick={addEndpoint}>&#43; ADD ENDPOINT</div>
      <CheckEndpoint/>
    </div>
  );
};

export default Endpoints;
