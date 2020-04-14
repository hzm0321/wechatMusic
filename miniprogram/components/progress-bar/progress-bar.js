let movableAreaWidth = 0
let movableViewWidth = 0
const backgroundAudioManager = wx.getBackgroundAudioManager()
// 当前的秒数
let currentSec = -1
// 表示当前进度条是否在拖拽，解决：当进度条拖动时候和updatetime事件有冲突的问题
let isMoving = false

const app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isSame: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showTime: {
      currentTime: '00:00',
      totalTime: '00:00',
    },
    movableDis: 0,
    progress: 0,
  },

  lifetimes: {
    ready() {
      if (this.properties.isSame && this.data.showTime.totalTime === '00:00') {
        this._setTime()
      }
      this._getMovableDis()
      this._bindBGMEvent()
    },
    detached() {
      app.setMusicProgress({
        progress: this.data.progress,
        movableDis: this.data.movableDis
      });
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {

    /**
     * 监听进度条改变
     * @param event
     */
    onChange(event) {
      // console.log(event)
      const {source, x} = event.detail
      // console.log(source)
      if (source === 'touch') {
        this.data.progress = x / (movableAreaWidth - movableViewWidth) * 100;
        this.data.movableDis = x
        isMoving = true
        // console.log('start',isMoving)
      }
    },

    /**
     * 拖动松开时触发
     */
    onTouchEnd(v) {
      const {currentTime, duration} = backgroundAudioManager
      const {progress,movableDis} = app.getMusicProgress()
      this.setData({
        progress: typeof v !== 'object' ? progress : this.data.progress,
        movableDis: typeof v !== 'object' ? movableDis : this.data.movableDis,
        ['showTime.currentTime']: this._formatDate(currentTime)
      })
      console.log('触发了', this.data.progress)
      backgroundAudioManager.seek(duration * this.data.progress / 100)
      isMoving = false
      // console.log('end',isMoving)
    },

    /**
     * 获取滑块宽度
     * @private
     */
    _getMovableDis() {
      // 获取当前元素实例
      const query = this.createSelectorQuery();
      query.select('.movable-area').boundingClientRect();
      query.select('.movable-view').boundingClientRect();
      query.exec(rect => {
        movableAreaWidth = rect[0].width
        movableViewWidth = rect[1].width
      })
    },

    /**
     * 绑定播放器
     * @private
     */
    _bindBGMEvent() {
      backgroundAudioManager.onPlay(() => {
        isMoving = false
        console.log('onPlay')
        this.triggerEvent('musicPlay')
      })

      backgroundAudioManager.onStop(() => {
        console.log('onStop')
      })

      backgroundAudioManager.onPause(() => {
        console.log('Pause')
        this.triggerEvent('musicPause')
      })

      backgroundAudioManager.onWaiting(() => {
        console.log('onWaiting')
      })

      backgroundAudioManager.onCanplay(() => {
        console.log('onCanplay')
        this._setTime();
      })

      backgroundAudioManager.onTimeUpdate(() => {
        // console.log('onTimeUpdate')
        if (!isMoving) {
          const {currentTime, duration} = backgroundAudioManager;
          const sec = Math.floor(currentTime % 60).toString().padStart(2, '0');
          if (sec != currentSec) {
            this.setData({
              movableDis: (movableAreaWidth - movableViewWidth) * (currentTime / duration),
              progress: currentTime / duration * 100,
              ['showTime.currentTime']: this._formatDate(currentTime)
            });
            currentSec = sec;
            // 联动歌词
            this.triggerEvent('timeUpdate', {
              currentTime
            });
          }
        }
      })

      backgroundAudioManager.onEnded(() => {
        console.log('onEnded')
        // 向父元素发送事件
        this.triggerEvent('musicEnd')
      })

      backgroundAudioManager.onError((res) => {
        console.log('onError')
      })
    },

    /**
     * 设置音乐播放时间到界面上显示
     * @private
     */
    _setTime() {
      const {duration} = backgroundAudioManager;
      if (typeof duration !== "undefined") {
        this.setData({
          ['showTime.totalTime']: this._formatDate(duration)
        })
      } else {
        setTimeout(() => {
          this._setTime()
        }, 500)
      }
    },

    /**
     * 格式化时间
     * @param {Number} v
     * @returns {string}
     * @private
     */
    _formatDate(v) {
      const min = Math.floor(v / 60).toString().padStart(2, '0');
      const sec = Math.floor(v % 60).toString().padStart(2, '0');
      return `${min}:${sec}`
    }
  }
})
