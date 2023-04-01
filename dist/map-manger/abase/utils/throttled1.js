/***
 * 节流， 每 500 ms 执行一次
 * @param fn
 * @param delay
 * @return {function(){}}
 */
export function throttled1(fn, delay = 500) {
    let oldtime = Date.now()
    return function (...args) {
        let newtime = Date.now()
        if (newtime - oldtime >= delay) {
            fn.apply(null, args)
            oldtime = Date.now()
        }
    }
}