<template>
  <div class="m-bg01">
    <h1 class="m-logo01 o-mt40 o-center">
      <h2>图书馆注册</h2>
    </h1>
    <main id="main" class="o-mt40 o-mb40">
      <div class="m-col-one01">
        <div class="col-one01__body">
          <div class="m-radius-box01 type02">
            <div class="radius-box01__title01">
              <h1 class="buttom-line" style="color:#f11;">注册</h1>
            </div>
            <p class="o-mt30">请填写注册所需信息</p>
            <form>
              <div class="m-form01 o-mt6">
                <p class="form01__caption-outside01">*为必填项目</p>
                <div class="form01__item">
                  <div class="form01__area01">
                    <div class="form01__txt01">
                      用户名
                      <span class="form01__alert-txt01">*</span>
                    </div>
                  </div>
                  <div class="form01__area02">
                    <input type="text" class="m-input01">
                    <p class="form01__txt02">请输入用户名</p>
                  </div>
                </div>
                <div class="form01__item form01__pair01">
                  <div class="form01__area01">
                    <div class="form01__txt01">
                      密码
                      <span class="form01__alert-txt01">*</span>
                    </div>
                  </div>
                  <div class="form01__area02">
                    <input type="text" class="m-input01">
                    <p class="form01__txt02">请输入密码</p>
                  </div>
                </div>
                <div class="form01__item">
                  <div class="form01__area01">
                    <div class="form01__txt01">
                      确认密码
                      <span class="form01__alert-txt01">*</span>
                    </div>
                  </div>
                  <div class="form01__area02">
                    <input type="text" class="m-input01">
                    <p class="form01__txt02">请确认密码</p>
                  </div>
                </div>
                <div class="form01__item">
                  <div class="form01__area01">
                    <div class="form01__txt01">
                      密保问题
                      <span class="form01__alert-txt01">*</span>
                    </div>
                  </div>
                  <div class="form01__area02">
                    <select class="m-input01">
                      <option value="volvo">Volvo</option>
                      <option value="saab">Saab</option>
                      <option value="opel">Opel</option>
                      <option value="audi">Audi</option>
                    </select>
                    <p class="form01__txt02">请选择密保问题</p>
                  </div>
                </div>
                <div class="form01__item">
                  <div class="form01__area01">
                    <div class="form01__txt01">
                      密保答案
                      <span class="form01__alert-txt01">*</span>
                    </div>
                  </div>
                  <div class="form01__area02">
                    <input type="text" class="m-input01">
                    <p class="form01__txt02">请输入密保答案</p>
                  </div>
                </div>
                <div class="form01__item">
                  <div class="form01__area01">
                    <div class="form01__txt01">
                      性别
                      <span class="form01__alert-txt01">*</span>
                    </div>
                  </div>
                  <div class="form01__area02">
                    <ul>
                      <li class="radio-set02__item_01">
                        <input type="radio" class="radio-set02__input01 _vdtRadio" v-model.number="sex" value="0">男
                      </li>
                      <li class="radio-set02__item_01">
                        <input type="radio" class="radio-set02__input01 _vdtRadio" v-model.number="sex" value="1">女
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="o-center o-mt40">
                <button class="m-btn-confirm01 o-replacement _vdtSubmit">提交注册</button>
              </div>
            </form>
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
      sex: 0
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
.m-bg01 {
  background: #fafafa;
  position: relative;
  line-height: 1.5;
  color: gray;
  font-size: 12px;
  height: 100%;
  min-height: 100%;
}

.m-logo01 {
  height: 40px;
}
.o-center {
  text-align: center;
}
.o-mt40 {
  margin-top: 40px !important;
}

#main {
  position: inherit;
  z-index: 1;
}
.o-mb40 {
  margin-bottom: 40px !important;
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

.m-radius-box01.type02 {
  padding-left: 99px;
  padding-right: 99px;
}
.m-radius-box01.type02 {
  padding-left: 99px;
  padding-right: 99px;
}
.m-radius-box01 {
  padding: 36px 160px 40px;
  border: 1px solid #e6e6e6;
  border-radius: 11px;
  background: #ffffff;
  box-shadow: 0 0 1px rgba(0, 0, 0, 0.05);
}
.m-radius-box01 {
  padding: 36px 160px 40px;
  border: 1px solid #e6e6e6;
  border-radius: 11px;
  background: #ffffff;
  box-shadow: 0 0 1px rgba(0, 0, 0, 0.05);
}
.radius-box01__title01 {
  height: 37px;
}
.radius-box01__title01 {
  height: 37px;
}
.o-mt30 {
  margin-top: 30px !important;
}

.buttom-line {
  border-bottom: #f11 2px solid;
  width: 200px;
}
.o-mt6 {
  margin-top: 6px !important;
}

.form01__caption-outside01 {
  text-align: right;
  color: #f11;
  padding-bottom: 2px;
}
.form01__item:first-child,
.form01__caption-outside01 + .form01__item {
  border-top: 1px solid #e1e1e1;
}
.form01__item {
  position: relative;
  border-bottom: 1px solid #e6e6e6;
}
.form01__area01 {
  background: #f7f7f7;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 170px;
  padding: 25px 30px;
}
.form01__txt01 {
  min-height: 1.5em;
  font-size: 14px;
  color: #404040;
  word-break: break-word;
  word-wrap: break-word;
}
.form01__area01 .form01__alert-txt01 {
  margin-left: 3px;
}
.form01__alert-txt01 {
  color: #f11;
  font-size: 12px;
}
.form01__area02 {
  margin-left: 230px;
  padding: 25px 30px;
  position: relative;
  top: 0;
  color: #404040;
}

input[type="text"],
input[type="email"],
input[type="number"] {
  font-size: 12px;
}
.m-input01 {
  width: 285px;
  color: #404040;
  height: 30px;
  line-height: 30px;
  padding: 0 10px;
  border-top: 1px solid #9a9a9a;
  border-left: 1px solid #9a9a9a;
  border-right: 1px solid #d8d8d8;
  border-bottom: 1px solid #d8d8d8;
  background: #f7f7f7;
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

.form01__txt02 {
  margin-top: 7px;
  color: #f11;
}
.form01__pair01 {
  border-bottom: none;
}
.o-center {
  text-align: center;
}
.o-mt40 {
  margin-top: 40px !important;
}
.m-btn-confirm01 {
  overflow: hidden;
  display: inline-block;
  vertical-align: middle;
  *vertical-align: auto;
  *zoom: 1;
  *display: inline;
  cursor: pointer;
  color: #ffffff;
  background-color: #ff7f50;
  // background-image: url(//secure-images.comico.jp/r02/spbtn-scc408e891c.png);
  width: 155px;
  height: 50px;
  font-size: 24px;
  // background-position: 0 -1163px;
}
.o-replacement {
  // font: 0/0 a;
  // text-shadow: none;
  padding: 0;
  border: none;
  overflow: hidden;
}
.radio-set02__item_01 {
  float: left;
  margin-right: 30px;
}
.radio-set02__input01 {
  margin-right: 5px;
}
.o-clear:after {
  display: block;
  visibility: hidden;
  clear: both;
  height: 0;
  content: ".";
}
</style>