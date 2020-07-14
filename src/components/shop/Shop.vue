<template>
  <div>
    <div class="head">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>商城管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      </el-breadcrumb>
      <p class="indexText">商品管理</p>
    </div>
    <el-card class="main">
      <el-form :inline="true" :model="queryInfo" ref="queryInfoRef">
        <el-form-item label="商品名：" class="firInput" prop="goodsName">
          <el-input placeholder="请输入" v-model="queryInfo.goodsName" @keydown.enter.native="query"></el-input>
        </el-form-item>
        <el-form-item label="商品分类：" prop="cateGoryName">
          <el-select v-model="queryInfo.cateGoryName" placeholder="请选择" @keydown.enter.native="query">
            <el-option
              v-for="item in category"
              :key="item.id"
              :label="item.categoryName"
              :value="item.categoryName">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品归属：" prop="goodsClassfication">
          <el-select placeholder="请选择" v-model="queryInfo.goodsClassfication" @keydown.enter.native="query">
            <el-option label="用户商城" value="0"></el-option>
            <el-option label="积分商城" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="anniu">
          <el-button plain type="primary" @click="query">查询</el-button>
          <el-button plain @click="resetQueryForm">重置</el-button>
        </el-form-item>
      </el-form>
      <el-button plain class="addbtn" type="primary" size="large" @click="dialogVisible=true">+ 新建</el-button>
      <div class="tablediv">
        <el-table :data="tableData" style="width: 100%" border height="100%">
          <el-table-column align="center" prop="id" label="商品ID" min-width="120px">
          </el-table-column>
          <el-table-column align="center" prop="goodsName" label="商品名" min-width="200px" show-overflow-tooltip>
          </el-table-column>
          <el-table-column align="center" prop="cateGoryName" label="商品分类" min-width="70px">
          </el-table-column>
          <el-table-column align="center" prop="goodsCover" label="封面图片" v-slot="scope" min-width="60px">
            <template>
              <el-image
                style="width: 27px; height: 27px"
                :src="scope.row.goodsCover"
                :preview-src-list="[scope.row.goodsCover]">
              </el-image>
            </template>
          </el-table-column>
          <el-table-column align="center" label="项目图册" min-width="80px">
            <template v-slot="scope">
              <el-button plain type="success" size="small" @click="showimgs(scope.row.id)">查看</el-button>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="goodsPrice" label="价格(元)/积分" min-width="90px">
          </el-table-column>
          <el-table-column align="center" prop="inventory" label="库存" min-width="70px">
          </el-table-column>
          <el-table-column align="center" prop="goodsClassficationname" label="商品归属" min-width="80px">
          </el-table-column>
          <el-table-column align="center" prop="goodsStatename" label="商品状态" min-width="70px">
          </el-table-column>
          <el-table-column align="center" prop="createTime" label="创建时间" v-slot="scope" min-width="200px">
            <template>
              {{scope.row.createTime | dateFormat}}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="" label="操作" min-width="150px" v-slot="scope" fixed="right">
            <template>
              <el-button plain size="small" type="success" @click="showeditForm(scope.row)">编辑</el-button>
              <el-button plain size="small" type="danger" @click="remove(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
        :hide-on-single-page="true"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        background
        :page-sizes="[5, 7, 10, 20]"
        :page-size="pageSize"
        :page-count="11"
        :current-page="pageNum"
        layout="total, slot, prev, pager, next, sizes, jumper"
        :total="total">
       <span class="slotText">第{{pageNum}}/{{maxPage}}页</span>
      </el-pagination>
    </el-card>
    <el-dialog title="新增商品" @opened="showtooltipadd" :visible.sync="dialogVisible" width="800px" @close="closeaddform">
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
            <el-form-item label="商品价格(元)：" prop="goodsPrice">
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
            class="addgoodscover"
            ref="addimgRef"
            :limit=1
            :http-request="uploadaddimg"
            action=#
            list-type="picture-card"
            :on-change="changeaddcover"
            :on-preview="addimgPreview"
            :before-upload="beforeUpload"
            :on-remove="handleaddcoverRemove">
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
            :before-upload="beforeUpload"
            :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible3" append-to-body>
            <img width="100%" :src="dialogImageUrl">
          </el-dialog>
        </el-form-item>
        <el-row>
          <el-col :span="12">
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
            <el-form-item label="商品详情：" prop="textarea">
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
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="submitaddform" :disabled="zhinenganyici">{{loadingtext}}</el-button>
      </div>
    </el-dialog>
    <el-dialog title="编辑商品" @opened="showtooltipedit" :visible.sync="dialogVisible1" width="800px" @close="closeeditform">
      <el-form label-width="130px" :model="editForm" ref="editFormRef" :rules="editFormRules" label-position="right" :hide-required-asterisk='false'>
        <el-row>
          <el-col :span="10">
            <el-form-item label="商品名称：" prop="goodsName">
              <el-input placeholder="请输入" v-model="editForm.goodsName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="2">
            <el-form-item label="商品分类：" prop="categoryId">
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
            <el-form-item label="商品价格(元)：" prop="goodsPrice">
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
            class="editgoodscover"
            ref="editimgRef"
            :file-list="editimglist"
            :limit=1
            :http-request="uploadeditimg"
            action=#
            list-type="picture-card"
            :on-change="changeeditcover"
            :on-preview="editimgPreview"
            :before-upload="beforeUpload"
            :on-remove="handleeditcoverRemove">
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
            :before-upload="beforeUpload"
            :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible5" append-to-body>
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
        <el-row>
          <el-col :span="12">
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
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible1 = false">取消</el-button>
        <el-button type="primary" @click="submiteditform">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="项目图册" :visible.sync="dialogVisibleimgs" width="800px">
      <div style="background-color:#edeef0">
        <el-row>
          <el-col :span="7" v-for="item in showimgslist" :key="item.id">
              <el-card>
                <el-image
                  style="width: 130px; height: 115px"
                  :src="item.thumbnailPicture"
                  :preview-src-list="[item.thumbnailPicture]">
                </el-image>
              </el-card>
          </el-col>
        </el-row>
      </div>
      <div slot="footer">
        <el-button @click="dialogVisibleimgs=false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { quilltitle } from '../../assets/js/quill-title.js'
export default {
  data () {
    var checknum = (rule, value, cb) => {
      const regbili = /^(([1-9]\d*)|(0))$/
      if (regbili.test(value)) {
        return cb()
      }
      cb(new Error('请输入正确格式的数字！'))
    }
    var checkdoublenum = (rule, value, cb) => {
      const regbili = /^(([1-9]\d*)|(0))([.]\d{0,2})?$/
      if (regbili.test(value)) {
        return cb()
      }
      cb(new Error('请输入正确格式的数字！'))
    }
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
      loadingtext: '确认',
      zhinenganyici: false,
      tableData: [],
      total: 100,
      pageNum: 1,
      pageSize: 7,
      maxPage: 14,
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
          { required: true, message: '请输入商品价格', trigger: 'blur' },
          { validator: checkdoublenum, trigger: 'blur' }
        ],
        inventory: [
          { required: true, message: '请输入商品库存', trigger: 'blur' },
          { validator: checknum, trigger: 'blur' }
        ],
        goodsClassfication: [
          { required: true, message: '请输入商品归属', trigger: 'blur' }
        ],
        goodsState: [
          { required: true, message: '请输入商品状态', trigger: 'blur' }
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
          { required: true, message: '请输入商品价格', trigger: 'blur' },
          { validator: checkdoublenum, trigger: 'blur' }
        ],
        inventory: [
          { required: true, message: '请输入商品库存', trigger: 'blur' },
          { validator: checknum, trigger: 'blur' }
        ],
        goodsClassfication: [
          { required: true, message: '请输入商品归属', trigger: 'blur' }
        ],
        goodsState: [
          { required: true, message: '请输入商品状态', trigger: 'blur' }
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
      this.pageNum = 1
      this.queryInfo.pageNum = this.pageNum
      this.queryInfo.pageSize = this.pageSize
      const msg = await this.$http.get('store/goodsList', { params: this.queryInfo })
      if (msg.status !== 200) {
        this.resetQueryForm()
        return this.$message.error('查询失败！')
      }
      let arr = []
      arr = msg
      for (let i = 0; i < arr.data.rows.length; i++) {
        switch (arr.data.rows[i].goodsClassfication) {
          case '0':
            arr.data.rows[i].goodsClassficationname = '用户商城'
            break
          case '1':
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
    async querypage () {
      this.queryInfo.pageNum = this.pageNum
      this.queryInfo.pageSize = this.pageSize
      const msg = await this.$http.get('store/goodsList', { params: this.queryInfo })
      if (msg.status !== 200) {
        this.resetQueryForm()
        return this.$message.error('查询失败！')
      }
      let arr = []
      arr = msg
      for (let i = 0; i < arr.data.rows.length; i++) {
        switch (arr.data.rows[i].goodsClassfication) {
          case '0':
            arr.data.rows[i].goodsClassficationname = '用户商城'
            break
          case '1':
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
          case '0':
            arr.data.rows[i].goodsClassficationname = '用户商城'
            break
          case '1':
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
        if (arr.data.rows[i].goodsClassfication === '0') {
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
      if (cate.status !== 200) {
        return this.$message.error('获取商品分类失败！')
      }
      this.category = cate.data.data
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
    handleRemove (file, fileList) {},
    uploadaddimg (params) {
    },
    uploadaddimgs (params) {
    },
    changeaddcover (file, fileList) {
      if (this.$refs.addimgRef.uploadFiles[0]) {
        const addbtn = document.querySelector('.addgoodscover .el-upload')
        addbtn.style.display = 'none'
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
    async submitaddform () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const formData = new FormData()
        if (!this.$refs.addimgRef.uploadFiles[0] || !this.$refs.addimgsRef.uploadFiles[0]) {
          return this.$message.error('请添加图片之后再提交！')
        }
        var addimg = this.$refs.addimgRef.uploadFiles[0].raw
        formData.append('multipartFileile', addimg)
        for (var i = 0; i < this.$refs.addimgsRef.uploadFiles.length; i++) {
          formData.append('file', this.$refs.addimgsRef.uploadFiles[i].raw)
        }
        this.addForm.goodsPrice *= 100
        this.zhinenganyici = true
        this.loadingtext = '提交中...'
        this.addForm.goodsDescription = this.content
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
      this.loadingtext = '确认'
      const editbtn = document.querySelector('.addgoodscover .el-upload')
      editbtn.style.display = 'inline-block'
      this.$refs.addFormRef.resetFields()
      this.$refs.addimgRef.clearFiles()
      this.$refs.addimgsRef.clearFiles()
      this.content = ''
    },
    async showeditForm (user) {
      this.dialogVisible1 = true
      const msg = await this.$http.get('picture/pictureListNotPage', { params: { goodsId: user.id } })
      if (msg.status !== 200) {
        this.$message.error('获取图册失败！')
      }
      this.showimgslist = msg.data.data
      this.editForm = user
      this.editimglist.push({ url: user.goodsCover })
      for (let i = 0; i < this.showimgslist.length; i++) {
        this.editimgslist.push({ url: this.showimgslist[i].thumbnailPicture })
      }
      this.content = this.editForm.goodsDescription
    },
    uploadeditimg (params) {
    },
    uploadeditimgs (params) {
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
    changeeditcover (file, fileList) {
      if (this.$refs.editimgRef.uploadFiles[0]) {
        const editbtn = document.querySelector('.editgoodscover .el-upload')
        editbtn.style.display = 'none'
      }
    },
    async submiteditform () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const formData = new FormData()
        var editimg = ''
        if (!this.$refs.editimgRef.uploadFiles[0].raw) {
          editimg = this.$refs.editimgRef.uploadFiles[0].url
        } else {
          editimg = this.$refs.editimgRef.uploadFiles[0].raw
        }
        if (this.editForm.goodsClassfication === '0') {
          this.editForm.goodsPrice = (this.editForm.goodsPrice * 100).toFixed(0)
        }
        formData.append('multipartFileile', editimg)
        for (let j = 0; j < this.$refs.editimgsRef.uploadFiles.length; j++) {
          if (!this.$refs.editimgsRef.uploadFiles[j].raw) {
            formData.append('imgs', this.$refs.editimgsRef.uploadFiles[j].url)
          } else {
            formData.append('file', this.$refs.editimgsRef.uploadFiles[j].raw)
          }
        }
        this.editForm.goodsDescription = this.content
        const msg = await this.$http.post('store/updateGoods', formData, { params: this.editForm })
        if (msg.status !== 200) {
          this.dialogVisible1 = false
          return this.$message.error('编辑商品信息失败！')
        }
        this.getgoodList()
        this.$message.success('编辑商品信息成功！')
        this.dialogVisible1 = false
      })
    },
    closeeditform () {
      this.editForm = {}
      this.editimglist = []
      this.editimgslist = []
      this.showimgslist = []
      this.content = ''
      this.$refs.editimgRef.clearFiles()
      this.$refs.editimgsRef.clearFiles()
      this.getgoodList()
    },
    handleaddcoverRemove (file, fileList) {
      if (!this.$refs.addimgRef.uploadFiles[0]) {
        const addbtn = document.querySelector('.addgoodscover .el-upload')
        addbtn.style.display = 'inline-block'
      }
    },
    handleeditcoverRemove (file, fileList) {
      if (!this.$refs.editimgRef.uploadFiles[0]) {
        const addbtn = document.querySelector('.editgoodscover .el-upload')
        addbtn.style.display = 'inline-block'
      }
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
      if (msg.status !== 200) {
        return this.$message.error('获取图册失败！')
      }
      this.showimgslist = msg.data.data
    },
    onEditorBlur (e) {},
    onEditorFocus (e) {},
    onEditorReady (e) {},
    handleSizeChange (newSize) {
      this.pageSize = newSize
      if (!this.queryInfo.goodsName && !this.queryInfo.cateGoryName && !this.queryInfo.goodsClassfication) {
        return this.getgoodList()
      }
      this.querypage()
    },
    handleCurrentChange (newPage) {
      this.pageNum = newPage
      if (!this.queryInfo.goodsName && !this.queryInfo.cateGoryName && !this.queryInfo.goodsClassfication) {
        return this.getgoodList()
      }
      this.querypage()
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
.tablediv {
  @media only screen and (min-width: 1494px) {
    height:465px;
  }
  @media only screen and (max-width: 1494px) {
    height:405px;
  }
}
.main {
  height:675px;
}
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
