import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { parseString } from "../../../../../../utils/util.jsx";
import style from '../../styles/actions.module.css';

import { changeQuantity, getAll } from "../../../../../../api/controllers/products.api.js";

import { Header } from "../../../../../../components/layout/Header/header.jsx";
import { MenuButton } from "../../../../../../components/ui/MenuButton/menuButton.jsx";
import { Input } from "../../../../../../components/ui/Input/input.jsx";
import { Button } from "../../../../../../components/ui/Button/button.jsx";
import { ErrorBox } from "../../../../../../components/ui/ErrorBox/errorBox.jsx";

export function Remove() {
    const [products, setProducts] = useState([]);
    const [product, setProduct] = useState(null);

    const [quantity, setQuantity] = useState("");
    const [error, setError] = useState("");
    const [boxVisible, setBoxVisible] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        async function loadProducts() {
            try {
                const response = await getAll();
                setProducts(response.data);
            } catch (e) {
                alert("Erro ao carregar as informações dos produtos.");
                navigate("/");
            }
        }

        loadProducts();
    }, [navigate]);

    function handlerExit() {
        navigate("/home");
    }

    async function handlerRemove() {
        if (quantity === "" || !product) {
            setError("Você deve preencher todos os campos.");
            setBoxVisible(true);
        } else {
            try {
                await changeQuantity(product.id, {
                    "op": "remove",
                    "quantity": parseInt(quantity)
                });

                return true;
            } catch (e) {
                setError(e.response?.data?.message ?? "Não foi possível concluir a operação.");
                setBoxVisible(true);
                return false;
            }
        }
    }

    function handlerNull() {
        setQuantity("");
        setBoxVisible(false)
    }

    async function saveAndContinue() {
        const success = await handlerRemove();

        if (success) {
            handlerNull();
        }
    }

    async function saveAndExit() {
        const success = await handlerRemove();

        if (success){
            handlerExit();
        }
    }

    return <div className={style.primeContainer}>
        <Header title="ARMAZÉM > REMOVER DO ESTOQUE"/>
        <div className={style.boxContent}>
            <div>
                <h2 className={style.paragraph} style={{margin: "0 0 5px 0"}}>Produto</h2>
                <MenuButton objects={products} onChange={(valor) => setProduct(valor)}/>

                <h2 className={style.paragraph}>Quantidade a ser removida</h2>
                <Input
                    width="650px"
                    onChange={(valor) => setQuantity(valor)}/>

                <h2 className={style.paragraph} style={{color: "#9e9e9e"}}>Valor unitário do produto</h2>
                <Input
                    width="650px"
                    worth={`R$ ${product?.price ?? 0.0}`}
                    disabled={true}/>

                <h2 className={style.paragraph} style={{color: "#9e9e9e"}}>Código do produto</h2>  {/*Deve ter a cor #9e9e9e*/}
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

                <div className={style.boxError}>
                    <ErrorBox textError={error} visible={boxVisible}/>
                </div>
            </div>
        </div>
    </div>
}