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
        <el-form-item label="商品名：" class="firInput" prop="goodname">
          <el-input placeholder="请输入" v-model="queryInfo.goodname"></el-input>
        </el-form-item>
        <el-form-item label="商品分类：" prop="goodcategory">
          <el-input placeholder="请输入" v-model="queryInfo.goodcategory"></el-input>
        </el-form-item>
        <el-form-item label="商品归属：" prop="goodbelong">
          <el-select placeholder="请选择" v-model="queryInfo.goodbelong">
            <el-option label="用户商城" value="customer"></el-option>
            <el-option label="积分商城" value="intergration"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="anniu">
          <el-button type="primary">查询</el-button>
          <el-button plain @click="resetQueryForm">重置</el-button>
        </el-form-item>
      </el-form>
      <el-button class="addbtn" type="primary" size="large" @click="showAddForm">+ 新建</el-button>
      <el-table :data="tableData" style="width: 100%" border>
        <el-table-column align="center" prop="goodid" label="商品ID">
        </el-table-column>
        <el-table-column align="center" prop="name" label="商品名">
        </el-table-column>
        <el-table-column align="center" prop="category" label="商品分类">
        </el-table-column>
        <el-table-column align="center" prop="cover" label="封面图片">
        </el-table-column>
        <el-table-column align="center" prop="imgs" label="项目图册">
        </el-table-column>
        <el-table-column align="center" prop="price" label="价格(元)">
        </el-table-column>
        <el-table-column align="center" prop="storage" label="库存">
        </el-table-column>
        <el-table-column align="center" prop="goodbelong" label="商品归属">
        </el-table-column>
        <el-table-column align="center" prop="status" label="状态">
        </el-table-column>
        <el-table-column align="center" prop="createtime" label="创建时间">
        </el-table-column>
        <el-table-column align="center" prop="" label="操作" width="180px">
          <template>
            <el-button size="small" type="primary" @click="showDialogForm">编辑</el-button>
            <el-button size="small" type="danger">删除</el-button>
          </template>
        </el-table-column>
     </el-table>
     <el-pagination background :page-sizes="[1, 5, 10, 20]" :page-size="10" :page-count="11" :current-page="currentPage" layout="total, slot, prev, pager, next, sizes, jumper" :total="total">
       <span class="slotText">第{{pageNum}}/{{total/5}}页</span>
     </el-pagination>
    </el-card>
    <el-dialog title="编辑商品信息" :visible.sync="dialogVisible1" width="50%">
      <el-form label-width="130px" :model="editForm" ref="editFormRef" :rules="editFormRules" label-position="right">
        <el-row>
          <el-col :span="10">
            <el-form-item label="商品名：" prop="goodname">
              <el-input placeholder="请输入" v-model="editForm.goodname"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-form-item label="商品分类：" prop="category">
              <el-input placeholder="请输入" v-model="editForm.category"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="价格：" prop="price">
              <el-input placeholder="请输入" v-model="editForm.price"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-form-item label="库存：" prop="storage">
              <el-input placeholder="请输入" v-model="editForm.storage"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="商品归属：" prop="goodbelong">
              <el-input placeholder="请输入" v-model="editForm.goodbelong"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-form-item label="状态：" prop="status">
              <!-- <el-select v-model="value" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select> -->
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible1 = false">取消</el-button>
        <el-button type="primary">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="新增商品" :visible.sync="dialogVisible2" width="50%">
      <el-form label-width="130px" :model="addForm" ref="addFormRef" :rules="addFormRules" label-position="right">
        <el-row>
          <el-col :span="10">
            <el-form-item label="商品名称：" prop="goodname">
              <el-input placeholder="请输入" v-model="editForm.goodname"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="2">
            <el-form-item label="商品分类：" prop="category">
              <el-input placeholder="请输入" v-model="editForm.category"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="商品价格：" prop="price">
              <el-input placeholder="请输入" v-model="editForm.price"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="2">
            <el-form-item label="商品库存：" prop="storage">
              <el-input placeholder="请输入" v-model="editForm.storage"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="商品封面" class="uploadimg">
          <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture-card"
            :file-list="fileList1"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible3">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
        <el-form-item label="商品图册" class="uploadimg">
          <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture-card"
            :file-list="fileList2"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible4">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
        <el-row>
          <el-col :span="10">
            <el-form-item label="商品归属：" prop="radio1">
              <el-radio v-model="addForm.radio1" label="1">商城商品</el-radio>
              <el-radio v-model="addForm.radio1" label="2">积分商品</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="2">
            <el-form-item label="商品状态：" prop="radio2">
              <el-radio v-model="addForm.radio2" label="1">正常</el-radio>
              <el-radio v-model="addForm.radio2" label="2">下架</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="文章详情：">
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
        <el-button @click="dialogVisible2 = false">取消</el-button>
        <el-button type="primary">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      dialogVisible1: false,
      currentPage: 1,
      queryInfo: {
        goodname: '',
        goodcategory: '',
        goodbelong: ''
      },
      dialogImageUrl: '',
      dialogVisible2: false,
      dialogVisible3: false,
      dialogVisible4: false,
      fileList1: [{ name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' }],
      fileList2: [
        { name: 'food.jpeg1', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' },
        { name: 'food.jpeg2', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' },
        { name: 'food.jpeg4', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' },
        { name: 'food.jpeg3', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' }
      ],
      tableData: [
        {
          goodid: '0031121',
          name: '',
          category: '男装',
          cover: '',
          imgs: '',
          price: '325',
          storage: '0',
          goodbelong: '用户商城',
          status: '正常',
          createtime: '05-20 13:14'
        },
        {},
        {},
        {},
        {},
        {}
      ],
      editForm: {
        goodname: '',
        category: '',
        price: '',
        storage: '',
        goodbelong: '',
        status: ''
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
      addForm: {
        goodname: '',
        category: '',
        price: '',
        storage: '',
        radio1: '2',
        radio2: '2',
        textarea: ''
      },
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
    this.getCustomerList()
  },
  methods: {
    showDialogForm () {
      this.dialogVisible1 = true
    },
    showAddForm () {
      this.dialogVisible2 = true
    },
    resetQueryForm () {
      this.$refs.queryInfoRef.resetFields()
    },
    getCustomerList () {
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
  margin-bottom: 0;
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
