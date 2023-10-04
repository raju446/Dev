import { LightningElement, track, wire, api } from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';
import CASE_OBJECT from '@salesforce/schema/Case';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import sendEmail from '@salesforce/apex/CaseEmailHandler.sendEmail';
export default class CaseCreateForm extends LightningElement {
    @track Name = '';
    @track Phone = '';
    @track Email = '';
    @track Subject = '';
    @track Reason = '';
    @track reasonOptions = [
        { label: 'Installation', value: 'Installation' },
        { label: 'Equipment Complexity', value: 'Equipment Complexity' },
        { label: 'Performance', value: 'Performance' },
        { label: 'Breakdown', value: 'Breakdown' },
        { label: 'Equipment Design', value: 'Equipment Design' },
        { label: 'Feedback', value: 'Feedback' },
        { label: 'Other', value: 'Other' },
    ];
    @track Description = '';

    handleNameChange(event) {
        this.Name = event.target.value;
    }

    handlePhoneChange(event) {
        this.Phone = event.target.value;
    }

    handleEmailChange(event) {
        this.Email = event.target.value;
    }

    handleSubjectChange(event) {
        this.Subject = event.target.value;
    }
    
    handleReasonChange(event) {
        this.Reason = event.target.value;
    }

    handleDescriptionChange(event) {
        this.Description = event.target.value;
    }

    createCase() {
        const fields = {
            Name__c: this.Name,
            Email__c: this.Email,
            Phone__c: this.Phone,
            Subject: this.Subject,
            Reason: this.Reason,
            Description: this.Description
        };

        const recordInput = { apiName: CASE_OBJECT.objectApiName, fields };

    createRecord(recordInput)
        .then(result => {
            console.log('Case created with Id:', result.id);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Contact Information successfully submitted',
                    variant: 'success'
                })
            );
            sendEmail({ caseId: result.id })
            .then(result => {
                console.log('Email sent successfully');
            })
            .catch(error => {
                console.error('Error sending email:', error);
            });

            this.Name = '';
            this.Phone = '';
            this.Email = '';
            this.Subject = '';
            this.Reason = '';
            this.Description = '';
        })

        .catch(error => {
            console.error('Error creating Case:', error);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'Error creating Case: ' + error.body.message,
                    variant: 'error'
                })
            );
        });
    }
} 