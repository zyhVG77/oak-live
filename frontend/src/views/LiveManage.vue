<template>
  <div>

    <!-- Modals here -->
  <div>
    <md-dialog-confirm
      :md-active.sync="show_mic_apply"
      md-title="连麦申请"
      :md-content="mic_text"
      md-confirm-text="同意"
      md-cancel-text="拒绝"
      @md-cancel="onCancelMic"
      @md-confirm="onConfirmMic" />
  </div>

  <div>
    <md-dialog-alert
      :md-active.sync="show_hands_up"
      :md-content="hands_text"
      md-confirm-text="确认" />
  </div>

    <md-list>
      <md-list-item>
        <md-icon>house</md-icon>
        <span class="md-list-item-text">会议名：{{ meetingInfo.name }} </span>
      </md-list-item>

      <md-list-item>
        <md-icon>share</md-icon>
        <span class="md-list-item-text">分享链接：{{ meetingInfo.streamId }} </span>
      </md-list-item>

      <md-list-item>
        <md-icon>lock</md-icon>
        <span class="md-list-item-text">开启密码验证：{{ meetingInfo.authRequired ? '是' : '否' }} </span>
      </md-list-item>

      <md-list-item v-show="meetingInfo.authRequired">
        <md-icon>password</md-icon>
        <span class="md-list-item-text">密码：{{ meetingInfo.password }} </span>
      </md-list-item>

      <md-list-item>
        <md-icon>analytics</md-icon>
        <span class="md-list-item-text">当前状态：{{ status }} </span>
      </md-list-item>

      <md-list-item>
        <md-icon>groups</md-icon>
        <span class="md-list-item-text">当前人数：{{ numOfPeople }} </span>
      </md-list-item>

      <md-list-item>
        <md-icon>videocam</md-icon>
        <span class="md-list-item-text">当前视频设备：{{ currentDevices.videoDevice }} </span>
      </md-list-item>

      <md-list-item>
        <md-icon>mic</md-icon>
        <span class="md-list-item-text">当前音频设备：{{ currentDevices.audioDevices }} </span>
      </md-list-item>
    </md-list>

    <div class="md-layout md-gutter">
       <div class="md-layout-item md-size-50">
        <md-field>
          <label for="video">视频设备</label>
          <md-select name="video" id="video" placeholder='选择视频设备' v-model='videoDevice'>
            <md-option v-for='(vd, k) in devices.videoDevices' :value='vd.name' :key='k'>
              {{ (vd.name != 'screen-capture-recorder') ? vd.name : '桌面' }}
            </md-option>
          </md-select>
        </md-field>
       </div>

      <div class="md-layout-item md-size-50">
        <md-field>
          <label for="audio">音频设备</label>
          <md-select name="audio" id="audio" placeholder='选择音频设备' v-model='audioDevices' multiple>
            <md-option v-for='(ad, k) in devices.audioDevices' :value='ad.name' :key='k'>
              {{ (ad.name != 'virtual-audio-capturer') ? ad.name : '电脑声音' }}
            </md-option>
          </md-select>
        </md-field>
      </div>

    <div class="md-layout md-gutter">
      <div class="md-layout-item md-size-80">
        <md-button class="md-raised md-primary" @click='startLive' v-show="status != 'living'">开启直播</md-button>
      </div>
      <div class="md-layout-item md-size-80">
        <md-button class="md-raised md-accent" @click='endLive' v-show="status == 'living'">关闭直播</md-button>
      </div>
    </div>

    </div>
  </div>
</template>

<script>
/* eslint-disable dot-notation */
// eslint-disable-next-line no-unused-vars
import { Client, Message } from '@stomp/stompjs';

export default {
  name: 'LiveManage',
  computed: {
    meetingInfo() {
      return this.$store.getters['meeting']
    },
    status() {
      return this.$store.getters['status']
      // return 'opened'
    },
    currentDevices() {
      return this.$store.getters['devices']
      // return {videoDevice: 'video', audioDevices: ['audio1', 'audio2']}
    },
    numOfPeople() {
      return this.$store.getters['numOfPeople']
    },
    currentUser() {
      return this.$store.getters['user/currentUser']
    },
    currentMeeting() {
      return this.$store.getters['meeting']
    }
  },
  data() {
    return {
      devices: {
        videoDevices: [],
        audioDevices: []
      },
      videoDevice: null,
      audioDevices: [],
      stompClient: null,
      show_mic_apply: false,
      mic_text: '',
      show_hands_up: false,
      hands_text: ''
    }
  },
  created() {
    this.initStompClient()
  },
  destroyed() {
    this.stompClient.deactivate();
  },
  methods: {
    initStompClient () {
      const token = this.$store.state.user.token

      const client = new Client({
        brokerURL: 'ws://localhost:8803/ws',
        connectHeaders: {
          Authentication: token
        },
        debug: function (str) {
          console.log(str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000
      });
      client.onConnect = this.onStompConnect
      client.onStompError = this.onStompError
      client.activate()
      this.stompClient = client
    },
    onStompConnect (frame) {
      this.stompClient.subscribe('/topic/ops', this.onMessageReceived)
    },
    onStompError (frame) {
      console.log(frame)
    },
    onMessageReceived (message) {
      const body = JSON.parse(message.body);
      const type = body.type
      if (type !== 'op') {
        return
      }
      const op = body.content
      const sender = body.sender
      if (op === 'mic') {
        this.show_mic_apply = true;
        this.mic_text = sender.account.username + '申请连麦，是否同意？'
      } else if (op === 'hand') {
        this.show_hands_up = true;
        this.hands_text = sender.account.username + '举手示意！'
      }
    },
    startLive() {
      this.$store.dispatch('startLive', { videoDevice: this.videoDevice, audioDevices: this.audioDevices })
        .then(() => {
          console.log('success')
        })
        .catch(err => {
          console.log(err)
        })
    },
    endLive() {
      this.$store.dispatch('endLive')
        .then(() => {
          console.log('success')
        })
        .catch(err => {
          console.log(err)
        })
    },
    onConfirmMic() {
      console.log('confirm')
      const messageWrapper = {
        type: 're',
        content: 'mic_1',
        meetingId: this.currentMeeting.uid,
        sender: this.currentUser
      }
      console.log('publish');
      this.stompClient.publish({ destination: '/app/ops', body: JSON.stringify(messageWrapper) });
    },
    onCancelMic() {
      const messageWrapper = {
        type: 're',
        content: 'mic_0',
        meetingId: this.currentMeeting.uid,
        sender: this.currentUser
      }
      console.log('publish');
      this.stompClient.publish({ destination: '/app/ops', body: JSON.stringify(messageWrapper) });
    }
  },
  mounted() {
    this.$store.dispatch('getDevices')
      .then(d => {
        this.devices = d
      })
      .catch(err => {
        console.log(err)
      })
    const devices = this.$store.getters['devices']
    this.videoDevice = devices.videoDevice
    this.audioDevices = devices.audioDevices
  }
}
</script>

<style lang='scss' scoped>
.md-list {
    width: 600px;
    max-width: 100%;
    display: inline-block;
    vertical-align: top;
    border: 1px solid rgba(#000, .12);
}
</style>
