<template>
  <div>
    <div class="head">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>商城管理</el-breadcrumb-item>
        <el-breadcrumb-item>分类管理</el-breadcrumb-item>
      </el-breadcrumb>
      <p class="indexText">分类管理</p>
    </div>
    <el-card class="main">
      <el-form :inline="true" :model="queryInfo" ref="queryInfoRef">
        <el-form-item label="分类名称：" class="firInput" prop="categoryName">
          <el-input placeholder="请输入" v-model="queryInfo.categoryName" @keydown.enter.native="querycate"></el-input>
        </el-form-item>
        <el-form-item class="anniu">
          <el-button plain type="primary" @click="querycate">查询</el-button>
          <el-button plain @click="resetQueryForm">重置</el-button>
        </el-form-item>
      </el-form>
      <el-button plain class="addbtn" type="primary" size="large" @click="dialogVisible1=true">+ 新建</el-button>
      <div class="tablediv">
        <el-table :data="tableData" style="width: 100%" border height="100%">
          <el-table-column align="center" prop="index" label="分类排序权重" min-width="120px" show-overflow-tooltip>
          </el-table-column>
          <el-table-column align="center" prop="id" label="分类ID" min-width="120px" show-overflow-tooltip>
          </el-table-column>
          <el-table-column align="center" prop="categoryName" label="分类名称" min-width="70px" show-overflow-tooltip>
          </el-table-column>
          <el-table-column align="center" prop="categoryStateName" label="分类状态" min-width="70px">
          </el-table-column>
          <el-table-column align="center" prop="createTime" label="创建时间" min-width="200px">
            <template v-slot="scope">
              {{scope.row.createTime | dateFormat}}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="" label="操作" min-width="150px" v-slot="scope" fixed="right">
              <template>
                <el-button plain size="small" type="success" @click="showDialogForm(scope.row)">编辑</el-button>
                <el-button plain size="small" type="danger" @click="removecate(scope.row.id)">删除</el-button>
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
    <el-dialog title="新增分类" :visible.sync="dialogVisible1" width="800px" @close="closeaddform">
      <el-form :hide-required-asterisk="false" label-width="120px" :model="addForm" ref="addFormRef" :rules="addFormRules">
        <el-row>
          <el-col :span="10" :offset="4">
            <el-form-item label="分类排序权重:" prop="index">
              <el-input v-model=addForm.index></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="13" :offset="4">
            <el-form-item label="分类名称:" prop="categoryName">
              <el-input v-model=addForm.categoryName></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="13" :offset="4">
            <el-form-item label="分类状态:" prop="categoryState">
              <el-radio v-model="addForm.categoryState" label="1">正常</el-radio>
              <el-radio v-model="addForm.categoryState" label="0">禁用</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="text-align:center">
        (分类排序权重是用来调整小程序端分类在列表中的显示顺序，数值越小越靠前)
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible1 = false">取消</el-button>
        <el-button type="primary" @click="addcate" :disabled="zhinenganyici">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="编辑分类" :visible.sync="dialogVisible2" width="800px" @close="closeeditform">
      <el-form :hide-required-asterisk="false" label-width="120px" :model="editForm" ref="editFormRef" :rules="editFormRules">
        <el-row>
          <el-col :span="10" :offset="4">
            <el-form-item label="分类排序权重:" prop="index">
              <el-input v-model=editForm.index></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
        <el-row>
          <el-col :span="13" :offset="4">
            <el-form-item label="分类名称:" prop="categoryName">
              <el-input v-model=editForm.categoryName></el-input>
            </el-form-item>
          </el-col>
        </el-row>
          <el-col :span="13" :offset="4">
            <el-form-item label="分类状态:" prop="categoryState">
              <el-radio v-model="editForm.categoryState" :label='1'>正常</el-radio>
              <el-radio v-model="editForm.categoryState" :label='0'>禁用</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="text-align:center">
        (分类排序权重是用来调整小程序端分类在列表中的显示顺序，数值越小越靠前)
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取消</el-button>
        <el-button type="primary" @click="editcate">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    var checknum = (rule, value, cb) => {
      const regbili = /^(([1-9]\d*)|(0))$/
      if (regbili.test(value)) {
        return cb()
      }
      cb(new Error('请输入正确格式的数字！'))
    }
    return {
      zhinenganyici: false, // 新增按钮禁用状态
      tableData: [],
      total: 100,
      pageNum: 1,
      pageSize: 7,
      maxPage: 14,
      queryInfo: {
        categoryName: '',
        pageNum: '',
        pageSize: ''
      },
      addForm: {
        index: 0,
        categoryName: '',
        categoryState: ''
      },
      // 新增表单验证规则
      addFormRules: {
        index: [
          { required: true, message: '请输入分类排序权重', trigger: 'blur' },
          { validator: checknum, trigger: 'blur' }
        ],
        categoryName: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ],
        categoryState: [
          { required: true, message: '请输入分类状态', trigger: 'blur' }
        ]
      },
      editForm: {},
      // 编辑表单验证规则
      editFormRules: {
        index: [
          { required: true, message: '请输入分类排序权重', trigger: 'blur' },
          { validator: checknum, trigger: 'blur' }
        ],
        categoryName: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ],
        categoryState: [
          { required: true, message: '请输入分类状态', trigger: 'blur' }
        ]
      },
      dialogVisible1: false,
      dialogVisible2: false
    }
  },
  created () {
    this.getInformationList()
  },
  methods: {
    // 重置搜索框
    resetQueryForm () {
      this.$refs.queryInfoRef.resetFields()
    },
    // 搜索框搜索
    async querycate () {
      this.pageNum = 1
      this.queryInfo.pageSize = this.pageSize
      this.queryInfo.pageNum = this.pageNum
      const msg = await this.$http.get('category/categoryList', { params: { categoryName: this.queryInfo.categoryName } })
      if (msg.status !== 200) {
        return this.$message.error('查询失败！')
      }
      this.tableData = msg.data.rows
      this.total = msg.data.total
      this.maxPage = msg.data.maxPage
    },
    // 搜索之后所有结果分页
    async querycatepage () {
      this.queryInfo.pageSize = this.pageSize
      this.queryInfo.pageNum = this.pageNum
      const msg = await this.$http.get('category/categoryList', { params: { categoryName: this.queryInfo.categoryName } })
      if (msg.status !== 200) {
        return this.$message.error('查询失败！')
      }
      this.tableData = msg.data.rows
      this.total = msg.data.total
      this.maxPage = msg.data.maxPage
    },
    // 获取table数据
    async getInformationList () {
      const msg = await this.$http.get('category/categoryList', { params: { pageNum: this.pageNum, pageSize: this.pageSize } })
      if (msg.status !== 200) {
        return this.$message.error('获取分类列表失败！')
      }
      for (let i = 0; i < msg.data.rows.length; i++) {
        switch (msg.data.rows[i].categoryState) {
          case 0:
            msg.data.rows[i].categoryStateName = '禁用'
            break
          case 1:
            msg.data.rows[i].categoryStateName = '正常'
            break
        }
      }
      this.tableData = msg.data.rows
      this.total = msg.data.total
      this.maxPage = msg.data.maxPage
    },
    // 新增分类
    async addcate () {
      // 表单验证
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        // 提交之后禁用提交按钮
        this.zhinenganyici = true
        this.addForm.index = Math.ceil(this.addForm.index)
        const msg = await this.$http.post('category/addCategory', this.$qs.stringify(this.addForm))
        if (msg.status !== 200) {
          this.dialogVisible1 = false
          return this.$message.error('添加分类失败！')
        }
        // 根据返回的数据判断排序权重是否重复
        if (msg.data.code === 2) {
          this.dialogVisible1 = false
          return this.$message.error('分类排序权重已存在！')
        }
        this.getInformationList()
        this.$message.success('添加分类成功！')
        this.dialogVisible1 = false
      })
    },
    // 关闭新增dialog
    closeaddform () {
      this.zhinenganyici = false
      this.$refs.addFormRef.resetFields()
    },
    // 显示编辑dialog并完成初始化赋值
    showDialogForm (user) {
      this.dialogVisible2 = true
      this.editForm = user
    },
    // 提交编辑表单
    async editcate () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        this.editForm.index = Math.ceil(this.editForm.index)
        const msg = await this.$http.post('category/updateCategory', this.$qs.stringify({ index: this.editForm.index, categoryName: this.editForm.categoryName, categoryState: this.editForm.categoryState, id: this.editForm.id }))
        if (msg.status !== 200) {
          return this.$message.error('编辑分类失败！')
        }
        // 根据返回数据判断排序权重是否重复
        if (msg.data.code === 2) {
          return this.$refs.message.error('分类排序权重已存在！')
        }
        this.getInformationList()
        this.$message.success('编辑分类成功！')
        this.dialogVisible2 = false
      })
    },
    // 关闭编辑dialog
    closeeditform () {
      this.editForm = {}
      this.$refs.editFormRef.resetFields()
    },
    // 删除分类
    async removecate (id) {
      const confirmResult = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const msg = await this.$http.post('category/deleteCategory', this.$qs.stringify({ id: id }))
      if (msg.status !== 200) {
        return this.$message.error('删除分类失败！')
      }
      this.getInformationList()
      this.$message.success('删除分类成功！')
    },
    // 改变页面最大显示条数
    handleSizeChange (newSize) {
      this.pageSize = newSize
      if (!this.queryInfo.categoryName) {
        return this.getInformationList()
      }
      this.querycatepage()
    },
    // 改变当前页面索引
    handleCurrentChange (newPage) {
      this.pageNum = newPage
      if (!this.queryInfo.categoryName) {
        return this.getInformationList()
      }
      this.querycatepage()
    }
  }
}
</script>
<style lang="less" scoped>
.tablediv {
  height:465px;
}
.main {
  height:675px;
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
</style>
