import PrimaryButton from './PrimaryButton';
import '../Style/Toast.css';
import React, {useState} from "react";
import parse from "html-react-parser"
import ReactDOM from "react-dom";

export default function Toast({className=""}) { 
    return (    
        <div id="component-toast" className={`component-toast component-toast-hide ${className}`} onClick={()=> closeToast()}>
            <p id='component-toast-message' className='component-toast-message'></p>
        </div>
    );
}

export function openToast(message:string) {
    if(message != "" && message != null)
    {
        console.log("[TOAST] :" + message)
        const toast = (document.getElementById("component-toast") as HTMLElement);
        (document.getElementById("component-toast-message") as HTMLElement).textContent = message;
    
        toast.classList.remove("component-toast-hide");
        toast.classList.add("component-toast-show");
    
        setTimeout(() => {
            closeToast();
        }, 2000);
    }
}

export function closeToast() {
    const toast = (document.getElementById("component-toast") as HTMLElement);
    toast.classList.remove("component-toast-show");
    toast.classList.add("component-toast-hide");
}

