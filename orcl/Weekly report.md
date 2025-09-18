Weekly Status Update   6th Sep 2025 - 12th Sep 2025

Hi Rajeev,
I  hope this email finds you well.
 
Please find below the status update for the period from 06-Sep-2025 to 12-Sep-2025: 


1.  Shubham is done with his changes of removing faultDomain as a required parameter rather than optional, I am making changes for removing faultDomain from im side, planning to merge by friday or next monday. 
		Jira : https://jira.oci.oraclecorp.com/browse/EXASCALECS-34084
		Bug Filed : https://jira.oci.oraclecorp.com/browse/EXASCALECS-34090
		PR : https://bitbucket.oci.oraclecorp.com/projects/ECS/repos/escs-im/pull-requests/4568/overview
		
2.  Adding more changes to guestvm canary where we are updating the marker file to meet the selective patching of vm clusters for different types of infra. Changes are done getting reviewed by sweta and jayaraju.
	   PR : https://bitbucket.oci.oraclecorp.com/projects/ECS/repos/escs-sm/pull-requests/5503/overview
	   Jira : https://jira.oci.oraclecorp.com/browse/EXASCALECS-34333
	   
3. Removing oci-metadata usage from utils.sh file, almost done with the changes, need to test it. This is to remove dependancy from jumphost metadata incase of any failure from jumphost side.
	   PR : https://bitbucket.oci.oraclecorp.com/projects/ECS/repos/escs-sm/pull-requests/5496/overview
	   Jira : https://jira.oci.oraclecorp.com/browse/EXASCALECS-34037
	   
4.  Validating new cloud shells created in intumt side, for IT2817, IT2823 terraform tests. Created two cloud shells, running into some jumphost keys issue, me and sweta are in touch with bhavani and naveen to solve the issue.
		PR : https://bitbucket.oci.oraclecorp.com/projects/ECS/repos/escs-sm/pull-requests/5464
		Jira : https://jira.oci.oraclecorp.com/browse/EXASCALECS-33935

**Merged**

1.  Merged some changes in sm integration base to reduce the get calls made by the tests, as it might leads to error, added setter to preserve caching, of the infra id. 
	   PR : https://bitbucket.oci.oraclecorp.com/projects/ECS/repos/escs-sm/pull-requests/5459/overview
	   Jira : https://jira.oci.oraclecorp.com/browse/EXASCALECS-34083
	   
2. Merged changes in smdbvltconn canary as per the instructions given by raviP, where failing the canary should be done if both nodes fail ping check not one node.
		PR : https://bitbucket.oci.oraclecorp.com/projects/ECS/repos/escs-sm/pull-requests/5453/overview
		Jira : https://jira.oci.oraclecorp.com/browse/EXASCALECS-34064A
		
3. Merged changes regarding adding new reduced workload sql files, and making pdb count as dynamic rather than static to make it more scalable.
	    PR : https://bitbucket.oci.oraclecorp.com/projects/ECS/repos/escs-sm/pull-requests/5001/overview
	    Jira : https://jira.oci.oraclecorp.com/browse/EXASCALECS-31437

4. Merged changes regarding guestvm canary where the vmupdate directory is not getting deleted in case of patching failure
		PR : https://bitbucket.oci.oraclecorp.com/projects/ECS/repos/escs-sm/pull-requests/5495/overview
		Jira : https://jira.oci.oraclecorp.com/browse/EXASCALECS-34300
		
5. Merged changes for fixing aanalysis part whre after patching the guestvms we do analysis to make sure the version gets refelected in ops ui, rather than doing it manually, we are making an oci-curl call,
	   PR : https://bitbucket.oci.oraclecorp.com/projects/ECS/repos/escs-sm/pull-requests/5501/overview
	   Jira : https://jira.oci.oraclecorp.com/browse/EXASCALECS-34320
	   
Happy Weekend !!
 
Thanks and Regards,
Sai Pavan Macha
