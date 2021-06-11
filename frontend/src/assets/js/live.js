// import store from '@/store'

const { parse } = require('ffmpeg-device-list-parser');
const ffmpeg = require('fluent-ffmpeg');
// const { ipcRenderer } = require('electron')

const options = {
  ffmpegPath: 'D:\\development\\tools\\ffmpeg-4.3.1-2020-09-21-full_build\\bin\\ffmpeg.exe'
}

const LiveUtils = {
  getDevices: function (callback) {
    // ipcRenderer.invoke('perform-action')
    // console.log(store.getters)
    parse(options).then(d => callback(d))
  },
  streaming: function (config, success, error) {
    const videoInput = config.videoInput
    const audioInputs = config.audioInputs
    if (!videoInput && (!audioInputs || audioInputs.length === 0)) {
      error('没有输入设备')
      return
    }

    var command = ffmpeg().setFfmpegPath('D:\\development\\tools\\ffmpeg-4.3.1-2020-09-21-full_build\\bin\\ffmpeg.exe')

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
        console.log('Spawned Ffmpeg with command: ' + commandLine)
        success()
      })
      .on('codecData', function(data) {
        console.log('Input is ' + data.audio + ' audio ' +
          'with ' + data.video + ' video');
      })
      .on('stderr', function(stderrLine) {
        console.log('Stderr output: ' + stderrLine);
      })
      .on('error', function(err, stdout, stderr) {
        console.log('Cannot process video: ' + err.message);
      })
      .on('end', function() {
        console.log('Processing finished !');
      })

    command.addOption('-preset', 'superfast')
      .format('flv')
      .output('rtmp://47.117.139.250:1935/myapp/live', { end: true })
      .run()

    command.on('data', function(chunk) {
      console.log('ffmpeg just wrote ' + chunk.length + ' bytes');
    });

    setTimeout(function () {
      command.kill()
    }, 60000)
  }
}

export default LiveUtils
