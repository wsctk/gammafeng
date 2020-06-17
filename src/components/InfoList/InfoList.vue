<template>
  <div>
    <div class="head">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
        <el-breadcrumb-item>资讯管理</el-breadcrumb-item>
        <!-- <el-breadcrumb-item>认证记录</el-breadcrumb-item> -->
      </el-breadcrumb>
      <p class="indexText">资讯管理</p>
    </div>
    <el-card>
      <el-form :inline="true" :model="queryInfo" ref="queryInfoRef">
        <el-form-item label="文章名称" class="firInput" prop="articlename">
          <el-input placeholder="请输入" v-model="queryInfo.articlename"></el-input>
        </el-form-item>
        <el-form-item label="发布时间：" prop="publishtime">
          <el-select placeholder="请选择" v-model="queryInfo.publishtime">
            <el-option label="身份一" value="shanghai"></el-option>
            <el-option label="身份二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="anniu">
          <el-button type="primary">查询</el-button>
          <el-button plain @click="resetQueryForm">重置</el-button>
        </el-form-item>
      </el-form>
      <el-button class="addbtn" type="primary" size="large" @click="showAddForm">+ 新建</el-button>
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
        <el-table-column align="center" prop="createTime" label="发布时间">
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
            <el-button size="small" type="danger" @click="removerow(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
    </el-table>
    <el-pagination
      background
      :page-sizes="[1, 5, 10, 20]"
      :page-size= "queryInfo.pagesize"
      :page-count="11"
      :current-page= queryInfo.pageNum
      layout="total, slot, prev, pager, next, sizes, jumper"
      :total="total">
      <span class="slotText">第{{queryInfo.pageNum}}/{{total/5}}页</span>
    </el-pagination>
    </el-card>
    <el-dialog title="新增资讯" :visible.sync="dialogVisible" width="40%">
      <el-form label-width="100px" :model="additionalInfo" ref="additionalInfoRef">
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
                ref="uploadRef"
                :limit=1
                :http-request="uploadaddFormFile"
                action="#"
                list-type="picture-card"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove">
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible2">
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
            <el-form-item label="资讯状态:">
              <el-radio v-model="additionalInfo.state" label="5">正常</el-radio>
              <el-radio v-model="additionalInfo.state" label="6">禁用</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeaddform">取消</el-button>
        <el-button type="primary" @click="submitaddinfo">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="编辑资讯" :visible.sync="dialogVisible1" width="40%">
      <el-form label-width="100px" :model="editForm">
        <el-row>
          <el-col :span="15" :offset="4">
            <el-form-item label="文章标题:" prop="articleName">
              <el-input placeholder="请输入" v-model="editForm.articleName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15" :offset="4">
            <el-form-item label="商品封面:">
              <el-upload
                :limit=1
                :http-request="uploadeditFormFile"
                action="#"
                list-type="picture-card"
                :file-list="fileList"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove">
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible3">
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
            <el-form-item label="资讯状态:">
              <el-radio v-model="editForm.state" label="5">正常</el-radio>
              <el-radio v-model="editForm.state" label="6">禁用</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeForm">取消</el-button>
        <el-button type="primary" @click="submiteditinfo">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      queryInfo: {
        articlename: '',
        publishtime: ''
      },
      radio: '2',
      dialogVisible: false,
      additionalInfo: {
        title: '',
        fengmian: '',
        state: '',
        article: ''
      },
      editForm: {},
      dialogVisible1: false,
      dialogVisible2: false,
      dialogVisible3: false,
      dialogImageUrl: '',
      textarea: '',
      fileList: [],
      tableData: [],
      total: 400
    }
  },
  created () {
    this.getInformationList()
  },
  methods: {
    resetQueryForm () {
      this.$refs.queryInfoRef.resetFields()
    },
    closeaddform () {
      this.additionalInfo.title = ''
      this.additionalInfo.article = ''
      this.$refs.uploadRef.clearFiles()
      this.additionalInfo.state = ''
      this.dialogVisible = false
    },
    async getInformationList () {
      const msg = await this.$http.get('information/getInformationList')
      console.log(msg.data)
      this.tableData = msg.data
      this.total = msg.data.length + 1
    },
    showAddForm () {
      this.dialogVisible = true
    },
    showeditform (user) {
      this.dialogVisible1 = true
      this.editForm = user
      console.log(this.editForm)
      this.fileList.push({ url: user.cover })
    },
    closeForm () {
      this.dialogVisible1 = false
      this.fileList.pop()
    },
    async removeuser (id) {
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const msg = await this.$http.delete('user/deleteUser', { params: { id: id } })
      console.log(msg)
      if (msg.status !== 200) {
        return this.$message.error('删除用户失败')
      }
      this.$message.success('用户已删除')
      this.getCustomerList()
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible2 = true
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    uploadaddFormFile (params) {
      this.additionalInfo.fengmian = params.file
    },
    uploadeditFormFile (params) {
      this.editForm.fengmian = params.file
    },
    async submitaddinfo () {
      const formData = new FormData()
      formData.append('file', this.additionalInfo.fengmian)
      formData.append('articleName', this.additionalInfo.title)
      formData.append('content', this.additionalInfo.article)
      formData.append('state', this.additionalInfo.state)
      const add = await this.$http.post('information/addInformation', formData)
      console.log(add)
      this.dialogVisible = false
      this.getInformationList()
    },
    async submiteditinfo () {
      const formData = new FormData()
      formData.append('file', this.editForm.fengmian)
      formData.append('articleName', this.additionalInfo.title)
      formData.append('content', this.additionalInfo.article)
      formData.append('state', this.additionalInfo.state)
      formData.append('id', this.additionalInfo.id)
      const add = await this.$http.post('information/addInformation', formData)
      console.log(add.data.data)
      this.dialogVisible1 = false
      this.getInformationList()
    },
    async removerow (id) {
      const msg = await this.$http.post('information/deleteInformationList', this.$qs.stringify({ id: id }))
      if (msg !== 200) {
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
