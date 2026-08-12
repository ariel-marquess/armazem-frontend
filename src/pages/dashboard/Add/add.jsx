import { useState } from "react";
import { Header } from "../../../components/layout/Header/header.jsx";
import { Input } from "../../../components/ui/Input/input.jsx";
import { Button } from "../../../components/ui/Button/button.jsx";

export function Add() {
    const [products, setProducts] = useState("");
    const [quantity, setQuantity] = useState("");

    return <div>
        <Header title="ARMAZÉM > ADICIONAR AO ESTOQUE"/>
        <div>
            <div>
                <h2>Produto</h2>
                // Adicionar uma lista suspensa comos produtos cadastrados

                <h2>Quantidade a ser adicionada</h2>
                <Input
                    placeholder="Exe.: 100"
                    padding="10px"
                    width="700px"
                    type="text"
                    onChange={(valor) => setQuantity(valor)}/>

                <h2>Valor unitário do produto</h2>
                <Input
                    placeholder=""
                    padding="10px"
                    width="700px"
                    type="text"/>

                <h2>Código do produto</h2>
                <Input
                    placeholder=""
                    padding="10px"
                    width="700px"
                    type="text"/>
            </div>

            <div>
                <Button
                    text="Salvar e continuar removendo"
                    width="570px"
                    margin="10px"
                    padding="10px"/>

                <Button
                    text="Salvar e sair"
                    width="570px"
                    margin="10px"
                    padding="10px"/>

                <Button
                    text="Sair"
                    width="570px"
                    margin="10px"
                    padding="10px"/>
            </div>
        </div>
    </div>
}