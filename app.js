// app.js
import {
  promisifyAll
} from 'miniprogram-api-promise'

const wxp = wx.p = {}
promisifyAll(wx, wxp)

App({
  onLaunch() {
  },
  globalData: {
    open_id: '',
    user_id: '',
    weichat: '',
    user_nickname: '',
    user_telphone: '',
    address: '',
    user_name: '',
    token: '',
    // baseUrl: 'http://127.0.0.1:4000',
    baseUrl: 'https://serve.sirbook.top',
  }
})