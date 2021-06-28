<template>
  <div>
    <md-empty-state
      md-icon="devices_other"
      :md-label="labelTitle"
      md-description="开启一场会议或加入会议吧！">
      <md-button class="md-primary md-raised" @click="to('/create-meeting')">开启会议</md-button>
      <md-button class="md-accent md-raised" @click="to('/join-meeting')">加入会议</md-button>
    </md-empty-state>
  </div>
</template>

<script>
export default {
  name: 'Navigation',
  computed: {
    currentUser() {
      return this.$store.getters['user/currentUser']
    },
    labelTitle() {
      return '欢迎您，' + this.currentUser.name
    }
  },
  methods: {
    to(dest) {
      this.$router.push({ path: dest })
    }
  }
}
</script>

<style lang="sass" scoped>
</style>
