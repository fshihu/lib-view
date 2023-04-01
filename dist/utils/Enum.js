export  class Enum {
    constructor() {
        this.list  = [];
    }


    getAllValue() {
        return this.list;
    }

    getValueByKey(key) {
        let find = this.getAllValue().find(item => {
            return item.id == key;
        });
        return find?find.name:'';
    }

    add(index, val) {
        this.list.push({
            id: index,
            name: val
        });
    }

    addForList(list, index_name, value_name) {
        this.addForArray(this._getTransformList(list, index_name, value_name));
    }

    addForArray(array) {
        this.list = array;
    }

    _getTransformList(list, index_name, value_name) {
        let arr = [];
        for (let model of list) {
            arr[model[index_name]] = model[value_name];
        }
        return arr;
    }

    initAddDatas() {}
}
Enum.init = function (){
    let obj = new this();
    obj.initAddDatas();
    return obj;
}
Enum.getValues = function(){
    return this.init().getAllValue();
}
Enum.getValueByIndex = function (index){
    return this.init().getValueByKey(index);
}