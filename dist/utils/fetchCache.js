
let nextId  =1;
let store = {};
let cache_data = {};
export function fetchCache(fetchFn,params,options){
    if(!fetchFn._catch_fetch_id){
        fetchFn._catch_fetch_id = nextId++;
    }
    let key = [fetchFn._catch_fetch_id,JSON.stringify(params)].join('-');
    if(!cache_data[key]){
        cache_data[key] = {
            init_time:0,
            data_time:0,
            queue_fn:[],
        };
    }
    return new Promise(resolve =>{
        if(cache_data[key].init_time){
            cache_data[key].queue_fn.push(resolve);
            return;
        }
        if(store[key]){
            resolve(store[key]);
        }else{
            cache_data[key].init_time = new Date().getTime();
            fetchFn(params).then(res =>{
                if(res.ok){
                    cache_data[key].data_time = new Date().getTime();
                    store[key] = res;
                }
                cache_data[key].queue_fn.forEach(resolve1 =>{
                    resolve1(res);
                })
                cache_data[key].queue_fn = [];
                cache_data[key].init_time = 0;
                resolve(res);
            })
        }
    })
}