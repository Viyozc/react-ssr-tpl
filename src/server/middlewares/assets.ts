import { Context } from "koa";
import path from 'path';
const assetsPath = path.resolve(__dirname, './assets.json');
console.log(assetsPath)
// const assets = require('${assetsPath}');
const assets = eval(`require('${assetsPath}')`);
export default async (ctx: Context, next: any) => {
  ctx.state.assets = assets;
  console.log(123, assets)
  await next();
}