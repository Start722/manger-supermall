<template>
  <div class="login">
    <div class="login_box">
      <div class="login_head">
        <img src="../../assets/logo.png"/>
      </div>
      <el-form ref="loginfrom" class="login_from" :model='loginfrom' :rules='loginfromrules'>
        <el-form-item prop='username'>
          <el-input v-model="loginfrom.username" placeholder="请输入账号" prefix-icon="el-icon-user-solid"></el-input>
        </el-form-item>
        <el-form-item prop='password'>
          <el-input v-model="loginfrom.password" type='password' placeholder="请输入密码" prefix-icon="el-icon-key"></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetlogin">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name:'login',
  data(){
    return {
      //表单登录绑定对象
      loginfrom:{
        username:'18064755205',
        password:'ssj123456'
      },
      //表单的验证规则对象
      loginfromrules:{
        username:[
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 3, max: 11, message: '长度在 3 到 11 个字符', trigger: 'blur' }
        ],
        password:[
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
      }
    }
  },
  methods:{
    resetlogin(){
      this.$refs.loginfrom.resetFields()
    },
    login(){
      //异步请求返回的是promise，需要用async，await来解决
      this.$refs.loginfrom.validate(async valid => {
        if(!valid) return;
        const res = await this.$http.post('login',this.loginfrom)
        if(res.data.code !== 200)return this.$message.error('登录失败！');
        this.$message.success('登录成功！');
        window.sessionStorage.setItem("token",res.data.token);
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style scoped>
  .login{
    background-color: #75cfb8;
    height: 100%;
  }
  .login_box{
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 10px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
  }
  .login_head{
    height: 120px;
    width: 120px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 8px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%,-40%);
    background-color: #fff;
  }
  .login_head img{
    width: 100%;
    height: 100%;
    border: 1px solid #eee;
    border-radius: 50%;
    background-color: #eee;
  }
  .btns{
    display: flex;
    justify-content: flex-end;
  }
  .login_from{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }
</style>
