
import * as M from "rematrix";
export * from "rematrix";

export type Coords2D = [number, number]
export type Coords3D = [number, number, number]
export type Coords4D = [number, number, number, number]
export type Coords = Coords2D | Coords3D | Coords4D

/// A function to apply a matrix to a vector because rematrix does not have one
export function apply(m:M.Matrix, x:Coords):Coords{
  const _x:Coords4D = [
    x[0],
    x[1],
    x[2] ?? 0,
    x[3] ?? 1
  ]
  const _m = M.format(m)
  const res:Coords = [0, 0, 0, 0]
  for(let r=0 ; r < 4 ; ++r){
    for(let c=0 ; c < 4 ; ++c){
      const cc = c * 4
      res[r] += _m[r+cc] * _x[c]
    }
  }
  return res
}

export function normalize(x:Coords):Coords4D{
  if(x.length == 4) {
    return [
      x[0] / x[3],
      x[1] / x[3],
      x[2] / x[3],
      x[3]
    ]
  }
  return [
    x[0],
    x[1],
    x[2] ?? 0,
    1
  ]
}

export function translate(...x:[Coords]|number[]):M.Matrix3D{
  if(x[0] === undefined || typeof(x[0]) === "number") {
    return [ // Transposed
      1    , 0    , 0    , 0    ,
      0    , 1    , 0    , 0    ,
      0    , 0    , 1    , 0    ,
      <number> x[0]??0 , <number> x[1]??0, <number> x[2]??0 , <number> x[3]??1 ,
    ]
  }
  else {
    const X = normalize(x[0])
    return [ // Transposed
      1    , 0    , 0    , 0    ,
      0    , 1    , 0    , 0    ,
      0    , 0    , 1    , 0    ,
      X[0] , X[1] , X[2] , X[3] ,
    ]
  }
}
