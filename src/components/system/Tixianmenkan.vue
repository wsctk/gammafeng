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
          <el-col :span="10">
            <el-form>
              <el-form-item>
                  <el-input placeholder="请输入分销提现门槛" v-model="tixian">
                    <template slot="prepend">分销提现门槛：</template>
                    <el-button slot="append" @click="savemenkan">提交</el-button>
                  </el-input>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form>
              <el-form-item>
                  <el-input placeholder="请输入商品积分转化比" v-model="goodsPoints">
                    <template slot="prepend">商品积分转化比(千分比)：</template>
                    <el-button slot="append" @click="savegoods">提交</el-button>
                  </el-input>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form>
              <el-form-item>
                  <el-input placeholder="请输入需求积分转化比" v-model="distributePoints">
                    <template slot="prepend">需求积分转化比(千分比)：</template>
                    <el-button slot="append" @click="saveorder">提交</el-button>
                  </el-input>
              </el-form-item>
            </el-form>
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
      goodsPoints: '',
      distributePoints: ''
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
        return this.$message.error('提交提现门槛失败！')
      }
      this.$message.success('提交提现门槛成功！')
    },
    async savegoods () {
      const msg = await this.$http.post('system/updateSystemConfig', this.$qs.stringify({ goodsPoints: this.goodsPoints }))
      if (msg.status !== 200) {
        return this.$message.error('提交商品积分转化比失败！')
      }
      this.$message.success('提交商品积分转化比成功！')
    },
    async saveorder () {
      const msg = await this.$http.post('system/updateSystemConfig', this.$qs.stringify({ distributePoints: this.distributePoints }))
      if (msg.status !== 200) {
        return this.$message.error('提交派单积分转化比失败！')
      }
      this.$message.success('提交派单积分转化比成功！')
    }
  }
}
</script>
<style lang="less" scoped>
/deep/.el-form-item__content {
  margin-left:0 !important
}
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
