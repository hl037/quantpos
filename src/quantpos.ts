import * as M from './matrices'
export * from './matrices'
import { Coords, Coords2D, Coords3D } from './matrices'

export function getMat(el:HTMLElement){
  const s = window.getComputedStyle(el)
  const m = M.fromString(s.transform)
  const trO = s.transformOrigin
  if(trO === undefined){
    return m
  }
  
  const coords = trO.split(' ').map(n => parseInt(n, 10));
  coords[0] = coords[0] - el.offsetWidth / 2;
  coords[1] = coords[1] - el.offsetHeight / 2;
  
  let t:M.Matrix3D, _t:M.Matrix3D;
  t = M.translate(...coords)
  _t = M.translate(...(coords.map(v => -v)))
  
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

/// This function is provided to work with matrices faster, but you should consider using the CoordTranslator class.
/// X_g = M_new X_new = M_old X_old ===> X_new = M_new^-1 M_old X_old
export function transitionMat(m_new:M.Matrix, m_old:M.Matrix):M.Matrix {
  return M.multiply(M.inverse(m_new), m_old)
}

export class CoordTranslator{
  readonly T_ab: M.Matrix
  readonly T_ba: M.Matrix

  constructor(m_a:M.Matrix, m_b:M.Matrix){
    this.T_ab = transitionMat(m_a, m_b)
    this.T_ba = transitionMat(m_b, m_a)
  }

  fromAtoB(x_a:Coords):Coords{
    return M.apply(this.T_ba, x_a)
  }
  
  fromBtoA(x_b:Coords):Coords{
    return M.apply(this.T_ab, x_b)
  }

  static create(el_a:HTMLElement|null|undefined, el_b:HTMLElement|null|undefined){
    return new CoordTranslator(el_a ? getGlobalMat(el_a) : M.identity(), el_b ? getGlobalMat(el_b) : M.identity())
  }
}

export default { ...M, getMat, setMat, getGlobalMat, setGlobalMat, transitionMat, CoordTranslator}
