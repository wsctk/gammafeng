<template>
  <div>
    <div class="head">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
        <el-breadcrumb-item>管理员管理</el-breadcrumb-item>
        <!-- <el-breadcrumb-item>认证记录</el-breadcrumb-item> -->
      </el-breadcrumb>
      <p class="indexText">管理员管理</p>
    </div>
    <el-card>
      <el-form :inline="true" :model="queryInfo" ref="queryInfoRef">
        <el-form-item label="账户号：" class="firInput" prop="articlename">
          <el-input placeholder="请输入" v-model="queryInfo.articlename"></el-input>
        </el-form-item>
        <el-form-item label="手机号码：" class="firInput" prop="articlename">
          <el-input placeholder="请输入" v-model="queryInfo.articlename"></el-input>
        </el-form-item>
        <el-form-item label="管理员状态：" prop="publishtime">
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
        <el-table-column align="center" prop="id" label="用户ID">
        </el-table-column>
        <el-table-column align="center" prop="articleName" label="管理员姓名">
        </el-table-column>
        <el-table-column align="center" label="管理员帐号">
          <!-- <template v-slot="scope">
            <img :src=scope.row.cover style="width: 100px; height: 100px" />
          </template> -->
        </el-table-column>
        <el-table-column align="center" prop="createTime" label="手机号">
          <!-- <template v-slot="scope">
            {{ scope.row.createTime | dateFormat}}
          </template> -->
        </el-table-column>
        <el-table-column align="center" prop="scannumber" label="管理员状态">
        </el-table-column>
        <el-table-column align="center" prop="status" label="创建时间">
        </el-table-column>
        <el-table-column align="center" prop="" label="操作" width="180px">
          <template>
            <el-button size="small" type="primary">编辑</el-button>
            <el-button size="small" type="danger">删除</el-button>
          </template>
        </el-table-column>
    </el-table>
    <!-- <img
    style="width: 100px; height: 100px"
    :src="img" /> -->
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
      <el-form label-width="100px" :model="additionalInfo">
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
                :http-request="uploadSectionFile"
                action="#"
                list-type="picture-card"
                :file-list="fileList"
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
                type="textarea"
                :rows="4"
                placeholder="富文本编辑器"
                v-model="textarea">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15" :offset="4">
            <el-form-item label="资讯状态:">
              <el-radio v-model="radio" label="1">正常</el-radio>
              <el-radio v-model="radio" label="2">禁用</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary">确定</el-button>
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
        publishtime: '',
        pageNum: 1,
        pagesize: 8
      },
      radio: '2',
      dialogVisible: false,
      additionalInfo: {
        title: '123',
        fengmian: '123',
        xiangqing: '123'
      },
      dialogVisible2: false,
      dialogImageUrl: '',
      textarea: '',
      fileList: [{ name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' }],
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
    async getInformationList () {
      const msg = await this.$http.get('information/getInformationList')
      console.log(msg.data)
      this.tableData = msg.data
      this.total = msg.data.length + 1
    },
    showAddForm () {
      this.dialogVisible = true
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible2 = true
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    async uploadSectionFile (params) {
      const file = params.file
      // fileType = file.type,
      // isImage = fileType.indexOf("image") != -1,
      // isLt2M = file.size / 1024 / 1024 < 2;
      // // 这里常规检验，看项目需求而定
      // if (!isImage) {
      // this.$message.error("只能上传图片格式png、jpg、gif!");
      // return;
      // }
      // if (!isLt2M) {
      // this.$message.error("只能上传图片大小小于2M");
      // return;
      // }
      // 根据后台需求数据格式
      const formData = new FormData()
      // 文件对象
      formData.append('file', file)
      // 本例子主要要在请求时添加特定属性，所以要用自己方法覆盖默认的action
      formData.append('articleName', this.additionalInfo.title)
      formData.append('content', this.additionalInfo.xiangqing)
      console.log(formData.get('img'))
      const add = await this.$http.post('information/addInformation', formData)
      // {
      //   articleName: this.additionalInfo.title,
      //   content: this.additionalInfo.fengmian,
      //   file: this.additionalInfo.xiangqing
      // })
      // console.log(add)
      this.img = add.data.data
      console.log(this.img)
      console.log(add.data.data)
      this.getInformationList()
      // 项目封装的请求方法，下面做简单介绍
      // imageUpload(form)
      // .then(res => {
      //     //自行处理各种情况
      //     // const code = res && parseInt(res.code, 10);
      //     // if (code === 200) {
      //     // // xxx
      //     // } else {
      //     // // xxx
      //     // }
      //     console.log(res)
      // })
      // .catch(() => {
      //     // xxx
      // });
    }
    // async uploadAddInfo () {
    //   const add = await this.$http.post('information/addInformation',
    //     {
    //       articleName: this.additionalInfo.title,
    //       content: this.additionalInfo.fengmian,
    //       file: this.additionalInfo.xiangqing
    //     })
    //   console.log(add)
    // }
    // this.getInformationList()
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
