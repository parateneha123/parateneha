import { api, LightningElement } from 'lwc';


  const columns = [
    { label: 'Address ID', fieldName: 'Name' },
    { label: 'Country',  fieldName: 'Country__c' },
    { label: 'State', fieldName: 'State__c' },
    { label: 'City', fieldName: 'City__c' },
];
export default class AddressPopUp extends LightningElement {

    draftValues=[];
    columns = columns;
    @api addressList

    closeButtonHandler(){
        const closeEvent = new CustomEvent("closebuttonevent");
        this.dispatchEvent(closeEvent);
    }
}