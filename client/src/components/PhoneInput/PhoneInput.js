import React, { useState } from 'react';
import 'react-phone-number-input/style.css'
import PhoneInput ,{isPossiblePhoneNumber} from 'react-phone-number-input';
// import 'flag-icon-css/css/flag-icon.min.css';
import './PhoneInput.css'
const PhoneNumberInput = ()=> {
    const [value, setValue] = useState();

    return (
        <div>
        <PhoneInput
            international
            defaultCountry="UA"
            placeholder="Enter phone number"
            value={value}
            onChange={setValue}
        />
         {/* <div style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}>
                <div className="react-phone-number-input__icon">ывфыв</div>
            </div> */}
    {/* {value && !isPossiblePhoneNumber(value) && <div style={{ color: 'red',position:'relative',top:-10 }}>Invalid phone number</div>} */}

        </div>
    );
}

export default PhoneNumberInput;
