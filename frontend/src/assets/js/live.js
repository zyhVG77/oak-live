const { parse } = require('ffmpeg-device-list-parser');
const ffmpeg = require('fluent-ffmpeg');
// const { ipcRenderer } = require('electron')

const LiveUtils = {
  getDevices: function (path) {
    // ipcRenderer.invoke('perform-action')
    // console.log(store.getters)
    return new Promise(resolve => {
      parse({ ffmpegPath: path }).then(d => resolve(d))
    })
  },
  streaming: function (config) {
    return new Promise((resolve, reject) => {
      const videoInput = config.videoDevice
      const audioInputs = config.audioDevices
      const streamUrl = config.streamUrl
      const ffmpegPath = config.ffmpegPath
      // const onError = config.onError

      if (!videoInput && (!audioInputs || audioInputs.length === 0)) {
        reject(new Error('没有输入设备'))
      }

      var command = ffmpeg().setFfmpegPath(ffmpegPath)
      if (audioInputs && audioInputs.length > 0) {
        for (let i = 0; i < audioInputs.length; ++i) {
          command.input(`audio=${audioInputs[i]}`)
            .inputOptions([
              '-f dshow',
              '-rtbufsize 60M'
            ])
        }
        // Add a audio mix in case of more than one audio inputs
        if (audioInputs.length > 1) {
          // command.audioFilter(`amix=inputs=${audioInputs.length}`)
          command.complexFilter([
            {
              filter: 'amix',
              options: {
                inputs: audioInputs.length
              }
            }
          ])
        }
        command.audioCodec('libmp3lame')
      } else {
        command.noAudio()
      }
      if (videoInput) {
        command.input(`video=${videoInput}`)
          .inputOptions([
            '-f dshow',
            '-rtbufsize 500M'
          ])
          .size('240x?').aspect('4:3')
          .videoCodec('libx264')
      } else {
        command.noVideo();
      }

      // Add listeners
      command
        .on('start', function(commandLine) {
          console.log('【start】Spawned Ffmpeg with command: ' + commandLine)
          resolve(command)
        })
        .on('codecData', function(data) {
          console.log('【codecData】Input is ' + data.audio + ' audio ' +
            'with ' + data.video + ' video');
        })
        .on('stderr', function(stderrLine) {
          console.log('【stderr】Stderr output: ' + stderrLine);
        })
        .on('error', function(err, stdout, stderr) {
          console.log('【error】Cannot process video: ' + err.message);
          // onError()
        })
        .on('end', function() {
          console.log('【end】Processing finished !');
        })

      command.addOption('-preset', 'superfast')
        .format('flv')
        // .output('rtmp://47.117.139.250:1935/myapp/live', { end: true })
        .output(streamUrl, { end: true })
        .run()
      // command.on('data', function(chunk) {
      //   console.log('ffmpeg just wrote ' + chunk.length + ' bytes');
      // });
      // setTimeout(function () {
      //   command.kill()
      // }, 60000)
    })
  }
}

export default LiveUtils
