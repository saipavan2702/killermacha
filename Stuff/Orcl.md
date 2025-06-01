
iDB protocol is an **i**ntelligent **D**ata**B**ase protocol which is the heart of the Exadata. It is used to do communication between Database node and cell storage. It transfers data between cell storage  and Database Node. Also it's provides interconnection bandwidth aggregation and failover.

  

+------------------------------------------+

|               Database Servers            |

|                                          |

|  +------------------------------------+  |

|  |                                    |  |

|  |      Oracle Database Instances      |  |

|  |                                    |  |

|  +------------------------------------+  |

|                                          |

+----+----------------------+--------------+

|                      |

+----v----------------------+--------------+

|            InfiniBand Network             |

+----+----------------------+--------------+

|                      |

+----v----------------------+--------------+

|             Storage Servers               |

|                                          |

|  +-----------------------------+         |

|  |    Storage Cells (Disks)    |         |

|  |                             |         |

|  +-----------------------------+         |

|                                          |

+------------------------------------------+
  

**LIBCELL**, which is a library that is linked with the Oracle kernel. LIBCELL has the code that knows how to request data via iDB protocol.

**CELLSRV** Cell Services  is the primary software that runs on the storage cells. It is a multi-threaded program that services I/O requests from a database server.

**Management Server** MS is a Java program that provides the interface between cellsrv and the Cell Command Line Interface (cellcli) utility. MS also provides the interface between cellsrv and the Grid Control Exadata plug-in.

**Restart Server(RS)**RS is actually a set of processes that is responsible for monitoring the other processes and restarting them if necessary

**Input/Output Resource Manager** IORM manages I/O at the storage cell by organising incoming I/O requests into queues according the database name, category, or consumer group that initiated the request. It then services these queues according to the priority defined for them in the resource plan.

**Infiniband Switches** and cables to form a 40 Gb/second InfiniBand fabric for database server to Exadata Storage Server communication, and RAC internode communication.


Migration using EDV(Elastic Data Virtualisation) is easy.

PDB & CDB

  

Public cloud and Cloud @customer.

  

ESCS deployment cycles- Data plane & Control plane

ESCS mircoservices

- SM (customer)

- IM (operator)

- Telemetry proxy (monitor)

- Management proxy (gateway)

AD - availability domain

  

Customer uses management access VM to access Infrastructure manager.

Service Manager consists of Volume, Vault, VM cluster

  

Exascale VM cluster comes preinstalled with some important features.

Features are - VM cluster Migration, Scale CPU count, Restart, start/stop, customer notification

  

Exascale vault supports High Capacity and Extreme Flash types of database storage.

Storage type is not changeable but size is scalable.

  

Vault access types - Grid type and database type.

Exascale volume attachments - enables block level data transport between host and volume. iSCSI and EDV types.

Read-only volume, Volume backup.

  

Infrastructure Manager Entities - Compute infrastructure, compute servers, storage infrastructure, storage servers.

To allocate VM clusters we need compute servers.

Vault and Volumes are built upon storage servers.

  

If it is production issue we check if it is a show-stopper or not and if it is we create a hotfix and manually do this.

Canaries are test cases runs 24/7, auto-triggered, independent.

  

[https://ermannkara.wordpress.com/2019/04/17/what-is-exadata-exadata-overview-configuration-and-architecture/](https://ermannkara.wordpress.com/2019/04/17/what-is-exadata-exadata-overview-configuration-and-architecture/)

[https://k21academy.com/exadata/exadata-overview-architecture/](https://k21academy.com/exadata/exadata-overview-architecture/)

  

In Dev TS1, TS1 post merge, TS2 tags are covered and only -ve tests are done as there is no infra

In integration TS3/TS4 has compute infra so we can do +ve tests too.

  

  

**Getting started**

2 cld env - Public cloud, cloud @ customer

In public  open for all customers

as for c@c reserved for only specific customers

for each customer c@c creates a dedicated separate cld env

It could be either in oracle data center or customrs data centre

eg:- banking sector

for c@c each separate cld is given acces to customer

and for public cloud the cld is in oracle data center and overseed by dev team

based on pc and cc we have the test cases in sm

in 2602-cc tests are not worked for public cld the payloads and use cases are diff

how do we differentiate b/w cc vault & pc vault?

- while creating the vault in payload we specify cloud details in that details one is cld type and infraID
- "infrastructureDetails": {
- "infrastructureType": "CLOUD"
- }
- **CLOUD** or **CLOUD_AT_CUSTOMER**
- so now if a vault is created on pc or c@c, when we create something on top of vault we need not to specify the type of cloud as it is inherited from its parent vault.
- In SM & IM we have 2 types SM ops, and SM clients and vice versa in IM.
- In SM clients apis are exposed to customers ( swagger UI apis) as for SM ops they are related to customer(end service) but not directly exposed to customers. [http://100.70.98.113:24050/ui#/](http://100.70.98.113:24050/ui#/) (ops ui)
- now for IM ops and IM, In IM clients can use it but they cannot use it.
- we trigger responses from swagger UI (control plane) which triggers events in Data plane which can be tracked and reflected in escsopsui.

Control plane is something like our dancing floor, we. trigger  apis, creates events, the ui part is swagger.

View itself is data plane.

ade lsviews

mmacha_tc-phoenix519802 (view-name)       | OSS_MAIN_LINUX.X64_240709 (label-name)      | NONE

ade is a command line tool just like any other linux, basically related to data plane

tags

- TS1, TS2, TS3 (dev & integration - validation happens)
- ts1 can run in dev box and team-city PR build [https://teamcity.oci.oraclecorp.com/viewType.html?buildTypeId=ExascaleCloudService_EscsSmDevelopmentBranch_PrValidationTs1developmentEscsSm&tab=buildTypeStatusDiv](https://teamcity.oci.oraclecorp.com/viewType.html?buildTypeId=ExascaleCloudService_EscsSmDevelopmentBranch_PrValidationTs1developmentEscsSm&tab=buildTypeStatusDiv)
- Once we push a commit git will start a ts1 build and we can see orcl cld devops build history.
- all the test cases TS1 tags will run there.
- tags comes in 2 formats - one is in class lvl and method lvl(only particular method will run).
- class lvl tells u where entire file can run in particular env and env is based on mapping
- method lvl tag determines only that particular method runs in that env

  

  

TS1 -> local box, preliminary PR build (after commit) (dev env)

TS2 -> xper, xper2, devS both are view based env (dev env)

(xper is a pool dev boxes)

TS3 -> xperr1, xperr1x, INTLSN, INTUMT

(INT- integration)

TS3XP  -> xperr1, xperr1x, INTLSN (dev env)

TS3MT  ->  INTUMT (integ env)

There are 2 types of env

- dev (we use to test our PR)
- integration (we use to validate PR)
- once we merge our code with master branch we make sure that it does not affect other existing test case so we run this integ mode

[https://confluence.oraclecorp.com/confluence/pages/viewpage.action?pageId=8437667225](https://confluence.oraclecorp.com/confluence/pages/viewpage.action?pageId=8437667225)