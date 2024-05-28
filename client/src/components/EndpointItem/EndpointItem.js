import "./endpointItem.css";
import { useState, useEffect } from "react";
import { saveEndpointInfo } from "../../services/requests";
import { useSelector } from "react-redux";
import { getListItems } from "../../services/requests";
const EndpointItem = ({ endpointInfo }) => {
  // const [endPointData, setEndPointData] = useState(null);
  // const [selectedParkings, setSelectedParkings] = useState([]);
  const [parkomatArray, setParkomatArray] = useState([]);
  const [endpointData, setEndpointData] = useState("");
  const [requestStatus, setRequestSatus] = useState("");
  // const { paymentsInfo } = useSelector((state) => state.slotsSlice);
  useEffect(() => {
    if (endpointInfo) {
      setEndpointData(endpointInfo);
    }
  }, [endpointInfo]);

  useEffect(() => {
    getListItems()
      .then((e) => setParkomatArray(e.data))
      .catch((err) => console.error(err));
  }, []);
  // const handleToggleSelect = (parkingId) => {
  //   // Додаємо або видаляємо парковку відповідно до її присутності у списку обраних
  //   setSelectedParkings((prevSelectedParkings) => {
  //     if (prevSelectedParkings.includes(parkingId)) {
  //       return prevSelectedParkings.filter((id) => id !== parkingId);
  //     } else {
  //       return [...prevSelectedParkings, parkingId];
  //     }
  //   });
  // };

  const handleSaveEndpointInfo = (e) => {
    e.preventDefault();
    setRequestSatus("updating...");
    const selectElement = document.getElementById(endpointData._id);

    const selectedValues = Array.from(selectElement.selectedOptions).map(
      (option) => option.value
    );
    console.log(selectedValues);
    saveEndpointInfo({
      endpointId: endpointInfo._id,
      endpoint: e.target[0].value,
      method: e.target[1].value,
      contentType: e.target[2].value,
      autherizationContent: e.target[3].value,
      autherizationMethod: e.target[4].value,
      amount: e.target[5].value,
      currency: e.target[6].value,
      period: e.target[7].value,
      parkomatsId: selectedValues,
    })
      .then((e) => {
        if (e.data !== "endpoint created") {
          setRequestSatus(e.data);
          setTimeout(() => {
            setRequestSatus("");
          }, 5000);
        }
      })
      .catch((e) => {
        console.error(e);
        setRequestSatus(e);
      });
  };

  return (
    <form
      action=""
      onSubmit={handleSaveEndpointInfo}
      className="payment-page__options-form"
      style={{ width: 250 }}
    >
      <div className="payment-page__options endpoint-options">
        <h3>Endpoint options</h3>
        <div className="endpoint-options_endpoint">
          <span style={{ fontWeight: 550, marginBottom: 3, marginTop: 5 }}>
            Endpoint
          </span>

          <div className="endpoint-options_endpoint-container">
            <input
              required
              type="text"
              value={endpointData.endpoint}
              onChange={(e) =>
                setEndpointData({ ...endpointData, endpoint: e.target.value })
              }
              placeholder="endpoint"
            />
            <select
              style={{ marginLeft: 5 }}
              required
              name=""
              id=""
              value={endpointData.method}
              onChange={(e) =>
                setEndpointData({ ...endpointData, method: e.target.value })
              }
            >
              <option value="Post">Post</option>
              <option value="Get">Get</option>
            </select>
          </div>
        </div>
        <div className="content-type" style={{ marginTop: 19 }}>
          <span>Content-type</span>
          <input
            type="text"
            value={endpointData.contentType}
            onChange={(e) =>
              setEndpointData({ ...endpointData, contentType: e.target.value })
            }
          />
          <span>Authorization method</span>
          <div style={{ display: "flex" }}>
            <input
              type="text"
              placeholder="token or name:password"
              value={endpointData.autherizationMethodContent}
              onChange={(e) =>
                setEndpointData({
                  ...endpointData,
                  autherizationMethodContent: e.target.value,
                })
              }
            />
            <select
              name=""
              id=""
              style={{
                width: 70,
                marginLeft: 5,
                paddingLeft: 0,
                paddingRight: 0,
                marginTop: 0,
                height: 25,
                overflow: "hidden" /* Скрытие избыточного текста */,
                textOverflow: "ellipsis",
              }}
              value={endpointData.autherizationMethod}
              onChange={(e) =>
                setEndpointData({
                  ...endpointData,
                  autherizationMethod: e.target.value,
                })
              }
            >
              <option value="Bearer Token">Bearer Token</option>
              <option value="Basic Authentication">Basic Authentication</option>
            </select>
          </div>
        </div>

        <div className="endpoint-options__fields-container">
          <span
            style={{
              alignSelf: "center",
              marginTop: "7px",
              padding: 5,
              fontWeight: 600,
            }}
          >
            Fields
          </span>
          <div className="endpoint-options__field-item">
            <span>Amount = </span>
            <input
              type="text"
              required
              value={endpointData.amount}
              onChange={(e) =>
                setEndpointData({ ...endpointData, amount: e.target.value })
              }
              placeholder="Amount"
            />
          </div>
          <div className="endpoint-options__field-item">
            <span>Currency = </span>
            <input
              type="text"
              required
              value={endpointData.currency}
              onChange={(e) =>
                setEndpointData({ ...endpointData, currency: e.target.value })
              }
              placeholder="Currency"
            />
          </div>
          <div className="endpoint-options__field-item">
            <span>Period = </span>
            <input
              type="text"
              required
              value={endpointData.period}
              onChange={(e) =>
                setEndpointData({ ...endpointData, period: e.target.value })
              }
              placeholder="Period"
            />
          </div>
        </div>
        <span style={{ fontWeight: 600, fontSize: 15 }}>
          Choose parkomats for endpoint{" "}
        </span>
        <span style={{ fontSize: 13, color: "grey", alignSelf: "center" }}>
          Hold cntrl to choose multiple
        </span>
        <select
          multiple
          name=""
          id={endpointData._id}
          style={{
            height: 80,
            width: "100%",
          }}
        >
          {parkomatArray &&
            parkomatArray.map((e) => {
              return (
                <option
                  value={e._id}
                  key={e.nameOfslot}
                  selected={e.endpoint === endpointInfo._id ? true : false}
                  // onClick={() => handleToggleSelect(e._id)}
                >
                  {e.nameOfslot}
                </option>
              );
            })}
        </select>
        <button type="submit">Save</button>
        {requestStatus && <span>{requestStatus}</span>}
      </div>
    </form>
  );
};

export default EndpointItem;
