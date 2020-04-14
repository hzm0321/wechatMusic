// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 调用云数据库
const db = cloud.database()

// 引入接口请求函数
const request = require('request-promise')
// 音乐接口
const URL = 'http://musicapi.xiecheng.live/personalized'

const playlistCollection = db.collection('playlist')

// 每次取出最大的数量
const MAX_LIMIT = 100

// 云函数入口函数
exports.main = async (event, context) => {
  // const list = await playlistCollection.get()
  const {total} = await playlistCollection.count()
  const batchTimes = Math.ceil(total / MAX_LIMIT)
  const tasks = []
  // 读取数据库Promise
  for (let i = 0; i < batchTimes; i++) {
    let promise = playlistCollection.skip(i*MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  let list = []
  // 生成数据库中id数据集合
  if (tasks.length > 0) {
    list = (await Promise.all(tasks)).reduce((acc,cur)=>{
      const curs = [...cur.data].map(item=>item.id)
      return [...acc,...curs]
    },[])
  }
  // 第三方接口获取到的数据
  const playlist = await request(URL).then(res => JSON.parse(res).result)
  // 过滤得到新数据
  const newData = []
  playlist.forEach(item=>{
    const r = list.filter(value => value===item.id)
    if (r.length === 0){
      newData.push(item)
    }
  })
  for (const item of newData) {
      await playlistCollection.add({
        data: {
          ...item,
          createTime: db.serverDate(),// 获取当前云数据库的时间
        }
      }).then(res => {
        console.log('playlist插入成功')
      }).catch(err => {
        console.log(err)
        console.log('playlist插入失败')
      })
  }
  return newData.length
}
