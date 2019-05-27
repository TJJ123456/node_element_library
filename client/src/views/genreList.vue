<template>
  <div class="fillcontain">
    <headTop/>
    <div class="table_container">
      <el-table v-loading="loading" :data="showList" style="width: 100%">
        <el-table-column prop="name" label="种类名称"></el-table-column>
        <el-table-column prop="bookList.length" label="种类数量"></el-table-column>
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
      <el-dialog title="修改种类信息" :visible.sync="dialogFormVisible">
        <el-form :rules="dialogFormrules" :model="dialogForm" ref="dialogForm">
          <el-form-item label="名称" prop="name">
            <el-input v-model="dialogForm.name" autocomplete="off"></el-input>
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
    </div>
  </div>
</template>
<script>
import echarts from "echarts";
import dtime from "time-formater";
export default {
  data() {
    return {
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
        name: [{ required: true, message: "请输入种类名称", trigger: "blur" }]
      }
    };
  },
  mounted() {
    this.myChart1 = echarts.init(document.getElementById("line1"));
  },
  created() {
    this.initData();
  },
  activated() {
    this.initData();
  },
  computed: {
    showList() {
      let list = this.tableData;
      return list.slice(this.offset, this.offset + 10);
    }
  },
  watch: {},
  methods: {
    async initData() {
      await this.getList();
      // await this.GetListCount();
      this.drawLine1();
    },
    async GetListCount() {
      let data = await this.$fetch("genre/count");
      if (data.data !== this.count) {
        this.getList();
        this.count = data.data;
      }
    },
    async getList() {
      let data = await this.$fetch("genre/list");
      this.tableData = data.data;
    },
    handleEdit(index, row) {
      this.editIndex = index;
      this.dialogFormVisible = true;
      this.dialogForm = JSON.parse(JSON.stringify(this.tableData[index]));
    },
    async handleDelete(index, row) {
      let data = await this.$fetch("genre/delete", {
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
          message: "删除种类成功",
          type: "success"
        });
        this.tableData.splice(index, 1);
      }
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.offset = (val - 1) * this.limit;
      // this.getList();
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
      let data = await this.$fetch("genre/change", {
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
          message: "修改种类信息成功",
          type: "success"
        });
        this.tableData[this.editIndex] = JSON.parse(
          JSON.stringify(this.dialogForm)
        );
        this.dialogFormVisible = false;
      }
    },
    drawLine1() {
      let typenameArr = [];
      let typecountArr = [];
      for (let i = 0; i < this.tableData.length; ++i) {
        let item = this.tableData[i];
        typenameArr.push(item.name);
        typecountArr.push({ value: item.bookList.length, name: item.name });
      }
      console.log("??", this.tableData.length, typenameArr);
      let option = {
        title: {
          text: "种类分布",
          x: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          left: "left",
          data: typenameArr
        },
        series: [
          {
            name: "评论来源",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            // data: [
            //   { value: foodArr.length, name: "美食评论" },
            //   { value: enArr.length, name: "娱乐评论" },
            //   { value: spotArr.length, name: "景点评论" }
            // ],
            data: typecountArr,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      };
      this.myChart1.setOption(option);
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
