<template>
  <div>
    <div class="head">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>普通用户</el-breadcrumb-item>
      </el-breadcrumb>
      <p class="indexText">普通用户</p>
    </div>
    <el-card class="main">
      <el-form :inline="true" :model="queryInfo" ref="queryInfoRef">
        <el-form-item label="用户名：" class="firInput" prop="wechatName">
          <el-input placeholder="请输入" v-model="queryInfo.wechatName" @keydown.enter.native="queryinfo"></el-input>
        </el-form-item>
        <el-form-item label="手机号码：" prop="phoneNumber">
          <el-input placeholder="请输入" v-model="queryInfo.phoneNumber" @keydown.enter.native="queryinfo"></el-input>
        </el-form-item>
        <el-form-item class="anniu">
          <el-button plain type="primary" @click="queryinfo">查询</el-button>
          <el-button plain @click="resetQueryForm">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="tablediv">
        <el-table :data="tableData" style="width: 100%" border height="100%">
          <el-table-column align="center" prop="id" label="用户ID" min-width="100px">
          </el-table-column>
          <el-table-column align="center" prop="wechatName" label="用户名" min-width="80px">
          </el-table-column>
          <el-table-column align="center" prop="wechatAvatar" label="微信头像" min-width="70px">
            <template v-slot="scope">
              <el-image
                style="width: 28px; height: 28px"
                :src="scope.row.wechatAvatar"
                :preview-src-list="[scope.row.wechatAvatar]">
              </el-image>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="phoneNumber" label="手机号" min-width="100px">
          </el-table-column>
          <el-table-column align="center" prop="points" label="用户积分" min-width="80px">
          </el-table-column>
          <el-table-column align="center" prop="commissionRate" label="商品佣金比例(千分比)" min-width="100px">
          </el-table-column>
          <el-table-column align="center" prop="distributionRate" label="派单佣金比例(千分比)" min-width="100px">
          </el-table-column>
          <el-table-column align="center" prop="balance" label="钱包余额(元)" min-width="100px">
          </el-table-column>
          <el-table-column align="center" prop="parentPhoneNumber" label="邀请人(手机号码)" min-width="120px">
          </el-table-column>
          <el-table-column align="center" prop="registerTime" label="注册时间" v-slot="scope" min-width="200px">
            <template>
              {{scope.row.registerTime | dateFormat}}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="" label="操作" min-width="100px" v-slot="scope" fixed="right">
            <template>
              <el-button plain size="small" type="primary" @click="showDialogForm(scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    <el-pagination
      :hide-on-single-page="true"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      background
      :page-count="11"
      :page-sizes="[5, 7, 10, 20]"
      :page-size="pageSize"
      :current-page="pageNum"
      layout="total, slot, prev, pager, next, sizes, jumper"
      :total="total">
      <span class="slotText">第{{pageNum}}/{{maxPage}}页</span>
    </el-pagination>
    </el-card>
    <el-dialog title="编辑用户信息" :visible.sync="dialogVisible1" width="500px" @close="closeeditform">
      <el-form label-width="150px" :model="editForm" ref="editFormRef" :rules="editFormRules" label-position="right" :hide-required-asterisk="false">
        <el-row>
          <el-col :span="17" :offset="3">
            <el-form-item label="用户积分：" prop="points" :inline-message="true">
              <el-input v-model="editForm.points"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="17" :offset="3">
            <el-form-item label="商品佣金比例：" prop="commissionRate" :inline-message="true">
              <el-input v-model="editForm.commissionRate"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="17" :offset="3">
            <el-form-item label="派单佣金比例：" prop="distributionRate" :inline-message="true">
              <el-input v-model="editForm.distributionRate"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="17" :offset="3">
            <el-form-item label="邀请人(手机号码)：" prop="parentPhoneNumber">
              <el-input v-model="editForm.parentPhoneNumber"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible1 = false">取消</el-button>
        <el-button type="primary" @click="editdialog">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      tableData: [],
      maxPage: 14,
      total: 100,
      pageNum: 1,
      pageSize: 7,
      queryInfo: {
        wechatName: '',
        phoneNumber: '',
        userStatus: 0,
        pageNum: '',
        pageSize: ''
      },
      dialogVisible1: false,
      editForm: {},
      editFormRules: {
        commissionRate: [
          { required: true, message: '请输入商品佣金分成比例', trigger: 'blur' }
        ],
        distributionRate: [
          { required: true, message: '请输入派单佣金分成比例：', trigger: 'blur' }
        ],
        points: [
          { required: true, message: '请输入用户积分：', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getCustomerList()
  },
  methods: {
    resetQueryForm () {
      this.$refs.queryInfoRef.resetFields()
    },
    async queryinfo () {
      this.pageNum = 1
      this.queryInfo.pageSize = this.pageSize
      this.queryInfo.pageNum = this.pageNum
      const msg = await this.$http.get('user/userList', { params: this.queryInfo })
      if (msg.status !== 200) {
        this.resetQueryForm()
        return this.$message.error('查询失败！')
      }
      for (let i = 0; i < msg.data.rows.length; i++) {
        switch (msg.data.rows[i].statusState) {
          case '0':
            msg.data.rows[i].statusState = '未认证'
            break
          case '1':
            msg.data.rows[i].statusState = '已认证'
            break
        }
      }
      this.tableData = msg.data.rows
      this.total = msg.data.total
    },
    async queryinfopage () {
      this.queryInfo.pageSize = this.pageSize
      this.queryInfo.pageNum = this.pageNum
      const msg = await this.$http.get('user/userList', { params: this.queryInfo })
      if (msg.status !== 200) {
        this.resetQueryForm()
        return this.$message.error('查询失败！')
      }
      for (let i = 0; i < msg.data.rows.length; i++) {
        switch (msg.data.rows[i].statusState) {
          case '0':
            msg.data.rows[i].statusState = '未认证'
            break
          case '1':
            msg.data.rows[i].statusState = '已认证'
            break
        }
      }
      this.tableData = msg.data.rows
      this.total = msg.data.total
    },
    async getCustomerList () {
      const msg = await this.$http.get('user/userList', { params: { userStatus: '0', pageNum: this.pageNum, pageSize: this.pageSize } })
      let arr = {}
      arr = msg
      if (arr.status !== 200) {
        return this.$message.error('获取用户列表失败！')
      }
      for (let i = 0; i < arr.data.rows.length; i++) {
        switch (arr.data.rows[i].statusState) {
          case '0':
            arr.data.rows[i].statusState = '未认证'
            break
          case '1':
            arr.data.rows[i].statusState = '已认证'
            break
        }
      }
      this.tableData = arr.data.rows
      this.total = arr.data.total
      this.maxPage = arr.data.maxPage
    },
    handleSizeChange (newSize) {
      this.pageSize = newSize
      if (!this.queryInfo.wechatName && !this.queryInfo.phoneNumber) {
        return this.getCustomerList()
      }
      this.queryinfopage()
    },
    handleCurrentChange (newPage) {
      this.pageNum = newPage
      if (!this.queryInfo.wechatName && !this.queryInfo.phoneNumber) {
        return this.getCustomerList()
      }
      this.queryinfopage()
    },
    showDialogForm (user) {
      this.editForm = user
      this.dialogVisible1 = true
    },
    closeeditform () {
      this.editForm = {}
      this.$refs.editFormRef.resetFields()
      this.getCustomerList()
    },
    async editdialog () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const msg = await this.$http.post('user/updateUser', this.$qs.stringify({ commissionRate: this.editForm.commissionRate, parentPhoneNumber: this.editForm.parentPhoneNumber, distributionRate: this.editForm.distributionRate, id: this.editForm.id, points: this.editForm.points }))
        if (msg.status !== 200) {
          this.dialogVisible1 = false
          return this.$message.error('编辑普通用户信息失败！')
        }
        if (msg.data.code === 9) {
          return this.$message.error('上级号码不存在！')
        }
        this.getCustomerList()
        this.dialogVisible1 = false
        this.$message.success('编辑普通用户信息成功!')
      })
    }
  }
}
</script>
<style lang="less" scoped>
.tablediv {
  @media only screen and (min-width: 1111px) {
    height:495px;
  }
  @media only screen and (max-width: 1111px) {
    height:410px;
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
/deep/.el-dialog__header {
  border:1px solid #eee;
  border-radius: 7px;
}
/deep/.el-radio {
  margin-right:20px;
}
</style>
