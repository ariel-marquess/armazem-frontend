import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../../contexts/ModalContext.jsx";
import { auth } from "../../../utils/util.jsx";
import style from './check.module.css';

import { getAll } from "../../../api/endpoints/products.api.js";
import { getProducts } from "../../../mocks/controllers/control.js";

import { Header } from "../../../components/layout/Header/header.jsx";
import { Button } from "../../../components/ui/Button/button.jsx";
import { Input } from "../../../components/ui/Input/input.jsx";
import { Table } from "../../../components/ui/Table/table.jsx";

export function Check() {
    auth();

    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [idSearch, setIdSearch] = useState(0);
    const { openModal } = useModal();

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

    function handlerExit() {
        navigate('/home');
    }

    function searchProduct() {
        const product = products.find(product => product.name === search);

        if (product){
            setIdSearch(product.id);
        } else {
            if (search !== "") {
                openModal({
                    title: "Produto não encontrado",
                    text: "Você deve gigitar exatamente o nome do produto (respeite o uso de maiúculas, acentos e símbolos)."
                })
            } else {
                setIdSearch(0)
            }
        }
    }

    return <div className={style.primeContainer}>
        <Header title="ARMAZÉM > VERIFICAR ESTOQUE"/>

        <div className={style.boxContent}>
            <div className={style.boxOptions}>
                <div className={style.boxSearch}>
                    <Input
                        placeholder="Digite exatamente o nome do produto..."
                        width="710px"
                        onChange={(valor) => setSearch(valor)}/>

                    <Button
                        text="Pesquisar"
                        width="200px"
                        margin="0px 0px 0px 10px"
                        fontSize="16px"
                        onClick={searchProduct}/>
                </div>
                <div className={style.boxGoBack}>
                    <Button
                        text="Voltar"
                        width="200px"
                        fontSize="16px"
                        margin="0px"
                        onClick={handlerExit}/>
                </div>
            </div>

            <div className={style.boxTableContainer}>
                <div className={style.boxHeaderTable}>
                    <div className={style.boxHeader} style={products.length > 10 ? {maxWidth: "calc(100vw - 395px)"} : {maxWidth: "calc(100vw - 380px)"}}>
                        <div className={style.boxCell} style={{minWidth: "100px"}}>
                            <h2 className={style.titleHeader}>CÓDIGO</h2>
                        </div>
                        <div className={style.boxCell} style={{width: "100%"}}>
                            <h2 className={style.titleHeader}>PRODUTO</h2>
                        </div>
                        <div className={style.boxCell} style={{minWidth: "150px"}}>
                            <h2 className={style.titleHeader}>QUANTIDADE</h2>
                        </div>
                        <div className={style.boxCell} style={{minWidth: "200px"}}>
                            <h2 className={style.titleHeader}>VALOR UNITÁRIO (R$)</h2>
                        </div>
                        <div className={style.boxCell} style={{minWidth: "200px"}}>
                            <h2 className={style.titleHeader}>VALOR TOTAL (R$)</h2>
                        </div>
                    </div>
                    <div className={style.boxSpace}></div>
                </div>

                <Table products={products} idSearch={idSearch}/>
            </div>
        </div>
    </div>
}