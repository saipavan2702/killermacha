We can use & to select and modify nested classes.
```html
<div class="class1">
	<div class="class2">
	</div>
</div>
```

```css
.class1{
 & .class2{  
 }
}
```



## BEM
 It is an acronym for Block Element Modifiers. It is a naming technique to enable CSS more readable.
```html
<!-- 
Online HTML, CSS and JavaScript editor to run code online.
-->
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="style.css" />
  <title>Browser</title>
</head>
  
<body>
  <div class="card">
	  <div class="card__header">
	    <h2 class="card__title">Card Title</h2>
	  </div>
	  <div class="card__content">
	    <p class="card__text">This is the content of the card.</p>
	  </div>
	  <div class="card__footer">
	    <button class="card__button card__button--primary">Primary Button</button>
	    <button class="card__button card__button--secondary">Secondary Button</button>
	  </div>
  </div>
</body>
</html>
```

```css
body {
  margin: 20px;
}
/* Card Block */
.card {
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  width: 300px; /* Set the desired width */
  margin: 20px;
  & .card__header{
    background-color: #3498db;
  }
}

/* Card Header Element */
.card__header {
  color: #fff;
  padding: 15px;
}

/* Card Title Element */
.card__title {
  margin: 0;
}

/* Card Content Element */
.card__content {
  padding: 15px;
}

/* Card Text Element */
.card__text {
  margin: 0;
}

/* Card Footer Element */
.card__footer {
  background-color: #f1f1f1;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Card Button Element */
.card__button {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &.card__button--primary{
    background-color: #3498db;
   color: #fff;
   }
}


/* Card Secondary Button Modifier */
.card__button--secondary {
  background-color: #ccc;
  color: #333;
  margin-left: 10px;
}

```

Here we can observe some things, firstly BEM is a naming convention and we write block element with `__element` and `--modifier` to denote the behavior or properties for the element. From example, `card__button` or `card__header` they are elements and behavior or property of button is denoted by `card__button--primary`. 


Harry Roberts styl3
```css
.block-name__element-name--modifier-name {/* Styles */}
```

CamelCase style
```css
.BlockName__ElementName_ModifierName {/* Styles */}
```

We mostly use Harry Roberts style. It's properties are:

- Names are written in lowercase
- Words within the names of BEM entities are separated by a hyphen `-`
- An element name is separated from a block name by a double underscore `__`
- Boolean modifiers are delimited by double hyphens `--`
- Key-value type modifiers are not used

Also, pay heed to the css file where calling different elements and modifiers using `&` in css, and it differs from scss preprocessor.

### Shorthand notations
```css
div{
  margin: 10px 20px 10px 30px; /* Top Right Bottom Left*/
  border-radius: 12px 10px 12px 10px /* T-left T-right B-right B-left*/
}
```

Inbuilt counters

```css
<h3>C/C++</h3>
<h3>JavaScript</h3>
<h3>Zig</h3>

body {
  counter-reset: my-counter;
}

h3::before {
  content: "Section " counter(my-counter) ": ";
  counter-increment: my-counter;
}
```

Exploring scope feature in css

```html
<div>
  <style>
    @scope {
      :scope {
        margin-bottom: 10px;
      }
      .title {
        background-color: #eb9b34;
        padding: 10px;
      }

      .body {
        background-color: #ddd;
        border-bottom: 2px solid #eb9b34;
        padding: 10px;
      }
    }
  </style>
  <div class="title">Lorem ipsum dolor sit amet</div>
  <div class="body">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse egestas justo ante, eu accumsan sem vulputate sit amet. Nulla facilisi. Maecenas ac mattis turpis.
  </div>
</div>
```


#ref
[fluid mediaQueries in css](https://www.smashingmagazine.com/2022/01/modern-fluid-typography-css-clamp/)
[flexible mediaQueries](https://blog.logrocket.com/flexible-layouts-without-media-queries/)




#tips
- `@import-normalize` is used to implement consistent styling.
- use clamp instead of media-queries for smaller screens. `width:clamp(50%,700px,90%)`
- `#rrggbbAA` AA denotes the opacity and for 50% opacity (255/2)=128 => 80 (hex)



[[Framer-Motion🌀]]