<template>
  <el-row v-loading="loading">
    <template v-if="$state.user">
      <el-col :span="16" :offset="4">
        <h2>个人信息</h2>
        <br>
        <hr>
        <span>名字：{{$state.user.username}}</span>
        <br>
        <br>
        <h6>借阅列表</h6>
        <el-table :data="borrowList" style="width: 100%">
          <el-table-column prop="bookdetail.name" label="名称"></el-table-column>
          <el-table-column prop="bookdetail.shelfname" label="书架"></el-table-column>
          <el-table-column prop="borrow" label="借书日期"></el-table-column>
          <el-table-column prop="back" label="还书日期"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                v-if="checkBack(scope.$index)"
                @click="backBook(scope.$index)"
                size="small"
              >还书</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </template>
  </el-row>
</template>
  
<script>
import moment from "moment";
moment.locale("zh-cn");
export default {
  props: {},
  data() {
    return {
      borrowList: [],
      loading: false
    };
  },
  created() {
    this.initData();
  },
  activated() {
    this.initData();
  },
  watch: {
    keyword(val) {
      this.initData();
    }
  },
  computed: {},
  methods: {
    async initData() {
      this.loading = true;
      let data = await this.$fetch("book/borrowlist");
      if (data.err) {
        if (data.msg === "请登录") {
          this.$router.replace("/home/login", "");
        }
        this.$message({
          showClose: true,
          message: data.msg,
          type: "error"
        });
      } else {
        this.borrowList = data.data;
        this.borrowList.forEach(item => {
          item.borrow = this.formatTime(item.borrowTime);
          item.back =
            item.backTime === 0 ? "未归还" : this.formatTime(item.backTime);
        });
      }
      this.loading = false;
    },
    formatTime(time) {
      return moment(time).format("LL");
    },
    checkBack(index) {
      if (this.borrowList[index].backTime === 0) return true;
      return false;
    },
    async backBook(index) {
      try {
        await this.$confirm(
          `确定归还《${this.borrowList[index].bookdetail.name}》吗?`,
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        );
        let data = await this.$fetch("book/backBook", {
          method: "POST",
          body: JSON.stringify({
            id: this.borrowList[index].book
          })
        });
        if (data.err) {
          if (data.msg === "请登录") {
            this.$router.replace("/home/login", "");
          }
          this.$message({
            showClose: true,
            message: data.msg,
            type: "error"
          });
        } else {
          this.$message({
            showClose: true,
            message: "还书成功",
            type: "success"
          });
          this.initData();
        }
      } catch (e) {}
    }
  }
};
</script>
<style lang="less" scoped>
</style>
