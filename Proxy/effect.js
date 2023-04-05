// 存储被注册的副作用函数
export let activeEffect;
// effect栈，存储当前副作用函数的嵌套函数
export let effectStack=[]

// 注册副作用函数
export function effect(fn,option={}) {
  const effectFn=()=>{
    clearup(effectFn)
    // 执行副作用函数时，activeEffect指向effectFn，注册为当前副作用函数
    activeEffect=effectFn
    effectStack.push(effectFn)
    const res=fn()
    effectStack.pop()
    activeEffect=effectStack[effectStack.length-1]
    return res
  }
  effectFn.option=option
  effectFn.deps=[]
  if(!option.lazy){
    effectFn()
  }
  return effectFn
}

// 根据deps指向的Set集合中清除该副作用
function clearup(effectFn){
  for(let i=0;i<effectFn.deps.length;i++){
    const deps=effectFn.deps[i]
    deps.delete(effectFn)
  }
  effectFn.deps.length=0
}
