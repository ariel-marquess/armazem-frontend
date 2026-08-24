import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { auth } from "../../../utils/util.jsx";

import { deleteById, getById } from "../../../api/endpoints/products.api.js";
import { getProduct } from "../../../mocks/controllers/control.js";

import { Button } from "../../../components/ui/Button/button.jsx";

export function RemoveItem() {
    auth();

    const [product, setProduct] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        try {
            const {id} = useParams();
            // setProduct(getById(id).data);
            setProduct(getProduct(id));
        } catch (e) {
            alert("Erro ao buscar o produto.");
            handlerExit()
        }
    }, [navigate]);

    function handlerDelete() {
        try {
            deleteById(product.id).then();
        } catch (e) {
            alert("Erro ao excluir o produto.");
        } finally {
            handlerExit();
        }
    }

    function handlerExit() {
        navigate("/home/verificar-estoque");
    }

    return <div>
        <div>
            <h1>CONFIRMAR EXCLUSÃO DO PRODUTO?</h1>
            <h2>({product.name})</h2>

            <Button
                text="Confirmar"
                onClick={handlerDelete}/>

            <Button
                text="Cancelar"
                onClick={handlerExit}/>
        </div>
    </div>
}