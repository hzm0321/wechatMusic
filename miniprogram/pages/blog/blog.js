// pages/blog/blog.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modalShow: false, //是否显示弹出层
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 发布
   */
  onPublish() {
    // 判断用户是否授权
    wx.getSetting({
      success: res => {
        // 如果用户已经授权
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              this.onLoginSuccess({
                detail: res.userInfo
              })
            }
          });
        } else {
          this.setData({
            modalShow: true
          })
        }
      }
    })
  },

  /**
   * 登录成功
   */
  onLoginSuccess(event) {
    const {detail: {nickName, avatarUrl}} = event;
    console.log('登录成功', nickName, avatarUrl)
    wx.navigateTo({
      url: `../blog-edit/blog-edit?nickName=${nickName}&avatarUrl=${avatarUrl}`,
    })
  },

  /**
   * 登录失败
   */
  onLoginFail() {
    wx.showModal({
      title: '授权用户才能发布',
      content: '',
    })
  }
})
