<template>
  <el-dialog title="分配权限" :visible.sync='opendialog' class="box-card">
    <!-- 树形控件 -->
    <el-tree ref='treeref' :data="rightlist" node-key='id' 
    show-checkbox default-expand-all :props="treeProps"
    :default-checked-keys='defKeys'></el-tree>
    <span slot="footer" class="dialog-footer">
      <el-button @click="opendialog = false">取 消</el-button>
      <el-button type="primary" @click="allotright">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data(){
    return {
      //一级标签和子标签
      treeProps:{
        label:'authName',
        children:'child'
      },
    }
  },
  props:{
    //是否显示的flag
    setdialogvisible:{
      type:Boolean,
      default:false
    },
    // 数据来源
    rightlist:{
      type:Array,
    },
    // 默认选中的节点id值
    defKeys:{
      type:Array
    },
    roleid:{
      type:Number
    }
  },
  computed:{
    opendialog:{
      get(){
        return this.setdialogvisible
      },
      set(val){
        this.$emit('update:setdialogvisible', val)
      }
    }
  },
  methods:{
    async allotright(){
      const keys = [
        ...this.$refs.treeref.getCheckedKeys(),
        ...this.$refs.treeref.getHalfCheckedKeys()
      ]
      const idstr = keys.join(',')
      //console.log(typeof(idstr));
      const res = await this.$http.post(`roles/${this.roleid}/rights`,{ rids: idstr })
      if(res.data.meta.status == 200){
        this.$message.success('修改权限成功！')
      }
      this.$emit('getroleslist')
      this.opendialog = false
    }
  }
}
</script>

<style scoped>

</style>