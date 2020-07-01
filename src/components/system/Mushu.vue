<template>
    <div>
      <div class="head">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>系统设置</el-breadcrumb-item>
            <el-breadcrumb-item>亩数定价范围</el-breadcrumb-item>
        </el-breadcrumb>
        <p class="indexText">亩数定价范围</p>
      </div>
      <el-card class="main">
        <el-row v-for="item in rowlist" :key="item.id">
            <template>
              <el-col :span="1" class="middletext">
                未超出
              </el-col>
              <el-col :span="1">
                <el-input placeholder="亩数范围" v-model="item.end"></el-input>
              </el-col>
              <el-col :span="2" class="middletext">
                亩的每亩价格为
              </el-col>
              <el-col :span="1">
                <el-input  placeholder="请输入价格" v-model="item.price"></el-input>
              </el-col>
              <el-col :span="1" class="middletext">
                元
              </el-col>
            </template>
        </el-row>
        <el-button type="warning" @click="add" class="btn">新增</el-button>
        <el-button type="danger" @click="remove" class="btn">删减</el-button>
        <el-button type="primary" @click="rangeload" class="btn">提交</el-button>
      </el-card>
    </div>
</template>
<script>
export default {
  data () {
    return {
      rowlist: [
        { end: 50, price: 5 },
        { end: 100, price: 4 },
        { end: 200, price: 3 }
      ]
    }
  },
  created () {
    this.getsys()
  },
  methods: {
    async getsys () {
      const msg = await this.$http.get('system/getMuConfig')
      console.log(msg)
      if (msg.status !== 200) {
        return this.$message.error('获取亩数价格失败！')
      }
      this.rowlist = msg.data.data
    },
    add () {
      this.rowlist.push({ end: 0, price: 0 })
    },
    remove () {
      this.rowlist.pop({ end: 0, price: 0 })
    },
    async rangeload () {
      const msg = await this.$http.post('system/updateMuPrice', this.rowlist)
      if (msg.status !== 200) {
        return this.$message.error('提交失败！')
      }
      this.$message.success('提交成功!')
    }
  }
}
</script>
<style lang="less" scoped>
.head {
  background-color: #fff;
  height: 88px;
}
.btn{
  margin-left: 50px;
  margin-top: 20px;
}
.el-card {
  margin: 35px 25px;
}
.el-button+.el-button {
  margin-left: 50px;
}
.middletext {
  text-align: center;
  height:40px;
  line-height:40px;
}
.el-row {
  padding-left:30px;
  margin-bottom: 10px;
  margin-top: 10px;
}
.main {
  height:630px;
  overflow: auto;
}
</style>
