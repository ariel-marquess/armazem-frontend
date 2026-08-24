import { useState } from "react";
import style from './menuButton.module.css';

export function MenuButton({objects, onChange}) {
    const [value, setValue] = useState("");

    const handleChange = (e) => {
        const selectedId = e.target.value;
        const selectedObject = objects.find((obj) => String(obj.id) === selectedId);

        setValue(selectedId);

        if (onChange) {
            onChange(selectedObject);
        }
    }

    return <select
        className={style.menu}
        value={value}
        onChange={handleChange}>
        <option value="">Selecione um produto</option>
        {objects.map((obj) => <option key={obj.id} value={obj.id}>{obj.name}</option>)}
    </select>
}