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
          <el-button plain type="primary" @click="queryinfo">查询</el-button>
          <el-button plain @click="resetQueryForm">重置</el-button>
        </el-form-item>
      </el-form>
      <el-button plain class="addbtn" type="primary" size="large" @click="dialogVisible=true">+ 新建</el-button>
      <div class="tablediv">
      <el-table :data="tableData" style="width: 100%" border height="100%">
        <el-table-column align="center" prop="id" label="图文ID" min-width="50px">
        </el-table-column>
        <el-table-column align="center" prop="articleName" label="文章名称" min-width="150px" show-overflow-tooltip>
        </el-table-column>
        <el-table-column align="center" label="封面图片" min-width="70px">
          <template v-slot="scope">
            <el-image
              style="width: 27px; height: 27px"
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
            <el-button plain size="small" type="success" @click="showeditform(scope.row)">编辑</el-button>
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
    <el-dialog title="新增资讯" @opened="showtooltipadd" :visible.sync="dialogVisible" width="800px" @close="closeaddform">
      <el-form label-width="100px" :model="additionalInfo" ref="additionalInfoRef" :rules="addFormRules" :hide-required-asterisk="false">
        <el-row>
          <el-col :span="13" :offset="1">
            <el-form-item label="文章标题:" prop="title">
              <el-input placeholder="请输入" v-model="additionalInfo.title"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18" :offset="1">
            <el-form-item label="商品封面:">
              <el-upload
                class="addgoodscover"
                ref="addimgRef"
                :limit=1
                :http-request="uploadaddFormFile"
                :on-change="changeaddcover"
                action="#"
                list-type="picture-card"
                :before-upload="beforeUpload"
                :on-preview="addimgPreview"
                :on-remove="handleRemoveadd">
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible2" append-to-body>
                <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18" :offset="1">
            <el-form-item label="文章详情:">
              <el-upload
                class="updateimg"
                :with-credentials="true"
                :show-file-list="false"
                :before-upload="beforeUpload"
                :on-success="handleSuccess"
                action="https://admin-api.gamma.it-10.com/picture/loadPicture">
                <el-button icon="ios-cloud-upload-outline" ></el-button>
              </el-upload>
              <div>
                <quill-editor
                  ref="myQuillEditor"
                  v-model="content"
                  :options="editorOption"
                  @blur="onEditorBlur($event)"
                  @focus="onEditorFocus($event)"
                  @ready="onEditorReady($event)"
                />
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18" :offset="1">
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
    <el-dialog title="编辑资讯" @opened="showtooltipedit" :visible.sync="dialogVisible1" width="800px" @close="closeeditform">
      <el-form label-width="100px" :model="editForm" ref="editFormRef" :rules="editFormRules" :hide-required-asterisk="false">
        <el-row>
          <el-col :span="13" :offset="1">
            <el-form-item label="文章标题:" prop="articleName">
              <el-input v-model="editForm.articleName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18" :offset="1">
            <el-form-item label="商品封面:">
              <el-upload
                class="editgoodscover"
                ref="editimgRef"
                :limit=1
                :http-request="uploadeditFormFile"
                action="#"
                list-type="picture-card"
                :file-list="fileList"
                :on-change="changeeditcover"
                :on-preview="editimgPreview"
                :before-upload="beforeUpload"
                :on-remove="handleRemoveedit">
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible3" append-to-body>
                <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18" :offset="1">
            <el-form-item label="文章详情:">
              <el-upload
                class="updateimg"
                :show-file-list="false"
                :on-success="handleSuccess"
                :before-upload="beforeUpload"
                action="https://admin-api.gamma.it-10.com/picture/loadPicture">
                <el-button icon="ios-cloud-upload-outline" ></el-button>
              </el-upload>
              <div>
                <quill-editor
                  ref="myQuillEditor"
                  v-model="content"
                  :options="editorOption"
                  @blur="onEditorBlur($event)"
                  @focus="onEditorFocus($event)"
                  @ready="onEditorReady($event)"
                />
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18" :offset="1">
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
import { quilltitle } from '../../assets/js/quill-title.js'
export default {
  data () {
    return {
      editorOption: {
        modules: {
          toolbar: {
            container: [
              ['bold', 'italic', 'underline', 'strike'],
              ['image', 'clean'],
              [{ script: 'sub' }, { script: 'super' }],
              [{ header: [1, 2, false] }],
              [{ color: [] }],
              [{ background: [] }],
              [{ font: [] }, { align: [] }]
            ],
            handlers: {
              image: function (value) {
                if (value) {
                  document.querySelector('.updateimg .el-button').click()
                } else {
                  this.quill.format('image', false)
                }
              }
            }
          }
        }
      },
      content: '',
      zhinenganyici: false,
      tableData: [],
      total: 100,
      pageSize: 7,
      pageNum: 1,
      maxPage: 14,
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
      this.pageNum = 1
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
    async queryinfopage () {
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
    showtooltipadd () {
      quilltitle()
    },
    showtooltipedit () {
      quilltitle()
      if (this.$refs.editimgRef.uploadFiles[0]) {
        const editbtn = document.querySelector('.editgoodscover .el-upload')
        editbtn.style.display = 'none'
      }
    },
    handleSuccess (res) {
      const quill = this.$refs.myQuillEditor.quill
      if (res) {
        const length = quill.getSelection().index
        quill.insertEmbed(length, 'image', res)
        quill.setSelection(length + 1)
      } else {
        this.$message.error('图片插入失败')
      }
    },
    handleRemoveadd (file, fileList) {
      const addbtn = document.querySelector('.addgoodscover .el-upload')
      addbtn.style.display = 'inline-block'
    },
    handleRemoveedit (file, fileList) {
      const addbtn = document.querySelector('.editgoodscover .el-upload')
      addbtn.style.display = 'inline-block'
    },
    changeaddcover (file, fileList) {
      if (this.$refs.addimgRef.uploadFiles[0]) {
        const addbtn = document.querySelector('.addgoodscover .el-upload')
        addbtn.style.display = 'none'
      }
    },
    beforeUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isPG = (isJPG || isPNG)
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isPG) {
        this.$message.error('上传图片只能是 JPG 或 PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isPG && isLt2M
    },
    uploadaddFormFile (params) {
    },
    addimgPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible2 = true
    },
    async submitaddinfo () {
      this.$refs.additionalInfoRef.validate(async valid => {
        if (!valid) return
        if (!this.$refs.addimgRef.uploadFiles[0]) {
          return this.$message.error('请添加图片之后再提交！')
        }
        const formData = new FormData()
        formData.append('file', this.$refs.addimgRef.uploadFiles[0].raw)
        formData.append('articleName', this.additionalInfo.title)
        formData.append('content', this.content)
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
      const addbtn = document.querySelector('.addgoodscover .el-upload')
      addbtn.style.display = 'inline-block'
      this.$refs.additionalInfoRef.resetFields()
      this.$refs.addimgRef.clearFiles()
      this.content = ''
    },
    showeditform (user) {
      this.dialogVisible1 = true
      this.editForm = user
      this.fileList.push({ url: user.cover })
      this.content = this.editForm.article
    },
    changeeditcover (file, fileList) {
      if (this.$refs.editimgRef.uploadFiles[0]) {
        const editbtn = document.querySelector('.editgoodscover .el-upload')
        editbtn.style.display = 'none'
      }
    },
    uploadeditFormFile (params) {
    },
    editimgPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible3 = true
    },
    async submiteditinfo () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const formData = new FormData()
        if (!this.$refs.editimgRef.uploadFiles[0].raw) {
          formData.append('path', this.$refs.editimgRef.uploadFiles[0].url)
        } else {
          formData.append('file', this.$refs.editimgRef.uploadFiles[0].raw)
        }
        formData.append('articleName', this.editForm.articleName)
        formData.append('content', this.content)
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
      this.content = ''
      this.$refs.editimgRef.clearFiles()
      this.getInformationList()
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
    onEditorBlur (e) {},
    onEditorFocus (e) {},
    onEditorReady (e) {},
    handleSizeChange (newSize) {
      this.pageSize = newSize
      if (!this.queryInfo.articleName && !this.queryInfo.createTime) {
        return this.getInformationList()
      }
      this.queryinfopage()
    },
    handleCurrentChange (newPage) {
      this.pageNum = newPage
      if (!this.queryInfo.articleName && !this.queryInfo.createTime) {
        return this.getInformationList()
      }
      this.queryinfopage()
    }
  }
}
</script>
<style lang="less" scoped>
/deep/.ql-editor{
  height:220px;
}
.updateimg {
  display: none;
}
.adddetailsimg {
  display: none;
}
.tablediv {
  @media only screen and (max-width: 1133px) {
    height:406px;
  }
  @media only screen and (min-width: 1133px) {
    height:465px;
  }
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
