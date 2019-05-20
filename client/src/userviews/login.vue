<template>
  <div class="body">
    <div class="m-header02">
      <nav class="header02__area01">
        <ul class="header02__area02">
          <li class="header02__item01">
            <a class="header02__lnk01">首页</a>
          </li>
        </ul>
      </nav>
    </div>
    <h1 class="m-logo02 o-mt79 o-center">
      <h1 style="color:#FF7F50">登陆</h1>
    </h1>
    <main id="main" class="o-mt81">
      <div class="m-col-one01">
        <div class="col-one01__body">
          <div class="m-login-sec01 w910px o-clear">
            <form>
              <div class="m-mail-login01 login-top o-clear">
                <div class="mail-login01__area01">
                  <div class="mail-login01__item01">
                    <input type="text" class="m-input06 font16px" placeholder="请输入用户名">
                  </div>
                  <div class="mail-login01__item01">
                    <input type="password" class="m-input06 font16px" placeholder="请输入密码">
                  </div>
                  <p class="form01__alert-txt01">用户名或密码错误</p>
                </div>
                <p class="mail-login01__input02">
                  <button class="m-btn-login01 _vdtSubmit">登陆</button>
                </p>
              </div>
            </form>
          </div>
          <div class="m-sns-login01 login-top">
            <h2 class="sns-login01__title01">使用外部帐户登录(别想了现在没有)</h2>
            <ul class="sns-login01__area01">
              <li class="sns-login01__item01">
                <a class="m-btn-facebook01 o-replacement"></a>
              </li>
              <li class="sns-login01__item02">
                <a class="m-btn-twitter01 o-replacement"></a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
<script>
export default {
  data() {
    var validateCheckPass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (this.ruleForm.checkpassword !== this.ruleForm.password) {
        callback(new Error("两次密码不一致"));
      } else {
        if (this.ruleForm.checkpassword !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };

    var validateAnswer = (rule, value, callback) => {
      if (value === "" && this.mode === "signup") {
        callback(new Error("请输入答案"));
      } else {
        callback();
      }
    };
    return {
      questionList: [],
      mode: "login",
      activeName2: "first",
      ruleForm: {
        username: "",
        question: 0,
        answer: "",
        password: "",
        checkpassword: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        answer: [
          { required: true, validator: validateAnswer, trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        checkpassword: [
          { required: true, validator: validateCheckPass, trigger: "blur" }
        ]
      }
    };
  },
  activated() {
    this.initData();
  },
  computed: {
    title() {
      switch (this.mode) {
        case "login":
          return "登录";
        case "signup":
          return "注册";
      }
    }
  },
  methods: {
    async initData() {
      this.loading = true;
      let question = await this.$fetch("user/question");
      this.questionList = question.data;
      this.loading = false;
    },
    handleClick(tab, event) {
      if (tab.index === "0") {
        this.mode = "login";
      } else {
        this.mode = "signup";
      }
      console.log(this.mode);
    },
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.operation();
          //   alert("sumit");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    async operation() {
      await this[this.mode]();
    },
    async login() {
      const data = await this.$fetch("user/login", {
        method: "POST",
        body: JSON.stringify({
          username: this.ruleForm.username,
          password: this.ruleForm.password
        })
      });
      console.log(data);
      if (data.err) {
        this.$message({
          showClose: true,
          message: data.msg,
          type: "error"
        });
      } else {
        this.$message({
          showClose: true,
          message: "登录成功",
          type: "success"
        });
        this.$state.user = data;
        localStorage.setItem("user", JSON.stringify(data));
        if (this.$route.params.wantedRoute) {
          this.$router.replace(this.$route.params.wantedRoute);
        } else {
          this.$router.replace("/");
        }
      }
    },
    async signup() {
      let data = await this.$fetch("user/signup", {
        method: "POST",
        body: JSON.stringify({
          username: this.ruleForm.username,
          password: this.ruleForm.password,
          question: this.ruleForm.question,
          answer: this.ruleForm.answer
        })
      });
      if (data.err) {
        this.$message({
          showClose: true,
          message: data.msg,
          type: "error"
        });
      } else {
        console.log("回调信息", data);
        this.$message({
          showClose: true,
          message: "注册账号成功",
          type: "success"
        });
        this.resetForm("ruleForm");
        this.activeName2 = "first";
        this.mode = "login";
      }
    },
    resetForm(formName) {
      this.$nextTick(() => {
        this.$refs[formName].resetFields();
      });
    },
    forgetPassword() {
      this.$router.push({ path: "/home/forgetPassword" });
    }
  }
};
</script>
<style lang="less">
.m-header02 {
  width: 960px;
  position: relative;
  margin: 27px auto 0;
  text-align: right;
  letter-spacing: -0.4em;
}
.header02__area02 .header02__item01:first-child {
  margin: 0;
  border: none;
}
.header02__item01 {
  display: inline;
  position: relative;
  letter-spacing: normal;
  margin-left: 15px;
  padding-left: 15px;
}
.header02__area02 .header02__item01:first-child {
  margin: 0;
  border: none;
}
.header02__item01 {
  display: inline;
  position: relative;
  letter-spacing: normal;
  margin-left: 15px;
  padding-left: 15px;
}
a:visited {
  text-decoration: none;
}
.header02__lnk01 {
  color: #404040;
}
a {
  margin: 0;
  padding: 0;
  font-size: 100%;
  vertical-align: baseline;
  background: transparent;
  color: #2569ce;
  text-decoration: none;
  &:hover {
    cursor: pointer;
  }
}
.body {
  position: relative;
  line-height: 1.5;
  color: gray;
  font-size: 12px;
}
.m-logo02 {
  height: 63px;
}
.o-center {
  text-align: center;
}
.o-mt79 {
  margin-top: 79px !important;
}
#main {
  position: inherit;
  z-index: 1;
}
.o-mt81 {
  margin-top: 81px !important;
}
.m-col-one01 {
  width: 100%;
  min-width: 960px;
}
.col-one01__body {
  position: relative;
  width: 960px;
  margin: 0 auto;
}
.m-login-sec01.w910px {
  width: 910px;
}

.m-login-sec01 {
  margin: 0 auto;
}
.m-mail-login01.login-top {
  width: 432px;
  padding-right: 23px;
  float: left;
  border-right: 1px solid #e4e4e4;
}
.m-mail-login01 {
  position: relative;
}
.m-mail-login01.login-top
  .mail-login01__area01
  .mail-login01__item01:first-child {
  margin-top: 0;
}
.m-input06.font16px {
  font-size: 16px;
}
input[type="text"],
input[type="email"],
input[type="number"] {
  font-size: 12px;
}
.m-input06 {
  width: 430px;
  padding: 11px 0 11px 18px;
  border-top: 1px solid #c6c6c6;
  border-left: 1px solid #c6c6c6;
  border-bottom: 1px solid #eee;
  border-right: 1px solid #eee;
  color: #404040;
  background: #f7f7f7;
  -webkit-appearance: none;
  box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.1) inset;
}
input,
select {
  vertical-align: middle;
  margin: 0;
}
input,
select,
textarea {
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  font-size: 100%;
  font-family: inherit;
}
.m-mail-login01.login-top .mail-login01__area01 .mail-login01__item01 {
  margin-top: 10px;
}
.form01__alert-txt01 {
  color: #f11;
  font-size: 12px;
}
.m-mail-login01.login-top .mail-login01__input02 {
  float: right;
  margin-top: 10px;
}
.m-btn-login01 {
  background: none;
  overflow: hidden;
  display: inline-block;
  vertical-align: middle;
  *vertical-align: auto;
  *zoom: 1;
  *display: inline;
  cursor: pointer;
  background-color: transparent;
  width: 177px;
  height: 55px;
  background-position: 0 -2941px;
  font-size: 24px;
  border: #404040 1px solid;
  box-shadow: 1px 1px 5px #888888;
}
.m-sns-login01.login-top {
  width: 430px;
  float: left;
  display: inline;
  padding-left: 24px;
}
.sns-login01__title01 {
  font-size: 14px;
  color: #404040;
  font-weight: normal;
}
.m-sns-login01.login-top .sns-login01__area01 {
  margin-top: 13px;
}
.sns-login01__area01 {
  min-height: 59px;
  margin: 17px 0 0 -4px;
  position: relative;
}
.sns-login01__item01 {
  left: 0;
  top: 0;
}
.sns-login01__item01,
.sns-login01__item02 {
  position: absolute;
}
a:visited {
  text-decoration: none;
}
.m-btn-facebook01 {
  background: none;
  overflow: hidden;
  display: inline-block;
  vertical-align: middle;
  *vertical-align: auto;
  *zoom: 1;
  *display: inline;
  cursor: pointer;
  background-color: transparent;
  background-image: url(//secure-images.comico.jp/r02/spbtn-scc408e891c.png);
  width: 215px;
  height: 55px;
  background-position: 0 -2226px;
}
.o-replacement {
  font: 0/0 a;
  text-shadow: none;
  color: transparent;
  padding: 0;
  border: none;
  overflow: hidden;
}
.m-sns-login01.login-top .sns-login01__item02 {
  left: 220px;
  top: 0;
}

.sns-login01__item01,
.sns-login01__item02 {
  position: absolute;
}
.m-btn-twitter01 {
  background: none;
  overflow: hidden;
  display: inline-block;
  vertical-align: middle;
  *vertical-align: auto;
  *zoom: 1;
  *display: inline;
  cursor: pointer;
  background-color: transparent;
  background-image: url(//secure-images.comico.jp/r02/spbtn-scc408e891c.png);
  width: 219px;
  height: 59px;
  background-position: 0 -4256px;
}
</style>