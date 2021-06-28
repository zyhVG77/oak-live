import axios from 'axios'

const UserApi = {
  login(user, success, fail, error) {
    axios.post('/api/login', user)
      .then(resp => {
        if (resp.data.auth === 'success') {
          success(resp.data.token)
        } else {
          fail(resp.data.reason)
        }
      })
      .catch(err => {
        error(err)
      })
  },
  getUserInfo(success, error) {
    axios.get('/api/get-user-info')
      .then(resp => {
        success(resp.data);
      })
      .catch(err => error(err))
  }
}

export default UserApi
