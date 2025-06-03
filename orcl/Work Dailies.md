100.70.98.113

envName: xperr1
faultDomain: FAULT-DOMAIN-2
vaultFaultDomain: FAULT-DOMAIN-2

ssha
sshb
bash /home/asathyam/Perl/fixr1cert

fixview

hf
phoenix519802.dev3sub2phx.databasede3phx.oraclevcn.com

run this command in your box- sreboot
After 10 mins around it should reboot after that first open box from your local- ssh <guid>@<box_ip>
once logged in to box from local then launch vnc server- vncs8 1


apex
username = 'arun.sathyamurthy@oracle.com'
api_token ='11ebee2ae592500cfc9515e55a8fb8ca2c'


Create virtual env—> Python3 -m venv my_env
Activate virtual environment —> Source myenv/bin/activate
View—> command pallets—> python: interpreter —> select your virtual-env
Installing packages-> export {http,https,ftp}_proxy=http://www-proxy-brmdc.us.oracle.com:80
pip3 install requests (else try: python3 -m pip install — user requests. https://github.com/googlesamples/assistant-sdk-python/issues/236)
unset {http,https,ftp}_proxy

http://www-proxy.us.oracle.com:80



scp <old destination> <new destination>
old= user@ip:<full path>
new= same

scp filename ip:new_dest



For xperr1 and xperr1x, infra is always present
It is created once and we use it forever
Our tests pick that infra using free-form-tags
For xper and xper2 you are creating view based infra not actual infra
A single machines acts like infra in view based infra
Where as in r1 or r1x infra, storage infra comprises of multiple storage cells
Compute infra consists of multiple compute servers
Sort of distributed system env
You can run tests against xper env locally as well, if there is an active infra present in that env


How to setup the infra to locally to run xper and xper2  u ran a file(IT0011..something is it the one)?

if infra is already there just make your machine point to xper/xper2 and run your sm tests
if infra is not there
setup dp on your machine
and then run IT0011
so xper registers your machine with it. your machine acts like data plane hardware now


envName: xper2
ersUrl : https://100.70.98.113:5052for deleting infra it9901

installjava17   
mvn clean install -DskipCodeOwnersCheck=true -Dmaven.javadoc.skip -Dspotbugs.skip -Dpmd.skip -Dcheckstyle.skip -DODOenv=true -DskipITs=true -DskipUTs=true -DskipTests -Dmaven.javadoc.skip=true -P TS1
mvn clean install -s $MAVEN_SETTING -DskipCodeOwnersCheck=true -DODOenv=true -DskipTests=true -DskipITs=true -DskipUTs=true -DskipAdminUI=true -P TS1

ssh -o "ProxyCommand=nc --proxy www-proxy.us.oracle.com:80 %h %p" -i intumt-key.txt opc@129.213.202.57



LDAP - Dengistha_12
Kerbereos - EDITH_z_12
OCNA - _j_tQ74WWuef!TT
#pswds  