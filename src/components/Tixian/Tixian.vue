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
        <el-form-item label="用户手机号：" class="firInput" prop="phoneNumber">
          <el-input placeholder="请输入" v-model="queryinfo.phoneNumber" @keydown.enter.native="querylist"></el-input>
        </el-form-item>
        <el-form-item label="用户身份：" prop="userStatus">
          <el-select placeholder="请选择" v-model="queryinfo.userStatus" @keydown.enter.native="querylist">
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
        <el-table-column align="center" prop="drawTime" label="发起时间" width="150px">
          <template v-slot="scope">
            {{ scope.row.drawTime | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="accountTime" label="到账时间" width="150px">
          <template v-slot="scope">
            {{ scope.row.accountTime | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="drawStatus" label="提现状态" v-slot="scope" width="100px">
          <template>
            <el-button size="small" type="success" icon="el-icon-check" circle v-if="scope.row.drawStatus==='1'"></el-button>
            <el-button size="small" type="danger" icon="el-icon-close" circle v-else-if="scope.row.drawStatus==='2'"></el-button>
            <el-button size="small" type="warning" icon="el-icon-loading" circle v-else></el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="" label="操作" width="180px" v-slot="scope">
          <template>
            <el-button size="small" type="primary" @click="tixiansuccess(scope.row)">成功</el-button>
            <el-button size="small" type="danger" @click="tixianfailed(scope.row)">失败</el-button>
          </template>
        </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange" @current-change="handleCurrentChange"
      background
      :page-sizes="[1, 5, 10, 20]"
      :page-size="pageSize"
      :page-count="11"
      :current-page="pageNum"
      layout="total, slot, prev, pager, next, sizes, jumper"
      :total="total">
      <span class="slotText">第{{pageNum}}/{{maxPage}}页</span>
    </el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      tableData: [],
      pageSize: 10,
      total: 400,
      pageNum: 1,
      maxPage: 1,
      queryinfo: {
        userStatus: '',
        phoneNumber: '',
        pageNum: '',
        pageSize: ''
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
      const msg = await this.$http.get('draw/drawList', { params: { pageNum: this.pageNum, pageSize: this.pageSize } })
      console.log(msg.data.data)
      if (msg.status !== 200) {
        return this.$message.error('获取提现列表失败！')
      }
      for (let i = 0; i < msg.data.rows.length; i++) {
        switch (msg.data.rows[i].gmUser.userStatus) {
          case '0':
            msg.data.rows[i].gmUser.userStatus = '普通用户'
            break
          case '1':
            msg.data.rows[i].gmUser.userStatus = '飞手'
            break
          case '2':
            msg.data.rows[i].gmUser.userStatus = '农资商'
            break
        }
      }
      this.tableData = msg.data.rows
      this.total = msg.data.total
      this.maxPage = msg.data.maxPage
    },
    async querylist () {
      this.queryinfo.pageNum = this.pageNum
      this.queryinfo.pageSize = this.pageSize
      const msg = await this.$http.get('draw/drawList', { params: this.queryinfo })
      if (msg.status !== 200) {
        this.resetField()
        return this.$message.error('查询失败！')
      }
      for (let i = 0; i < msg.data.rows.length; i++) {
        switch (msg.data.rows[i].gmUser.userStatus) {
          case '0':
            msg.data.rows[i].gmUser.userStatus = '普通用户'
            break
          case '1':
            msg.data.rows[i].gmUser.userStatus = '飞手'
            break
          case '2':
            msg.data.rows[i].gmUser.userStatus = '农资商'
            break
        }
      }
      this.tableData = msg.data.rows
      this.total = msg.data.total
      this.maxPage = msg.data.maxPage
    },
    async tixiansuccess (user) {
      if (user.drawStatus !== 0) {
        return this.$message.error('该提现记录已提交，无法重复修改')
      }
      const confirmResult = await this.$confirm('该结果只能更改一次,确定该提现已成功?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消提交')
      }
      const msg = await this.$http.post('draw/updateDraw', this.$qs.stringify({ id: user.id, drawStatus: 1 }))
      if (msg.status !== 200) {
        return this.$message.error('提交提现结果失败！')
      }
      this.$message.success('提交提现结果成功！')
      this.getCustomerList()
    },
    async tixianfailed (user) {
      if (user.drawStatus !== 0) {
        return this.$message.error('该提现记录已提交，无法重复修改')
      }
      const confirmResult = await this.$confirm('该结果只能更改一次,确定该提现已失败！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消提交')
      }
      const msg = await this.$http.post('draw/updateDraw', this.$qs.stringify({ id: user.id, drawStatus: 2 }))
      if (msg.status !== 200) {
        return this.$message.error('提交提现结果失败！')
      }
      console.log(this.checked)
      this.$message.success('提交提现结果成功！')
      this.getCustomerList()
    },
    handleSizeChange (newSize) {
      this.pageSize = newSize
      if (!this.queryInfo.userStatus && !this.queryInfo.phoneNumber) {
        return this.getCustomerList()
      }
      this.querylist()
    },
    handleCurrentChange (newPage) {
      this.pageNum = newPage
      if (!this.queryInfo.userStatus && !this.queryInfo.phoneNumber) {
        return this.getCustomerList()
      }
      this.querylist()
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
