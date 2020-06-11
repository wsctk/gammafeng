<template>
    <div>
      <div class="head">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
            <el-breadcrumb-item>系统设置</el-breadcrumb-item>
            <el-breadcrumb-item>通用配置</el-breadcrumb-item>
        </el-breadcrumb>
        <p class="indexText">通用配置</p>
      </div>
      <el-card>
        <el-form label-width="140px">
          <el-form-item label="分销提现门槛：">
            <el-input placeholder="请输入" v-model="tixian"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="save">保存</el-button>
      </el-card>
    </div>
</template>
<script>
export default {
  data () {
    return {
      tixian: ''
    }
  },
  methods: {
    async save () {
      const msg = await this.$http.post('system/updatesystemconfig', { minCash: this.tixian })
      console.log(msg)
    }
  }
}
</script>
<style lang="less" scoped>
.head {
  background-color: #fff;
  height: 88px;
}
.el-button--primary {
    margin-left: 30px;
}
</style>
