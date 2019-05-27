<template>
  <div class="fillcontain">
    <headTop/>
    <div class="table_container">
      <el-table v-loading="loading" :data="showList" style="width: 100%">
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="borrowcount" label="借书数量"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
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
      loading: false
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
      this.drawLine1();
      // this.GetListCount();
    },
    async GetListCount() {
      let data = await this.$fetch("user/count");
      if (data.data !== this.count) {
        this.getList();
        this.count = data.data;
      }
    },
    async getList() {
      let data = await this.$fetch("user/list");
      this.tableData = data.data;
    },
    handleEdit(index, row) {
      this.editIndex = index;
      this.dialogFormVisible = true;
      this.dialogForm = JSON.parse(JSON.stringify(this.tableData[index]));
    },
    async handleDelete(index, row) {
      let data = await this.$fetch("user/delete", {
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
          message: "删除用户成功",
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
    drawLine1() {
      let typenameArr = [];
      let typecountArr = [];
      let tmpArr = this.tableData.sort((a, b) => {
        return b.borrowcount - a.borrowcount;
      });
      tmpArr = tmpArr.slice(0, 10);
      for (let i = 0; i < tmpArr.length; ++i) {
        let item = tmpArr[i];
        typenameArr.push(item.username);
        typecountArr.push(item.borrowcount);
      }
      let option = {
        title: {
          text: "借阅排名"
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
