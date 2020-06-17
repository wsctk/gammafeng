<template>
    <div class="login_container" min-height="1000px">
        <div class="login_head">
          <img src="../assets/tx.jpg" />
        </div>
        <p class="headText">伽玛蜂小程序管理后台</p>
        <div class="login_box">
          <el-tabs v-model="activeName" stretch>
            <el-tab-pane label="帐号密码登录" name="zhanghaomimadengluTab">
              <el-form :model="loginMessage" :rules="loginFormRules" ref="loginFormRef1">
                <el-form-item prop="userName">
                  <el-input v-model="loginMessage.userName" placeholder="账户" prefix-icon="el-icon-user"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                  <el-input :show-password=true v-model="loginMessage.password" placeholder="密码" prefix-icon="el-icon-lock"></el-input>
                </el-form-item>
                <el-form-item prop="imgCode" class="lastFormItem">
                  <el-row>
                    <el-col :span="15">
                      <el-input v-model="loginMessage.imgCode" placeholder="验证码" prefix-icon="el-icon-message"></el-input>
                    </el-col>
                    <el-col :span="7" class="btndiv">
                      <el-button class="yanzhengma" :click="uploadimgcode">
                        <img style="width:100px;height:40px" :src="img" />
                      </el-button>
                    </el-col>
                  </el-row>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="手机号登录" name="shoujihaodengluTab">
              <el-form :model="loginMessage" :rules="loginFormRules" ref="loginFormRef2">
                <el-form-item prop="phoneNumber">
                  <el-input v-model="loginMessage.phoneNumber" placeholder="手机号" prefix-icon="el-icon-phone"></el-input>
                </el-form-item>
                <el-form-item prop="code" class="lastFormItem">
                  <el-row>
                    <el-col :span="15">
                      <el-input v-model="loginMessage.code" placeholder="验证码" prefix-icon="el-icon-message"></el-input>
                    </el-col>
                    <el-col :span="7">
                      <el-button size="large" @click="getCode">获取验证码</el-button>
                    </el-col>
                  </el-row>
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
          <el-row class="xuanxiangrow">
            <el-col :span="5">
              <el-checkbox v-model="checked">自动登录</el-checkbox>
            </el-col>
            <el-col :span="14">
              <div class="zhanwei">123</div>
            </el-col>
            <el-col :span="5">
              <el-link type="primary" :underline="false">忘记密码</el-link>
            </el-col>
          </el-row>
          <el-button type="primary" size="small" class="dlbtn" @click="login">登录</el-button>
          <el-footer height="80px">
          <div class="foot">
            <el-link type="info">帮助</el-link>
            <el-link type="info">隐私</el-link>
            <el-link type="info">条款</el-link>
          </div>
          <p class="pText">copyright&copy;2020 壹零(天津)信息技术有限公司</p>
         </el-footer>
        </div>
    </div>
</template>

<script>
export default {
  data () {
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的手机号码'))
    }
    return {
      img: '',
      activeName: 'zhanghaomimadengluTab',
      loginMessage: {
        userName: '',
        phoneNumber: '',
        password: '',
        code: '',
        imgCode: '',
        imgcodekey: ''
      },
      checked: false,
      loginFormRules: {
        userName: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 7 个字符', trigger: 'blur' }
        ],
        phoneNumber: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ],
        imgCode: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getimgcode()
  },
  mounted () {
    this.autoLogin()
  },
  methods: {
    resetLoginForm () {
      this.$refs.loginFormRef.resetFields()
    },
    async getimgcode () {
      const msg = await this.$http.get('code/getImgCode')
      console.log(msg)
      this.img = msg.data.data
      this.loginMessage.imgcodekey = msg.data.imgCodeKey
    },
    uploadimgcode () {
      this.getimgcode()
    },
    // this.img = msg.data
    // const zm = this.utf8ToUtf16(msg.data)
    // console.log(zm)
    // this.img = this.convertBase64UrlToFile(msg.data)
    // console.log(this.img)
    // },
    // utf8ToUtf16 (utf8Arr) {
    //   var utf16Str = ''
    //   for (var i = 0; i < utf8Arr.length; i++) {
    //     // 每个字节都转换为2进制字符串进行判断
    //     var one = utf8Arr[i].toString(2)
    //     // 正则表达式判断该字节是否符合>=2个1和1个0的情况
    //     var v = one.match(/^1+?(?=0)/)
    //     // 多个字节编码
    //     if (v && one.length === 8) {
    //       // 获取该编码是多少个字节长度
    //       var bytesLength = v[0].length
    //       // 首个字节中的数据,因为首字节有效数据长度为8位减去1个0位，再减去bytesLength位的剩余位数
    //       var store = utf8Arr[i].toString(2).slice(7 - bytesLength)
    //       for (var st = 1; st < bytesLength; st++) {
    //         // 后面剩余字节中的数据，因为后面字节都是10xxxxxxx，所以slice中的2指的是去除10
    //         store += utf8Arr[st + i].toString(2).slice(2)
    //       }
    //       // 转换为Unicode码值
    //       utf16Str += String.fromCharCode(parseInt(store, 2))
    //       // 调整剩余字节数
    //       i += bytesLength - 1
    //     } else {
    //       // 单个字节编码，和Unicode码值一致，直接将该字节转换为UTF-16
    //       utf16Str += String.fromCharCode(utf8Arr[i])
    //     }
    //   }
    //   return utf16Str
    // },
    // convertBase64UrlToFile (base64) {
    //   const bytes = this.$base64.decode(base64)
    // console.log(bytes)
    // const ab = new ArrayBuffer(bytes.length)
    // const ia = new Uint8Array(ab)
    // for (let i = 0; i < bytes.length; i++) {
    //   ia[i] = bytes.charCodeAt(i)
    // }
    // return new Blob([ab], { type: 'image/png' })
    // },
    async autoLogin () {
      const pn = window.sessionStorage.getItem('zhanghao')
      const mm = window.sessionStorage.getItem('mima')
      if (pn === null || mm === null) {
        return ''
      } else {
        const msg = await this.$http.post('SMSLogin',
          {
            userName: pn,
            password: mm
          })
        if (msg === 'success') {
          return this.$message.success('登录成功')
        } else {
          this.$message.error('登录状态失效，请尝试重新登录！')
        }
      }
    },
    async login () {
      if (this.activeName === 'zhanghaomimadengluTab') {
        this.$refs.loginFormRef1.validate(async valid => {
          if (!valid) return
          this.$cookie.set('test', 'Hello world!', 1)
          const msg = await this.$http.post('adminLogin',
            this.$qs.stringify({
              userName: this.loginMessage.userName,
              password: this.loginMessage.password,
              key: this.loginMessage.imgcodekey,
              code: this.loginMessage.imgCode
            }))
          console.log(msg)
          if (msg.data.message === 'success') {
            if (this.checked === true) {
              window.sessionStorage.setItem('zhanghao', this.loginMessage.userName)
              window.sessionStorage.setItem('mima', this.loginMessage.password)
            }
            this.$message.success('登录成功')
            this.$router.push('/home')
          } else {
            this.$message.error('登录失败')
          }
        })
      } else {
        this.$refs.loginFormRef2.validate(async valid => {
          if (!valid) return
          const msg = await this.$http.post('SMSLogin',
            this.$qs.stringify({
              phoneNumber: this.loginMessage.phoneNumber,
              code: this.loginMessage.code
            }))
          // console.log(msg.data)
          if (msg.data === 'success') {
            this.$message.success('登录成功')
            this.$router.push('/home')
          } else {
            this.$message.error('登录失败')
          }
        })
      }
    },
    async getCode () {
      const msg = await this.$http.post('sendSMS',
        this.$qs.stringify({
          phoneNumber: this.loginMessage.phoneNumber
        }))
      if (msg === 'success') {
        this.$message.success('登录成功')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.login_container{
  background-image: url(../assets/bj.jpg);
  background-size: 100% 100%;
  height:100%;
}
.login_head{
    background-color:#fff;
    width:117px;
    height:116px;
    border-radius:3px;
    position:absolute;
    left:50%;
    top:25%;
    transform:translate(-50%,-50%);
}
img{
    width:117px;
    height:116px;
    background-color:#fff;
}
.headText{
  position:absolute;
  left:50%;
  top:35%;
  transform:translate(-50%,-50%);
  font-size: 24px;
  font-weight: 600;
  text-align:center;
}
.login_box{
  position:absolute;
  left:50%;
  top:53%;
  transform:translate(-50%,-50%);
  height:200px;
  width:368px;
}
/deep/.el-tabs__item {
  font-size:16px;
  font-weight: 400;
  font-style: normal;
  color: rgba(0, 0, 0, 0.647058823529412);
}
.lastFormItem {
  margin-bottom: 10px;
}
.xuanxiangrow {
  margin:10px 0;
}
.el-button {
  border-radius: 5px;
  margin-left: 14px;
  font-weight: 400;
  font-style: normal;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.647058823529412);
  margin-top:10px;
}
.btndiv {
  height: 40px;
  margin-top: 10px;
  margin-left: 20px;
}
.yanzhengma {
  border-radius: 5px;
  padding: 0;
  width:100px;
  height:40px;
  margin: 0;
  overflow:hidden;
}
/deep/.el-input__inner {
  border-radius: 5px;
}
/deep/.el-input {
  margin-top: 10px;
}
/deep/.el-link {
  margin-left:20px;
}
.zhanwei{
  opacity: 0;
}
.dlbtn {
  width:368px;
  margin: 0;
}
.el-footer{
  position:absolute;
  left:50%;
  top:220%;
  transform:translate(-50%,-50%);
  display:flex;
  flex-direction: column;
  align-items:center;
  width:400px;
  padding:10px 20px;
}
.foot {
  display:flex;
  justify-content: space-between;
  width:160px;
  margin-bottom:10px;
}
.pText {
  font-size: 14px;
  color: #777;
}
</style>
