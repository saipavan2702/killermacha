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

Now let's take a look at its usage, kind of whole image.

```jsx
import items from '../../../data/items.json';

export default function handler(req, res) {
  const { search, page = 1, limit = 10, sort, filter } = req.query;

  let filteredItems = items;

  // 🔍 Search
  if (search) {
    filteredItems = filteredItems.filter(item =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  // 🏷️ Filter
  if (filter) {
    const filters = filter.split(',');
    filteredItems = filteredItems.filter(item =>
      filters.includes(item.category)
    );
  }

  // 🔃 Sort
  if (sort) {
    const [key, order] = sort.split(':'); // Example: sort=name:asc
    filteredItems.sort((a, b) => {
      if (order === 'asc') return a[key].localeCompare(b[key]);
      if (order === 'desc') return b[key].localeCompare(a[key]);
      return 0;
    });
  }

  // 📑 Pagination
  const startIndex = (page - 1) * limit;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + Number(limit));

  res.status(200).json({
    data: paginatedItems,
    total: filteredItems.length,
    page: Number(page),
    limit: Number(limit),
  });
}
```



#typescript 