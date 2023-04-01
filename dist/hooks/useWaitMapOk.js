
export function useWaitMapOk(){
    let map_is_ok = false;
    return {
        setMapOk(){
            map_is_ok = true;
        },
        waitMapOk(){
            return new Promise(resolve => {
                let interval = setInterval(()=>{
                    if(map_is_ok){
                        clearInterval(interval);
                        resolve(this.mapManager);
                    }
                },50);
            })
        },
    }
}