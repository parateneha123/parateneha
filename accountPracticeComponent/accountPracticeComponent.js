import { LightningElement } from 'lwc';
import createAccountRecord from '@salesforce/apex/AccountProvider.createAccountRecord';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
export default class AccountPracticeComponent extends LightningElement {

    firstName = 'Akshay'
    lastName = 'Kadam'

    objAccount = {'sobjectType' : 'Account'}
    saveButtonHandler() {

        this.objAccount.Name = this.template.querySelector('lightning-input[data-formfield="accountName"]').value;
        this.objAccount.Rating = this.template.querySelector('lightning-input[data-formfield="accountRating"]').value;
        this.objAccount.Type = this.template.querySelector('lightning-input[data-formfield="accountType"]').value;
        console.log(this.objAccount)

        if(this.objAccount != null) {
            createAccountRecord({objAcc : this.objAccount})
            .then((result) => {
                this.result = result;
                console.log(this.result);
                this.showSuccessToast(this.result);      
            
            })
            .catch((error) => {
                this.error = error;
                console.log(this.error);
                this.showSuccessToast(this.error); 
                
            });
        }
        
        else {
            const evt = new ShowToastEvent({
                title: 'Message',
                message: 'Cannot Insert Blank fields...!!!',
                variant: 'error',
                mode: 'dismissable'
            });
            this.dispatchEvent(evt);
        }
        
    }

    showSuccessToast(message) {
        const evt = new ShowToastEvent({
            title: 'Message',
            message: message,
            variant: 'success',
            mode: 'dismissable'
        });
        this.dispatchEvent(evt);
    }


}