Weekly Status Update   13th Sep 2025 - 19th Sep 2025

Hi Rajeev,
I  hope this email finds you well.
 
Please find below the status update for the period from 13-Sep-2025 to 19-Sep-2025: 

1.   Completed the changes of removing faultDomian as required parameter from im side, waiting for approvals, got clean xper run and im side clean xperr1 run. Will merge it on monday.
		Jira : https://jira.oci.oraclecorp.com/browse/EXASCALECS-34084
		Bug Filed : https://jira.oci.oraclecorp.com/browse/EXASCALECS-34090
		PR : https://bitbucket.oci.oraclecorp.com/projects/ECS/repos/escs-im/pull-requests/4568/overview
		
2.  Completed testing the changes this PR is related to adding new marker file structure which will help in patching guestVMs for long running canaries, waiting fro approvals, using this marker file structure we can patch multiple sitegroups(means diff types of cloud infras ex: google, azure, oci) with specified source and target version of patching.
	   PR : https://bitbucket.oci.oraclecorp.com/projects/ECS/repos/escs-sm/pull-requests/5503/overview
	   Jira : https://jira.oci.oraclecorp.com/browse/EXASCALECS-34333

3.  Adding parallel guestvm patching option for IT2804 which is used in loop runs, and other ts3 envs in patching/upgrading long running vm clusters. We are adding the support for running multiple instances of patchmgr running in the env. Testing is done. No CI run is needed as this will not run in integ.
	   Scenarios Tested : 
		   i. Tested and confirmed the running of patching two nodes of vm clusters at the same time inside the jumphost.
		   ii. Tested using two different boxes and two different vm clusters and confirmed that they are running in parallel. 
		   iii. To mitigate the memory overload issue in jumphost, we are making sure, that exadata zip and db server files are being downloaded only once and the logs of each clusters are redirected to their respective folder for good debugging. Also made sure that the large 4GB files will delete after one day, if not jumphost might run into no memory issue.
		All the test results are pasted in the description of the PR. 
		Waiting for approvals. Will merge once got approval.
	   PR : https://bitbucket.oci.oraclecorp.com/projects/ECS/repos/escs-sm/pull-requests/5509/overview
	   Jira : https://jira.oci.oraclecorp.com/browse/EXASCALECS-34342
	
4. Removing oci-metadata usage from utils.sh file, almost done with the changes, need to test it. Couldn't get it tested this week, will test it this week and merge it. This is to remove dependancy from jumphost metadata incase of any failure from jumphost side.
	   PR : https://bitbucket.oci.oraclecorp.com/projects/ECS/repos/escs-sm/pull-requests/5496/overview
	   Jira : https://jira.oci.oraclecorp.com/browse/EXASCALECS-34037

5.  Adding the reduced workload test misc op in the load.py, got some reviews from sweta, working on them, already tested previously, will test it once again after the changes suggested, and merge it by end of the week.
		PR : https://bitbucket.oci.oraclecorp.com/projects/ECS/repos/escs-sm/pull-requests/5385/overview
		Jira : https://jira.oci.oraclecorp.com/browse/EXASCALECS-33590
	   
	   
Happy Weekend !!
 
Thanks and Regards,
Sai Pavan Macha
