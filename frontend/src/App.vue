<template>
  <div id='app' class="page-container">
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
          <md-list-item @click='to("/live-settings")'>
            <md-icon>settings</md-icon>
            <span class="md-list-item-text">开启会议</span>
          </md-list-item>

          <md-list-item @click='to("/test")'>
            <md-icon>tv</md-icon>
            <span class="md-list-item-text">加入会议</span>
          </md-list-item>

          <md-list-item  @click='to("/whiteboard")'>
            <md-icon>draw</md-icon>
            <span class="md-list-item-text">白板</span>
          </md-list-item>
        </md-list>
      </md-app-drawer>

      <md-app-content>
        <router-view />
      </md-app-content>
    </md-app>
  </div>
</template>

<script>
export default {
  name: 'Normal',
  methods: {
    to: function (path) {
      this.$router.push(path)
    }
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
