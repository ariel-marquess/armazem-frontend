import style from './header.module.css';
import { Button } from '../../ui/Button/button.jsx';

export function Header({title}) {
    return <div className={style.header}>
        <h1 className={style.title}>{title}</h1>
        <Button text="Sair" width="200px"/>
    </div>
}