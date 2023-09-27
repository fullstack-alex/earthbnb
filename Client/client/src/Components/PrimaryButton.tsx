import '../Style/CustomButton.css';
import React from "react";

export default function PrimaryButton({text = "", className = "", onclick=()=>{}}) {  
    return (
        <div onClick={onclick} className={`component-button component-primary-button ${className}`}>
            <p className='component-button-text'>{text}</p>
        </div>
    );
}
