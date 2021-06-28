<template>
  <div class='live-container'>
    <h2>会议直播</h2>
    <h3>当前人数：{{ this.$store.getters['numOfPeople'] }}</h3>
    <video id='videoElement' controls autoplay muted width="640" height="480"></video>

    <div class="button-bar">
      <md-button :class='["md-icon-button", "md-raised", mic_on ? "md-primary" : ""]' @click="linkMic">
        <md-icon>mic</md-icon>
      </md-button>
      <md-button class="md-icon-button md-raised" @click="handsUp">
        <md-icon>front_hand</md-icon>
      </md-button>
      <!--
      <md-button class="md-icon-button md-raised" @click="at_all">
        <md-icon>alternate_email</md-icon>
      </md-button>
      -->
    </div>

  </div>
</template>

<script>
/* eslint-disable dot-notation */
import flvjs from 'flv.js'
// eslint-disable-next-line no-unused-vars
import { Client, Message } from '@stomp/stompjs';

export default {
  name: 'LiveStream',
  computed: {
    currentUser() {
      return this.$store.getters['user/currentUser']
    },
    currentMeeting() {
      return this.$store.getters['meeting']
    }
  },
  data() {
    return {
      stompClient: null,
      mic_on: false
    }
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
    onMessageReceived (message) {
      const body = JSON.parse(message.body);
      const type = body.type
      const content = body.content
      if (type === 're') {
        if (content === 'mic_1') {
          alert('连麦成功！')
          this.mic_on = true
        } else {
          alert('连麦被拒绝！')
          this.mic_on = false
        }
      }
    },
    onStompError (frame) {
      console.log(frame)
    },
    linkMic() {
      if (this.mic_on) {
        this.mic_on = false
        return
      }
      const messageWrapper = {
        type: 'op',
        content: 'mic',
        meetingId: this.currentMeeting.uid,
        sender: this.currentUser
      }
      console.log('publish');
      this.stompClient.publish({ destination: '/app/ops', body: JSON.stringify(messageWrapper) });
    },
    handsUp() {
      const messageWrapper = {
        type: 'op',
        content: 'hand',
        meetingId: this.currentMeeting.uid,
        sender: this.currentUser
      }
      this.stompClient.publish({ destination: '/app/ops', body: JSON.stringify(messageWrapper) });
    }
  },
  created() {
    this.initStompClient()
  },
  destroyed() {
    this.stompClient.deactivate();
  },
  mounted() {
    /* eslint-disable-next-line dot-notation */
    const meeting = this.$store.getters['meeting']
    // TODO Change to your own server ip
    const pullUrl = 'http://yourserveriphere:8080/live?port=1935&app=myapp&stream=' + meeting.streamId
    
    console.log(pullUrl)

    if (flvjs.isSupported()) {
      var videoElement = document.getElementById('videoElement');
      var flvPlayer = flvjs.createPlayer({
        type: 'flv',
        url: pullUrl
      });
      flvPlayer.attachMediaElement(videoElement);
      flvPlayer.load();
      flvPlayer.play();
    }
  }
}
</script>

<style type='scss' scoped>
.button-bar {
  margin-top: 2rem;
}
</style>
