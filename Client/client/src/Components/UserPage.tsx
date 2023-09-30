import '../Style/UserPage.css';
import React, { useEffect } from "react";
import { Role, UserProfile } from '../models/UserProfile';
import PrimaryButton from './PrimaryButton';
import useNavigation from '../useHooks/useNavigation';
import useSelectedUser from '../useHooks/useSelectedUser';
import CustomField from './CustomField';
import useFetch from '../useHooks/useFetch';
import { openToast } from './Toast';


export default function UserPage(props:{className:string}) {  
    const navigation = useNavigation();
    const selectedUser = useSelectedUser();
    const imgSrc:string = "https://localhost:8080/" + selectedUser.selectedProfile.photoUrl;
    const fetch = useFetch();

    const getRoleString = (role:Role)=>
    {
        let roleString:string = "";
        if(role == 0)
        {
            roleString = "GUEST";
        }
        else if(role == 1)
        {
            roleString = "HOST";
        }
        else 
        {
            roleString = "ADMIN";
        }
        
        return roleString;
    }

    const getDisplayTrueClassName = (isForButton:boolean = false)=>
    {
        let className:string = "";
        
        if(isForButton && selectedUser.selectedProfile.role == 1 && !selectedUser.selectedProfile.isApprovedHost)
        {
            className = "enabled"
        }
        else if(!isForButton && selectedUser.selectedProfile.role == 1)
        {
            className = "enabled";
        }

        return className;
    }

    const getApprovedText = (isApproved:boolean)=>
    {
        let approvedStatusText:string = "";

        if(isApproved)
        {
            approvedStatusText = "APPROVED";
        }
        else 
        {
            approvedStatusText = "NOT APPROVED";
        }
        
        return approvedStatusText;
    }

    let approvedStatusText = getApprovedText(selectedUser.selectedProfile.isApprovedHost);

    const onApproveUser = async()=>
    {
        const res = await fetch.post("/UserProfile/approveHost", {'username': selectedUser.selectedProfile.username})
        let userProfile:UserProfile = await res.json().then() as UserProfile;
        console.log(userProfile.isApprovedHost);
        selectedUser.selectedProfile.isApprovedHost = userProfile.isApprovedHost;
        approvedStatusText = getApprovedText(userProfile.isApprovedHost);
        navigation.navigate("/admin");
        openToast("User " + selectedUser.selectedProfile.username + " approved as Host successfully", 5);
    }
    
    return (
        <div className={`component-userpage ${props.className}`}>
            <PrimaryButton className='component-userpage-backbutton' onclick={()=>
            {
                navigation.navigate("/admin");
            }}/>

            <div className='component-userpage-container-info'>
                <img className='component-userpage-image' alt="User Image" src={imgSrc}/>
                <div className='component-userpage-container-textinfo'>
                    <CustomField id="userpage-Username" label="Username" className='userpage-info-field disabled' placeholder={selectedUser.selectedProfile.username}/>
                    <CustomField id="userpage-Password" label="Password" className='userpage-info-field disabled' placeholder="**********"/>
                    <CustomField id="userpage-Name" label="Name" className='userpage-info-field disabled' placeholder={selectedUser.selectedProfile.name}/>
                    <CustomField id="userpage-Surname" label="Surname" className='userpage-info-field disabled' placeholder={selectedUser.selectedProfile.surname}/>
                    <CustomField id="userpage-Email" label="Email" className='userpage-info-field disabled' placeholder={selectedUser.selectedProfile.email}/>
                    <CustomField id="userpage-Phone" label="Phone" className='userpage-info-field disabled' placeholder={selectedUser.selectedProfile.phone}/>
                    <CustomField id="userpage-Role" label="Role" className='userpage-info-field disabled' placeholder={getRoleString(selectedUser.selectedProfile.role)}/>
                    <CustomField id="userpage-ApprovedStatus" label="Approved status" className={`userpage-info-field-approved userpage-info-field disabled ${getDisplayTrueClassName()}`} placeholder={approvedStatusText}/>
                </div>
                <PrimaryButton text="APPROVE HOST" className={`userpage-info-approve-button ${getDisplayTrueClassName(true)}`} onclick={()=>{onApproveUser();}}/>
            </div>
        </div>
    );
    
}

