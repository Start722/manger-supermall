<template>
  <el-card class="box-card">
    <el-table :data="rightslist" border strip>
      <el-table-column label="#" type='index'>
      </el-table-column>
      <el-table-column prop="authName" label="权限名称">
      </el-table-column>
      <el-table-column prop="path" label="路径">
      </el-table-column>
      <el-table-column prop="level" label="权限等级">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.level == '0'">一级权限</el-tag>
          <el-tag type='success' v-else-if="scope.row.level == '1'">二级权限</el-tag>
          <el-tag type='warning' v-else-if="scope.row.level == '2'">三级权限</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>

export default {
  name:'rights',
  components:{
  },
  data(){
    return{
      //权限列表
      rightslist:[]
    }
  },
  created(){
    this.getrightslist()
  },
  methods:{
    async getrightslist(){
      const res = await this.$http.get('rights/list')
      //console.log(res.data.data);
      this.rightslist = res.data.data
      //console.log(res.data.meta.status);
      if(res.data.meta.status == 200)return this.$message.success('获取权限列表成功')
    }
  }
}
</script>

<style scoped>

</style>