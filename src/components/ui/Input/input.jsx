import { useState } from 'react';
import style from './input.module.css';

export function Input({
                          placeholder = "Digite algo...",
                          width = "570px",
                          type = "text",
                          margin = "0px",
                          padding = "0px",
                          onChange}){
    const [showPassword, setShowPassword] = useState(false);
    const [value, setValue] = useState("");

    const styleInput = {
        width: width,
        padding: padding,
        margin: margin
    };

    const styleImage = {
        backgroundImage: `url(${showPassword ? "../../../src/assets/eye-open.png" : "../../../src/assets/eye-closed.png"})`
    }

    const handleChange = (e) => {
        setValue(e.target.value);
        if (onChange) onChange(e.target.value);
    }

    if (type === "password") {
        return <div>
            <input
                className={style.input}
                style={styleInput}
                placeholder={placeholder}
                value={value}
                type={type}
                onChange={handleChange}/>;
            <button
                className={style.button}
                style={styleImage}
                onClick={() => showPassword ? setShowPassword(false) : setShowPassword(true)}></button>
        </div>
    } else {
        return <input
            className={style.input}
            style={styleInput}
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            type={type}/>;
    }
}