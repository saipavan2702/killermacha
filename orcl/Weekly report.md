Weekly Status Update   18th Oct 2025 -  24th Oct 2025

Hi Rajeev,
I  hope this email finds you well.
 
Please find below the status update for the period from 18-Oct-2025 to 24-Oct-2025: 

1. This PR is to create a new canary for lngedvvmpugrade canary, changes from my side are done, we are waiting for naveen changes to deploy the canary.
       PR : https://devops.oci.oraclecorp.com/devops-coderepository/namespaces/axuxirvibvvo/projects/ECS/repositories/escs-sm/pullRequestsTabs/4006?_ctx=us-phoenix-1%2Cdevops_scm_central
       Jira : https://jira.oci.oraclecorp.com/browse/EXASCALECS-34521
       
2.  Found a bug where TS1 build runs are not generating individual summary log when it fails, made changes of setting trap. Testing is done, needs review.
       PR: https://devops.oci.oraclecorp.com/devops-coderepository/namespaces/axuxirvibvvo/projects/ECS/repositories/escs-sm/pullRequestsTabs/4046?_ctx=us-phoenix-1%2Cdevops_scm_central
       Jira : https://jira.oci.oraclecorp.com/browse/EXASCALECS-34857
       
3.  New requirement came from hari and pankaj, where we need to stop/ wait the canary if smacfssmoke canary is running in the jumphost. Also, they wants us to add a marker file of status of the run at the end of the canary run. Changes are done, needs review.
      PR : https://devops.oci.oraclecorp.com/devops-coderepository/namespaces/axuxirvibvvo/projects/ECS/repositories/escs-sm/pullRequestsTabs/4019?_ctx=us-phoenix-1%2Cdevops_scm_central
      Jira : https://jira.oci.oraclecorp.com/browse/EXASCALECS-34760
      
4.  Started working on code coverage for volume group, waiting to sync up with mani to talk about the api's that are going to be deprecated and work on other areas where to improve coverage.
      PR : https://devops.oci.oraclecorp.com/devops-coderepository/namespaces/axuxirvibvvo/projects/ECS/repositories/escs-sm/pullRequestsTabs/4016?_ctx=us-phoenix-1%2Cdevops_scm_central
      Jira : https://jira.oci.oraclecorp.com/browse/EXASCALECS-34753

**Merged**

1. Merged PR to remove oci-metadata usage from utils.sh file, this is to make sure the tests and canaries run even if jumphost access fails or not reacheble.
	   PR : https://bitbucket.oci.oraclecorp.com/projects/ECS/repos/escs-sm/pull-requests/5496/overview
	   Jira : https://jira.oci.oraclecorp.com/browse/EXASCALECS-34037

Happy Weekend !!
 
Thanks and Regards,
Sai Pavan Macha
