import WelcomeScreen from '../Screens/WelcomeScreen';
import AdminScreen from '../Screens/AdminScreen';
import '../Style/App.css';
import React, { useEffect, useState } from "react"
import NavMenu from './NavMenu';
import SignUpScreen from '../Screens/SignUpScreen';
import HTTP from '../HTTP';
import { createContext } from 'react';
import { BrowserRouter, Routes, Route, Outlet, useLocation } from "react-router-dom";
import Toast, { openToast } from './Toast';
import useFetch from '../useHooks/useFetch';
import { NavigationContext, UserContext } from '../context';
import UserPage from './UserPage';
import { UserProfile } from '../models/UserProfile';


export enum UserState
{
    NOT_LOGGED_IN,
    LOGGED_IN,
}

export default function App() {
    const [ user, setUser ] = useState({});

    return (
        <div className="component-app">
            <UserContext.Provider value={{user, setUser}}>
                <BrowserRouter>
                  <Routes>
                        <Route index element={
                            <>
                                <NavMenu className='component-app-navmenu'/>
                                <WelcomeScreen className='component-app-welcomescreen'  />
                            </>
                        } />
                        <Route path='/signup' element={
                            <>
                                <NavMenu className='component-app-navmenu'/>
                                <div className='component-app-signupscreen-container'>
                                    <WelcomeScreen className='component-app-welcomescreen'  />
                                    <SignUpScreen className='component-app-signupscreen'/>
                                </div>
                            </>
                        } />
                        <Route path='/admin' element={
                            <>
                            <NavMenu className='component-app-navmenu'/>
                            <AdminScreen className='component-app-adminScreen'  />
                            </>
                        } />
                        <Route path='/admin/userpage' element={
                            <>
                            <NavMenu className='component-app-navmenu'/>
                                <div className='component-app-adminscreen-container'>
                                    <UserPage className='component-app-adminscreen-userpage'/>
                                </div>
                            </>
                        } />
                  </Routes>
                </BrowserRouter>
                    
                <Toast className='app-toastmessage'/>
            </UserContext.Provider>
        </div>
    );
    
}
