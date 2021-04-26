<template>
  <el-dialog title="添加角色" :visible.sync="openCardDialog" width="50%"  @close='fromclosed'>
    <span>
      <el-form ref="addactorref" status-icon :model="addactorfrom" :rules="rules" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addactorfrom.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop='roleDesc'>
          <el-input v-model="addactorfrom.roleDesc"></el-input>
        </el-form-item>
      </el-form>
    </span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="openCardDialog = false">取 消</el-button>
      <el-button type="primary" @click="addactor">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data(){
    return{
      addactorfrom:{
        roleName:'',
        roleDesc:''
      },
      rules:{
        roleName:[
          {required: true, message: '请输入角色名称', trigger: 'blur'},
          {min: 3,max: 10,message: '角色名长度在3~10个字符之间',trigger:'blur'}
        ],
      },
    }
  },
  props:{
    addvisible: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    openCardDialog: {
      get() {
        return this.addvisible
      },
      set(val) {
        //console.log(val)
        this.$emit('update:addvisible', val) // openCardDialog改变的时候通知父组件
      }
    }
  },
  methods:{
    fromclosed(){
      this.$refs.addactorref.resetFields()
    },
    addactor(){
      this.$refs.addactorref.validate(async valid => {
        if(valid == false) return
        await this.$http.post('roles',this.addactorfrom)
        this.openCardDialog = false
        // 子组件调用父组件的函数使用emit，同时在父组件里用@绑定需要调用的函数
        this.$emit('getroleslist')
      })
    }
  }
}
</script>

<style scoped>

</style>