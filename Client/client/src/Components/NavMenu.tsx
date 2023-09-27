import '../Style/NavMenu.css';
import React, { useState } from "react";
import Logo from './Logo';
import SecondaryButton from './SecondaryButton';
import PrimaryButton from './PrimaryButton';
import CustomField from './CustomField';
import { Console } from 'console';
import HTTP from "../HTTP";
import { strict } from 'assert';
import {UserState} from "./App"
import useNavigation from "../useHooks/useNavigation";
import useSession from '../useHooks/useSession';
import useUser from '../useHooks/useUser';
import { useRef } from 'react';
import {toObject, getBase64} from '../utils'
import jwt_decode from "jwt-decode";
import useFetch from '../useHooks/useFetch';
import {Credentials} from "../models/credentials";
import { openToast } from './Toast';

export default function NavMenu({className="", userState=UserState.NOT_LOGGED_IN, setUserState=()=>{}}) {  
    const session = useSession();
    const navigation = useNavigation();
    const user = useUser()
    const refProfile = useRef(null);
    const fetch = useFetch();

    const login = async () =>{
        let username = (document.getElementById("username") as HTMLInputElement).value;
        let pass = (document.getElementById("password") as HTMLInputElement).value;
        
        if(pass != "" && username != "")
        {
            let cred:Credentials = new Credentials(username, pass);

            const resp = await fetch.post('/UserProfile/login', cred);
            
            if(resp.ok)
            {
                session.setToken(resp.headers.get("Authorization"));
            
                const decoded:any = jwt_decode(resp.headers.get("Authorization") as string);
                // const res = await fetch.post('/user/getUser', {'username': decoded.username});
                // user.setProfile(res);
            }
            else
            {
                const userMessage = resp.headers.get("UserMessage");
                openToast(userMessage as string);
            }
        }
        else if(username == "" && pass == "")
        {
            openToast("Missing username and password.");
        }
        else if(pass == "")
        {
            openToast("Missing password.");
        }
        else if(username == "")
        {
            openToast("Missing username.");
        }
    }

    if(session.isValid())
    {
        return (
            <div className={`component-navmenu ${className}`}>
                <Logo className="navmenu-logo"/>

                <div className='navmenu-logoutbutton' onClick={()=> {
                        session.deleteToken();
                        window.location.reload();
                    }}/>
            </div>
        );
    }
    else
    {
        return (
            <div className={`component-navmenu ${className}`}>
                <Logo className='navmenu-logo'/>
    
                <div className='component-controls-container'>
                    <div className='navmenu-login-container'>
                        <CustomField autocomplete="username" id="username" placeholder='Username' className='navmenu-textfield'/>
                        <CustomField id="password" type="password" placeholder='Password' className='navmenu-textfield'/>
                    </div>
                    <div className='navmenu-loginbutton' onClick={()=> {
                        login();
                    }}/>
                    <PrimaryButton text="Signup" className="navmenu-button-signup" onclick={()=> navigation.navigate('/signup')}/>
                </div>
            </div>
        );
    }
}

async function Login(onlogin = ()=>{})
{
    let username = (document.getElementById("username") as HTMLInputElement).value;
    let pass = (document.getElementById("password") as HTMLInputElement).value;

    await HTTP.Login(username, pass).then((loginResponse)=>
    {
        if(loginResponse != "")
        {
            const loggedInUser = sessionStorage.getItem("user");
            if (!loggedInUser) {
                sessionStorage.setItem('user', loginResponse as string);
            }
            onlogin();
        }
    });
}
