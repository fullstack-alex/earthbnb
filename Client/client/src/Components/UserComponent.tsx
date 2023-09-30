import '../Style/UserComponent.css';
import React from "react";

export default function UserComponent({text = "", className = "", onclick=()=>{}}) {  
    return (
        <div onClick={onclick} className={`component-user ${className}`}>
        </div>
    );
}
