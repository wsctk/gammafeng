<template>
  <div>
    <div class="head">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>系统管理</el-breadcrumb-item>
        <el-breadcrumb-item>管理员管理</el-breadcrumb-item>
      </el-breadcrumb>
      <p class="indexText">管理员管理</p>
    </div>
    <el-card class="main">
      <el-form :inline="true" :model="queryInfo" ref="queryInfoRef">
        <el-form-item label="账号：" class="firInput" prop="userName">
          <el-input placeholder="请输入" v-model="queryInfo.userName"></el-input>
        </el-form-item>
        <el-form-item label="手机号码：" class="firInput" prop="phoneNumber">
          <el-input placeholder="请输入" v-model="queryInfo.phoneNumber"></el-input>
        </el-form-item>
        <el-form-item label="管理员状态：" prop="status">
          <el-select placeholder="请选择" v-model="queryInfo.status">
            <el-option label="正常" value=1></el-option>
            <el-option label="禁用" value=0></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="anniu">
          <el-button plain type="primary" @click="querykeeper">查询</el-button>
          <el-button plain @click="resetQueryForm">重置</el-button>
        </el-form-item>
      </el-form>
      <el-button plain class="addbtn" type="primary" size="large" @click="showaddform">+ 新建</el-button>
      <div class="tablediv">
        <el-table :data="tableData" style="width: 100%" border height="100%">
          <el-table-column align="center" prop="id" label="用户ID" min-width="70px" show-overflow-tooltip>
          </el-table-column>
          <el-table-column align="center" prop="realName" label="管理员姓名" min-width="80px" show-overflow-tooltip>
          </el-table-column>
          <el-table-column align="center" prop="userName" label="管理员帐号" min-width="80px" show-overflow-tooltip>
          </el-table-column>
          <el-table-column align="center" prop="phoneNumber" label="手机号" min-width="120px">
          </el-table-column>
          <el-table-column align="center" prop="statusname" label="管理员状态" min-width="80px">
          </el-table-column>
          <el-table-column align="center" prop="createTime" label="创建时间" min-width="200px">
            <template v-slot="scope">
              {{ scope.row.createTime | dateFormat}}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="" label="操作" min-width="150px" v-slot="scope" fixed="right">
            <template>
              <el-button plain size="small" type="success" @click="showeditform(scope.row)">编辑</el-button>
              <el-button plain size="small" type="danger" @click="removekeeper(scope.row.id)">删除</el-button>
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
    <el-dialog title="新增管理员" :visible.sync="dialogVisible" width="40%" @close="closeaddform">
      <el-form label-width="100px" :model="addForm" ref="addFormRef" :rules="addFormRules" :hide-required-asterisk="false">
        <el-row>
          <el-col :span="15" :offset="4">
            <el-form-item label="管理员姓名:" prop="realName">
              <el-input placeholder="请输入" v-model="addForm.realName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15" :offset="4">
            <el-form-item label="账号名:" prop="userName">
              <el-input placeholder="请输入" v-model="addForm.userName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15" :offset="4">
            <el-form-item label="密码:" prop="password">
              <el-input placeholder="请输入" v-model="addForm.password"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15" :offset="4">
            <el-form-item label="手机号码:" prop="phoneNumber">
              <el-input placeholder="请输入" v-model="addForm.phoneNumber"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15" :offset="4">
            <el-form-item label="管理员状态:" prop="status">
              <el-radio v-model="addForm.status" label=1>正常</el-radio>
              <el-radio v-model="addForm.status" label=0>禁用</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="addkeeper" :disabled="zhinenganyici">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="编辑管理员" :visible.sync="dialogVisible1" width="40%" @close="closeeditform">
      <el-form label-width="100px" :model="editForm" ref="editFormRef" :rules="editFormRules" :hide-required-asterisk="false">
        <el-row>
          <el-col :span="15" :offset="4">
            <el-form-item label="管理员姓名:" prop="realName">
              <el-input placeholder="请输入" v-model="editForm.realName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15" :offset="4">
            <el-form-item label="账号名:" prop="userName">
              <el-input placeholder="请输入" v-model="editForm.userName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15" :offset="4">
            <el-form-item label="密码:" prop="password">
              <el-input placeholder="请输入" v-model="editForm.password"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15" :offset="4">
            <el-form-item label="手机号码:" prop="phoneNumber">
              <el-input placeholder="请输入" v-model="editForm.phoneNumber"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15" :offset="4">
            <el-form-item label="管理员状态:" prop="status">
              <el-radio v-model="editForm.status" label='1'>正常</el-radio>
              <el-radio v-model="editForm.status" label='0'>禁用</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible1=false">取消</el-button>
        <el-button type="primary" @click="editkeeper">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的手机号码'))
    }
    return {
      zhinenganyici: false,
      tableData: [],
      total: 100,
      pageSize: 7,
      pageNum: 1,
      maxPage: 14,
      queryInfo: {
        userName: '',
        phoneNumber: '',
        status: '',
        pageNum: '',
        pageSize: ''
      },
      dialogVisible: false,
      dialogVisible1: false,
      addForm: {
        realName: '',
        userName: '',
        password: '',
        phoneNumber: '',
        status: ''
      },
      addFormRules: {
        realName: [
          { required: true, message: '请输入管理员姓名', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '请输入账号名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 7 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '长度至少为6个字符', trigger: 'blur' }
        ],
        phoneNumber: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      editForm: {},
      editFormRules: {
        realName: [
          { required: true, message: '请输入管理员姓名', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '请输入账号名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 7 个字符', trigger: 'blur' }
        ],
        phoneNumber: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getInformationList()
  },
  methods: {
    // 重置搜索框内容
    resetQueryForm () {
      this.$refs.queryInfoRef.resetFields()
    },
    // 搜索框搜索
    async querykeeper () {
      this.pageNum = 1
      this.queryInfo.pageNum = this.pageNum
      this.queryInfo.pageSize = this.pageSize
      const msg = await this.$http.get('admin/getAdminList', { params: this.queryInfo })
      if (msg.status !== 200) {
        this.resetQueryForm()
        return this.$message.error('查询失败！')
      }
      for (let i = 0; i < msg.data.rows.length; i++) {
        switch (msg.data.rows[i].status) {
          case '0':
            msg.data.rows[i].status = '禁用'
            break
          case '1':
            msg.data.rows[i].status = '正常'
            break
        }
      }
      this.tableData = msg.data.rows
      this.total = msg.data.total
      this.maxPage = msg.data.maxPage
    },
    // 搜索完成之后搜索结果分页
    async querykeeperpage () {
      this.queryInfo.pageNum = this.pageNum
      this.queryInfo.pageSize = this.pageSize
      const msg = await this.$http.get('admin/getAdminList', { params: this.queryInfo })
      if (msg.status !== 200) {
        this.resetQueryForm()
        return this.$message.error('查询失败！')
      }
      for (let i = 0; i < msg.data.rows.length; i++) {
        switch (msg.data.rows[i].status) {
          case '0':
            msg.data.rows[i].status = '禁用'
            break
          case '1':
            msg.data.rows[i].status = '正常'
            break
        }
      }
      this.tableData = msg.data.rows
      this.total = msg.data.total
      this.maxPage = msg.data.maxPage
    },
    // 获取并处理table数据
    async getInformationList () {
      const msg = await this.$http.get('admin/getAdminList', { params: { pageNum: this.pageNum, pageSize: this.pageSize } })
      if (msg.status !== 200) {
        return this.$message.error('获取管理员列表失败！')
      }
      for (let i = 0; i < msg.data.rows.length; i++) {
        switch (msg.data.rows[i].status) {
          case '0':
            msg.data.rows[i].statusname = '禁用'
            break
          case '1':
            msg.data.rows[i].statusname = '正常'
            break
        }
      }
      this.tableData = msg.data.rows
      this.total = msg.data.total
      this.maxPage = msg.data.maxPage
    },
    // 显示新增管理员dialog
    showaddform () {
      const Super = window.sessionStorage.getItem('jurisdict')
      // 判断用户是否是超级管理员
      if (!(Super > 0)) {
        return this.$message.error('您没有权限！')
      }
      this.dialogVisible = true
    },
    // 新增keeper
    async addkeeper () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        this.zhinenganyici = true
        const msg = await this.$http.post('admin/addAdmin', this.$qs.stringify(this.addForm))
        if (msg.status !== 200) {
          this.dialogVisible = false
          return this.$message.error('新增管理员失败！')
        }
        if (msg.data.code === 3) {
          return this.$message.error('管理员信息已存在！')
        }
        this.getInformationList()
        this.$message.success('新增管理员成功！')
        this.dialogVisible = false
      })
    },
    // 关闭新增dialog
    closeaddform () {
      this.zhinenganyici = false
      this.$refs.addFormRef.resetFields()
    },
    // 显示编辑管理员dialog
    showeditform (user) {
      const Super = window.sessionStorage.getItem('jurisdict')
      // 判断用户是否是超级管理员
      if (!(Super > 0)) {
        return this.$message.error('您没有权限！')
      }
      // 由于密码经过不可逆加密，所以无法回显，故设置为空，只能修改
      user.password = ''
      this.editForm = user
      this.dialogVisible1 = true
    },
    // 提交编辑keeper
    async editkeeper () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const msg = await this.$http.post('admin/updateAdmin', this.$qs.stringify(this.editForm))
        if (msg.status !== 200) {
          this.dialogVisible1 = false
          return this.$message.error('编辑管理员失败！')
        }
        if (msg.data.code === 3) {
          return this.$message.error('管理员信息已存在！')
        }
        this.getInformationList()
        this.$message.success('编辑管理员成功！')
        this.dialogVisible1 = false
      })
    },
    // 关闭编辑dialog
    closeeditform () {
      this.$refs.editFormRef.resetFields()
      this.getInformationList()
    },
    // 删除管理员
    async removekeeper (id) {
      // 判断用户是否是超级管理员
      const Super = window.sessionStorage.getItem('jurisdict')
      if (!(Super > 0)) {
        return this.$message.error('您没有权限！')
      }
      // 删除前确认
      const confirmResult = await this.$confirm('此操作将永久删除该管理员, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const msg = await this.$http.post('admin/deleteAdmin', this.$qs.stringify({ id: id }))
      if (msg.status !== 200) {
        return this.$message.error('删除失败！')
      }
      this.$message.success('删除成功！')
      this.getInformationList()
    },
    // 改变页面最大显示条数
    handleSizeChange (newSize) {
      this.pageSize = newSize
      // 如果搜索栏为空，调用全部数据分页，否则调用搜索数据分页
      if (!this.queryInfo.userName && !this.queryInfo.phoneNumber && !this.queryInfo.status) {
        return this.getInformationList()
      }
      this.querykeeperpage()
    },
    // 改变当前页面索引
    handleCurrentChange (newPage) {
      this.pageNum = newPage
      // 如果搜索栏为空，调用全部数据分页，否则调用搜索数据分页
      if (!this.queryInfo.userName && !this.queryInfo.phoneNumber && !this.queryInfo.status) {
        return this.getInformationList()
      }
      this.querykeeperpage()
    }
  }
}
</script>
<style lang="less" scoped>
.tablediv {
  @media only screen and (min-width: 1528px) {
    height:465px;
  }
  @media only screen and (max-width: 1528px) {
    height:406px;
  }
}
.addbtn {
    margin-left:27px;
    margin-bottom: 10px;
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
  margin-bottom: 25px;
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
.main {
  height:675px;
}
</style>
