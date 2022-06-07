# Quantpos

Quantpos makes FLIP (First Last Invert Play) simple !

It handles all the transform part of the FLIP method.

**npm package** : https://www.npmjs.com/package/quantpos

**github repo** : https://github.com/hl037/quantpos

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

...You know better than me =)

## API from rematrix
The matrix class is from `rematrix` https://github.com/jlmakes/rematrix

All rematrix functions are forward-exported.

The following functions are patches or additions :

### type Coords

```
type Coords2D = [number, number]
type Coords3D = [number, number, number]
type Coords4D = [number, number, number, number]
type Coords = Coords2D | Coords3D | Coords4D
```

### apply(m:Matrix, x:Coords): Coords4D
Apply a matrix to a vector (matrix multiplication with a vector)
NOTE : The result is not normalized (the 4th coordinate may not be 1). Call `normalize()` on the result if you want to use it (as an optimization, you can chain matrix multiplications before normalizing though).

### normalize(x:Coords): Coords4D
Normalize a vector `x`. This function always returns a `Coords4D`. If a `Coords2D` or `Coords3D` are passed, it returns the same vector with 4th coordinate set to 1 and 3rd to 0 if not provided.

### translate(...x:[Coords]|number[]): M.Matrix3D
Create a translation matrix for x. This deffers from the rematrix implementation because this one function handles all thes cases.
You can either pass an array (`Coords`) as the only argument, either pass each coordinates as up to 4 arguments.

## API

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

### transitionMat(m\_new:M.Matrix, m\_old:M.Matrix):M.Matrix
Compute a transition matrix to translate coordinates from the old space to the new space. See https://en.wikipedia.org/wiki/Change\_of\_basis (here, new and old are swapped because you generally want to express the new coordinate as a function of the old)

The matrices to pass to this function are the global matrice of the elements, that you can get from `getGlobalMat()`

### class CoordTranslator
This class is a helper to translate coordinates from an element to another.

#### CoordTranslator.T\_ab
Transition matrix from b to a
why "ab" ? Because : X\_a = T\_ab X\_b where X\_a is the position expressed in basis A and X\_b is the position expressed in basis B. This way, in the equation, a is near a and b is near b.

#### CoordTranslator.T\_ab
`CoordTranslator.T_ab` inverted

#### constructor(m\_a:M.Matrix, m\_b:M.Matrix)
The constructor accept matrices to be more general. `m_a` and `m_b` are global transformation matrices. They repectively represents the basis A and the basis B.

#### create(el\_a:HTMLElement|null|undefined, el\_b:HTMLElement|null|undefined): CoordTranslator [static]
Shortcut that simply does :
```
  return new CoordTranslator(
    el_a ? getGlobalMat(el_a) : M.identity(),
    el_b ? getGlobalMat(el_b) : M.identity()
  )
```

#### fromAtoB(x\_a:Coords): Coords
From `x_a`, expressed in basis A, compute the equivalent coordinates in basis B.

#### fromBtoA(x\_b:Coords) :Coords
From `x_b`, expressed in basis B, compute the equivalent coordinates in basis A.

## Advanced pattern

To do a real FLIP animation, you would generally get the current position of the element (`gm1 = getGlobalMat(el)`), move your element in the DOM to its finale location, and retrieve its (new) current location (`m2 = getMat(el)`). Then compute the matrix for the original position (`m1 = toLocal(el, gm1`).
Finally, pass to your favorite animation framework `m1` and `m2` ans the start and final value of your animation.



