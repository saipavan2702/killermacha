In nextjs by default every component is server component. To use a component as client component we have to keep `"use client"` at the top of file.

In this we have to follow some conventions in order to route files. Here every folder is a route, and all folders must be in app folder.
We can practice nested routing here by creating some more folders inside folders.

Now for dynamic routing we are going to follow a convention `[id]` we simply name folder like this. We can also implement nested routing in this too. For private folders we use`_foldername`.

We can nest all routes under one thing by using [catch-all-segments](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes#catch-all-segments) In this we define folder name like this`[...folderName]`.
A custom `not-found.tsx` page can be made using that syntax. Also, wrapping folder name with `(folder)` treats as routing group and does not adds in url path.

Metadata is an API provided by nextjs. We can create page lvl metadata and page lvl metadata an overwrite root lvl as it is read downwards.

For title metadata we can customize for various situations and scenarios by giving it some props.

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




#typescript 