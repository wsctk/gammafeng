<template>
  <div>
    <div class="head">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>系统管理</el-breadcrumb-item>
        <el-breadcrumb-item>轮播图管理</el-breadcrumb-item>
      </el-breadcrumb>
      <p class="indexText">轮播图管理</p>
    </div>
    <el-row>
      <el-col :span="3" v-for="img in imgslist" :key="img.id" >
          <el-card >
            <img :src=img.route style="width:115px;height:115px;">
            <el-button type="primary" @click="deleteimg">删除</el-button>
          </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="2" :offset="1">
        <el-button type="primary" @click="dialogVisible=true">新增轮播图片</el-button>
      </el-col>
    </el-row>
    <el-dialog title="新增轮播图片" :visible.sync="dialogVisible" width="40%" @close="closeaddform">
        <el-row>
            <el-col :span="15" :offset="4">
                <el-upload
                ref="addimgRef"
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
            </el-col>
        </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="addlunboimgs">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      total: 200,
      maxPage: '',
      pageNum: '',
      pageSize: '',
      dialogVisible: false,
      dialogVisible2: false,
      dialogImageUrl: '',
      imgslist: []
    }
  },
  created () {
    this.getlunboimgsList()
  },
  methods: {
    async getlunboimgsList () {
      const msg = await this.$http.get('rotation/rotationList')
      console.log(msg)
      if (msg.status !== 200) {
        return this.$message.error('获取轮播图片失败！')
      }
      this.imgslist = msg.data.data
    },
    uploadaddFormFile () {
      console.log('上传了一张轮播图片')
    },
    async addlunboimgs () {
      const formData = new FormData()
      for (let i = 0; i < this.$refs.addimgRef.uploadFiles.length; i++) {
        formData.append('files', this.$refs.addimgRef.uploadFiles[i].raw)
      }
      const msg = await this.$http.post('rotation/insertRotation', formData)
      if (msg.status !== 200) {
        return this.$message.error('新增轮播图片失败！')
      }
      this.$message.success('新增轮播图片成功！')
      this.getlunboimgsList()
    },
    addimgPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible2 = true
    },
    closeaddform () {
      this.$refs.addimgRef.clearFiles()
    },
    deleteimg () {
      console.log(this.$event.target.value)
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
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
