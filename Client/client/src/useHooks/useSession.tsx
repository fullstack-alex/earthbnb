import { JsonWebKeyInput } from "crypto";
import { JwtPayload } from "jwt-decode";
import { useState } from "react";
import Cookies from "universal-cookie"

export default function useSession(){
    const cookies = new Cookies(null, { path: '/' });
    const [token, setToken] = useState('');

    const getToken = () => {
        // const tokenJSON:string|null|undefined = cookies.get('Authorization');
        // console.log(tokenJSON);
        const tokenJSON:string|null|undefined = localStorage.getItem('Authorization');
        return tokenJSON;
    }

    const saveToken = (userToken:any) => {
        localStorage.setItem('Authorization', JSON.stringify(userToken));
        // cookies.set('Authorization', JSON.stringify(userToken));
        setToken(userToken.token);
    }

    const deleteToken = () => {
        // cookies.remove('Authorization');
        localStorage.removeItem('Authorization');
        setToken('');
    }

    const isValid = () => {
        let token = getToken();
        return token && token  != '';
        // return token || token != '';
    }

    return {
        setToken: saveToken,
        getToken,
        deleteToken,
        isValid,
        token
    }
}