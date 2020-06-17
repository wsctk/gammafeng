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
            <el-avatar size="small" fit="fill" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
            <el-link href=# target="_blank" class="un">{{userName}}}</el-link>
          </div>
        </el-header>
        <el-container>
          <el-aside :width="isCollapse ? '64px': '14%'">
            <el-menu background-color="#333744" text-color="#fff" unique-opened router default-active="/normalcustomer">
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
            <el-footer height="80px">
              <div class="foot">
                <el-link type="info">帮助</el-link>
                <el-link type="info">隐私</el-link>
                <el-link type="info">条款</el-link>
              </div>
              <p class="pText">copyright&copy;2020 壹零(天津)信息技术有限公司</p>
            </el-footer>
          </el-main>
        </el-container>
    </el-container>
</template>
<script>
export default {
  data () {
    return {
      userName: 'momo.zxy',
      menuList: [
        {
          authName: '用户管理',
          id: 0,
          children: [
            { authName: '普通用户', id: 1, path: 'normalcustomer' },
            { authName: '飞手', id: 2, path: 'flyer' },
            { authName: '农资商', id: 3, path: 'farmer' },
            { authName: '认证记录', id: 4, path: 'checkList' }
          ]
        },
        {
          authName: '派单管理',
          id: 1,
          children: [
            { authName: '派单管理', id: 1, path: 'dispatch' }
          ]
        },
        {
          authName: '商城管理',
          id: 2,
          children: [
            { authName: '商品管理', id: 1, path: 'shop' },
            { authName: '订单管理', id: 2, path: 'order' },
            { authName: '分销记录', id: 3, path: 'retail' },
            { authName: '优惠券管理', id: 4, path: 'coupon' },
            { authName: '图片管理', id: 5, path: 'img' },
            { authName: '分类管理', id: 6, path: 'category' }
          ]
        },
        {
          authName: '资讯管理',
          id: 3,
          children: [
            { authName: '资讯管理', id: 1, path: 'infoList' }
          ]
        },
        {
          authName: '提现管理',
          id: 4,
          children: [
            { authName: '提现管理', id: 1, path: 'tixian' }
          ]
        },
        {
          authName: '系统管理',
          id: 5,
          children: [
            { authName: '通用配置', id: 1, path: 'normalset' },
            { authName: '管理员管理', id: 2, path: 'keeper' }
          ]
        }
      ],
      iconObj: {
        0: 'iconfont icon-account',
        1: 'iconfont icon-account',
        2: 'iconfont icon-editor',
        3: 'iconfont icon-data',
        4: 'iconfont icon-rejected-order',
        5: 'iconfont icon-signboard'
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
    width: 14%;
    color: #fff;
    > span {
      margin-left: 15px
    }
  }
  > .headR{
    display:flex;
    align-items: center;
    height:58px;
    border-bottom: 2px solid #eee;
    width:86%;
  }
}
.un {
  margin-left: 20px;
}
.el-icon-s-fold:before {
  font-size:28px !important;
  margin-left: 25px;
  margin-top: 20px;
}
.el-icon-search:before {
  font-size:28px !important;
  margin-left:1300px;
}
.el-icon-bell:before {
  font-size:28px !important;
  margin-left:15px;
}
.el-avatar--small {
  margin-left: 15px;
  height: 29px;
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right:none
  }
}
.el-main {
  background-color: #eee;
  padding: 0;
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
.el-footer{
  display:flex;
  flex-direction: column;
  align-items:center;
  width:400px;
  margin:0 auto;
  padding:10px 20px;
}
.foot {
  display:flex;
  justify-content: space-between;
  width:160px;
  margin-bottom:10px;
}
.pText {
  font-size: 14px;
  color: #777;
}
</style>
