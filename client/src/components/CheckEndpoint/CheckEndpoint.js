import { useEffect, useState, useRef } from "react";
import "./checkEndpoint.css";
import OptionList from "../OptionsList/OptionList";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
const CheckEndpoint = () => {
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
  const [requestData, setRequestData] = useState({
    requestMethod: "get",
    url: "",
  });
  const [url, setUrl] = useState("");
  const [body, setBody] = useState("");
  const [response, setResponse] = useState(null);
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
  const formatsList = ["Text", "JSON", "JavaScript", "HTML", "XML"];
  const textAreaContainer = useRef(null);
  const linesContainer = useRef(null);
  const formatListModal = useRef(null);
  const addOption = (setList) => {
    setList((state) => [...state, { key: "", value: "", id: uniqueId }]);
  };
  // const addSelectedHeaders= (e) => {

  // }
  useEffect(() => {
    console.log(selectedHeaders);
  }, [selectedHeaders]);
  useEffect(() => {
    console.log(paramsList);
    //  localStorage.removeItem('params')
  }, [paramsList]);

  useEffect(() => {
    // localStorage.removeItem("headers");
    const paramsValues = localStorage.getItem("params");
    const headersValues = localStorage.getItem("headers");
    if (paramsValues) {
      setParamsList(JSON.parse(paramsValues));
    }

    if (!headersValues) {
      localStorage.setItem("headers", JSON.stringify(lol));
    }
    console.log(headersValues);
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
        : "";
    setShowFromatList(false);
    setFormatData(e);

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
    const isContentTypeHeader = selectedHeaders.some(
      (e) => e.key === "Content-Type"
    );
    if (!isContentTypeHeader) {
      setSelectedHeaders((state) => [
        ...state,
        {
          key: "Content-Type",
          value: contentTypeValue,
          id: idHeader,
          index: selectedHeaders.length + 1,
        },
      ]);
    }

    setSelectedHeaders((state) =>
      state.map((e) => {
        if (e.key === "Content-Type") {
          return {
            key: "Content-Type",
            value: contentTypeValue,
            id: idHeader,
            index: selectedHeaders.length + 1,
          };
        } else {
          return e;
        }
      })
    );
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
  const transformInfoForAxiosRequest = (array) => {
    const result = array
      .filter((e) => e.checked === true)
      .reduce((acc, curr) => {
        acc[curr.key] = curr.value;
        return acc;
      }, {});
    return result;
  };
  useEffect(() => {
    console.log(typeof body);
  }, [body]);

  const checkRequest = () => {
    const headers = transformInfoForAxiosRequest(headersList);
    const params = transformInfoForAxiosRequest(paramsList);

    let config = {};

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

    axios[requestData.requestMethod](url, body, config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        setResponse(JSON.stringify(response.data,null,2));
      })
      .catch((error) => {
        console.log(error);
        setResponse(error.message);
      });
  };

  const addAuthToHeader = () => {};
  useEffect(() => {
    const index = headersList.findIndex((e) => e.key === "Authorization");
    const isApiKey = headersList.some((e) => e.id === "apiKey");
    if (authorization.typeOfAuth === "No auth") {
      console.log(
        headersList.filter(
          (e) => e.key !== "Authorization" && e.id !== "apiKey"
        )
      );
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
      console.log("mewow");
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
  return (
    <div className="checkEndpoint-container">
      <div className="checkEndpoint-input-container">
        <select
          name=""
          value={requestData.requestMethod}
          id=""
          onChange={(e) =>
            setRequestData((state) => {
              return { ...state, requestMethod: e.target.value };
            })
          }
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
                  option={"params"}
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
                  option={"headers"}
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
            <div className="body-raw__textarea-container">
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
      <div>Response:</div>
      <pre style={{}}>
      {response && response}
      </pre>
    </div>
  );
};
{
}
export default CheckEndpoint;
