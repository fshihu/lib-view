<template>
    <a-form-model-item>
        <div  class="ant-row ant-form-item">
            <div class="ant-col ant-form-item-control-wrapper">
                <div class="ant-form-item-control">
                  <span class="ant-form-item-children">
                      <div  class="ant-input filter-time-range">
                          <span class="label">
                              {{$attrs.label || '数字范围'}}：
                          </span>
                          <span  tabindex="0" class="ant-calendar-picker" style="width: 240px;">
                              <span class="ant-calendar-picker-input">
                                  <input type="number" placeholder="最小值" tabindex="-1" class="ant-calendar-range-picker-input" @input="change" v-model="sel_val_start" >
                                  <span class="ant-calendar-range-picker-separator"> - </span>
                                  <input type="number" placeholder="最大值" tabindex="-1" class="ant-calendar-range-picker-input" @input="change" v-model="sel_val_end">
                                  <span class="ant-calendar-picker-icon"></span>
                              </span>
                          </span>
                      </div>
                  </span>
                </div>
            </div>
        </div>
    </a-form-model-item>

</template>

<script>
    export default {
        name: "filter-number",
        props:{
            form_data:null,
            size:null,
            name:'',
        },
        watch:{
            form_data(v){
               if(! v[this.name]){
                   this.sel_val_start = ""
                   this.sel_val_end =""
               }
            }
        },
        data(){
            return {
                sel_val_start:"",
                sel_val_end:""
            }
        },
        methods:{
            change(e){
                if(this.sel_val_end< this.sel_val_start){
                    this.sel_val_end = this.sel_val_start
                }
                this.$set(this.form_data,this.name,{ start:Number(this.sel_val_start),end:Number(this.sel_val_end)} );
              this.$emit('change',this.name);
            },
        }
    }
</script>

<style scoped>

</style>