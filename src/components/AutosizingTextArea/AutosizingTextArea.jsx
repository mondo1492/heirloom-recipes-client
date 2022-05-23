import './AutosizingTextArea.css';
import { useState } from 'react';

const AutosizingTextArea = ({ value, onChange, placeholder, preserveLineBreaks = false }) => {
    const [pasted, setPasted] = useState(false);
    const ROWS = 4;

    const onPasteOrChange = e => {
        let text = e.target.value;
        let processedText = (pasted && !preserveLineBreaks) ? text?.replace(/\n/g, " ") : text;

        e.target.parentNode.dataset.replicatedValue = processedText;
        return processedText;
    }

    const handleChange = e => {
        let processedText = onPasteOrChange(e);
        onChange(processedText);
        setPasted(false);
    };

    const handlePaste = (e) => {
        onPasteOrChange(e);
        setPasted(true);
    };

    return (
        <div className="row flex-grow-1">
            <div className="col grow-wrap" id="main">
                <textarea
                    rows={ROWS}
                    name="text"
                    id="text"
                    value={value}
                    placeholder={placeholder}
                    className="form-control textarea"
                    onFocus={onPasteOrChange}
                    onPaste={handlePaste}
                    onChange={handleChange} />
            </div>
        </div>
    )
}

export default AutosizingTextArea;
