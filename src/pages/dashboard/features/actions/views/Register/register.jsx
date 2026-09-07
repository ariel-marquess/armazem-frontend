import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { parseString } from "../../../../../../utils/util.jsx";
import style from '../../styles/actions.module.css';

import { create, lastId } from "../../../../../../api/controllers/products.api.js";

import { Header } from "../../../../../../components/layout/Header/header.jsx";
import { Input } from "../../../../../../components/ui/Input/input.jsx";
import { Button } from "../../../../../../components/ui/Button/button.jsx";
import { ErrorBox } from "../../../../../../components/ui/ErrorBox/errorBox.jsx";


export function Register() {
    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [price, setPrice] = useState("");
    const [id, setId] = useState(0);

    const [error, setError] = useState("");
    const [boxVisible, setBoxVisible] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        async function loadLastId() {
            try {
                const response = await lastId();
                setId(response.data.id);
            } catch (e) {
                alert("Erro ao carregar as informações dos produtos.");
                navigate("/");
            }
        }

        loadLastId();
    }, [navigate]);

    function idGenerator() {
        lastId().then((response) => setId(response.data.id));
    }

    function handlerExit() {
        navigate("/home");
    }

    async function handlerRegister() {
        if (quantity === "" || price === "" || name === "") {
            setError("Você deve preencher todos os campos.");
            setBoxVisible(true);
        } else {
            try {
                const response = await create({
                    "name": name,
                    "quantity": parseInt(quantity),
                    "price": parseFloat(price)
                });

                if(response.status !== 201){
                    setError(`Não foi possível concluir a operação: ${response.data.message}`)
                    setBoxVisible(true);
                }
            } catch (e) {
                setError(e)
                setBoxVisible(true);
            }
        }
    }

    function handlerNull() {
        idGenerator();
        setName("");
        setQuantity("");
        setPrice("");
        setBoxVisible(false)
    }

    async function saveAndContinue() {
        await handlerRegister();
        handlerNull();
    }

    async function saveAndExit() {
        await handlerRegister();
        handlerExit();
    }

    return <div className={style.primeContainer}>
        <Header title="ARMAZÉM > CADASTRAR NOVO PRODUTO"/>
        <div className={style.boxContent}>
            <div>
                <h2 className={style.paragraph} style={{margin: "0 0 5px 0"}}>Nome do produto</h2>
                <Input
                    width="650px"
                    onChange={(valor) => setName(valor)}/>

                <h2 className={style.paragraph}>Quantidade</h2>
                <Input
                    width="650px"
                    onChange={(valor) => setQuantity(valor)}/>

                <h2 className={style.paragraph}>Valor unitário do produto</h2>
                <Input
                    width="650px"
                    onChange={(valor) => setPrice(valor)}/>

                <h2 className={style.paragraph} style={{color: "#9e9e9e"}}>Código do produto</h2>
                <Input
                    width="650px"
                    worth={parseString(id)}
                    disabled={true}/>
            </div>
            <div className={style.boxSpacer}></div>
            <div className={style.boxButtons}>
                <Button
                    text="Salvar e continuar cadastrando"
                    onClick={saveAndContinue}/>

                <Button
                    text="Salvar e voltar"
                    onClick={saveAndExit}/>

                <Button
                    text="Voltar"
                    onClick={handlerExit}/>

                <div className={style.boxError}>
                    <ErrorBox textError={error} visible={boxVisible}/>
                </div>
            </div>
        </div>
    </div>
}