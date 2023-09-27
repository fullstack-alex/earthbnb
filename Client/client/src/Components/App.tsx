import WelcomeScreen from '../Screens/WelcomeScreen';
import '../Style/App.css';
import React, { useEffect, useState } from "react"
import NavMenu from './NavMenu';
import SignUpScreen from '../Screens/SignUpScreen';
import HTTP from '../HTTP';
import { createContext } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Toast, { openToast } from './Toast';

export enum UserState
{
    NOT_LOGGED_IN,
    LOGGED_IN,
}

export default function App() {  
    return (
        <div className="component-app">
            
            <BrowserRouter>
              <Routes>
                    <Route index element={
                        <>
                        <NavMenu className='component-app-navmenu'/>
                        <WelcomeScreen className='component-app-welcomescreen'  />
                        </>
                    } />
                    <Route path='signup' element={
                        <>
                        <NavMenu className='component-app-navmenu'/>
                        <WelcomeScreen className='component-app-welcomescreen'  />
                        <SignUpScreen className='component-app-signupscreen'/>
                        </>
                    } />
              </Routes>
            </BrowserRouter>

            <Toast/>
        </div>
    );
    
}
