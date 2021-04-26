<template>
  <div>
    <el-card class="box-card">
      <el-button type="primary" @click="addactor" plain>添加角色</el-button>
      <el-table :data="rolelist" border strip>
        <el-table-column type='expand'>
          <template slot-scope="scope">
            <el-row v-for="(item1,i1) in scope.row.child" :key="item1.id" :class="['bdbottom',i1 === 0 ? 'bdtop' : '', 'vcenter']">
              <!-- 渲染一级权限 -->
              <el-col :span='5'>
                <el-tag closable @close='delateroles(scope.row, item1.id)'>{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span='19'>
                <!-- 通过for嵌套渲染二级权限 -->
                <el-row v-for="(item2,i2) in item1.child" :key="item2.id" :class="[i2 === 0 ? '':'bdtop', 'vcenter']">
                  <el-col :span='6'>
                    <el-tag closable @close='delateroles(scope.row, item2.id)' type='success'>{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 通过for嵌套渲染三级权限 -->
                  <el-col :span='18'>
                    <el-tag v-for="(item3,i3) in item2.child" :key="item3.id" closable 
                      :class="[i3 === 0 ? '':'bdtop']" type='warning' @close='delateroles(scope.row, item3.id)'>
                      {{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
          </el-table-column>
          <el-table-column label="#" type='index'>
          </el-table-column>
          <el-table-column prop="roleName" label="角色名称">
          </el-table-column>
          <el-table-column prop="roleDesc" label="角色描述">
          </el-table-column>
          <el-table-column label="操作" width='300px'>
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size='mini' @click="editactor(scope.row.id)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size='mini' @click="delateactor(scope.row.id)">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" size='mini' @click='showsetdialog(scope.row)'>分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- sync @ -->
    <addactordialog :addvisible.sync="addvisible" @getroleslist='getroleslist'></addactordialog>
    <editactordialog :editvisible.sync="editvisible" :actorid='id' @getroleslist='getroleslist'></editactordialog>
    <setdialog :setdialogvisible.sync="setdialogvisible" :rightlist='rightlist' :defKeys='defKeys' :roleid='roleid' @getroleslist='getroleslist'></setdialog>
  </div>
</template>

<script>

import addactordialog from'./addactordialog'
import editactordialog from './editactordialog'
import setdialog from './setrightdialog'

export default {
  name:'roles',
  components:{
    addactordialog,
    editactordialog,
    setdialog
  },
  data(){
    return{
      //所有角色的列表数据
      rolelist:[],
      addvisible:false,
      editvisible:false,
      setdialogvisible:false,
      id:null,
      rightlist:[],
      // 默认选中的节点id值
      defKeys:[],
      roleid:null
    }
  },
  created(){
    this.getroleslist()
  },
  methods:{
  addactor(){
    this.addvisible = !this.addvisible
  },
  editactor(id){
    this.editvisible = !this.editvisible
    this.id = id
    //console.log(this.actorid);
    //console.log(this.editvisible);
  },

  //展示修改权限dialog
  showsetdialog(role){
    //添加权限的id
    this.roleid = role.id
    //console.log(role);
    //console.log(this.defKeys);
    //console.log(this.setdialogvisible);
    this.getrightlist()
    //默认选中的id
    this.defKeys = []
    this.getleafkeys(role,this.defKeys)
    this.setdialogvisible = !this.setdialogvisible
  },
  // 递归拿到选中的id
  getleafkeys(node,arr){
    //如果是三级菜单
    if(!node.child){
      return arr.push(node.id)
    }
    //console.log(node);
    node.child.forEach(item => this.getleafkeys(item,arr))
  },

  //获取所有角色的列表,以下为网络请求-----------------------------
  async getroleslist(){
    const res = await this.$http.get('roles')
    //console.log(res.data);
    this.rolelist = res.data.data
    //console.log(this.rolelist);
    if(res.data.meta.status == 200){this.$message.success('获取角色列表成功！')}
  },

  // 删除该角色
  async delateactor(id){
    const res = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
      }).catch(err => err)
      //console.log(res);
      if(res !== 'confirm')
      {
        return this.$message.info('已取消删除！')
      }
      else
      {
        const msg = await this.$http.delete('roles/'+id)
        if(msg.data.meta.status == 200){
          this.$message.success('删除角色成功！')
          //console.log(1);
          this.getroleslist()
          //console.log(1);
        }
      }
    },

    // 删除该权限
    async delateroles(role,rightid){
      //console.log(role.id);
      //console.log(role);
      const flag = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if(flag !== 'confirm'){
        return this.$message.info('删除已取消！')
      }
      const res = await this.$http.delete(`roles/${role.id}/rights/${rightid}`)
      if(res.data.meta.status == 200){
        this.$message.success('已删除该权限');
        //console.log(res.data.data);
        role.child = res.data.data
      }
    },

    //为角色添加权限列表获取
    async getrightlist(){
      const res = await this.$http.get('rights/tree')
      //console.log(res.data);
      if(res.data.meta.status == 200){
        this.$message.success('获取权限列表成功！')
        this.rightlist = res.data.data
        //console.log(this.rightlist);
      }
    }
  }
}
</script>

<style scoped>
 .el-tag{
    margin: 7px;
 }
 .bdtop{
    border-top: 1px solid #eee;
 }
 .bdbottom{
    border-bottom: 1px solid #eee;
 }
 .vcenter{
   display: flex;
   align-items: center;
 }
</style>