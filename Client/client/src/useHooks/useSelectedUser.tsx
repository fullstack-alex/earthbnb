import { useContext, useEffect, useState } from 'react';
import {SelectedUserContext} from '../context';
import { UserProfile } from '../models/UserProfile';
import useFetch from './useFetch';

export default function useSelectedUser(){
    const { selectedUser, setSelectedUser } = useContext(SelectedUserContext);
    
    const setSelectedProfile = (user:UserProfile) => {
        setSelectedUser(user);
        
        localStorage.setItem('SelectedUser', JSON.stringify(user));
    }

    
    const getSelectedProfile = ()=> {
        let newUser:UserProfile = selectedUser as UserProfile;
        if(!newUser.username)
        { 
            newUser = JSON.parse(localStorage.getItem('SelectedUser') as string);
            setSelectedUser(newUser)
        }

        return newUser;
    }
    
    return{
        setSelectedProfile,
        selectedProfile: getSelectedProfile() as UserProfile
    }
}