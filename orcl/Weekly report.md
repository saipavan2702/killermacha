
Weekly Status Update  24th May 2025 - 30th May 2025

Hi Rajeev,
I  hope this email finds you well.
 
Please find below the status update for the period from 24–May-2025 to 30-May-2025: 

1. This PR deals with adding verification for updated free form tags in long running DB canary. Testing is in progress, apart from that code changes are done, will complete this by end of this week. 
   PR : https://bitbucket.oci.oraclecorp.com/projects/ECS/repos/escs-sm/pull-requests/5209/overview  
   Jira : https://jira.oci.oraclecorp.com/browse/EXASCALECS-32619  
2. Added code changes for manually retrying DB failures for smdbedvconn, smdbvltconn, and some other load running canaries. This is because initially the DB connection was getting terminated and later we added changes in SQL command for making retries, but it didn’t give desired results. So now adding these retries manually. Code changes are done, testing is to be started. 
   Jira : https://jira.oci.oraclecorp.com/browse/EXASCALECS-32753  
   PR : https://bitbucket.oci.oraclecorp.com/projects/ECS/repos/escs-sm/pull-requests/5243/overview  
3. Making fabric name changes while using vault selection API, the requirement was to discard the usage of faultDomain, and use fabricName, I made the changes, but still need some insights on making changes for canaries as there we use faultDomain to fetch fabricName, so we can’t use fabricName instead of faultDomain. Will get some more info and insights this week. 
   PR : https://bitbucket.oci.oraclecorp.com/projects/ECS/repos/escs-sm/pull-requests/5246/overview 
   Jira : https://jira.oci.oraclecorp.com/browse/EXASCALECS-32516  
4. Helped Adweta in completing the maven installation, cloning repos, gave KT about basics of ESCS, explained briefly about escs ops-ui, assigned a task regarding adding changes in log-parser in TS1 runner. 

Merged 	
1. This PR deals with adding ssh-retries to vm nodes after scale down/up operation in smdbvlt2n4c canary, as after the scaling operation the vms are going unreachable/offline.  
   Jira : https://jira.oci.oraclecorp.com/browse/EXASCALECS-29700  
   PR : https://bitbucket.oci.oraclecorp.com/projects/ECS/repos/escs-sm/pull-requests/5213/overview  
2. Created a individual summary log file for the TS1 runs, where we can check the test run time for each method of test classes in PR-build. These details are being directed to a file called individual_summary.log file. 
   Jira : https://jira.oci.oraclecorp.com/browse/EXASCALECS-32300  
   PR : https://bitbucket.oci.oraclecorp.com/projects/ECS/repos/escs-sm/pull-requests/5147/overview  

Happy Weekend !!
 
Thanks and Regards,
Sai Pavan Macha
