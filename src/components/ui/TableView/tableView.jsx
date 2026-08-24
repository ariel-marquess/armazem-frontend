import style from './tableView.module.css';
import { parseString } from "../../../utils/util.jsx";

export function TableView({products}) {
    return <div className={style.table}>
        { products.map((product) => <div className={style.line}>
            <div className={style.cell} style={{width: "350px"}}>
                <p className={style.text}>{parseString(product.id)}</p>
            </div>
            <div className={style.cell} style={{width: "100%"}}>
                <p className={style.text}>{product.name}</p>
            </div>
            <div className={style.cell} style={{width: "350px"}}>
                <p className={style.text}>{product.quantity}</p>
            </div>
        </div>)}
    </div>
}