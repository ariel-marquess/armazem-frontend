import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { auth } from "../../../utils/util.jsx";

import { update, getById } from "../../../api/endpoints/products.api.js";
import { getProduct } from "../../../mocks/controllers/control.js";

import { Header } from "../../../components/layout/Header/header.jsx";
import { Input } from "../../../components/ui/Input/input.jsx";
import { Button } from "../../../components/ui/Button/button.jsx";
import { ErrorBox } from "../../../components/ui/ErrorBox/errorBox.jsx";

export function EditItem() {
    auth();

    const [product, setProduct] = useState({});
    const [error, setError] = useState("");
    const [boxVisible, setBoxVisible] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        try {
            const { id } = useParams();
            // setProduct(getById(id).data);
            setProduct(getProduct(id));
        } catch (e) {
            alert("Erro ao buscar o produto.");
            handlerExit()
        }
    }, [navigate]);

    const [name, setName] = useState(product.name);
    const [price, setPrice] = useState(product.price);
    const [id, setId] = useState(product.id);

    function handlerExit() {
        navigate("/home");
    }

    function handlerRegister() {
        if (price === "" || name === "") {
            setError("Você deve preencher todos os campos.");
            setBoxVisible(true);
        } else {
            try {
                const response = update(product.id, {
                    "id": product.id,
                    "name": name,
                    "quantity": product.quantity,
                    "price": parseFloat(price)
                }).then();

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

    function saveAndExit() {
        handlerRegister();
        handlerExit();
    }

    return <div>
        <Header title="ARMAZÉM > VERIFICAR PRODUTO > EDITAR"/>
        <div>
            <div>
                <h2>Nome do produto</h2>
                <Input
                    width="700px"
                    onChange={(valor) => setName(valor)}/>

                <h2>Valor unitário do produto</h2>
                <Input
                    width="700px"
                    onChange={(valor) => setPrice(valor)}/>

                <h2>Código do produto</h2>  // Deve ter a cor #9e9e9e
                <Input
                    width="700px"
                    worth={id}
                    disabled={true}/>
            </div>

            <div>
                <Button
                    text="Salvar e sair"
                    onClick={saveAndExit}/>

                <Button
                    text="Sair"
                    onClick={handlerExit}/>

                <ErrorBox textError={error} visible={boxVisible}/>
            </div>
        </div>
    </div>
}