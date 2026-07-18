> [!summary]
> Replication, backups, and recovery objectives determine how a system survives failures and how much data it can afford to lose.

Map: [[Upskill/SysDes/System Design|System Design]]

## Why Make Databases Redundant?

**Risks:**
1. 🌊 Natural disasters (floods, earthquakes)
2. 💥 Hardware failure (disk corruption)
3. 🔥 Data center fire
4. 🐛 Software bugs causing data corruption

**Solution:** Store copies in multiple locations

## Backup Strategies

### 1. Daily Backup

```python
import schedule
import time
from datetime import datetime

def daily_backup():
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_name = f"backup_{timestamp}.sql"

    # Create database snapshot
    os.system(f"pg_dump mydb > /backups/{backup_name}")

    # Upload to S3
    os.system(f"aws s3 cp /backups/{backup_name} s3://my-backups/")

    print(f"Backup completed: {backup_name}")

# Schedule daily at 2 AM
schedule.every().day.at("02:00").do(daily_backup)

while True:
    schedule.run_pending()
    time.sleep(60)
```

### 2. Weekly Backup

```python
def weekly_backup():
    timestamp = datetime.now().strftime("%Y%m%d")

    # Full database export
    os.system(f"pg_dump -Fc mydb > /backups/weekly_{timestamp}.dump")

    # Store in separate data center
    os.system(f"aws s3 cp /backups/weekly_{timestamp}.dump s3://backups-west/")

schedule.every().monday.at("03:00").do(weekly_backup)
```

**Recovery:**

```bash
# Restore from daily backup
pg_restore -d mydb /backups/backup_20251021_020000.sql

# Data loss: Everything between last backup and crash
```

## Continuous Redundancy (Modern Approach)

**Real-time replication to replica database**

```
    Primary DB
        ↓ (continuous replication)
    Replica DB
```

**Implementation (PostgreSQL):**

```sql
-- Primary Database Configuration (postgresql.conf)
wal_level = replica
max_wal_senders = 3
wal_keep_segments = 64

-- Create replication user
CREATE USER replicator REPLICATION LOGIN ENCRYPTED PASSWORD 'password';

-- Configure pg_hba.conf for replica access
host replication replicator replica_ip/32 md5
```

```sql
-- Replica Database Configuration
primary_conninfo = 'host=primary_ip port=5432 user=replicator password=password'
hot_standby = on
```

**Node.js Application with Failover:**

```javascript
const { Pool } = require('pg');

class DatabaseWithFailover {
    constructor() {
        this.primary = new Pool({
            host: 'primary-db.example.com',
            port: 5432,
            database: 'myapp',
            user: 'app_user',
            password: 'password',
            max: 20
        });

        this.replica = new Pool({
            host: 'replica-db.example.com',
            port: 5432,
            database: 'myapp',
            user: 'app_user',
            password: 'password',
            max: 20
        });

        this.primaryHealthy = true;
        this.monitorPrimaryHealth();
    }

    async monitorPrimaryHealth() {
        setInterval(async ()=> {
            try {
                await this.primary.query('SELECT 1');
                if (!this.primaryHealthy) {
                    console.log('✅ Primary database recovered');
                    this.primaryHealthy = true;
                }
            } catch (error) {
                console.error('❌ Primary database down:', error.message);
                this.primaryHealthy = false;
                await this.promoteReplica();
            }
        }, 5000);  // Check every 5 seconds
    }

    async promoteReplica() {
        console.log('🔄 Promoting replica to primary...');
        // In real scenario, trigger replica promotion command
        // pg_ctl promote -D /var/lib/postgresql/data

        // Swap connections
        const temp = this.primary;
        this.primary = this.replica;
        this.replica = temp;

        console.log('✅ Replica promoted to primary');
    }

    async write(query, params) {
        // All writes go to primary
        try {
            return await this.primary.query(query, params);
        } catch (error) {
            if (!this.primaryHealthy) {
                throw new Error('Primary database unavailable');
            }
            throw error;
        }
    }

    async read(query, params) {
        // Read from replica if available (reduce primary load)
        try {
            if (this.primaryHealthy) {
                return await this.replica.query(query, params);
            } else {
                return await this.primary.query(query, params);
            }
        } catch (error) {
            // Fallback to primary if replica fails
            return await this.primary.query(query, params);
        }
    }
}

// Usage
const db = new DatabaseWithFailover();

// Write operations
app.post('/users', async (req, res) => {
    const { name, email } = req.body;

    const result = await db.write(
        'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
        [name, email]
    );

    res.json(result.rows[0]);
});

// Read operations
app.get('/users', async (req, res) => {
    const result = await db.read('SELECT * FROM users');
    res.json(result.rows);
});
```

## Synchronous vs Asynchronous Replication

### Synchronous Replication

```javascript
// Primary waits for replica acknowledgment
async function syncWrite(data) {
    const startTime = Date.now();

    // Write to primary
    await primaryDB.write(data);

    // Wait for replica to confirm
    await replicaDB.confirm(data);

    const latency = Date.now() - startTime;
    console.log(`Write completed in ${latency}ms`);

    return { status: 'success', latency };
}

// Pros: Zero data loss (replica always in sync)
// Cons: Higher latency (~50-100ms added)
```

### Asynchronous Replication

```javascript
// Primary doesn't wait for replica
async function asyncWrite(data) {
    const startTime = Date.now();

    // Write to primary
    await primaryDB.write(data);

    // Return immediately
    const latency = Date.now() - startTime;
    console.log(`Write completed in ${latency}ms`);

    // Replicate in background
    setImmediate(() => {
        replicaDB.write(data).catch(err => {
            console.error('Replication failed:', err);
            retryQueue.add(data);
        });
    });

    return { status: 'success', latency };
}

// Pros: Lower latency (~10-20ms)
// Cons: Potential data loss if primary crashes before replication
```

## Multi-Region Redundancy

```javascript
class MultiRegionDatabase {
    constructor() {
        this.regions = {
            'us-east': new Pool({ host: 'db-us-east.example.com' }),
            'eu-west': new Pool({ host: 'db-eu-west.example.com' }),
            'ap-south': new Pool({ host: 'db-ap-south.example.com' })
        };
    }

    async write(data) {
        // Write to primary region
        await this.regions['us-east'].query(
            'INSERT INTO users (name, email) VALUES ($1, $2)',
            [data.name, data.email]
        );

        // Asynchronously replicate to other regions
        const replicationPromises = [
            this.regions['eu-west'].query(
                'INSERT INTO users (name, email) VALUES ($1, $2)',
                [data.name, data.email]
            ),
            this.regions['ap-south'].query(
                'INSERT INTO users (name, email) VALUES ($1, $2)',
                [data.name, data.email]
            )
        ];

        // Don't wait for cross-region replication
        Promise.allSettled(replicationPromises).then(results => {
            results.forEach((result, index) => {
                if (result.status === 'rejected') {
                    console.error(`Replication to region ${index} failed`);
                }
            });
        });

        return { status: 'success' };
    }

    async read(userRegion) {
        // Read from nearest region for low latency
        const region = this.getClosestRegion(userRegion);
        return await this.regions[region].query('SELECT * FROM users');
    }

    getClosestRegion(userRegion) {
        // Simple region mapping
        const regionMap = {
            'NA': 'us-east',
            'EU': 'eu-west',
            'ASIA': 'ap-south'
        };
        return regionMap[userRegion] || 'us-east';
    }
}
```

## Point-in-Time Recovery (PITR)

**Restore database to any point in time**

```python
import boto3
from datetime import datetime, timedelta

class DatabaseBackupManager:
    def __init__(self):
        self.rds = boto3.client('rds')

    def create_snapshot(self, db_instance_id):
        """Create manual snapshot"""
        snapshot_id = f"manual-{datetime.now().strftime('%Y%m%d-%H%M%S')}"

        response = self.rds.create_db_snapshot(
            DBSnapshotIdentifier=snapshot_id,
            DBInstanceIdentifier=db_instance_id
        )

        print(f"Snapshot created: {snapshot_id}")
        return snapshot_id

    def restore_to_point_in_time(self, source_db, target_db, restore_time):
        """Restore database to specific timestamp"""

        response = self.rds.restore_db_instance_to_point_in_time(
            SourceDBInstanceIdentifier=source_db,
            TargetDBInstanceIdentifier=target_db,
            RestoreTime=restore_time,
            UseLatestRestorableTime=False
        )

        print(f"Restoring to {restore_time}")
        return response

    def list_available_backups(self, db_instance_id):
        """List all available snapshots"""
        snapshots = self.rds.describe_db_snapshots(
            DBInstanceIdentifier=db_instance_id
        )

        for snapshot in snapshots['DBSnapshots']:
            print(f"Snapshot: {snapshot['DBSnapshotIdentifier']}")
            print(f"Created: {snapshot['SnapshotCreateTime']}")
            print(f"Size: {snapshot['AllocatedStorage']} GB")
            print("---")

# Usage
backup_mgr = DatabaseBackupManager()

# Create snapshot before risky operation
backup_mgr.create_snapshot('production-db')

# Oh no! Bad migration ran at 14:30
# Restore to 5 minutes before
restore_time = datetime(2025, 10, 21, 14, 25, 0)
backup_mgr.restore_to_point_in_time(
    source_db='production-db',
    target_db='production-db-restored',
    restore_time=restore_time
)
```

## Disaster Recovery Plan

```javascript
class DisasterRecoveryOrchestrator {
    constructor() {
        this.primary = 'us-east-1';
        this.failover = 'us-west-2';
        this.activeRegion = this.primary;
    }

    async detectDisaster() {
        const healthChecks = await Promise.allSettled([
            this.checkDatabaseHealth(this.primary),
            this.checkApplicationHealth(this.primary),
            this.checkNetworkHealth(this.primary)
        ]);

        const failures = healthChecks.filter(r => r.status === 'rejected');

        if (failures.length >= 2) {
            console.log('🚨 DISASTER DETECTED - Initiating failover');
            await this.initiateFailover();
        }
    }

    async initiateFailover() {
        console.log('Step 1: Updating DNS to point to failover region');
        await this.updateDNS(this.failover);

        console.log('Step 2: Promoting replica database in failover region');
        await this.promoteDatabase(this.failover);

        console.log('Step 3: Redirecting traffic');
        await this.updateLoadBalancer(this.failover);

        console.log('Step 4: Notifying team');
        await this.sendAlert('Failover completed to ' + this.failover);

        this.activeRegion = this.failover;

        console.log('✅ Failover complete - System operational in ' + this.failover);
    }

    async checkDatabaseHealth(region) {
        const db = this.getDatabaseConnection(region);
        await db.query('SELECT 1');
    }

    async updateDNS(targetRegion) {
        // Update Route53 DNS records
        const route53 = new AWS.Route53();
        await route53.changeResourceRecordSets({
            HostedZoneId: 'Z1234567890ABC',
            ChangeBatch: {
                Changes: [{
                    Action: 'UPSERT',
                    ResourceRecordSet: {
                        Name: 'api.example.com',
                        Type: 'A',
                        AliasTarget: {
                            HostedZoneId: this.getRegionHostedZone(targetRegion),
                            DNSName: this.getLoadBalancerDNS(targetRegion)
                        }
                    }
                }]
            }
        }).promise();
    }
}
```

## Recovery Time Objective (RTO) & Recovery Point Objective (RPO)

```javascript
class BackupStrategy {
    constructor(rto, rpo) {
        this.RTO = rto;  // How quickly to recover (e.g., 1 hour)
        this.RPO = rpo;  // How much data loss acceptable (e.g., 5 minutes)
    }

    getStrategy() {
        // RPO = 0 (zero data loss)
        if (this.RPO === 0) {
            return {
                replication: 'synchronous',
                backup: 'continuous',
                cost: 'high',
                description: 'Synchronous replication to multiple regions'
            };
        }

        // RPO < 5 minutes
        if (this.RPO < 5 * 60) {
            return {
                replication: 'asynchronous',
                backup: 'continuous',
                snapshot_frequency: '1 minute',
                cost: 'medium-high'
            };
        }

        // RPO = 1 hour
        if (this.RPO === 60 * 60) {
            return {
                replication: 'asynchronous',
                backup: 'hourly',
                cost: 'medium'
            };
        }

        // RPO = 24 hours
        return {
            replication: 'none',
            backup: 'daily',
            cost: 'low',
            description: 'Daily backups to S3'
        };
    }
}

// Example: Financial system
const financialSystem = new BackupStrategy(
    RTO = 5 * 60,    // 5 minutes recovery time
    RPO = 0          // Zero data loss
);
console.log(financialSystem.getStrategy());
// Output: Synchronous replication + Multi-region

// Example: Blog site
const blogSystem = new BackupStrategy(
    RTO = 60 * 60,   // 1 hour recovery time
    RPO = 24 * 60 * 60  // 24 hours data loss acceptable
);
console.log(blogSystem.getStrategy());
// Output: Daily backups
```

---

## Related

- [[Upskill/SysDes/HLD/Consistency Models|Consistency Models]]
- [[Upskill/SysDes/HLD/Database Scaling|Database Scaling]]
- [[Upskill/SysDes/HLD/Distributed Systems Papers/Amazon Dynamo|Amazon Dynamo]]
- [[Upskill/SysDes/HLD/Distributed Systems Papers/Apache Cassandra|Apache Cassandra]]
- [[Upskill/SysDes/HLD/Distributed Systems Papers/Hadoop Distributed File System|Hadoop Distributed File System]]
