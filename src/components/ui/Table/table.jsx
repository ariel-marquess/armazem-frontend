import { useNavigate } from "react-router-dom";
import { parseString } from "../../../utils/util.jsx";
import style from './table.module.css';

import { Button } from "../Button/button.jsx";

export function Table({ products, idSearch }) {
    const navigate = useNavigate();

    function handlerEdit(id) {
        navigate(`/home/verificar-estoque/editar/${id}`);
    }

    function handlerRemove(id) {
        navigate(`/home/verificar-estoque/excluir/${id}`);
    }

    return <div className={style.table}>
        {products.map((product) => {
            const isEmbroidery = idSearch !== 0 && product.id === idSearch;
            const borderColor = isEmbroidery ? "#fff600" : "#ffffff";

            return <div className={style.line} key={product.id}>
                <div className={style.cell} style={{
                    minWidth: "100px",
                    borderColor: borderColor
                }}>
                    <p>{parseString(product.id)}</p>
                </div>

                <div className={style.cell} style={{
                    width: "100%",
                    borderColor: borderColor
                }}>
                    <p>{product.name}</p>
                </div>

                <div className={style.cell} style={{
                    minWidth: "150px",
                    borderColor: borderColor
                }}>
                    <p>{product.quantity}</p>
                </div>

                <div className={style.cell} style={{
                    minWidth: "200px",
                    borderColor: borderColor
                }}>
                    <p>{product.price.toFixed(2)}</p>
                </div>

                <div className={style.cell} style={{
                    minWidth: "200px",
                    borderColor: borderColor
                }}>
                    <p>{(product.price * product.quantity).toFixed(2)}</p>
                </div>

                <Button
                    text="Editar"
                    width="150px"
                    margin="0px"
                    padding="5px"
                    fontSize="16px"
                    onClick={() => handlerEdit(product.id)}/>

                <Button
                    text="Excluir"
                    width="150px"
                    margin="0px"
                    padding="5px"
                    fontSize="16px"
                    onClick={() => handlerRemove(product.id)}/>
            </div>
        })}
    </div>
}