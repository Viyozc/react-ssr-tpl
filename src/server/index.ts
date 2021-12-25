import Koa from 'koa';
import Router from 'koa-router';
import useAssets from './middlewares/assets'
import dotenv from 'dotenv';
import pageRouter from '@server/routes/pages';
import '@/server/utils/jsdom'
dotenv.config()
const router = new Router();
router.get('/test', async (ctx, next) => {
  ctx.body = 'request ok!'
  await next();
})

const app = new Koa();
app.use(pageRouter.routes());
app.use(router.routes())
app.use(useAssets)

app.use(async (ctx, next) => {
  console.log('request start2')
  await next();
  console.log('request end')
})

app.listen(3000, () => {
  console.log('server ok')
})