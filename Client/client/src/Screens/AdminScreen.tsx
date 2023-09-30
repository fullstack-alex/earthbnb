import PrimaryButton from '../Components/PrimaryButton';
import UserComponent from '../Components/UserComponent';
import '../Style/AdminScreen.css';
import React, { useEffect, useState } from "react";
import useUser from '../useHooks/useUser';
import useFetch from '../useHooks/useFetch';
import { UserProfile } from '../models/UserProfile';
import UserPage from '../Components/UserPage';
import { Route, useNavigate } from 'react-router-dom';
import useNavigation from '../useHooks/useNavigation';
import useSelectedUser from '../useHooks/useSelectedUser';
import exportFromJSON from "export-from-json";

export default function AdminScreen({className=""}) { 
    let allUsers:UserProfile[] = [];
    function Users() {
        const [users, setUsers] = useState<UserProfile[]>([]);
        const user = useUser();
        const fetch = useFetch();
        const navigation = useNavigation();
        const selectedUser = useSelectedUser();
      
        useEffect(() => {
            async function getUsers()
            {
                let newUser:UserProfile = user.profile;
                if(!user.profile.username)
                { 
                    newUser = JSON.parse(localStorage.getItem('User') as string)
                    user.setProfile(newUser)
                }

                const users = await fetch.post('/UserProfile/getUsers', newUser).then(res=>res.json()) as UserProfile[];
                setUsers(users);
            }

            getUsers();
        }, []);

        allUsers = users;
        
        if(users.length > 0)
        {
            return (
                <div>
                    {users.map(user=>(
                        <PrimaryButton key={user.username} text={user.username} className='component-user' onclick={()=>{
                            selectedUser.setSelectedProfile(user);
                            navigation.navigate("/admin/userpage");
                        }
                        }/>
                    ))}
                </div>
            );
        }
      }

      

    const saveToJson = ()=>
    {
        // const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
        //   JSON.stringify(allUsers)
        // )}`;
        // const link = document.createElement("a");
        // link.href = jsonString;
        // link.download = "users.json";
    
        // link.click();
    }
  
    const saveToXml = ()=>
    {
        // exportFromJSON({data:allUsers, fileName:"users", exportType:"xml"})
    }
    
    return (
        <div className="component-adminScreen">
            <div className='component-admin-container'>
                <div className='component-users-container'>
                    <Users/>
                </div>
                <div className='component-export-buttons-container'>
                    <PrimaryButton onclick={saveToJson} text="EXPORT TO JSON" className='component-export-buttons component-export-json'/>
                    <PrimaryButton onclick={saveToXml} text="EXPORT TO XML" className='component-export-buttons component-export-xml'/>
                </div>  
            </div>
        </div>
    );
    
}

