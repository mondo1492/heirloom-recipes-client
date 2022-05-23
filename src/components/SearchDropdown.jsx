import { useState, forwardRef, Children } from "react";
import Dropdown from 'react-bootstrap/Dropdown'
import FormControl from 'react-bootstrap/FormControl'
import COLORS from "../utils/colors";

// The forwardRef is important!!
// Dropdown needs access to the DOM node in order to position the Menu
const CustomToggle = forwardRef(({ children, onClick }, ref) => (
    <a
        href=""
        ref={ref}
        onClick={(e) => {
            e.preventDefault();
            onClick(e);
        }}
    >
        {children}
        &#x25bc;
    </a>
));

// forwardRef again here!
// Dropdown needs access to the DOM of the Menu to measure it
const CustomMenu = forwardRef(
    ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
        const [value, setValue] = useState('');

        return (
            <div
                ref={ref}
                style={style}
                className={className}
                aria-labelledby={labeledBy}
            >
                <FormControl
                    autoFocus
                    className="mx-3 my-2 w-auto"
                    placeholder="Type to filter..."
                    onChange={(e) => setValue(e.target.value)}
                    value={value}
                />
                <ul className="list-unstyled" style={{maxHeight: 400, overflow: 'auto'}}>
                    {Children.toArray(children).filter(
                        (child) =>
                            !value || child.props.children.toLowerCase().startsWith(value),
                    )}
                </ul>
            </div>
        );
    },
);


const SearchDropdown = ({ dropdownLabel, items, onSelect, selectedKey, drop }) => {
    return (
        <Dropdown onSelect={onSelect} drop={drop}>
            <Dropdown.Toggle style={{ minWidth: 200 }} variant="secondary" >
                {dropdownLabel}
            </Dropdown.Toggle>

            <Dropdown.Menu as={CustomMenu}>
                {items?.map(({ id, text }) => {
                    return (
                        <Dropdown.Item key={id} eventKey={id} active={selectedKey === id}>{text}</Dropdown.Item>
                    )
                })}
            </Dropdown.Menu>
        </Dropdown>
    )
}

export default SearchDropdown