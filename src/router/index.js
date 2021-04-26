import Vue from 'vue'
import VueRouter from 'vue-router'

import login from "../views/login/login.vue"
import home from "../views/home/home.vue"
import welcome from "../views/home/chidcomp/Welcome.vue"
import users from "../components/user/users.vue"
import rights from "../components/power/rights/rights.vue"
import roles from "../components/power/roles/roles.vue"

Vue.use(VueRouter)

const router = new VueRouter({
  routes:[
    {
      path:'/',
      redirect:'/login'
    },
    {
      path:'/login',
      component:login
    },
    {
      path:'/home',
      component:home,
      redirect:'/welcome',
      children:[
        {
          path:'/welcome',
          component:welcome
        },
        {
          path:'/users',
          component:users
        },
        {
          path:'/rights',
          component:rights
        },
        {
          path:'/roles',
          component:roles
        }
      ]
    }
  ],
  mode: 'history'
})

//前置路由守卫
router.beforeEach((to,from,next) => {
  if(to.path == '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if(!tokenStr) return next('/login')
  next()
})

export default router


