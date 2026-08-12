import { useState } from 'react';
import { Input } from '../../../components/ui/Input/input.jsx';
import { Button } from '../../../components/ui/Button/button.jsx';
import style from './login.module.css';

export function Login({}){
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");

    return <div className={style.box}>
        <div className={style.container}>
            <p className={style.paragraph}>Login</p>
            <Input
                placeholder="Digite seu e-mail..."
                padding="10px"
                margin="10px"
                width="490px"
                type="email"
                onChange={(valor) => setLogin(valor)}/>

            <p className={style.paragraph}>Senha</p>
            <Input
                placeholder="Digite sua senha..."
                padding="10px"
                margin="10px"
                width="490px"
                type="password"
                onChange={(valor) => setPassword(valor)}/>

            <Button
                text="ENTRAR"
                padding="10px"
                margin="10px"
                width="490px"/>
        </div>
    </div>
}