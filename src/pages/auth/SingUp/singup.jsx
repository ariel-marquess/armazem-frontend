import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { useModal } from "../../../contexts/ModalContext.jsx";
import style from './singup.module.css';

import { createAccount } from "../../../api/controllers/users.api.js";

import { Input } from "../../../components/ui/Input/input.jsx";
import { Button } from "../../../components/ui/Button/button.jsx";

export function SingUp() {
    const [name, setName] = useState("");
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [revealPassword, setRevealPassword] = useState(false);

    const { openModal } = useModal();
    const navigate = useNavigate();

    function goLogin() {
        navigate("/");
    }

    async function create() {
        if (name === "" || login === "" || password === "" || confirmPassword === "") {
            openModal({
                title: "Campos vazios",
                text: "Existem campos vazios. Por favor, preencha todos os campos."
            });
            return;
        }

        if (password !== confirmPassword) {
            openModal({
                title: "Falha de autenticação",
                text: "Os campos 'senha' e 'confirmar senha' estão distintos. Por favor, verifique os campos e tente novamente."
            });
            return;
        }

        try {
            await createAccount({
                name: name,
                login: login,
                password: password
            });

            navigate("/");
        } catch (e) {
            openModal({
                title: "Erro ao cadastrar",
                text: e.response?.data?.message ?? "Não foi possível concluir o cadastro."
            });
        }
    }

    return <div className={style.primeContainer}>
        <div className={style.boxSpacer}>
            <Button
                text="Voltar"
                width="150px"
                margin="20px"
                onClick={goLogin}/>
        </div>
        <div className={style.box}>
            <div className={style.container}>
                <h1 className={style.title}>Cadastrar novo usuário</h1>

                <h2 className={style.paragraph}>Nome completo</h2>
                <Input
                    placeholder="Digite seu nome completo..."
                    width="400px"
                    onChange={(valor) => setName(valor)}/>

                <h2 className={style.paragraph}>Login</h2>
                <Input
                    placeholder="Digite seu e-mail..."
                    width="400px"
                    onChange={(valor) => setLogin(valor)}/>

                <div className={style.boxPassword}>
                    <h2 className={style.paragraph} style={{margin: "0 0 3px 0"}}>Senha</h2>
                    <Input
                        placeholder="Digite sua senha..."
                        width="100%"
                        revealPassword={revealPassword}
                        onChange={(valor) => setPassword(valor)}/>

                    <h2 className={style.paragraph}>Confirmar senha</h2>
                    <Input
                        placeholder="Confirme sua senha..."
                        width="100%"
                        revealPassword={revealPassword}
                        onChange={(valor) => setConfirmPassword(valor)}/>

                    <div className={style.checkBox}>
                        <input
                            className={style.input}
                            type="checkbox"
                            id="revealPassword"
                            checked={revealPassword}
                            onChange={() => setRevealPassword(!revealPassword)}/>
                        <label htmlFor="revealPassword" className={style.label}>Mostrar senha</label>
                    </div>
                </div>

                <div>
                    <Button
                        text="Cadastrar"
                        width="400px"
                        margin="30px 0 0 0"
                        onClick={create}/>
                </div>
            </div>
        </div>
        <div className={style.boxSpacer}></div>
    </div>
}