import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../../../../../contexts/ModalContext.jsx";
import style from './check.module.css';

import { getAll } from "../../../../../../api/controllers/products.api.js";

import { Header } from "../../../../../../components/layout/Header/header.jsx";
import { Button } from "../../../../../../components/ui/Button/button.jsx";
import { Input } from "../../../../../../components/ui/Input/input.jsx";
import { Table } from "../../../../../../components/ui/Table/table.jsx";

export function Check() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [idSearch, setIdSearch] = useState(0);
    const { openModal } = useModal();

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
        navigate('/home');
    }

    function searchProduct() {
        const normalizedSearch = search.trim().toLowerCase();

        if (normalizedSearch === "") {
            setIdSearch(0);
            openModal({
                title: "Campo vazio",
                text: "Digite o nome de um produto para pesquisar."
            });
            return;
        }

        const product = products.find(product =>
            product.name.trim().toLowerCase() === normalizedSearch
        );

        if (product) {
            setIdSearch(product.id);
        } else {
            setIdSearch(0);
            openModal({
                title: "Produto não encontrado",
                text: "Nenhum produto com esse nome foi encontrado."
            });
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
                        onSearch={searchProduct}
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