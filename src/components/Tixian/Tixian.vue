<template>
  <div>
    <div class="head">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>提现管理</el-breadcrumb-item>
        <el-breadcrumb-item>提现记录</el-breadcrumb-item>
      </el-breadcrumb>
      <p class="indexText">提现记录</p>
    </div>
    <el-card class="main">
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
          <el-button plain type="primary" @click="querylist">查询</el-button>
          <el-button plain @click="resetField">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="tablediv">
        <el-table :data="tableData" style="width: 100%" border height="100%">
          <el-table-column align="center" prop="id" label="提现记录ID" min-width="100px" show-overflow-tooltip>
          </el-table-column>
          <el-table-column align="center" prop="gmUser.wechatName" label="用户名" min-width="70px" show-overflow-tooltip>
          </el-table-column>
          <el-table-column align="center" prop="gmUser.phoneNumber" label="手机号码" min-width="120px">
          </el-table-column>
          <el-table-column align="center" prop="gmUser.userStatus" label="用户身份" min-width="100px">
          </el-table-column>
          <el-table-column align="center" prop="drawMoney" label="提现金额(元)" min-width="120px" show-overflow-tooltip>
          </el-table-column>
          <el-table-column align="center" prop="balance" label="钱包余额(元)" min-width="120px" show-overflow-tooltip>
          </el-table-column>
          <el-table-column align="center" prop="drawTime" label="发起时间" min-width="200px">
            <template v-slot="scope">
              {{ scope.row.drawTime | dateFormat}}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="accountTime" label="到账时间" min-width="200px">
            <template v-slot="scope">
              <p v-if="scope.row.accountTime">{{ scope.row.accountTime | dateFormat}}</p>
              <p v-else></p>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="drawStatus" label="提现状态" v-slot="scope" min-width="150px">
            <template>
              <el-button size="small" type="success" icon="el-icon-check" circle v-if="scope.row.drawStatus==='1'"></el-button>
              <el-button size="small" type="danger" icon="el-icon-close" circle v-else-if="scope.row.drawStatus==='2'"></el-button>
              <el-button size="small" type="warning" icon="el-icon-loading" circle v-else></el-button>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="" label="操作" min-width="150px" v-slot="scope" fixed="right">
            <template>
              <el-button plain size="small" type="success" @click="tixiansuccess(scope.row)">成功</el-button>
              <el-button plain size="small" type="danger" @click="tixianfailed(scope.row)">失败</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    <el-pagination
      :hide-on-single-page="true"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      background
      :page-sizes="[5, 7, 10, 20]"
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
      pageSize: 7,
      total: 100,
      pageNum: 1,
      maxPage: 14,
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
    // 重置搜索框内容方法
    resetField () {
      this.$refs.queryInfoRef.resetFields()
    },
    // 获取并处理table数据
    async getCustomerList () {
      const msg = await this.$http.get('draw/drawList', { params: { pageNum: this.pageNum, pageSize: this.pageSize } })
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
        msg.data.rows[i].drawMoney = (msg.data.rows[i].drawMoney /= 100).toFixed(2)
        msg.data.rows[i].balance = (msg.data.rows[i].balance /= 100).toFixed(2)
      }
      this.tableData = msg.data.rows
      this.total = msg.data.total
      this.maxPage = msg.data.maxPage
    },
    // 搜索框搜索方法
    async querylist () {
      this.pageNum = 1
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
        msg.data.rows[i].drawMoney = (msg.data.rows[i].drawMoney /= 100).toFixed(2)
      }
      this.tableData = msg.data.rows
      this.total = msg.data.total
      this.maxPage = msg.data.maxPage
    },
    // 搜索之后分页调用搜索结果
    async querylistpage () {
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
        msg.data.rows[i].drawMoney = (msg.data.rows[i].drawMoney /= 100).toFixed(2)
      }
      this.tableData = msg.data.rows
      this.total = msg.data.total
      this.maxPage = msg.data.maxPage
    },
    // 通过提现
    async tixiansuccess (user) {
      // 确认前提示
      if (user.drawStatus !== '0') {
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
      // 重新获取table数据
      this.getCustomerList()
    },
    // 驳回提现
    async tixianfailed (user) {
      if (user.drawStatus !== 0) {
        return this.$message.error('该提现记录已提交，无法重复修改')
      }
      // 驳回前提示
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
      this.$message.success('提交提现结果成功！')
      // 重新获取table数据
      this.getCustomerList()
    },
    // 改变页面显示条数
    handleSizeChange (newSize) {
      this.pageSize = newSize
      if (!this.queryInfo.userStatus && !this.queryInfo.phoneNumber) {
        return this.getCustomerList()
      }
      this.querylistpage()
    },
    // 改变当前页面索引
    handleCurrentChange (newPage) {
      this.pageNum = newPage
      if (!this.queryInfo.userStatus && !this.queryInfo.phoneNumber) {
        return this.getCustomerList()
      }
      this.querylistpage()
    }
  }
}
</script>
<style lang="less" scoped>
.tablediv {
  @media only screen and (min-width: 1162px) {
    height:495px;
  }
  @media only screen and (max-width: 1162px) {
    height:405px;
  }
}
.main {
  height:675px;
}
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
/deep/.el-pagination {
  text-align: center;
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
.slotText {
  color: #606266;
  font-weight: 400;
  font-size: 13px;
}
</style>
