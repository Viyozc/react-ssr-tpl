import { JSDOM } from 'jsdom';
/**
* 使用jsdom虚拟化window对象，以免使用SSR的时候报错
*/
const DOM = new JSDOM(`<html><body></body></html>`, {
  url: 'https://www.aomao.com',
  resources: 'usable',
  // runScripts: global.UNSAFE_MODE
  //   ? 'dangerously'
  //   : 'outside-only'
});
global.window = DOM.window as any;
global.document = global.window.document
global.navigator = global.window.navigator
//因为有些时候我们为了方便直接使用 Node 或者 navigator使用
//并没有window.Node window.navigator 所以也得把这些在window下常用的对象扩展到global中
global.requestAnimationFrame = global.window.requestAnimationFrame
global.cancelAnimationFrame = global.window.cancelAnimationFrame
global.Node = global.window.Node
global.NodeList = global.window.NodeList
global.DOMParser = global.window.DOMParser