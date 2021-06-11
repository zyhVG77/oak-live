<template>
  <div>
    <h2>开启会议</h2>
    <div class="md-layout">
      <div class="md-layout-item md-size-35">
        <md-field>
          <label>会议名称</label>
          <md-input placeholder='输入会议名称'></md-input>
        </md-field>
      </div>
    </div>
    <div class="md-layout md-gutter">
       <div class="md-layout-item md-size-40">
        <md-field>
          <label for="video">视频设备</label>
          <md-select name="video" id="video" placeholder='选择视频设备' v-model='videoDevice'>
            <md-option v-for='(vd, k) in devices.videoDevices' :value='vd.name' :key='k'>
              {{ (vd.name != 'screen-capture-recorder') ? vd.name : '桌面' }}
            </md-option>
          </md-select>
        </md-field>
      </div>

      <div class="md-layout-item md-size-40">
        <md-field>
          <label for="audio">音频设备</label>
          <md-select name="audio" id="audio" placeholder='选择音频设备' v-model='audioDevices' multiple>
            <md-option v-for='(ad, k) in devices.audioDevices' :value='ad.name' :key='k'>
              {{ (ad.name != 'virtual-audio-capturer') ? ad.name : '电脑声音' }}
            </md-option>
          </md-select>
        </md-field>
      </div>
    </div>

    <div class="md-layout md-gutter">
      <div class="md-layout-item">
        <md-button class="md-raised md-primary" @click='runStreaming'>启动</md-button>
        <md-button class="md-raised md-accent">清空</md-button>
      </div>
    </div>
  </div>
</template>

<script>
import LiveUtils from '@/assets/js/live.js'

export default {
  name: 'LiveSettings',
  data: function () {
    return {
      devices: {
        videoDevice: null,
        audioDevices: []
      },
      videoDevice: null,
      audioDevices: []
    }
  },
  methods: {
    runStreaming: function () {
      LiveUtils.streaming(
        {
          videoInput: this.videoDevice,
          audioInputs: this.audioDevices
        },
        () => { this.$router.push('/live-state') },
        () => {}
      )
    }
  },
  mounted() {
    // Get all devices
    LiveUtils.getDevices(d => {
      this.devices = d
    })
  }
}
</script>

<style lang='scss' scoped>
  @import "~vue-material/dist/theme/engine";

  .md-layout-item {
  }
</style>
