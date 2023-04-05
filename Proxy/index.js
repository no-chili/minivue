import { trigger,track } from './bucket.js'
import { watch } from "./watch.js";
const data = { name: "chili",flag:false,count:0 };

// 响应式
const obj = new Proxy(data, {
  get(target, key) {
    // 收集入桶
    track(target,key)
    return target[key];
  },
  set(target, key, newVal) {
    target[key] = newVal;
    // 出桶执行
    trigger(target,key)
    return true
  },
});


// effect(()=>{
//   console.log(obj.count);
// },{
//   scheduler(fn){
//     jobQueue.add(fn)
//     flushJob()
//   }
// })
// obj.count++
// obj.count++
// obj.count++

watch(obj,(n,o,inv)=>{
  let i=false
  inv(()=>{
    i=true
  })
})
