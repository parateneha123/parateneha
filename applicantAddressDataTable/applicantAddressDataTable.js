import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent' ; 
import searchAddresses from '@salesforce/apex/ApplicantProvider.searchAddresses';
import deleteSelectedAddress from '@salesforce/apex/ApplicantProvider.deleteSelectedAddress';

const  columns = [
    { label: 'Address ID', fieldName: 'Name', editable: true },
    { label: 'Country', fieldName: 'Country__c', editable: true },
    { label: 'State', fieldName: 'State__c', editable: true },
    { label: 'City', fieldName: 'City__c', editable: true }
  ];

export default class ApplicantAddressDataTable extends LightningElement {

    applicantId
    addressList
    showAddressTableFlag = false
    showSpinnerFlag = false

    draftValues=[];
    columns = columns;

    handleEnter(event){
        if(event.keyCode === 13){
          
          this.searchAddressesHandler();
         
          
        }
      }

    searchAddressesHandler(){
        this.applicantId = this.template.querySelector('lightning-input[data-formfield="applicantID"]').value;
        console.log(this.applicantId);  
        this.showSpinnerFlag = true
        this.showAddressTableFlag = true
        
        this.getApplicantAddresses()
        this.showSpinnerFlag = false
    }

    selectedRecordsHandler(event){
        const selectedRows  =   event.detail.selectedRows;
        console.log("Selected Rows = "+ JSON.stringify(selectedRows))
        this.selectedRecordsCount = event.detail.selectedRows.length;
  
        let recordsSets = new Set();
  
        // getting selected record id
        for (let i = 0; i < selectedRows.length; i++) {
            recordsSets.add(selectedRows[i].Id);
        }
  
        // coverting to array
        this.selectedRecords = Array.from(recordsSets);
        console.log(this.selectedRecords)
    }

    deleteSelectedAddressHandler(){
        deleteSelectedAddress({addressID : this.selectedRecords})
        .then((result) => {
            this.result = result;
            this.error = undefined;
            console.log(this.result)
            this.showSpinnerFlag = true

            this.getApplicantAddresses()
            this.showSuccessToast()
            this.showSpinnerFlag = false

        })
        .catch((error) => {
            this.result = undefined;
            this.error = error;
           
        })
    }

    getApplicantAddresses(){
        searchAddresses({appName : this.applicantId})
      .then( (result) => {
            this.result = result;
            this.error = undefined
            console.log(this.result);
            this.addressList = result;
      })
      .catch( (error) => {
        this.result = undefined;
        this.error = error;
        console.log(this.error);
      })
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