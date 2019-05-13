<template>
  <div class="fillcontain">
    <headTop/>
    <div class="table_container">
      <el-table v-loading="loading" :data="tableData" style="width: 100%">
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="author" label="作者"></el-table-column>
        <el-table-column prop="publisher" label="出版社"></el-table-column>
        <el-table-column prop="state" label="状态"></el-table-column>
        <el-table-column prop="shelfname" label="书架"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button> -->
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
          :total="count"
        ></el-pagination>
      </div>
      <el-dialog title="修改书籍信息" :visible.sync="dialogFormVisible">
          <el-form-item label="书本状态" prop="state">
            <el-select v-model="dialogForm.state" placeholder="请选择书本状态">
              <el-option label="维护" value="维护"></el-option>
              <el-option label="可借阅" value="可借阅"></el-option>
            </el-select>
          </el-form-item>
          <template v-if="dialogForm.state==='可借阅'">
            <el-form-item label="所属书架">
              <el-select v-model="dialogForm.bookshelf" placeholder="请选择书架">
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
              <el-button type="primary" @click="onSubmit('dialogForm')">提交修改</el-button>
            </el-row>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      genreList: [],
      bookshelfList: [],
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
  // created() {
  //   this.initData();
  // },
  activated() {
    this.GetListCount();
  },
  watch: {},
  methods: {
    async initData() {
      // this.getList();
      this.loading = true;
      let genreList = await this.$fetch("genre/list");
      let bookshelfList = await this.$fetch("bookshelf/list");
      this.genreList = genreList.data;
      this.bookshelfList = bookshelfList.data;
      this.GetListCount();
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
      let data = await this.$fetch("bookinstance/list", {
        method: "POST",
        body: JSON.stringify({
          limit: this.limit,
          offset: this.offset
        })
      });
      this.tableData = data.data;
    },
    handleEdit(index, row) {
      this.editIndex = index;
      this.dialogFormVisible = true;
      this.dialogForm = JSON.parse(JSON.stringify(this.tableData[index]));
    },
    async handleDelete(index, row) {
      let data = await this.$fetch("bookinstance/delete", {
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
          message: "删除书本实例成功",
          type: "success"
        });
        this.tableData.splice(index, 1);
      }
    },
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
</style>