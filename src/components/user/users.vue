<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>


    <!-- 卡片视图 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search" @click="getUserList()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" plain @click="adddialogvisible = true">添加用户</el-button>
        </el-col>
      </el-row>


      <el-table border :data='userlist'>
        <el-table-column type='index' label="#"></el-table-column>
        <el-table-column prop="username" label="姓名">
        </el-table-column>
        <el-table-column prop="email" label="邮箱">
        </el-table-column>
        <el-table-column prop="mobile" label="电话">
        </el-table-column>
        <el-table-column prop="role_name" label="角色">
        </el-table-column>
        <el-table-column label="状态">
          <!-- slot-scope是作用域插槽 -->
          <template slot-scope="scope">
            <!-- row获取当行所有的数据 -->
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width='300px'>
          <template slot-scope="scope">
            <el-tooltip :enterable='false' effect="light" content="编辑用户" placement="top">
              <el-button type="primary" icon="el-icon-edit" size='mini' @click="usermsgvisible(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip :enterable='false' effect="light" content="删除用户" placement="top">
              <el-button type="danger" icon="el-icon-delete" size='mini' @click="removeuser(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip :enterable='false' effect="light" content="用户权限" placement="top">
              <el-button type="warning" icon="el-icon-setting" size='mini'></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>


      <!-- 分页区域 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
      </el-pagination>
    </el-card>


    <!-- 添加用户信息 -->
    <el-dialog title="添加用户" :visible.sync="adddialogvisible" width="50%" @close='adddialogclosed'>
      <!-- 内容主题区域 -->
      <span>
        <el-form status-icon :model="addfrom" :rules="addfromrules" ref="addfromrulesref" label-width="70px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addfrom.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addfrom.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addfrom.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="addfrom.mobile"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="adddialogvisible = false">取 消</el-button>
        <el-button type="primary" @click="adduser">确 定</el-button>
      </span>
    </el-dialog>


    <!-- 修改用户信息 -->
    <el-dialog title="修改用户信息" :visible.sync="editusermsgvisible" width="50%" @close='editdialogclosed'>
      <span>
        <el-form status-icon :model="editfrom" :rules="editfromrules" ref="editfromrulesref" label-width="70px">
          <el-form-item label="用户名">
            <el-input v-model="editfrom.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editfrom.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="editfrom.mobile"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editusermsgvisible = false">取 消</el-button>
        <el-button type="primary" @click="editusermsg">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name:'users',
  data(){
    var checkemail = (rule,value,cb) => {
      const checkemail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      if(checkemail.test(value)){
        return cb()
      }
      cb(new Error('请输入合法邮箱！'))
    };
    var checkephone = (rule,value,cb) => {
      const checkephone = /^1[3456789]\d{9}$/
      if(checkephone.test(value)){
        return cb()
      }
      cb(new Error('请输入合法手机号！'))
    };
    return{
      //获取用户列表的参数对象
      queryInfo:{
        query:'',
        //当前的页数
        pagenum:1,
        //当前每页显示多少条数据
        pagesize:5
      },
      userlist:[],
      //总页数
      total:0,
      //添加用户对话框的显示与隐藏
      adddialogvisible:false,
      //修改用户对话框的显示与隐藏
      editusermsgvisible:false,
      // 添加用户的表单数据
      addfrom:{
        username:'',
        password:'',
        email:'@qq.com',
        mobile:''
      },
      // 修改用户的表单数据
      editfrom:{},
      // 修改表单的验证规则
      editfromrules:{
        email:[
          {required: true,message:'请输入邮箱',trigger:'blur'},
          {validator: checkemail,trigger:'blur'}
        ],
        mobile:[
          {required: true,message:'请输入手机号',trigger:'blur'},
          {validator: checkephone,trigger:'blur'}
        ],
      },
      // 添加表单的验证规则
      addfromrules:{
        username:[
          {required: true,message:'请输入用户名',trigger:'blur'},
          {min: 3,max: 10,message: '用户名长度在3~10个字符之间',trigger:'blur'}
        ],
        password:[
          {required: true,message:'请输入密码',trigger:'blur'},
          {min: 6,max: 15,message: '密码长度在6~15个字符之间',trigger:'blur'}
        ],
        email:[
          {required: true,message:'请输入邮箱',trigger:'blur'},
          {validator: checkemail,trigger:'blur'}
        ],
        mobile:[
          {required: true,message:'请输入手机号',trigger:'blur'},
          {validator: checkephone,trigger:'blur'}
        ],
      }
    }
  },
  created(){
    this.getUserList()
  },
  methods:{
    //监听当每页显示多少数据改变
    handleSizeChange(newSize){
      //console.log(newSize); //1
      this.queryInfo.pagesize = newSize
      //console.log(this.queryInfo.pagesize); //1
      this.getUserList()
    },
    //监听页码改变事件
    handleCurrentChange(newPage){
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    //添加用户from的消失重置表单
    adddialogclosed(){
      if(this.adddialogvisible == false){
        this.$refs.addfromrulesref.resetFields()
      }
    },
    //修改用户from的消失重置表单
    editdialogclosed(){
      if(this.editusermsgvisible = false){
        this.$refs.editfromrulesref.resetFields()
      }
    },

    //以下为网络请求----------------------------------------------------------

    //拿到用户数据
    async getUserList(){
      const res = await this.$http.get('userlist',{ params: this.queryInfo })
      this.userlist = res.data.users
      this.total = res.data.total
      //console.log(this.queryInfo);
    },
    //修改权限的boolean值
    async userStateChanged(userinfo){
      //console.log(userinfo);
      await this.$http.put('userlist',`${userinfo.id}`)
      this.$message.success('修改状态成功！')
      //console.log(res);
    },
    //添加新用户到数据库
    adduser(){
      this.$refs.addfromrulesref.validate(async valid => {
        if(valid == false) return
        //发起网络请求
        await this.$http.post('userlist',this.addfrom)
        this.$message.success('添加用户成功！')
        this.adddialogvisible = false
        this.getUserList()
      })
    },
    //编辑用户信息窗口的显示
    async usermsgvisible(id){
      //console.log(id);
      this.editusermsgvisible = true
      const res = await this.$http.get('userlist/'+id)
      this.$message.success('获取当前用户信息')
      this.editfrom = res.data
      //console.log(res.data);
    },
    //修改用户信息并提交
    editusermsg(){
    this.$refs.editfromrulesref.validate(async valid => {
        if(valid == false) return
        //发起网络请求
        //console.log(this.editfrom.email,this.editfrom.mobile);
        await this.$http.put('userlist/' + this.editfrom.id,
        {email:this.editfrom.email,mobile:this.editfrom.mobile})
        this.editusermsgvisible = false
        this.getUserList()
        this.$message.success('修改用户信息成功！')
      })
  },
  //删除用户确认弹窗
  async removeuser(id){
    const res = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        //console.log(res);
        if(res !== 'confirm')
        {
          return this.$message.info('已取消删除')
        }else{
            await this.$http.delete('userlist/'+id)
            this.$message.success('删除用户成功')
            this.getUserList()
        }
  }
  },
}
</script>

<style scoped>

</style>