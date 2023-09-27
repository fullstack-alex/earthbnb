import '../Style/Logo.css';
import React from "react";

export default function Logo({className=""}) {  
    return (
        <div className={`component-logo ${className}`}>
           <p className='component-logo-text'>EarthBNB</p>
        </div>
    );
}

