<template>
  <div class="home">
    <md-app>
      <!--
      <md-app-toolbar class="md-primary">
        <span class="md-title">会议直播</span>
      </md-app-toolbar>
      -->

      <md-app-drawer md-permanent="full">
        <md-toolbar class="md-transparent" md-elevation="0">
          导航
        </md-toolbar>

        <md-list>
          <md-list-item @click='to("/home/live-manage")' v-show='role === "admin" || role === "host"'>
            <md-icon>settings</md-icon>
            <span class="md-list-item-text">会议管理</span>
          </md-list-item>

          <md-list-item  @click='to("/home/whiteboard")' v-show='role === "admin" || role === "host"'>
            <md-icon>draw</md-icon>
            <span class="md-list-item-text">白板</span>
          </md-list-item>

          <md-list-item  @click='to("/home/livestream")' v-show='role === "admin" || role === "common"'>
            <md-icon>live_tv</md-icon>
            <span class="md-list-item-text">观看直播</span>
          </md-list-item>

        </md-list>
      </md-app-drawer>

      <md-app-content>
        <router-view />
        <chat-hub></chat-hub>
      </md-app-content>

    </md-app>
  </div>
</template>

<script>
/* eslint-disable dot-notation */
import ChatHub from '@/components/ChatHub'
export default {
  name: 'Home',
  components: { 'chat-hub': ChatHub },
  computed: {
    role() {
      const user = this.$store.getters['user/currentUser']
      if (user.account.username === 'admin') {
        return 'admin'
      }
      const meeting = this.$store.getters['meeting']
      if (meeting && meeting.host.uid === user.uid) {
        return 'host'
      } else {
        return 'common'
      }
    }
  },
  methods: {
    to: function (path) {
      this.$router.push(path)
    }
  },
  mounted() {
    this.$store.dispatch('updateParticipants')
      .then(() => console.log('Update Participants List Successfully!'))
  }
}
</script>

<style lang="scss" scoped>
  .md-app {
    max-height: 800px;
    height: 640px;
    border: 1px solid rgba(#000, .12);
  }

   // Demo purposes only
  .md-drawer {
    width: 230px;
    max-width: calc(100vw - 125px);
  }
</style>
