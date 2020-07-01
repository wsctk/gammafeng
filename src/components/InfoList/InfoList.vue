<template>
  <div>
    <div class="head">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>资讯管理</el-breadcrumb-item>
      </el-breadcrumb>
      <p class="indexText">资讯管理</p>
    </div>
    <el-card class="main">
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
      <div class="tablediv">
      <el-table :data="tableData" style="width: 100%" border class="table-fixed" height="100%">
        <el-table-column align="center" prop="id" label="图文ID" min-width="50px">
        </el-table-column>
        <el-table-column align="center" prop="articleName" label="文章名称" min-width="150px">
        </el-table-column>
        <el-table-column align="center" label="封面图片" min-width="70px">
          <template v-slot="scope">
            <el-image
              style="width: 40px; height: 40px"
              :src="scope.row.cover"
              :preview-src-list="[scope.row.cover]">
            </el-image>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="createTime" label="发布时间" min-width="200px">
          <template v-slot="scope">
            {{ scope.row.createTime | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="readNumber" label="查看人数" min-width="80px">
        </el-table-column>
        <el-table-column align="center" prop="orderStateName" label="状态" min-width="50px">
        </el-table-column>
        <el-table-column align="center" prop="" label="操作" min-width="150px" v-slot="scope" fixed="right">
          <template>
            <el-button size="small" type="primary" @click="showeditform(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="removeuser(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      </div>
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
        <el-button type="primary" @click="submitaddinfo" :disabled="zhinenganyici">确定</el-button>
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
      zhinenganyici: false,
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
  },
  methods: {
    resetQueryForm () {
      this.$refs.queryInfoRef.resetFields()
    },
    async queryinfo () {
      this.queryInfo.pageSize = this.pageSize
      this.queryInfo.pageNum = this.pageNum
      const msg = await this.$http.get('information/selectInformation', { params: this.queryInfo })
      if (msg.status !== 200) {
        this.resetQueryForm()
        this.$message.error('查询失败！')
      }
      this.tableData = msg.data.rows
      this.total = msg.data.total
      this.maxPage = msg.data.maxPage
    },
    async getInformationList () {
      const msg = await this.$http.get('information/selectInformation', { params: { pageNum: this.pageNum, pageSize: this.pageSize } })
      if (msg.status !== 200) {
        return this.$message.error('获取资讯列表失败！')
      }
      this.tableData = msg.data.rows
      this.total = msg.data.total
      this.maxPage = msg.data.maxPage
    },
    uploadaddFormFile (params) {
    },
    async submitaddinfo () {
      this.$refs.additionalInfoRef.validate(async valid => {
        if (!valid) return
        if (!this.$refs.addimgRef) {
          return this.$message.error('请添加图片之后再提交！')
        }
        const formData = new FormData()
        formData.append('file', this.$refs.addimgRef.uploadFiles[0].raw)
        formData.append('articleName', this.additionalInfo.title)
        formData.append('content', this.additionalInfo.article)
        formData.append('state', this.additionalInfo.state)
        this.zhinenganyici = true
        const msg = await this.$http.post('information/addInformation', formData)
        if (msg.status !== 200) {
          return this.$message.error('添加文章资讯失败！')
        }
        this.$message.success('添加文章资讯成功！')
        this.getInformationList()
        this.dialogVisible = false
      })
    },
    closeaddform () {
      this.zhinenganyici = false
      this.$refs.addimgRef.clearFiles()
      this.$refs.additionalInfoRef.resetFields()
    },
    showeditform (user) {
      this.dialogVisible1 = true
      this.editForm = user
      this.fileList.push({ url: user.cover })
    },
    uploadeditFormFile (params) {
    },
    async submiteditinfo () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const formData = new FormData()
        if (!this.$refs.editimgRef.uploadFiles[0].raws) {
          formData.append('path', this.$refs.editimgRef.uploadFiles[0].url)
        } else {
          formData.append('file', this.$refs.editimgRef.uploadFiles[0].raw)
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
      const msg = await this.$http.post('information/deleteInformationList', this.$qs.stringify({ id: id }))
      if (msg.status !== 200) {
        return this.$message.error('删除用户失败')
      }
      this.$message.success('用户已删除')
      this.getInformationList()
    },
    handleSizeChange (newSize) {
      this.pageSize = newSize
      if (!this.queryInfo.articleName && !this.queryInfo.createTime) {
        return this.getInformationList()
      }
      this.queryinfo()
    },
    handleCurrentChange (newPage) {
      this.pageNum = newPage
      if (!this.queryInfo.articleName && !this.queryInfo.createTime) {
        return this.getInformationList()
      }
      this.queryinfo()
    }
  }
}
</script>
<style lang="less" scoped>
// .table-fixed {
// /deep/ .el-table__fixed-right {
// height: 100% !important;
// }
// /deep/ .el-table__fixed {
// height: 110px !important;
// }
// }
.tablediv {
  @media only screen and (min-height: 768px) and (max-height: 1024px) {
    height:400px;
  }
  @media only screen and (min-height: 468px) and (max-height: 768px) {
    height:300px;
  }
  @media only screen and (max-height: 468px) {
    height:200px;
  }
}
.main {
  height:630px;
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
