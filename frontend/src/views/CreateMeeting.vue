<template>
  <md-app>
    <md-app-content>
      <div class="center-card">
      <md-card>
        <md-button class="md-icon-button md-primary" @click="back">
          <md-icon>arrow_back</md-icon>
        </md-button>

        <md-card-header>
          <div class="md-title">会议设置</div>
        </md-card-header>
        <md-card-content>

    <div class="md-layout">

      <div class="md-layout-item md-size-100">
        <md-switch v-model="passwordTriggled">开启密码验证</md-switch>
      </div>

      <div class="md-layout-item md-size-100">
        <md-field>
          <label>会议名称</label>
          <md-input placeholder='输入会议名称' v-model="meetingName"></md-input>
        </md-field>
      </div>
    </div>

    <div class="md-layout-item md-size-100" v-show="passwordTriggled">
      <md-field>
        <label>密码</label>
        <md-input v-model="password" type="password"></md-input>
      </md-field>
    </div>

    <div class="md-layout">
      <div class="md-layout-item md-size-100">
        <md-field>
          <label>FFmpeg路径</label>
          <md-file @md-change="setFfmpeg($event)" />
        </md-field>
      </div>
    </div>

    <div class="md-layout md-gutter">
      <div class="md-layout-item">
        <md-button class="md-raised md-primary" @click='startMeeting'>完成</md-button>
        <md-button class="md-raised md-accent" @click='clearForm'>清空</md-button>
      </div>
    </div>
        </md-card-content>

      <md-progress-bar md-mode="indeterminate" v-if="sending" />

      </md-card>
      </div>
    </md-app-content>
  </md-app>
</template>

<script>
export default {
  name: 'CreateMeeting',
  data: function () {
    return {
      ffmpegTriggled: false,
      passwordTriggled: false,
      sending: false,
      // Basic infomation
      meetingName: null,
      password: null
    }
  },
  methods: {
    startMeeting: function () {
      this.sending = true

      this.$store.dispatch('startMeeting', {
        name: this.meetingName,
        authRequired: this.passwordTriggled,
        password: this.password
      })
        .then(() => {
          this.sending = false
          this.$router.push({ path: '/home/live-manage'})
        })
        .catch(err => {
          console.log(err)
        })
    },
    setFfmpeg: function (fileList) {
      this.$store.commit('setFfmpegPath', fileList[0].path)
    },
    clearForm: function () {
      this.meetingName = null
    },
    back() {
      this.$router.push({ path: '/navigation' })
    }
  }
}
</script>

<style lang='scss' scoped>
  @import "~vue-material/dist/theme/engine";

  .md-app {
    max-height: 800px;
    height: 640px;
    border: 1px solid rgba(#000, .12);
  }

  .md-card {
    width: 100%;
    margin-top: 4rem;
    display: inline-block;
    vertical-align: top;
  }

  .center-card {
    width: 500px;
    margin: 0 auto;
  }

</style>
