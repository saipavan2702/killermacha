
Weekly Status Update   26th July 2025 - 01st Aug 2025

Hi Rajeev,
I  hope this email finds you well.
 
Please find below the status update for the period from 26th-July-2025 to 01-Aug-2025: 
1.  Working on making changes related to guestvmpatching which were instructed by arun saral where we need not to fail the canary if marker file is not present to reduce the unnecessary noise.
	   PR : https://bitbucket.oci.oraclecorp.com/projects/ECS/repos/escs-sm/pull-requests/5406/overview
	   Jira : https://jira.oci.oraclecorp.com/browse/EXASCALECS-33747
2.  Started using migrated scm runbook repo instead of bitbucket repo, got help from bhavishya while configuring the repo in linux box.
	   PR : https://devops.oci.oraclecorp.com/devops-coderepository/namespaces/axuxirvibvvo/projects/ECS/repositories/escs-runbooks/pullRequestsTabs/917/information
	   Jira : https://jira.oci.oraclecorp.com/browse/EXASCALECS-31975
3.  Completed working on adding smdbload.sql as a new load run misc-op, so that we can run reduced load by changing miscop. This is delayed due to unavailability of env.
	   PR : https://bitbucket.oci.oraclecorp.com/projects/ECS/repos/escs-sm/pull-requests/5385
	   Jira : https://jira.oci.oraclecorp.com/browse/EXASCALECS-33590i
4. Made changes regarding Failing DB conn, instead of failing it directly we will be checking if the vm nodes are active or not and if they are active we will skip the metric failure. This is delayed due to unavailability of env.
	   PR : https://bitbucket.oci.oraclecorp.com/projects/ECS/repos/escs-sm/pull-requests/5394/overview
	   Jira : https://jira.oci.oraclecorp.com/browse/EXASCALECS-33644 
5.  Got the changes from tharun related tot he easy start script for the faultDomain changes, need to test it in various envs, verified the changes locally in r1. This is delayed due to unavailability of env.
	   PR : https://bitbucket.oci.oraclecorp.com/projects/ECS/repos/escs-sm/pull-requests/5379/overview
	   Jira : https://jira.oci.oraclecorp.com/browse/EXASCALECS-33591

**Merged**

1.  Merged PR where added a check to confirm/check if the canary dir exists or not, this was resulting in canary failures.
	   Jira : https://jira.oci.oraclecorp.com/browse/EXASCALECS-33720
	   PR : https://bitbucket.oci.oraclecorp.com/projects/ECS/repos/escs-sm/pull-requests/5400/overview

    
Happy Weekend !!
 
Thanks and Regards,
Sai Pavan Macha
