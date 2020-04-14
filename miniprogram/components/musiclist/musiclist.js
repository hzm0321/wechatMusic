const app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    musiclist: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    playingId: -1
  },

  pageLifetimes:{
    show() {
      this.setData({
        playingId: parseInt(app.getPlayingMusicId())
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 歌曲被选中
     */
    onSelect(event) {
      console.log(event)
      const {musicid,index} = event.currentTarget.dataset
      this.setData({playingId: musicid})
      wx.navigateTo({
        url: `../../pages/player/player?musicId=${musicid}&index=${index}`,
      })
    }
  }
})
