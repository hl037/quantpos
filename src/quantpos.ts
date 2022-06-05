import * as M from "rematrix";

type Coords2D = [number, number]
type Coords3D = [number, number, number]

export function getMat(el:HTMLElement){
  const s = window.getComputedStyle(el)
  const m = M.fromString(s.transform)
  const trO = s.transformOrigin
  console.log({
    'id': el.id,
    trO,
  })
  if(trO === undefined){
    return m
  }
  
  const coords = trO.split(' ').map(n => parseInt(n, 10));
  coords[0] = coords[0] - el.offsetWidth / 2;
  coords[1] = coords[1] - el.offsetHeight / 2;
  
  let t:M.Matrix3D, _t:M.Matrix3D;
  if(coords.length == 2){
    t = M.translate(...coords as Coords2D)
    _t = M.translate(...(coords.map(v => -v)) as Coords2D)
  }
  else if(coords.length == 3){
    t = M.translate3d(...coords as Coords3D)
    _t = M.translate3d(...(coords.map(v => -v)) as Coords3D)
  }
  else {
    t = M.translate3d(0, 0, 0)
    _t = M.translate3d(0, 0, 0)
  }
  
  return [
    t,
m,
    _t
  ].reduce(M.multiply)
}

export function setMat(el:HTMLElement, m:M.Matrix|null|undefined|""){
  if(m === null || m === undefined || m == "") {
    el.style.transform = ""
  }
  else {
    el.style.transform = M.toString(m);
  }
}

export function getGlobalMat(el:HTMLElement, resetTransform=false){
  let cur = el
  let m = resetTransform
    ? M.translate(cur.offsetLeft || 0, cur.offsetTop || 0)
    : M.multiply(
        M.translate(cur.offsetLeft || 0, cur.offsetTop || 0),
        getMat(cur),
      )
  cur = cur.offsetParent as HTMLElement
  while(cur !== null){
    m = [
      M.translate(cur.offsetLeft || 0, cur.offsetTop || 0),
      getMat(cur),
      m,
    ].reduce(M.multiply)
    cur = cur.offsetParent as HTMLElement
  }
  return m
}

export function toLocalMat(el:HTMLElement, m:M.Matrix): M.Matrix {
  return M.multiply(
    M.inverse(
      getGlobalMat(el, true)
    ),
    m
  )
}

export function setGlobalMat(el:HTMLElement, m:M.Matrix) {
  setMat(
    el,
    toLocalMat(el, m)
  )
}

export default {getMat, setMat, getGlobalMat, setGlobalMat}
