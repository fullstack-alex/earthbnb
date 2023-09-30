import '../Style/NavMenu.css';
import React, { useEffect, useState } from "react";
import Logo from './Logo';
import PrimaryButton from './PrimaryButton';
import CustomField from './CustomField';
import {UserState} from "./App"
import useNavigation from "../useHooks/useNavigation";
import useSession from '../useHooks/useSession';
import useUser from '../useHooks/useUser';
import { useRef } from 'react';
import jwt_decode from "jwt-decode";
import useFetch from '../useHooks/useFetch';
import {Credentials} from "../models/Credentials";
import { openToast } from './Toast';
import { UserProfile, Role } from '../models/UserProfile';

export default function NavMenu({className="", userState=UserState.NOT_LOGGED_IN, setUserState=()=>{}}) {  
    const session = useSession();
    const navigation = useNavigation();
    const refProfile = useRef(null);
    const fetch = useFetch();
    const user = useUser();

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
                const res = await fetch.post('/UserProfile/getUser', {'username': decoded.name});

                let userProfile:UserProfile = await res.json().then() as UserProfile;
                
                user.setProfile(userProfile);

                if(userProfile.role == Role.Admin)
                {
                    navigation.navigate("/admin");
                }
                else
                {
                    navigation.navigate("/");
                }
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
                        navigation.navigate("/")
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
