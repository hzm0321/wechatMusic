// components/bottom-modal/bottom-modal.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    modalShow: {
      type: Boolean,
      value: true
    }
  },

  options: {
    styleIsolation: 'apply-shared', // 启用外部样式
    multipleSlots: true, // 启用多个插槽
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
     * 关闭弹框
     */
    onClose() {
      this.setData({
        modalShow: false
      })
    }
  }
})
