import SearchForm from '../Components/SearchForm';
import Toast from '../Components/Toast';
import '../Style/WelcomeScreen.css';
import React from "react";

export default function WelcomeScreen({className=""}) { 
    return (
        <div className="component-welcomeScreen">
            <SearchForm className={`welcomescreen-searchform ${className}`}/>
        </div>
    );
    
}

