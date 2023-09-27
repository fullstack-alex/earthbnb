import '../Style/CustomButton.css';
import React from "react";

export default function SecondaryButton({text = "", className = ""}) {  
    return (
        <div className={`component-button component-secondary-button ${className}`}>
            <p className='component-button-text'>{text}</p>
        </div>
    );
    
}

