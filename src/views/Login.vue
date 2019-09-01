<template>
  <div class="container">
    <div class="card pd-login">
      <a-tabs>
        <a-tab-pane tab="密码登录" key="1">
          <a-input
            placeholder="用户名"
            size="large"
            v-model="username"
            style="margin: 0.5rem auto 1rem;"
            allowClear
          ></a-input>
          <a-input
            style="margin-bottom: 2rem;"
            size="large"
            placeholder="密码, 按回车确认"
            @change="handlePdInput"
            @pressEnter="handlePdEnter"
            :value="pdShow"
          ></a-input>
        </a-tab-pane>
        <a-tab-pane tab="验证码登录" key="2" forceRender>暂未实现</a-tab-pane>
      </a-tabs>
      <footer class="btn-group">
        <a-button type="primary" style="width:6rem;" @click="login" :loading="logining">登录</a-button>
      </footer>
    </div>
    <div class="card social-login">
      <span>社交帐号登录</span>
      <span>
        <a class="social-login-link">
          <a-icon type="alipay" />
        </a>
        <a class="social-login-link">
          <a-icon type="wechat" />
        </a>
      </span>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import { Input, Icon, Button, Tabs } from "ant-design-vue";
const TabPane = Tabs.TabPane;

@Component({
  components: {
    "a-input": Input,
    "a-icon": Icon,
    "a-button": Button,
    "a-tabs": Tabs,
    "a-tab-pane": TabPane
  }
})
export default class Login extends Vue {
  private username = "";
  private password = "";
  private pdShow = "";
  private logining = false;
  resetUsername() {
    this.username = "";
  }
  resetPassword() {
    this.pdShow = "";
    this.password = "";
  }
  handlePdInput(e: any) {
    if (e.data) {
      this.pdShow += "*";
      this.password += e.data;
    } else {
      if (e.inputType == "deleteContentBackward") {
        this.pdShow = this.pdShow.substring(0, this.pdShow.length - 1);
        this.password = this.password.substring(0, this.password.length - 1);
      } else {
        this.pdShow = "";
        this.password = "";
      }
    }
  }
  handlePdEnter() {
    console.log(this.password);
  }

  qrcodeLogin() {
    this.$message.info("暂未实现二维码登录", 2);
  }
  login() {
    this.logining = true;
    this.requestLogin();
  }
  requestLogin() {
    this.logining = false;
  }

  mounted() {}
}
</script>
<style lang='scss' scoped>
@import "@/assets/css/base.scss";

.container {
  min-height: 100vh;
  overflow: hidden;
  -webkit-print-color-adjust: exact;
  background-color: $backgroud-color;
}
.card {
  box-shadow: 0 2px 6px rgba(100, 100, 100, 0.3);
  background-color: $white;
  width: 25rem;
}
.btn-group {
  display: flex;
  justify-content: center;
  padding: 0 2rem;
}
.social-login-link {
  font-size: 1.2rem;
}
.social-login-link:not(:last-child) {
  margin-right: 1.2rem;
}

// PC端界面
@media screen and (min-width: $mobile-width) {
  .pd-login {
    margin: 25vh auto 0;
    padding: 1.5rem 2rem;
  }
  .social-login {
    margin: 1.5rem auto 0;
    padding: 0.5rem 2rem;
    font-size: 1rem;
    line-height: 2rem;
    color: #8590a7;

    display: flex;
    justify-content: space-between;
  }
}

// 移动端界面
@media screen and (max-width: $mobile-width) {
  .pd-login {
    width: 90%;
    margin: 30vh auto;
  }
}
</style>
