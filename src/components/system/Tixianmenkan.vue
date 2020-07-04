<template>
    <div>
      <div class="head">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>系统设置</el-breadcrumb-item>
            <el-breadcrumb-item>基础设置</el-breadcrumb-item>
        </el-breadcrumb>
        <p class="indexText">基础设置</p>
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
          <el-col :span="3" :offset="1">
            <el-button type="primary" @click="savemenkan">提交</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form label-width="180px">
              <el-form-item label="商品积分转化比(千分比)：">
                  <el-input placeholder="请输入" v-model="goods"></el-input>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="3" :offset="1">
            <el-button type="primary" @click="savegoods">提交</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form label-width="180px">
              <el-form-item label="需求积分转化比(千分比)：">
                  <el-input placeholder="请输入" v-model="order"></el-input>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="3" :offset="1">
            <el-button type="primary" @click="saveorder">提交</el-button>
          </el-col>
        </el-row>
      </el-card>
    </div>
</template>
<script>
export default {
  data () {
    return {
      tixian: '',
      goods: '',
      order: ''
    }
  },
  methods: {
    async getinfolist () {
      const msg = await this.$http.get()
      if (msg.status !== 200) {
        return this.$message.error('获取基础设置信息失败！')
      }
      this.tixian = msg.data.data.minCash
      this.goods = msg.data.data.minCash
      this.order = msg.data.data.minCash
    },
    async savemenkan () {
      const msg = await this.$http.post('system/updateSystemConfig', this.$qs.stringify({ minCash: this.tixian }))
      if (msg.status !== 200) {
        return this.$message.error('提交失败！')
      }
      this.$message.success('提交成功！')
    },
    async savegoods () {
      const msg = await this.$http.post('system/updateSystemConfig', this.$qs.stringify({ minCash: this.goods }))
      if (msg.status !== 200) {
        return this.$message.error('提交失败！')
      }
      this.$message.success('提交成功！')
    },
    async saveorder () {
      const msg = await this.$http.post('system/updateSystemConfig', this.$qs.stringify({ minCash: this.order }))
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
}
.head {
  background-color: #fff;
  height: 88px;
}
.el-row {
  padding-left:30px;
  margin-bottom: 10px;
  margin-top: 10px;
}
</style>
