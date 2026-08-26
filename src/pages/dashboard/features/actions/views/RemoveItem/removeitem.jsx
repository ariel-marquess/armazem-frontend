import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import style from './removeitem.module.css'

import { deleteById, getById } from "../../../../../../api/controllers/products.api.js";
import { getProduct } from "../../../../../../mocks/controllers/control.js";

import { Button } from "../../../../../../components/ui/Button/button.jsx";

export function RemoveItem() {
    const [product, setProduct] = useState({});
    const navigate = useNavigate();

    const { id } = useParams();

    useEffect(() => {
        try {
            // setProduct(getById(id).data);
            setProduct(getProduct(parseInt(id)));
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