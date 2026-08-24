import { createContext, useContext, useState } from "react";
import { Modal } from "../components/ui/Modal/modal.jsx";

const ModalContext = createContext(null);

export function Provider({ children }) {
    const [modal, setModal] = useState({
        isOpen: false,
        title: "",
        text: "",
    });

    function openModal({ title, text }) {
        setModal({
            isOpen: true,
            title,
            text,
        });
    }

    function closeModal() {
        setModal({
            isOpen: false,
            title: "",
            text: "",
        });
    }

    return (
        <ModalContext.Provider value={{ openModal, closeModal }}>
            {children}

            {modal.isOpen && (
                <Modal
                    title={modal.title}
                    text={modal.text}
                    onClick={closeModal}
                />
            )}
        </ModalContext.Provider>
    );
}

export function useModal() {
    return useContext(ModalContext);
}