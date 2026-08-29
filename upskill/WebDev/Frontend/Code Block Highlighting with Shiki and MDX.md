Tags: #webdev

# Code Block Highlighting with Shiki and MDX
Tags: #webdev #markdown #mdx #shiki #astro #react

## What this is

Nikolai's Reddit post is about a custom **code block renderer** for his personal portfolio/blog website.

It is not a separate `.md` file format and not a standalone app. It is a feature inside his website that makes Markdown/MDX code blocks look rich:

- syntax highlighting
- filename labels
- line numbers
- highlighted lines
- added/removed diff lines
- optional copy button

Source links:

- Reddit post: https://www.reddit.com/r/react/comments/1lctw8p/pretty_stoked_about_my_new_code_component/
- Portfolio repo: https://github.com/nikolailehbrink/portfolio
- Current Shiki code: https://github.com/nikolailehbrink/portfolio/tree/main/src/lib/shiki

## The mental model

Markdown gives you fenced code blocks:

````md
```tsx
const name = "Ved";
console.log(name);
```
````

The word after the opening fence, here `tsx`, tells the renderer which language to highlight.

Nikolai adds extra metadata after the language:

````md
```tsx filename="src/App.tsx" showLineNumbers highlight={2} add={4} remove={5}
const name = "Ved";
console.log(name);

const newFeature = true;
const oldFeature = false;
```
````

That extra text is called the **code fence meta string**.

Plain Markdown does not magically understand `filename`, `add`, `remove`, or `highlight`. His website has Shiki transformers that read those options and add classes/data attributes to the generated HTML. Then CSS styles those classes.

## Can I use this inside a `.md` file?

Yes, but with an important condition:

The `.md` file must be rendered by a site/app that supports Shiki or custom Markdown processing.

Works in places like:

- Astro with Markdown/MDX and Shiki config
- Next.js with MDX plus a custom code component or rehype plugin
- Vite/Astro/static-site pipelines where you control Markdown rendering

Usually does not work automatically in:

- GitHub README preview
- normal VS Code Markdown preview
- default Obsidian preview

Those tools may highlight the language, but they usually ignore custom meta like `add={2}` or `filename="..."`.

## Example usage in Markdown or MDX

Basic syntax highlighting:

````md
```ts
const total = 10 + 20;
```
````

With filename:

````md
```tsx filename="src/components/Button.tsx"
export function Button() {
  return <button>Save</button>;
}
```
````

With line numbers:

````md
```tsx showLineNumbers
export function Button() {
  return <button>Save</button>;
}
```
````

With line numbers starting from a custom number:

````md
```tsx showLineNumbers=20
export function Button() {
  return <button>Save</button>;
}
```
````

With highlighted lines:

````md
```tsx highlight={2,4-5}
export function Button() {
  const label = "Save";

  return <button>{label}</button>;
}
```
````

With diff lines:

````md
```tsx remove={2} add={3}
const theme = "light";
const oldColor = "blue";
const newColor = "green";
```
````

With multiple features together:

````md
```tsx filename="src/App.tsx" showLineNumbers highlight={4} add={6} remove={7}
import { Button } from "./Button";

export default function App() {
  const user = "Ved";

  return <Button label={`Hello ${user}`} />;
  return <button>Hello</button>;
}
```
````

Disable copy button:

````md
```sh noCopy
npm install
```
````

## What the meta options mean

| Option | Meaning |
|---|---|
| `filename="src/App.tsx"` | Shows a filename label above or inside the code block |
| `showLineNumbers` | Shows line numbers from 1 |
| `showLineNumbers=20` | Shows line numbers starting at 20 |
| `highlight={2}` | Highlights line 2 |
| `highlight={2,4-6}` | Highlights line 2 and lines 4 through 6 |
| `add={3}` | Marks line 3 as an added line |
| `remove={5}` | Marks line 5 as a removed line |
| `noCopy` | Hides/disables the copy button |

These names are not universal Markdown features. They work because his website code specifically implements them.

## Where Nikolai uses it

He uses it on his portfolio/blog site:

https://www.nikolailehbr.ink/blog

Repo flow:

1. Blog posts live in `src/content/blog`.
2. Posts are written in `.mdx`.
3. Code fences contain metadata like `filename`, `showLineNumbers`, `add`, `remove`, and `highlight`.
4. Astro runs Shiki during Markdown rendering.
5. Custom Shiki transformers parse the meta string.
6. CSS styles the generated HTML.

Important repo files:

- `astro.config.ts`: registers the Shiki transformers.
- `src/lib/shiki/transformerCodeBlock.ts`: handles `filename`, `noCopy`, language, and code data.
- `src/lib/shiki/transformerLineNumbers.ts`: handles `showLineNumbers`.
- `src/lib/shiki/transformerMeta.ts`: handles `highlight`, `add`, and `remove`.
- `src/styles/global.css`: contains styles for `.line`, `.highlight`, `.add`, `.remove`, and line numbers.

## How this works in Astro

In Astro, Markdown rendering can be configured globally.

Simplified shape:

```ts
// astro.config.ts
import { defineConfig } from "astro/config";
import { transformerCodeBlock } from "./src/lib/shiki/transformerCodeBlock";
import { transformerLineNumbers } from "./src/lib/shiki/transformerLineNumbers";
import {
  transformerMetaDiff,
  transformerMetaHighlight,
} from "./src/lib/shiki/transformerMeta";

export default defineConfig({
  markdown: {
    shikiConfig: {
      themes: {
        light: "github-light",
        dark: "dark-plus",
      },
      transformers: [
        transformerLineNumbers(),
        transformerMetaDiff(),
        transformerMetaHighlight(),
        transformerCodeBlock(),
      ],
    },
  },
});
```

Then inside an `.md` or `.mdx` file:

````md
```tsx filename="src/App.tsx" showLineNumbers highlight={3}
export default function App() {
  return <h1>Hello</h1>;
}
```
````

Astro sends that block through Shiki, and the transformers decide what HTML/classes to generate.

## How this works in Next.js MDX

In Next.js, a common approach is:

1. Use MDX for blog posts.
2. Override how `<pre>` or `<code>` blocks render.
3. Pass code content to a custom React component.
4. Use Shiki to convert raw code to highlighted HTML.
5. Style the generated HTML with CSS.

Very simplified component idea:

```tsx
import { codeToHtml } from "shiki";

type CodeProps = {
  code: string;
  lang?: string;
};

export async function CodeBlock({ code, lang = "ts" }: CodeProps) {
  const html = await codeToHtml(code, {
    lang,
    theme: "github-dark",
  });

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
```

That gives basic syntax highlighting. To get Nikolai-style `highlight={2}` / `add={3}` / `filename="..."`, you also need custom parsing of the Markdown meta string or Shiki transformers.

## Small CSS idea

After transformers add classes, CSS can style them:

```css
pre .line.highlight {
  background: rgba(255, 255, 0, 0.12);
}

pre .line.add {
  background: rgba(34, 197, 94, 0.12);
  border-left: 2px solid rgb(34, 197, 94);
}

pre .line.remove {
  background: rgba(239, 68, 68, 0.12);
  border-left: 2px solid rgb(239, 68, 68);
  opacity: 0.75;
}
```

## Key takeaway

This is not just Markdown. It is Markdown/MDX plus a custom rendering pipeline.

Think of it like this:

```txt
.md or .mdx file
  -> Markdown renderer
  -> Shiki syntax highlighter
  -> custom transformers read metadata
  -> HTML with classes/data attributes
  -> CSS makes it look good
```

The Markdown file only stores the content and metadata. The website code decides what that metadata means.

## When should I use `.md` vs `.mdx`?

Use `.md` when the post is mostly text and code blocks.

Use `.mdx` when you want to embed components inside the article, like:

```mdx
<Alert type="tip">
  This is a custom component inside the article.
</Alert>
```

Both `.md` and `.mdx` can contain fenced code blocks. MDX is more powerful because it allows JSX components inside the content.

## Mini checklist for adding this to my own site

1. Choose the site framework: Astro is the easiest path for this style.
2. Install/use Shiki.
3. Configure Markdown/MDX to use Shiki.
4. Add transformers for line numbers, diff lines, highlighted lines, and filenames.
5. Write code fences with metadata inside `.md` or `.mdx`.
6. Add CSS for `.line`, `.highlight`, `.add`, `.remove`, and the filename/copy button UI.
7. Test one post with all features enabled.

## Tiny practice snippet

Paste this in a supported Markdown/MDX blog post after the renderer is configured:

````md
```tsx filename="src/components/Greeting.tsx" showLineNumbers highlight={4} add={6} remove={7}
type Props = {
  name: string;
};

export function Greeting({ name }: Props) {
  return <h1>Hello, {name}</h1>;
  return <h1>Hi</h1>;
}
```
````

Expected result:

- filename label says `src/components/Greeting.tsx`
- line numbers are visible
- line 4 is highlighted
- line 6 appears as an added line
- line 7 appears as a removed line

