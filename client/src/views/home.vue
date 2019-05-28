<template>
  <div>
    <headTop/>

    <section class="data_section">
      <header class="section_title">图书馆相关数据</header>
      <el-row :gutter="20" style="margin-bottom: 10px;">
        <el-col :span="4">
          <div class="data_list today_head">
            <span class="data_num head">总体：</span>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="data_list">
            <span class="data_num">{{bookCount}}</span>书本数量
          </div>
        </el-col>
        <el-col :span="4">
          <div class="data_list">
            <span class="data_num">{{genreCount}}</span>书本种类
          </div>
        </el-col>
        <el-col :span="4">
          <div class="data_list">
            <span class="data_num">{{bookInstanceCount}}</span>书本实例
          </div>
        </el-col>
        <el-col :span="4">
          <div class="data_list">
            <span class="data_num">{{userCount}}</span>用户数量
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="data_list all_head">
            <span class="data_num head">今日数据：</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="data_list">
            <span class="data_num">{{todayUserCount}}</span> 注册用户
          </div>
        </el-col>
        <el-col :span="6">
          <div class="data_list">
            <span class="data_num">{{todayBorrowCount}}</span> 借书
          </div>
        </el-col>
      </el-row>
    </section>
    <div class="line1">
      <div id="line1" class style="width: 90%;height:450px;"></div>
    </div>
  </div>
</template>
<script>
import echarts from "echarts";
import dtime from "time-formater";
export default {
  data() {
    return {
      bookCount: 0,
      bookshelfCount: 0,
      bookInstanceCount: 0,
      genreCount: 0,
      userCount: 0,
      userList: [],
      borrowList: [],
      bookList: []
    };
  },
  computed: {
    todayUserCount() {
      const start = new Date(
        new Date(new Date().toLocaleDateString()).getTime()
      );
      let arr = this.userList.filter(item => {
        if (item.createTime) {
          return item.createTime > start;
        } else {
          return false;
        }
      });
      return arr.length;
    },
    todayBorrowCount() {
      const start = new Date(
        new Date(new Date().toLocaleDateString()).getTime()
      );
      let arr = this.borrowList.filter(item => {
        if (item.createTime) {
          return item.createTime > start;
        } else {
          return false;
        }
      });
      return arr.length;
    }
  },
  created() {
    this.initData();
  },
  activated() {
    this.initData();
  },
  mounted() {
    this.myChart = echarts.init(document.getElementById("line1"));
  },
  watch: {},
  methods: {
    async initData() {
      let bookCount = await this.$fetch("book/count");
      let bookshelfCount = await this.$fetch("bookshelf/count");
      let genreCount = await this.$fetch("genre/count");
      let userCount = await this.$fetch("user/count");
      let bookinstanceCount = await this.$fetch("bookinstance/count");
      let userlist = await this.$fetch("user/list");
      let borrowlist = await this.$fetch("book/managerborrowlist");
      let booklist = await this.$fetch("book/list");
      this.bookCount = bookCount.data;
      this.bookshelfCount = bookshelfCount.data;
      this.genreCount = genreCount.data;
      this.userCount = userCount.data;
      this.bookInstanceCount = bookinstanceCount.data;
      this.borrowList = borrowlist.data;
      this.userList = userlist.data;
      this.bookList = booklist.data;
      this.drawLine();
    },
    drawLine() {
      const sevenDay = [];
      const sevenCommentData = [];
      const sevenUserData = [];
      const sevenBookData = [];
      for (let i = 6; i > -1; i--) {
        const date = dtime(new Date().getTime() - 86400000 * i).format(
          "YYYY-MM-DD"
        );
        // const date = (new Date().getTime() - 86400000 * i).format("YYYY-MM-DD");
        sevenDay.push(date);
      }

      const start = new Date(new Date().toLocaleDateString()).getTime();

      for (let i = 6; i > -1; i--) {
        // const date = (new Date().getTime() - 86400000 * i).format("YYYY-MM-DD");
        let commentArr = this.borrowList.filter(item => {
          if (item.borrowTime) {
            let begin = start - 86400000 * i;
            // console.log(begin < item.createTime, item.createTime < begin + 86400000);
            return (
              item.borrowTime > begin && item.borrowTime < begin + 86400000
            );
          } else {
            return false;
          }
        });
        let userArr = this.userList.filter(item => {
          if (item.createTime) {
            let begin = start - 86400000 * i;
            return (
              item.createTime > begin && item.createTime < begin + 86400000
            );
          } else {
            return false;
          }
        });
        let bookArr = this.bookList.filter(item => {
          if (item.time) {
            let begin = start - 86400000 * i;
            return item.time > begin && item.time < begin + 86400000;
          } else {
            return false;
          }
        });
        sevenCommentData.push(commentArr.length);
        sevenUserData.push(userArr.length);
        sevenBookData.push(bookArr.length);
      }

      let option = {
        title: {
          text: "数据走势图"
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["新增借阅", "新增用户", "新增书籍"]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        toolbox: {
          // feature: {
          //   saveAsImage: {}
          // }
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: sevenDay
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "新增借阅",
            type: "line",
            stack: "总量",
            smooth: true,
            data: sevenCommentData
          },
          {
            name: "新增用户",
            type: "line",
            stack: "总量",
            smooth: true,
            data: sevenUserData
          },
          {
            name: "新增书籍",
            type: "line",
            stack: "总量",
            smooth: true,
            data: sevenBookData
          }
        ]
      };
      this.myChart.setOption(option);
    }
  }
};
</script>
<style lang="less" scoped>
@import "../style/mixin";
.data_section {
  padding: 20px;
  margin-bottom: 40px;
  .section_title {
    text-align: center;
    font-size: 30px;
    margin-bottom: 10px;
  }
  .data_list {
    text-align: center;
    font-size: 14px;
    color: #666;
    border-radius: 6px;
    background: #e5e9f2;
    .data_num {
      color: #333;
      font-size: 26px;
    }
    .head {
      border-radius: 6px;
      font-size: 22px;
      padding: 4px 0;
      color: #fff;
      display: inline-block;
    }
  }
  .today_head {
    background: #ff9800;
  }
  .all_head {
    background: #20a0ff;
  }
}
.wan {
  .sc(16px, #333);
}

.line1 {
  display: flex;
  justify-content: center;
}
</style>