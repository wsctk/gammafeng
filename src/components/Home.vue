<template>
    <el-container class="home_container">
        <el-header>
          <div class="headL">
            <img class="tbimg" src='../assets/logo.png' alt='图标' style="width:40px;height:40px;">
            <span>伽马蜂管理后台</span>
          </div>
          <div class="headR">
            <el-button plain size='small' class="quit" @click="quitlogin" type="danger" round>退出登录</el-button>
          </div>
        </el-header>
        <el-container>
          <el-aside width="14%">
            <div class="menusize">
            <el-menu background-color="#333744" text-color="#fff" unique-opened router :default-active="activepath">
              <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
                <template slot="title">
                  <i :class=iconObj[item.id]></i>
                  <span>{{item.authName}}</span>
                </template>
                <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/'+subItem.path)">
                  <template slot="title">
                    <span>{{subItem.authName}}</span>
                  </template>
                </el-menu-item>
              </el-submenu>
            </el-menu>
            </div>
          </el-aside>
          <el-main width="86%">
            <router-view></router-view>
            <el-footer height="80px">
              <div class="foot">
                <el-link type="info" href="http://www.it-10.com/">壹零(天津)信息技术有限公司</el-link>
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
      // 侧边栏数据
      menuList: [
        {
          authName: '数据预览',
          id: 6,
          children: [
            { authName: '数据预览', id: 1, path: 'datapreview' }
          ]
        },
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
            { authName: '派单管理', id: 1, path: 'dispatch' },
            { authName: '派单分销管理', id: 2, path: 'orderRetail' }
          ]
        },
        {
          authName: '商城管理',
          id: 2,
          children: [
            { authName: '商品管理', id: 1, path: 'shop' },
            { authName: '订单管理', id: 2, path: 'order' },
            { authName: '商品分销记录', id: 3, path: 'retail' },
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
            { authName: '首页轮播图管理', id: 4, path: 'lunbotu' },
            { authName: '基础设置', id: 1, path: 'tixianmenkan' },
            { authName: '亩数定价范围', id: 2, path: 'mushu' },
            { authName: '新人注册优惠券', id: 5, path: 'registercoupon' },
            { authName: '管理员管理', id: 3, path: 'keeper' }
          ]
        }
      ],
      // 侧边栏iconfont
      iconObj: {
        0: 'iconfont icon-account',
        1: 'iconfont icon-icon-test1',
        2: 'iconfont icon-icon-test2',
        3: 'iconfont icon-icon-test',
        4: 'iconfont icon-icon-test3',
        5: 'iconfont icon-icon-test4',
        6: 'iconfont icon-tradingdata'
      },
      // 侧边栏导航地址
      activepath: '/datapreview'
    }
  },
  created () {
    this.getNavState()
  },
  methods: {
    // 登出方法
    async quitlogin () {
      const msg = await this.$http.post('loginOut')
      if (msg.status !== 200) {
        return this.$message.error('登出失败！')
      }
      // 清除储存的session状态
      window.sessionStorage.clear()
      // 改变记住密码状态
      localStorage.removeItem('checked')
      this.$message.success('登出成功！')
      this.$router.push('/login')
    },
    // 存储侧边栏index
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activepath = activePath
    },
    // 获取侧边栏index
    getNavState () {
      const navpath = window.sessionStorage.getItem('activePath')
      if (navpath) {
        this.activepath = navpath
      }
      this.$router.push(this.activepath)
    }
  }
}
</script>
<style lang="less" scoped>
.tbimg {
  margin-left:20px;
  background-color:#eee;
}
.el-header {
  display:flex;
  background-color: #fff;
  font-size:16px;
  width:100%;
  padding:0;
  > .headL {
    display: flex;
    align-items: center;
    background-color: #000;
    width: 14%;
    color: #fff;
    > span {
      margin-left: 15px
    }
  }
  > .headR {
    display:flex;
    align-items: center;
    border-bottom: 2px solid #eee;
    width:86%;
    justify-content: flex-end;
  }
}
.quit {
  margin-right: 40px;
}
.el-icon-s-fold:before {
  font-size:28px !important;
  margin-left: 25px;
  margin-top: 20px;
}
.el-icon-search:before {
  font-size:28px !important;
}
.el-icon-bell:before {
  font-size:28px !important;
  margin-left:15px;
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
  margin-bottom:10px;
}
.pText {
  font-size: 14px;
  color: #777;
}
</style>
