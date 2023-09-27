import CustomField from '../Components/CustomField';
import PrimaryButton from '../Components/PrimaryButton';
import '../Style/SignUpScreen.css';
import React, { useState } from "react";
import useNavigation from '../useHooks/useNavigation';
import useFetch from '../useHooks/useFetch';
import useSession from '../useHooks/useSession';
import { UserProfile } from '../models/UserProfile';
import { openToast } from '../Components/Toast';
import jwt_decode from "jwt-decode";
import { blob } from 'stream/consumers';
import { getBase64 } from '../utils';

export default function SignUpScreen({className=""}) { 

    const navigation = useNavigation();
    const fetch = useFetch();
    const session = useSession();
    const [image, setImage] = useState("");
    const [file, setFile] = useState(new File([""], ""));

    const signup = async () =>{
        let userProfile:UserProfile = new UserProfile;
        userProfile.username = (document.getElementById("signup-username") as HTMLInputElement).value;
        userProfile.password = (document.getElementById("signup-password") as HTMLInputElement).value;
        userProfile.name = (document.getElementById("signup-name") as HTMLInputElement).value;
        userProfile.surname = (document.getElementById("signup-surname") as HTMLInputElement).value;
        userProfile.email = (document.getElementById("signup-email") as HTMLInputElement).value;
        userProfile.phone = (document.getElementById("signup-mobile") as HTMLInputElement).value;
        userProfile.role = '';
        userProfile.photoUrl = image;
        // getBase64(file, (result:string) => {
        //     userProfile.photoUrl = result;
        //     console.log(userProfile.photoUrl);
        // });

        const resp = await fetch.post('/UserProfile/signup', userProfile);
        
        if(resp.ok)
        {
            session.setToken(resp.headers.get("Authorization"));
        
            const decoded:any = jwt_decode(resp.headers.get("Authorization") as string);
            // const res = await fetch.post('/user/getUser', {'username': decoded.username});
            // user.setProfile(res);

            navigation.navigate("/");
        }
        else
        {
            const userMessage = resp.headers.get("UserMessage");
            openToast(userMessage as string);
        }
    }

    function IsSignupValid():boolean
    {
        let isValid:boolean = true;
        let allInputs = document.getElementsByClassName("field-required");
        let toastMessage:string = "";
        let isUnfilledField = false;

        for (let inputItem of allInputs) {
            let inputHtmlItem = inputItem.querySelector("input");
            let idValue:string = inputHtmlItem?.id != null ? inputHtmlItem?.id : "";

            if((inputHtmlItem as HTMLInputElement).value == "")
            {
                document.getElementById(idValue)?.classList.add("field-notfilled");
                isUnfilledField = true;
                isValid = false;
            }
            else
            {
                document.getElementById(idValue)?.classList.remove("field-notfilled");
            }
        }
        
        if(isUnfilledField && file.name == "")
        {
            toastMessage = "Fill all fields and upload an image";
        }
        else if(file.name == "")
        {
            toastMessage = "Upload an image";
            isValid = false;
        }
        else if(file.name != "" && isUnfilledField)
        {
            toastMessage = "Fill all fields";
        }
            
        openToast(toastMessage);

        return isValid;
    } 

    function onFilesChange(files:File[])
    {
        if(files.length > 0)
        {
            setFile(files[0])
            setImage(URL.createObjectURL(files[0]));
        }
        else
        {
            setFile(new File([], ""))
            setImage("");
        }
    }

    return (
        <div className={`component-signup-screen ${className}`}>
            <div className='component-signup-window'>
                <p className='component-signup-xbutton' onClick={()=> navigation.navigate("/")}>X</p>
                <div className='component-signup-form'>
                    <div className='component-signup-image-container'>
                        <img className='signup-image-preview' alt="No Image" src={image}/>
                        <input id="signup-image" className='component-signup-field component-signup-field-image' type="file" accept='.png, .jpg, .gif'
                        onChange={(e) => {
                            const fileList = e.target.files;
                            if (fileList) {
                              const files = [...fileList]; 
                              onFilesChange(files);
                            }
                          }}/>
                    </div>
                    <div className='component-signup-fullname-container'>
                        <CustomField name="Name" label="Name" id="signup-name" className='component-signup-field component-signup-field-name component-signup-fieldwithlabel field-required'/>
                        <CustomField name="Surname" label="Surname" id="signup-surname" className='component-signup-field component-signup-field-surname component-signup-fieldwithlabel field-required'/>
                    </div>
                    <CustomField name="Username" label="Username" id="signup-username" className='component-signup-field component-signup-field-username component-signup-fieldwithlabel field-required'/>
                    <CustomField name="Mobile" label="Mobile" id="signup-mobile" type="tel" className='component-signup-field component-signup-field-mobile component-signup-fieldwithlabel field-required'/>
                    <form className='component-signup-role-container'>
                        <CustomField label='Guest' id="signup-host-role" type="radio" className='component-signup-field-role'/>
                        <CustomField label='Host' id="signup-guest-role" type="radio" className='component-signup-field-role'/>
                    </form>
                    <div className='component-signup-email-container'>
                        <CustomField name="Email" label='Email' id="signup-email" type="email" className='component-signup-field component-signup-field-email component-signup-fieldwithlabel field-required'/>
                        <CustomField name="Repeat Email" label='Repeat Email' id="signup-emailrepeat" type="email" className='component-signup-field component-signup-field-emailrepeat component-signup-fieldwithlabel field-required'/>
                    </div>
                    <div className='component-signup-password-container'>
                        <CustomField name="Password" label='Password' id="signup-password" type="password" className='component-signup-field component-signup-field-password component-signup-fieldwithlabel field-required'/>
                        <CustomField name="Repeat Password" label='Repeat Password' id="signup-passwordrepeat" type="password" className='component-signup-field component-signup-field-passwordrepeat component-signup-fieldwithlabel field-required'/>
                    </div>

                    <PrimaryButton text='SIGN UP' className='component-signup-submit-button' onclick={()=> {
                        if(IsSignupValid())
                        {
                            signup();
                        }
                    }}/>
                </div>
            </div>
        </div>
    );
    
}

