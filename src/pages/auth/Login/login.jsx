import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useModal } from "../../../contexts/ModalContext.jsx";
import style from './login.module.css';

import { authenticate } from '../../../api/controllers/users.api.js';
import { authUser } from "../../../mocks/controllers/control.js";
import { setToken } from "../../../store/appStore.js";

import { Input } from '../../../components/ui/Input/input.jsx';
import { Button } from '../../../components/ui/Button/button.jsx';

export function Login({}){
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const { openModal } = useModal();

    const navigate = useNavigate();

    function handleSubmit() {
        if (login === "" || password === "") {
            openModal({
                title: "Campos vazios",
                text: "Existem campos vazios. Por favor, preencha todos os campos."
            });
        } else {
            try {
                // const response = authenticate(login, password);
                const response = authUser(login, password);

                if (response) {
                    setToken(response.data.token);
                    navigate("/home");
                }
            } catch (e) {
                openModal({
                    title: "Erro ao autenticar",
                    text: "Ocorreu um erro ao tentar autenticar. Por favor, verifique suas credenciais e tente novamente."
                });
            }
        }
    }

    return <div className={style.box}>
        <div className={style.container}>
            <p className={style.paragraph}>Login</p>
            <Input
                placeholder="Digite seu e-mail..."
                width="350px"
                type="email"
                onChange={(valor) => setLogin(valor)}/>

            <p className={style.paragraph}>Senha</p>
            <Input
                placeholder="Digite sua senha..."
                width="350px"
                type="password"
                onChange={(valor) => setPassword(valor)}/>

            <Button
                text="ENTRAR"
                width="350px"
                onClick={handleSubmit}/>
        </div>
    </div>
}