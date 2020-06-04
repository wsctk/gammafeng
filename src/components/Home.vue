<template>
    <el-container class="home_container">
        <el-header>
          <div class="headL">
            <img src='../assets/heima.png' alt='图标'/>
            <span>伽马蜂管理后台</span>
          </div>
          <div class="headR">
          <span><i class="el-icon-s-fold"></i></span>
          <span><i class="el-icon-search"></i></span>
          <span><i class="el-icon-bell"></i></span>
          <!-- <div class="zhanghao">dengruxinxi</div> -->
          </div>
        </el-header>
        <el-container>
          <el-aside :width="isCollapse ? '64px': '255px'">
            <div class="taggle-button">|||</div>
            <el-menu background-color="#333744" text-color="#fff" active-text-color="#409eff" unique-opened :collapse="isCollapse" :collapse-transition="false" router :default-active="activePath">
              <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
                <template slot="title">
                  <i :class=iconObj[item.id]></i>
                  <span>{{item.authName}}</span>
                </template>
                <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id">
                  <template slot="title" >
                    <!-- <i class="el-icon-menu"></i> -->
                    <span>{{subItem.authName}}</span>
                  </template>
                </el-menu-item>
              </el-submenu>
            </el-menu>
          </el-aside>
          <el-main>
            <router-view></router-view>
          </el-main>
        </el-container>
    </el-container>
</template>
<script>
export default {
  data () {
    return {
      menuList: [
        {
          authName: '用户管理',
          id: 1,
          children: [
            { authName: '用户管理', id: 1, path: 'customerList' },
            { authName: '认证记录', id: 2, path: 'checkList' }
          ]
        },
        { authName: '派单管理', id: 2 },
        { authName: '商城管理', id: 3 },
        { authName: '资讯管理', id: 4 },
        { authName: '提现管理', id: 5 },
        { authName: '系统管理', id: 6 }
      ],
      iconObj: {
        1: 'iconfont icon-account',
        2: 'iconfont icon-account',
        3: 'iconfont icon-editor',
        4: 'iconfont icon-data',
        5: 'iconfont icon-rejected-order',
        6: 'iconfont icon-signboard'
      },
      isCollapse: false,
      activePath: ''
    }
  }
  // created () {
  //   this.getMenuList()
  //   this.activePath = window.sessionStorage.getItem('activePath')
  // }
  // methods: {
  //   logOut () {
  //     window.sessionStorage.clear()
  //     this.$router.push('/login')
  //   },
  //   async getMenuList () {
  //     const { data: res } = await this.$http.get('menus')
  //     if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
  //     this.menuList = res.data
  //   },
  //   toggleCollapse () {
  //     this.isCollapse = !this.isCollapse
  //   },
  //   saveNavState (activePath) {
  //     window.sessionStorage.setItem('activePath', activePath)
  //     this.activePath = activePath
  //   }
  // }
}
</script>
<style lang="less" scoped>
.el-header {
  display:flex;
  justify-content: flex-start;
  background-color: #fff;
  font-size:16px;
  width:100%;
  padding:0;
  > .headL {
    display: flex;
    align-items: center;
    background-color: #000;
    height:100%;
    width: 255px;
    color: #fff;
    > span {
      margin-left: 15px
    }
  }
  > .headR{
    line-height:58px;
    height:58px;
    border-bottom: 2px solid #eee;
    width:86%;
  }
}
.el-icon-s-fold:before {
  font-size:24px !important;
  margin-left:25px;
}
.el-icon-search:before {
  font-size:20px !important;
  margin-left:1300px;
}
.el-icon-bell:before {
  font-size:20px !important;
  margin-left:15px;
}
.zhanghao {
  margin-left: 15px;
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right:none
  }
}
.el-main {
  background-color: #fff
}
.home_container {
  height:100%
}
.iconfont {
  margin-right:10px
}
.taggle-button {
  background-color:#4a5064;
  font-size:10px;
  line-height:24px;
  color:#fff;
  text-align:center;
  letter-spacing:0.2em;
  cursor:pointer;
}
</style>
