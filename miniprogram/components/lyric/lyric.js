// 歌词高度
let lyricHeight = 0

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isLyricShow: {
      type: Boolean,
      value: true,
    },
    lyric: String,
  },

  observers: {
    lyric(lrc) {
      if (lrc === '暂无歌词') {
        this.setData({
          lrcList: [{
            lrc,
            time: 0,
          }],
          nowLyricIndex: -1
        })
      } else {
        this._parseLyric(lrc)
      }
    }
  },

  lifetimes:{
    ready() {
      // 750rpx
      // 获取手机信息
      wx.getSystemInfo({
        success(res) {
          // console.log(res)
          // 求出1rpx的大小
          lyricHeight = res.screenWidth / 750 * 64
        },
      })
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    lrcList: [], // 歌词列表,{lrc,time}
    nowLyricIndex: 0, // 当前选中的歌词的索引
    scrollTop: 0, // 滚动条滚动的高度
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 格式化歌词
     * @param sLyric
     * @private
     */
    _parseLyric(sLyric) {
      let lines = sLyric.split('\n')
      let _lrcList = []
      lines.forEach(item => {
        let time = item.match(/\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g);
        if (time != null) {
          let lrc = item.split(time)[1]
          let timeReg = time[0].match(/(\d{2,}):(\d{2})(?:\.(\d{2,3}))?/)
          // 把时间转换为秒
          let timeToSeconds = parseInt(timeReg[1]) * 60 + parseInt(timeReg[2]) + parseInt(timeReg[3]) / 1000
          _lrcList.push({
            lrc,
            time: timeToSeconds,
          })
        }
      })
      this.setData({
        lrcList: _lrcList
      })
    },

    /**
     * 更新当前选中歌词
     */
    update(currentTime) {
      const {lrcList} = this.data;
      if (lrcList.length === 0) {
        return
      }
      // 若当前选中时间超过歌曲最后一句歌词所在的时间
      if (currentTime > lrcList[lrcList.length - 1].time) {
        if (this.data.nowLyricIndex !== -1) {
          this.setData({
            nowLyricIndex: -1,
            scrollTop: lrcList.length * lyricHeight
          })
          return;
        }
      }
      for (let i = 0; i < lrcList.length; i++) {
        if (currentTime <= lrcList[i].time) {
          this.setData({
            nowLyricIndex: i - 1,
            scrollTop: (i - 1) * lyricHeight
          })
          console.log(this.data.scrollTop)
          break
        }
      }
    }
  }
})
