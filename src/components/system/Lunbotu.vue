<template>
  <div>
    <div class="head">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>系统管理</el-breadcrumb-item>
        <el-breadcrumb-item>轮播图片管理</el-breadcrumb-item>
      </el-breadcrumb>
      <p class="indexText">轮播图片管理</p>
    </div>
    <el-card class="main">
      <el-button class="addbtn" type="primary" size="large" @click="dialogVisible=true">+ 新建</el-button>
      <div class="tablediv">
        <el-table :data="tableData" style="width: 100%" border height="100%">
          <el-table-column align="center" prop="id" label="图片ID" min-width="50px">
          </el-table-column>
          <el-table-column align="center" prop="banner" label="标题" min-width="150px" show-overflow-tooltip>
          </el-table-column>
          <el-table-column align="center" prop="route" label="轮播图片" min-width="70px">
            <template v-slot="scope">
              <el-image
                style="width: 50px; height: 50px"
                :src="scope.row.route"
                :preview-src-list="[scope.row.route]">
              </el-image>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="statusname" label="状态" min-width="80px">
          </el-table-column>
          <el-table-column align="center" prop="index" label="排序" min-width="80px">
          </el-table-column>
          <el-table-column align="center" prop="" label="操作" v-slot="scope" min-width="100px" fixed="right">
            <template>
              <el-button size="small" type="primary" @click="showeditform(scope.row)">编辑</el-button>
              <el-button size="small" type="danger" @click="removeimg(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <el-dialog title="新增轮播图片" :visible.sync="dialogVisible" width="600px" @close="closeaddform">
      <el-form label-width="120px" :model="addForm" ref="addFormRef" :rules="addFormRules" :hide-required-asterisk="false">
        <el-row>
          <el-col :span="15" :offset="3">
            <el-form-item label="标题:" prop="banner">
              <el-input v-model="addForm.banner" placeholder="请输入标题"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15" :offset="3">
            <el-form-item label="图片:">
              <el-upload
                class="addgoodscover"
                ref="addimgRef"
                :limit=1
                :http-request="uploadaddFormFile"
                action="#"
                list-type="picture-card"
                :on-change="changeaddimg"
                :on-preview="addimgPreview"
                :on-remove="handleRemoveadd">
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible1" append-to-body>
                <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11" :offset="3">
            <el-form-item label="显示:" prop="status">
                <el-radio v-model="addForm.status" :label="0">禁用</el-radio>
                <el-radio v-model="addForm.status" :label="1">启用</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11" :offset="3">
            <el-form-item label="排序:" prop="index">
              <el-input v-model="addForm.index" placeholder="请输入排序数字"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="addlunboimg" :disabled="zhinenganyici">确认</el-button>
      </div>
    </el-dialog>
    <el-dialog title="编辑轮播图片" @opened="hiddenaddbtn" :visible.sync="dialogVisible2" width="600px" @close="closeeditform">
      <el-form label-width="120px" :model="editForm" ref="editFormRef" :rules="editFormRules" :hide-required-asterisk="false">
        <el-row>
          <el-col :span="15" :offset="3">
            <el-form-item label="标题:" prop="banner">
              <el-input v-model="editForm.banner" placeholder="请输入标题"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15" :offset="3">
            <el-form-item label="图片:">
              <el-upload
                class="editgoodscover"
                ref="editimgRef"
                :file-list="fileList"
                :limit=1
                :http-request="uploadeditFormFile"
                action="#"
                list-type="picture-card"
                :on-change="changeeditimg"
                :on-preview="editimgPreview"
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
          <el-col :span="11" :offset="3">
            <el-form-item label="显示:" prop="status">
                <el-radio v-model="editForm.status" label="0">禁用</el-radio>
                <el-radio v-model="editForm.status" label="1">启用</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11" :offset="3">
            <el-form-item label="排序:" prop="index">
              <el-input v-model="editForm.index" placeholder="请输入排序数字"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2=false">取消</el-button>
        <el-button type="primary" @click="editlunboimg">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      dialogVisible: false,
      dialogVisible1: false,
      dialogVisible2: false,
      dialogVisible3: false,
      dialogImageUrl: '',
      fileList: [],
      zhinenganyici: false,
      tableData: [],
      total: 1,
      pageNum: 1,
      pageSize: 10,
      maxPage: 1,
      addForm: {
        banner: '',
        index: 0,
        status: ''
      },
      addFormRules: {
        banner: [
          { required: true, message: '请选择标题！', trigger: 'blur' }],
        articleName: [
          { required: true, message: '请选择显示状态！', trigger: 'blur' }],
        index: [
          { required: true, message: '请输入排序数字！', trigger: 'blur' }],
        status: [
          { required: true, message: '请输入排序数字！', trigger: 'blur' }]
      },
      editForm: {},
      editFormRules: {
        banner: [
          { required: true, message: '请选择标题！', trigger: 'blur' }],
        articleName: [
          { required: true, message: '请选择显示状态！', trigger: 'blur' }],
        index: [
          { required: true, message: '请输入排序数字！', trigger: 'blur' }],
        status: [
          { required: true, message: '请输入排序数字！', trigger: 'blur' }]
      }
    }
  },
  created () {
    this.getInformationList()
  },
  methods: {
    async getInformationList () {
      const msg = await this.$http.get('rotation/rotationList')
      if (msg.status !== 200) {
        return this.$message.error('获取商品图片失败！')
      }
      for (let i = 0; i < msg.data.data.length; i++) {
        switch (msg.data.data[i].status) {
          case '1':
            msg.data.data[i].statusname = '启用'
            break
          case '0':
            msg.data.data[i].statusname = '禁用'
            break
        }
      }
      this.tableData = msg.data.data
    },
    uploadaddFormFile () {},
    changeaddimg () {
      if (this.$refs.addimgRef.uploadFiles[0]) {
        const addbtn = document.querySelector('.addgoodscover .el-upload')
        addbtn.style.display = 'none'
      }
    },
    addimgPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible1 = true
    },
    async addlunboimg () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        if (!this.$refs.addimgRef.uploadFiles[0]) {
          return this.$message.error('请添加图片之后再提交！')
        }
        this.addForm.index = Math.ceil(this.addForm.index)
        const formdata = new FormData()
        formdata.append('banner', this.addForm.banner)
        formdata.append('index', this.addForm.index)
        formdata.append('status', this.addForm.status)
        formdata.append('file', this.$refs.addimgRef.uploadFiles[0].raw)
        this.zhinenganyici = true
        const msg = await this.$http.post('rotation/insertRotation', formdata)
        if (msg.status !== 200) {
          return this.$message.error('添加轮播图失败！')
        }
        this.$message.success('添加轮播图成功！')
        this.getInformationList()
        this.dialogVisible = false
      })
    },
    closeaddform () {
      this.zhinenganyici = false
      const addbtn = document.querySelector('.addgoodscover .el-upload')
      addbtn.style.display = 'inline-block'
      this.$refs.addimgRef.clearFiles()
      this.$refs.addFormRef.resetFields()
    },
    async showeditform (user) {
      this.dialogVisible2 = true
      this.editForm = user
      this.fileList.push({ url: user.route })
    },
    hiddenaddbtn () {
      if (this.$refs.editimgRef.uploadFiles[0]) {
        const editbtn = document.querySelector('.editgoodscover .el-upload')
        editbtn.style.display = 'none'
      }
    },
    uploadeditFormFile () {},
    changeeditimg (file, fileList) {
      if (this.$refs.editimgRef.uploadFiles[0]) {
        const addbtn = document.querySelector('.editgoodscover .el-upload')
        addbtn.style.display = 'none'
      }
    },
    editimgPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible3 = true
    },
    async editlunboimg () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        this.editForm.index = Math.ceil(this.editForm.index)
        const formData = new FormData()
        if (!this.$refs.editimgRef.uploadFiles[0].raw) {
          formData.append('path', this.$refs.editimgRef.uploadFiles[0].url)
        } else {
          formData.append('file', this.$refs.editimgRef.uploadFiles[0].raw)
        }
        formData.append('banner', this.editForm.banner)
        formData.append('index', this.editForm.index)
        formData.append('status', this.editForm.status)
        formData.append('id', this.editForm.id)
        const msg = await this.$http.post('rotation/updateRotation', formData)
        if (msg.status !== 200) {
          return this.$message.error('编辑提交失败！')
        }
        this.$message.success('编辑成功！')
        this.getInformationList()
        this.dialogVisible2 = false
      })
    },
    closeeditform () {
      this.$refs.editFormRef.resetFields()
      this.fileList = []
      this.$refs.editimgRef.clearFiles()
      this.getInformationList()
    },
    async removeimg (id) {
      const confirmResult = await this.$confirm('此操作将永久删除该商品图片, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const msg = await this.$http.post('rotation/deleteRotation', this.$qs.stringify({ id: id }))
      if (msg.status !== 200) {
        return this.$message.error('删除失败！')
      }
      this.$message.success('删除成功！')
      this.getInformationList()
    },
    handleRemoveadd (file, fileList) {
      const addbtn = document.querySelector('.addgoodscover .el-upload')
      addbtn.style.display = 'inline-block'
    },
    handleRemoveedit (file, fileList) {
      const addbtn = document.querySelector('.editgoodscover .el-upload')
      addbtn.style.display = 'inline-block'
    }
  }
}
</script>
<style lang="less" scoped>
.addbtn {
    margin-left:27px;
    margin-bottom: 10px;
}
.tablediv {
  height:470px;
}
.main {
  height:630px;
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
.anniu {
  margin-left: 25px;
}
</style>
