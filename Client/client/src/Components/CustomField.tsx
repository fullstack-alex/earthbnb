import '../Style/CustomField.css';
import React from "react";

export default function CustomField({label="", placeholder="", type="text", id="", name="", className="", fileTypes="", autocomplete="off"}) { 
    return ( 
        <div className={`component-textfield ${className}`}>
            <label htmlFor={id} className='component-textfield-element component-label'>{label}</label>
            <input name={name} autoComplete={autocomplete} accept={fileTypes} type={type} id={id} placeholder={placeholder} className='component-textfield-element component-input'/>
        </div>
    );
}

