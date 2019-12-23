# @mpneon/cloud

> 微信小程序云函数框架

## 特性
- 云函数路由（代码共享）

## Usage

### 路由

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

## License

MIT Licensed.