// components/login/login.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    modalShow: Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 获取用户信息回调
     */
    onGotUserInfo(event) {
      console.log('登陆信息回调', event)
      const {userInfo} = event.detail
      console.log({userInfo})
      if (userInfo) {
        this.setData({
          modalShow: false
        })
        console.log('发送事件')
        this.triggerEvent('loginsuccess', userInfo)
      } else {
        this.triggerEvent('loginfail')
      }
    }
  }
})
