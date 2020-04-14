// pages/player/player.js
// 歌曲列表
let musicList = []
// 正在播放歌曲的index
let nowPlayingIndex = 0
// 获取全局唯一的背景音频播放管理器
const backgroundAudioManager = wx.getBackgroundAudioManager()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picUrl: '', // 背景图片
    isPlaying: false, // 当前是否正在播放
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {musicId, index} = options
    nowPlayingIndex = index
    musicList = wx.getStorageSync('musicList')
    this._loadMusicDetail(musicId)
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
   * 加载歌曲详细信息
   * @param musicId
   * @private
   */
  _loadMusicDetail(musicId) {
    backgroundAudioManager.stop()
    wx.showLoading({
      title: '歌曲加载中'
    })
    let music = musicList[nowPlayingIndex]
    wx.setNavigationBarTitle({
      title: music.name
    })
    this.setData({picUrl: music.al.picUrl})
    wx.cloud.callFunction({
      name: 'music',
      data: {
        musicId,
        $url: 'musicUrl',
      }
    }).then(res => {
      console.log('musicUrl', JSON.parse(res.result))
      const {data} = JSON.parse(res.result)
      backgroundAudioManager.src = data[0].url
      backgroundAudioManager.title = music.name
      backgroundAudioManager.coverImgUrl = music.al.picUrl
      backgroundAudioManager.singer = music.ar[0].name
      backgroundAudioManager.epname = music.al.name
      this.setData({isPlaying: true})
      wx.hideLoading()
    }).catch(err => {
      console.log(err)
      wx.hideLoading()
    })
  },

  /**
   * 切换播放状态
   */
  togglePlaying() {
    const {isPlaying} = this.data;
    isPlaying ? backgroundAudioManager.pause() : backgroundAudioManager.play();
    this.setData({isPlaying: !isPlaying});
  },

  /**
   * 切换上一首歌曲
   */
  onPrev() {
    nowPlayingIndex--
    if (nowPlayingIndex < 0) {
      nowPlayingIndex = musicList.length - 1
    }
    this._loadMusicDetail(musicList[nowPlayingIndex].id)
  },

  /**
   * 切换下一首歌曲
   */
  onNext() {
    nowPlayingIndex++
    if (nowPlayingIndex === musicList.length) {
      nowPlayingIndex = 0
    }
    this._loadMusicDetail(musicList[nowPlayingIndex].id)
  }
})