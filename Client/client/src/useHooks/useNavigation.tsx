import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavigationContext } from '../context';

export default function useNavigation(){
    const { page, setPage } = useContext(NavigationContext);
    const routerNavigate = useNavigate();
  
    const navigate = (path:any) => {
      setPage(path);
      routerNavigate(path);
    }
  
    return{
        navigate,
        page
    }
}