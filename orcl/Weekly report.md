Weekly Status Update   30th Aug 2025 - 5th Sep 2025

Hi Rajeev,
I  hope this email finds you well.
 
Please find below the status update for the period from 30-Aug-2025 to 05-Sep-2025: 

1.  Validating new cloud shells created in intumt side, for IT2817, IT2823 terraform tests. Validated one cloud shell already for user1, will create 2nd clod shell for 2nd user and verify both once along with green field and non green field.
		PR : https://bitbucket.oci.oraclecorp.com/projects/ECS/repos/escs-sm/pull-requests/5464
		Jira : https://jira.oci.oraclecorp.com/browse/EXASCALECS-33935
2.  Making some changes in sm integration base to reduce the get calls made by the tests, as it might leads to error, added setter to preserve caching, and also, minor changes in intlsn yaml, and minnode canary. Since intlsn is not good couldn't test it as this needs a CI run, will merge it once it's done.
	   PR : https://bitbucket.oci.oraclecorp.com/projects/ECS/repos/escs-sm/pull-requests/5459/overview
	   Jira : https://jira.oci.oraclecorp.com/browse/EXASCALECS-34083
3. Making changes in smdbvltconn canary as per the instructions given by raviP, where failing the canary can be done if both nodes fail ping check not one node, as during compute infra upgrade we will do one by one, where one will go down for sure. Testing is in progress, as intlsn is not available .
		PR : https://bitbucket.oci.oraclecorp.com/projects/ECS/repos/escs-sm/pull-requests/5453/overview
		Jira : https://jira.oci.oraclecorp.com/browse/EXASCALECS-34064A
4.  In process of removing FaultDomain from im side, we found a bug, we are blocked by this, once shubham is done with his changes we can make these changes of removing faultDomain from im side.
		Jira : https://jira.oci.oraclecorp.com/browse/EXASCALECS-34084
		Bug Filed : https://jira.oci.oraclecorp.com/browse/EXASCALECS-34090
		


**Merged**

1. This PR is related to adding cloud vendor based guestvm patching for KVM guests, means now we can select which infra to get upgraded based on the cloud vendor type ex, google, azure etc. and we will further filter based on infra version we want to upgrade, we can upgrade only specific version. Testing is in progress.
	  PR : https://bitbucket.oci.oraclecorp.com/projects/ECS/repos/escs-sm/pull-requests/5428/overview
	  Jira : https://jira.oci.oraclecorp.com/browse/EXASCALECS-33758
	   
2.  Removing oci-metadata changes from ldb_setup.py file relates to lngdbvault, and lngdbedv canary. Done with the changes only testing is remaining, as intlsn was brooken for the whole week couldn't test it.
		PR : https://bitbucket.oci.oraclecorp.com/projects/ECS/repos/escs-sm/pull-requests/5465
		Jira : https://jira.oci.oraclecorp.com/browse/EXASCALECS-34038
Happy Weekend !!
 
Thanks and Regards,
Sai Pavan Macha
