import '../Style/CustomButton.css';
import React from "react";

export default function SecondaryButton({text = "", className = "", onclick=()=>{}}) {  
    return (
        <div onClick={onclick} className={`component-button component-secondary-button ${className}`}>
            <p className='component-button-text'>{text}</p>
        </div>
    );
    
}

