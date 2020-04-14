// pages/playlist/playlist.js
const MAX_LIMIT = 15; // 获取歌单的数量
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: '',
    swipeImgUrls: [
      {
        url: 'http://p1.music.126.net/oeH9rlBAj3UNkhOmfog8Hw==/109951164169407335.jpg',
      },
      {
        url: 'http://p1.music.126.net/xhWAaHI-SIYP8ZMzL9NOqg==/109951164167032995.jpg',
      },
      {
        url: 'http://p1.music.126.net/Yo-FjrJTQ9clkDkuUCTtUg==/109951164169441928.jpg',
      }
    ],
    playlist: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getPlaylist()
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
    this.setData({
      playlist: []
    })
    this._getPlaylist()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this._getPlaylist()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 获取首页电台列表
   * @private
   */
  _getPlaylist() {
    wx.showLoading({
      title: '歌单加载中',
    })
    wx.cloud.callFunction({
      name: 'music',
      data: {
        $url: 'playlist',
        start: this.data.playlist.length,
        count: MAX_LIMIT,
      }
    }).then(res => {
      const {data} = res.result
      if (data.length > 0) {
        this.setData({
          playlist: [...this.data.playlist, ...data]
        });
        wx.stopPullDownRefresh();
        wx.hideLoading();
      } else {
        wx.hideLoading();
        wx.showToast({
          title: '已经没有更多了',
          icon: 'error',
          duration: 1500
        })
      }
    })
  }
})
