import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { parseString } from "../../../../../../utils/util.jsx";
import style from '../../styles/actions.module.css';

import { update, getById } from "../../../../../../api/controllers/products.api.js";
import { getProduct } from "../../../../../../mocks/controllers/control.js";

import { Header } from "../../../../../../components/layout/Header/header.jsx";
import { Input } from "../../../../../../components/ui/Input/input.jsx";
import { Button } from "../../../../../../components/ui/Button/button.jsx";
import { ErrorBox } from "../../../../../../components/ui/ErrorBox/errorBox.jsx";

export function EditItem() {
    const [product, setProduct] = useState({});
    const [error, setError] = useState("");
    const [boxVisible, setBoxVisible] = useState(false);

    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        try {
            // setProduct(getById(id).data);
            setProduct(getProduct(parseInt(id)));
        } catch (e) {
            alert("Erro ao buscar o produto.");
            navigate("/home/verificar-estoque");
        }
    }, [navigate]);

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");

    function handlerExit() {
        navigate("/home/verificar-estoque");
    }

    async function handlerRegister() {
        if (price === "" || name === "") {
            setError("Você deve preencher todos os campos.");
            setBoxVisible(true);
        } else {
            try {
                const response = await update(product.id, {
                    "id": product.id,
                    "name": name,
                    "quantity": product.quantity,
                    "price": parseFloat(price)
                });

                if(response.status !== 200){
                    setError(`Não foi possível concluir a operação: ${response.data.message}`)
                    setBoxVisible(true);
                }
            } catch (e) {
                setError(e)
                setBoxVisible(true);
            }
        }
    }

    async function saveAndExit() {
        await handlerRegister();
        handlerExit();
    }

    return <div className={style.primeContainer}>
        <Header title="ARMAZÉM > VERIFICAR PRODUTO > EDITAR"/>
        <div className={style.boxContent}>
            <div>
                <h2 className={style.paragraph} style={{margin: "0 0 5px 0"}}>Nome do produto</h2>
                <Input
                    width="650px"
                    worth={product.name}
                    onChange={(valor) => setName(valor)}/>

                <h2 className={style.paragraph}>Valor unitário do produto (R$)</h2>
                <Input
                    width="650px"
                    worth={product.price}
                    onChange={(valor) => setPrice(valor)}/>

                <h2 className={style.paragraph} style={{color: "#9e9e9e"}}>Código do produto</h2>
                <Input
                    width="650px"
                    worth={parseString(product.id)}
                    disabled={true}/>
            </div>
            <div className={style.boxSpacer}></div>
            <div className={style.boxButtons}>
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