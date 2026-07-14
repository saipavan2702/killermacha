> [!summary]
> Store large binary objects outside transactional databases and serve them through geographically distributed caches.

Map: [[Upskill/SysDes/System Design|System Design]]

## What is Blob Storage?

**Blob = Binary Large Object**

Files like images, videos, PDFs can't be stored efficiently in traditional databases. They're represented as binary data (0s and 1s).

**Why not store in MySQL/MongoDB?**
- Slow queries (1GB video makes queries sluggish)
- Complex scaling and backups
- Expensive compared to blob storage

**Solution:** Use managed blob storage like **AWS S3**

## AWS S3 Overview

**Think of S3 as Google Drive for applications**

```python
# Upload file to S3
import boto3

s3_client = boto3.client('s3')

# Upload image
s3_client.upload_file(
    Filename='profile.jpg',
    Bucket='my-app-images',
    Key='users/user123/profile.jpg'
)

# Generate public URL
url = f"https://my-app-images.s3.amazonaws.com/users/user123/profile.jpg"
```

**S3 Features:**
- ✅ **Scalability:** Automatically scales to petabytes
- ✅ **Durability:** 99.999999999% (11 9's) durability
- ✅ **Cost-Effective:** $0.023/GB/month (cheaper than databases)
- ✅ **Security:** Encryption, access control, pre-signed URLs
- ✅ **Availability:** 99.99% uptime SLA

**Typical Architecture:**

```javascript
// Node.js image upload example
const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const s3 = new AWS.S3();

app.post('/upload', upload.single('image'), async (req, res) => {
    const params = {
        Bucket: 'my-app-images',
        Key: `uploads/${Date.now()}_${req.file.originalname}`,
        Body: req.file.buffer,
        ContentType: req.file.mimetype
    };

    try {
        const result = await s3.upload(params).promise();

        // Store URL in database (not the file itself!)
        await database.users.update({
            userId: req.user.id,
            profileImage: result.Location
        });

        res.json({
            message: 'Upload successful',
            url: result.Location
        });
    } catch (error) {
        res.status(500).json({ error: 'Upload failed' });
    }
});
```

## Content Delivery Network (CDN)

**Problem:** S3 bucket in India → Users in USA experience high latency

```
User (USA) → S3 (India) = 300ms latency
User (Australia) → S3 (India) = 250ms latency
```

**Solution:** CDN caches content on edge servers worldwide

```
User (USA) → CDN Edge (USA) → S3 (India)
             ↑
          Cached content
```

## How CDN Works

**First Request (Cache Miss):**
```
1. User (USA) requests image.jpg
2. Request goes to nearest CDN edge server (USA)
3. Edge server doesn't have file (CACHE MISS)
4. Edge server fetches from Origin (S3 in India)
5. Edge server caches the file
6. Returns file to user (300ms total)
```

**Subsequent Requests (Cache Hit):**
```
1. User (USA) requests image.jpg
2. Request goes to CDN edge server (USA)
3. Edge server HAS the file (CACHE HIT)
4. Returns file immediately (20ms total)
```

**Visual:**

```
         Origin Server (S3 - India)
                  |
                  | (Only on Cache Miss)
                  |
        CDN Edge Servers (Cached)
       /         |          \
   USA Edge   Europe Edge   Asia Edge
      |           |             |
   USA Users   EU Users    Asia Users
```

## CDN Key Concepts

### 1. Time to Live (TTL)
```javascript
// CloudFront cache behavior
{
    "PathPattern": "/images/*",
    "MinTTL": 86400,        // 24 hours minimum
    "DefaultTTL": 2592000,  // 30 days default
    "MaxTTL": 31536000      // 1 year maximum
}
```

### 2. Cache Invalidation
```bash
# Invalidate specific files
aws cloudfront create-invalidation \
    --distribution-id DISTRIBUTION_ID \
    --paths "/images/logo.png" "/css/style.css"
```

### 3. GeoDNS Routing
```
User in USA → Routed to us-east-1 edge
User in Europe → Routed to eu-west-1 edge
User in Asia → Routed to ap-south-1 edge
```

**Example: Setting up CloudFront with S3**

```python
import boto3

cloudfront = boto3.client('cloudfront')

# Create CloudFront distribution
distribution_config = {
    'Origins': {
        'Items': [{
            'Id': 'my-s3-origin',
            'DomainName': 'my-bucket.s3.amazonaws.com',
            'S3OriginConfig': {
                'OriginAccessIdentity': ''
            }
        }]
    },
    'DefaultCacheBehavior': {
        'TargetOriginId': 'my-s3-origin',
        'ViewerProtocolPolicy': 'redirect-to-https',
        'MinTTL': 0,
        'DefaultTTL': 86400,  # 24 hours
        'MaxTTL': 31536000    # 1 year
    },
    'Enabled': True
}

response = cloudfront.create_distribution(
    DistributionConfig=distribution_config
)

cdn_url = response['Distribution']['DomainName']
print(f"CDN URL: https://{cdn_url}")
```

**Before CDN:**
```javascript
// Direct S3 URL
const imageUrl = "https://my-bucket.s3.amazonaws.com/image.jpg";
// Users worldwide hit S3 directly → High latency
```

**After CDN:**
```javascript
// CloudFront URL
const imageUrl = "https://d1234abcd.cloudfront.net/image.jpg";
// Users hit nearest edge server → Low latency
```

---

## Related

- [[Upskill/SysDes/HLD/Proxy Servers|Proxy Servers]]
- [[Upskill/SysDes/HLD/Caching|Caching]]
