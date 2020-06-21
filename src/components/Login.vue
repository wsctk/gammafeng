<template>
    <div class="login_container" min-height="1000px">
        <div class="login_head">
          <img src="../assets/tx.jpg" />
        </div>
        <p class="headText">伽玛蜂小程序管理后台</p>
        <div class="login_box">
          <el-tabs v-model="activeName" stretch>
            <el-tab-pane label="帐号密码登录" name="zhanghaomimadengluTab">
              <el-form :model="loginMessage" :rules="loginFormRules" ref="loginFormRef1" hide-required-asterisk>
                <el-form-item prop="userName">
                  <el-input clearable v-model="loginMessage.userName" placeholder="账户" prefix-icon="el-icon-user"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                  <el-input :show-password=true v-model="loginMessage.password" placeholder="密码" prefix-icon="el-icon-lock"></el-input>
                </el-form-item>
                <el-form-item prop="imgCode" class="lastFormItem">
                  <el-row>
                    <el-col :span="15">
                      <el-input clearable v-model="loginMessage.imgCode" placeholder="验证码" prefix-icon="el-icon-message"  @keydown.enter.native="login"></el-input>
                    </el-col>
                    <el-col :span="7" class="btndiv">
                      <el-button class="yanzhengma" @click="uploadimgcode">
                        <img style="width:100px;height:40px" :src="img" />
                      </el-button>
                    </el-col>
                  </el-row>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="手机号登录" name="shoujihaodengluTab">
              <el-form :model="loginMessage" :rules="loginFormRules" ref="loginFormRef2" hide-required-asterisk>
                <el-form-item prop="phoneNumber">
                  <el-input clearable v-model="loginMessage.phoneNumber" placeholder="手机号" prefix-icon="el-icon-phone"></el-input>
                </el-form-item>
                <el-form-item prop="code" class="lastFormItem">
                  <el-row>
                    <el-col :span="15">
                      <el-input clearable v-model="loginMessage.code" placeholder="验证码" prefix-icon="el-icon-message"></el-input>
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
              <el-checkbox v-model="rememberphonenumber">自动登录</el-checkbox>
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
      rememberphonenumber: false,
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
    async autoLogin () {
      const check = localStorage.getItem('checked')
      if (check === 'true') {
        this.checked = true
      }
    },
    async getimgcode () {
      const msg = await this.$http.get('code/getImgCode')
      this.img = msg.data.data
      this.loginMessage.imgcodekey = msg.data.imgCodeKey
    },
    uploadimgcode () {
      this.getimgcode()
    },
    async getCode () {
      const msg = await this.$http.post('sendSMS',
        this.$qs.stringify({
          phoneNumber: this.loginMessage.phoneNumber
        }))
      if (msg !== 'success') {
        return this.$message.error('获取验证码失败！')
      }
      this.$message.success('验证码发送成功！')
    },
    async login () {
      if (this.activeName === 'zhanghaomimadengluTab') {
        this.$refs.loginFormRef1.validate(async valid => {
          if (!valid) return
          const msg = await this.$http.post('adminLogin',
            this.$qs.stringify({
              userName: this.loginMessage.userName,
              password: this.loginMessage.password,
              key: this.loginMessage.imgcodekey,
              code: this.loginMessage.imgCode,
              rememberMe: this.checked
            }))
          if (msg.data.message === 'success') {
            localStorage.setItem('checked', this.checked)
            window.sessionStorage.setItem('login', 1)
            this.$message.success('登录成功')
            this.$router.push('/home')
          } else {
            this.$message.error('登录失败')
            this.getimgcode()
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
          console.log(msg)
          if (msg.status === 200) {
            window.sessionStorage.setItem('login', 1)
            this.$message.success('登录成功')
            this.$router.push('/home')
          } else {
            this.$message.error('登录失败')
          }
        })
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
