<template>
  <div class='live-container'>
    <h2>会议直播</h2>
    <h3>当前在线人数：1</h3>
    <video id='videoElement' controls autoplay muted width="200" height="200"></video>
    <chat-hub></chat-hub>
  </div>
</template>

<script>
import flvjs from 'flv.js'
import ChatHub from '@/components/ChatHub'

export default {
  name: 'LiveStream',
  components: { 'chat-hub': ChatHub },
  mounted() {
    if (flvjs.isSupported()) {
      // var videoElement = document.getElementById('videoElement');
      // var flvPlayer = flvjs.createPlayer({
      //   type: 'flv',
      //   url: 'http://47.117.139.250:8080/live?port=1935&app=myapp&stream=live'
      // });
      // flvPlayer.attachMediaElement(videoElement);
      // flvPlayer.load();
      // flvPlayer.play();
    }
  }
}
</script>

<style type='scss' scoped>
</style>
