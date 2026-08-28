import { useState, useEffect } from 'react';
import style from './input.module.css';

export function Input({
                          placeholder = "",
                          width = "570px",
                          type = "text",
                          margin = "0px",
                          disabled = false,
                          worth = "",
                          withButton = false,
                          revealPassword = true,
                          onChange,
                          onSearch}){
    const [showPassword, setShowPassword] = useState(false);
    const [value, setValue] = useState(worth);

    useEffect(() => {
        setValue(worth);
    }, [worth])

    const styleInput = {
        width: width,
        margin: margin
    };

    const styleImage = {
        backgroundImage: `url(${showPassword ? "../../../src/assets/eye-closed.png" : "../../../src/assets/eye-open.png"})`
    }

    const handleChange = (e) => {
        setValue(e.target.value);
        if (onChange) onChange(e.target.value);
    }

    const handleKeyDown = (e) => {
        if (onSearch){
            if (e.key === 'Enter') {
                onSearch(value);
            }
        }
    };

    if (withButton) {
        return <div className={style.boxPassword} style={{
            width: width,
            margin: margin}}>
            <input
                className={disabled ? style.inputDisabled : style.input}
                placeholder={placeholder}
                value={value}
                type={`${showPassword ? "text" : "password"}`}
                disabled={disabled}
                onChange={handleChange}/>
            <button
                className={style.button}
                style={styleImage}
                onClick={() => showPassword ? setShowPassword(false) : setShowPassword(true)}></button>
        </div>
    } else {
        return <input
            className={disabled ? style.inputDisabled : style.input}
            style={styleInput}
            placeholder={placeholder}
            value={value}
            disabled={disabled}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            type={`${revealPassword ? type : "password"}`}/>;
    }
}