<template>
  <div>
    <div class="head">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
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
            <el-option label="用户商城" value="customer"></el-option>
            <el-option label="积分商城" value="intergration"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="anniu">
          <el-button type="primary" @click="query">查询</el-button>
          <el-button plain @click="resetQueryForm">重置</el-button>
        </el-form-item>
      </el-form>
      <el-button class="addbtn" type="primary" size="large" @click="showAddForm">+ 新建</el-button>
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
        <el-table-column align="center" prop="imgs" label="项目图册">
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
    <el-dialog title="新增商品" :visible.sync="dialogVisible" width="50%">
      <el-form label-width="130px" :model="addForm" ref="addFormRef" :rules="addFormRules" label-position="right">
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
            :http-request="uploadaddFormFile"
            action=#
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible2">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
        <el-form-item label="商品图册" class="uploadimg">
          <el-upload
            :http-request="uploadimgs"
            action=#
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible3">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
        <el-row>
          <el-col :span="10">
            <el-form-item label="商品归属：">
              <el-radio v-model="addForm.goodsClassfication" label="0">商城商品</el-radio>
              <el-radio v-model="addForm.goodsClassfication" label="1">积分商品</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="2">
            <el-form-item label="商品状态：">
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
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitaddform">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="编辑商品" :visible.sync="dialogVisible1" width="50%">
      <el-form label-width="130px" :model="addForm" ref="addFormRef" :rules="editFormRules" label-position="right">
        <el-row>
          <el-col :span="10">
            <el-form-item label="商品名称：" prop="goodsName">
              <el-input placeholder="请输入" v-model="editForm.goodname"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="2">
            <el-form-item label="商品分类：" prop="cateGoryName">
              <el-input placeholder="请输入" v-model="editForm.category"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="商品价格：" prop="goodsPrice">
              <el-input placeholder="请输入" v-model="editForm.price"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="2">
            <el-form-item label="商品库存：" prop="inventory">
              <el-input placeholder="请输入" v-model="editForm.storage"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="商品封面" class="uploadimg">
          <el-upload
            :limit=1
            :http-request="uploadaddFormFile"
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
            :http-request="uploadimgs"
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
              <el-radio v-model="addForm.goodsClassfication" label="0">商城商品</el-radio>
              <el-radio v-model="addForm.goodsClassfication" label="1">积分商品</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="2">
            <el-form-item label="商品状态：" prop="radio2">
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
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible1 = false">取消</el-button>
        <el-button type="primary" @click="submiteditform">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      dialogVisible: false,
      currentPage: 1,
      queryInfo: {
        goodsName: '',
        cateGoryName: '',
        goodsClassfication: ''
      },
      category: [],
      dialogImageUrl: '',
      dialogVisible1: false,
      dialogVisible2: false,
      dialogVisible3: false,
      dialogVisible4: false,
      dialogVisible5: false,
      tableData: [],
      editForm: {},
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
      editFormRules: {
        goodname: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' }
        ],
        category: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' }
        ],
        storage: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' }
        ],
        goodbelong: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' }
        ]
      },
      multipartFileile: '',
      file: [],
      addFormRules: {
        goodname: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' }
        ],
        category: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' }
        ],
        storage: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' }
        ]
      },
      total: 400,
      pageNum: 1
    }
  },
  created () {
    this.getgoodList()
  },
  methods: {
    async getgoodList () {
      const msg = await this.$http.get('store/goodsList')
      console.log(msg.data.data)
      this.tableData = msg.data.data
      const cate = await this.$http.get('category/categoryList')
      console.log(cate.data.data)
      this.category = cate.data.data
    },
    async query () {
      const msg = await this.$http.post()
      console.log(msg)
    },
    showAddForm () {
      this.dialogVisible = true
    },
    uploadaddFormFile (params) {
      this.multipartFileile = params.file
    },
    uploadimgs (params) {
      this.file.push(params.file)
      console.log(this.file)
    },
    async submitaddform () {
      const formData = new FormData()
      formData.append('multipartFileile', this.multipartFileile)
      for (var i = 0; i < this.file.length; i++) {
        formData.append('file', this.file[i])
      }
      const add = await this.$http.post('store/addGoods', formData, { params: this.addForm })
      console.log(add)
      // this.dialogVisible = false
      // this.getInformationList()
    },
    async showeditForm (user) {
      this.dialogVisible1 = true
      this.editForm = user
    },
    async submiteditform () {
      const formData = new FormData()
      formData.append('multipartFileile', this.multipartFileile)
      for (var i = 0; i < this.file.length; i++) {
        formData.append('file', this.file[i])
      }
      const add = await this.$http.post('store/addGoods', formData, { params: this.editForm })
      console.log(add)
      // this.dialogVisible = false
      // this.getInformationList()
    },
    resetQueryForm () {
      this.$refs.queryInfoRef.resetFields()
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible2 = true
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
