import { useEffect, useState, useRef } from "react";
import "./optionList.css";
import trash from "../../services/img/trash.svg";
const OptionList = ({
  setState,
  index,
  option,
  keyValue,
  value,
  array,
  setUrl,
}) => {
  // const [selectedHeaders,setSelectedHeaders] = useState([])
  const prevArrayLengthRef = useRef(array.length);
  const addParamsToUrl = (e) => {
    if (option !== "params") return;
    if (e.target.checked) {
      const isCheckedParams = array.some((e) => e.checked === true);
      if (isCheckedParams) {
        setUrl((state) => state + `&${keyValue}=${value}`);
      } else {
        setUrl((state) => state + `?${keyValue}=${value}`);
      }
    } else {
      setUrl((state) => {
        let changedString = state.replace(`?${keyValue}=${value}&`, "");

        if (changedString !== state) {
          return state.replace(`${keyValue}=${value}&`, "");
        } else {
          let changeString2 = state.replace(`?${keyValue}=${value}`, "");
          console.log(keyValue, value);
          if (changeString2 !== state) {
            return changeString2;
          } else {
            let changeString3 = state.replace(`&${keyValue}=${value}`, "");
            if (changeString3 !== state) {
              return changeString3;
            }
          }
        }
      });
    }
  };
  const addSelectedHeaders = (e) => {
    console.log(array[index]);
    // addParamsToUrl(e);
    if (e.target.checked) {
      //   let lol = [];
      //   lol.push(array[index]);
      setState((state) =>
        state.map((e, i) => {
          if (i === index) {
            return {
              ...e,
              checked: true,
            };
          } else {
            return e;
          }
        })
      );
      const result = localStorage.getItem(option);
      if (result) {
        let arrayOption = JSON.parse(result);
        arrayOption[index].checked = true;
        localStorage.setItem(option, JSON.stringify(arrayOption));
      }
      //   setSelectedHeaders((state) => [...state, { ...array[index], index }]);
    } else {
      //   setSelectedHeaders((state) =>
      //     state.filter((e) => {
      //       return e.id !== array[index].id;
      //     })
      //   );
      setState((state) =>
        state.map((e, i) => {
          if (i === index) {
            return {
              ...e,
              checked: false,
            };
          } else {
            return e;
          }
        })
      );
      const result = localStorage.getItem(option);
      if (result) {
        let arrayOption = JSON.parse(result);
        arrayOption[index].checked = false;
        localStorage.setItem(option, JSON.stringify(arrayOption));
      }
    }
  };
  useEffect(() => {
    console.log(array[index]);
  }, [array]);
  const changeOptionValue = (event, field) => {
    setState((state) =>
      state.map((item, i) => {
        if (index === i) {
          return { ...item, [field]: event.target.value };
        } else {
          return item;
        }
      })
    );
  };
  useEffect(() => {
    setTimeout(() => {
      localStorage.setItem(option, JSON.stringify(array));
    }, 500);
  }, [keyValue, value]);

  const deleteOption = (option, arr, setItem) => {
    const removedArr = arr.filter((e, i) => i !== index);
    setState(removedArr);

    localStorage.setItem(option, JSON.stringify(removedArr));

    // if (option === "headers") {
    //   setSelectedHeaders((state) =>
    //     state.filter((e) => {
    //       return e.id !== array[index].id;
    //     })
    //   );
    // }
  };
  const forbidDelete = (e) => {
    if (keyValue === "Authorization" || array[index].id === "apiKey") {
      e.preventDefault();
    }
  };
  return (
    <div className={`params-item-container`}>
      {/* {option === "headers" ? ( */}
      <input
        className="params-item-checkbox"
        checked={array[index].checked}
        type="checkbox"
        onChange={(e) => addSelectedHeaders(e)}
      />

      <div className="params-item-input">
        <span>Key</span>
        <input
          type="text"
          onKeyDown={forbidDelete}
          value={keyValue}
          placeholder="key"
          onChange={(w) => changeOptionValue(w, "key")}
        />
      </div>
      <div className="params-item-input">
        <span>Value</span>
        <input
          onKeyDown={forbidDelete}
          type="text"
          value={value}
          placeholder="value"
          onChange={(w) => changeOptionValue(w, "value")}
        />
      </div>
      <div
        style={{
          display:
            array[index].default ||
            (keyValue === "Authorization" && array[index].id !== "keyApi") ||
            keyValue === "Content-Type"
              ? "none"
              : "flex",
        }}
        className="params-item-delete-button"
        onClick={() => deleteOption(option, array, setState)}
      >
        <img src={trash} />
      </div>
    </div>
  );
};

export default OptionList;
