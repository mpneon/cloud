# @mpneon/cloud

> 微信小程序云函数框架

## 特性
- 云函数路由（代码共享）

## Usage

### 路由

使用 `app.route()` 方法创建路由。

```javascript
// sum.js
module.exports = (request, { cloud, db, ...context }) => {
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

### 获取当前请求用户 `@since 1.1.0`

你可以从 `request.user` 字段（异步）获取发起当前请求的用户。

```javascript
// user.js
module.exports = async (request, { cloud, db, ...context }) => {

    const user = await request.user

    return user
}
```

默认情况下，会从云数据库的 `users` 集合中查询 `_id` 为当前 `OPENID` 的记录。如果你需要自定义解析当前用户的方法，使用 `app.useUserResolver((openid, requestcontext) => Promise<any>)`。

```javascript
// index.js

app.route('user', require('./user'))

app.useUserResolver((openid, { cloud, db, ...context }) => new Promise(resolve => {
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

### 定时任务 `@since 1.2.0`

若要使用定时任务，须根据[小程序文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/guide/functions/triggers.html)设置一个每分钟执行的定时触发器，然后使用 `app.cron()` 方法注册你的定时任务。

```javascript
// task.js
module.exports = (request, { cloud, db, ...context }) => {
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