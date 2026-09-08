import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import style from './removeitem.module.css'

import { deleteById, getById } from "../../../../../../api/controllers/products.api.js";

import { Button } from "../../../../../../components/ui/Button/button.jsx";

export function RemoveItem() {
    const [product, setProduct] = useState({});
    const navigate = useNavigate();

    const { id } = useParams();

    useEffect(() => {
        async function loadProduct() {
            try {
                const response = await getById(id);
                setProduct(response.data);
            } catch (e) {
                alert("Erro ao buscar o produto.");
                navigate("/home/verificar-estoque");
            }
        }

        loadProduct();
    }, [navigate, id]);

    async function handlerDelete() {
        try {
            await deleteById(product.id);
            handlerExit();
        } catch (e) {
            alert("Erro ao excluir o produto.");
        }
    }

    function handlerExit() {
        navigate("/home/verificar-estoque");
    }

    return <div className={style.primeContainer}>
        <div className={style.boxContent}>
            <h1 className={style.paragraph}>CONFIRMAR EXCLUSÃO DO PRODUTO?</h1>
            <h2 className={style.paragraph} style={{margin: "0 0 20px 0"}}>({product.name})</h2>

            <Button
                text="Confirmar"
                onClick={handlerDelete}/>

            <Button
                text="Cancelar"
                onClick={handlerExit}/>
        </div>
    </div>
}