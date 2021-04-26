<template>
  <el-dialog title="修改角色信息" :visible.sync="openeditDialog" width="50%" @close='fromclosed'>
    <span>
      <el-form ref="editactorref" :model='editactorlist' :rules='editactorrules' status-icon label-width="80px">
        <el-form-item label="角色名称" prop='roleName'>
          <el-input v-model="editactorlist.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop='roleDesc'>
          <el-input v-model="editactorlist.roleDesc"></el-input>
        </el-form-item>
      </el-form>
    </span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="openeditDialog = false">取 消</el-button>
      <el-button type="primary" @click="editactor">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data(){
    return{
      editactorlist:{
        roleName:'',
        roleDesc:''
      },
      editactorrules:{
        roleName:[
          {required: true, message: '请输入角色名称', trigger: 'blur'},
          {min: 3,max: 10,message: '角色名长度在3~10个字符之间',trigger:'blur'}
        ],
      }
    }
  },
  props:{
    editvisible:{
      type:Boolean,
      default:false
    },
    actorid:{
      type:Number,
    }
  },
  computed:{
    openeditDialog:{
      get(){
        return this.editvisible
      },
      set(val){
        this.$emit('update:editvisible', val)
      }
    }
  },
  methods:{
    fromclosed(){
      this.$refs.editactorref.resetFields()
    },
    editactor(){
      this.$refs.editactorref.validate(async valid => {
        if(valid == false) return
        //console.log(this.actorid);
        await this.$http.put('roles/'+this.actorid,
        {roleName:this.editactorlist.roleName,roleDesc:this.editactorlist.roleDesc})
        this.openeditDialog = false
        // 子组件调用父组件的函数使用emit，同时在父组件里用@绑定需要调用的函数
        this.$emit('getroleslist')
      })
    }
  }
}
</script>

<style scoped>

</style>