
Weekly Status Update   7th June 2025 - 13th June 2025

Hi Rajeev,
I  hope this email finds you well.
 
Please find below the status update for the period from 07-June-2025 to 13-June-2025: 
  
  1.  This PR is related to executing DB load test after the creation of lngdbvault/lngdbedv significant changes are made in this PR the testing is done, the final iteration is going on, made multiple loop runs, 2 CI-runs, and pasted the results in description. This is taking this much time because to do thorough testing ensuing it doesn't fail when merged as this causes the canaries to go down,  will merge it soon.
     Jira : https://jira.oci.oraclecorp.com/browse/EXASCALECS-31437
     PR : https://bitbucket.oci.oraclecorp.com/projects/ECS/repos/escs-sm/pull-requests/5001/overview
   
2. Working on adding volume group tests in IT2802 file, we are using EXT4 file system instead of ACFS file system. I am waiting for the changes from sweta on adding log=true and log=false so that i could test it end to end, once her changes are online, I can merge this PR shortly. 
   Jira : https://jira.oci.oraclecorp.com/browse/EXASCALECS-32871
   PR : https://bitbucket.oci.oraclecorp.com/projects/ECS/repos/escs-sm/pull-requests/5258/overview
   
3. This PR deals with deprecating faultDomain, using fabricName throughout out tests, this is gonna take time as we first thought we need to merge this in different PR's bater seeing they are all dependent we are gonna have to merge this single PR and it needs CI run's in all envs, xper, xper2, intlsn, r1, r1x, intspl. Made 70% of the changes. Planning to complete this by end of this week.
   PR : https://bitbucket.oci.oraclecorp.com/projects/ECS/repos/escs-sm/pull-requests/5246/overview 
   Jira : https://jira.oci.oraclecorp.com/browse/EXASCALECS-32516  

**Merged**

1. This PR is a bugfix which deals with adding one more filter while listing volumes, as previously we were fetching it suing displaynames which were randomly generated. But in one case they both came out to be same, and the results of listing volumes got interchanged resulted in failure. 
   Jira : https://jira.oci.oraclecorp.com/browse/EXASCALECS-32979
   PR : https://bitbucket.oci.oraclecorp.com/projects/ECS/repos/escs-sm/pull-requests/5283/overview
   
2. This PR deals with removing smvm canary from pipeline totally merging it with smacfssmoke canary.
   Jira : https://jira.oci.oraclecorp.com/browse/EXASCALECS-32739
   PR : https://bitbucket.oci.oraclecorp.com/projects/ECS/repos/escs-sm/pull-requests/5286/overview
   
3. This PR deals with adding verification for free form tags that are being updated after cluster creation in lngdbvault, lngdbedv canaries.
   Jira : https://jira.oci.oraclecorp.com/browse/EXASCALECS-32619
   PR : https://bitbucket.oci.oraclecorp.com/projects/ECS/repos/escs-sm/pull-requests/5209/overview
   
   
Happy Weekend !!
 
Thanks and Regards,
Sai Pavan Macha
