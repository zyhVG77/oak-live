<template>
  <md-app>
    <md-app-content>
      <md-dialog-alert
        :md-active.sync="hint.show"
        :md-content="hint.message"
        md-confirm-text="确认" />

      <div class="center-card">
      <md-card>
        <md-button class="md-icon-button md-primary" @click="back">
          <md-icon>arrow_back</md-icon>
        </md-button>

        <md-card-header>
          <div class="md-title">
            加入会议
          </div>
        </md-card-header>
        <md-card-content>

    <div class="md-layout">

      <div class="md-layout-item md-size-100">
        <md-field md-clearable>
          <label>会议号</label>
          <md-input placeholder='输入会议号' v-model="meetingId"></md-input>
        </md-field>
      </div>

    <div class="md-layout-item md-size-100" v-show="authRequired">
      <md-field>
        <label>密码</label>
        <md-input v-model="password" type="password"></md-input>
      </md-field>
    </div>

    </div>

    <div class="md-layout md-gutter">
      <div class="md-layout-item">
        <md-button class="md-raised md-primary" @click='joinMeeting'>完成</md-button>
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
  name: 'JoinMeeting',
  data: function () {
    return {
      sending: false,
      // Basic infomation
      meetingId: '',
      password: '',
      authRequired: false,
      hint: {
        show: false,
        message: null
      }
    }
  },
  methods: {
    joinMeeting() {
      this.sending = true
      this.$store.dispatch('joinMeeting', { meeting_id: this.meetingId, password: this.password })
        .then((flag) => {
          if (flag === 0) {
            this.$router.push({ path: '/home/livestream' })
          } else {
            setTimeout(() => {
              this.sending = false
              this.authRequired = true
            }, 700);
          }
        })
        .catch((err) => {
          this.sending = false
          this.hint.show = true
          this.hint.message = err
        })
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
