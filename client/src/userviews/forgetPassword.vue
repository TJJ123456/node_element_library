<template>
  <div>
    <el-row style="margin-top: 20px;">
      <el-col :span="14" :offset="4">
        <header class="form_header">重设密码</header>
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="110px"
          class="form food_form"
        >
          <el-form-item v-if="mode==='checkusername'" label="用户名" prop="username">
            <el-input v-model="ruleForm.username" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item v-if="mode==='checkquestion'" label="密保问题">
            <el-select v-model.number="ruleForm.question" placeholder="请选择问题">
              <el-option
                v-for="(item, index) in questionList"
                :key="index"
                :label="item"
                :value="index"
              >{{item}}</el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="mode==='checkquestion'" label="答案" prop="answer">
            <el-input v-model="ruleForm.answer"></el-input>
          </el-form-item>
          <el-form-item v-if="mode==='resetpassword'" label="新密码" prop="password">
            <el-input type="password" v-model="ruleForm.password"></el-input>
          </el-form-item>
          <el-form-item v-if="mode==='resetpassword'" label="确认新密码" prop="checkpassword">
            <el-input type="password" v-model="ruleForm.checkpassword"></el-input>
          </el-form-item>
          <el-form-item>
            <el-row type="flex" justify="center">
              <el-button type="primary" @click="onSubmit('ruleForm')">{{title}}</el-button>
            </el-row>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  data() {
    var validateCheckPass = (rule, value, callback) => {
      console.log("1111");
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
      mode: "checkusername",
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
        case "checkusername":
          return "下一步";
        case "checkquestion":
          return "下一步";
        case "resetpassword":
          return "设置新密码";
      }
      // return "重设密码";
    }
  },
  methods: {
    async initData() {
      this.loading = true;
      let question = await this.$fetch("user/question");
      this.questionList = question.data;
      this.loading = false;
    },
    onSubmit(formName) {
      if (this.mode === "resetpassword") {
        if (this.ruleForm.password === "") {
          this.$message({
            showClose: true,
            message: '请输入密码',
            type: "error"
          });
          return;
        } else if (this.ruleForm.checkpassword !== this.ruleForm.password) {
          this.$message({
            showClose: true,
            message: '两次密码不一致',
            type: "error"
          });
          return;
        }
      }
      this.$refs[formName].validate(valid => {
        console.log(valid);
        if (valid) {
          this.operation();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    async operation() {
      await this[this.mode]();
    },
    async checkusername() {
      const data = await this.$fetch("user/checkusername", {
        method: "POST",
        body: JSON.stringify({
          username: this.ruleForm.username
        })
      });
      if (data.err) {
        this.$message({
          showClose: true,
          message: data.msg,
          type: "error"
        });
      } else {
        this.mode = "checkquestion";
      }
    },
    async checkquestion() {
      let data = await this.$fetch("user/checkquestion", {
        method: "POST",
        body: JSON.stringify({
          username: this.ruleForm.username,
          // password: this.ruleForm.password,
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
        this.mode = "resetpassword";
      }
    },
    async resetpassword() {
      let data = await this.$fetch("user/resetpassword", {
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
        await this.$refs["ruleForm"].resetFields();
        // this.mode = "resetpassword";
        this.$router.push({ path: "/home/login" });
      }
    },
    resetForm(formName) {
      this.$nextTick(() => {
        this.$refs[formName].resetFields();
      });
    }
  }
};
</script>
<style lang="less">
@import "../style/mixin";
.form {
  min-width: 400px;
  margin-bottom: 30px;
  &:hover {
    box-shadow: 0 0 8px 0 rgba(232, 237, 250, 0.6),
      0 2px 4px 0 rgba(232, 237, 250, 0.5);
    border-radius: 6px;
    transition: all 400ms;
  }
}
.food_form {
  border: 1px solid #eaeefb;
  padding: 10px 10px 0;
}
.form_header {
  text-align: center;
  margin-bottom: 10px;
}
</style>