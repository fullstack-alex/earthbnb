import { useContext, useState } from 'react';
import {UserContext} from '../context';

export default function useUser(){
    const { user, setUser } = useContext(UserContext);
  
    const setProfile = (user:any) => {
      setUser(user);
    }
  
    return{
        setProfile,
        user
    }
}