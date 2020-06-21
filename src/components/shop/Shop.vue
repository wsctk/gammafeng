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
          <el-input placeholder="请输入" v-model="queryInfo.goodsName"></el-input>
        </el-form-item>
        <el-form-item label="商品分类：" prop="cateGoryName">
          <el-input placeholder="请输入" v-model="queryInfo.cateGoryName"></el-input>
        </el-form-item>
        <el-form-item label="商品归属：" prop="goodsClassfication">
          <el-select placeholder="请选择" v-model="queryInfo.goodsClassfication">
            <el-option label="用户商城" value="0"></el-option>
            <el-option label="积分商城" value="1"></el-option>
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
            <el-button type="primary" size="small" @click="showimgs(scope.row)"></el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="goodsPrice" label="价格(元)">
        </el-table-column>
        <el-table-column align="center" prop="inventory" label="库存">
        </el-table-column>
        <el-table-column align="center" prop="goodsClassfication" label="商品归属">
        </el-table-column>
        <el-table-column align="center" prop="goodsState" label="状态">
        </el-table-column>
        <el-table-column align="center" prop="createTime" label="创建时间">
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
     <el-pagination background :page-sizes="[1, 5, 10, 20]" :page-size="10" :page-count="11" :current-page="currentPage" layout="total, slot, prev, pager, next, sizes, jumper" :total="total">
       <span class="slotText">第{{pageNum}}/{{total/5}}页</span>
     </el-pagination>
    </el-card>
    <el-dialog title="新增商品" :visible.sync="dialogVisible" width="50%" @close="closeaddform">
      <el-form label-width="130px" :model="addForm" ref="addFormRef" :rules="addFormRules" label-position="right" hide-required-asterisk>
        <el-row>
          <el-col :span="10">
            <el-form-item label="商品名称：">
              <el-input placeholder="请输入" v-model="addForm.goodsName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="2">
            <el-form-item label="商品分类：">
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
            <el-form-item label="商品价格：">
              <el-input placeholder="请输入" v-model="addForm.goodsName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="2">
            <el-form-item label="商品库存：">
              <el-input placeholder="请输入" v-model="addForm.inventory"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="商品封面" class="uploadimg">
          <el-upload
            :limit=1
            :http-request="uploadaddimg"
            action=#
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible2">
            <img width="100%" :src="dialogImageUrl">
          </el-dialog>
        </el-form-item>
        <el-form-item label="商品图册" class="uploadimg">
          <el-upload
            :http-request="uploadaddimgs"
            action=#
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible3">
            <img width="100%" :src="dialogImageUrl">
          </el-dialog>
        </el-form-item>
        <el-row>
          <el-col :span="10">
            <el-form-item label="商品归属：" prop="goodsClassfication">
              <el-radio v-model="addForm.goodsClassfication" label="0">商城商品</el-radio>
              <el-radio v-model="addForm.goodsClassfication" label="1">积分商品</el-radio>
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
            <el-form-item label="商品详情：">
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
        <el-button type="primary" @click="submitaddform">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="编辑商品" :visible.sync="dialogVisible1" width="50%" @click="closeeditform">
      <el-form label-width="130px" :model="editForm" ref="editFormRef" :rules="editFormRules" label-position="right" hide-required-asterisk>
        <el-row>
          <el-col :span="10">
            <el-form-item label="商品名称：" prop="goodsName">
              <el-input placeholder="请输入" v-model="editForm.goodname"></el-input>
            </el-form-item>
          </el-col>
          // 回显商品分类
          <el-col :span="10" :offset="2">
            <el-form-item label="商品分类：">
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
            :file-list="editimglist"
            :limit=1
            :http-request="uploadeditimg"
            action=#
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible4">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
        <el-form-item label="商品图册" class="uploadimg">
          <el-upload
            :file-list="editimgslist"
            :http-request="uploadeditimgs"
            action=#
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible5">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
        <el-row>
          <el-col :span="10">
            <el-form-item label="商品归属：" prop="radio1">
              <el-radio v-model="editForm.goodsClassfication" label="0">商城商品</el-radio>
              <el-radio v-model="editForm.goodsClassfication" label="1">积分商品</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="2">
            <el-form-item label="商品状态：" prop="radio2">
              <el-radio v-model="editForm.goodsState" label="1">正常</el-radio>
              <el-radio v-model="editForm.goodsState" label="0">下架</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="商品详情：">
              <el-input
                type="textarea"
                :rows="6"
                placeholder="富文本编辑器"
                v-model="editForm.textarea">
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
          <el-col :span="10" :offset="3">
          <img :src=item style="width:100px;height:100px;" />
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
      tableData: [],
      total: 400,
      pageNum: 1,
      currentPage: 1,
      queryInfo: {
        goodsName: '',
        cateGoryName: '',
        goodsClassfication: ''
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
        goodsName: '123',
        categoryId: '',
        goodsPrice: '123',
        inventory: '123',
        goodsClassfication: '0',
        goodsState: '0',
        goodsDescription: '123'
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
      addimg: '',
      addimgs: [],
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
      editimg: '',
      editimgs: [],
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
      const msg = await this.$http.post('', this.queryInfo)
      console.log(msg)
      if (msg.status !== 200) {
        this.resetQueryForm()
        return this.$message.error('查询失败！')
      }
      this.tableData = msg.data.data
    },
    async getgoodList () {
      const msg = await this.$http.get('store/goodsList')
      console.log(msg.data.data)
      if (msg.status !== 200) {
        return this.$message.error('获取商品列表失败')
      }
      for (let item in msg.data.data) {
        switch (item.goodsClassfication) {
          case 1:
            item.goodsClassfication = '用户商城'
            break
          case 2:
            item.goodsClassfication = '积分商城'
            break
        }
        switch (item.goodsState) {
          case 0:
            item.goodsState = '下架'
            break
          case 1:
            item.goodsState = '正常'
            break
        }
      }
      this.tableData = msg.data.data
    },
    async getcategory () {
      const cate = await this.$http.get('category/categoryList')
      console.log(cate.data.data)
      if (msg.status !== 200) {
        return this.$message.error('获取商品分类失败！')
      }
      this.category = cate.data.data
    },
    uploadaddimg (params) {
      this.addimg = params.file
    },
    uploadaddimgs (params) {
      this.addimgs.push(params.file)
      console.log(this.file)
    },
    async submitaddform () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const formData = new FormData()
        formData.append('multipartFileile', this.addimg)
        for (var i = 0; i < this.addimgs.length; i++) {
          formData.append('file', this.addimgs[i])
        }
        const msg = await this.$http.post('store/addGoods', formData, { params: this.addForm })
        if (msg.status !== 200) {
          this.dialogVisible = false
          return this.$message.error('添加商品失败！')
        }
        this.getInformationList()
        this.$message.success('添加商品成功！')
        this.dialogVisible = false
      })
    },
    closeaddform () {
      this.multipartFileile = '',
      this.file = []
      this.$refs.addFormRef.resetFields()
    },
    showeditForm (user) {
      this.dialogVisible1 = true
      this.editForm = user
      this.editimglist.push({ url: user.goodsCover })
      for (let item in user.goodsimg) {
        this.editimgslist.push({ url: item})
      }
    },
    uploadeditimg (params) {
      this.editimg = params.file
    },
    uploadeditimgs (params) {
      this.editimgs = params.file
    },
    async submiteditform () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const formData = new FormData()
        formData.append('multipartFileile', this.editimg)
        for (var i = 0; i < this.editimgs.length; i++) {
          formData.append('file', this.editimgs[i])
        }
        const msg = await this.$http.post('store/addGoods', formData, { params: this.editForm })
        console.log(msg)
        if (msg.status !== 200) {
          this.dialogVisible1 = false
          return this.$message.error('编辑商品信息失败！')
        }
        this.getInformationList()
        this.dialogVisible1 = false
        this.$message.success('编辑商品信息成功！')
      })
    },
    closeeditform () {
      this.editForm = {}
      this.editimglist = ''
      this.editimgslist = []
      this.getInformationList()
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible2 = true
    },
    showimgs (user) {
      this.dialogVisibleimgs = true
      this.showimgslist = user.goosimgs
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
  margin-left:825px;
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
