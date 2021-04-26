<template>
  <el-container class="homecontent">
    <!-- 头部 -->
    <el-header>
      <div class="topheader">
        <img src="../../assets/img/logo.png"/>
        <span>Supermalls后台</span>
      </div>
      <el-button @click="logout" type="danger" plain>Exit</el-button>
    </el-header>
    <!-- 页面主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="iscollapse ? '64px' : '230px'">
        <div class="togglebtn" @click="toggle">|||</div>
        <el-menu 
        :collapse-transition='false' 
        :collapse='iscollapse' 
        :unique-opened='true' 
        :router='true'
        :default-active="$route.path"
        background-color="#bbdfc8" 
        text-color="#fff" 
        active-text-color="#ffd04b">
          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for='item in menuslist' :key='item.id'>
            <!-- 一级菜单模板 -->
            <template slot="title">
              <i :class="iconList[item.id]"></i>
              <span>{{item.authname}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/' + subitem.path" v-for='subitem in item.child' :key='subitem.id'>
              <!-- 二级菜单模板 -->
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subitem.s_mename}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧主体 -->
      <el-main><router-view></router-view></el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name:'home',
  data(){
    return{
      iscollapse:false,
      menuslist:[],
      iconList:{
        '001':'el-icon-user-solid',
        '002':'el-icon-box',
        '003':'el-icon-document',
        '004':'el-icon-shopping-bag-1',
        '005':'el-icon-data-line',
      }
    }
  },
  created(){
    this.getMenuList()
  },
  methods:{
    logout(){
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList(){
      const res = await this.$http.get('menus')
      this.menuslist = res.data
      //console.log(res.data);
    },
    toggle(){
      this.iscollapse = !this.iscollapse
    }
  }
}
</script>

<style scoped>
.homecontent{
  height: 100%;
}
.el-header{
  background-color: #75cfb8;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 25px;
}
.el-aside{
  background-color: #bbdfc8;
}
.el-main{
  background-color: #f0e5d8;
}
.topheader img{
  height: 35px;
  padding-left: 0px;
}
.topheader span{
  padding-left: 8px;
}
.topheader{
  display: flex;
}
.el-menu{
  border-right: 0px;
}
.togglebtn{
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>