import "./chooseEndpointToParkomat.css";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { addEndpointToParkomats } from "../../services/requests";
const ChooseEndpointToParkomat = ({ configId, heightElement }) => {
  const { parkomatArray } = useSelector((state) => state.slotsSlice);
  const [parkomatArrayCopy, setParkomatArrayCopy] = useState();
  useEffect(() => {
    if (parkomatArray && parkomatArray.length >= 1) {
      setParkomatArrayCopy(
        parkomatArray.map((e, i) =>
          e.endpoint === configId
            ? { ...e, isPressed: true }
            : { ...e, isPressed: false }
        )
      );
    }
  }, [parkomatArray]);

  const toggleParkomat = (index) => {
    setParkomatArrayCopy((state) =>
      state.map((item, idx) =>
        idx === index ? { ...item, isPressed: !item.isPressed } : item
      )
    );
  };
  //   useEffect(()=>{
  //     setParkomatArrayCopy(state=>state.map((e,i)=>e.endpoint===configId?{...e,isPressed:true}:{...e,isPressed:false}))
  //   },[])
  const addConfigToParkomats = () => {
    const pressedArray = parkomatArrayCopy
      .filter((e) => e.isPressed)
      .map((e) => e._id);
    addEndpointToParkomats({ parkomatsId: pressedArray, configId });
  };
  useEffect(()=>{
    console.log(heightElement)
  },[heightElement])


  return (
    <div
      className="choose-parkomats-container"
      style={{
        height: "100%",
        width: 133,
      }}
    >
      <div
        className="choose-parkomats__parkomat-list"
        style={{
          flexGrow: heightElement > 284 ? 1: 0,
          maxHeight: heightElement > 284 ? "none" : 232,
          display: "flex",
          flexDirection: "column",
          padding: "5px",
        }}
      >
        {parkomatArrayCopy &&
          parkomatArrayCopy.map((e, i) => {
            return (
              <span
                style={{
                  background: e.isPressed && "rgb(116, 177, 239)",
                  height: 30,
                  display: "flex",
                  alignItems: "center",
                  padding: "5px",
                  marginBottom: 3,
                  hover: "grey",
                  minHeight: 30,
                }}
                onClick={() => toggleParkomat(i)}
              >
                {e.nameOfslot}
              </span>
            );
          })}
      </div>
      <button
        onClick={addConfigToParkomats}
        style={{ border: "none", cursor: "pointer" }}
      >
        save
      </button>
    </div>
  );
};

export default ChooseEndpointToParkomat;
