Weekly Status Update   25th Oct 2025 -  31st Oct 2025

Hi Rajeev,
I  hope this email finds you well.
 
Please find below the status update for the period from 25-Oct-2025 to 31-Oct-2025: 

1. This PR is to create a new canary for lngedvvmpugrade canary, changes from my side are done. Naveen merged his changes, sent my PR for review. Will merge this PR by Tuesday.
       PR : https://devops.oci.oraclecorp.com/devops-coderepository/namespaces/axuxirvibvvo/projects/ECS/repositories/escs-sm/pullRequestsTabs/4006?_ctx=us-phoenix-1%2Cdevops_scm_central
       Jira : https://jira.oci.oraclecorp.com/browse/EXASCALECS-34521
              
2.  This PR is to add wait for smacfssmoke canary before geustvm patching is done, as during guestvmpatching DBs will be inconsistent and acfs canary won't allow this. Changes are done, ready to merge. Was asked to hold it till monday and merge as there was already some noise in pipeline. Will merge it on monday.
      PR : https://devops.oci.oraclecorp.com/devops-coderepository/namespaces/axuxirvibvvo/projects/ECS/repositories/escs-sm/pullRequestsTabs/4019?_ctx=us-phoenix-1%2Cdevops_scm_central
      Jira : https://jira.oci.oraclecorp.com/browse/EXASCALECS-34760
      
3. This PR is to add retries for nodeup canary as there was some increase in timeout issues recently, changes are done. Testing is pending and needs review from raviP.
	  PR : https://devops.oci.oraclecorp.com/devops-coderepository/namespaces/axuxirvibvvo/projects/ECS/repositories/escs-sm/pullRequestsTabs/4060/information
	  Jira : https://jira.oci.oraclecorp.com/browse/EXASCALECS-34866
	  
4.  Started working on code coverage for volume group, added some IT for vault out of space scenarios where we assert multiple status codes. Needs testing and review.
      PR : https://devops.oci.oraclecorp.com/devops-coderepository/namespaces/axuxirvibvvo/projects/ECS/repositories/escs-sm/pullRequestsTabs/4016?_ctx=us-phoenix-1%2Cdevops_scm_central
      Jira : https://jira.oci.oraclecorp.com/browse/EXASCALECS-34753

**Merged**

1.  Merged changes to generate logs for time taken by individual tests for TS1/PR builds even in case of failures. 
       PR: https://devops.oci.oraclecorp.com/devops-coderepository/namespaces/axuxirvibvvo/projects/ECS/repositories/escs-sm/pullRequestsTabs/4046?_ctx=us-phoenix-1%2Cdevops_scm_central
       Jira : https://jira.oci.oraclecorp.com/browse/EXASCALECS-34857
       
2.  Merged changes to add freeform tags for all the resources created by the smacfssmoke canary, as there was a memory leakage of resources being leftover in the jumphost due to no freeform tags being added to the resources, as the cleanup script picks up freeform tags of the resources and cleans them up after certain time period. Had to merge this ASAP.
       PR : https://devops.oci.oraclecorp.com/devops-coderepository/namespaces/axuxirvibvvo/projects/ECS/repositories/escs-sm/pullRequestsTabs/4055?_ctx=us-phoenix-1%2Cdevops_scm_central
      Jira : https://jira.oci.oraclecorp.com/browse/EXASCALECS-34908
       
Happy Weekend !!
 
Thanks and Regards,
Sai Pavan Macha
