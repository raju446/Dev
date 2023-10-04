public with sharing class CaseEmailHandler {

    @AuraEnabled
    public static void sendEmail(String caseId) {
        // Query the Case record or retrieve information as needed
        Case caseRecord = [SELECT Id, Subject, Email__c,Name__c,Phone__c,Description,Reason FROM Case WHERE Id = :caseId];

        // Check if the Email__c field contains a valid email address
        if (String.isNotBlank(caseRecord.Email__c)) {
            // Create and send an email
            Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
            email.setToAddresses(new List<String>{caseRecord.Email__c});
            email.setSubject('New Case Created: ' + caseRecord.Name__c);
            email.setPlainTextBody('A new case was created with the following details:\n\n' +
                                   'Name: ' + caseRecord.Name__c + '\n' +  
                                   'Phone: ' + caseRecord.Phone__c + '\n' +
                                   'Email: ' + caseRecord.Email__c + '\n' +
                                   'Reason: '+ caseRecord.Reason + '\n' +
                                   'Subject: ' + caseRecord.Subject + '\n' +    
                                   'Description: ' + caseRecord.Description);

            // Set the Org-Wide Email Address as the "OrgWideEmailAddressId"
            OrgWideEmailAddress[] orgWideAddresses = [SELECT Id, Address FROM OrgWideEmailAddress WHERE DisplayName = 'Contact Information'];
            if (!orgWideAddresses.isEmpty()) {
                email.setOrgWideEmailAddressId(orgWideAddresses[0].Id);
            }

            // Send the email
            List<Messaging.SingleEmailMessage> emails = new List<Messaging.SingleEmailMessage>{email};
            Messaging.SendEmailResult[] results = Messaging.sendEmail(emails);

            // Handle any errors or log success
            if (results[0].isSuccess()) {
                System.debug('Email sent successfully');
            } else {
                System.debug('Error sending email: ' + results[0].getErrors()[0].getMessage());
            }
        } else {
            System.debug('No valid email address found in Email__c field');
        }
    }
}