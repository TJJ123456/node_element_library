<template>
  <div class="fillcontain">
    <headTop/>
    <div class="table_container">
      <el-table v-loading="loading" :data="tableData" style="width: 100%">
        <el-table-column prop="name" label="书架名称"></el-table-column>
        <el-table-column prop="desc" label="描述"></el-table-column>
        <el-table-column prop="bookList.length" label="书架书本"></el-table-column>
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
      <el-dialog title="修改书架信息" :visible.sync="dialogFormVisible">
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
      <el-dialog title="书架书籍管理" :visible.sync="managerBookshelfVisible">
        <el-form>
          <el-form-item>
            <template>
              <el-transfer
                :titles="['无书架书籍', '该书架书籍']"
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
        name: [{ required: true, message: "请输入书架名称", trigger: "blur" }],
        desc: [{ required: true, message: "请输入书架描述", trigger: "blur" }]
      }
    };
  },
  created() {
    this.initData();
  },
  activated() {
    this.GetListCount();
  },
  watch: {},
  methods: {
    async initData() {
      // this.getList();
      this.loading = true;
      let bookList = await this.$fetch("book/list");
      this.bookList = bookList.data;
      this.GetListCount();
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
      this.removeShelfList = [];
      this.managerShelfId = this.tableData[index]._id;
      for (let i in this.bookList) {
        const item = this.bookList[i];
        if (
          item =>
            item.bookshelf === "" || item.bookshelf === this.managerShelfId
        ) {
          this.transferBookList.push({
            key: i,
            label: item.name,
            id: item._id,
            shelf: item.bookshelf
          });
          if (item.bookshelf === this.managerShelfId) {
            this.afterTransferList.push(i);
            this.removeShelfList.push(i);
          }
        }
      }
    },
    async onChangeBookShelf() {
      this.loading = true;
      let addShelfList = [];
      let removeShelfList = [];
      for (let i = 0; i < this.afterTransferList.length; ++i) {
        let index = this.afterTransferList[i];
        if (this.transferBookList[index].shelf === "") {
          addShelfList.push(this.transferBookList[index].id);
        }
        let tmp = this.removeShelfList.findIndex(item => item === index);
        if (tmp !== -1) {
          this.removeShelfList.splice(tmp, 1);
        }
      }
      for (let i = 0; i < this.removeShelfList.length; ++i) {
        let index = this.removeShelfList[i];
        removeShelfList.push(this.transferBookList[index].id);
      }
      let data = await this.$fetch("bookshelf/transferBook", {
        method: "POST",
        body: JSON.stringify({
          bookshelfId: this.managerShelfId,
          addShelfList: addShelfList,
          removeShelfList: removeShelfList
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
          message: "管理书籍信息成功",
          type: "success"
        });
        let index = this.tableData.findIndex(
          item => item._id === this.managerShelfId
        );
        if (index !== -1) this.tableData[index] = data.data;
        this.managerBookshelfVisible = false;
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
          message: "删除书架成功",
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
          message: "修改书架信息成功",
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
