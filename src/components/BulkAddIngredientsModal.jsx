import { useState } from "react";
import AutosizingTextArea from "./AutosizingTextArea/AutosizingTextArea";
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

const BulkAddIngredientsModal = ({ show, sectionIdx, handleClose, handleSave }) => {
    const [input, setInput] = useState();

    //  TODO: add to section
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add Ingredients in Bulk</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <AutosizingTextArea
                    value={input}
                    placeholder={'Paste Ingredients in Bulk, Separated by line'}
                    preserveLineBreaks
                    onChange={(text) => {
                        setInput(text);
                    }} />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Discard
                </Button>
                <Button variant="primary" onClick={() => handleSave(sectionIdx, input)}>
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default BulkAddIngredientsModal;