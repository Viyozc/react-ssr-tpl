import React from "react";
import Koa, { Context, Next } from 'koa';
import Router from "koa-router";
import { renderToString } from "react-dom/server";
import App from '@client/index';
import Html from '@server/services/render'

const router = new Router();
router.get('/', async (ctx: Context, next: Next) => {
  console.log(ctx.state.assets)
  const html = renderToString(<Html><App /></Html>);

  ctx.body = html;

})

export default router;