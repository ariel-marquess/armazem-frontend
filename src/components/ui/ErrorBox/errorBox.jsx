import style from './errorBox.module.css';

export function ErrorBox({textError, margin = "0px", padding = "0px"}){
    const styleMargin = {
        margin: margin,
        padding: padding
    }

    return <div style={styleMargin}>
        <h3 className={style.title}>Erro</h3>
        <div className={style.box}>
            <p className={style.paragraph}>{textError}</p>
        </div>
    </div>;
}