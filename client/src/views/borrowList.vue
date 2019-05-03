<template>
  <div class="fillcontain">
    <headTop/>
    <div class="table_container">
      <el-table v-loading="loading" :data="tableData" style="width: 100%">
        <el-table-column prop="bookname" label="书名"></el-table-column>
        <el-table-column prop="readername" label="借书人"></el-table-column>
        <el-table-column prop="borrow" label="借书时间"></el-table-column>
        <el-table-column prop="back" label="还书时间"></el-table-column>
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
          :total="count"
        ></el-pagination>
      </div>
      <el-dialog title="借书" :visible.sync="dialogFormVisible">
        <el-form :rules="dialogFormrules" :model="dialogForm" ref="dialogForm">
          <el-form-item label="名称" prop="name">
            <el-input v-model="dialogForm.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="desc">
            <el-input v-model="dialogForm.desc"></el-input>
          </el-form-item>
          <el-form-item label="价格" prop="price">
            <el-input v-model.number="dialogForm.price"></el-input>
          </el-form-item>
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
import moment from "moment";
moment.locale("zh-cn");
export default {
  data() {
    return {
      currentPage: 1,
      offset: 0,
      limit: 10,
      count: 0,
      tableData: [],
      dialogFormVisible: false,
      loading: false,
      dialogForm: {},
      dialogFormrules: {
        name: [{ required: true, message: "请输入景点名称", trigger: "blur" }],
        desc: [{ required: true, message: "请输入景点描述", trigger: "blur" }],
        price: [
          { required: true, message: "价格不能为空", trigger: "blur" },
          { type: "number", message: "价格必须为数字值" }
        ]
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
      this.loading = true;
      let data = await this.$fetch("book/managerborrowlist", {
        method: "POST",
        body: JSON.stringify({
          limit: this.limit,
          offset: this.offset
        })
      });
      this.tableData = data.data;
      this.tableData.forEach(item => {
        item.borrow = this.formatTime(item.borrowTime);
        item.back =
          item.backTime === 0 ? "未归还" : this.formatTime(item.backTime);
      });
      this.loading = false;
    },
    formatTime(time) {
      return moment(time).format("LL");
    },
    handleEdit(index, row) {
      // this.dialogFormVisible = true;
      // this.dialogForm = this.tableData[index];
    },
    async handleDelete(index, row) {
      // let data = await this.$fetch("spot/delete", {
      //   method: "POST",
      //   body: JSON.stringify({
      //     id: this.tableData[index]._id
      //   })
      // });
      // if (data.err) {
      //   this.$message({
      //     showClose: true,
      //     message: data.msg,
      //     type: "error"
      //   });
      // } else {
      //   this.$message({
      //     showClose: true,
      //     message: "删除景点成功",
      //     type: "success"
      //   });
      //   this.tableData.splice(index, 1);
      // }
    },
    onSubmit(formName) {
      // this.$refs[formName].validate(valid => {
      //   if (valid) {
      //     this.changeItem();
      //   } else {
      //     console.log("error submit!!");
      //     return false;
      //   }
      // });
    },
    async changeItem() {},
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
