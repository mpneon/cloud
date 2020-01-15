# @mpneon/cloud

> 微信小程序云函数框架

## 特性
- 云函数路由（代码共享）
- 定时任务（支持多个）

## 起步

新建一个云函数 `neon`，安装 `@mpneon/cloud` 作为它的依赖。

## 用例

### 路由

使用 `app.route()` 方法创建路由。

```javascript
// sum.js
module.exports = (request) => {
    const { a, b } = request.event

    return a + b
}
```

```javascript
// index.js
const app = new (require('@mpneon/cloud').Application)();

app.route('sum', require('./sum'))

exports.main = (event, context) => app.handle(event, context);
```

在小程序端调用时，调用云函数 `neon`，并传入 `$path` 字段表示要访问的函数路由。

```javascript
// app.js
wx.cloud.callFunction({
  // 云函数名称
  name: 'neon',
  // 传给云函数的参数
  data: {
    $path: 'sum',
    a: 1,
    b: 2,
  },
  success: function(res) {
    console.log(res.result) // 3
  },
  fail: console.error
})
```

### 使用云数据库

你可以使用 `use('db')` 方法来获取云数据库实例。

```javascript
// users.js
module.exports = (request) => {
    const db = use('db')

    const { data } = await db.collection('users').get()

    return data
}
```

全局方法 `use()` 还可用于获取其它模块实例，如：
- `use('cloud')` 获取 `wx.cloud`

### 获取当前请求用户

你可以从 `request.user` 字段（异步）获取发起当前请求的用户。

```javascript
// users.js
module.exports = async (request) => {

    const user = await request.user

    return user
}
```

默认情况下，会从云数据库的 `users` 集合中查询 `_id` 为当前 `OPENID` 的记录。如果你需要自定义解析当前用户的方法，使用 `app.useUserResolver((openid, requestcontext) => Promise<any>)`。

```javascript
// index.js

app.route('user', require('./user'))

app.useUserResolver((openid) => new Promise(resolve => {
  const db = use('db')
  // 取 users 集合中 openid 字段为 OPENID 的记录
  db.collection("users")
    .where({
      openid
    })
    .get()
    .then(({ data: users}) => resolve(users[0] || null));
}))

exports.main = (event, context) => app.handle(event, context)
```

### 定时任务

若要使用定时任务，须根据[小程序文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/guide/functions/triggers.html)设置一个**每分钟执行**的定时触发器。

```json
// config.json
{
  "triggers": [
    {
      "name": "neon.schedule",
      "type": "timer",
      "config": "0 * * * * * *"
    }
  ]
}
```

然后使用 `app.cron()` 方法注册你的定时任务。

```javascript
// task.js
module.exports = (request) => {
    console.log('Taske invoked every other minute')
}
```

```javascript
// index.js
const app = new (require('@mpneon/cloud').Application)();

app.route('sum', require('./sum'))

app.cron('*/2 * * * *', require('./task'))

exports.main = (event, context) => app.handle(event, context);
```

注意 `app.cron()` 方法只支持标准 Cron 表达式，即不支持秒和年。

## License

MIT Licensed.