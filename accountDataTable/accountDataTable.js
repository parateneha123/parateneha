import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent' ; 

import getAllAccountsType from '@salesforce/apex/AccountProvider.getAllAccountsType';
import deleteSelectedAccounts from '@salesforce/apex/AccountProvider.deleteAccount';

const  columns = [
    { label: 'Name', fieldName: 'Name', editable: true, },
    { label: 'Type', fieldName: 'Type', editable: true },
    { label: 'Rating', fieldName: 'Rating', editable: true },
    { label: 'SLA', fieldName: 'SLA__c', editable: true },
    {
        type: 'button-icon',
        label: 'Delete',
        typeAttributes:
        {
            iconName: 'utility:delete',
            name: 'delete',
            iconClass: 'slds-icon-text-error'
        }
    },
  ];
  
export default class AccountDataTable extends LightningElement {

    draftValues=[];
    columns = columns;

    selectedAccType
    accList
    selectedRecords
    selectedRecordsCount
    showSpinnerFlag = false
    selectedRecords

    get options() {
        return [
            { label: '--None--', value: 'None' },
            { label: 'Prospect', value: 'Prospect' },
            { label: 'Customer - Direct', value: 'Customer - Direct' },
            { label: 'Customer - Channel', value: 'Customer - Channel' },
            { label: 'Channel Partner / Reseller', value: 'Channel Partner / Reseller' },
            { label: 'Installation Partner', value: 'Installation Partner' },
            { label: 'Technology Partner', value: 'Technology Partner' },
            { label: 'Other', value: 'Other' },
        ];
    }

    handleAccountTypeChange(event) {
        this.selectedAccType = event.detail.value
        console.log(event.detail.value)

        this.showSpinnerFlag = true
        this.getAllAccountsData()
    }

     selectedRecordsHandler(event){
    //     const selectedRows  =   event.detail.selectedRows;
    //     console.log("Selected Rows = "+ JSON.stringify(selectedRows))
    //     this.selectedRecordsCount = event.detail.selectedRows.length;
  
    //     let recordsSets = new Set();
  
    //     // getting selected record id
    //     for (let i = 0; i < selectedRows.length; i++) {
    //         recordsSets.add(selectedRows[i].Id);
    //     }
  
    //     // coverting to array
    //     this.selectedRecords = Array.from(recordsSets);
    //     console.log(this.selectedRecords)

     }
    hanldeRecordAction(event) {
        console.log('Event = ' + event.detail.action.name + ' Row Id = ' + JSON.stringify(event.detail.row.Id))
        if (event.detail.action.name === "delete") {
        this.selectedRecords  =   event.detail.row.Id;
        console.log("Selected Rows = "+ JSON.stringify(this.selectedRecords))
        }
        //this.selectedRecordsCount = event.detail.selectedRows.length;
  
        //let recordsSets = new Set();
  
        // getting selected record id
        // for (let i = 0; i < selectedRows.length; i++) {
        //     recordsSets.add(selectedRows[i].Id);
        // }
  
        // coverting to array
        // this.selectedRecords = Array.from(recordsSets);
        // console.log(this.selectedRecords)
        // this.showSpinnerFlag = true
        deleteSelectedAccounts({ accID : this.selectedRecords }) 
        .then((result) => {
            this.result = result;
            this.error = undefined;
            this.getAllAccountsData()
            this.showSuccessToast()
            
        })
        .catch((error) => {
            this.result = undefined;
            this.error = error;
        });
    }
    

    getAllAccountsData() {
        getAllAccountsType({ accType : this.selectedAccType }) 
        .then((result) => {
            this.result = result;
            this.accList = result;
            this.error = undefined;

            this.showSpinnerFlag = false
        })
        .catch((error) => {
            this.result = undefined;
            this.error = error;
        });
    }
    
    showSuccessToast() {
        const evt = new ShowToastEvent({
            title: 'Message',
            message: this.result,
            variant: 'success',
            mode: 'dismissable'
        });
        this.dispatchEvent(evt);
    }
}