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



