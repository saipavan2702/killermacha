Here we are creating an impression of button being pushed down when it's pressed down and on hover it gets bigger.
```jsx
import { motion } from "framer-motion";

export default function Framer() {
  return (
    <div>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => null}
      >
       Launch Modal
      </motion.button>
    </div>
  );
}
```

```css
.btn:hover{
 transform:scale(1.1)
}
```
Above is general css for above effect. So Framer motion makes our work simple. Basically for normal animation we could say there would be three states `intial`, `animate`, and `exit` which makes our development easier.

```jsx
import { motion } from "framer-motion";
import Backdrop from "./Backdrop";
import PropTypes from "prop-types";

  
export default function Modal({ handleClose, text = "Hi" }) {
  const dropIn = {
    hidden: {
      y: "-100vh",
      opacity: 0,
    },
    visible: {
      y: "0",
      opacity: 1,
      transition: {
        duration: 0.1,
        type: "spring",
        damping: 25,
        stiffness: 500,
      },
    },
    exit: {
      y: "100vh",
      opacity: 0,
    },
  };

  
  return (
    <Backdrop onClick={handleClose}>
      <motion.div
        onClick={(event) => event.stopPropagation()}
        className="modal"
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {text}
      </motion.div>
    </Backdrop>
  );
}


Modal.propTypes = {
  handleClose: PropTypes.func,
  text: PropTypes.string,
};

```

In the above we are taking required props into variants and assigning them to various states of animation.

```jsx
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

  
const Basics = () => {
  const [show, setShow] = useState(true);
  return (
    <div
      style={{
        display: "grid",
        placeContent: "center",
        height: "100vh",
      }}
    >
      <motion.button layout onClick={() => setShow(!show)}>
        Show
      </motion.button>

      <AnimatePresence mode="popLayout">
        {show && (
          <motion.div
            initial={{
              rotate: "0deg",
              scale: 0,
              y: 0,
            }}
            animate={{
              rotate: "180deg",
              scale: 1,
              y: [-10, -50, 100, 50],
            }}
            exit={{
              rotate: "0deg",
              scale: 0,
              y: 0,
            }}
            transition={{
              ease: "easeIn",
              duration: 1,
              times: [0, 0.25, 0.65, 1],
            }}

            style={{
              width: 150,
              height: 150,
              background: "red",
            }}
          ></motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Basics;
```

Now in above first we can see that transition has times feature and animate has y values in an array which syncs both actions over the duration.

[AnimatePresence](https://www.framer.com/motion/animate-presence/) is used to make sure the animation follows exit properties even after component unmounts. It also takes mode which has `popLayout` which enables upper component to adjust when the other component unmounts. Also layout prop makes above transition smooth.

`<MotionConfig/>` gives another kind of expression like variant as the props passed to MotionConfig will be applied to it's children.


Next is controlled animation. We control the animations via external events. We use `useAnimationControls` hook to enable this controlled animation.

```jsx
import { motion, useAnimationControls } from "framer-motion";
import { useState } from "react";


const AnimationControl = () => {
  const control = useAnimationControls();
  const [rotation, setRotation] = useState(90);

  const handleClick = () => {
    setRotation(rotation + 90);
    control.start("flip");
  };

  const animationVarinats = {
    initial: {
      rotate: "0deg",
    },

    flip: {
      rotate: `${rotation}deg`,
      transition: {
        duration: 1,
      },
    },
  };

  
  return (
    <div
      style={{
        display: "grid",
        placeContent: "center",
        height: "100vh",
        gap: "0.8rem",
      }}
    >
      <button onClick={handleClick}>Click me!</button>
      <motion.div
        style={{ width: 100, height: 100, backgroundColor: "blue" }}
        variants={animationVarinats}
        initial="initial"
        animate={control}
      ></motion.div>
    </div>
  );
};

export default AnimationControl;
```

Next up is scroll-based animations we use hooks like `useSpring, useTransform, & useScroll` from framer-motion library. Here `useSpring` is used to get springy effect. We use `useTransform` to dictate the behavior of background color.

```jsx
import { motion, useSpring, useScroll, useTransform } from "framer-motion";

const ScrollAnimation = () => {
  const { scrollYProgress } = useScroll();
  const spring = useSpring(scrollYProgress);
  const background = useTransform(
    scrollYProgress,
    [0, 1],
    ["rgb(86, 1, 245)", "rgb(1, 245, 13)"]
  );

  return (
    <div>
      <motion.div
        style={{
          scaleX: spring,
          transformOrigin: "left",
          position: "sticky",
          background: background,
          width: "700px",
          height: "40px",
          top: 0,
        }}
      ></motion.div>

      <div style={{ maxWidth: "700px" }}>
        <p>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Tempore
          dignissimos sit dolore architecto ea a id nulla omnis suscipit
          deleniti? Autem iure quidem dolorum quasi at, itaque non numquam
          dolor.
        </p>
      </div>
    </div>
  );
};

export default ScrollAnimation;
```

We are going to check out view-based animations with the help of `useInView` hook which takes ref of element and it is triggered when it comes in view.
```jsx
import { motion, useInView } from "framer-motion";
import { useRef, useEffect } from "react";

  
const ViewBased = () => {
  const ref = useRef(null);
  const isView = useInView(ref, { once: true });
  
  useEffect(() => {
    console.log("🚀 ~ file: ViewBased.jsx:10 ~ useEffect ~ ̥:", isView);
  }, [isView]);

  
  return (
    <>
      <div style={{ height: "150vh" }}></div>
      <motion.div
        initial={{ opacity: 0 }}
        style={{
          height: "100vh",
          backgroundColor: "blue",
        }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      ></motion.div>
      <div
        ref={ref}
        style={{
          height: "100vh",
          backgroundColor: "red",
        }}
      ></div>
    </>
  );
};
  
export default ViewBased;
```





#ref
[spring-animation](https://blog.maximeheckel.com/posts/the-physics-behind-spring-animations/)


#tips 
- Use `onClick((e)=>e.stopPropogation())` to make sure that modal does not disappear when it's clicked on.






[[React]]
[[style.CSS]]