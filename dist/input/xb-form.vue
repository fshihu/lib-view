<template>
  <a-form-model  ref="form" :model="form_data" v-bind="$attrs">
    <slot />
  </a-form-model>
</template>

<script>
export default {
  name: "xb-form",

  props:{
    form_data:{
      type:Object,
      default(){
        return {};
      }
    },
  },

  data(){
    return {
      fields:[]
    }
  },
  methods:{

    /**
     *          this.$refs.form.validate().then(()=>{
     *             this.resolve({
     *               form_data:this.form_data,
     *               ok:()=>{ this.close();  }
     *             });
     *           },(err)=>{
     *             this.$message.fail(err[0].message);
     *           });
     * @public
     * @returns {Promise<Object>}
     */
    validate(){
      return new Promise((resolve,reject) => {
        this.$refs.form.validate((valid,err) => {
          if (valid) {
            resolve(this.form_data);
          } else {
            let err_arr = [];
            for(let key in err){
              err_arr.push(...err[key]);
            }
            reject(err_arr);
          }
        });

      })
    },
    /**
     * @public
     * @return {*}
     */
    resetValidation(){
      return this.$refs.form.resetValidation.apply(null,arguments);
    }
  }
}
</script>

<style scoped>

</style>