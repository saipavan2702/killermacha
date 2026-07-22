> [!summary]
> Forward proxies represent clients; reverse proxies represent servers and centralize routing, security, and traffic control.

Map: [[Upskill/SysDes/System Design|System Design]]
Connections: [[Upskill/SysDes/HLD/Load Balancing|Load Balancing]], [[Upskill/SysDes/HLD/Blob Storage and CDN|Blob Storage and CDN]]

## Forward Proxy

**Acts on behalf of CLIENT**

```
Client → Forward Proxy → Server
         (hides client)
```

**Use Cases:**

1. **Accessing Blocked Content (VPN)**

```javascript
// Without VPN (Forward Proxy)
User in China → youtube.com ❌ (blocked by firewall)

// With VPN (Forward Proxy)
User in China → VPN Server (USA) → youtube.com ✅
                 (Server sees VPN IP, not user IP)
```

2. **Corporate Filtering**

```javascript
class ForwardProxy {
    constructor() {
        this.blockedSites = [
            'facebook.com',
            'twitter.com',
            'netflix.com'
        ];
    }

    async handleRequest(url) {
        // Check if site is blocked
        if (this.isBlocked(url)) {
            return {
                status: 403,
                message: 'Site blocked by company policy'
            };
        }

        // Forward request
        const response = await fetch(url);
        return response;
    }

    isBlocked(url) {
        return this.blockedSites.some(site => url.includes(site));
    }
}

// Employee tries to access Facebook
// Request → Forward Proxy → Blocked!
```

3. **Caching**

```javascript
class CachingForwardProxy {
    constructor() {
        this.cache = new Map();
    }

    async handleRequest(url) {
        // Check cache first
        if (this.cache.has(url)) {
            console.log('✅ Cache HIT');
            return this.cache.get(url);
        }

        console.log('❌ Cache MISS - Fetching from server');
        const response = await fetch(url);

        // Cache the response
        this.cache.set(url, response);

        return response;
    }
}
```

## Reverse Proxy

**Acts on behalf of SERVER**

```
Client → Reverse Proxy → Backend Servers
         (hides servers)
```

**Use Cases:**

1. **Load Balancing**

```javascript
class ReverseProxyLoadBalancer {
    constructor(servers) {
        this.servers = servers;
        this.currentIndex = 0;
    }

    async handleRequest(req) {
        // Get next server (round-robin)
        const server = this.servers[this.currentIndex];
        this.currentIndex = (this.currentIndex + 1) % this.servers.length;

        console.log(`Routing request to ${server.url}`);

        // Forward to backend server
        const response = await fetch(`${server.url}${req.path}`, {
            method: req.method,
            headers: req.headers,
            body: req.body
        });

        return response;
    }
}

// Client thinks it's talking to one server
// But reverse proxy distributes across many
const proxy = new ReverseProxyLoadBalancer([
    { url: 'http://backend-1:3000' },
    { url: 'http://backend-2:3000' },
    { url: 'http://backend-3:3000' }
]);
```

2. **SSL Termination**

```javascript
const https = require('https');
const http = require('http');
const httpProxy = require('http-proxy');
const fs = require('fs');

// Reverse proxy handles SSL/TLS
const proxy = httpProxy.createProxyServer({
    target: 'http://backend:3000',  // Backend uses plain HTTP
    secure: false
});

// HTTPS server (handles encryption)
const httpsServer = https.createServer({
    key: fs.readFileSync('private-key.pem'),
    cert: fs.readFileSync('certificate.pem')
}, (req, res) => {
    // Decrypt HTTPS request
    // Forward as HTTP to backend
    proxy.web(req, res);
});

httpsServer.listen(443, () => {
    console.log('Reverse proxy handling SSL on port 443');
});

// Backend servers don't need to handle SSL!
// Reverse proxy does all encryption/decryption
```

**Benefits:**
- Backend servers simpler (no SSL overhead)
- Single place to manage SSL certificates
- Better performance (SSL is CPU-intensive)

3. **Caching Static Assets**

```javascript
class ReverseProxywithCache {
    constructor(backendUrl) {
        this.backend = backendUrl;
        this.cache = new Map();
    }

    async handleRequest(req) {
        // Cache static assets
        if (this.isStaticAsset(req.path)) {
            const cacheKey = req.path;

            if (this.cache.has(cacheKey)) {
                console.log(`Cache HIT: ${req.path}`);
                return this.cache.get(cacheKey);
            }

            // Fetch from backend
            const response = await fetch(`${this.backend}${req.path}`);

            // Cache for 1 hour
            this.cache.set(cacheKey, response);
            setTimeout(() => this.cache.delete(cacheKey), 3600000);

            return response;
        }

        // Dynamic requests - always go to backend
        return await fetch(`${this.backend}${req.path}`);
    }

    isStaticAsset(path) {
        const staticExtensions = ['.jpg', '.png', '.css', '.js', '.pdf'];
        return staticExtensions.some(ext => path.endsWith(ext));
    }
}
```

4. **Security (Hide Backend Infrastructure)**

```javascript
// Client only knows: api.example.com
// Reverse proxy maps to internal servers

class SecureReverseProxy {
    constructor() {
        this.routes = {
            '/api/users': 'http://internal-user-service:5000',
            '/api/products': 'http://internal-product-service:6000',
            '/api/orders': 'http://internal-order-service:7000'
        };
    }

    async handleRequest(req) {
        // Rate limiting
        if (!this.checkRateLimit(req.ip)) {
            return { status: 429, message: 'Too many requests' };
        }

        // Authentication
        if (!this.validateToken(req.headers.authorization)) {
            return { status: 401, message: 'Unauthorized' };
        }

        // Route to internal service
        const targetService = this.routes[req.path];

        if (!targetService) {
            return { status: 404, message: 'Not found' };
        }

        // Internal services not exposed to internet
        const response = await fetch(targetService);
        return response;
    }
}

// Attackers can't directly access internal services
// Must go through reverse proxy security checks
```

## Building Your Own Reverse Proxy

**Complete working example:**

```javascript
const http = require('http');
const httpProxy = require('http-proxy');

// Create proxy server
const proxy = httpProxy.createProxyServer();

// Backend services
const services = {
    '/api/users': 'http://localhost:5001',
    '/api/products': 'http://localhost:5002',
    '/api/orders': 'http://localhost:5003'
};

// Cache for static content
const cache = new Map();

// Reverse proxy server
const server = http.createServer(async (req, res) => {
    console.log(`${req.method} ${req.url}`);

    // 1. Check cache for static assets
    if (req.url.match(/\.(js|css|png|jpg|jpeg|gif)$/)) {
        if (cache.has(req.url)) {
            console.log('✅ Cache HIT');
            res.writeHead(200, { 'Content-Type': 'application/octet-stream' });
            res.end(cache.get(req.url));
            return;
        }
    }

    // 2. Rate limiting
    const clientIP = req.socket.remoteAddress;
    if (!checkRateLimit(clientIP)) {
        res.writeHead(429, { 'Content-Type': 'text/plain' });
        res.end('Too Many Requests');
        return;
    }

    // 3. Route to appropriate backend service
    let targetService = null;

    for (const [path, service] of Object.entries(services)) {
        if (req.url.startsWith(path)) {
            targetService = service;
            break;
        }
    }

    if (!targetService) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Route not found');
        return;
    }

    // 4. Add custom headers
    req.headers['X-Forwarded-For'] = clientIP;
    req.headers['X-Proxy-By'] = 'Custom-Reverse-Proxy';

    // 5. Forward request to backend
    proxy.web(req, res, { target: targetService }, (error) => {
        console.error('Proxy error:', error.message);
        res.writeHead(502, { 'Content-Type': 'text/plain' });
        res.end('Bad Gateway');
    });

    // 6. Cache response for static assets
    proxy.on('proxyRes', (proxyRes, req, res) => {
        if (req.url.match(/\.(js|css|png|jpg)$/)) {
            let body = [];
            proxyRes.on('data', (chunk) => body.push(chunk));
            proxyRes.on('end', () => {
                body = Buffer.concat(body);
                cache.set(req.url, body);
                console.log(`Cached: ${req.url}`);
            });
        }
    });
});

// Rate limiting implementation
const requestCounts = new Map();

function checkRateLimit(ip) {
    const now = Date.now();
    const windowMs = 60000; // 1 minute
    const maxRequests = 100;

    if (!requestCounts.has(ip)) {
        requestCounts.set(ip, []);
    }

    const requests = requestCounts.get(ip);

    // Remove old requests outside window
    const recentRequests = requests.filter(time => now - time < windowMs);

    if (recentRequests.length >= maxRequests) {
        return false; // Rate limit exceeded
    }

    recentRequests.push(now);
    requestCounts.set(ip, recentRequests);

    return true;
}

// Start reverse proxy
server.listen(8080, () => {
    console.log('Reverse proxy running on port 8080');
    console.log('Routes:');
    console.log('  /api/users → localhost:5001');
    console.log('  /api/products → localhost:5002');
    console.log('  /api/orders → localhost:5003');
});
```

**Testing the reverse proxy:**

```bash
# Terminal 1: Start reverse proxy
node reverse-proxy.js

# Terminal 2: Start backend services
# User service on port 5001
node user-service.js

# Terminal 3: Start product service on port 5002
node product-service.js

# Terminal 4: Make requests
curl http://localhost:8080/api/users
# Routed to localhost:5001

curl http://localhost:8080/api/products
# Routed to localhost:5002
```

**Backend service example:**

```javascript
// user-service.js (runs on port 5001)
const express = require('express');
const app = express();

app.get('/api/users', (req, res) => {
    console.log('User service received request');
    console.log('Headers:', req.headers['x-forwarded-for']);

    res.json({
        service: 'user-service',
        users: [
            { id: 1, name: 'Alice' },
            { id: 2, name: 'Bob' }
        ]
    });
});

app.listen(5001, () => {
    console.log('User service running on port 5001');
});
```

---
