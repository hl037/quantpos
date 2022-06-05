# Quantpos

Quantpos makes FLIP (First Last Invert Play) simple !

It handles all the transform part of the FLIP method.

## Usage

The main usage of this library is to move an html element at another place in the DOM while retaining its graphical position.

### 1) Import the relevant functions :

```
import {getGlobalMat, setGlobalMat} from 'quantpos'
```

### 2) Get the global matrix of your element
```
// let el = document.getElementById('my-el')
let mat = getGlobalMat(el)
```

### 3) Move your element somewhere else in the dom
(Using either method you want)

### 4) Set the global position you retained earlier
```
// let el = document.getElementById('my-el')
setGlobalMat(el, mat)
```

And you're done !

(See Advanced pattern for FLIP animation)

## Install

one of these three commands :

```
npm install quantpos
```

```
pnpm add quantpos
```

```
yarn add quantpos
```

...You know better than me

## API

The matrix class is from `rematrix` https://github.com/jlmakes/rematrix

### getGlobalMat(el:HTMLElement): Matrix
Retrieve the global matrix of the element

### setGlobalMatrix(el:HTMLElement, m:Matrix)
Set an element transform matrix so that its global matrix matches `m`

### toLocalMat(el:HTMLElement, m:Matrix): Matrix
Compute the matrix to be assigned to the `transform` CSS property of `el` so that its global matrix matches `m`

### getMat(el:HTMLElement): Matrix
Retrieve the current (raw) transform matrix of `el` (from `getComputedStyle`)

### setMat(el:HTMLElement, m:Matrix)
Set `m` as the `transform` CSS property matrix value

## Advanced pattern

To do a real FLIP animation, you would generally get the current position of the element (`gm1 = getGlobalMat(el)`), move your element in the DOM to its finale location, and retrieve its (new) current location (`m2 = getMat(el)`). Then compute the matrix for the original position (`m1 = toLocal(el, gm1`).
Finally, pass to your favorite animation framework `m1` and `m2` ans the start and final value of your animation.



