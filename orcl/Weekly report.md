Weekly Status Update   27th Sep 2025 -  3rd Oct 2025

Hi Rajeev,
I  hope this email finds you well.
 
Please find below the status update for the period from 27-Sep-2025 to 03-Oct-2025: 

1.   Completed the changes of removing faultDomian as required parameter from im side. Changes are done, as for testing we tested this while infra reprovisioning, as we need to make sure that infra creation goes without any problem, also it needs real hardware to test so we used xperr1x env since intlsn is out of commission. And from the reviews of Raj Aggarwal and arun saral they sensed that this could break exascaleCabinet so Libin made changes for that and waiting for approvals I have a call on monday with libin and arun to review.
		Jira : https://jira.oci.oraclecorp.com/browse/EXASCALECS-34084
		PR : https://devops.oci.oraclecorp.com/devops-coderepository/namespaces/axuxirvibvvo/projects/ECS/repositories/escs-im/pullRequestsTabs/3372/information
		
2.  Adding parallel guestvm patching option for IT2804 which is used in loop runs, and other ts3 envs in patching/upgrading long running vm clusters. We are adding the support for running multiple instances of patchmgr running in the env. Testing is done. No CI run is needed as this will not run in integ. Also added a wget check to avoid race condition while downloading exadata file for different vm clusters in the jumphost.
	   Scenarios Tested : 
		   i. Tested and confirmed the running of patching two nodes of vm clusters at the same time inside the jumphost.
		   ii. Tested using two different boxes and two different vm clusters and confirmed that they are running in parallel. 
		   iii. To mitigate the memory overload issue in jumphost, we are making sure, that exadata zip and db server files are being downloaded only once and the logs of each clusters are redirected to their respective folder for good debugging. Also made sure that the large 4GB files will delete after one day, if not jumphost might run into no memory issue.
		All the test results are pasted in the description of the PR.  
		Ready to merge, waiting for the fix of TS1 build failures, most PR's are stuck with this failure.
	   PR : https://bitbucket.oci.oraclecorp.com/projects/ECS/repos/escs-sm/pull-requests/5509/overview
	   Jira : https://jira.oci.oraclecorp.com/browse/EXASCALECS-34342
	
3. Removing oci-metadata usage from utils.sh file, almost done with the changes, need to test it. As the intlsn env is not free last week, it got free yesterday, will merge this by Tuesday.
	   PR : https://bitbucket.oci.oraclecorp.com/projects/ECS/repos/escs-sm/pull-requests/5496/overview
	   Jira : https://jira.oci.oraclecorp.com/browse/EXASCALECS-34037
	   
4. While upgrading lngdbvault clusters using guestvmpatching canary, for intlsn we had a small inconvenience that we had to hardcode some values to upgrade lngdbedv clusters, as they belong to different tenants so we thought we shud use another canary to upgrade the lngdbedv clusters simultaneously. Changes are done, and needs to be tested in intlsn.
       PR : https://bitbucket.oci.oraclecorp.com/projects/ECS/repos/escs-sm/pull-requests/5536/overview
       Jira : https://jira.oci.oraclecorp.com/browse/EXASCALECS-34521

**Merged**

1. Now we can do guest vm patching for multiple site groups means vms belonging to different cloud vendors, and also have the flexibility to do the source and target based patching for particular sitegroup. Already testing in real time where we updated guestvms for intlsn infra, and it was successful. 
	   PR : https://bitbucket.oci.oraclecorp.com/projects/ECS/repos/escs-sm/pull-requests/5503/overview
	   Jira : https://jira.oci.oraclecorp.com/browse/EXASCALECS-34333


Happy Weekend !!
 
Thanks and Regards,
Sai Pavan Macha
