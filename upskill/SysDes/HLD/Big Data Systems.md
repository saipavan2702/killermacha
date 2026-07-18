> [!summary]
> Big-data tools divide work across coordinated machines when one computer cannot process the data efficiently.

Map: [[Upskill/SysDes/System Design|System Design]]

## When Single Machine Isn't Enough

**Scenario: Training ML Model on 1TB Dataset**

```python
# ❌ Single machine approach (will crash or take weeks)
import pandas as pd

# Load entire dataset into memory
df = pd.read_csv('massive_dataset.csv')  # 1TB - RAM overflow!
model.fit(df)  # Even if it fits, training takes forever
```

**Solution: Distributed Processing with Apache Spark**

```python
# ✅ Distributed approach
from pyspark.sql import SparkSession

# Initialize Spark
spark = SparkSession.builder \
    .appName("ML Training") \
    .master("spark://coordinator:7077") \
    .getOrCreate()

# Load data (automatically distributed across workers)
df = spark.read.csv('massive_dataset.csv')

# Transformations executed in parallel across workers
df_processed = df.filter(df['age'] > 18) \
                 .groupBy('country') \
                 .agg({'sales': 'sum'})

# Collect results
results = df_processed.collect()
```

## Apache Spark Architecture

```
           Driver (Coordinator)
          /      |       \
    Executor-1  Exec-2  Exec-3
    (Worker)   (Worker) (Worker)
        |         |        |
    [Partitions] [Part]  [Part]
```

**How it Works:**

1. **Driver** reads job code and divides data into partitions
2. **Executors** process partitions in parallel
3. **Driver** collects and combines results

## Use Cases

**1. ETL (Extract, Transform, Load)**

```python
# Read from multiple sources
user_data = spark.read.parquet('s3://users/')
transaction_data = spark.read.parquet('s3://transactions/')

# Transform (distributed operations)
joined = user_data.join(transaction_data, 'user_id')
aggregated = joined.groupBy('user_id').agg({
    'amount': 'sum',
    'transactions': 'count'
})

# Load to data warehouse
aggregated.write.parquet('s3://analytics/user_summary/')
```

**2. Real-Time Analytics**

```python
from pyspark.sql import functions as F
from pyspark.sql.types import *

# Stream processing
stream = spark.readStream \
    .format('kafka') \
    .option('kafka.bootstrap.servers', 'localhost:9092') \
    .option('subscribe', 'user-events') \
    .load()

# Process stream
events = stream.select(
    F.from_json(F.col('value').cast('string'), schema).alias('data')
).select('data.*')

# Aggregations on streaming data
metrics = events.groupBy(
    F.window('timestamp', '5 minutes'),
    'event_type'
).count()

# Write results
metrics.writeStream \
    .format('console') \
    .start() \
    .awaitTermination()
```

**3. Machine Learning at Scale**

```python
from pyspark.ml.feature import VectorAssembler
from pyspark.ml.classification import RandomForestClassifier

# Prepare features (distributed)
assembler = VectorAssembler(
    inputCols=['age', 'income', 'credit_score'],
    outputCol='features'
)

df_features = assembler.transform(df)

# Train model (distributed across workers)
rf = RandomForestClassifier(
    featuresCol='features',
    labelCol='default',
    numTrees=100
)

model = rf.fit(df_features)  # Training parallelized

# Predictions (distributed)
predictions = model.transform(test_data)
```

## Coordinator Responsibilities

```python
class SparkCoordinator:
    def execute_job(self, data, transformation):
        # 1. Divide data into partitions
        partitions = self.partition_data(data, num_partitions=10)

        # 2. Assign to workers
        tasks = []
        for partition in partitions:
            worker = self.get_available_worker()
            task = worker.process(partition, transformation)
            tasks.append(task)

        # 3. Handle failures
        for task in tasks:
            if task.failed():
                # Reassign to different worker
                new_worker = self.get_available_worker()
                new_worker.process(task.partition, transformation)

        # 4. Collect results
        results = [task.result() for task in tasks]

        # 5. Combine
        final_result = self.combine_results(results)
        return final_result

    def get_available_worker(self):
        # Load balancing logic
        return min(self.workers, key=lambda w: w.current_load)

    def monitor_workers(self):
        # Health checks
        for worker in self.workers:
            if not worker.is_alive():
                self.restart_worker(worker)
```

## When to Use Big Data Tools

**Use When:**
- ✅ Data doesn't fit in single machine's memory
- ✅ Processing takes too long on single machine
- ✅ Need fault tolerance for long-running jobs
- ✅ Examples:
  - Training ML models on TBs of data
  - Processing billions of logs
  - Real-time analytics on streaming data
  - Social network analysis (millions of nodes)

**Don't Use When:**
- ❌ Data fits comfortably in memory (< 100GB)
- ❌ Simple transformations
- ❌ Low latency requirements (distributed has overhead)
- ❌ Small team without big data expertise

---

## Related

- [[Upskill/SysDes/HLD/Message Queues|Message Queues]]
- [[Upskill/SysDes/HLD/Distributed Systems Papers/Google MapReduce|Google MapReduce]]
- [[Upskill/SysDes/HLD/Distributed Systems Papers/Hadoop Distributed File System|Hadoop Distributed File System]]
- [[Upskill/SysDes/HLD/Distributed Systems Papers/Google Bigtable|Google Bigtable]]
