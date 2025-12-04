React is an open source library. In which react.js is a [[javascript]] framework to build frontend.

#ref
[[React basics]]
Class component of react
```jsx
export default class Header extends React.Component {
  render() {
    return(
     <div>
	     <h1>Hi</h1>
     </div>
    );
  }
}
```

Functional component of react
```jsx
export default function Header() {
    return(
     <div>
	     <h1>Hello</h1>
     </div>
    );
}
```


#typescript
Functional Component with Typescript in React
``` tsx
interface Props {}
const Title: FC <Props> = () =>{}; //Or
const Title=({title, subtitle }: Props) =>{};
type FC <P={}> = FunctionComponent<P>;
```

#typescript 
Class Components with TypeScript
```tsx
interface Props {}
class Title extends Component<Props>{};
```

#typescript #ref
[RefLink for Typescript](https://felixgerschau.com/react-typescript-components/)


[[typescript]]
We use react types/ properties to define the variable/event type we are about to perform. For example `React.FormEvent`, `React.ChangeEvent<HTMLInputElement>`

Hooks are the functional components provided by react to simplify the developer handling various states and values.


## Hooks

- #### useId
- #### useRef
- #### useMemo
- #### useState
- #### useEffect
- #### useCallback
- #### useContext

[[Next.js]] uses React server components architecture introduced by react.

*Canvas API* is a html5 It provides a means for drawing graphics via `jsx or js` and can be interpreted via react too. It can be used for animation, game graphics, and real-time video processing.

React Profiler is used to identifying the performance bottlenecks in React applications. It measures, how often a react application renders, the cost of rendering each component, and time spent in rendering it.

One way is to use this via react dev tools and Profiler tab and we can record actions and observe the components behavior. Another is using Profiler API from React, we have to wrap the component by `<Profiler>` component and pass a callback func of `onRender`, it takes arguments of `{id,phase,actualTime,baseTime,startTime,commitTime}`.

```jsx 
function onRender({values}){  
   console.log(values);
}

<Profiler id="App" onRender={onRender}>  
	<App />  
</Profiler>
```

If any component takes extra time rendering its components or, any large component that had to be rendered multiple times, we can simply memorize it using `React.memo(component)`, or using `useMemo` hooks.


---
## LWC Lifecycle Execution Order (Parent → Child)

1. **Parent constructor**  
   - JavaScript creates the parent instance.

2. **Parent connectedCallback()**  
   - Parent is inserted into the DOM.  
   - LWC starts rendering its template.

3. **Child constructor**  
   - While parsing the parent’s template, LWC encounters `<c-child>` and creates the child instance.

4. **Child connectedCallback()**  
   - Child is inserted into the DOM.

5. **Child render()**  
   - Framework calls `render()` to build the child’s HTML.

6. **Child renderedCallback()**  
   - After child’s DOM is in place, this hook runs.  
   - ⚠️ This may run multiple times if reactive properties change.

7. **Parent renderedCallback()**  
   - Only after **all children finish rendering**, the parent’s `renderedCallback()` executes.

## Key Takeaways

- **Constructors** run first (parent → child).  
- **connectedCallback** runs when inserted into DOM.  
- **render() → renderedCallback** ensures DOM is ready.  
- Parent’s `renderedCallback` always fires *after* all children’s rendering completes.  

---
## `useMemo` Hook

`useMemo` is a React hook that **memoizes the result of expensive computations**. It caches the computed value and only recalculates when its dependencies change.

### When to use `useMemo`:
- When you have computationally expensive calculations
- When you want to avoid recalculating values on every render
- When the calculation depends on specific props or state values

### Basic Example:

```jsx
const expensiveComputation = (a, b) => {
  // 🧮 Perform a computationally expensive operation here
  return a + b;
};

const MemoizedValue = ({ a, b }) => {
  const result = useMemo(() => expensiveComputation(a, b), [a, b]);
  return <div>🎉 Result: {result}</div>;
};
```

**How it works:**
- The `expensiveComputation` function takes two parameters `a` and `b`
- `useMemo` memoizes the result with `[a, b]` as dependencies
- The computation only runs when `a` or `b` changes
- If props haven't changed, it returns the cached value

---

## `memo` Higher-Order Component

`memo` is a higher-order component (HOC) that **optimizes component re-rendering** by performing shallow comparison of props. It prevents unnecessary re-renders when props haven't changed.

### When to use `memo`:
- When a component has complex rendering logic
- When the component's output depends primarily on its props
- When you want to prevent re-renders due to parent component updates

### Basic Example:

```jsx
const ComplexComponent = ({ emoji, count }) => {
  // 🎨 Complex rendering logic here
  return (
    <div>
      {emoji.repeat(count)}
    </div>
  );
};

const MemoizedComplexComponent = React.memo(ComplexComponent);
```

**How it works:**
- `React.memo` wraps the component
- Performs shallow comparison of current and previous props
- Only re-renders if props have actually changed
- Prevents unnecessary renders when parent re-renders

---

## Complete Example: Fibonacci Grid

Here's a comprehensive example showing both `useMemo` and `memo` in action:

```tsx
import React, { useState, useMemo } from "react";

// Expensive computation function
const fibonacci = (n: number): number => {
  if (n <= 1) {
    return n;
  }
  return fibonacci(n - 1) + fibonacci(n - 2);
};

// Component using useMemo for expensive calculation
const ColorCell: React.FC<{ color: string; n: number }> = ({ color, n }) => {
  const cellStyle = {
    backgroundColor: color,
    width: "50px",
    height: "50px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "white"
  };

  // 🧮 useMemo prevents recalculating fibonacci on every render
  const fibNumber = useMemo(() => fibonacci(n), [n]);

  return <div style={cellStyle}>{fibNumber}</div>;
};

// Component for rendering a row of colored cells
const ColorRow: React.FC<{ colors: string[]; rowIndex: number }> = ({
  colors,
  rowIndex
}) => {
  return (
    <div style={{ display: "flex" }}>
      {colors.map((color, colIndex) => (
        <ColorCell
          key={colIndex}
          color={color}
          n={rowIndex * colors.length + colIndex}
        />
      ))}
    </div>
  );
};

// Grid component that could benefit from memo
const ColorGrid: React.FC<{
  colors: string[];
  numRows: number;
  numCols: number;
}> = ({ colors, numRows, numCols }) => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    const rowColors = colors.slice(i * numCols, (i + 1) * numCols);
    rows.push(<ColorRow key={i} colors={rowColors} rowIndex={i} />);
  }

  return <div>{rows}</div>;
};

// 🎨 memo prevents ColorGrid from re-rendering when props haven't changed
const MemoizedColorGrid = React.memo(ColorGrid);

// Main App component
const App: React.FC = () => {
  const [colors, setColors] = useState([
    "#FF5733",
    "#33FF57",
    "#3357FF",
    "#FF33F5",
    "#F5FF33",
    "#33F5FF",
    "#FF3333",
    "#33FF33",
    "#3333FF",
    "#FFAF7A",
    "#C70039",
    "#900C3F",
    "#581845",
    "#F0E68C",
    "#B22222",
    "#FFD700",
    "#FFA07A",
    "#20B2AA"
  ]);

  const numRows = 5;
  const numCols = 2;

  const handleShuffleColors = () => {
    setColors((prevColors) => {
      const shuffledColors = [...prevColors];
      for (let i = shuffledColors.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledColors[i], shuffledColors[j]] = [
          shuffledColors[j],
          shuffledColors[i]
        ];
      }
      return shuffledColors;
    });
  };

  return (
    <div>
      <button onClick={handleShuffleColors}>🎲 Shuffle Colors</button>
      <MemoizedColorGrid colors={colors} numRows={numRows} numCols={numCols} />
    </div>
  );
};

export default App;
```

---

## Key Differences

| Aspect | `useMemo` | `memo` |
|--------|-----------|--------|
| **Type** | React Hook | Higher-Order Component |
| **Purpose** | Memoizes computed values | Memoizes entire component |
| **Usage** | Inside functional components | Wraps functional components |
| **What it prevents** | Expensive recalculations | Unnecessary re-renders |
| **Dependencies** | Explicit dependency array | Automatic prop comparison |

## When to Use Each

### Use `useMemo` when:
- You have expensive calculations that depend on props/state
- You want to cache derived data
- The computation result is used multiple times

### Use `memo` when:
- Component has complex rendering logic
- Component receives the same props frequently
- Parent component re-renders often but child props rarely change

---



#ref 
[canvas--1](https://github.com/R4M5E5/Video-Tutorial-Code-React-Drawing-App/tree/main)
[canvas--2](https://github.com/satansdeer/drawing-react-canvas/tree/master)



#tips 
- `npm run lint` to check linting errors in next/react.




#tips 
## React utility libraries
- react-compare-image
- stripe
- @stripe/stripe-js
- use-shopping-cart
- swiper
- framer-motion
- node-cron
- draftjs
- perfect-scrollbar
- react-table
- react-select
- react-tabs
- react-slick
- react-spinners
- react-dnd



