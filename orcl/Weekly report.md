
Weekly Status Update   30th June 2025 - 4th July 2025

Hi Rajeev,
I  hope this email finds you well.
 
Please find below the status update for the period from 30th-June-2025 to 04-July-2025: 
  
1. This PR deals with deprecating faultDomain, using fabricName throughout out tests, completed the changes and had multiple CI runs. After that nitin had some comments, for which I made changes. Asked for his review and had intlsn CI run and xper CI run, booked r1x for wednesday after that run, we can merge this.
   PR : https://bitbucket.oci.oraclecorp.com/projects/ECS/repos/escs-sm/pull-requests/5246/overview 
   Jira : https://jira.oci.oraclecorp.com/browse/EXASCALECS-32516  
   
2. The below PR deals with making iperf changes in load file. Where the problem was that iperf server log is not being accessible from general logs of canary. Now made changes to print the logs in the general object storage logs.
   Jira : https://jira.oci.oraclecorp.com/browse/EXASCALECS-33251
   PR : https://bitbucket.oci.oraclecorp.com/projects/ECS/repos/escs-sm/pull-requests/5330/overview
   
3. This PR deals with making load execution changes which includes sql file changes and connections, and dynamic operations included. Waiting for changes from sweta to merge this, as there was a problem of checking DB helath before creating DB, after her changes i can merge this.
   PR : https://bitbucket.oci.oraclecorp.com/projects/ECS/repos/escs-sm/pull-requests/5001/overview
   Jira : https://jira.oci.oraclecorp.com/browse/EXASCALECS-31437

**Merged**
1. Adding Cleanup logic for some more entities like vautlAccess, acfsFileSystems, and volumeGroups. Where these entities will get cleaned up after some certain period of time.
   Jira : https://jira.oci.oraclecorp.com/browse/EXASCALECS-33190
   PR : https://bitbucket.oci.oraclecorp.com/projects/ECS/repos/escs-sm/pull-requests/5321/overview
   
2. Removing some tests from vm cluster as they are creating noise in integ pipeline. We have seen some testDBLoad failures in IT2816 and there was some bug int hat so to mitigate the issue, we are removing the DB load and doing just basic sanity check, after the bug has been resolved we can change the operation.
   Jira : https://jira.oci.oraclecorp.com/browse/EXASCALECS-33290
   PR : https://bitbucket.oci.oraclecorp.com/projects/ECS/repos/escs-sm/pull-requests/5335/overview
   
   
Happy Weekend !!
 
Thanks and Regards,
Sai Pavan Macha
