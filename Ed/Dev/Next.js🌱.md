In nextjs by default every component is server component. To use a component as client component we have to keep `"use client"` at the top of file.

In this we have to follow some conventions in order to route files. Here every folder is a route, and all folders must be in app folder.
We can practice nested routing here by creating some more folders inside folders.

Now for dynamic routing we are going to follow a convention `[id]` we simply name folder like this. We can also implement nested routing in this too. For private folders we use`_foldername`.

We can nest all routes under one thing by using [catch-all-segments](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes#catch-all-segments) In this we define folder name like this`[...folderName]`.
A custom `not-found.tsx` page can be made using that syntax. Also, wrapping folder name with `(folder)` treats as routing group and does not adds in url path.

Metadata is an API provided by nextjs. We can create page lvl metadata and page lvl metadata an overwrite root lvl as it is read downwards.

For title metadata we can customise for various situations and scenarios by giving it some props.

```tsx
import {Metadata} from "next"

export const metadata:Metadata={
	title:{
		absolut:""{/*in child segment*/},
		default:"Next-js",
		template:"%s | Something"{/**(applies to child route segments not to segment appplied)*/},
	}
}
```

We use Link component to allow client side rendering. Also. `template.tsx` is a something nextjs offers where data does not persists but template will be preserved.

Let's go through the some of next.js api features.
### API Routes in Next.js
- API routes are created in the `pages/api/` directory
- Each file becomes an API endpoint
- File: `pages/api/items/index.js` → Endpoint: `/api/items`

### 1. Main API Route (`pages/api/items/index.js`)

```javascript
import items from '../../../data/items.json';

export default function handler(req, res) {
  // Extract query parameters from URL
  const { search, page = 1, limit = 10, sort, filter } = req.query;
  
  // Start with all items
  let filteredItems = items;

  // 🔍 SEARCH FUNCTIONALITY
  // Filters items by name containing search term (case-insensitive)
  if (search) {
    filteredItems = filteredItems.filter(item =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  // 🏷️ FILTER FUNCTIONALITY  
  // Filter by categories: /api/items?filter=electronics,books
  if (filter) {
    const filters = filter.split(','); // Split comma-separated values
    filteredItems = filteredItems.filter(item =>
      filters.includes(item.category)
    );
  }

  // 🔃 SORTING FUNCTIONALITY
  // Sort format: /api/items?sort=name:asc or sort=name:desc
  if (sort) {
    const [key, order] = sort.split(':');
    filteredItems.sort((a, b) => {
      if (order === 'asc') return a[key].localeCompare(b[key]);
      if (order === 'desc') return b[key].localeCompare(a[key]);
      return 0;
    });
  }

  // 📑 PAGINATION FUNCTIONALITY
  // Calculate which items to show based on page and limit
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + Number(limit);
  const paginatedItems = filteredItems.slice(startIndex, endIndex);

  // Return structured response
  res.status(200).json({
    data: paginatedItems,           // Current page items
    total: filteredItems.length,    // Total matching items
    page: Number(page),             // Current page number  
    limit: Number(limit),           // Items per page
    totalPages: Math.ceil(filteredItems.length / limit) // Total pages
  });
}
```

### 2. Sample Data Structure (`data/items.json`)

```json
[
  { "id": 1, "name": "iPhone 14", "category": "electronics", "price": 999 },
  { "id": 2, "name": "Nike Shoes", "category": "fashion", "price": 120 },
  { "id": 3, "name": "MacBook Pro", "category": "electronics", "price": 2399 },
  { "id": 4, "name": "JavaScript Book", "category": "books", "price": 45 },
  { "id": 5, "name": "T-Shirt", "category": "fashion", "price": 25 }
]
```

### 3. Frontend Implementation (`pages/index.js`)

```javascript
import { useState, useEffect } from 'react';

export default function Home() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    total: 0,
    totalPages: 0
  });
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortOption, setSortOption] = useState('');

  // Fetch data whenever parameters change
  useEffect(() => {
    fetchItems();
  }, [pagination.page, searchTerm, selectedCategory, sortOption]);

  const fetchItems = async () => {
    setLoading(true);
    
    // Build query parameters
    const params = new URLSearchParams({
      page: pagination.page,
      limit: pagination.limit,
    });
    
    if (searchTerm) params.append('search', searchTerm);
    if (selectedCategory) params.append('filter', selectedCategory);
    if (sortOption) params.append('sort', sortOption);
    
    try {
      const response = await fetch(`/api/items?${params}`);
      const data = await response.json();
      
      setItems(data.data);
      setPagination(prev => ({
        ...prev,
        total: data.total,
        totalPages: data.totalPages
      }));
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
    fetchItems();
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Items Directory</h1>
      
      {/* Search and Filter Controls */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '8px', minWidth: '200px' }}
        />
        
        <select 
          value={selectedCategory} 
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{ padding: '8px' }}
        >
          <option value="">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="fashion">Fashion</option>
          <option value="books">Books</option>
        </select>
        
        <select 
          value={sortOption} 
          onChange={(e) => setSortOption(e.target.value)}
          style={{ padding: '8px' }}
        >
          <option value="">No Sorting</option>
          <option value="name:asc">Name A-Z</option>
          <option value="name:desc">Name Z-A</option>
          <option value="price:asc">Price Low-High</option>
          <option value="price:desc">Price High-Low</option>
        </select>
        
        <button onClick={handleSearch} style={{ padding: '8px 16px' }}>
          Search
        </button>
      </div>

      {/* Results */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <p>Found {pagination.total} items</p>
          
          {/* Items List */}
          <div style={{ display: 'grid', gap: '10px' }}>
            {items.map(item => (
              <div key={item.id} style={{ 
                border: '1px solid #ddd', 
                padding: '15px', 
                borderRadius: '5px' 
              }}>
                <h3>{item.name}</h3>
                <p>Category: {item.category}</p>
                <p>Price: ${item.price}</p>
              </div>
            ))}
          </div>
          
          {/* Pagination */}
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <button 
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              style={{ marginRight: '10px', padding: '5px 10px' }}
            >
              Previous
            </button>
            
            <span>
              Page {pagination.page} of {pagination.totalPages}
            </span>
            
            <button 
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              style={{ marginLeft: '10px', padding: '5px 10px' }}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
```
### Query Parameters
- **Access**: `req.query` object contains all URL parameters
- **Example**: `/api/items?search=phone&page=2&limit=5`
- **Destructuring**: `const { search, page, limit } = req.query`
### API Usage Examples
```bash
# Combined parameters
GET /api/items?search=phone&filter=electronics&sort=price:asc&page=1&limit=10
```

### Response Structure
```json
{
  "data": [...],           // Array of items for current page
  "total": 25,            // Total items matching filters
  "page": 1,              // Current page number
  "limit": 10,            // Items per page
  "totalPages": 3         // Total pages available
}
```

### Project Structure
```
my-nextjs-project/
├── pages/
│   ├── api/
│   │   └── items/
│   │       └── index.js    # API route
│   └── index.js            # Frontend page
├── data/
│   └── items.json          # Mock data
└── package.json
```



#typescript 