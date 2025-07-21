
Weekly Status Update   12th July 2025 - 18th July 2025

Hi Rajeev,
I  hope this email finds you well.
 
Please find below the status update for the period from 12th-July-2025 to 18-July-2025: 
1. Filed a bug for easy start script where the faultDomain is being supplied as FD-1 if nothing is being passed. I need these changes from bhavani to remove faultDomain from vmcluster side.
        Jira : https://jira.oci.oraclecorp.com/browse/EXASCALECS-33552
2. Due to above bug, vm cluster changes are put on hold for now, so I split the PR into two parts, vault, volume changes are ready to go through once they are reviewed by ravi P.
	    PR : https://bitbucket.oci.oraclecorp.com/projects/ECS/repos/escs-sm/pull-requests/5246/overview 
	    Jira : https://jira.oci.oraclecorp.com/browse/EXASCALECS-32516  
 3. The changes to reduce space issues that been going around in canaries are almost done, i need to test the changes.
	    PR : https://bitbucket.oci.oraclecorp.com/projects/ECS/repos/escs-sm/pull-requests/5378/overview
		Jira :  https://jira.oci.oraclecorp.com/browse/EXASCALECS-33413
4.  The long term changes to mitigate the container termination issue are being made, i still need some insights, from the call from nakul we come to know that we might need OL9 for our canaries.
		 PR : https://bitbucket.oci.oraclecorp.com/projects/ECS/repos/escs-sm/pull-requests/5360/overview
		 Jira : https://jira.oci.oraclecorp.com/browse/EXASCALECS-33475
5.  Completed testing long running guest vm patch canary, the PR is ready to merge, needs review from ravi M, it's been delaying because of tight schedule from SRE side.
		 PR : https://bitbucket.oci.oraclecorp.com/projects/ECS/repos/escs-sm/pull-requests/4714/overview

**Merged**

1. This PR deals with fixing a bug related to lngdbedv, where the redolog check is happening before database is created, this causes the canary failure. Added a fix.
   PR : https://bitbucket.oci.oraclecorp.com/projects/ECS/repos/escs-sm/pull-requests/5356/overview
   Jira : https://jira.oci.oraclecorp.com/browse/EXASCALECS-33451
   
Happy Weekend !!
 
Thanks and Regards,
Sai Pavan Macha
