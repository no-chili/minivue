import { effect } from "./effect.js";

export function watch(source,cb,options){
  let getter
  if(typeof source==='function'){
    getter=source
  }else{
    getter=()=>traverse(source)
  }
  let newValue,oldValue
  // 用来存储用户注册的过期回调
  let clearup
  function onInvalidate(fn){
    clearup=fn
  }
  // 封装用户传入的回调
  let job=()=>{
    newValue=effectFn()
    // 优先调用过期回调
    if(clearup){
      clearup()
    }
    cb(newValue,oldValue,onInvalidate)
    oldValue=newValue
  }
  const effectFn=effect(getter,{
    lazy:true,
    scheduler:()=>{
      if(options&&options.flush==='post'){
        const p=Promise.resolve()
        p.then(job)
      }else{
        job()
      }
    }
  })
  
  if(options&&options.immediate){
    job()
  }else{
    oldValue=effectFn()
  }
}

function traverse(value,seen=new Set()){
  if(typeof value!=='object'||value===null||seen.has(value))return
  seen.add(value)
  for (const key in value) {
    traverse(value[key],seen)
  }
  return value
}
