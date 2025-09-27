React is an open source library. In which react.js is a [[javascript🌵]] framework to build frontend.

#ref
[[React basics🎭]]
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


[[typescript🐉]]
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

[[Next.js🌱]] uses React server components architecture introduced by react.

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

### useMemo

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

This code example defines an expensiveComputation function that takes in two parameters, a and b, and returns their sum.

The MemoizedValue function takes in two props, a and b, and returns a div element that displays the memoized result of calling expensiveComputation with the a and b props.

useMemo is used to memoize the result of calling expensiveComputation with the a and b props as dependencies. This ensures that the expensive computation is only performed when the a or b props change. If the a and b props haven't changed since the last render, useMemo returns the cached value without recomputing it, optimizing performance.

### Memo

memo is a higher-order component (HOC) used to optimize the rendering of PureComponent in React. memo improves rendering performance of functional components by performing a shallow comparison of their props. If the props haven't changed, memo prevents the component from re-rendering, thus improving performance. memo is particularly useful when a component's output is primarily determined by its props and the component has complex rendering logic. Let's see an example with emojis:

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



