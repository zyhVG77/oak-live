import LiveUtils from '@/assets/js/live.js'
import LiveApi from '@/api/live'

const state = () => ({
  liveCtx: null,
  ffmpegPath: null,
  devices: null,
  status: 'shut',
  meeting: null,
  numOfPeople: 0,
  participants: []
})

const mutations = {
  setLiveCtx(state, ctx) {
    state.liveCtx = ctx
  },
  setFfmpegPath(state, path) {
    state.ffmpegPath = path
  },
  setDevices(state, devices) {
    state.devices = devices
  },
  changeStatus(state, s) {
    state.status = s
  },
  setMeeting(state, meeting) {
    state.meeting = meeting
  },
  setNumOfPeople(state, num) {
    state.numOfPeople = num
  },
  setParticipants(state, p) {
    state.participants = p
  }
}

const actions = {
  getDevices({state}) {
    return LiveUtils.getDevices(state.ffmpegPath)
  },
  startMeeting({commit}, meeting) {
    return new Promise((resolve, reject) => {
      commit('changeStatus', 'requesting')
      LiveApi.openMeeting(meeting,
        meeting => {
          commit('changeStatus', 'opened')
          commit('setMeeting', meeting)
          resolve()
        },
        err => {
          reject(err)
        }
      )
    })
  },
  startLive({commit, state}, devices) {
    return new Promise((resolve, reject) => {
      commit('setDevices', devices)

      const streamUrl = 'rtmp://47.117.139.250:1935/myapp/' + state.meeting.streamId
      const onError = () => {
        commit('changeStatus', 'error')
      }

      LiveUtils.streaming({ffmpegPath: state.ffmpegPath, streamUrl, onError, ...devices})
        .then(ctx => {
          commit('setLiveCtx', ctx)
          commit('changeStatus', 'living')
          resolve()
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  endLive({commit, state}) {
    return new Promise((resolve, reject) => {
      try {
        state.liveCtx.kill()
        commit('changeStatus', 'shut')
        resolve()
      } catch (err) {
        reject(err)
      }
    })
  },
  joinMeeting({commit}, options) {
    return new Promise((resolve, reject) => {
      LiveApi.joinMeeting(options,
        meeting => {
          commit('setMeeting', meeting)
          resolve(0)
        },
        () => resolve(1),
        err => reject(err)
      )
    })
  },
  updateParticipants({commit, state}) {
    return new Promise((resolve) => {
      LiveApi.updateParticipants(state.meeting.uid,
        (num, p) => {
          commit('setNumOfPeople', num)
          commit('setParticipants', p)
          resolve()
        })
    })
  }
}

const getters = {
  liveCtx: state => state.liveCtx,
  meeting: state => state.meeting,
  status: state => state.status,
  devices: state => state.devices ? state.devices : { videoDevice: null, audioDevices: [] },
  ffmpegPath: state => state.ffmpegPath,
  numOfPeople: state => state.numOfPeople,
  participants: state => state.participants
}

export default {
  namespace: true,
  state,
  getters,
  actions,
  mutations
}
