const state = () => ({
  videoDevice: null,
  audioDevices: []
})

const mutations = {
  set_video_device: function(state, v) {
    state.videoDevice = v
  },
  set_audio_devices: function(state, a) {
    state.audioDevices = a
  }
}

const actions = {

}

const getters = {
  currentVideoDevice: state => state.videoDevice,
  currentAudioDevices: state => state.audioDevices
}

export default {
  namespace: true,
  state,
  getters,
  actions,
  mutations
}
