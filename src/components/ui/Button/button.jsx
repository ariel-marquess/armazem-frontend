import style from './button.module.css';

export function Button({text, width = "570px", margin = "0px", padding = "0px"}){
    const styleWidth = {
        width: width,
        padding: padding,
        margin: margin
    };

    return <button className={style.button} style={styleWidth}>{text}</button>;
}