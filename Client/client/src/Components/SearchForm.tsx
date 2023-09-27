import '../Style/SearchForm.css';
import React from "react";
import PrimaryButton from './PrimaryButton';
import CustomField from './CustomField';
import Datepicker from './Datepicker';
import SecondaryButton from './SecondaryButton';

export default function SearchForm({className=""}) {  
    return (
        <div className={`component-searchform ${className}`}>
            <div className='search-form-controlscontainer'>
                <CustomField id="textsearch" placeholder='Search destinations' className='searchform-searchtextfield'/>
                <Datepicker labelDate='From' id="fromdate" placeholder="dd-mm-yyyy" className='searchform-frombutton'/>
                <Datepicker labelDate='To' id="todate" placeholder="dd-mm-yyyy" className='searchform-tobutton'/>
                <div className='searchform-guestsbutton'>
                    <p className='searchform-guests-label'>Guests</p>
                    <SecondaryButton text="-" className='searchform-guests-control-button searchform-guests-minus'/>
                    <p className='searchform-guests-counttext'>0</p>
                    <SecondaryButton text="+" className='searchform-guests-control-button searchform-guests-plus'/>
                </div> 
                <PrimaryButton className='searchform-searchbutton'/>
            </div>
        </div>
    );
    
}

