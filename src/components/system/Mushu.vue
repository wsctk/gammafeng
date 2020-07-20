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
          <el-col class="input1">
            <el-input placeholder="亩数范围" v-model="item.end">
              <template slot="prepend">不大于</template>
            </el-input>
          </el-col>
          <el-col :span="5">
            <el-input placeholder="请输入价格" v-model="item.price">
              <template slot="prepend">亩的每亩价格为</template>
              <template slot="append">元</template>
            </el-input>
          </el-col>
        </el-row>
        <el-button plain type="primary" @click="add" class="btn">新增</el-button>
        <el-button plain type="danger" @click="remove" class="btn">删减</el-button>
        <el-button plain type="success" @click="rangeload" class="btn">提交</el-button>
        <div class="textrule">
          (例子：未超出50亩的每亩价格为5元，未超出100亩的每亩价格为4元
          如果现在您有51亩，则每亩价格为4元，总价为204元)
        </div>
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
      const reg1 = /^(([1-9]\d*)|(0))([.]\d{0,1})?$/
      const reg2 = /^(([1-9]\d*)|(0))$/
      for (let i = 0; i < this.rowlist.length; i++) {
        if (!reg1.test(this.rowlist[i].end)) {
          return this.$message.error('请输入正确的数字格式！')
        }
        if (!reg2.test(this.rowlist[i].price)) {
          return this.$message.error('请输入正确的数字格式！')
        }
      }
      const msg = await this.$http.post('system/updateMuPrice', this.rowlist)
      if (msg.status !== 200) {
        return this.$message.error('提交失败！')
      }
      this.$message.success('提交成功!')
      this.getsys()
    }
  }
}
</script>
<style lang="less" scoped>
/deep/.input1 {
  width:190px;
}
/deep/.el-input__inner {
  width:125px;
}
/deep/.el-input-group__prepend {
  background-color: #f5f7ff !important
}
/deep/.el-input-group__append {
  background-color: #f5f7ff !important
}
.textrule {
  margin-top:30px;
}
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
input {
  width:100px;
  height:24px;
  text-align: center;
  margin:0 10px 0 10px;
  border-radius: 10px;
}
.middletext {
  display:inline-block;
  height:40px;
  line-height:40px;
}
.el-row {
  padding-left:30px;
  margin-bottom: 10px;
  margin-top: 10px;
}
.main {
  height:675px;
}
</style>
