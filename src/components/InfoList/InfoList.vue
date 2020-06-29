<template>
  <div>
    <div class="head">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>资讯管理</el-breadcrumb-item>
      </el-breadcrumb>
      <p class="indexText">资讯管理</p>
    </div>
    <el-card>
      <el-form :inline="true" :model="queryInfo" ref="queryInfoRef">
        <el-form-item label="文章名称" class="firInput" prop="articleName">
          <el-input placeholder="请输入" v-model="queryInfo.articleName" @keydown.enter.native="queryinfo"></el-input>
        </el-form-item>
        <el-form-item label="发布时间：" prop="createTime">
          <el-date-picker v-model="queryInfo.createTime" type="date" placeholder="请选择日期" format="yyyy 年 MM 月 dd 日" value-format="timestamp" @keydown.enter.native="queryinfo">
          </el-date-picker>
        </el-form-item>
        <el-form-item class="anniu">
          <el-button type="primary" @click="queryinfo">查询</el-button>
          <el-button plain @click="resetQueryForm">重置</el-button>
        </el-form-item>
      </el-form>
      <el-button class="addbtn" type="primary" size="large" @click="dialogVisible=true">+ 新建</el-button>
      <el-table max-height=400 :data="tableData" style="width: 100%" border>
        <el-table-column align="center" prop="id" label="图文ID">
        </el-table-column>
        <el-table-column align="center" prop="articleName" label="文章名称">
        </el-table-column>
        <el-table-column align="center" label="封面图片">
          <template v-slot="scope">
            <img :src=scope.row.cover style="width: 50px; height: 50px" />
          </template>
        </el-table-column>
        <el-table-column align="center" prop="createTime" label="发布时间" width="150px">
          <template v-slot="scope">
            {{ scope.row.createTime | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="readNumber" label="查看人数">
        </el-table-column>
        <el-table-column align="center" prop="orderStateName" label="状态">
        </el-table-column>
        <el-table-column align="center" prop="" label="操作" width="180px" v-slot="scope">
          <template>
            <el-button size="small" type="primary" @click="showeditform(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="removeuser(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange" @current-change="handleCurrentChange"
      background
      :page-count="11"
      :page-sizes="[1, 5, 10, 20]"
      :page-size="pageSize"
      :current-page="pageNum"
      layout="total, slot, prev, pager, next, sizes, jumper"
      :total="total">
      <span class="slotText">第{{pageNum}}/{{maxPage}}页</span>
    </el-pagination>
    </el-card>
    <el-dialog title="新增资讯" :visible.sync="dialogVisible" width="40%" @close="closeaddform">
      <el-form label-width="100px" :model="additionalInfo" ref="additionalInfoRef" :rules="addFormRules" :hide-required-asterisk="false">
        <el-row>
          <el-col :span="15" :offset="4">
            <el-form-item label="文章标题:" prop="title">
              <el-input placeholder="请输入" v-model="additionalInfo.title"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15" :offset="4">
            <el-form-item label="商品封面:">
              <el-upload
                ref="addimgRef"
                :limit=1
                :http-request="uploadaddFormFile"
                action="#"
                list-type="picture-card"
                :on-preview="addimgPreview"
                :on-remove="handleRemove">
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible2" append-to-body>
                <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15" :offset="4">
            <el-form-item label="文章详情:">
              <el-input
                resize="none"
                type="textarea"
                :rows="4"
                placeholder="富文本编辑器"
                v-model="additionalInfo.article">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15" :offset="4">
            <el-form-item label="资讯状态:" prop="state">
              <el-radio v-model="additionalInfo.state" label="6">正常</el-radio>
              <el-radio v-model="additionalInfo.state" label="5">禁用</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="submitaddinfo">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="编辑资讯" :visible.sync="dialogVisible1" width="40%" @close="closeeditform">
      <el-form label-width="100px" :model="editForm" ref="editFormRef" :rules="editFormRules" :hide-required-asterisk="false">
        <el-row>
          <el-col :span="15" :offset="4">
            <el-form-item label="文章标题:" prop="articleName">
              <el-input v-model="editForm.articleName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15" :offset="4">
            <el-form-item label="商品封面:">
              <el-upload
                ref="editimgRef"
                :limit=1
                :http-request="uploadeditFormFile"
                action="#"
                list-type="picture-card"
                :file-list="fileList"
                :on-preview="editimgPreview"
                :on-remove="handleRemove">
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible3" append-to-body>
                <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15" :offset="4">
            <el-form-item label="文章详情:">
              <el-input
                type="textarea"
                :rows="4"
                placeholder="富文本编辑器"
                v-model="editForm.article">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15" :offset="4">
            <el-form-item label="资讯状态:" prop="state">
              <el-radio v-model="editForm.state" :label=6>正常</el-radio>
              <el-radio v-model="editForm.state" :label=5>禁用</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible1=false">取消</el-button>
        <el-button type="primary" @click="submiteditinfo">确定</el-button>
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
      pageSize: 10,
      pageNum: 1,
      maxPage: 40,
      queryInfo: {
        articleName: '',
        createTime: '',
        pageSize: '',
        pageNum: ''
      },
      dialogVisible: false,
      dialogVisible1: false,
      dialogVisible2: false,
      dialogVisible3: false,
      additionalInfo: {
        title: '',
        state: '',
        article: ''
      },
      addFormRules: {
        title: [
          { required: true, message: '请输入标题！', trigger: 'blur' }
        ]
      },
      editForm: {},
      editFormRules: {
        articleName: [
          { required: true, message: '请输入标题！', trigger: 'blur' }
        ]
      },
      dialogImageUrl: '',
      fileList: []
    }
  },
  created () {
    this.getInformationList()
    this.getinfopage()
  },
  methods: {
    resetQueryForm () {
      this.$refs.queryInfoRef.resetFields()
    },
    async queryinfo () {
      this.queryInfo.pageSize = this.pageSize
      this.queryInfo.pageNum = this.pageNum
      const msg = await this.$http.get('information/selectInformation', { params: this.queryInfo })
      console.log(msg)
      if (msg.status !== 200) {
        this.resetQueryForm()
        this.$message.error('查询失败！')
      }
      this.tableData = msg.data.rows
      this.total = msg.data.total
      this.maxPage = msg.data.maxPage
    },
    async getInformationList () {
      const msg = await this.$http.get('information/getInformationList')
      console.log(msg)
      if (msg.status !== 200) {
        return this.$message.error('获取资讯列表失败！')
      }
      this.tableData = msg.data
      this.total = msg.data.total
      this.maxPage = msg.data.maxPage
    },
    uploadaddFormFile (params) {
      console.log('上传了一张封面图片')
    },
    async submitaddinfo () {
      this.$refs.additionalInfoRef.validate(async valid => {
        if (!valid) return
        const formData = new FormData()
        formData.append('file', this.$refs.addimgRef.uploadFiles[0].raws)
        formData.append('articleName', this.additionalInfo.title)
        formData.append('content', this.additionalInfo.article)
        formData.append('state', this.additionalInfo.state)
        const msg = await this.$http.post('information/addInformation', formData)
        if (msg.status !== 200) {
          return this.$message.error('添加商品信息失败！')
        }
        this.$message.success('添加商品成功！')
        this.getInformationList()
        this.dialogVisible = false
      })
    },
    closeaddform () {
      this.$refs.addimgRef.clearFiles()
      this.$refs.additionalInfoRef.resetFields()
    },
    showeditform (user) {
      this.dialogVisible1 = true
      this.editForm = user
      this.fileList.push({ url: user.cover })
    },
    uploadeditFormFile (params) {
      console.log('上传了一张封面图片')
    },
    async submiteditinfo () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const formData = new FormData()
        if (!this.$refs.editimgRef.uploadFiles[0].raws) {
          formData.append('path', this.$refs.editimgRef.uploadFiles[0].url)
        } else {
          formData.append('file', this.$refs.editimgRef.uploadFiles[0].raws)
        }
        formData.append('articleName', this.editForm.articleName)
        formData.append('content', this.editForm.article)
        formData.append('state', this.editForm.state)
        formData.append('id', this.editForm.id)
        const msg = await this.$http.post('information/editInformation', formData)
        if (msg.status !== 200) {
          return this.$message.error('编辑提交失败！')
        }
        this.$message.success('编辑成功！')
        this.getInformationList()
        this.dialogVisible1 = false
      })
    },
    closeeditform () {
      this.$refs.editFormRef.resetFields()
      this.fileList = []
      this.$refs.editimgRef.clearFiles()
      this.getInformationList()
    },
    addimgPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible2 = true
    },
    editimgPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible3 = true
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    async removeuser (id) {
      const confirmResult = await this.$confirm('此操作将永久删除该条资讯, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const msg = await this.$http.post('user/deleteUser', this.$qs.stringify({ id: id }))
      console.log(msg)
      if (msg.status !== 200) {
        return this.$message.error('删除用户失败')
      }
      this.$message.success('用户已删除')
      this.getCustomerList()
    },
    handleSizeChange (newSize) {
      this.pageSize = newSize
      if (!this.queryInfo.articleName && !this.queryInfo.createTime) {
        return this.getinfopage()
      }
      this.queryinfo()
    },
    handleCurrentChange (newPage) {
      this.pageNum = newPage
      if (!this.queryInfo.articleName && !this.queryInfo.createTime) {
        return this.getinfopage()
      }
      this.queryinfo()
    },
    async getinfopage () {
      const msg = await this.$http.get('information/getInformationByPage', { params: { page: this.pageNum, size: this.pageSize } })
      if (msg.status !== 200) {
        return this.$message.error('获取分页失败')
      }
      this.total = msg.data.total
      this.maxPage = Math.ceil((msg.data.total / this.pageSize))
      this.tableData = msg.data.data
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
