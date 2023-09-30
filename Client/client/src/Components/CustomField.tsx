import '../Style/CustomField.css';
import React, { useRef } from "react";

export default function CustomField({label="", placeholder="", type="text", id="", name="", className="", fileTypes="", autocomplete="off"}) { 

    const refInput = useRef<HTMLInputElement>(null); //for functional component we need to use useRef
    function setFieldPlaceholder(placeholder:string)
    {
        (refInput.current as HTMLInputElement).placeholder = placeholder;
    }

    return ( 
        <div className={`component-textfield ${className}`}>
            <label htmlFor={id} className='component-textfield-element component-label'>{label}</label>
            <input ref={refInput} name={name} autoComplete={autocomplete} accept={fileTypes} type={type} id={id} placeholder={placeholder} className='component-textfield-element component-input'/>
        </div>
    );
}

