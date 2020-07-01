<template>
    <div>
      <div class="head">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>系统设置</el-breadcrumb-item>
            <el-breadcrumb-item>通用配置</el-breadcrumb-item>
        </el-breadcrumb>
        <p class="indexText">通用配置</p>
      </div>
      <el-card class="main">
        <el-row>
          <el-col :span="6">
            <el-form label-width="140px">
              <el-form-item label="分销提现门槛：">
                  <el-input placeholder="请输入" v-model="tixian"></el-input>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <el-button type="primary" @click="save">提交</el-button>
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
      const msg = await this.$http.post('system/updateSystemConfig', { minCash: this.tixian })
      if (msg.status !== 200) {
        return this.$message.error('提交失败！')
      }
      this.$message.success('提交成功！')
    }
  }
}
</script>
<style lang="less" scoped>
.el-card {
  margin: 35px 25px;
}
.main {
  height:630px;
  overflow: auto;
}
.head {
  background-color: #fff;
  height: 88px;
}
.el-button--primary {
  margin-left: 350px;
}
.el-row {
  padding-left:30px;
  margin-bottom: 10px;
  margin-top: 10px;
}
</style>
