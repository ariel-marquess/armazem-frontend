import { useNavigate } from "react-router-dom";
import style from './header.module.css';

import { Button } from '../../ui/Button/button.jsx';

export function Header({title, notHome = true}) {
    const navigate = useNavigate();

    function handlerExit() {
        navigate("/");
    }

    return <div className={style.header}>
        <h1 className={style.title}>{title}</h1>
        {
            notHome && <Button
                text="Sair"
                width="200px"
                margin="0px 30px 0px 0px"
                onClick={handlerExit}/>
        }
    </div>
}