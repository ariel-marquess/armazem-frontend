import style from './button.module.css';

export function Button({text, width = "350px", height = "auto", margin = "10px 0px", padding = "5px", fontSize = "20px", onClick}){
    const styleInline = {
        width: width,
        height: height,
        minWidth: width,
        padding: padding,
        margin: margin,
        fontSize: fontSize
    };

    return <button className={style.button} style={styleInline} onClick={onClick}>{text}</button>;
}