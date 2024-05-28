import CheckEndpoint from "../CheckEndpoint/CheckEndpoint";
import ChooseEndpointToParkomat from "../ChooseEnpointToParkomat/ChooseEndpointToParkomat";
import "./requestConfig.css";
import { useEffect, useRef, useState } from "react";
const RequestConfig = ({ endpointInfo }) => {
  const elementRef = useRef(null);
  const [hightOfElement, sethightOfElement] = useState(284);
  

  useEffect(() => {
   if(!elementRef.current) return 

   

    const updateHeight = () => {
      sethightOfElement(elementRef.current.clientHeight); // або offsetHeight
    };

    // Спостерігач за зміною розміру
    const resizeObserver = new ResizeObserver(() => {
      updateHeight();
    });

    resizeObserver.observe(elementRef.current);

    // Початкова установка висоти
    updateHeight();

    // Прибирання спостерігача під час розмонтажу компонента
    return () => {
      resizeObserver.unobserve(elementRef.current);
    };
  }, []);

  useEffect(() => {
    console.log(hightOfElement);
  }, [hightOfElement]);
  return (
    <div className="request-config-container" >
        <div ref={elementRef} className="checkrequest-container"style={{display:'flex',flexGrow:1}}>
      <CheckEndpoint
        endpointInfo={endpointInfo.ticketRequest}
        configId={endpointInfo._id}
        typeOfEndpoint={"ticketRequest"}
        endpointTitle={"Ticket info endpoint"}
      />
      <CheckEndpoint
        endpointInfo={endpointInfo.paymentStatusRequest}
        configId={endpointInfo._id}
        typeOfEndpoint={"paymentStatusRequest"}
        endpointTitle={"Payment status endpoint"}
      />
      </div>
      <ChooseEndpointToParkomat
        configId={endpointInfo._id}
        heightElement={hightOfElement}
      />
    </div>
  );
};

export default RequestConfig;
