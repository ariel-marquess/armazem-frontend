import { createPortal } from "react-dom";
import style from './modal.module.css';

import { Button } from "../Button/button.jsx";

export function Modal({title, text, onClick}){
    return createPortal(<div className={style.overlay}>
        <div className={style.modal}>
            <div className={style.boxCenter}>
                <h1 style={{margin: "0px", padding: "0px"}}>{title}</h1>
            </div>

            <p className={style.paragraph}>{text}</p>
            <div className={style.boxCenter}>
                <Button
                    text="OK"
                    width="200px"
                    onClick={onClick}/>
            </div>
        </div>
    </div>, document.getElementById('modal-root'))
}