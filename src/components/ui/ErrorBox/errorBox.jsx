import { useState, useEffect } from 'react';
import style from './errorBox.module.css';

export function ErrorBox({textError, visible = false, width = "350px"}){
    const [boxVisible, setBoxVisible] = useState(visible);
    const [text, setText] = useState(textError);

    useEffect(() => {
        setBoxVisible(visible);
        setText(textError);
    }, [visible]);

    const styleBox = {
        width: width
    }

    return <div>
        {boxVisible && <div className={style.overlay} style={styleBox} >
            <h3 className={style.title}>Erro</h3>
            <div className={style.box}>
                <p className={style.paragraph}>{text}</p>
            </div>
        </div>}
    </div>;
}