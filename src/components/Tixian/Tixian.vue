<template>
  <div>
    <div class="head">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>提现管理</el-breadcrumb-item>
        <el-breadcrumb-item>提现记录</el-breadcrumb-item>
      </el-breadcrumb>
      <p class="indexText">提现记录</p>
    </div>
    <el-card>
      <el-form :inline="true" :model="queryinfo" ref="queryInfoRef">
        <el-form-item label="用户手机号：" class="firInput">
          <el-input placeholder="请输入" v-model="queryinfo.phoneNumber"></el-input>
        </el-form-item>
        <el-form-item label="用户身份：">
          <el-select placeholder="请选择" v-model="queryinfo.userStatus">
            <el-option label="普通用户" value="0"></el-option>
            <el-option label="飞手" value="1"></el-option>
            <el-option label="农资商" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="anniu">
          <el-button type="primary" @click="querylist">查询</el-button>
          <el-button plain @click="resetField">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="tableData" style="width: 100%" border>
        <el-table-column align="center" prop="id" label="提现记录ID">
        </el-table-column>
        <el-table-column align="center" prop="gmUser.wechatName" label="用户名">
        </el-table-column>
        <el-table-column align="center" prop="gmUser.phoneNumber" label="手机号码">
        </el-table-column>
        <el-table-column align="center" prop="gmUser.userStatus" label="用户身份">
        </el-table-column>
        <el-table-column align="center" prop="drawMoney" label="提现金额">
        </el-table-column>
        <el-table-column align="center" prop="balance" label="钱包余额">
        </el-table-column>
        <el-table-column align="center" prop="drawTime" label="发起时间">
          <template v-slot="scope">
            {{ scope.row.drawTime | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="accountTime" label="到账时间">
          <template v-slot="scope">
            {{ scope.row.accountTime | dateFormat}}
          </template>
        </el-table-column>
    </el-table>
    <el-pagination
      background
      :page-sizes="[1, 5, 10, 20]"
      :page-size="10"
      :page-count="11"
      :current-page="currentPage"
      layout="total, slot, prev, pager, next, sizes, jumper"
      :total="total">
      <span class="slotText">第{{pageNum}}/{{total/5}}页</span>
    </el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      tableData: [],
      currentPage: 1,
      total: 400,
      pageNum: 1,
      queryinfo: {
        userStatus: '',
        phoneNumber: ''
      }
    }
  },
  created () {
    this.getCustomerList()
  },
  methods: {
    resetField () {
      this.$refs.queryInfoRef.resetFields()
    },
    async getCustomerList () {
      const msg = await this.$http.get('draw/drawList')
      console.log(msg.data.data)
      if (msg.status !== 200) {
        return this.$message.error('获取提现列表失败！')
      }
      for (let i = 0; i < msg.data.data.length; i++) {
        switch (msg.data.data[i].gmUser.userStatus) {
          case 0:
            msg.data.data[i].gmUser.userStatus = '普通用户'
            break
          case 1:
            msg.data.data[i].gmUser.userStatus = '飞手'
            break
          case 2:
            msg.data.data[i].gmUser.userStatus = '农资商'
            break
        }
      }
      this.tableData = msg.data.data
    },
    async querylist () {
      const msg = await this.$http.get('draw/drawList', { params: { phoneNumber: this.queryinfo.phoneNumber, userStatus: this.queryinfo.userStatus } })
      if (msg.status !== 200) {
        this.resetField()
        return this.$message.error('查询失败！')
      }
      for (let i = 0; i < msg.data.data.length; i++) {
        switch (msg.data.data[i].gmUser.userStatus) {
          case 0:
            msg.data.data[i].gmUser.userStatus = '普通用户'
            break
          case 1:
            msg.data.data[i].gmUser.userStatus = '飞手'
            break
          case 2:
            msg.data.data[i].gmUser.userStatus = '农资商'
            break
        }
      }
      this.tableData = msg.data.data
    }
  }
}
</script>
<style lang="less" scoped>
.el-card {
  margin: 35px 25px;
}
.head {
  background-color: #fff;
  height: 88px;
}
.el-form--inline .el-form-item {
  margin-right:30px;
  margin-bottom: 45px;
}
.firInput {
  margin-left: 30px
}
.anniu {
  margin-left: 25px;
}
/deep/.el-pagination__jump {
  margin-left: -8px;
}
/deep/.el-pagination.is-background .btn-prev{
  border:1px solid #eee;
  background: #fff;
  border-radius: 8px;
}
/deep/.el-pagination.is-background .btn-next{
  border:1px solid #eee;
  background: #fff;
  border-radius: 8px;
}
/deep/.el-pagination.is-background .el-pager li{
  border:1px solid #eee;
  background: #fff;
  border-radius: 8px;
}
/deep/.el-pagination .el-select .el-input .el-input__inner {
  border-radius: 8px;
}
/deep/.el-input__inner {
  border-radius: 8px;
}
/deep/.el-pagination.is-background .btn-prev {
  margin-left:825px;
}
.slotText {
  color: #606266;
  font-weight: 400;
  font-size: 13px;
}
</style>
