<template>
  <div class="fillcontain">
    <headTop/>
    <div class="table_container">
      <el-table v-loading="loading" :data="tableData" style="width: 100%">
        <el-table-column prop="name" label="书单名称"></el-table-column>
        <el-table-column prop="desc" label="描述"></el-table-column>
        <el-table-column prop="booklist.length" label="书单书本"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" @click="handleManager(scope.$index, scope.row)">管理</el-button>
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
      <el-dialog title="修改书单信息" :visible.sync="dialogFormVisible">
        <el-form :rules="dialogFormrules" :model="dialogForm" ref="dialogForm">
          <el-form-item label="名称" prop="name">
            <el-input v-model="dialogForm.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="desc">
            <el-input v-model="dialogForm.desc"></el-input>
          </el-form-item>
          <el-form-item>
            <el-row type="flex" justify="center">
              <el-button type="primary" @click="onSubmit('dialogForm')">提交修改</el-button>
            </el-row>
          </el-form-item>
        </el-form>
      </el-dialog>
      <el-dialog title="书单书籍管理" :visible.sync="managerBookshelfVisible">
        <el-form>
          <el-form-item>
            <template>
              <el-transfer
                :titles="['无书单书籍', '该书单书籍']"
                v-model="afterTransferList"
                :data="transferBookList"
              ></el-transfer>
            </template>
          </el-form-item>
          <el-form-item>
            <el-row type="flex" justify="center">
              <el-button type="primary" @click="onChangeBookShelf()">提交修改</el-button>
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
      currentPage: 1,
      offset: 0,
      limit: 10,
      count: 0,
      tableData: [],
      dialogFormVisible: false,
      managerBookshelfVisible: false,
      bookshelfForm: {},
      bookList: [],
      transferBookList: [],
      afterTransferList: [],
      removeShelfList: [],
      managerShelfId: 0,
      loading: false,
      dialogForm: {},
      dialogFormrules: {
        name: [{ required: true, message: "请输入书单名称", trigger: "blur" }],
        desc: [{ required: true, message: "请输入书单描述", trigger: "blur" }]
      }
    };
  },
  created() {
    this.initData();
  },
  activated() {
    this.initData();
  },
  watch: {},
  methods: {
    async initData() {
      // this.getList();
      this.loading = true;
      let bookList = await this.$fetch("book/list");
      this.bookList = bookList.data;
      this.getList();
      this.loading = false;
    },
    async GetListCount() {
      let data = await this.$fetch("bookshelf/count");

      if (data.data !== this.count) {
        this.getList();
        this.count = data.data;
      }
    },
    async getList() {
      let data = await this.$fetch("bookshelf/list", {
        method: "POST",
        body: JSON.stringify({
          limit: this.limit,
          offset: this.offset
        })
      });
      this.tableData = data.data;
    },
    handleEdit(index, row) {
      console.log(this.tableData[index]);
      this.dialogFormVisible = true;
      this.dialogForm = this.tableData[index];
    },
    async handleManager(index, row) {
      this.managerBookshelfVisible = true;
      this.transferBookList = [];
      this.afterTransferList = [];
      this.managerShelfId = this.tableData[index]._id;
      for (let i in this.bookList) {
        const item = this.bookList[i];
        let doc = this.tableData[index].booklist.find(
          book => book === item._id
        );
        this.transferBookList.push({
          key: i,
          label: item.name,
          id: item._id
        });
        if (!doc) {
          // this.afterTransferList.push(i);
        } else {
          this.afterTransferList.push(i);
        }
      }
    },
    async onChangeBookShelf() {
      this.loading = true;
      let shelfindex = this.tableData.findIndex(
        item => item._id === this.managerShelfId
      );
      this.tableData[shelfindex].booklist = [];
      for (let i = 0; i < this.afterTransferList.length; ++i) {
        let index = this.afterTransferList[i];
        this.tableData[shelfindex].booklist.push(
          this.transferBookList[index].id
        );
      }
      let data = await this.$fetch("bookshelf/change", {
        method: "POST",
        body: JSON.stringify(this.tableData[shelfindex])
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
          message: "修改推荐书单成功",
          type: "success"
        });
        this.initData();
        this.managerBookshelfVisible = true;
      }
      this.loading = false;
    },
    async handleDelete(index, row) {
      let data = await this.$fetch("bookshelf/delete", {
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
          message: "删除书单成功",
          type: "success"
        });
        this.tableData.splice(index, 1);
      }
    },
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.changeItem();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    async changeItem() {
      let data = await this.$fetch("bookshelf/change", {
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
          message: "修改书单信息成功",
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
      this.getList();
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
</style>
