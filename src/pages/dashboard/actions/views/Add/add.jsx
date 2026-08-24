import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {auth, parseString} from "../../../../../utils/util.jsx";
import style from '../../styles/actions.module.css';

import { getAll, changeQuantity } from "../../../../../api/endpoints/products.api.js";
import { getProducts } from "../../../../../mocks/controllers/control.js";

import { Header } from "../../../../../components/layout/Header/header.jsx";
import { Input } from "../../../../../components/ui/Input/input.jsx";
import { Button } from "../../../../../components/ui/Button/button.jsx";
import { MenuButton } from "../../../../../components/ui/MenuButton/menuButton.jsx";
import { ErrorBox } from "../../../../../components/ui/ErrorBox/errorBox.jsx";

export function Add() {
    const [products, setProducts] = useState([]);
    const [product, setProduct] = useState(null);

    const [quantity, setQuantity] = useState("");
    const [error, setError] = useState("");
    const [boxVisible, setBoxVisible] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        try {
            const response = getProducts();
            //const response = await getAll();
            setProducts(response.data);
        } catch (e) {
            alert("Erro ao carregar as informações dos produtos.");
            navigate("/");
        }
    }, [navigate]);

    function handlerExit() {
        navigate("/home");
    }

    async function handlerAdd() {
        if (quantity === "" || !product) {
            setError("Você deve preencher todos os campos.");
            setBoxVisible(true);
        } else {
            try {
                const response = await changeQuantity(product.id, {
                    "op": "add",
                    "quantity": parseInt(quantity)
                });

                if (response.status !== 200) {
                    setError(`Não foi possível concluir a operação: ${response.data.message}`)
                    setBoxVisible(true);
                    return false;
                }

                return true;
            } catch (e) {
                setError(e)
                setBoxVisible(true);
            }
        }
    }

    function handlerNull() {
        setQuantity("");
        setBoxVisible(false)
    }

    async function saveAndContinue() {
        const success = await handlerAdd();

        if (success) {
            handlerNull();
        }
    }

    async function saveAndExit() {
        const success = await handlerAdd();

        if (success) {
            handlerExit();
        }
    }

    return <div className={style.primeContainer}>
        <Header title="ARMAZÉM > ADICIONAR AO ESTOQUE"/>
        <div className={style.boxContent}>
            <div>
                <h2 className={style.paragraph} style={{margin: "0 0 5px 0"}}>Produto</h2>
                <MenuButton objects={products} onChange={(valor) => setProduct(valor)}/>

                <h2 className={style.paragraph}>Quantidade a ser adicionada</h2>
                <Input
                    width="650px"
                    onChange={(valor) => setQuantity(valor)}/>

                <h2 className={style.paragraph} style={{color: "#9e9e9e"}}>Valor unitário do produto</h2>
                <Input
                    width="650px"
                    worth={`R$ ${product?.price ?? 0.0}`}
                    disabled={true}/>

                <h2 className={style.paragraph} style={{color: "#9e9e9e"}}>Código do produto</h2>
                <Input
                    width="650px"
                    worth={parseString(product?.id ?? 0)}
                    disabled={true}/>
            </div>
            <div className={style.boxSpacer}></div>
            <div className={style.boxButtons}>
                <Button
                    text="Salvar e continuar removendo"
                    onClick={saveAndContinue}/>

                <Button
                    text="Salvar e voltar"
                    onClick={saveAndExit}/>

                <Button
                    text="Voltar"
                    onClick={handlerExit}/>

                <ErrorBox textError={error} visible={boxVisible}/>
            </div>
        </div>
    </div>
}