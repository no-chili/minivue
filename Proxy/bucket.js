import { activeEffect } from "./effect.js";
const bucket = new WeakMap();
export const track=(target,key)=>{
  if(!activeEffect)return target[key]
    let depsMap=bucket.get(target)
    if(!depsMap){
      bucket.set(target,(depsMap=new Map()))
    }
    let deps=depsMap.get(key)
    if(!deps){
      depsMap.set(key,(deps=new Set()))
    }
    deps.add(activeEffect)
    // deps保存副作用函数依赖的Set集合
    activeEffect.deps.push(deps)
}
export const trigger=(target,key)=>{
  const depsMap=bucket.get(target)
  if(!depsMap) return true
  const effects=depsMap.get(key)
  const effectToRun=new Set()
  effects&&effects.forEach(effectFn=>{
    if(effectFn!==activeEffect){
      effectToRun.add(effectFn)
    }
  })
  effectToRun.forEach(effectFn=>{
    if(effectFn.option.scheduler){
      effectFn.option.scheduler(effectFn)
    }else{
      effectFn()
    }
  })
}
