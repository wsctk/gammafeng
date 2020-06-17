<template>
  <div>
    <div class="head">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
        <el-breadcrumb-item>提现管理</el-breadcrumb-item>
        <el-breadcrumb-item>提现记录</el-breadcrumb-item>
      </el-breadcrumb>
      <p class="indexText">提现记录</p>
    </div>
    <el-card>
      <el-form :inline="true">
        <el-form-item label="用户手机号：" class="firInput">
          <el-input placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="用户身份：">
          <el-select placeholder="请选择">
            <el-option label="身份一" value="shanghai"></el-option>
            <el-option label="身份二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="anniu">
          <el-button type="primary">查询</el-button>
          <el-button plain>重置</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="tableData" style="width: 100%" border>
        <el-table-column align="center" prop="id" label="提现记录ID">
        </el-table-column>
        <el-table-column align="center" prop="name" label="用户名">
        </el-table-column>
        <el-table-column align="center" prop="touxiang" label="手机号码">
        </el-table-column>
        <el-table-column align="center" prop="mobile" label="用户身份">
        </el-table-column>
        <el-table-column align="center" prop="shenfen" label="提现金额">
        </el-table-column>
        <el-table-column align="center" prop="idcard" label="钱包余额">
        </el-table-column>
        <el-table-column align="center" prop="idcardimg0" label="发起时间">
        </el-table-column>
        <el-table-column align="center" prop="idcardimg1" label="到账时间">
        </el-table-column>
        <el-table-column align="center" prop="" label="操作">
          <template>
            <el-button size="small" type="danger">删除</el-button>
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
      status: '0',
      currentPage: 1,
      tableData: [],
      total: 400,
      pageNum: 1
    }
  },
  created () {
    this.getCustomerList()
  },
  methods: {
    async getCustomerList () {
      const msg = await this.$http.post('user/userList', this.$qs.stringify({ userStatus: this.status }))
      console.log(msg)
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
