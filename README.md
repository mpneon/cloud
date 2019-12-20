# @mpneon/cloud

> 微信小程序云函数框架

## 特性
- 云函数路由（代码共享）

## Usage

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

## License

MIT Licensed.