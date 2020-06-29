<template>
  <div>
    <div class="head">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>商城管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      </el-breadcrumb>
      <p class="indexText">商品管理</p>
    </div>
    <el-card>
      <el-form :inline="true" :model="queryInfo" ref="queryInfoRef">
        <el-form-item label="商品名：" class="firInput" prop="goodsName">
          <el-input placeholder="请输入" v-model="queryInfo.goodsName" @keydown.enter.native="query"></el-input>
        </el-form-item>
        <el-form-item label="商品分类：" prop="cateGoryName">
          <el-input placeholder="请输入" v-model="queryInfo.cateGoryName" @keydown.enter.native="query"></el-input>
        </el-form-item>
        <el-form-item label="商品归属：" prop="goodsClassfication">
          <el-select placeholder="请选择" v-model="queryInfo.goodsClassfication" @keydown.enter.native="query">
            <el-option label="用户商城" value="1"></el-option>
            <el-option label="积分商城" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="anniu">
          <el-button type="primary" @click="query">查询</el-button>
          <el-button plain @click="resetQueryForm">重置</el-button>
        </el-form-item>
      </el-form>
      <el-button class="addbtn" type="primary" size="large" @click="dialogVisible=true">+ 新建</el-button>
      <el-table :data="tableData" style="width: 100%" border>
        <el-table-column align="center" prop="id" label="商品ID">
        </el-table-column>
        <el-table-column align="center" prop="goodsName" label="商品名">
        </el-table-column>
        <el-table-column align="center" prop="cateGoryName" label="商品分类">
        </el-table-column>
        <el-table-column align="center" prop="goodsCover" label="封面图片" v-slot="scope">
          <template>
            <img :src="scope.row.goodsCover" style="width: 50px; height: 50px" />
          </template>
        </el-table-column>
        <el-table-column align="center" label="项目图册">
          <template v-slot="scope">
            <el-button type="success" size="small" @click="showimgs(scope.row.id)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="goodsPrice" label="价格(元)">
        </el-table-column>
        <el-table-column align="center" prop="inventory" label="库存">
        </el-table-column>
        <el-table-column align="center" prop="goodsClassficationname" label="商品归属">
        </el-table-column>
        <el-table-column align="center" prop="goodsStatename" label="商品状态">
        </el-table-column>
        <el-table-column align="center" prop="createTime" label="创建时间" v-slot="scope" width="150px">
          <template>
            {{scope.row.createTime | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="" label="操作" width="180px" v-slot="scope">
          <template>
            <el-button size="small" type="primary" @click="showeditForm(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="remove(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
     </el-table>
     <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" background :page-sizes="[1, 5, 10, 20]" :page-size="pageSize" :page-count="11" :current-page="pageNum" layout="total, slot, prev, pager, next, sizes, jumper" :total="total">
       <span class="slotText">第{{pageNum}}/{{maxPage}}页</span>
     </el-pagination>
    </el-card>
    <el-dialog title="新增商品" :visible.sync="dialogVisible" width="50%" @close="closeaddform">
      <el-form label-width="130px" :model="addForm" ref="addFormRef" :rules="addFormRules" label-position="right" :hide-required-asterisk='false'>
        <el-row>
          <el-col :span="10">
            <el-form-item label="商品名称：" prop="goodsName">
              <el-input placeholder="请输入" v-model="addForm.goodsName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="2">
            <el-form-item label="商品分类：" prop="categoryId">
               <el-select v-model="addForm.categoryId" placeholder="请选择">
                <el-option
                  v-for="item in category"
                  :key="item.id"
                  :label="item.categoryName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="商品价格：" prop="goodsPrice">
              <el-input placeholder="请输入" v-model="addForm.goodsPrice"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="2">
            <el-form-item label="商品库存：" prop="inventory">
              <el-input placeholder="请输入" v-model="addForm.inventory"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="商品封面" class="uploadimg">
          <el-upload
            ref="addimgRef"
            :limit=1
            :http-request="uploadaddimg"
            action=#
            list-type="picture-card"
            :on-preview="addimgPreview"
            :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible2" append-to-body>
            <img width="100%" :src="dialogImageUrl">
          </el-dialog>
        </el-form-item>
        <el-form-item label="商品图册" class="uploadimg">
          <el-upload
            ref="addimgsRef"
            :http-request="uploadaddimgs"
            action=#
            list-type="picture-card"
            :on-preview="addimgsPreview"
            :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible3" append-to-body>
            <img width="100%" :src="dialogImageUrl">
          </el-dialog>
        </el-form-item>
        <el-row>
          <el-col :span="10">
            <el-form-item label="商品归属：" prop="goodsClassfication">
              <el-radio v-model="addForm.goodsClassfication" label="1">商城商品</el-radio>
              <el-radio v-model="addForm.goodsClassfication" label="0">积分商品</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="2">
            <el-form-item label="商品状态：" prop="goodsState">
              <el-radio v-model="addForm.goodsState" label="1">正常</el-radio>
              <el-radio v-model="addForm.goodsState" label="0">下架</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="商品详情：" prop="textarea">
              <el-input
                type="textarea"
                :rows="6"
                placeholder="富文本编辑器"
                v-model="addForm.textarea">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="submitaddform" :disabled="zhinenganyici">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="编辑商品" :visible.sync="dialogVisible1" width="50%" @close="closeeditform">
      <el-form label-width="130px" :model="editForm" ref="editFormRef" :rules="editFormRules" label-position="right" :hide-required-asterisk='false'>
        <el-row>
          <el-col :span="10">
            <el-form-item label="商品名称：" prop="goodsName">
              <el-input placeholder="请输入" v-model="editForm.goodsName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="2">
            <el-form-item label="商品分类：" prop="categoryName">
               <el-select v-model="editForm.categoryId">
                <el-option
                  v-for="item in category"
                  :key="item.id"
                  :label="item.categoryName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="商品价格：" prop="goodsPrice">
              <el-input placeholder="请输入" v-model="editForm.goodsPrice"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="2">
            <el-form-item label="商品库存：" prop="inventory">
              <el-input placeholder="请输入" v-model="editForm.inventory"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="商品封面" class="uploadimg">
          <el-upload
            ref="editimgRef"
            :file-list="editimglist"
            :limit=1
            :http-request="uploadeditimg"
            action=#
            list-type="picture-card"
            :on-preview="editimgPreview"
            :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible4" append-to-body>
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
        <el-form-item label="商品图册" class="uploadimg">
          <el-upload
            :http-request="uploadeditimgs"
            ref="editimgsRef"
            :file-list="editimgslist"
            action=#
            list-type="picture-card"
            :on-preview="editimgsPreview"
            :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible5" append-to-body>
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
        <el-row>
          <el-col :span="10">
            <el-form-item label="商品归属：" prop="goodsClassfication">
              <el-radio v-model="editForm.goodsClassfication" label="0">商城商品</el-radio>
              <el-radio v-model="editForm.goodsClassfication" label="1">积分商品</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="2">
            <el-form-item label="商品状态：" prop="goodsState">
              <el-radio v-model="editForm.goodsState" :label="1">正常</el-radio>
              <el-radio v-model="editForm.goodsState" :label="0">下架</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="商品详情：" prop="goodsDescription">
              <el-input
                type="textarea"
                :rows="6"
                v-model="editForm.goodsDescription">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible1 = false">取消</el-button>
        <el-button type="primary" @click="submiteditform">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="项目图册" :visible.sync="dialogVisibleimgs" width="40%">
      <el-row v-for="item in showimgslist" :key="item.id">
        <template>
          <el-col :span="14" :offset="8">
            <img :src=item.thumbnailPicture style="width:200px;height:200px;" />
          </el-col>
        </template>
      </el-row>
      <div slot="footer">
        <el-button @click="dialogVisibleimgs=false">关闭</el-button>
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
      pageNum: 1,
      pageSize: 10,
      maxPage: 1,
      queryInfo: {
        goodsName: '',
        cateGoryName: '',
        goodsClassfication: '',
        pageNum: '',
        pageSize: ''
      },
      category: [],
      dialogImageUrl: '',
      dialogVisible: false,
      dialogVisible1: false,
      dialogVisible2: false,
      dialogVisible3: false,
      dialogVisible4: false,
      dialogVisible5: false,
      dialogVisibleimgs: false,
      addForm: {
        textarea: '',
        goodsName: '',
        categoryId: '',
        goodsPrice: '',
        inventory: '',
        goodsClassfication: '',
        goodsState: '',
        goodsDescription: ''
      },
      addFormRules: {
        goodsName: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        categoryId: [
          { required: true, message: '请输入商品分类', trigger: 'blur' }
        ],
        goodsPrice: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        inventory: [
          { required: true, message: '请输入商品库存', trigger: 'blur' }
        ]
      },
      editForm: {},
      editFormRules: {
        goodsName: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        categoryId: [
          { required: true, message: '请输入商品分类', trigger: 'blur' }
        ],
        goodsPrice: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        inventory: [
          { required: true, message: '请输入商品库存', trigger: 'blur' }
        ]
      },
      editimglist: [],
      editimgslist: [],
      showimgslist: []
    }
  },
  created () {
    this.getgoodList()
    this.getcategory()
  },
  methods: {
    resetQueryForm () {
      this.$refs.queryInfoRef.resetFields()
    },
    async query () {
      this.queryInfo.pageNum = this.pageNum
      this.queryInfo.pageSize = this.pageSize
      const msg = await this.$http.get('store/goodsList', { params: this.queryInfo })
      console.log(msg)
      if (msg.status !== 200) {
        this.resetQueryForm()
        return this.$message.error('查询失败！')
      }
      let arr = []
      arr = msg
      for (let i = 0; i < arr.data.rows.length; i++) {
        switch (arr.data.rows[i].goodsClassfication) {
          case '1':
            arr.data.rows[i].goodsClassficationname = '用户商城'
            break
          case '0':
            arr.data.rows[i].goodsClassficationname = '积分商城'
            break
        }
        switch (arr.data.rows[i].goodsState) {
          case 0:
            arr.data.rows[i].goodsStatename = '下架'
            break
          case 1:
            arr.data.rows[i].goodsStatename = '正常'
            break
        }
        if (arr.data.rows[i].goodsClassfication === '1') {
          arr.data.rows[i].goodsPrice /= 100
          arr.data.rows[i].goodsPrice = arr.data.rows[i].goodsPrice.toFixed(2)
        }
      }
      this.tableData = arr.data.rows
      this.total = arr.data.total
      this.maxPage = arr.data.maxPage
    },
    async getgoodList () {
      const msg = await this.$http.get('store/goodsList', { params: { pageNum: this.pageNum, pageSize: this.pageSize } })
      if (msg.status !== 200) {
        return this.$message.error('获取商品列表失败')
      }
      let arr = []
      arr = msg
      for (let i = 0; i < arr.data.rows.length; i++) {
        switch (arr.data.rows[i].goodsClassfication) {
          case '1':
            arr.data.rows[i].goodsClassficationname = '用户商城'
            break
          case '0':
            arr.data.rows[i].goodsClassficationname = '积分商城'
            break
        }
        switch (arr.data.rows[i].goodsState) {
          case 0:
            arr.data.rows[i].goodsStatename = '下架'
            break
          case 1:
            arr.data.rows[i].goodsStatename = '正常'
            break
        }
        if (arr.data.rows[i].goodsClassfication === '1') {
          arr.data.rows[i].goodsPrice /= 100
          arr.data.rows[i].goodsPrice = arr.data.rows[i].goodsPrice.toFixed(2)
        }
      }
      this.tableData = arr.data.rows
      this.total = arr.data.total
      this.maxPage = arr.data.maxPage
    },
    async getcategory () {
      const cate = await this.$http.get('category/categoryListNotPage')
      console.log(cate)
      if (cate.status !== 200) {
        return this.$message.error('获取商品分类失败！')
      }
      this.category = cate.data.data
    },
    uploadaddimg (params) {
      console.log('上传了一张封面图片')
    },
    uploadaddimgs (params) {
      console.log('向图册上传了一张图片')
    },
    async submitaddform () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const formData = new FormData()
        if (!this.$refs.addimgRef.uploadFiles[0]) {
          this.dialogVisible = false
        }
        var addimg = this.$refs.addimgRef.uploadFiles[0].raw
        console.log(this.$refs.addimgRef.uploadFiles)
        formData.append('multipartFileile', addimg)
        for (var i = 0; i < this.$refs.addimgsRef.uploadFiles.length; i++) {
          formData.append('file', this.$refs.addimgsRef.uploadFiles[i].raw)
        }
        this.zhinenganyici = true
        const msg = await this.$http.post('store/addGoods', formData, { params: this.addForm })
        if (msg.status !== 200) {
          this.dialogVisible = false
          return this.$message.error('添加商品失败！')
        }
        this.getgoodList()
        this.$message.success('添加商品成功！')
        this.dialogVisible = false
      })
    },
    closeaddform () {
      this.zhinenganyici = false
      this.$refs.addFormRef.resetFields()
      this.$refs.addimgRef.clearFiles()
      this.$refs.addimgsRef.clearFiles()
    },
    async showeditForm (user) {
      this.dialogVisible1 = true
      if (user.goodsClassfication === '1') {
        console.log(user)
        user.goodsPrice = (user.goodsPrice * 100).toFixed(0)
      }
      const msg = await this.$http.get('picture/pictureListNotPage', { params: { goodsId: user.id } })
      console.log(msg.data.data)
      if (msg.status !== 200) {
        this.$message.error('获取图册失败！')
      }
      this.showimgslist = msg.data.data
      this.editForm = user
      this.editimglist.push({ url: user.goodsCover })
      for (let i = 0; i < this.showimgslist.length; i++) {
        this.editimgslist.push({ url: this.showimgslist[i].thumbnailPicture })
      }
    },
    uploadeditimg (params) {
      console.log('上传了一张封面')
    },
    uploadeditimgs (params) {
      console.log('向图册上传了一张图片')
    },
    async submiteditform () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const formData = new FormData()
        var editimg = ''
        console.log()
        if (!this.$refs.editimgRef.uploadFiles[0].raw) {
          editimg = this.$refs.editimgRef.uploadFiles[0].url
        } else {
          editimg = this.$refs.editimgRef.uploadFiles[0].raw
        }
        formData.append('multipartFileile', editimg)
        for (let j = 0; j < this.$refs.editimgsRef.uploadFiles.length; j++) {
          if (!this.$refs.editimgsRef.uploadFiles[j].raw) {
            formData.append('imgs', this.$refs.editimgsRef.uploadFiles[j].url)
          } else {
            formData.append('file', this.$refs.editimgsRef.uploadFiles[j].raw)
          }
        }
        const msg = await this.$http.post('store/updateGoods', formData, { params: this.editForm })
        if (msg.status !== 200) {
          this.dialogVisible1 = false
          return this.$message.error('编辑商品信息失败！')
        }
        this.getgoodList()
        this.dialogVisible1 = false
        this.$message.success('编辑商品信息成功！')
      })
    },
    closeeditform () {
      this.editForm = {}
      this.editimglist = []
      this.editimgslist = []
      this.showimgslist = []
      this.$refs.editimgRef.clearFiles()
      this.$refs.editimgsRef.clearFiles()
      this.getgoodList()
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    addimgPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible2 = true
    },
    addimgsPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible3 = true
    },
    editimgPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible4 = true
    },
    editimgsPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible5 = true
    },
    async remove (id) {
      const confirmResult = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const msg = await this.$http.post('store/deleteGoods', this.$qs.stringify({ id: id }))
      if (msg.status !== 200) {
        return this.$message.error('删除商品失败')
      }
      this.$message.success('商品已删除')
      this.getgoodList()
    },
    async showimgs (id) {
      this.dialogVisibleimgs = true
      const msg = await this.$http.get('picture/pictureListNotPage', { params: { goodsId: id } })
      console.log(msg)
      if (msg.status !== 200) {
        return this.$message.error('获取图册失败！')
      }
      this.showimgslist = msg.data.data
    },
    handleSizeChange (newSize) {
      this.pageSize = newSize
      if (!this.queryInfo.goodsName && !this.queryInfo.cateGoryName && !this.queryInfo.goodsClassfication) {
        return this.getgoodList()
      }
      this.query()
    },
    handleCurrentChange (newPage) {
      this.pageNum = newPage
      if (!this.queryInfo.goodsName && !this.queryInfo.cateGoryName && !this.queryInfo.goodsClassfication) {
        return this.getgoodList()
      }
      this.query()
    }
  }
}
</script>
<style lang="less" scoped>
.uploadimg {
  margin-bottom: 10px;
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
  margin-left:725px;
}
.slotText {
  color: #606266;
  font-weight: 400;
  font-size: 13px;
}
/deep/.el-dialog__header {
  border:1px solid #eee;
}
/deep/.el-upload--picture-card {
  height: 120px;
  width: 120px;
}
/deep/.el-upload-list--picture-card .el-upload-list__item {
  height: 120px;
  width: 120px;
}
/deep/.el-dialog__header {
  border-radius: 7px;
}
/deep/.el-radio {
  margin-right:20px;
}
</style>
