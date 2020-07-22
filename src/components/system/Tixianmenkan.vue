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
            <el-form>
              <el-form-item>
                  <el-input placeholder="请输入分销提现门槛" v-model="tixian">
                    <template slot="prepend">分销提现门槛(元)：</template>
                    <el-button slot="append" @click="savemenkan">提交</el-button>
                  </el-input>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
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
          <el-col :span="8">
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
        <el-row>
          <el-col :span="6">
            <el-form>
              <el-form-item>
                  <el-input placeholder="请输入商品分销佣金比例" v-model="distributionProportion">
                    <template slot="prepend">商品分销佣金比例(千分比)：</template>
                    <el-button slot="append" @click="savegoodsretail">提交</el-button>
                  </el-input>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form>
              <el-form-item>
                  <el-input placeholder="请输入派单分销佣金比例" v-model="dispatcherProportion">
                    <template slot="prepend">派单分销佣金比例(千分比)：</template>
                    <el-button slot="append" @click="saveorderretail">提交</el-button>
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
      distributePoints: '',
      dispatcherProportion: '',
      distributionProportion: ''
    }
  },
  created () {
    this.getinfolist()
  },
  methods: {
    // 获取并处理回显数据
    async getinfolist () {
      const msg = await this.$http.get('system/getSystemConfig')
      console.log(msg.data[0])
      if (msg.status !== 200) {
        return this.$message.error('获取基础设置信息失败！')
      }
      this.tixian = msg.data[0].minCash / 100
      this.goodsPoints = msg.data[0].goodsPoints
      this.distributePoints = msg.data[0].distributePoints
      this.dispatcherProportion = msg.data[0].dispatcherProportion
      this.distributionProportion = msg.data[0].distributionProportion
    },
    // 提交提现门槛
    async savemenkan () {
      const reg = /^(([1-9]\d*)|(0))([.]\d{0,2})?$/
      if (!reg.test(this.tixian)) {
        return this.$message.error('请输入正确的数字格式！')
      }
      const msg = await this.$http.post('system/updateSystemConfig', this.$qs.stringify({ minCash: this.tixian }))
      if (msg.status !== 200) {
        return this.$message.error('提交提现门槛失败！')
      }
      this.$message.success('提交提现门槛成功！')
      this.getinfolist()
    },
    // 提交商品积分转化比
    async savegoods () {
      const reg = /^(([1-9]\d*)|(0))$/
      if (!reg.test(this.goodsPoints)) {
        return this.$message.error('请输入正确的数字格式！')
      }
      const msg = await this.$http.post('system/updateSystemConfig', this.$qs.stringify({ goodsPoints: this.goodsPoints }))
      if (msg.status !== 200) {
        return this.$message.error('提交商品积分转化比失败！')
      }
      this.$message.success('提交商品积分转化比成功！')
      this.getinfolist()
    },
    // 提交派单积分转化比
    async saveorder () {
      const reg = /^(([1-9]\d*)|(0))$/
      if (!reg.test(this.goodsPoints)) {
        return this.$message.error('请输入正确的数字格式！')
      }
      const msg = await this.$http.post('system/updateSystemConfig', this.$qs.stringify({ distributePoints: this.distributePoints }))
      if (msg.status !== 200) {
        return this.$message.error('提交派单积分转化比失败！')
      }
      this.$message.success('提交派单积分转化比成功！')
      this.getinfolist()
    },
    // 提交商品分销比例
    async savegoodsretail () {
      const reg = /^(([1-9]\d*)|(0))([.]\d{0,2})?$/
      if (!reg.test(this.distributionProportion)) {
        return this.$message.error('请输入正确的数字格式！')
      }
      const msg = await this.$http.post('system/updateSystemConfig', this.$qs.stringify({ distributionProportion: this.distributionProportion }))
      if (msg.status !== 200) {
        return this.$message.error('提交商品分销比例失败！')
      }
      this.$message.success('提交商品分销比例成功！')
      this.getinfolist()
    },
    // 提交派单分销比例
    async saveorderretail () {
      const reg = /^(([1-9]\d*)|(0))([.]\d{0,2})?$/
      if (!reg.test(this.dispatcherProportion)) {
        return this.$message.error('请输入正确的数字格式！')
      }
      const msg = await this.$http.post('system/updateSystemConfig', this.$qs.stringify({ dispatcherProportion: this.dispatcherProportion }))
      if (msg.status !== 200) {
        return this.$message.error('提交派单分销比例失败！')
      }
      this.$message.success('提交派单分销比例成功！')
      this.getinfolist()
    }
  }
}
</script>
<style lang="less" scoped>
/deep/.el-input__inner {
  width:235px;
}
/deep/.el-input-group__prepend {
  background-color: #f5f7ff !important
}
/deep/.el-input-group__append {
  background-color: #f5f7ff !important
}
/deep/.el-form-item__content {
  margin-left:0 !important
}
/deep/.el-card {
  margin: 35px 25px;
  overflow: auto;
}
.main {
  height:675px;
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
