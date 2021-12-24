import Koa from 'koa';
import Router from 'koa-router';

const router = new Router();
router.get('/test', async (ctx, next) => {
  ctx.body = 'request ok'
  await next();
})

const app = new Koa();

app.use(router.routes())

app.use(async (ctx, next) => {
  console.log('request start')
  await next();
  console.log('request end')
})

app.listen(3000, () => {
  console.log('server ok')
})