// 歌曲列表
let musicList = []

// 正在播放歌曲的index
let nowPlayingIndex = 0

// 获取全局唯一的背景音频播放管理器
const backgroundAudioManager = wx.getBackgroundAudioManager()

// 获取全局属性
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    picUrl: '', // 背景图片
    isPlaying: false, // 当前是否正在播放
    isLyricShow: false, // 表示当前歌词是否显示
    isSame: false, // 表示是否为同一首歌
    lyric: '', // 歌词
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
    // 优先判断是否为同一首歌
    if (musicId === app.getPlayingMusicId()) {
      this.setData({
        isSame: true
      });
    } else {
      this.setData({
        isSame: false
      });
    }
    if (!this.data.isSame) {
      backgroundAudioManager.stop()
    }
    // 设置选中的列表颜色
    app.setPlayingMusicId(musicId);

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
      // vip歌曲
      if (data[0].url == null) {
        wx.showToast({
          title: '无权限播放',
        })
        return
      }
      if (!this.data.isSame) {
        backgroundAudioManager.src = data[0].url
        backgroundAudioManager.title = music.name
        backgroundAudioManager.coverImgUrl = music.al.picUrl
        backgroundAudioManager.singer = music.ar[0].name
        backgroundAudioManager.epname = music.al.name
      }
      // 如果歌曲相同并且之前是暂停状态
      console.log('back', backgroundAudioManager.paused)
      const {paused} = backgroundAudioManager
      if (typeof paused === "undefined" || !this.data.isSame) {
        this.setData({isPlaying: true});
      }else if (typeof paused === "boolean" && paused) {
        this.setData({isPlaying: false});
        // 更新进度条进度
        this.selectComponent('#progress').onTouchEnd(true);
      }else if (typeof paused === "boolean" && !paused) {
        this.setData({isPlaying: true});
      }

      // 加载歌词
      wx.cloud.callFunction({
        name: 'music',
        data: {
          musicId,
          $url: 'lyric',
        }
      }).then(res => {
        const {lrc} = JSON.parse(res.result);
        let lyric = lrc ? lrc.lyric : '暂无歌词';
        this.setData({lyric});
      })
    }).catch(err => {
      console.log(err)
      wx.hideLoading()
    })
    wx.hideLoading();
  },

  /**
   * 点击了播放/暂停,切换播放状态
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
  },

  /**
   * 监听播放
   */
  onPlay() {
    this.setData({
      isPlaying: true,
    })
  },

  /**
   * 监听暂停
   */
  onPause() {
    this.setData({
      isPlaying: false,
    })
  },

  /**
   * 切换歌词
   */
  onChangeLyricShow() {
    this.setData({
      isLyricShow: !this.data.isLyricShow
    })
  },

  /**
   * 根据当前时间更新当前歌词状态
   */
  timeUpdate(event) {
    // 父组件调用子组件方法
    this.selectComponent('.lyric').update(event.detail.currentTime)
  }
})
