import '../Style/SearchForm.css';
import React from "react";
import PrimaryButton from './PrimaryButton';
import CustomField from './CustomField';
import Datepicker from './Datepicker';
import SecondaryButton from './SecondaryButton';
import { openToast } from './Toast';
import { SearchObject } from '../models/SearchObject';
import useFetch from '../useHooks/useFetch';

export default function SearchForm({className=""}) {   
    let guestsCount = 0;
    const fetch = useFetch();
    
    async function submitSearch()
    {
        let searchText = (document.getElementById("textsearch") as HTMLInputElement).value;
        let fromdate = (document.getElementById("fromdate") as HTMLInputElement).value;
        let todate = (document.getElementById("todate") as HTMLInputElement).value;
        let guestsCount:number = +((document.getElementById("guestsCount") as HTMLElement).textContent as string);
        
        let so = new SearchObject(searchText, fromdate, todate, guestsCount, 0);

        const listing = await fetch.post('/Listing/simpleSearch', so).then(res=>res.json());

        console.log(listing);
    }

    function onPlus()
    {
        if(guestsCount < 15)
        {
            guestsCount++;
            (document.getElementById("guestsCount") as HTMLElement).textContent = guestsCount.toString();
        }
        else
        {
            openToast("Max guests reached");
        }
    }

    function onMinus()
    {
        if(guestsCount > 0)
        {
            guestsCount--;
            (document.getElementById("guestsCount") as HTMLElement).textContent = guestsCount.toString();
        }
    }

    return (
        <div className={`component-searchform ${className}`}>
            <div className='search-form-controlscontainer'>
                <CustomField id="textsearch" placeholder='Search destinations' className='searchform-searchtextfield'/>
                <Datepicker labelDate='From' id="fromdate" placeholder="dd-mm-yyyy" className='searchform-frombutton'/>
                <Datepicker labelDate='To' id="todate" placeholder="dd-mm-yyyy" className='searchform-tobutton'/>
                <div className='searchform-guestsbutton'>
                    <p className='searchform-guests-label'>Guests</p>
                    <SecondaryButton onclick={onMinus} text="-" className='searchform-guests-control-button searchform-guests-minus'/>
                    <p id="guestsCount" className='searchform-guests-counttext'>0</p>
                    <SecondaryButton onclick={onPlus} text="+" className='searchform-guests-control-button searchform-guests-plus'/>
                </div> 
                <PrimaryButton className='searchform-searchbutton' onclick={submitSearch}/>
            </div>
        </div>
    );
    
}

