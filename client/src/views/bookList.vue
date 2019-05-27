<template>
  <div class="fillcontain">
    <headTop/>
    <div style="margin-top:10px;">
      <input v-model="search" type="text" class="searchbox" placeholder="输入书籍名称">
      <p style="color:gray; margin-left:20px; font-size: 14px;">输入书籍名称快速检索书籍</p>
    </div>

    <div class="table_container">
      <el-table v-loading="loading" :data="showList" style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="书名">
                <span>{{ props.row.name }}</span>
              </el-form-item>
              <el-form-item label="简介">
                <span>{{ props.row.desc }}</span>
              </el-form-item>
              <el-form-item label="出版社">
                <span>{{ props.row.publisher }}</span>
              </el-form-item>
              <el-form-item label="种类">
                <span>{{ props.row.genreNames }}</span>
              </el-form-item>
              <el-form-item label="实例数量">
                <span>{{getBookinstanceList(props.row._id).length}}</span>
              </el-form-item>
              <el-form-item label="总点击量">
                <span>{{ props.row.allClick }}</span>
              </el-form-item>
              <el-form-item label="男生点击量">
                <span>{{ props.row.maleClick }}</span>
              </el-form-item>
              <el-form-item label="女生点击量">
                <span>{{ props.row.femaleClick }}</span>
              </el-form-item>
              <el-form-item label="借阅次数">
                <span>{{ props.row.lendTimes }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="author" label="作者"></el-table-column>
        <el-table-column prop="publisher" label="出版社"></el-table-column>
        <!-- <el-table-column prop="state" label="状态"></el-table-column>
        <el-table-column prop="shelfname" label="书架"></el-table-column>-->
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="Pagination">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="10"
          layout="total, prev, pager, next"
          :total="tableData.length"
        ></el-pagination>
      </div>
      <el-dialog title="修改书籍信息" :visible.sync="dialogFormVisible">
        <el-form :rules="dialogFormrules" :model="dialogForm" ref="dialogForm" v-loading="loading">
          <el-form-item label="书名" prop="name">
            <el-input v-model="dialogForm.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="摘要" prop="desc">
            <el-input v-model="dialogForm.desc"></el-input>
          </el-form-item>
          <el-form-item label="作者" prop="author">
            <el-input v-model="dialogForm.author"></el-input>
          </el-form-item>
          <el-form-item label="出版社" prop="publisher">
            <el-input v-model="dialogForm.publisher"></el-input>
          </el-form-item>
          <el-form-item label="书本种类">
            <el-checkbox-group v-model="dialogForm.genre">
              <el-checkbox
                v-for="(item, index) in genreList"
                :key="index"
                :label="item._id"
                :name="item._id"
              >{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="上传图片" prop="filepath">
            <el-upload
              class="avatar-uploader"
              ref="upload"
              action="http://localhost:3000/posts/img"
              :before-upload="beforeUpload"
              :on-success="uploadSuccess"
              :limit="1"
            >
              <img
                v-if="dialogForm.filepath"
                :src="'http://localhost:3000' + dialogForm.filepath"
                class="avatar"
              >
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过10m</div>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-row type="flex" justify="center">
              <el-button type="primary" @click="onSubmit('dialogForm')">提交修改</el-button>
            </el-row>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
    <div class="line1">
      <div id="line1" class style="width: 100%;height:450px;"></div>
      <div id="line2" class style="width: 100%;height:450px;"></div>
      <div id="line3" class style="width: 100%;height:450px;"></div>
      <div id="line4" class style="width: 100%;height:450px;"></div>
    </div>
  </div>
</template>
<script>
import echarts from "echarts";
import dtime from "time-formater";
export default {
  data() {
    return {
      search: "",
      genreList: [],
      bookshelfList: [],
      bookInstanceList: [],
      editIndex: 0,
      currentPage: 1,
      offset: 0,
      limit: 10,
      count: 0,
      tableData: [],
      dialogFormVisible: false,
      loading: false,
      dialogForm: {},
      dialogFormrules: {
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
  activated() {
    this.GetListCount();
  },
  computed: {
    showList() {
      let list = this.tableData;
      let regex = new RegExp(this.search);
      list = list.filter(item => item.name.match(regex));
      return list.slice(this.offset, this.offset + 10);
    }
  },
  watch: {},
  mounted() {
    this.myChart1 = echarts.init(document.getElementById("line1"));
    this.myChart2 = echarts.init(document.getElementById("line2"));
    this.myChart3 = echarts.init(document.getElementById("line3"));
    this.myChart4 = echarts.init(document.getElementById("line4"));
  },
  methods: {
    async initData() {
      // this.getList();
      this.loading = true;
      let genreList = await this.$fetch("genre/list");
      let bookshelfList = await this.$fetch("bookshelf/list");
      this.genreList = genreList.data;
      this.bookshelfList = bookshelfList.data;
      await this.getList();
      let bookinstancelist = await this.$fetch("bookinstance/list");
      this.bookInstanceList = bookinstancelist.data;
      // this.GetListCount();
      this.drawLine1();
      this.drawLine2();
      this.drawLine3();
      this.drawLine4();
      this.loading = false;
    },
    async GetListCount() {
      let data = await this.$fetch("book/count");
      if (data.data !== this.count) {
        this.getList();
        this.count = data.data;
      }
    },
    async getList() {
      let data = await this.$fetch("book/list");
      this.tableData = data.data;
    },
    handleEdit(index, row) {
      this.editIndex = index;
      this.dialogFormVisible = true;
      this.dialogForm = JSON.parse(JSON.stringify(this.tableData[index]));
    },
    getBookinstanceList(bookid) {
      return this.bookInstanceList.filter(item => item.bookid === bookid);
    },
    async handleDelete(index, row) {
      let data = await this.$fetch("book/delete", {
        method: "POST",
        body: JSON.stringify({
          id: this.tableData[index]._id
        })
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
          message: "删除书本成功",
          type: "success"
        });
        this.tableData.splice(index, 1);
      }
    },
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.change();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    async change() {
      let data = await this.$fetch("book/change", {
        method: "POST",
        body: JSON.stringify(this.dialogForm)
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
          message: "修改书本信息成功",
          type: "success"
        });
        this.tableData[this.editIndex] = JSON.parse(
          JSON.stringify(this.dialogForm)
        );
        this.dialogFormVisible = false;
      }
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.offset = (val - 1) * this.limit;
      // this.getList();
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
    },
    drawLine1() {
      let typenameArr = [];
      let typecountArr = [];
      let tmpArr = this.tableData.sort((a, b) => {
        return b.allClick - a.allClick;
      });
      tmpArr = tmpArr.slice(0, 10);
      for (let i = 0; i < tmpArr.length; ++i) {
        let item = tmpArr[i];
        typenameArr.push(item.name);
        typecountArr.push(item.allClick);
      }
      let option = {
        title: {
          text: "点击量最高图书"
        },
        xAxis: {
          type: "value"
        },
        yAxis: {
          type: "category",
          data: typenameArr
        },
        series: [
          {
            data: typecountArr,
            type: "bar"
          }
        ]
      };
      this.myChart1.setOption(option);
    },
    drawLine2() {
      let typenameArr = [];
      let typecountArr = [];
      let tmpArr = this.tableData.sort((a, b) => {
        return b.maleClick - a.maleClick;
      });
      tmpArr = tmpArr.slice(0, 10);
      for (let i = 0; i < tmpArr.length; ++i) {
        let item = tmpArr[i];
        typenameArr.push(item.name);
        typecountArr.push(item.maleClick);
      }
      let option = {
        title: {
          text: "男生点击最多图书"
        },
        xAxis: {
          type: "value"
        },
        yAxis: {
          type: "category",
          data: typenameArr
        },
        series: [
          {
            data: typecountArr,
            type: "bar"
          }
        ]
      };
      this.myChart2.setOption(option);
    },
    drawLine3() {
      let typenameArr = [];
      let typecountArr = [];
      let tmpArr = this.tableData.sort((a, b) => {
        return b.femaleClick - a.femaleClick;
      });
      tmpArr = tmpArr.slice(0, 10);
      for (let i = 0; i < tmpArr.length; ++i) {
        let item = tmpArr[i];
        typenameArr.push(item.name);
        typecountArr.push(item.femaleClick);
      }
      let option = {
        title: {
          text: "女生点击最多图书"
        },
        xAxis: {
          type: "value"
        },
        yAxis: {
          type: "category",
          data: typenameArr
        },
        series: [
          {
            data: typecountArr,
            type: "bar"
          }
        ]
      };
      this.myChart3.setOption(option);
    },
    drawLine4() {
      let typenameArr = [];
      let typecountArr = [];
      let tmpArr = this.tableData.sort((a, b) => {
        return b.lendTimes - a.lendTimes;
      });
      tmpArr = tmpArr.slice(0, 10);
      for (let i = 0; i < tmpArr.length; ++i) {
        let item = tmpArr[i];
        typenameArr.push(item.name);
        typecountArr.push(item.lendTimes);
      }
      let option = {
        title: {
          text: "借阅最多图书"
        },
        xAxis: {
          type: "value"
        },
        yAxis: {
          type: "category",
          data: typenameArr
        },
        series: [
          {
            data: typecountArr,
            type: "bar"
          }
        ]
      };
      this.myChart4.setOption(option);
    }
  }
};
</script>
<style lang="less">
@import "../style/mixin";
.table_container {
  padding: 20px;
}
.el-form-item {
  margin-right: 0;
  margin-bottom: 20px;
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
.searchbox {
  border: 1px solid #8c939d;
  height: 30px;
  width: 200px;
  margin-left: 20px;
}
</style>