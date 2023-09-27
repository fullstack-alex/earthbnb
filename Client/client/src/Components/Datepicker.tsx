import '../Style/Datepicker.css';
import React from "react";
import CustomField from './CustomField';

export default function Datepicker({label="", placeholder="", id="", className="", labelDate=""}) { 
    return ( 
        <div className='component-datepicker'>
            <p className='component-datepicker-label'>{labelDate}</p>
            <CustomField type="date" id={id} className={`component-datepicker-field ${className}`} placeholder={placeholder} label={label}/>
        </div>
    );
}

