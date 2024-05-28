import { useEffect, useState, useRef } from "react";
import "./checkEndpoint.css";
import OptionList from "../OptionsList/OptionList";
import { saveEndpointInfo, updateEndpoint } from "../../services/requests";
import { v4 as uuidv4 } from "uuid";
import { XMLParser } from "fast-xml-parser";
import axios from "axios";
const CheckEndpoint = ({
  endpointInfo,
  configId,
  typeOfEndpoint,
  endpointTitle,
}) => {
  const [optionName, setOptionName] = useState("params");

  const [paramsList, setParamsList] = useState([]);
  const [headersList, setHeadersList] = useState([]);
  const [headerListWithBaseHeaders, setHeaderListWithBaseHeaders] = useState(
    []
  );
  const [selectedHeaders, setSelectedHeaders] = useState([]);

  const [authorization, setAuthorization] = useState({
    typeOfAuth: "No auth",
    basicAuth: { username: "", password: "" },
    bearerToken: "",
    apiKey: { key: "", value: "" },
  });
  const [lines, setLines] = useState([1]);
  const [formatData, setFormatData] = useState("Text");
  const [showFormatList, setShowFromatList] = useState(false);
  const [requestMethod, setRequestMethod] = useState("get");
  const [formDataList, setFormDataList] = useState([]);
  const [url, setUrl] = useState("");
  const [body, setBody] = useState("");
  const [response, setResponse] = useState(null);
  const [showFieldsList, setShowFieldsList] = useState(false);
  const [amountField, setAmountField] = useState("");
  const [currencyField, setCurrencyField] = useState("");
  const [peridField, setPeriodField] = useState("");
  const [typeBody, setTypeBody] = useState("");
  const [error, setError] = useState("");
  const [responseDataSave, setResponseDataSave] = useState("");
  const uniqueId = uuidv4();
  const lol = [
    // {
    //   key: "Host",
    //   value: "<calculated when request is sent>",
    //   id: uniqueId,
    //   default: true,
    // },
    { key: "User-Agent", value: "", id: uniqueId, default: true },
    { key: "Accept", value: "*/*", id: uniqueId, default: true },
    {
      key: "Accept-Encoding",
      value: "gzip, deflate, br",
      id: uniqueId,
      default: true,
    },
    { key: "Connection", value: "keep-alive", id: uniqueId, default: true },
  ];
  const fieldsList = ["Amount", "Currency", "Period"];
  const formatsList = ["JSON", "XML"];

  const textAreaContainer = useRef(null);
  const linesContainer = useRef(null);
  const formatListModal = useRef(null);

  const addOption = (setList) => {
    setList((state) => [...state, { key: "", value: "", id: uniqueId }]);
  };
  // const addSelectedHeaders= (e) => {

  // }

  useEffect(() => {
    // localStorage.removeItem("headers");
    const paramsValues = localStorage.getItem("params" + endpointInfo._id);
    const headersValues = localStorage.getItem("headers" + endpointInfo._id);
    const formDataValues = localStorage.getItem("formData" + endpointInfo._id);
    if (paramsValues) {
      setParamsList(JSON.parse(paramsValues));
    }
    if (formDataValues) {
      setFormDataList(JSON.parse(formDataValues));
    }
    if (!headersValues) {
      localStorage.setItem("headers", JSON.stringify(lol));
    }

    if (headersValues) {
      setHeadersList(JSON.parse(headersValues));
      // setHeaderListWithBaseHeaders([...lol, ...JSON.parse(headersValues)]);
    }
  }, []);
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      setLines((state) => [...state, state.length + 1]);
    }
  };
  const handleScroll = (e) => {
    if (e.target === textAreaContainer.current) {
      linesContainer.current.scrollTop = textAreaContainer.current.scrollTop;
    } else if (e.target === linesContainer.current) {
      textAreaContainer.current.scrollTop = linesContainer.current.scrollTop;
    }
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        formatListModal.current &&
        !formatListModal.current.contains(event.target) &&
        !event.target.classList.contains("body-raw__indicator")
      ) {
        setShowFromatList(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    setAmountField(endpointInfo.amount);
    setCurrencyField(endpointInfo.currency);
    setPeriodField(endpointInfo.period);
    setUrl(endpointInfo.endpoint);
    setRequestMethod(endpointInfo.method);
  }, []);
  const clickOutsideFiledList = (event) => {
    if (!event.target.classList.contains("field-item")) {
      // Перевірка чи клік відбувся поза модальним вікном

      setShowFieldsList(false);

      document.removeEventListener("click", clickOutsideFiledList);
    }
  };
  const handleClickField = (key, value) => {
    setShowFieldsList(key);
    document.body.addEventListener("click", clickOutsideFiledList);
  };

  const handleSetField = (field, key) => {
    if (field === "Amount") {
      setAmountField(key);
    } else if (field === "Currency") {
      setCurrencyField(key);
    } else if (field === "Period") {
      setPeriodField(key);
    }
  };
  const renderJsonFields = (data) => {
    if (Array.isArray(data)) {
      return data.map((item, index) => (
        <div key={index}>{renderJsonFields(item)}</div>
      ));
    } else if (typeof data === "string" || typeof data === "object") {
      // const jsObj = JSON.parse(data);
      // console.log(data);
      const transformObj = Object.entries(data);
      return transformObj.map(([key, value]) => {
        if (typeof value === "object") {
          return (
            <div key={key}>
              <div className="field-item">{key}:</div>
              <div>{renderJsonFields(value)}</div>
              <div
                className="fieldsList"
                style={{ display: showFieldsList === key ? "block" : "none" }}
              >
                <span>amount</span>
                <span>currency</span>
                <span>period</span>
              </div>
            </div>
          );
        } else {
          return (
            <div key={key} className="field-container">
              <span
                className="field-item"
                style={{ borderBottom: "1px solid red", cursor: "pointer" }}
                onClick={() => handleClickField(key, value)}
              >
                {key}
              </span>
              :{value.toString()},
              <div
                className="fieldsList"
                style={{ display: showFieldsList === key ? "flex" : "none" }}
              >
                <span onClick={() => handleSetField("Amount", key)}>
                  amount
                </span>
                <span onClick={() => handleSetField("Currency", key)}>
                  currency
                </span>
                <span onClick={() => handleSetField("Period", key)}>
                  period
                </span>
              </div>
            </div>
          );
        }
      });
    }
  };

  useEffect(() => {
    const obj = Object.entries({ lol: "lol", mepw: "cat", gav: "pes" });

    const res = obj.map(([key, value]) => {
      return (
        <div key={key} onClick={() => handleClickField(key, value)}>
          {key}: {value.toString()}
        </div>
      );
    });
  }, []);
  const handleClickFormatData = (e) => {
    const contentTypeValue =
      e === "Text"
        ? "text/plain"
        : e === "JSON"
        ? "application/json"
        : e === "JavaScript"
        ? "application/javascript"
        : e === "HTML"
        ? "text/html"
        : e === "XML"
        ? "application/xml"
        : e === "form-data"
        ? "multipart/form-data"
        : "";

    if (e !== "form-data") {
      setShowFromatList(false);
      setFormatData(e);
    }

    // if (isContentTypeHeader) {
    //   selectedHeaders.forEach(e=>{
    //     if(e.key==="Content-Type"){
    //       setSelectedHeaders((state) => [
    //         ...state,
    //         {
    //           key: "Content-Type",
    //           value: contentTypeValue,
    //           id: uniqueId,
    //           index: selectedHeaders.length + 1,
    //         },
    //       ]);
    //       }
    //       e.value=contentTypeValue

    //     }
    //   })
    // }   else {
    //   setSelectedHeaders((state) => [
    //     ...state,
    //     {
    //       key: "Content-Type",
    //       value: contentTypeValue,
    //       id: uniqueId,
    //       index: selectedHeaders.length + 1,
    //     },
    //   ]);
    //   }

    const idHeader = uniqueId;
    // const isContentTypeHeader = selectedHeaders.some(
    //   (e) => e.key === "Content-Type"
    // );
    // if (!isContentTypeHeader) {
    //   setSelectedHeaders((state) => [
    //     ...state,
    //     {
    //       key: "Content-Type",
    //       value: contentTypeValue,
    //       id: idHeader,
    //       index: selectedHeaders.length + 1,
    //     },
    //   ]);
    // }

    // setSelectedHeaders((state) =>
    //   state.map((e) => {
    //     if (e.key === "Content-Type") {
    //       return {
    //         key: "Content-Type",
    //         value: contentTypeValue,
    //         id: idHeader,
    //         index: selectedHeaders.length + 1,
    //       };
    //     } else {
    //       return e;
    //     }
    //   })
    // );
    setHeadersList((state) =>
      state.map((e) => {
        if (e.key === "Content-Type") {
          return {
            ...e,

            value: contentTypeValue,
            id: idHeader,
            checked: true,
          };
        } else {
          return e;
        }
      })
    );
    const isContentType = headersList.some((e) => e.key === "Content-Type");
    if (!isContentType) {
      setHeadersList((state) => [
        ...state,
        {
          key: "Content-Type",
          value: contentTypeValue,
          id: idHeader,
          checked: true,
        },
      ]);
    }
  };
  const renderXML = (node, key) => {
    if (typeof node === "string") {
      return <span key={key}>{node}</span>;
    }

    return Object.keys(node).map((tag, index) => (
      <div key={index} style={{ marginLeft: "20px" }}>
        <span
          className="clickable field-item"
          style={{ color: "blue", cursor: "pointer" }}
          onClick={() => setShowFieldsList(tag)}
        >
          &lt;{tag}&gt;
        </span>
        {Array.isArray(node[tag])
          ? node[tag].map((child, i) => renderXML(child, i))
          : renderXML(node[tag], index)}
        <span
          className="clickable"
          // style={{ color: 'blue', cursor: 'pointer' }}
          // onClick={() => alert(`Clicked on tag: </${tag}>`)}
        >
          &lt;/{tag}&gt;
        </span>
        <div
          className="fieldsList"
          style={{ display: showFieldsList === tag ? "flex" : "none" }}
        >
          <span onClick={() => handleSetField("Amount", key)}>amount</span>
          <span onClick={() => handleSetField("Currency", key)}>currency</span>
          <span onClick={() => handleSetField("Period", key)}>period</span>
        </div>
      </div>
    ));
  };
  const transformInfoForAxiosRequest = (array) => {
    const result = array
      .filter((e) => e.checked === true)
      .reduce((acc, curr) => {
        acc[curr.key] = curr.value;
        return acc;
      }, {});
    return result;
  };
  const handleCreateFormDataObj = (array) => {
    let formData = new FormData();
    array
      .filter((e) => e.checked === true)
      .forEach((e) => {
        formData.append(e.key, e.value);
      });
    return formData;
  };
  useEffect(() => {
    const xmlTest = `<book id="1">
    <title>The Great Gatsby</title>
    <author>F. Scott Fitzgerald</author>
    <year>1925</year>
    <genre>Fiction</genre>
    <price>10.99</price>
  </book>`;
    const parser = new XMLParser();
    const jsonObj = parser.parse(xmlTest);

    setResponse(jsonObj);
  }, []);
  const checkRequest = () => {
    const headers = transformInfoForAxiosRequest(headersList);
    const params = transformInfoForAxiosRequest(paramsList);

    let config = {};
    const bodyContent =
      typeBody === "formData"
        ? handleCreateFormDataObj(formDataList)
        : typeBody === "raw"
        ? body
        : {};
    console.log(typeBody);
    if (authorization.typeOfAuth === "Basic Auth") {
      config.auth = {
        username: authorization.basicAuth.username,
        password: authorization.basicAuth.password,
      };
    }
    if (headers && Object.entries(headers).length > 0) {
      config.headers = headers;
    }
    if (params && Object.entries(params).length > 0) {
      config.params = params;
    }
    console.log(bodyContent);
    axios[requestMethod](
      url,
      requestMethod === "get" ? config : bodyContent,
      config
    )
      .then((response) => {
        setError("");
        let headerResponse;
        let responseData;
        if (
          response.headers["content-type"] === "application/json; charset=utf-8"
        ) {
          headerResponse = "json";
          responseData = response.data;
        } else {
          const parser = new XMLParser();
          const jsonObj = parser.parse(response.data);
          headerResponse = "xml";
          responseData = jsonObj;
        }
        setResponse({ responseData, headerResponse });
      })
      .catch((error) => {
        console.log(error);
        setResponse("");
        setError(error.message);
      });
  };
  const chooseFormatData = (typeOfBody, formatData) => {
    console.log(formatData);
    handleClickFormatData(formatData);

    setTypeBody(typeOfBody);
  };

  const addAuthToHeader = () => {};
  useEffect(() => {
    const index = headersList.findIndex((e) => e.key === "Authorization");
    const isApiKey = headersList.some((e) => e.id === "apiKey");
    if (authorization.typeOfAuth === "No auth") {
      setHeadersList((state) =>
        state.filter((e) => e.key !== "Authorization" && e.id !== "apiKey")
      );
    }
    if (
      authorization.bearerToken.length >= 1 &&
      authorization.typeOfAuth === "Bearer Token"
    ) {
      if (index === -1 || isApiKey) {
        if (isApiKey) {
          setHeadersList((state) =>
            state.map((item, i) =>
              item.id === "apiKey"
                ? {
                    ...item,
                    key: "Authorization",
                    value: `Bearer ${authorization.bearerToken}`,
                    id: "Bearer Token",
                  }
                : item
            )
          );
          return;
        }
        setHeadersList((state) => [
          ...state,
          {
            key: "Authorization",
            value: authorization.bearerToken,
            checked: true,
            id: "Bearer Token",
          },
        ]);
      } else {
        setHeadersList((state) =>
          state.map((item, i) =>
            i === index
              ? { ...item, value: `Bearer ${authorization.bearerToken}` }
              : item
          )
        );
      }
    }
    if (
      authorization.typeOfAuth === "Basic Auth" &&
      (authorization.basicAuth.username.length >= 1 ||
        authorization.basicAuth.password.length >= 1)
    ) {
      const credentials = btoa(
        `${authorization.basicAuth.username}:${authorization.basicAuth.password}`
      );
      if (index === -1 || isApiKey) {
        if (isApiKey) {
          setHeadersList((state) =>
            state.map((item, i) =>
              item.id === "apiKey"
                ? {
                    ...item,
                    key: "Authorization",
                    value: `Basic ${credentials}`,
                    id: "basicAuth",
                  }
                : item
            )
          );
          return;
        }
        setHeadersList((state) => [
          ...state,
          {
            key: "Authorization",
            value: `Basic ${credentials}`,
            checked: true,
            id: "basicAuth",
          },
        ]);
      } else {
        setHeadersList((state) =>
          state.map((item, i) =>
            i === index ? { ...item, value: `Basic ${credentials}` } : item
          )
        );
      }
    }
    if (
      authorization.typeOfAuth === "Api Key" &&
      (authorization.apiKey.key.length >= 1 ||
        authorization.apiKey.value.length >= 1)
    ) {
      if (index === -1 && !isApiKey) {
        setHeadersList((state) => [
          ...state,
          {
            key: authorization.apiKey.key,
            value: authorization.apiKey.value,
            checked: true,
            id: "apiKey",
          },
        ]);
      } else {
        if (index !== -1) {
          setHeadersList((state) =>
            state.map((item, i) =>
              i === index
                ? {
                    ...item,
                    key: authorization.apiKey.key,
                    value: authorization.apiKey.value,
                    id: "apiKey",
                  }
                : item
            )
          );
          return;
        }
        setHeadersList((state) =>
          state.map((item, i) =>
            item.id === "apiKey"
              ? {
                  ...item,
                  key: authorization.apiKey.key,
                  value: authorization.apiKey.value,
                }
              : item
          )
        );
      }
    }
  }, [authorization]);

  useEffect(() => {
    console.log(endpointInfo._id);
  }, [endpointInfo]);
  // const objToString = (obj) => {
  // return obj.map(e=>{
  //  return headersList.map(e=>{
  //   return {key}} )
  //  })
  // };
  const handleUpdateEndpointInfo = (typeOfEndpoint) => {
    const authorizationContent =
      authorization.typeOfAuth === "Basic Auth"
        ? `${authorization.basicAuth.username}:${authorization.basicAuth.password}`
        : authorization.typeOfAuth === "Api Key"
        ? `${authorization.apiKey.key}:${authorization.apiKey.value}`
        : authorization.typeOfAuth === "Bearer Token"
        ? authorization.bearerToken
        : "";
    console.log(transformInfoForAxiosRequest(headersList));
    updateEndpoint({
      endpoint: url,
      endpointId: endpointInfo._id,
      authorizationContent,
      authorizationMethod: authorization.typeOfAuth,
      method: requestMethod,
      period: peridField,
      amount: amountField,
      currency: currencyField,
      headers: headersList && transformInfoForAxiosRequest(headersList),
      configId,
      typeOfEndpoint,
    })
      .then((e) => {
        setResponseDataSave(e.data.message);
        setTimeout(() => {
          setResponseDataSave("");
        }, 5000);
      })
      .catch((e) => setResponseDataSave(e.message));
  };
  useEffect(() => {
    if (response) {
      setError("");
    }
    if (error) {
      setResponse("");
    }
  }, [response, error]);

  return (
    <div className="checkEndpoint-container">
      <h2>{endpointTitle}</h2>
      <div className="checkEndpoint-input-container">
        <select
          name=" "
          value={requestMethod}
          id=""
          onChange={(e) => setRequestMethod(e.target.value)}
        >
          <option value="post">Post</option>
          <option value="get">Get</option>
          <option value="put">Put</option>
        </select>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL"
        />
        <button type="submit" onClick={checkRequest}>
          send
        </button>
        <button
          onClick={() => handleUpdateEndpointInfo(typeOfEndpoint)}
          style={{ background: "rgba(138, 104, 42, 0.8)", marginLeft: 5 }}
        >
          save
        </button>
      </div>
      <nav className="option-list">
        <ul>
          <li
            className={`${optionName === "params" ? "active-option" : ""}`}
            onClick={() => setOptionName("params")}
          >
            Params
          </li>
          <li
            className={`${optionName === "auth" ? "active-option" : ""}`}
            onClick={() => setOptionName("auth")}
          >
            Authorization
          </li>
          <li
            className={`${optionName === "headers" ? "active-option" : ""}`}
            onClick={() => setOptionName("headers")}
          >
            Headers
          </li>
          <li
            className={`${optionName === "body" ? "active-option" : ""}`}
            onClick={() => setOptionName("body")}
          >
            Body
          </li>
        </ul>
      </nav>
      <div className="option-body-container">
        <div
          className={`params ${
            optionName === "params" ? "params-flex" : "hide-option "
          }`}
        >
          {paramsList &&
            paramsList.map((e, i) => {
              return (
                <OptionList
                  setState={setParamsList}
                  index={i}
                  keyValue={e.key}
                  value={e.value}
                  option={"params" + endpointInfo._id}
                  array={paramsList}
                  setUrl={setUrl}
                />
                // <div className={`params-item-container`}>
                //   {optionName==="headers"?<input type="checkbox" />:null}
                //   <div className="params-item-input">
                //     <span>Key</span>
                //     <input
                //       type="text"
                //       value={e.key}
                //       placeholder="key"
                //       onChange={(w)=>changeOptionValue(w,setParamsList,i,'key')}

                //     />
                //   </div>
                //   <div className="params-item-input">
                //     <span>Value</span>
                //     <input type="text"
                //     value={e.value}
                //     placeholder="value"
                //     onChange={(w)=>changeOptionValue(w,setParamsList,i,'value')}
                //     />
                //   </div>
                //   <div onClick={()=>deleteOption('params',paramsList,setParamsList,i)}>delete</div>
                // </div>
              );
            })}

          <button
            className="add-option-button"
            onClick={() => addOption(setParamsList)}
          >
            add one more
          </button>
        </div>
        <div
          className={` ${
            optionName === "auth" ? "auth-item-container" : "hide-option "
          }`}
        >
          <select
            name=""
            id=""
            value={authorization.typeOfAuth}
            onChange={(e) =>
              setAuthorization((state) => {
                return { ...state, typeOfAuth: e.target.value };
              })
            }
          >
            <option value="No auth">No auth</option>
            <option value="Basic Auth">Basic Auth</option>
            <option value="Bearer Token">Bearer Token</option>
            <option value="Api Key">Api Key</option>
          </select>
          <div className="auth-option-item">
            <span
              className={`auth-option-no-auth ${
                authorization.typeOfAuth === "No auth" ? "" : "hide-option "
              }`}
            >
              This request does not use any authorization
            </span>
            <div
              className={` ${
                authorization.typeOfAuth === "Basic Auth"
                  ? "auth-option-base-auth"
                  : "hide-option "
              }`}
            >
              <div>
                <span>Username</span>
                <input
                  type="text"
                  placeholder="Username"
                  value={authorization.basicAuth.username}
                  onChange={(e) =>
                    setAuthorization((state) => {
                      return {
                        ...state,
                        basicAuth: {
                          ...state.basicAuth,
                          username: e.target.value,
                        },
                      };
                    })
                  }
                />
              </div>
              <div>
                <span>Password</span>
                <input
                  type="text"
                  value={authorization.basicAuth.password}
                  onChange={(e) =>
                    setAuthorization((state) => {
                      return {
                        ...state,
                        basicAuth: {
                          ...state.basicAuth,
                          password: e.target.value,
                        },
                      };
                    })
                  }
                  placeholder="Password"
                />
              </div>
            </div>
            <div
              className={`${
                authorization.typeOfAuth === "Bearer Token"
                  ? "auth-option-bearer-token "
                  : "hide-option "
              }`}
            >
              <span>Token</span>
              <input
                type="text"
                value={authorization.bearerToken}
                onChange={(e) =>
                  setAuthorization((state) => {
                    return { ...state, bearerToken: e.target.value };
                  })
                }
                placeholder="Token"
              />
            </div>
            <div
              className={` ${
                authorization.typeOfAuth === "Api Key"
                  ? "auth-option-Api-key"
                  : "hide-option "
              }`}
            >
              <div>
                <span>Key</span>
                <input
                  type="text"
                  value={authorization.apiKey.key}
                  onChange={(e) =>
                    setAuthorization((state) => {
                      return {
                        ...state,
                        apiKey: { ...state.apiKey, key: e.target.value },
                      };
                    })
                  }
                  placeholder="Key"
                />
              </div>
              <div>
                <span>Value</span>
                <input
                  type="text"
                  value={authorization.apiKey.value}
                  onChange={(e) =>
                    setAuthorization((state) => {
                      return {
                        ...state,
                        apiKey: { ...state.apiKey, value: e.target.value },
                      };
                    })
                  }
                  placeholder="value"
                />
              </div>
            </div>
          </div>
        </div>
        <div
          className={`headers-item-container ${
            optionName === "headers" ? "" : "hide-option "
          }`}
        >
          {headersList &&
            headersList.map((e, i) => {
              return (
                <OptionList
                  setState={setHeadersList}
                  index={i}
                  keyValue={e.key}
                  value={e.value}
                  option={"headers" + endpointInfo._id}
                  array={headersList}
                  // setSelectedHeaders={setSelectedHeaders}
                />
              );
            })}
          <button
            className={"add-option-button"}
            onClick={() => addOption(setHeadersList)}
          >
            add more
          </button>
        </div>
        <div
          className={`body-item-container ${
            optionName === "body" ? "" : "hide-option "
          }`}
        >
          <div className="body-raw">
            <div className="body-raw-checkbox-container">
              <div onClick={() => chooseFormatData("form-data", "form-data")}>
                <input
                  value="form-data"
                  checked={typeBody === "form-data"}
                  type="radio"
                />
                <span>form-data</span>
              </div>
              <div onClick={() => chooseFormatData("raw", formatData)}>
                <input value="raw" checked={typeBody === "raw"} type="radio" />
                <span>raw</span>
              </div>
            </div>
            <div
              style={{ display: typeBody === "form-data" ? "flex" : "none" }}
              className="body-raw__form-data"
            >
              {formDataList &&
                formDataList.map((e, i) => {
                  return (
                    <OptionList
                      setState={setFormDataList}
                      array={formDataList}
                      keyValue={e.key}
                      option={"formData" + endpointInfo._id}
                      index={i}
                      value={e.value}
                    />
                  );
                })}
              <button
                className={"add-option-button"}
                onClick={() => addOption(setFormDataList)}
              >
                add more
              </button>
            </div>
            <div
              style={{ display: typeBody === "raw" ? "flex" : "none" }}
              className="body-raw__textarea-container"
            >
              <div
                className="count-lines"
                ref={linesContainer}
                onScroll={handleScroll}
              >
                {lines.map((e) => {
                  return <span style={{ fontSize: 13 }}>{e}</span>;
                })}
              </div>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                name=""
                id=""
                cols="30"
                rows={lines.length}
                onScroll={handleScroll}
                onKeyPress={(e) => handleKeyPress(e)}
                ref={textAreaContainer}
              ></textarea>
              <div className="body-raw__choose-">
                <div
                  className="body-raw-container"
                  onClick={() => setShowFromatList((state) => !state)}
                >
                  <span className="body-raw__indicator">{formatData}</span>
                </div>
                <div
                  className="body-raw__modal"
                  ref={formatListModal}
                  style={{ display: showFormatList ? "flex" : "none" }}
                >
                  {formatsList.map((e) => {
                    return (
                      <span onClick={() => handleClickFormatData(e)}>{e}</span>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="fields-container">
        <div className="fields-item">
          <span>Amount -</span>
          <span>{amountField && amountField} </span>
        </div>
        <div className="fields-item">
          <span>, Currency - </span>
          <span>{currencyField && currencyField} </span>
        </div>
        <div className="fields-item">
          <span>, Period - </span>
          <span>{peridField && peridField}</span>
        </div>
      </div>
      <div>Response:</div>
      {/* <pre style={{}}>{response && response}</pre> */}
      <div className="field-container">
        <span>{"{"}</span>
        {response && response.headerResponse === "json"
          ? renderJsonFields(response.responseData)
          : response && response.headerResponse === "xml"
          ? renderXML(response.responseData)
          : error
          ? error
          : ""}

        <span>{"}"}</span>
      </div>
      {responseDataSave && <span>{responseDataSave}</span>}
    </div>
  );
};

export default CheckEndpoint;
