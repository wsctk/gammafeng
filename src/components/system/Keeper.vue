<template>
  <div>
    <div class="head">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>系统管理</el-breadcrumb-item>
        <el-breadcrumb-item>管理员管理</el-breadcrumb-item>
      </el-breadcrumb>
      <p class="indexText">管理员管理</p>
    </div>
    <el-card>
      <el-form :inline="true" :model="queryInfo" ref="queryInfoRef">
        <el-form-item label="账户号：" class="firInput" prop="userName">
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
          <el-button type="primary" @click="querykeeper">查询</el-button>
          <el-button plain @click="resetQueryForm">重置</el-button>
        </el-form-item>
      </el-form>
      <el-button class="addbtn" type="primary" size="large" @click="dialogVisible=true">+ 新建</el-button>
      <el-table max-height=400 :data="tableData" style="width: 100%" border>
        <el-table-column align="center" prop="id" label="用户ID">
        </el-table-column>
        <el-table-column align="center" prop="realName" label="管理员姓名">
        </el-table-column>
        <el-table-column align="center" prop="userName" label="管理员帐号">
        </el-table-column>
        <el-table-column align="center" prop="phoneNumber" label="手机号">
        </el-table-column>
        <el-table-column align="center" prop="status" label="管理员状态">
        </el-table-column>
        <el-table-column align="center" prop="createTime" label="创建时间">
          <template v-slot="scope">
            {{ scope.row.createTime | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="" label="操作" width="180px" v-slot="scope">
          <template>
            <el-button size="small" type="primary" @click="showeditform(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="removekeeper(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
    </el-table>
    <el-pagination
      background
      :page-sizes="[1, 5, 10, 20]"
      :page-size="queryInfo.pagesize"
      :page-count="11"
      :current-page="queryInfo.pageNum"
      layout="total, slot, prev, pager, next, sizes, jumper"
      :total="total">
      <span class="slotText">第{{queryInfo.pageNum}}/{{total/5}}页</span>
    </el-pagination>
    </el-card>
    <el-dialog title="新增管理员" :visible.sync="dialogVisible" width="40%" @close="closeaddform">
      <el-form label-width="100px" :model="addForm" ref="addFormRef" :rules="addFormRules" hide-required-asterisk>
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
        <el-button type="primary" @click="addkeeper">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="编辑管理员" :visible.sync="dialogVisible1" width="40%" @close="closeeditform">
      <el-form label-width="100px" :model="editForm" ref="editFormRef" :rules="editFormRules" hide-required-asterisk>
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
              <el-radio v-model="editForm.status" label=1>正常</el-radio>
              <el-radio v-model="editForm.status" label=0>禁用</el-radio>
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
    return {
      tableData: [],
      total: 400,
      queryInfo: {
        userName: '',
        phoneNumber: '',
        status: ''
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
          { required: true, message: '请输入账号名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        phoneNumber: [
          { required: true, message: '请输入电话号码', trigger: 'blur' }
        ]
      },
      editForm: {},
      editFormRules: {
        realName: [
          { required: true, message: '请输入管理员姓名', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '请输入账号名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        phoneNumber: [
          { required: true, message: '请输入电话号码', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getInformationList()
  },
  methods: {
    resetQueryForm () {
      this.$refs.queryInfoRef.resetFields()
    },
    async querykeeper () {
      const msg = await this.$http.get('admin/getAdminList', { params: this.queryInfo })
      this.tableData = msg.data.data
      if (msg.status !== 200) {
        this.resetQueryForm()
        return this.$message.error('查询失败！')
      }
    },
    async getInformationList () {
      const msg = await this.$http.get('admin/getAdminList')
      if (msg.status !== 200) {
        return this.$message.error('获取管理员列表失败！')
      }
      for (let i = 0; i < msg.data.data.length; i++) {
        switch (msg.data.data[i].status) {
          case 0:
            msg.data.data[i].status = '禁用'
            break
          case 1:
            msg.data.data[i].status = '正常'
            break
        }
      }
      this.tableData = msg.data.data
    },
    async addkeeper () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const msg = await this.$http.post('admin/addAdmin', this.$qs.stringify(this.addForm))
        if (msg.status !== 200) {
          this.dialogVisible = false
          return this.$message.error('新增管理员失败！')
        }
        this.getInformationList()
        this.$message.success('新增管理员成功！')
        this.dialogVisible = false
      })
    },
    closeaddform () {
      this.$refs.addFormRef.resetFields()
    },
    showeditform (user) {
      this.editForm = user
      this.dialogVisible1 = true
    },
    async editkeeper () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const msg = await this.$http.post('admin/updateAdmin', this.$qs.stringify(this.editForm))
        if (msg.status !== 200) {
          this.dialogVisible1 = false
          return this.$message.error('编辑管理员失败！')
        }
        this.getInformationList()
        this.$message.success('编辑管理员成功！')
        this.dialogVisible1 = false
      })
    },
    closeeditform () {
      this.$refs.editFormRef.resetFields()
      this.getInformationList()
    },
    async removekeeper (id) {
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
    }
  }
}
</script>
<style lang="less" scoped>
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
