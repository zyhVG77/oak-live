import axios from 'axios'

const LiveApi = {
  openMeeting(meeting, success, error) {
    axios.post('/api/open-meeting', meeting)
      .then(resp => {
        success(resp.data)
      })
      .catch(err => error(err))
  },
  joinMeeting(options, success, fail, error) {
    axios.get('/api/join-meeting', { params: { ...options }})
      .then(resp => {
        switch (resp.data.state) {
        case 0:
          error('会议不存在！')
          break
        case 1:
          fail()
          break
        case 2:
          error('密码错误！')
          break
        case 3:
          success(resp.data.meeting)
          break
        default:
          error()
        }
      })
      .catch(err => error(err))
  },
  updateParticipants(meetingId, success) {
    axios.get('/api/get-participants-info?meeting_id=' + meetingId)
      .then(resp => {
        success(resp.data.number, resp.data.participants)
      })
      .catch(err => console.log(err))
  }
}

export default LiveApi
