<template>
  <div class="fillcontain" v-loading="loading">
    <headTop/>
    <div class="table_container">
      <el-row style="margin-top: 20px;">
        <el-col :span="14" :offset="4">
          <header class="form_header">添加书本实例</header>
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="110px"
            class="form food_form"
          >
            <el-form-item label="书本">
              <el-select v-model="ruleForm.bookId" placeholder="请选择书本">
                <el-option v-for="(item, index) in bookList" :key="index" label="item.name" value="item._id">{{item.name}} </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="书本状态" prop="state">
              <el-select v-model="ruleForm.state" placeholder="请选择书本状态">
                <el-option label="维护" value="维护"></el-option>
                <el-option label="可借阅" value="可借阅"></el-option>
              </el-select>
            </el-form-item>
            <template v-if="ruleForm.state==='可借阅'">
              <el-form-item label="所属书架">
                <el-select v-model="ruleForm.bookshelf" placeholder="请选择书架">
                  <el-option
                    v-for="(item, index) in bookshelfList"
                    :key="index"
                    :label="item.name"
                    :value="item._id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </template>
            <el-form-item>
              <el-row type="flex" justify="center">
                <el-button type="primary" @click="onSubmit('ruleForm')">添加书本实例</el-button>
              </el-row>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      bookList: [],
      bookshelfList: [],
      loading: true,
      ruleForm: {
        bookId: "",
        state: "",
        borrowtime: "",
        backtime: "",
        lendTimes: "",
        bookshelf: ""
      },
      rules: {
        name: [{ required: true, message: "请输入书本名称", trigger: "blur" }],
        desc: [{ required: true, message: "请输入书本摘要", trigger: "blur" }],
        author: [{ required: true, message: "请输入作者", trigger: "blur" }],
        publisher: [
          { required: true, message: "请输入出版社", trigger: "blur" }
        ],
        state: [{ required: true, message: "请选择书本状态", trigger: "blur" }]
      }
    };
  },
  created() {
    this.initData();
  },
  methods: {
    async initData() {
      this.loading = true;
      let bookList = await this.$fetch("book/list");
      let bookshelfList = await this.$fetch("bookshelf/list");
      this.bookList = bookList.data;
      this.bookshelfList = bookshelfList.data;
      this.loading = false;
    },
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.createBook();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    async createBook() {
      // console.log(JSON.stringify(this.ruleForm));
      let data = await this.$fetch("bookinstance/create", {
        method: "POST",
        body: JSON.stringify(this.ruleForm)
      });
      if (data.err) {
        this.$message({
          showClose: true,
          message: data.msg,
          type: "error"
        });
      } else {
        this.$message({
          showClose: true,
          message: "添加书本实例成功",
          type: "success"
        });
        this.resetForm("ruleForm");
        this.$router.push({ path: "/bookInstanceList" });
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    beforeUpload(file) {
      console.log(file.type);
      const isJPGorPng =
        file.type === "image/jpg" ||
        file.type === "image/png" ||
        file.type === "image/jpeg";
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isJPGorPng) {
        this.$message.error("上传图片只能是 JPG/jpeg/png 格式!");
      }
      if (!isLt10M) {
        this.$message.error("上传图片大小不能超过 10MB!");
      }
      return isJPGorPng && isLt10M;

      return false;
    },
    uploadSuccess(res, file) {
      this.ruleForm.filepath = res.filepath;
      //   console.log(res, file);
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
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
