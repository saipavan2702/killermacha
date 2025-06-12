
Weekly Status Update  31st May 2025 - 06th June 2025

Hi Rajeev,
I  hope this email finds you well.
 
Please find below the status update for the period from 31–May-2025 to 06-June-2025: 

1. This PR deals with adding verification for updated free form tags in long running DB canary. Completed testing too, got a clean CI-run will merge it on monday.
   Jira : https://jira.oci.oraclecorp.com/browse/EXASCALECS-32619  
   PR : https://bitbucket.oci.oraclecorp.com/projects/ECS/repos/escs-sm/pull-requests/5209/overview  

2. Working on adding volume group tests in IT2802 file, we are using EXT4 file system instead of ACFS file system as this is not being supported below 23gi DB, made changes on mounting the EXT4 file system. Testing is in progress.
   Jira : https://jira.oci.oraclecorp.com/browse/EXASCALECS-32871
   PR : https://bitbucket.oci.oraclecorp.com/projects/ECS/repos/escs-sm/pull-requests/5258/overview
   
3. Added code changes for manually retrying DB failures for smdbedvconn, smdbvltconn, and some other load running canaries. This is because initially the DB connection was getting terminated and later we added changes in SQL command for making retries, but it didn’t give desired results. So now adding these retries manually. Testing is in progress.
   Jira : https://jira.oci.oraclecorp.com/browse/EXASCALECS-32753  
   PR : https://bitbucket.oci.oraclecorp.com/projects/ECS/repos/escs-sm/pull-requests/5243/overview  
   
4. Making fabric name changes while using vault selection API, the requirement was to discard the usage of faultDomain, and use fabricName, I made the code changes. Testing is in progress.
   PR : https://bitbucket.oci.oraclecorp.com/projects/ECS/repos/escs-sm/pull-requests/5246/overview 
   Jira : https://jira.oci.oraclecorp.com/browse/EXASCALECS-32516  

5. This PR is related to executing DB load test after the creation of lngdbvault/lngdbedv significant changes are made in this PR that's why testing needed time as after ravi merged a PR for upgrading to 23.8 db, we had to run the test on new database, now we need a CI-run to finish the testing, there was shephered applying failure today, will see through the details.
   Jira : https://jira.oci.oraclecorp.com/browse/EXASCALECS-31437
   PR : https://bitbucket.oci.oraclecorp.com/projects/ECS/repos/escs-sm/pull-requests/5001/overview

6. Helped adweta in understanding the canaries like smdbvlt2n4c, lngdbvault etc, assigned some basic tasks in order for him to understand the work.
   
   
Happy Weekend !!
 
Thanks and Regards,
Sai Pavan Macha
