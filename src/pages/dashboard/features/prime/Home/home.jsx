import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import style from './home.module.css';

import { getAll } from "../../../../../api/controllers/products.api.js";
import { getProducts } from "../../../../../mocks/controllers/control.js";

import { Header } from "../../../../../components/layout/Header/header.jsx";
import { Button } from "../../../../../components/ui/Button/button.jsx";
import { TableView } from "../../../../../components/ui/TableView/tableView.jsx";

export function Home() {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        try {
            const response = getProducts();
            //const response = getAll().then();
            setProducts(response.data);
        } catch (e) {
            alert("Erro ao carregar as informações dos produtos.");
            navigate("/");
        }
    }, [navigate]);

    function goRegister() {
        navigate("/home/cadastrar-produto");
    }

    function goAdd() {
        navigate("/home/adicionar-ao-estoque");
    }

    function goRemove() {
        navigate("/home/remover-do-estoque");
    }

    function goCheck() {
        navigate("/home/verificar-estoque");
    }

    function exit() {
        navigate("/");
    }

    return <div className={style.primeContainer}>
        <Header title="ARMAZÉM" notHome={false}/>

        <div className={style.boxContent}>
            <div className={style.boxButtons}>
                <Button
                    text="Cadastrar produto"
                    width="400px"
                    margin="0px 0px 10px 0px"
                    onClick={goRegister}/>

                <Button
                    text="Adicionar ao estoque"
                    width="400px"
                    onClick={goAdd}/>

                <Button
                    text="Remover do estoque"
                    width="400px"
                    onClick={goRemove}/>

                <Button
                    text="Verificar estoque"
                    width="400px"
                    onClick={goCheck}/>

                <div className={style.boxExit}>
                    <Button
                        text="Sair"
                        width="400px"
                        height="46px"
                        margin="10px 0px 0px 0px"
                        onClick={exit}/>
                </div>
            </div>
            <div className={style.boxSpacer}></div>
            <div className={style.boxView}>
                <div className={style.headerTable}>
                    <div className={style.headerCell} style={{width: "350px"}}>
                        <p>CÓDIGO</p>
                    </div>
                    <div className={style.headerCell} style={{width: "100%"}}>
                        <p>PRODUTO</p>
                    </div>
                    <div className={style.headerCell} style={{width: "350px"}}>
                        <p>QUANTIDADE</p>
                    </div>
                </div>

                <TableView products={products}/>
            </div>
        </div>
    </div>;
}