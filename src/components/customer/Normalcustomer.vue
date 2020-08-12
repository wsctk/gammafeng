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
      <el-form :inline="true" :model="queryInfo" ref="queryInfoRef" class='firInput'>
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
          <el-table-column align="center" prop="id" label="用户ID" min-width="100px" show-overflow-tooltip>
          </el-table-column>
          <el-table-column align="center" prop="phoneNumber" label="手机号" min-width="100px">
          </el-table-column>
          <el-table-column align="center" prop="points" label="用户积分" min-width="80px" show-overflow-tooltip>
          </el-table-column>
          <el-table-column align="center" prop="commissionRate" label="商品佣金比例(千分比)" min-width="100px" show-overflow-tooltip>
          </el-table-column>
          <el-table-column align="center" prop="distributionRate" label="派单佣金比例(千分比)" min-width="100px" show-overflow-tooltip>
          </el-table-column>
          <el-table-column align="center" prop="balance" label="钱包余额(元)" min-width="100px" show-overflow-tooltip>
          </el-table-column>
          <el-table-column align="center" prop="parentPhoneNumber" label="邀请人(手机号码)" min-width="120px">
          </el-table-column>
          <el-table-column align="center" prop="sonNumber" label="下级用户个数" min-width="120px">
          </el-table-column>
          <el-table-column align="center" prop="registerTime" label="注册时间" v-slot="scope" min-width="200px">
              {{scope.row.registerTime}}
          </el-table-column>
          <el-table-column align="center" prop="" label="操作" min-width="240px" v-slot="scope" fixed="right">
            <template>
              <el-button plain size="small" type="success" @click="showdetails(scope.row)">详情</el-button>
              <el-button plain size="small" type="primary" @click="showDialogForm(scope.row)">编辑</el-button>
              <el-button plain size="small" type="danger" @click="removeuser(scope.row.id)">删除</el-button>
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
    <el-dialog title="编辑用户信息" :visible.sync="dialogVisible1" width="600px" @close="closeeditform">
      <el-form label-width="200px" :model="editForm" ref="editFormRef" :rules="editFormRules" label-position="right" :hide-required-asterisk="false">
        <el-row>
          <el-col :span="17" :offset="3">
            <el-form-item label="用户积分：" prop="points" :inline-message="true">
              <el-input v-model="editForm.points"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="17" :offset="3">
            <el-form-item label="商品佣金比例(千分比)：" prop="commissionRate" :inline-message="true">
              <el-input v-model="editForm.commissionRate"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="17" :offset="3">
            <el-form-item label="派单佣金比例(千分比)：" prop="distributionRate" :inline-message="true">
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
    <el-dialog title="用户详情" :visible.sync="dialogVisible" width="900px" @close="closeform">
      <el-form label-width="170px" :model="details" ref="editFormRef" label-position="right">
        <el-row>
          <el-col :span="11">
            <el-form-item label="用户ID：">
              <el-input v-model="details.id" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="手机号码：">
              <el-input v-model="details.phoneNumber" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="派单佣金比例(千分比)：">
              <el-input v-model="details.distributionRate" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="商品佣金比例(千分比)：">
              <el-input v-model="details.commissionRate" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="用户积分：">
              <el-input v-model="details.points" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="钱包余额：">
              <el-input v-model="details.balance" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="邀请人(手机号码)：">
              <el-input v-model="details.parentPhoneNumber" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="注册时间：">
              <el-input v-model="details.registerTime" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="下级用户：">
              <el-table :data="sonlist" style="width: 100%" border height="100%">
                <el-table-column align="center" prop="id" label="用户ID" min-width="100px">
                </el-table-column>
                <el-table-column align="center" prop="phoneNumber" label="手机号" min-width="100px">
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible=false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    // 判断是否是正整数的表单规则
    var checkbili = (rule, value, cb) => {
      const regbili = /^[1-9]\d*$/
      if (regbili.test(value)) {
        return cb()
      }
      cb(new Error('请输入正确的数字！'))
    }
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
      dialogVisible: false,
      dialogVisible1: false,
      editForm: {},
      // 编辑dialog表单规则
      editFormRules: {
        commissionRate: [
          { required: true, message: '请输入商品佣金分成比例', trigger: 'blur' },
          { validator: checkbili, trigger: 'blur' }
        ],
        distributionRate: [
          { required: true, message: '请输入派单佣金分成比例：', trigger: 'blur' },
          { validator: checkbili, trigger: 'blur' }
        ],
        points: [
          { required: true, message: '请输入用户积分：', trigger: 'blur' },
          { validator: checkbili, trigger: 'blur' }
        ]
      },
      details: {},
      sonlist: []
    }
  },
  created () {
    this.getCustomerList()
  },
  methods: {
    // 重置搜索框
    resetQueryForm () {
      this.$refs.queryInfoRef.resetFields()
    },
    // 搜索框搜索
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
    // 搜索之后所有结果分页
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
    // 获取table数据
    async getCustomerList () {
      const msg = await this.$http('user/userList', { params: { userStatus: '0', pageNum: this.pageNum, pageSize: this.pageSize } })
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
        msg.data.rows[i].registerTime = this.tranformtime(msg.data.rows[i].registerTime)
      }
      this.tableData = arr.data.rows
      this.total = arr.data.total
      this.maxPage = arr.data.maxPage
    },
    // 改变页面最大显示条数
    handleSizeChange (newSize) {
      this.pageSize = newSize
      if (!this.queryInfo.wechatName && !this.queryInfo.phoneNumber) {
        return this.getCustomerList()
      }
      this.queryinfopage()
    },
    // 改变当前页面索引
    handleCurrentChange (newPage) {
      this.pageNum = newPage
      if (!this.queryInfo.wechatName && !this.queryInfo.phoneNumber) {
        return this.getCustomerList()
      }
      this.queryinfopage()
    },
    // 显示编辑dialog
    showDialogForm (user) {
      this.editForm = user
      this.dialogVisible1 = true
    },
    // 关闭编辑dialog
    closeeditform () {
      this.editForm = {}
      this.$refs.editFormRef.resetFields()
      this.getCustomerList()
    },
    // 提交编辑表单数据
    async editdialog () {
      // 表单验证
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const msg = await this.$http.post('user/updateUser', this.$qs.stringify({ commissionRate: this.editForm.commissionRate, parentPhoneNumber: this.editForm.parentPhoneNumber, distributionRate: this.editForm.distributionRate, id: this.editForm.id, points: this.editForm.points }))
        if (msg.status !== 200) {
          this.dialogVisible1 = false
          return this.$message.error('编辑普通用户信息失败！')
        }
        // 根据返回的数据判断绑定的上级用户是否存在
        if (msg.data.code === 9) {
          return this.$message.error('上级号码不存在！')
        }
        this.getCustomerList()
        this.dialogVisible1 = false
        this.$message.success('编辑普通用户信息成功!')
      })
    },
    // 把毫秒值转换为日期
    tranformtime (originVal) {
      const dt = new Date(originVal)
      const y = dt.getFullYear()
      const m = (dt.getMonth() + 1 + '').padStart(2, '0')
      const d = (dt.getDate() + '').padStart(2, '0')
      const hh = (dt.getHours() + '').padStart(2, '0')
      const mm = (dt.getMinutes() + '').padStart(2, '0')
      const sec = (dt.getSeconds() + '').padStart(2, '0')
      return `${y}年${m}月${d}日${hh}:${mm}:${sec}`
    },
    // 显示详情并完成相应赋值
    async showdetails (user) {
      const msg = await this.$http.get('user/getSonList', { params: { id: user.id } })
      if (msg.status !== 200) {
        return this.$message.error('获取下级用户列表失败！')
      }
      this.details = user
      this.sonlist = msg.data.data
      this.dialogVisible = true
    },
    // 关闭详情dialog
    closeform () {
      this.details = {}
      this.sonlist = []
    },
    // 删除用户
    async removeuser (id) {
      const confirmResult = await this.$confirm('此操作将永久删除该普通用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const msg = await this.$http.post('user/delete', this.$qs.stringify({ userId: id }))
      if (msg.status !== 200) {
        return this.$message.error('删除普通用户失败')
      }
      this.$message.success('该普通用户已删除')
      this.getCustomerList()
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
