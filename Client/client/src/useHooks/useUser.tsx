import { useContext, useEffect, useState } from 'react';
import {UserContext} from '../context';
import { UserProfile } from '../models/UserProfile';
import useFetch from './useFetch';

export default function useUser(){
    const fetch = useFetch();
    const { user, setUser } = useContext(UserContext);
    
    const setProfile = (user:UserProfile) => {
        setUser(user);
        
        localStorage.setItem('User', JSON.stringify(user));
    }

    
    const getProfile = ()=> {
        console.log("user " + (user as UserProfile).username)
        if(!user)
        { 
            console.log("no user")
            setUser(JSON.parse(localStorage.getItem('User') as string))
        }
        
        return user;
    }
    
    return{
        setProfile,
        profile: user as UserProfile
    }
}