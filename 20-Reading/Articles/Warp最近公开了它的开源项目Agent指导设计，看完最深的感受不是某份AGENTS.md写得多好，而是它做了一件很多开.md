---
type: article
title: "Warp最近公开了它的开源项目Agent指导设计，看完最深的感受不是某份AGENTS.md写得多好，而是它做了一件很多开源项目还没意识到的事：把项"
source: wechat
source_url: https://mp.weixin.qq.com/s/03O5i8CiGrzm70r-wBS_bA
author: ""
category: ai-coding
status: unread
read_at: 
rating: 
dedup_key: url:6a51dc306f20d947314ff182ebd0e9431c5138251deb3a62f0400b49fbd4a948
added: 2026-06-28
needs_review: true
---

# Warp最近公开了它的开源项目Agent指导设计，看完最深的感受不是某份AGENTS.md写得多好，而是它做了一件很多开源项目还没意识到的事：把项

本地 Worker 已保存该网页/公众号文章快照；原始链接可能会失效，Obsidian 笔记作为本地副本。

## Excerpt
Warp最近公开了它的开源项目Agent指导设计，看完最深的感受不是某份AGENTS.md写得多好，而是它做了一件很多开源项目还没意识到的事：把项目维护本身做成了一套Agent-Native工作流。\x0a\x0aIssue triage、spec编写、代码实现、PR review、CI诊断——这些开源维护的常规环节，在Warp的仓库里都被流程化了，每一步都有清晰的Agent可执行入口和产出规范。\x0a\x0a说白了就是，Warp不是在教Agent怎么帮忙写代码，而是在教Agent怎么帮忙维护一个开源项目。这比写好一份AGENTS.md的价值大得多。当别的项目还在纠结「要不要在README里加个AI使用说明」的时候，Warp已经把Agent作为一等公民嵌入到整个开发流程里了。\x0a\x0a这套思路对任何打算引入AI Agent协作的开源项目都有参考意义。不是给AI开个后门，而是把整条流水线重构成Agent能直接参与运转的形态。\x0a\x0a点赞+关注，也许是对你有用的信息

## Snapshot Text
知道了 
 
 
 

 
 

 
 
 
 
 微信扫一扫
使用小程序 
 
 
 
 
 
 
 
 
 
 
 
 
 取消 
 允许 
 
 
 
 
 
 
 
 
 
 
 
 
 取消 
 允许 
 
 
 
 
 
 
 
 
 
 
 
 
 取消 
 允许 
 
 
 

 
 × 
 分析 
 

 
 
 
 
 
 
 
 
 
 
 
 
 
 微信扫一扫可打开此内容，
使用完整服务

 
 
 

 
 

 ： 
 ， 
 ， 
 ， 
 ， 
 ， 
 ， 
 ， 
 ， 
 ， 
 ， 
 ， 
 ， 
 。 
   

 视频 
 小程序 

 赞 
 ，轻点两下取消赞 
 在看 
 ，轻点两下取消在看 
 分享 
 留言 
 收藏 
 听过 

 
 
 

 

 
 var __INLINE_SCRIPT__ = (function (exports, o$7) {
 'use strict';

 function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

 var o__default = _interopDefaultLegacy(o$7);

 

 

 var __setTitle = function __setTitle(showTitle, itemShowType) {
 var dom = document.getElementById('activity-name');
 if (+itemShowType === 5) dom = document.getElementById('js_video_page_title');else if (+itemShowType === 7) dom = document.getElementById('js_audio_title');else if (+itemShowType === 10) dom = document.getElementById('js_text_title');
 if (!dom) return;
 var title = showTitle;
 if (showTitle.indexOf('——') > -1) {
 var replaceHtml = ' —— ';
 showTitle = showTitle.replace(/——/g, replaceHtml);
 }
 if (typeof window.__emojiFormat === 'function') {
 var emojiTitle = window.__emojiFormat(showTitle);
 showTitle = emojiTitle;
 }
 if (dom) {
 if (dom.innerHTML) dom.innerHTML = dom.innerHTML.replace(title, showTitle);else dom.innerHTML = showTitle;
 }
 };
 function setProfileName() {
 var ua = window.navigator.userAgent;
 if (/wxwork/i.test(ua)) {
 var profileName = document.getElementById('js_name');
 var authorName = document.getElementById('js_author_name');
 var accountNames = document.getElementsByClassName('account_nickname_inner');
 if (profileName) {
 profileName.classList.add('tips_global_primary');
 }
 if (authorName) {
 authorName.classList.add('tips_global_primary');
 }
 if (accountNames && accountNames.length) {
 accountNames[0].classList.add('tips_global_primary');
 }
 }
 }
 var setImmersiveMode = function setImmersiveMode(itemShowType) {
 var envStr = window.__wxWebEnv && typeof window.__wxWebEnv.getEnv === 'function' && window.__wxWebEnv.getEnv();
 if (!envStr) return;
 var envObj = {};
 if (!envStr) return;
 try {
 envObj = JSON.parse(envStr);
 } catch (err) {
 console.info(err);
 }
 var immersiveListMode = envObj.immersiveListMode || 0;
 window.__immersiveListMode = Number(immersiveListMode) === 1 ? 1 : 0;
 window.__test_immersive_list = 0;
 if (window.__test_immersive_list) {
 window.__immersiveListMode = 1;
 }
 var wxExpandArticleEle = document.getElementById('wx_expand_article');
 document.getElementById('js_article');
 var bottomLoadingTip = document.getElementById('js_network_msg_wrp');
 if (!itemShowType && itemShowType !== 0) {
 itemShowType = window.item_show_type;
 }
 itemShowType = Number(itemShowType);

 if (window.__immersiveListMode) {
 try {
 var immersiveSafeBottom = localStorage.getItem('__immersivefeed_safe_bottom__');
 if (immersiveSafeBottom) {
 document.documentElement.style.setProperty('--immersive-safe-bottom', immersiveSafeBottom);
 }
 } catch (error) {
 console.log(error);
 }
 if (wxExpandArticleEle) {
 wxExpandArticleEle.style.display = 'block';
 }
 if (bottomLoadingTip) {
 bottomLoadingTip.style.display = 'none';
 }
 if (itemShowType === 10 || itemShowType === 7) {
 document.body.classList.add('ellapse_short_content');
 } else {
 document.body.classList.add('ellapse_stream_article');
 }
 if (itemShowType === 0) {
 document.body.classList.add('article_extensive_background');
 } else {
 document.body.classList.add('media_content_extensive_background');
 }
 var interactionPlaceholderEle = document.getElementById('js_interaction_placeholder');
 if (interactionPlaceholderEle) {
 interactionPlaceholderEle.style.display = 'block';
 }
 }
 };

 function _typeof$3(obj) {
 "@babel/helpers - typeof";

 return _typeof$3 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
 return typeof obj;
 } : function (obj) {
 return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
 }, _typeof$3(obj);
 }

 function asyncGeneratorStep$1(gen, resolve, reject, _next, _throw, key, arg) {
 try {
 var info = gen[key](arg);
 var value = info.value;
 } catch (error) {
 reject(error);
 return;
 }
 if (info.done) {
 resolve(value);
 } else {
 Promise.resolve(value).then(_next, _throw);
 }
 }
 function _asyncToGenerator$1(fn) {
 return function () {
 var self = this,
 args = arguments;
 return new Promise(function (resolve, reject) {
 var gen = fn.apply(self, args);
 function _next(value) {
 asyncGeneratorStep$1(gen, resolve, reject, _next, _throw, "next", value);
 }
 function _throw(err) {
 asyncGeneratorStep$1(gen, resolve, reject, _next, _throw, "throw", err);
 }
 _next(undefined);
 });
 };
 }

 function _regeneratorRuntime$6() { _regeneratorRuntime$6 = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof$3(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw new Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o = 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc = 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc = 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
 
 var doc$1 = {};
 var isAcrossOrigin$1 = false;
 var notFoundedMPPageAction = [];
 var __moon_report$1 = window.__moon_report || function () {};
 var MOON_JSAPI_KEY_OFFSET = 8;
 try {
 doc$1 = top.window.document;
 } catch (e) {
 isAcrossOrigin$1 = true;
 }
 if (!window.JSAPIEventCallbackMap) {
 window.JSAPIEventCallbackMap = {};
 }
 function ready(onBridgeReady) {
 var bridgeReady = function bridgeReady() {
 try {
 if (onBridgeReady) {
 window.onBridgeReadyTime = window.onBridgeReadyTime || Date.now();
 onBridgeReady();
 }
 } catch (e) {
 __moon_report$1([{
 offset: MOON_JSAPI_KEY_OFFSET,
 log: 'ready',
 e: e
 }]);
 throw e;
 }
 window.jsapiReadyTime = Date.now();
 };
 if (!isAcrossOrigin$1 && (typeof top.window.WeixinJSBridge === 'undefined' || !top.window.WeixinJSBridge.invoke)) {
 if (doc$1.addEventListener) {
 doc$1.addEventListener('WeixinJSBridgeReady', bridgeReady, false);
 } else if (doc$1.attachEvent) {
 doc$1.attachEvent('WeixinJSBridgeReady', bridgeReady);
 doc$1.attachEvent('onWeixinJSBridgeReady', bridgeReady);
 }
 } else {
 bridgeReady();
 }
 }
 var invokeNotWaitA8key = ['notifyPageInfo', 'updatePageAuth'
 ];
 var checkNotFoundedInvoke = function checkNotFoundedInvoke(methodName, args) {
 if (methodName === 'handleMPPageAction' && (args === null || args === void 0 ? void 0 : args.action) && notFoundedMPPageAction.includes(args === null || args === void 0 ? void 0 : args.action)) {
 return true;
 }
 return false;
 };
 function invoke$1(_x, _x2, _x3) {
 return _invoke.apply(this, arguments);
 }
 function _invoke() {
 _invoke = _asyncToGenerator$1( _regeneratorRuntime$6().mark(function _callee(methodName, args, callback) {
 return _regeneratorRuntime$6().wrap(function _callee$(_context) {
 while (1) switch (_context.prev = _context.next) {
 case 0:
 if (!(window.__secPageAuthPromise && !window.__is_page_auth_ok__ && !invokeNotWaitA8key.includes(methodName))) {
 _context.next = 3;
 break;
 }
 _context.next = 3;
 return window.__secPageAuthPromise;
 case 3:
 ready(function () {
 if (isAcrossOrigin$1) return false;
 if (_typeof$3(top.window.WeixinJSBridge) !== 'object') {
 alert('请在微信中打开此链接');
 return false;
 }
 if (checkNotFoundedInvoke(methodName, args)) {
 setTimeout(function () {
 if (callback) {
 callback.apply(window, [{
 err_msg: "".concat(methodName, ":fail"),
 err_desc: 'action isn\'t supported'
 }]);
 }
 }, 0);
 } else {
 top.window.WeixinJSBridge.invoke(methodName, args, function () {
 try {
 for (var _len2 = arguments.length, rets = new Array(_len2), _key2 = 0; _key2 ".concat(ret.err_msg) : '';
 if (['handleMPPageAction', 'handleVideoAction', 'handleHaokanAction'].indexOf(methodName) !== -1) {
 var action = (args === null || args === void 0 ? void 0 : args.action) || '';
 console.info('[system]', "[jsapi] invoke->".concat(methodName, ", action->").concat(action).concat(errMsg));
 } else {
 console.info('[system]', "[jsapi] invoke->".concat(methodName).concat(errMsg));
 }
 if (methodName === 'handleMPPageAction' && (args === null || args === void 0 ? void 0 : args.action) && ((ret === null || ret === void 0 ? void 0 : ret.err_desc) === 'action isn\'t supported' || (ret === null || ret === void 0 ? void 0 : ret.err_msg) === 'handleMPPageAction:fail action is not supported')) {
 notFoundedMPPageAction.push(args === null || args === void 0 ? void 0 : args.action);
 }
 if (callback) {
 callback.apply(window, rets);
 }
 } catch (e) {
 __moon_report$1([{
 offset: MOON_JSAPI_KEY_OFFSET,
 log: "invoke;methodName:".concat(methodName),
 e: e
 }]);
 throw e;
 }
 });
 }
 });
 case 4:
 case "end":
 return _context.stop();
 }
 }, _callee);
 }));
 return _invoke.apply(this, arguments);
 }
 function call(_x4) {
 return _call.apply(this, arguments);
 }
 function _call() {
 _call = _asyncToGenerator$1( _regeneratorRuntime$6().mark(function _callee2(methodName) {
 return _regeneratorRuntime$6().wrap(function _callee2$(_context2) {
 while (1) switch (_context2.prev = _context2.next) {
 case 0:
 if (!(window.__secPageAuthPromise && !window.__is_page_auth_ok__)) {
 _context2.next = 3;
 break;
 }
 _context2.next = 3;
 return window.__secPageAuthPromise;
 case 3:
 ready(function () {
 if (isAcrossOrigin$1) return false;
 if (_typeof$3(top.window.WeixinJSBridge) !== 'object') {
 return false;
 }
 try {
 top.window.WeixinJSBridge.call(methodName);
 } catch (e) {
 __moon_report$1([{
 offset: MOON_JSAPI_KEY_OFFSET,
 log: "call;methodName:".concat(methodName),
 e: e
 }]);
 throw e;
 }
 });
 case 4:
 case "end":
 return _context2.stop();
 }
 }, _callee2);
 }));
 return _call.apply(this, arguments);
 }
 function on$2(eventName, callback) {
 ready(function () {
 if (isAcrossOrigin$1) return false;
 if (_typeof$3(top.window.WeixinJSBridge) !== 'object' || !top.window.WeixinJSBridge.on) {
 return false;
 }
 if (!window.JSAPIEventCallbackMap[eventName]) {
 window.JSAPIEventCallbackMap[eventName] = [];
 }
 window.JSAPIEventCallbackMap[eventName].push(callback);
 if (window.JSAPIEventCallbackMap[eventName].length > 1) {
 return false;
 }
 top.window.WeixinJSBridge.on(eventName, function () {
 try {
 for (var _len = arguments.length, rets = new Array(_len), _key = 0; _key ".concat(ret.err_msg) : '';
 console.info('[system]', "[jsapi] event->".concat(eventName).concat(errMsg));
 if (window.JSAPIEventCallbackMap[eventName] && window.JSAPIEventCallbackMap[eventName].length) {
 var result;
 for (var i = 0; i = 0; i--) {
 if (window.JSAPIEventCallbackMap[eventName][i] === callback) {
 window.JSAPIEventCallbackMap[eventName].splice(i, 1);
 result = true;
 }
 }
 return result;
 });
 }
 var R$4 = {
 ready: ready,
 invoke: invoke$1,
 call: call,
 on: on$2,
 remove: remove$1
 };

 function initBodyStyle() {
 window.scrollTo({
 top: 0,
 behavior: 'smooth'
 });
 setTimeout(function () {
 document.body.scrollTop = document.documentElement.scrollTop = 0;
 document.body.style.overflow = 'hidden';
 }, 100);
 }
 var setRowImmersiveMode = function setRowImmersiveMode(itemShowType) {
 var envStr = window.__wxWebEnv && typeof window.__wxWebEnv.getEnv === 'function' && window.__wxWebEnv.getEnv();
 if (!envStr) return;
 var envObj = {};
 try {
 envObj = JSON.parse(envStr);
 } catch (err) {
 console.info(err);
 }
 var immersiveListMode = envObj.immersiveListMode || 0;
 window.__immersiveListMode = Number(immersiveListMode) === 1 ? 1 : 0;
 window.__rowImmersiveStream = Number(immersiveListMode) === 2 ? 1 : 0;
 console.log("iiiiiiimmersiveListMode", immersiveListMode, window.__immersiveListMode, window.__rowImmersiveStream);
 window.__test_row_immersive_list = 0;
 if (window.__test_row_immersive_list) {
 window.__rowImmersiveStream = 1;
 }
 if (window.__rowImmersiveStream) {
 initBodyStyle();
 var rowImmersiveStreamWrap = document.getElementById('js_row_immersive_stream_wrap');
 if (rowImmersiveStreamWrap) {
 rowImmersiveStreamWrap.style.display = 'block';
 }
 var bottomBar = document.getElementById('js_article_bottom_bar');
 if (bottomBar) {
 bottomBar.classList.add('row_immersive_bottom_bar');
 }
 var immersiveStreamMask = document.getElementById('js_row_immersive_stream_mask');
 var enterBigWebview = function enterBigWebview() {
 immersiveStreamMask.style.display = 'none';
 document.body.style.overflow = 'auto';
 if (bottomBar) {
 bottomBar.classList.add('row_immersive_bigview_bottom_bar');
 }
 };
 var exitBigWebview = function exitBigWebview() {
 initBodyStyle();
 immersiveStreamMask.style.display = 'block';
 if (bottomBar) {
 bottomBar.classList.remove('row_immersive_bigview_bottom_bar');
 }
 };
 immersiveStreamMask.addEventListener('click', function (e) {
 e.preventDefault();
 e.stopPropagation();
 R$4.invoke('handleImmersiveStream', {
 action: 'enterFullArticle',
 params: {
 enterTime: Date.now()
 }
 }, function (res) {
 console.log("[immersive] handleImmersiveStream:", res);
 if (res && res.err_msg && res.err_msg.includes('ok')) {
 enterBigWebview();
 }
 if (window.__test_row_immersive_list) {
 setTimeout(function () {
 console.log("xxxxx ok");
 enterBigWebview();
 }, 2000);
 }
 });
 });
 R$4.on('immersiveStreamExposeArticle', function (res) {
 console.log("[immersive] immersiveStreamExposeArticle", res);
 });
 R$4.on('immersiveStreamExitFullArticle', function (res) {
 console.log("[immersive] immersiveStreamExitFullArticle", res);
 exitBigWebview();
 });
 R$4.on('immersiveStreamEnterFullArticle', function (res) {
 console.log("[immersive] immersiveStreamEnterFullArticle", res);
 enterBigWebview();
 });
 R$4.on('immersiveStreamSlideOutArticle', function (res) {
 console.log("[immersive] immersiveStreamSlideOutArticle", res);
 exitBigWebview();
 });
 }
 };

 function _arrayLikeToArray$2(arr, len) {
 if (len == null || len > arr.length) len = arr.length;
 for (var i = 0, arr2 = new Array(len); i -1) && (vie = 7);
 (window.XDomainRequest || ua.indexOf('Trident/4.0') > -1) && (vie = 8);
 ua.indexOf('Trident/5.0') > -1 && (vie = 9);
 ua.indexOf('Trident/6.0') > -1 && (vie = 10);
 Device.browser.ie = true, Device.browser.version = vie;
 } else if (ua.indexOf('Trident/7.0') > -1) {
 Device.browser.ie = true, Device.browser.version = 11;
 }
 if (android) {
 Device.os.android = true;
 Device.os.version = android[2];
 Device.os.type = 2;
 }
 if (harmony) {
 Device.os.harmony = true;
 Device.os.version = harmony[2];
 Device.os.type = 42;
 }
 if (ipod) {
 Device.os.ios = Device.os.ipod = true;
 Device.os.version = ipod[2].replace(/_/g, '.');
 }
 if (ipad) {
 Device.os.ios = Device.os.ipad = true;
 Device.os.version = ipad[2].replace(/_/g, '.');
 Device.os.type = 13;
 }
 if (iphone) {
 Device.os.iphone = Device.os.ios = true;
 Device.os.version = iphone[2].replace(/_/g, '.');
 Device.os.type = 1;
 }
 if (WinOS) Device.os.windows = true, Device.os.version = WinOS[2], Device.os.type = 15;
 if (MacOS) Device.os.Mac = true, Device.os.version = MacOS[1], Device.os.type = 14;
 if (Linux) Device.os.Linux = true, Device.os.type = 33;
 if (ua.indexOf('lepad_hls') > 0) Device.os.LePad = true;
 if (MIPAD) Device.os.MIPAD = true;
 if (MQQBrowser) Device.browser.MQQ = true, Device.browser.version = MQQBrowser[1];
 if (MQQClient) Device.browser.MQQClient = true, Device.browser.version = MQQClient[1];
 if (WeChat) Device.browser.WeChat = true, Device.browser.mmversion = Device.browser.version = WeChat[1];
 if (MiuiBrowser) Device.browser.MIUI = true, Device.browser.version = MiuiBrowser[1];
 if (UC) Device.browser.UC = true, Device.browser.version = UC[1] || NaN;
 if (IEMobile) Device.browser.IEMobile = true, Device.browser.version = IEMobile[2];
 if (AndriodBrowser) {
 Device.browser.AndriodBrowser = true;
 }
 if (M1) {
 Device.browser.M1 = true;
 }
 if (Chrome) {
 Device.browser.Chrome = true, Device.browser.version = Chrome[1];
 }
 if (Device.os.windows) {
 if (typeof navigator.platform !== "undefined" && navigator.platform.toLowerCase() == "win64") {
 Device.os.win64 = true;
 } else {
 Device.os.win64 = false;
 }
 }
 if (Device.os.Mac || Device.os.windows || Device.os.Linux || Device.os.unifiedPC || /OpenHarmony/i.test(ua) && /pc/i.test(ua)) {
 Device.os.pc = true;
 }
 var osType = {
 iPad7: 'iPad; CPU OS 7',
 LePad: 'lepad_hls',
 XiaoMi: 'MI-ONE',
 SonyDTV: "SonyDTV",
 SamSung: 'SAMSUNG',
 HTC: 'HTC',
 VIVO: 'vivo'
 };
 for (var os in osType) {
 Device.os[os] = ua.indexOf(osType[os]) !== -1;
 }
 Device.os.phone = Device.os.phone || /windows phone/i.test(ua);
 Device.os.getNumVersion = function () {
 return parseFloat(Device.os.version);
 };
 Device.os.hasTouch = 'ontouchstart' in window;
 if (Device.os.hasTouch && Device.os.ios && Device.os.getNumVersion() = 3.0;
 };
 Device.browser.isCanOcx = function () {
 return !!Device.os.windows && (!!Device.browser.ie || Device.browser.isFFCanOcx() || !!Device.browser.webkit);
 };
 Device.browser.isNotIESupport = function () {
 return !!Device.os.windows && (!!Device.browser.webkit || Device.browser.isFFCanOcx());
 };
 Device.userAgent = {};
 Device.userAgent.browserVersion = Device.browser.version;
 Device.userAgent.osVersion = Device.os.version;
 if (Device.os.unifiedPC) {
 if (Device.os.unifiedWindows) Device.os.type = 37;else if (Device.os.unifiedMac) Device.os.type = 38;else Device.os.type = 39;
 }
 delete Device.userAgent.version;
 }
 detect(window.navigator.userAgent);
 function canSupportH5Video() {
 var ua = window.navigator.userAgent,
 m = null;
 if (!!Device.os.android) {
 if (Device.browser.MQQ && Device.browser.getNumVersion() >= 4.2) {
 return true;
 }
 if (ua.indexOf('MI2') != -1) {
 return true;
 }
 if (Device.os.version >= '4' && (m = ua.match(/MicroMessenger\/((\d+)\.(\d+))\.(\d+)/))) {
 if (parseFloat(m[1]) >= 4.2) {
 return true;
 }
 }
 if (Device.os.version >= '4.1') {
 return true;
 }
 }
 return false;
 }
 function canSupportVideoMp4() {
 var video = document.createElement('video');
 if (typeof video.canPlayType === 'function') {
 if (video.canPlayType('video/mp4; codecs="mp4v.20.8"') === 'probably') {
 return true;
 }
 if (video.canPlayType('video/mp4; codecs="avc1.42E01E"') === 'probably' || video.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"') === 'probably') {
 return true;
 }
 }
 return false;
 }
 function canSupportAutoPlay() {
 if (Device.os.ios && Device.os.getNumVersion() 1 && arguments[1] !== undefined ? arguments[1] : 0;
 var canEqual = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
 var nowVersionStr = Device.os.version;
 if (!nowVersionStr) return false;
 var versionArr = version.split('.');
 var nowVersionArr = nowVersionStr.split('.');
 for (var i = 0; i 0) return vi > nvi;
 if (cp 1 ? _len - 1 : 0), _key = 1; _key = o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
 function _unsupportedIterableToArray$1(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$1(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$1(o, minLen); }
 function _arrayLikeToArray$1(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i b;
 }
 };
 function cpVersion(ver, op, canEq, type) {
 var mmver = false;
 switch (type) {
 case 'mac':
 mmver = getMac();
 break;
 case 'windows':
 mmver = getWindowsVersionFormat();
 break;
 case 'wxwork':
 mmver = getWxWork();
 break;
 case 'mpapp':
 mmver = getMpApp();
 break;
 case 'unifiedpc':
 mmver = getUnifiedPcVer();
 break;
 default:
 mmver = get();
 break;
 }
 if (!mmver) {
 return;
 }
 var mmversion = mmver.split('.');
 var version = ver.split('.');
 if (!/\d+/g.test(mmversion[mmversion.length - 1])) {
 mmversion.pop();
 }
 for (var i = 0, len = Math.max(mmversion.length, version.length); i = 64 && parseInt(v$4) = hexNum;
 }
 return false;
 }
 var MMVersion = {
 get: get,
 getMac: getMac,
 getMacOS: getMacOS,
 getWindows: getWindows,
 getInner: getInner,
 getWxWork: getWxWork,
 getMpApp: getMpApp,
 cpVersion: cpVersion,
 eqVersion: eqVersion,
 gtVersion: gtVersion,
 ltVersion: ltVersion,
 getPlatform: getPlatform,
 getVersionNumber: getVersionNumber,
 isWp: is_wp,
 isIOS: is_ios,
 isAndroid: is_android$1,
 isHarmony: is_harmony,
 isHarmonyWechat: is_harmony && is_wechat && cpVersion('1.0.0', 1, true),
 isInMiniProgram: is_in_miniProgram,
 isWechat: is_wechat,
 isMac: is_mac,
 isWindows: is_windows,
 isLinux: is_linux,
 isMacWechat: is_mac_wechat,
 isWindowsWechat: is_windows_wechat,
 isWxWork: is_wx_work,
 isOnlyWechat: is_wechat && !is_wx_work,
 isMpapp: is_mpapp,
 isIPad: is_ipad,
 isGooglePlay: is_google_play,
 isPrefetch: is_prefetch,
 isDonutAPP: is_donut_app,
 compareHexVersion: compareHexVersion,
 isPcWechat: is_windows_wechat || is_mac_wechat,
 xwebVersion: xweb_version,
 isUnifiedPcWechat: is_unified_pc_wechat
 };

 function _arrayWithHoles$1(arr) {
 if (Array.isArray(arr)) return arr;
 }

 function _iterableToArrayLimit$1(arr, i) {
 var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"];
 if (null != _i) {
 var _s,
 _e,
 _x,
 _r,
 _arr = [],
 _n = !0,
 _d = !1;
 try {
 if (_x = (_i = _i.call(arr)).next, 0 === i) {
 if (Object(_i) !== _i) return;
 _n = !1;
 } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0);
 } catch (err) {
 _d = !0, _e = err;
 } finally {
 try {
 if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return;
 } finally {
 if (_d) throw _e;
 }
 }
 return _arr;
 }
 }

 function _nonIterableRest$1() {
 throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
 }

 function _slicedToArray$1(arr, i) {
 return _arrayWithHoles$1(arr) || _iterableToArrayLimit$1(arr, i) || _unsupportedIterableToArray$2(arr, i) || _nonIterableRest$1();
 }

 function getInflightMap() {
 if (!window.__dedupe_promise_inflight__) {
 window.__dedupe_promise_inflight__ = new Map();
 }
 return window.__dedupe_promise_inflight__;
 }
 
 function dedupePromise(key, factory) {
 var inflightMap = getInflightMap();
 var existing = inflightMap.get(key);
 console.log("dedupePromise key=".concat(key, " existing=").concat(existing));
 if (existing) {
 return existing;
 }
 var promise = Promise.resolve().then(factory)["finally"](function () {
 inflightMap["delete"](key);
 });
 inflightMap.set(key, promise);
 return promise;
 }

 function _toPrimitive(input, hint) {
 if (_typeof$3(input) !== "object" || input === null) return input;
 var prim = input[Symbol.toPrimitive];
 if (prim !== undefined) {
 var res = prim.call(input, hint || "default");
 if (_typeof$3(res) !== "object") return res;
 throw new TypeError("@@toPrimitive must return a primitive value.");
 }
 return (hint === "string" ? String : Number)(input);
 }

 function _toPropertyKey(arg) {
 var key = _toPrimitive(arg, "string");
 return _typeof$3(key) === "symbol" ? key : String(key);
 }

 function _defineProperty$1(obj, key, value) {
 key = _toPropertyKey(key);
 if (key in obj) {
 Object.defineProperty(obj, key, {
 value: value,
 enumerable: true,
 configurable: true,
 writable: true
 });
 } else {
 obj[key] = value;
 }
 return obj;
 }

 function _classCallCheck$1(instance, Constructor) {
 if (!(instance instanceof Constructor)) {
 throw new TypeError("Cannot call a class as a function");
 }
 }

 function _defineProperties$1(target, props) {
 for (var i = 0; i d2.exp) return 1;
 return 0;
 });
 var memCnt = 0;
 for (var i = 0; i = size) break;
 var key = keys[i];
 memCnt += JSON.stringify(data[key]).length;
 delete data[key];
 }
 return data;
 },
 'clear-all': function clearAll() {
 localStorage$1.clear();
 return {};
 }
 };
 function formatLogMsg(str) {
 return "[WXLS] ".concat(str);
 }
 
 var LS = function () {
 function LS(func, evictionPolicy, logger) {
 _classCallCheck$1(this, LS);
 this.logger = function () {};
 if (!func) throw 'require function name.';
 this.evictionPolicy = 'noeviction';
 this.key = func;
 if (typeof logger === 'function') {
 this.logger = function (str, type) {
 return logger(formatLogMsg(str), type);
 };
 }
 if (evictionPolicy && Object.keys(evictionPolicies).indexOf(evictionPolicy) !== -1) {
 this.evictionPolicy = evictionPolicy;
 }
 this.init();
 }
 _createClass$1(LS, [{
 key: "init",
 value: function init() {
 var _a, _b;
 this.check();
 if (Math.random() * 1000 now) {
 temp[key] = val;
 }
 }
 this.logger("check info: isReturn:".concat(isReturn, " data:").concat(JSON.stringify(temp)), 'info');
 if (isReturn) return temp;
 LS.setItem(this.key, JSON.stringify(temp), this.logger);
 }
 }, {
 key: "set",
 value: function set(key, val, exp) {
 var _a, _b;
 var data = this.check(true);
 data[key] = {
 val: val,
 exp: exp || +new Date()
 };
 try {
 if (localStorage$1.getItem(prefix + this.key)) localStorage$1.removeItem(prefix + this.key);
 localStorage$1.setItem(prefix + this.key, JSON.stringify(data));
 this.logger("first set success: LSlen:".concat((_a = window === null || window === void 0 ? void 0 : window.localStorage) === null || _a === void 0 ? void 0 : _a.length, " key:").concat(prefix + this.key, " data:").concat(JSON.stringify(data)), 'success');
 } catch (e) {
 this.logger("first set error: LSlen:".concat((_b = window === null || window === void 0 ? void 0 : window.localStorage) === null || _b === void 0 ? void 0 : _b.length, " error:").concat(e, " key:").concat(prefix + this.key, " data:").concat(JSON.stringify(data), " k:").concat(key, " v:").concat(val, " exp:").concat(exp), 'error');
 localStorage$1.clear();
 LS.setItem(this.key, JSON.stringify(_defineProperty$1({}, key, {
 val: val,
 exp: exp || +new Date()
 })), this.logger);
 }
 }
 }, {
 key: "get",
 value: function get(key) {
 var data = this.getData();
 data = data[key];
 return data ? data.val || null : null;
 }
 }, {
 key: "remove",
 value: function remove(key) {
 var data = this.getData();
 if (data[key]) delete data[key];
 LS.setItem(this.key, JSON.stringify(data), this.logger);
 }
 }], [{
 key: "getItem",
 value: function getItem(key) {
 key = prefix + key;
 return localStorage$1.getItem(key);
 }
 }, {
 key: "setItem",
 value: function setItem(key, val, logger) {
 var _a, _b;
 key = prefix + key;
 var n = 3;
 while (n--) {
 try {
 if (localStorage$1.getItem(key)) localStorage$1.removeItem(key);
 localStorage$1.setItem(key, val);
 typeof logger === 'function' && logger("setItem success: LSlen:".concat((_a = window === null || window === void 0 ? void 0 : window.localStorage) === null || _a === void 0 ? void 0 : _a.length, " key:").concat(key, " val:").concat(val), 'success');
 break;
 } catch (e) {
 typeof logger === 'function' && logger("setItem error: LSlen:".concat((_b = window === null || window === void 0 ? void 0 : window.localStorage) === null || _b === void 0 ? void 0 : _b.length, " error:").concat(e, " key:").concat(key, " val:").concat(val), 'error');
 LS.clear();
 }
 }
 }
 }, {
 key: "clear",
 value: function clear() {
 var i;
 var k;
 for (i = localStorage$1.length - 1; i >= 0; i--) {
 k = localStorage$1.key(i);
 if (k.indexOf(prefix) == 0) {
 localStorage$1.removeItem(k);
 }
 }
 }
 }, {
 key: "getSupportEvicationPolicy",
 value: function getSupportEvicationPolicy() {
 return Object.keys(evictionPolicies);
 }
 }]);
 return LS;
 }();
 var innerVersion = (MMVersion.getInner() || '').toUpperCase();
 var getBizLS = new LS('get_biz_result');
 function getBizMap() {
 if (!window.__get_biz_map__) {
 window.__get_biz_map__ = {};
 }
 return window.__get_biz_map__;
 }
 var isGetBizSupported = MMVersion.isOnlyWechat && MMVersion.isIOS && innerVersion >= '18003C2A' || MMVersion.isOnlyWechat && MMVersion.isAndroid && innerVersion >= '28003D3C' || MMVersion.isUnifiedPcWechat && MMVersion.cpVersion('4.1.10', 1, true, 'unifiedpc');
 function invokeGetBiz(needCheckBiz, bizType) {
 return dedupePromise("getBiz:".concat(needCheckBiz, ":").concat(bizType), function () {
 return new Promise(function (resolve, reject) {
 if (!isGetBizSupported) {
 reject('Not support');
 } else {
 R$4.invoke('handleMPPageAction', {
 action: 'getBiz',
 needCheckBiz: needCheckBiz,
 bizType: bizType
 }, function (res) {
 console.log("getBiz needCheckBiz=".concat(needCheckBiz, " bizType=").concat(bizType, " res: ").concat(JSON.stringify(res)));
 if (res && res.err_msg && res.err_msg.indexOf('ok') > -1) {
 var bizMap = getBizMap();
 bizMap[bizType] = res.biz;
 resolve(res.biz);
 getBizLS.set("".concat(bizType, "_get_biz_result"), res.biz, +new Date() + 3 * 24 * 60 * 60 * 1000);
 } else {
 reject('Failed to get biz');
 }
 });
 }
 });
 });
 }
 function getBiz(needCheckBiz, bizType) {
 var _a;
 if (needCheckBiz === void 0) {
 needCheckBiz = false;
 }
 if (bizType === void 0) {
 bizType = ((_a = window.cgiDataNew) === null || _a === void 0 ? void 0 : _a.biz_type) || 1;
 }
 var bizMap = getBizMap();
 if (!needCheckBiz && bizMap[bizType] !== undefined) {
 return Promise.resolve(bizMap[bizType]);
 }
 return invokeGetBiz(needCheckBiz, bizType);
 }
 MMVersion.isOnlyWechat && MMVersion.isIOS || MMVersion.isOnlyWechat && MMVersion.isAndroid || MMVersion.isUnifiedPcWechat && MMVersion.cpVersion('4.1.10', 1, true, 'unifiedpc');
 var getIsAuthor = function getIsAuthor(cb, bizuin, needCheckBiz, bizType) {
 var _a;
 if (bizuin === void 0) {
 bizuin = window.biz;
 }
 if (needCheckBiz === void 0) {
 needCheckBiz = false;
 }
 if (bizType === void 0) {
 bizType = ((_a = window.cgiDataNew) === null || _a === void 0 ? void 0 : _a.biz_type) || 1;
 }
 getBiz(needCheckBiz, bizType).then(function (biz) {
 cb(biz && biz === bizuin);
 })["catch"](function () {
 cb(false);
 });
 };

 function parseUrl$1(url) {
 var len = url.length;
 var ques_pos = url.indexOf('?');
 var hash_pos = url.indexOf('#');
 hash_pos = hash_pos == -1 ? len : hash_pos;
 ques_pos = ques_pos == -1 ? hash_pos : ques_pos;
 var host = url.substring(0, ques_pos);
 var query_str = url.substring(ques_pos + 1, hash_pos);
 var hash = url.substring(hash_pos + 1);
 return {
 host: host,
 query_str: query_str,
 hash: hash
 };
 }
 function join(url, args, noEncode) {
 var ret = parseUrl$1(url);
 var query_str = ret.query_str;
 var args_arr = [];
 if (_typeof$3(args) === 'object') {
 for (var key in args) {
 if (args.hasOwnProperty(key)) {
 args_arr.push("".concat(key, "=").concat(noEncode ? args[key] : encodeURIComponent(args[key])));
 }
 }
 } else {
 args_arr.push(noEncode ? args : encodeURIComponent(args));
 }
 if (args_arr.length > 0) {
 query_str += (query_str !== "" ? "&" : "") + args_arr.join("&");
 }
 return ret.host + (query_str !== "" ? "?".concat(query_str) : "") + (ret.hash !== "" ? "#".concat(ret.hash) : "");
 }
 
 function addParam(url, param, value, forceReplace) {
 url = url || location.href;
 var firstAndPos = url.indexOf("&");
 var len = url.length;
 var reverseUrl = url.replace(/^[\w\d]+:[/\\]+/g, "").split("").reverse();
 if (!Array.prototype.indexOf) {
 Array.prototype.indexOf = function (searchElement, fromIndex) {
 var k;
 if (this == null) {
 throw new TypeError('"this" is null or not defined');
 }
 var O = Object(this);
 var len = O.length >>> 0;
 if (len === 0) {
 return -1;
 }
 var n = fromIndex || 0;
 if (Math.abs(n) === Infinity) {
 n = 0;
 }
 if (n >= len) {
 return -1;
 }
 k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
 while (k lastSlashPos) {
 url = url.replace("&", "?");
 }
 var reg = new RegExp("([\\?&]".concat(param, "=)[^&#]*"));
 if (!url.match(reg)) {
 var urlInfo = parseUrl$1(url);
 var hash = urlInfo.hash ? '#' + urlInfo.hash : '';
 url = url.replace(hash, '');
 var _pos = url.indexOf("?");
 if (_pos == -1) {
 return "".concat(url, "?").concat(param, "=").concat(value).concat(hash);
 }
 if (_pos == url.length - 1) {
 return "".concat(url + param, "=").concat(value).concat(hash);
 }
 return "".concat(url, "&").concat(param, "=").concat(value).concat(hash);
 }
 if (forceReplace === true) {
 return url.replace(reg, "$1".concat(value));
 }
 return url;
 }
 function addWxfrom(src, wxfrom) {
 var offset = window.service_type === 1 ? 10000 : 0;
 return addParam(src, 'wxfrom', offset + Number(wxfrom), true);
 }
 function removeParam(url, param) {
 var _URL = new URL(url),
 protocol = _URL.protocol,
 host = _URL.host,
 pathname = _URL.pathname,
 search = _URL.search,
 hash = _URL.hash;
 var queryParams = new URLSearchParams(search);
 queryParams["delete"](param);
 var newSearch = queryParams.toString();
 var newUrl = new URL("".concat(protocol, "//").concat(host).concat(pathname).concat(newSearch ? "?".concat(decodeURIComponent(newSearch)) : "").concat(hash));
 return newUrl.toString();
 }
 function getQuery$1(name, url) {
 var u = url || window.location.search;
 var reg = new RegExp("(^|&)".concat(name, "=([^&]*)(&|$)"));
 var r = u.substring(u.indexOf('?') + 1).match(reg);
 return r !== null ? r[2] : '';
 }
 function encodeBase64(value) {
 try {
 return window.btoa(value);
 } catch (e) {
 return '';
 }
 }
 function decodeBase64(value) {
 try {
 return window.atob(value);
 } catch (e) {
 return '';
 }
 }
 function joinUrl$1(url) {
 var obj = {};
 if (typeof window.uin !== 'undefined') {
 obj.uin = window.uin;
 }
 if (typeof window.key !== 'undefined') {
 obj.key = window.key;
 }
 if (typeof window.pass_ticket !== 'undefined') {
 obj.pass_ticket = window.pass_ticket;
 }
 if (typeof window.wxtoken !== 'undefined') {
 obj.wxtoken = window.wxtoken;
 }
 if (typeof window.devicetype !== 'undefined') {
 obj.devicetype = window.devicetype;
 }
 if (typeof window.clientversion !== 'undefined') {
 obj.clientversion = window.clientversion || MMVersion.getInner();
 }
 obj.version = obj.clientversion;
 if (window.biz) {
 obj.__biz = window.biz;
 }
 if (getQuery$1('enterid')) {
 obj.enterid = getQuery$1('enterid');
 }
 if (typeof window.appmsg_token !== 'undefined') {
 obj.appmsg_token = window.appmsg_token;
 } else if (url.indexOf('advertisement_report') > -1) {
 new Image().src = "".concat(location.protocol, "//mp.weixin.qq.com/mp/jsmonitor?idkey=68064_13_1&r=").concat(Math.random());
 }
 obj.x5 = navigator.userAgent.indexOf('TBS/') !== -1 ? '1' : '0';
 obj.f = 'json';
 return join(url, obj);
 }
 function joinUserArticleRole(url, notJoin, cb) {
 var bizuin = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : window.biz;
 var needCheckBiz = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;
 if (notJoin) {
 cb(url);
 } else {
 getIsAuthor(function (isAuthor) {
 cb(addParam(url, 'user_article_role', isAuthor ? 1 : 0, true));
 }, bizuin, needCheckBiz);
 }
 }
 function getA8keyQuery(name, url) {
 return new Promise(function (resolve) {
 if (window.__secPageAuthPromise) {
 window.__secPageAuthPromise.then(function () {
 resolve(getQuery$1(name, url));
 });
 } else {
 resolve(getQuery$1(name, url));
 }
 });
 }
 function addHash(url, hash) {
 var isReplace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
 if (isReplace) {
 return "".concat(url.split('#')[0]).concat(hash);
 }
 return "".concat(url).concat(url.indexOf('#') === -1 ? '#' : '').concat(hash);
 }
 function decodeUrl(url) {
 var _url = url;
 while (_url.indexOf('&') !== -1) {
 _url = _url.htmlDecode();
 }
 return _url;
 }
 var Url = {
 parseUrl: parseUrl$1,
 join: join,
 addParam: addParam,
 addWxfrom: addWxfrom,
 addHash: addHash,
 getQuery: getQuery$1,
 getA8keyQuery: getA8keyQuery,
 encodeBase64: encodeBase64,
 decodeBase64: decodeBase64,
 joinUrl: joinUrl$1,
 joinUserArticleRole: joinUserArticleRole,
 removeParam: removeParam,
 decodeUrl: decodeUrl
 };

 Device.os.ipad && Device.os.getNumVersion() >= 13 && Device.os.getNumVersion() ".concat(jsapiName, " ").concat(opt.action || '', " ").concat(errMsg));
 typeof callback === 'function' && callback(ret);
 } catch (e) {
 window.WX_BJ_REPORT.BadJs.report('invoke', "callback ".concat(jsapiName, " error:"), {
 mid: 'mmbizwebapp:js_brridge',
 _info: e
 });
 console.error("[mpapp jsapi] ".concat(jsapiName, " ").concat(opt.action || ''), e, res);
 }
 });
 } catch (e) {
 window.WX_BJ_REPORT.BadJs.report('invoke', 'callback error:', {
 mid: 'mmbizwebapp:js_brridge',
 _info: e
 });
 console.error('[mpapp jsapi]', e);
 }
 });
 }

 
 function _log(level, msg) {
 if (level === 'log') {
 level = 'info';
 msg = "[WechatFe]".concat(msg);
 } else {
 var prefix = "__wap__".concat(window.__second_open__ ? ' (sec)' : '');
 msg = "".concat(prefix, " ").concat(msg, " location:[").concat(location.href, "]");
 }
 msg += new Error().stack;
 if (MMVersion.isMpapp) {
 invoke('WNNativeCallbackLog', msg);
 } else if (MMVersion.isWechat) {
 if (MMVersion.isAndroid) {
 console.warn('[system]', "[MicroMsg.JsApiLog][".concat(level, "] jslog : ").concat(msg));
 } else if (MMVersion.isIOS) {
 R$4.invoke('writeLog', {
 level: level,
 msg: msg
 });
 } else {
 R$4.invoke('log', {
 level: level,
 msg: msg
 });
 }
 }
 }
 var Log = {
 info: function info() {
 for (var _len = arguments.length, args = new Array(_len), _key = 0; _key = 0) continue;
 target[key] = source[key];
 }
 return target;
 }
 function formatDataToString(data) {
 var reportData = [];
 for (var key in data) {
 if (Object.prototype.hasOwnProperty.call(data, key)) {
 reportData.push(key + '=' + encodeURIComponent(data[key]));
 }
 }
 return reportData.join('&');
 }
 monitor.getReportData = function (opt) {
 opt = opt || {};
 var idkey = monitor._reportOptions.idkey || {};
 var key = null;
 var reportData = {};
 var nextKey;
 try {
 for (key in idkey) {
 if (Object.prototype.hasOwnProperty.call(idkey, key) && idkey[key]) {
 reportLogs.push(key + '_' + idkey[key]);
 }
 }
 } catch (e) {
 return false;
 }
 if (reportLogs.length === 0) {
 return false;
 }
 if (reportExtraLogs.length) {
 reportData.lc = reportExtraLogs.length;
 reportExtraLogs.forEach(function (extraLog, index) {
 reportData["log".concat(index)] = extraLog;
 });
 }
 try {
 var reportOptions = monitor._reportOptions;
 if (reportOptions !== null && reportOptions !== undefined) {
 for (nextKey in reportOptions) {
 if (Object.prototype.hasOwnProperty.call(reportOptions, nextKey)) {
 reportData[nextKey] = reportOptions[nextKey];
 }
 }
 }
 } catch (e) {
 reportData = {};
 }
 reportData.idkey = reportLogs.join(';');
 reportData.t = Math.random();
 if (opt.remove !== false) {
 reportLogs = [];
 reportExtraLogs = [];
 monitor._reportOptions = {
 idkey: {}
 };
 }
 return reportData;
 };
 monitor.setLogs = function (opt) {
 var id = opt.id;
 var key = opt.key;
 var value = opt.value;
 var extraLog = opt.log;
 var others = ObjWithoutProperty(opt, ['id', 'key', 'value', 'log']);
 var idkey = monitor._reportOptions.idkey || {};
 var param = id + '_' + key;
 if (idkey[param]) {
 idkey[param] += value;
 } else {
 idkey[param] = value;
 }
 monitor._reportOptions.idkey = idkey;
 if (extraLog) {
 reportExtraLogs.push(extraLog);
 }
 try {
 if (others !== null && others !== undefined) {
 for (var otherKey in others) {
 if (Object.prototype.hasOwnProperty.call(others, otherKey)) {
 monitor._reportOptions[otherKey] = others[otherKey];
 }
 }
 }
 } catch (e) {
 console.log(e);
 }
 return monitor;
 };
 monitor.setAvg = function (id, key, value) {
 var idkey = monitor._reportOptions.idkey || {};
 var param1 = id + '_' + key;
 var param2 = id + '_' + (key - 1);
 if (idkey[param1]) {
 idkey[param1] += value;
 } else {
 idkey[param1] = value;
 }
 if (idkey[param2]) {
 idkey[param2] += 1;
 } else {
 idkey[param2] = 1;
 }
 monitor._reportOptions.idkey = idkey;
 return monitor;
 };
 monitor.setSum = function (id, key) {
 var value = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
 var idkey = monitor._reportOptions.idkey;
 var param = id + '_' + key;
 if (idkey[param]) {
 idkey[param] += value;
 } else {
 idkey[param] = value;
 }
 monitor._reportOptions.idkey = idkey;
 return monitor;
 };
 monitor.send = function (async, ajax, origin) {
 if (async !== false) {
 async = true;
 }
 var data = monitor.getReportData();
 origin = origin || '';
 if (!data) {
 return;
 }
 if (!!ajax && ajax instanceof Function) {
 ajax({
 url: origin + sendUrl,
 type: 'POST',
 mayAbort: true,
 data: data,
 async: async,
 timeout: 2000,
 dontReport: true
 });
 } else {
 new Image().src = origin + '/mp/jsmonitor?' + formatDataToString(data) + '#wechat_redirect';
 }
 };
 if (typeof window !== 'undefined' && window.__monitor) {
 monitor = window.__monitor;
 } else {
 typeof window !== 'undefined' && (window.__monitor = monitor);
 }
 var monitor$1 = monitor;

 
 var logList = [];
 var log = function log(msg) {
 logList.push(msg);
 };
 var printLog = function printLog() {
 for (var i = 0, len = logList.length; i [response ".concat(item.requestType, "]"), item.url, item.response, item);
 if (item.rdevRequestId && ((_b = (_a = window.RemoteDevSdk) === null || _a === void 0 ? void 0 : _a.instance) === null || _b === void 0 ? void 0 : _b.Network) && item.id !== '__system_log__') {
 try {
 var finishedOptions = {
 requestId: item.rdevRequestId,
 url: item.url,
 status: +(item.status || '500'),
 statusText: StatusTextMap[+(item.status || '500')] || 'Error',
 responseHeaders: {
 RDEV_RESPONSE_TYPE: item.requestType
 },
 responseBody: item.response,
 requestTime: item.requestTime || 0,
 duration: item.costTime || (item.endTime && item.startTime ? item.endTime - item.startTime : performance.now() / 1000 - (item.requestTime || 0))
 };
 window.RemoteDevSdk.instance.Network.customRequestFinished(finishedOptions);
 } catch (err) {}
 }
 if (((_c = window.vConsole) === null || _c === void 0 ? void 0 : _c.network) && item.id !== '__system_log__') {
 try {
 item.statusText = "".concat(item.status);
 item.responseSize = item.response.length;
 item.responseSizeText = "".concat(item.response.length);
 return (_e = (_d = window.vConsole.network).update) === null || _e === void 0 ? void 0 : _e.call(_d, item.id, Object.assign({}, item, {
 readyState: 4
 }));
 } catch (err) {}
 }
 }
 function reqType(obj, path) {
 return obj.url.indexOf(path) > -1 && obj.url.indexOf('action=') === -1 && (!obj.data || !obj.data.action);
 }
 function findAjaxScopeByConfig(url, config) {
 var pathname = new URL(url, location.href).pathname || '';
 var scope = config[pathname.slice(1)];
 if (scope) {
 return scope;
 }
 }
 function getAjaxScope(ajaxUrl) {
 if (Url.getQuery('no_transfer', location.href) !== '1' && MMVersion.isWechat && !MMVersion.isInMiniProgram && !MMVersion.isWxWork && !MMVersion.isMpapp && !isAcrossOrigin && window.__ajaxTransferConfig && _typeof$3(window.__ajaxTransferConfig) === 'object' && (
 MMVersion.isIOS && MMVersion.compareHexVersion('1800282F') || MMVersion.isAndroid && MMVersion.compareHexVersion('28002234') || MMVersion.isWindowsWechat && MMVersion.cpVersion('3.9.5', 1, true, 'windows') || MMVersion.isMacWechat && MMVersion.cpVersion('3.8.4', 1, true, 'mac') || MMVersion.isHarmonyWechat && MMVersion.compareHexVersion('0xf3100b00') && !MMVersion.compareHexVersion('0xf3100c00') || MMVersion.compareHexVersion('0xf3800b00'))) {
 try {
 return findAjaxScopeByConfig(ajaxUrl, window.__ajaxTransferConfig);
 } catch (err) {
 
 }
 }
 }
 function getActionByData(data) {
 var _a, _b;
 if (_typeof$3(data) === 'object' && !(data instanceof Blob)) {
 if (data.hasOwnProperty('data') && typeof data.data === 'string') {
 try {
 var workedData = JSON.parse(data.data);
 return workedData.action || '';
 } catch (e) {}
 }
 return data.action || '';
 }
 if (typeof data === 'string') {
 return ((_b = (_a = data.split(/[?&]/).find(function (x) {
 return x.indexOf('action=') >= 0;
 })) === null || _a === void 0 ? void 0 : _a.split('=')) === null || _b === void 0 ? void 0 : _b[1]) || '';
 }
 return '';
 }

 var METHOD_ENUM = {
 GET: 0,
 POST: 1
 };
 var __moon_report = window.__moon_report || function () {};
 var MOON_AJAX_SUCCESS_OFFSET = 3;
 var MOON_AJAX_NETWORK_OFFSET = 4;
 var MOON_AJAX_ERROR_OFFSET = 5;
 var MOON_AJAX_TIMEOUT_OFFSET = 6;
 var MOON_AJAX_COMPLETE_OFFSET = 7;
 var LENGTH_LIMIT = 4096;
 function reportRtError(type, id, key, content) {
 var log = '';
 var prefix = type === 'rt' ? 'rtCheckError' : 'Ajax Length Limit';
 if (content === null || content === void 0 ? void 0 : content.length) {
 var loglen = 1000;
 var len = content.length;
 var lc = Math.ceil(len / loglen);
 log = ["&lc=".concat(lc)];
 for (var i = 0; i = 200 && retryStatus 0 ? 'json' : undefined
 });
 var isTimeout = false;
 handleReqTimeout({
 abort: function abort() {
 isTimeout = true;
 reqLogItem.endTime = Date.now();
 reqLogItem.response = 'timeout';
 networkEndLog(reqLogItem);
 }
 });
 Device.os.pc && monitor$1.setSum(115849, 69, 1);
 R$4.invoke(Device.os.pc ? 'H5ExtTransfer' : 'webTransfer', params, function (res) {
 var _a, _b, _c, _d, _e, _f;
 if (isTimeout) return;
 var status = 400;
 var result = '';
 if (Device.os.pc) {
 try {
 var retFlag = res.base_resp.ret === 0 && res.jsapi_resp.ret === 0 && res.err_msg.indexOf(':ok') > -1;
 var respJsonFlag = res.jsapi_resp.resp_json;
 status = retFlag && respJsonFlag ? 200 : 400;
 result = res.jsapi_resp.resp_json;
 } catch (err) {
 console.error(err);
 }
 } else {
 status = res && res.errCode * 1 === 0 && typeof res.result === 'string' && res.result ? 200 : 400;
 result = res.result;
 }
 try {
 Log.log("ajax transfer, status: ".concat(status, ", reqUrl: ").concat(reqUrl));
 } catch (err) {
 console.error(err);
 }
 if (status >= 200 && status -1 && retryStatus >= 200 && retryStatus = 200 && status LENGTH_LIMIT) {
 reportAjaxLength(27613, 17, "ajax get limit[length: ".concat(url.length, "]").concat(url.substring(0, 1024)));
 }
 if (data && !(data instanceof Blob) && data.length > LENGTH_LIMIT) {
 reportAjaxLength(27613, 18, "ajax post limit[length: ".concat(data.length, "]").concat(data.substring(0, 1024)));
 }
 if (data && data instanceof Blob && data.size > LENGTH_LIMIT) {
 reportAjaxLength(27613, 18, "ajax post limit[length: ".concat(data.size, "]blob"));
 }
 } catch (e) {
 }
 } catch (e) {
 obj.error && obj.error(xhr, {
 type: 3,
 error: e,
 status: 0
 });
 }
 beforeReq();
 });
 }

 
 var photoAccountsEnv = null;
 var getEnv = function getEnv() {
 var forceUpdate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
 if (window.__wxWebEnv && (!photoAccountsEnv || forceUpdate)) {
 try {
 photoAccountsEnv = window.__wxWebEnv && typeof window.__wxWebEnv.getEnv === 'function' && window.__wxWebEnv.getEnv();
 photoAccountsEnv = photoAccountsEnv ? JSON.parse(photoAccountsEnv) : undefined;
 } catch (error) {
 photoAccountsEnv = undefined;
 console.error('photo accounts env error', error);
 }
 }
 return photoAccountsEnv;
 };
 var isPcDebugVersion = MMVersion.isWindowsWechat && MMVersion.compareHexVersion('0xf2550000') || MMVersion.isMacWechat && MMVersion.compareHexVersion('0xf2650000');
 var photoAccountsEnableforC = function photoAccountsEnableforC() {
 var _a, _b, _c, _d;
 return ((_b = (_a = getEnv()) === null || _a === void 0 ? void 0 : _a.photoAccount) === null || _b === void 0 ? void 0 : _b.supportViewPhotoAcct) === 1 || MMVersion.isPcWechat && ((_d = (_c = window.cgiDataNew) === null || _c === void 0 ? void 0 : _c.user_info) === null || _d === void 0 ? void 0 : _d.support_view_photo_acct) || isPcDebugVersion || MMVersion.isWxWork;
 };
 var photoAccountsEnableProfileExt = function photoAccountsEnableProfileExt() {
 var _a, _b, _c, _d;
 return ((_b = (_a = window.cgiDataNew) === null || _a === void 0 ? void 0 : _a.user_info) === null || _b === void 0 ? void 0 : _b.support_view_photo_profileext) || ((_d = (_c = window.cgiData) === null || _c === void 0 ? void 0 : _c.user_info) === null || _d === void 0 ? void 0 : _d.support_view_photo_profileext) || MMVersion.isWxWork;
 };
 var notSupportPhotoAccountsToast = function notSupportPhotoAccountsToast() {
 R$4.invoke('openUrlWithExtraWebview', {
 url: 'https://mp.weixin.qq.com/mp/readtemplate?t=wxversion/index&for=photoAccount#wechat_redirect',
 openType: 1
 });
 };
 var supportPhotoAccounts = function supportPhotoAccounts() {
 var needTips = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
 if (photoAccountsEnableforC()) {
 return true;
 } else {
 needTips && notSupportPhotoAccountsToast();
 return false;
 }
 };

 
 var getBizAttrName = function getBizAttrName(serviceType, platform, phAccountDefault) {
 var _a;
 if (serviceType === void 0) {
 serviceType = ((_a = window.cgiDataNew) === null || _a === void 0 ? void 0 : _a.new_service_type) || 0;
 }
 if (platform === void 0) {
 platform = 'wechat';
 }
 if (serviceType === 8) {
 if (platform === 'wechat') {
 return '贴图号' ;
 } else {
 return '贴图号';
 }
 }
 if (serviceType === 2) return '服务号';
 return '公众号';
 };
 
 var getBrandServiceType = function getBrandServiceType() {
 var serviceType = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window.service_type;
 var _a, _b;
 var brandServiceType = 0;
 if (serviceType !== undefined) brandServiceType = serviceType + 1;
 if (((_b = (_a = window.cgiData) === null || _a === void 0 ? void 0 : _a.trans_appmsg_info) === null || _b === void 0 ? void 0 : _b.trans_type) * 1 === 1) brandServiceType = 3;
 return brandServiceType;
 };

 function setCurrentMpInfo(ifShow) {
 var supportNewTopBar = MMVersion.isIOS && MMVersion.gtVersion('7.0.10', true) || MMVersion.isAndroid && MMVersion.gtVersion('7.0.12', true);
 var supportLiveStatus = MMVersion.isIOS && MMVersion.gtVersion('8.0.46', true) || MMVersion.isAndroid && MMVersion.gtVersion('8.0.46', true);
 R$4.invoke('currentMpInfo', {
 userName: window.user_name,
 brandName: !!supportNewTopBar && window.nickname === '' ? '未命名账号' : window.title,
 title: window.msg_title || '',
 brandIcon: window.hd_head_img.replace(/\/0$/, '/132'),
 itemShowType: window.item_show_type,
 isPaySubscribe: window.isPaySubscribe,
 topBarStyle: supportNewTopBar ? 1 : 0,
 topBarShowed: ifShow,
 disableShowFinderLiveTopBar: !ifShow && supportLiveStatus ? 1 : 0,
 brandServiceType: getBrandServiceType()
 }, function () {});
 }
 function AjaxWx(obj) {
 var report36408 = typeof obj.report36408 === 'function' ? obj.report36408 : function () {};
 obj.url += obj.url.indexOf('?') === -1 ? '?fasttmplajax=1' : '&fasttmplajax=1';
 if (getAjaxScope(obj.url)) {
 Ajax(obj);
 return;
 }
 if (obj.usePb) {
 obj.type = 'POST';
 obj.data = {
 data: JSON.stringify(obj.data)
 };
 }
 if (!/^(http:\/\/|https:\/\/|\/\/)/.test(obj.url)) {
 obj.url = "https://mp.weixin.qq.com/".concat(obj.url.replace(/^\//, ''));
 } else if (/^\/\//.test(obj.url)) {
 obj.url = "https:".concat(obj.url);
 }
 if (obj.f !== 'html' && (obj.url.indexOf('?f=json') === -1 || obj.url.indexOf('&f=json') === -1)) {
 obj.url += '&f=json';
 }
 if (!obj.notJoinUrl && obj.f !== 'html') {
 obj.url = Url.joinUrl(obj.url);
 }
 Url.joinUserArticleRole(obj.url, !!obj.notJoinUrl, function (url) {
 obj.url = url;
 var urlObj = new URL(url, location.origin);
 var data = null;
 if (_typeof$3(obj.data) === 'object') {
 var d = obj.data;
 var ds = [];
 for (var k in d) {
 if (d.hasOwnProperty(k)) {
 ds.push("".concat(k, "=").concat(encodeURIComponent(d[k])));
 }
 }
 data = ds.join('&');
 } else {
 data = typeof obj.data === 'string' ? obj.data : null;
 }
 var header = {
 Cookie: document.cookie,
 referer: location.href
 };
 if (obj.contentType) {
 header['Content-Type'] = obj.contentType;
 } else if ((obj.type || 'GET').toUpperCase() === 'POST') {
 header['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
 }
 var reqLogItem = networkStartLog({
 method: obj.type || 'GET',
 url: obj.url,
 postData: obj.data || {},
 requestHeader: header,
 requestType: 'jsapi',
 startTime: Date.now()
 });
 var retryTime = 1;
 var jsapiRequest = function jsapiRequest(obj, data) {
 return R$4.invoke('request', {
 url: obj.url,
 method: obj.type,
 data: data,
 header: header
 }, function (res) {
 var _a, _b, _c, _d, _e, _f;
 if (res.err_msg.indexOf(':ok') > -1 && (!res.statusCode || res.statusCode >= 200 && res.statusCode '27000600')) {
 if (!obj.dontReport) {
 report36408({
 CgiPath: urlObj.pathname || '',
 Action: urlObj.searchParams.get('action') || getActionByData(obj.data) || '',
 Query: urlObj.search || '',
 PostData: obj.type === 'POST' && !(data instanceof Blob) ? data : '',
 Method: obj.type || '',
 RequestType: 20,
 RetType: 1,
 HttpCode: res.statusCode || 0,
 Ret: ((_c = resData === null || resData === void 0 ? void 0 : resData.base_resp) === null || _c === void 0 ? void 0 : _c.ret) || 0
 });
 }
 var _retryTime = retryTime++;
 R$4.invoke('updatePageAuth', {}, function (res) {
 console.log('[skeleton] updatePageAuth', res);
 monitor$1.setSum(112287, 3, 1);
 if (res && res.err_msg && res.err_msg.indexOf(':ok') > -1) {
 window.top.pass_ticket = encodeURIComponent(Url.getQuery('pass_ticket', res.fullUrl).html(false).replace(/\s/g, '+'));
 if (obj.pass_ticket) {
 obj.pass_ticket = window.top.pass_ticket;
 }
 console.warn('[skeleton] updatePageAuth resetTopbar');
 var supportNewTopBar = MMVersion.isIOS && MMVersion.gtVersion('7.0.10', true);
 var showBottomBar = !!window.is_login;
 if (window.top.item_show_type === '0' && supportNewTopBar) {
 var top = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop || 0;
 setCurrentMpInfo(top > 40 && !showBottomBar);
 }
 try {
 obj.url = Url.addParam(obj.url, 'retry', _retryTime, true);
 } catch (err) {
 console.error(err);
 }
 jsapiRequest(obj, data);
 monitor$1.setSum(112287, 4, 1);
 } else {
 obj.success && obj.success(resData);
 obj.complete && obj.complete();
 if (MMVersion.isIOS) {
 monitor$1.setSum(112287, 35, 1);
 } else {
 monitor$1.setSum(112287, 36, 1);
 }
 reqLogItem.status = 200;
 reqLogItem.endTime = Date.now();
 reqLogItem.response = resData;
 networkEndLog(reqLogItem);
 }
 });
 } else {
 if (((_d = tmpResData === null || tmpResData === void 0 ? void 0 : tmpResData.base_resp) === null || _d === void 0 ? void 0 : _d.ret) !== 0) {
 if (!obj.dontReport) {
 report36408({
 CgiPath: urlObj.pathname || '',
 Action: urlObj.searchParams.get('action') || getActionByData(obj.data) || '',
 Query: urlObj.search || '',
 PostData: obj.type === 'POST' && !(data instanceof Blob) ? data : '',
 Method: obj.type || '',
 RequestType: 20,
 RetType: 4,
 HttpCode: res.statusCode || 0,
 Ret: ((_e = tmpResData === null || tmpResData === void 0 ? void 0 : tmpResData.base_resp) === null || _e === void 0 ? void 0 : _e.ret) || 0
 });
 }
 } else {
 if (!obj.dontReport) {
 report36408({
 CgiPath: urlObj.pathname || '',
 Action: urlObj.searchParams.get('action') || getActionByData(obj.data) || '',
 Query: urlObj.search || '',
 PostData: obj.type === 'POST' && !(data instanceof Blob) ? data : '',
 Method: obj.type || '',
 RequestType: 20,
 RetType: 0,
 HttpCode: res.statusCode || 0,
 Ret: ((_f = tmpResData === null || tmpResData === void 0 ? void 0 : tmpResData.base_resp) === null || _f === void 0 ? void 0 : _f.ret) || 0
 });
 }
 }
 obj.success && obj.success(resData);
 obj.complete && obj.complete();
 reqLogItem.status = 200;
 reqLogItem.endTime = Date.now();
 reqLogItem.response = resData;
 networkEndLog(reqLogItem);
 }
 } else if (res.err_msg.indexOf('no permission') > -1 || !MMVersion.isOnlyWechat) {
 if (!obj.dontReport) {
 report36408({
 CgiPath: urlObj.pathname || '',
 Action: urlObj.searchParams.get('action') || getActionByData(obj.data) || '',
 Query: urlObj.search || '',
 PostData: obj.type === 'POST' && !(data instanceof Blob) ? data : '',
 Method: obj.type || '',
 RequestType: 20,
 RetType: 1,
 HttpCode: res.statusCode || 0,
 Ret: 0
 });
 }
 Ajax(obj);
 if (res.err_msg.indexOf('no permission') > -1) {
 console.warn('[JSAPI Request] No permission');
 monitor$1.setSum(112287, 31, 1);
 }
 reqLogItem.status = 302;
 reqLogItem.endTime = Date.now();
 reqLogItem.response = res;
 networkEndLog(reqLogItem);
 } else {
 if (!obj.dontReport) {
 report36408({
 CgiPath: urlObj.pathname || '',
 Action: urlObj.searchParams.get('action') || getActionByData(obj.data) || '',
 Query: urlObj.search || '',
 PostData: obj.type === 'POST' && !(data instanceof Blob) ? data : '',
 Method: obj.type || '',
 RequestType: 20,
 RetType: 2,
 HttpCode: res.statusCode || 0,
 Ret: 0
 });
 }
 obj.error && obj.error(null, {
 type: 3,
 error: res,
 status: 0
 });
 obj.complete && obj.complete();
 monitor$1.setSum(112287, 32, 1);
 var sample = 0.001;
 if (Math.random() = 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc = 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc = 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
 var AjaxRouter = function () {
 var _ref = _asyncToGenerator$1( _regeneratorRuntime$5().mark(function _callee(obj) {
 return _regeneratorRuntime$5().wrap(function _callee$(_context) {
 while (1) switch (_context.prev = _context.next) {
 case 0:
 if (!window.__secPageAuthPromise) {
 _context.next = 3;
 break;
 }
 _context.next = 3;
 return window.__secPageAuthPromise;
 case 3:
 if (!(!MMVersion.isWxWork && (window.__second_open__ || !getIsAcrossOrigin() && top.window.__second_open__) && window.__is_page_auth_return__ && !obj.pureHttp)) {
 _context.next = 5;
 break;
 }
 return _context.abrupt("return", AjaxWx(obj));
 case 5:
 return _context.abrupt("return", Ajax(obj));
 case 6:
 case "end":
 return _context.stop();
 }
 }, _callee);
 }));
 return function AjaxRouter(_x) {
 return _ref.apply(this, arguments);
 };
 }();

 var html$1 = function html(_str, encode) {
 if (!_str) return '';
 var replace = ['`', '`', ''', '\'', '"', '"', ' ', ' ', '>', '>', '<', ' '];
 
 var replaceReverse = ['&', '&', '¥', '¥', ' ', '>', ' ', ' ', '"', '"', '\'', ''', '`', '`'];
 var str = _str;
 var target;
 if (encode) {
 target = replaceReverse;
 } else {
 target = replace;
 }
 for (var i = 0; i ', '<', ' ', '>', '"', '"', '\'', ''', '`', '`'];
 var str = _str;
 var target;
 if (encode) {
 target = replaceReverse;
 } else {
 target = replace;
 }
 for (var i = 0; i -1) {
 new Image().src = "".concat(location.protocol, "//mp.weixin.qq.com/mp/jsmonitor?idkey=68064_13_1&r=").concat(Math.random());
 }
 obj.x5 = isx5 ? '1' : '0';
 obj.f = 'json';
 return Url.join(url, obj);
 }
 function isObj(obj) {
 return obj && _typeof$3(obj) === 'object';
 }
 function assign(target, source) {
 if (isObj(target) && isObj(source)) {
 for (var key in source) {
 if (Object.prototype.hasOwnProperty.call(source, key)) {
 target[key] = source[key];
 }
 }
 }
 }
 function assembleReportData(initiative) {
 var leaveReportLog = [];
 leaveReportLog.push({
 content: "[LeaveReport] specificData keys: ".concat(Object.keys(specificData)),
 timestamp: Date.now()
 });
 Log.log("[LeaveReport] specificData keys: ".concat(Object.keys(specificData)));
 console.log("[LeaveReport] specificData keys: ".concat(Object.keys(specificData)));
 var allReportData = {};
 for (var reportField in specificData) {
 if (!allReportData[reportField]) {
 allReportData[reportField] = {};
 }
 for (var i = 0; i = BATCH_SIZE) {
 batchReport();
 } else {
 if (!timeOutId) {
 timeOutId = setTimeout(function () {
 batchReport();
 clearTimeout(timeOutId);
 timeOutId = null;
 }, BATCH_TIME);
 }
 }
 }
 _leaveReport.addReport(function () {
 var repeatedReportJson = getRepeatedReportJson();
 if (!repeatedReportJson) return false;
 var reportData = [];
 for (var _i = 0, _Object$entries = Object.entries(repeatedReportJson); _i = 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc = 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc = 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
 function i$2(_x) {
 return _i.apply(this, arguments);
 }
 function _i() {
 _i = asyncToGenerator( _regeneratorRuntime$4().mark(function _callee(o) {
 return _regeneratorRuntime$4().wrap(function _callee$(_context) {
 while (1) switch (_context.prev = _context.next) {
 case 0:
 return _context.abrupt("return", new Promise(function (n) {
 R$4.invoke("handleEcsAction", {
 action: "openEcs",
 ecsJumpInfoBase64: o
 }, function (c) {
 n(c);
 });
 }));
 case 1:
 case "end":
 return _context.stop();
 }
 }, _callee);
 }));
 return _i.apply(this, arguments);
 }
 function t$3() {
 return _t.apply(this, arguments);
 }
 function _t() {
 _t = asyncToGenerator( _regeneratorRuntime$4().mark(function _callee2() {
 return _regeneratorRuntime$4().wrap(function _callee2$(_context2) {
 while (1) switch (_context2.prev = _context2.next) {
 case 0:
 return _context2.abrupt("return", new Promise(function (o) {
 R$4.invoke("handleEcsAction", {
 action: "checkAction",
 params: {
 method: "isActionAvailable",
 actionName: "openEcs",
 actionVersion: "1"
 }
 }, function (n) {
 n != null && n.result ? o(!0) : o(!1);
 });
 }));
 case 1:
 case "end":
 return _context2.stop();
 }
 }, _callee2);
 }));
 return _t.apply(this, arguments);
 }

 function _arrayWithHoles(arr) {
 if (Array.isArray(arr)) return arr;
 }
 var arrayWithHoles$1 = _arrayWithHoles;

 function _iterableToArrayLimit(arr, i) {
 if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
 var _arr = [];
 var _n = true;
 var _d = false;
 var _e = undefined;
 try {
 for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
 _arr.push(_s.value);
 if (i && _arr.length === i) break;
 }
 } catch (err) {
 _d = true;
 _e = err;
 } finally {
 try {
 if (!_n && _i["return"] != null) _i["return"]();
 } finally {
 if (_d) throw _e;
 }
 }
 return _arr;
 }
 var iterableToArrayLimit$1 = _iterableToArrayLimit;

 function _arrayLikeToArray(arr, len) {
 if (len == null || len > arr.length) len = arr.length;
 for (var i = 0, arr2 = new Array(len); i = 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc = 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc = 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
 function ownKeys$a(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
 function _objectSpread$a(e) { for (var r = 1; r 1 && (t -= 1), t 0.5 ? a / (2 - o - s) : a / (o + s), o) {
 case n:
 r = (e - t) / a + (e 0 && arguments[0] !== undefined ? arguments[0] : [];
 var _n = slicedToArray(n, 3),
 e = _n[0],
 t = _n[1],
 o = _n[2],
 s = t / 100,
 r = o / 100;
 var i, c, a;
 if (s === 0) i = c = a = r;else {
 var u = r 0 && arguments[0] !== undefined ? arguments[0] : [];
 var _n2 = slicedToArray(n, 3),
 e = _n2[0],
 t = _n2[1],
 o = _n2[2];
 if (e 255 || t 255 || o 255) throw new Error("RGB values must be in the range 0-255");
 var s = function s(r) {
 var i = r.toString(16).toUpperCase();
 return i.length === 1 ? "0" + i : i;
 };
 return "#".concat(s(e)).concat(s(t)).concat(s(o));
 }
 var d$5;
 function _$4() {
 var e, t;
 return {
 exportkey: Url.getQuery("exportkey"),
 __biz: window.biz,
 article_info: {
 mp_biz: (window == null ? void 0 : window.atob(window.biz || "")) || "",
 item_idx: Number(window.itemidx || window.idx),
 appmsgid: Number(window.mid),
 item_show_type: Number(window.item_show_type),
 mp_article_scene: Number(window.source),
 mp_sub_scene: Number(window.subscene),
 mp_get_a8key_scene: Number(window.ascene),
 carrier_type: ((t = (e = window.cgiData) == null ? void 0 : e.product_activity) == null ? void 0 : t.activity_type) || 0,
 search_click_id: Url.getQuery("search_click_id")
 }
 };
 }
 var x$2 = 150;
 var p$2 = 0;
 function N$1() {
 return _N.apply(this, arguments);
 }
 function _N() {
 _N = asyncToGenerator( _regeneratorRuntime$3().mark(function _callee() {
 return _regeneratorRuntime$3().wrap(function _callee$(_context) {
 while (1) switch (_context.prev = _context.next) {
 case 0:
 return _context.abrupt("return", d$5 || (window.__secPageAuthPromise ? new Promise(function (n) {
 window.__secPageAuthPromise.then(function () {
 d$5 = _$4(), n(d$5);
 });
 }) : (_typeof$2(window.itemidx || window.idx) > "u" || _typeof$2(window.mid) > "u" || _typeof$2(window.item_show_type) > "u") && p$2 0 && arguments[0] !== undefined ? arguments[0] : [];
 var a;
 var _ref = (_ref2 = (a = n.filter(function (_ref3) {
 var u = _ref3.red,
 w = _ref3.green,
 m = _ref3.blue;
 return !(u === 255 && w === 255 && m === 255);
 })) == null ? void 0 : a[0]) !== null && _ref2 !== void 0 ? _ref2 : {
 red: 76,
 green: 76,
 blue: 76
 },
 e = _ref.red,
 t = _ref.green,
 o = _ref.blue,
 _h = h$3(e, t, o),
 _h2 = slicedToArray(_h, 3),
 s = _h2[0],
 r = _h2[1],
 i = _h2[2];
 i = Math.min(i, 0.2);
 var c = g$6([s, r * 100, i * 100]);
 return e = c[0], t = c[1], o = c[2], [y$2([e, t, o]), {
 red: e,
 green: t,
 blue: o
 }];
 }
 function M$2() {
 return (typeof window === "undefined" ? "undefined" : _typeof$2(window)) 0 && arguments[0] !== undefined ? arguments[0] : [];
 var e = arguments.length > 1 ? arguments[1] : undefined;
 var o = [];
 return t.childNodes.forEach(function (n) {
 var s = L$2(n);
 if ("data-shadow-slot" in s) {
 if (!s.slot) return;
 var l = {
 attrs: s,
 domProps: {
 innerHTML: n.innerHTML === "" ? n.innerText : n.innerHTML
 },
 slot: s.slot
 };
 s.slot = void 0;
 var m = e(n.tagName, l);
 o.push(m);
 } else if (s.slot) {
 var _l = e("slot", {
 attrs: {
 name: s.slot
 },
 slot: s.slot
 });
 o.push(_l);
 }
 }), o;
 }
 function H$3(_ref) {
 var t = _ref.iframeWindow,
 e = _ref.Component,
 o = _ref.platform,
 n = _ref.customName,
 s = _ref.styleText,
 _ref$extraInfo = _ref.extraInfo,
 l = _ref$extraInfo === void 0 ? {} : _ref$extraInfo,
 m = _ref.watchAttr,
 b = _ref.beforeRender,
 g = _ref.afterRender,
 E = _ref.selector,
 y = _ref.afterMounted,
 w = _ref.reflowProps,
 C = _ref.getProps,
 _ref$eventName = _ref.eventName,
 A = _ref$eventName === void 0 ? [] : _ref$eventName;
 var d = window;
 t && (d = t), l.window = d;
 var $ = window.test_autospace;
 d.customElements.define(n, function (_d$HTMLElement) {
 inherits(_class, _d$HTMLElement);
 function _class() {
 var _this;
 classCallCheck(this, _class);
 _this = _callSuper(this, _class);
 var a = _this.attachShadow({
 mode: "open"
 });
 _this.shadow = a;
 return _this;
 }
 createClass(_class, [{
 key: "connectedCallback",
 value: function connectedCallback() {
 var _this2 = this;
 if (!e.install) {
 if (e.props && w && w.length) {
 var i = {
 watch: {}
 };
 w.forEach(function (u) {
 i.watch[u] = function () {
 var p = this.$el.getRootNode().host,
 x = {
 compEle: p,
 compType: n,
 compIdx: Array.from(document.querySelectorAll(E || n)).indexOf(p)
 };
 b && b(Object.assign({
 subCompType: u
 }, x)), this.$nextTick(function () {
 g && g(Object.assign({
 subCompType: u
 }, x));
 });
 };
 }), e.mixins.push(i);
 }
 typeof e.template == "function" && e.template(e);
 }
 var a = A.reduce(function (i, u) {
 return i[u] = function (p) {
 _this2.dispatchCustomEvent(u, p);
 }, i;
 }, {}),
 c = new Vue({
 render: function render(i) {
 return i(e, {
 props: C.call(_this2, o, l),
 on: a
 }, j$2(_this2, i));
 }
 });
 this.wrapper = c;
 var r = document.createElement("style");
 r.textContent = " \n :host {\n all: initial;\n -webkit-text-size-adjust: inherit;\n ".concat($ ? "text-autospace: normal" : "", "\n }\n \n "), this.shadowRoot.appendChild(r);
 var h = document.createElement("style");
 h.appendChild(document.createTextNode(s)), this.shadowRoot.appendChild(h), this.wrapper.$mount(), this.shadowRoot.appendChild(this.wrapper.$el), this.debounceUpdate = this.debounce(function () {
 console.log("forceUpdate"), _this2.wrapper && _this2.wrapper.$forceUpdate();
 }, 500), this.classList.add("mp_common_widget"), y && y.call(this);
 }
 }, {
 key: "debounce",
 value: function debounce(a, c) {
 var r;
 return function () {
 for (var _len = arguments.length, h = new Array(_len), _key = 0; _key 2 && arguments[2] !== undefined ? arguments[2] : !1;
 var t = h$2(o);
 var r = t.queryStr;
 var c = [];
 if (_typeof$2(e) == "object") for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && c.push(n + "=" + (s ? e[n] : encodeURIComponent(e[n])));else c.push(s ? e : encodeURIComponent(e));
 return c.length > 0 && (r += (r !== "" ? "&" : "") + c.join("&")), "".concat(t.host).concat(r !== "" ? "?" + r : "").concat(t.hash !== "" ? "#" + t.hash : "");
 }

 function v$2(r, a, d, h, i, t, f, u) {
 var e = typeof r == "function" ? r.options : r;
 a && (e.render = a, e.staticRenderFns = d, e._compiled = !0), h && (e.functional = !0), t && (e._scopeId = "data-v-" + t);
 var o;
 if (f ? (o = function o(n) {
 n = n ||
 this.$vnode && this.$vnode.ssrContext ||
 this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext, !n && (typeof __VUE_SSR_CONTEXT__ === "undefined" ? "undefined" : _typeof$2(__VUE_SSR_CONTEXT__)) = 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc = 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc = 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
 function ownKeys$9(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
 function _objectSpread$9(e) { for (var r = 1; r 0 ? 8 : 0);
 if (i + E 1 && arguments[1] !== undefined ? arguments[1] : 1;
 var e = Number(A);
 return Number.isNaN(e) ? (console.warn("[formatUnit] The count is an invalid value!"), "0") : e === 0 ? "0" : e = 0.5) {
 _this7.$emit("expose", !_this7.hasExpose), _this7.hasExpose = !0;
 try {
 e && (_this7.timeout = setTimeout(function () {
 _this7.isIframe ? e.contentWindow && g$5(e.contentWindow, "webEvent", {
 type: "valid_expose"
 }) : _this7.report("element_valid_expose");
 }, 500));
 } catch (i) {
 console.error(i);
 }
 } else _this7.timeout && clearTimeout(_this7.timeout);
 });
 }, {
 threshold: 0.5
 }), this.observer.observe(this.$refs.js_custom_element);
 },
 handleMessage: function handleMessage(A) {
 if (A.origin !== rt) return;
 var t = this.$refs.iframeRef;
 if (t && A.source === t.contentWindow) {
 var _Et = Et(A.data),
 e = _Et.action,
 i = _Et.value;
 switch (e) {
 case "changeFrameStyle":
 this.changeFrameStyle(A, i);
 break;
 case "onFrameReady":
 this.onFrameReady(A, t);
 break;
 case "webEvent":
 i.type === "click" ? this.clickProduct(A) : i.type === "toast" ? window.weui.toast(i.msg, {
 extClass: "weui-toast_text common_product_toast"
 }) : i.type === "dialog" && window.weui.dialog(i);
 break;
 }
 this.$emit("iframe-message", A);
 }
 },
 onFrameReady: function onFrameReady(A, t) {
 this.iframeLoadTimeout && clearTimeout(this.iframeLoadTimeout), this.iframeLoading = !1, this.setProductData(A.source, t), this.extraInfo.window && g$5(this.extraInfo.window, "setPageData", {
 darkMode: this.extraInfo.window.matchMedia("(prefers-color-scheme: dark)").matches
 }), this.isEditor || this.exposureReport();
 },
 onCardReady: function onCardReady() {
 if (this.iframeLoadTimeout && clearTimeout(this.iframeLoadTimeout), this.iframeLoading = !1, this.windowproduct) {
 var A = this.$el.getRootNode().host;
 removePlaceholder(A, this.windowproduct);
 var t = A && A.parentNode;
 if (t) {
 var e = t.querySelector(".wx_img_placeholder");
 e && t.removeChild(e);
 }
 }
 this.emitCardReadyEvent(), this.isEditor || this.exposureReport();
 },
 clickProduct: function clickProduct(A) {
 this.extraInfo.window && this.extraInfo.window.clickedProductWin && A.source !== this.extraInfo.window.clickedProductWin && g$5(this.extraInfo.window.clickedProductWin, "webEvent", {
 type: "unclick"
 }), this.extraInfo.window && (this.extraInfo.window.clickedProductWin = A.source), this.active = !0;
 },
 setProductData: function setProductData(A) {
 g$5(A, "setData", {
 infos: {
 scene: "edit"
 }
 }), this.immutable && g$5(A, "setPageData", {
 scene: "immutable"
 });
 },
 changeFrameStyle: function changeFrameStyle(A, t) {
 if (!(!t || _typeof$2(t) != "object" || this.cardtype === 2)) try {
 this.transferStyle = JSON.stringify(t);
 } catch (e) {
 console.error(e);
 }
 },
 getBRecommendIframeUrl: function getBRecommendIframeUrl() {
 var A = _objectSpread$9({
 reqScene: this.req_scene
 }, this.urlParams),
 t = window && window.wx && window.wx.data && window.wx.data.t || p$1(window.location.href).token || this.token;
 return t && (A.token = t), this.cardtype && (A.cardtype = 1), u$3(at, A);
 },
 getBUrl: function getBUrl() {
 if (this.cardtype === ot) return this.getBRecommendIframeUrl();
 var A = _objectSpread$9({
 productkey: this.windowproduct,
 reqScene: this.req_scene
 }, this.urlParams),
 t = window && window.wx && window.wx.data && window.wx.data.t || p$1(window.location.href).token || this.token;
 return t && (A.token = t), this.cardtype && (A.cardtype = this.cardtype), this.isIframe ? u$3(tt, A) : u$3(it, A);
 },
 getCUrl: function getCUrl() {
 var A = _objectSpread$9({
 productkey: this.windowproduct,
 reqScene: this.req_scene
 }, this.urlParams);
 return this.exportkey && (A.exportkey = this.exportkey), this.wap_export_token && (A.wap_export_token = this.wap_export_token), this.ecsource && (A.ecsource = this.ecsource), this.cardtype && (A.cardtype = this.cardtype), u$3(Bt, A);
 },
 openShop: function openShop() {
 var A = this.$refs.iframeRef;
 this.outerclick ? this.$emit("element-click", this.$refs.js_custom_element) : !this.isEditor && A && g$5(A.contentWindow, "webEvent", {
 type: "openShop",
 clickType: 0
 });
 },
 getBCardData: function getBCardData() {
 var _this8 = this;
 this.failMsg = "", ajax({
 url: this.getBUrl(),
 type: "GET",
 dataType: "json",
 contentType: "application/json; charset=UTF-8",
 success: function success(A) {
 var t, e, i, B;
 ((t = A == null ? void 0 : A.resp) == null ? void 0 : t.code) === 0 && (e = A == null ? void 0 : A.resp) != null && e.data ? _this8.productCard = T$5((i = A == null ? void 0 : A.resp) == null ? void 0 : i.data) : _this8.failMsg = ((B = A == null ? void 0 : A.resp) == null ? void 0 : B.msg) || "商品信息获取失败";
 },
 error: function error(A) {
 console.error("获取商品数据失败:"), _this8.failMsg = "商品信息获取失败";
 }
 });
 },
 getCCardData: function getCCardData() {
 var _this9 = this;
 var e, i;
 var A = {
 article_info: btoa(JSON.stringify({
 mp_biz: atob(window.biz || ""),
 item_idx: Number(window.itemidx || window.idx || 0),
 appmsgid: Number(window.mid || 0),
 item_show_type: Number(window.item_show_type || 0),
 mp_article_scene: Number(window.source || 0),
 mp_sub_scene: Number(window.subscene || 0),
 mp_get_a8key_scene: Number(window.ascene || 0),
 carrier_type: ((i = (e = window.cgiData) == null ? void 0 : e.product_activity) == null ? void 0 : i.activity_type) || 0,
 search_click_id: Url.getQuery("search_click_id") || ""
 })),
 exportkey: Url.getQuery("exportkey") || "",
 wap_export_token: this.wap_export_token || "",
 ecsource: this.ecsource || ""
 },
 t = Object.keys(A).map(function (B) {
 return "".concat(B, "=").concat(A[B]);
 }).join("&");
 this.qrCodeUrl = this.qrCodeUrl.concat(A.article_info), ajax({
 url: "/mmec/biz_batchgetproductcard?".concat(t),
 type: "POST",
 data: JSON.stringify({
 productkey_list: [this.windowproduct],
 cardtype: this.cardtype
 }),
 dataType: "json",
 contentType: "application/json; charset=UTF-8",
 success: function success(B) {
 B.product_card_list && B.product_card_list.length > 0 ? (_this9.productCard = T$5(B.product_card_list[0].product_card_info), _this9.$forceUpdate()) : console.log("未获取到商品数据");
 },
 error: function error(B) {
 console.error("获取商品数据失败:", B);
 }
 });
 },
 initProductInfo: function initProductInfo() {
 this.windowproduct && (this.isEditor ? this.getBCardData() : this.getCCardData());
 },
 openJumpInfo: function openJumpInfo(A) {
 var _this10 = this;
 return asyncToGenerator( _regeneratorRuntime$2().mark(function _callee() {
 var t, e;
 return _regeneratorRuntime$2().wrap(function _callee$(_context) {
 while (1) switch (_context.prev = _context.next) {
 case 0:
 if (!(_this10.platform === "wechat")) {
 _context.next = 11;
 break;
 }
 _context.next = 3;
 return t$3();
 case 3:
 if (!_context.sent) {
 _context.next = 8;
 break;
 }
 _context.next = 6;
 return i$2(A);
 case 6:
 _context.next = 9;
 break;
 case 8:
 (t = window == null ? void 0 : window.weui) == null || t.toast("当前版本不支持打开页面", {
 extClass: "weui-toast_text"
 });
 case 9:
 _context.next = 12;
 break;
 case 11:
 (e = window == null ? void 0 : window.weui) == null || e.toast("请在手机微信中打开", {
 extClass: "weui-toast_text"
 });
 case 12:
 case "end":
 return _context.stop();
 }
 }, _callee);
 }))();
 },
 handleOpenProduct: function handleOpenProduct() {
 this.openJumpInfo(this.jumpInfo.cardJumpInfoBase64Str);
 },
 handleBuy: function handleBuy() {
 this.openJumpInfo(this.jumpInfo.buyButtonJumpInfoBase64Str);
 },
 handleGift: function handleGift() {
 this.openJumpInfo(this.jumpInfo.giftJumpInfoBase64Str);
 },
 emitCardReadyEvent: function emitCardReadyEvent() {
 var A = {
 data: JSON.stringify({
 action: "onFrameReady",
 value: {
 productTitle: this.productCard.title,
 productName: this.productCard.title,
 qrcodeUrl: this.qrCodeUrl
 }
 })
 },
 t = new CustomEvent("iframe-message", {
 detail: A,
 bubbles: !0
 });
 this.$el.dispatchEvent(t), this.$emit("iframe-message", A);
 },
 emitCardClickEvent: function emitCardClickEvent() {
 var A = {
 data: JSON.stringify({
 action: "webEvent",
 value: {
 type: "click"
 }
 })
 },
 t = new CustomEvent("iframe-message", {
 detail: A,
 bubbles: !0
 });
 this.$el.dispatchEvent(t), this.$emit("iframe-message", A);
 },
 handleProductClick: function handleProductClick(A) {
 var t, e;
 if (this.emitCardClickEvent(), this.clientType !== "B") {
 if (this.report("element_click"), Device.os.pc) {
 this.$set(this.productCard, "qrCodeUrl", this.qrCodeUrl);
 return;
 } else if (!MMVersion.isWechat) {
 (t = window == null ? void 0 : window.weui) == null || t.toast("请在手机微信中打开", {
 extClass: "weui-toast_text"
 });
 return;
 }
 A === "product" ? this.handleOpenProduct() : A === "buy" ? this.handleBuy() : A === "gift" ? this.handleGift() : A === "giftFail" && ((e = window == null ? void 0 : window.weui) == null || e.alert(this.productCard.canntGivePresentMsg || "该商品不支持赠送", {
 extClass: "weui-toast_text"
 }));
 }
 },
 report: function report(A) {
 var _this11 = this;
 return asyncToGenerator( _regeneratorRuntime$2().mark(function _callee2() {
 var t, i;
 return _regeneratorRuntime$2().wrap(function _callee2$(_context2) {
 while (1) switch (_context2.prev = _context2.next) {
 case 0:
 _context2.next = 2;
 return N$1();
 case 2:
 t = _context2.sent;
 i = {
 logid: "23782",
 data: {
 event: A,
 params: JSON.stringify({
 page_name: "mp_article_page",
 element_name: "commodity_card",
 productid: _this11.productCard.productId,
 mp_article_bizuin: t.article_info.mp_biz,
 mp_article_appmsgid: t.article_info.appmsgid,
 mp_article_item_idx: t.article_info.item_idx,
 mp_article_item_show_type: t.article_info.item_show_type,
 scene: t.article_info.mp_article_scene,
 cardtype: _this11.cardtype,
 appid: _this11.productCard.appid,
 shopLabelTag: _this11.productCard.shopLabelTag || 0
 })
 }
 };
 O$5(i);
 case 5:
 case "end":
 return _context2.stop();
 }
 }, _callee2);
 }))();
 }
 }
 };
 var st = function st() {
 var t = this,
 e = t._self._c;
 return t.cardtype === 2 ? e("span", {
 ref: "js_custom_element",
 staticClass: "product_card_text_wrp",
 style: t.wrpStyle,
 on: {
 click: t.openShop
 }
 }, [e("a", {
 staticClass: "product_text_link",
 style: t.isEditor ? "color: #576B95" : "",
 attrs: {
 part: "link",
 href: "javascript:void(0);"
 }
 }, [t._v(t._s(t.title))]), t.showIframe ? e("iframe", {
 ref: "iframeRef",
 staticClass: "iframe_style",
 style: [t.iframeStyle, {
 display: "none"
 }],
 attrs: {
 src: t.iframeUrl,
 scrolling: "no",
 frameborder: "0"
 }
 }) : t._e()]) : t.cardtype === 4 ? e("div", {
 ref: "js_custom_element",
 staticClass: "activity_card_wrp",
 on: {
 click: t.openShop
 }
 }, [e("div", {
 staticClass: "activity_card_wrp__container"
 }, [e("img", {
 staticClass: "product_image",
 attrs: {
 src: t.productImage,
 alt: ""
 }
 }), e("transition", {
 attrs: {
 name: "fade"
 }
 }, [t.discountedPrice ? e("span", {
 staticClass: "discounted_price"
 }, [t._v("¥" + t._s(t.discountedPrice))]) : t._e()]), e("span", {
 key: t.discountedPrice,
 staticClass: "origin_price",
 "class": {
 has_discount: t.discountedPrice
 }
 }, [t._v("¥" + t._s(t.originPrice))])], 1), t.showIframe ? e("iframe", {
 ref: "iframeRef",
 staticClass: "iframe_style",
 style: [t.iframeStyle, {
 display: "none"
 }],
 attrs: {
 src: t.iframeUrl,
 scrolling: "no",
 frameborder: "0"
 }
 }) : t._e()]) : t.cardtype === 5 ? e("div", {
 ref: "js_custom_element",
 staticClass: "s1s_card_wrp",
 on: {
 click: t.openShop
 }
 }, [e("img", {
 staticClass: "product-image",
 attrs: {
 src: t.productInfo.product_info.img_url,
 alt: "商品图片"
 }
 }), e("div", {
 staticClass: "product-info"
 }, [e("div", {
 staticClass: "product-title"
 }, [t._v(t._s(t.productInfo.product_info.title))]), e("div", {
 staticClass: "product-centercontainer"
 }, [e("span", {
 staticClass: "discount-price"
 }, [t._v("¥" + t._s(t.productInfo.product_info.selling_price / 100))]), t.productInfo.product_info.market_price && t.productInfo.product_info.market_price !== t.productInfo.product_info.selling_price ? [e("span", {
 staticClass: "discount-price__extra"
 }, [t._v("起 " + t._s(t.productInfo.product_info.selling_price_wording))]), e("span", {
 "class": "product-price ".concat(t.productInfo.product_info.friend_send_cnt ? "need-border" : "")
 }, [t._v("¥" + t._s(t.productInfo.product_info.market_price / 100))])] : t._e(), t.productInfo.product_info.friend_send_cnt ? e("div", {
 staticClass: "product-gifts"
 }, [t._v("朋友送过"), e("span", {
 staticClass: "product-gifts__num"
 }, [t._v(t._s(t.productInfo.product_info.friend_send_cnt))]), t._v("次 ")]) : t._e()], 2), e("div", {
 staticClass: "product-brand"
 }, [e("i", {
 staticClass: "product-logo"
 }), t._v(t._s(t.productInfo.shop_info.shop_window_profile_name) + " "), t.productInfo.shop_info.brand_icon_url ? e("img", {
 staticClass: "shop-verify-icon",
 attrs: {
 src: t.productInfo.shop_info.brand_icon_url
 }
 }) : t._e()])]), t.showIframe ? e("iframe", {
 ref: "iframeRef",
 staticClass: "iframe_style",
 style: [t.iframeStyle, {
 display: "none"
 }],
 attrs: {
 src: t.iframeUrl,
 scrolling: "no",
 frameborder: "0"
 }
 }) : t._e()]) : t.cardtype === 6 ? e("div", {
 directives: [{
 name: "show",
 rawName: "v-show",
 value: !t.iframeLoading,
 expression: "!iframeLoading"
 }],
 ref: "js_custom_element",
 staticClass: "product_spot_card_wrp",
 on: {
 click: t.openShop
 }
 }, [t._t("spot-product"), t.showIframe ? e("iframe", {
 ref: "iframeRef",
 staticClass: "iframe_style",
 style: [t.iframeStyle, {
 display: "none"
 }],
 attrs: {
 src: t.iframeUrl,
 scrolling: "no",
 frameborder: "0"
 }
 }) : t._e()], 2) : t.cardtype === 12 ? e("div", {
 directives: [{
 name: "show",
 rawName: "v-show",
 value: !t.iframeLoading,
 expression: "!iframeLoading"
 }],
 ref: "js_custom_element",
 staticClass: "product_image_wrp"
 }, [t.showIframe ? e("iframe", {
 ref: "iframeRef",
 staticClass: "iframe_style",
 style: [t.iframeStyle, {
 display: "none"
 }],
 attrs: {
 src: t.iframeUrl,
 scrolling: "no",
 frameborder: "0"
 }
 }) : t._e()]) : t.cardtype === 8 ? e("div", {
 directives: [{
 name: "show",
 rawName: "v-show",
 value: !t.iframeLoading,
 expression: "!iframeLoading"
 }],
 ref: "js_custom_element",
 staticClass: "product_recommend_card_wrp"
 }, [t.showIframe ? e("iframe", {
 ref: "iframeRef",
 staticClass: "iframe_style",
 style: JSON.parse(t.customstyle || "{}"),
 attrs: {
 src: t.iframeUrl,
 scrolling: "no",
 frameborder: "0"
 }
 }) : t._e()]) : e("div", {
 ref: "js_custom_element",
 "class": ["iframe_wrp", "wx_card_root", t.is_hover === 1 ? "wx_hover_card" : "", t.is_selected === 1 ? "wx_selected_card" : ""],
 style: t.wrpStyle
 }, [t.productCard ? e("Product", {
 ref: "productCardRef",
 attrs: {
 product: t.productCard,
 "card-type": t.cardtype,
 "client-type": t.clientType,
 "is-p-c": t.isPC,
 "dark-mode": t.darkMode
 },
 on: {
 open: function open(i) {
 return t.handleProductClick(i);
 },
 ready: t.onCardReady
 }
 }) : t.failMsg && t.isEditor ? e("div", {
 staticClass: "product_load_fail",
 attrs: {
 role: "alert",
 "aria-live": "polite"
 },
 on: {
 click: t.emitCardClickEvent
 }
 }, [e("div", {
 staticClass: "product_load_fail__text"
 }, [t._v(t._s(t.failMsg))])]) : e("div")], 1);
 },
 dt = [],
 wt = v$2(ct, st, dt, !1, null, "024c715f", null, null);
 var gt = wt.exports,
 nt = ".qr-fade-enter-active[data-v-11924fb1],.qr-fade-leave-active[data-v-11924fb1]{transition:opacity .2s cubic-bezier(.4,0,.2,1)}.qr-fade-enter-from[data-v-11924fb1],.qr-fade-leave-to[data-v-11924fb1]{opacity:0}.qr-fade-enter-to[data-v-11924fb1],.qr-fade-leave-from[data-v-11924fb1]{opacity:1}.qr-popover[data-v-11924fb1]{background:#ffffff;-webkit-backdrop-filter:none;backdrop-filter:none;filter:none;box-shadow:0 4px 30px #0003;padding:10px 12px 10px 10px;pointer-events:auto;display:flex;align-items:center;border-radius:12px;transform-origin:center bottom}.qr-popover[data-v-11924fb1]:after{content:\"\";position:absolute;top:100%;left:50%;transform:translate(-50%);border-left:6px solid transparent;border-right:6px solid transparent;border-top:6px solid #ffffff}.qr-content[data-v-11924fb1]{display:flex;align-items:center;gap:12px;background:white;border-radius:6px}.qr-code-container[data-v-11924fb1]{flex-shrink:0}.qr-image-wrapper[data-v-11924fb1]{position:relative;width:76px;height:76px;border-radius:4px;overflow:hidden}.qr-code-image[data-v-11924fb1]{width:76px;height:76px;border-radius:4px;display:block;transition:opacity .2s ease}.qr-code-image.image-hidden[data-v-11924fb1]{opacity:0}.loading[data-v-11924fb1]{width:100%;height:100%;display:block;background:transparent url(\"data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient x1='94.087%25' y1='0%25' x2='94.087%25' y2='90.559%25' id='a'%3E%3Cstop stop-color='%23606060' stop-opacity='0' offset='0%25'/%3E%3Cstop stop-color='%23606060' stop-opacity='.3' offset='100%25'/%3E%3C/linearGradient%3E%3ClinearGradient x1='100%25' y1='8.674%25' y2='90.629%25' id='b'%3E%3Cstop stop-color='%23606060' offset='0%25'/%3E%3Cstop stop-color='%23606060' stop-opacity='.3' offset='100%25'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cg fill='none' fill-rule='evenodd' opacity='.9'%3E%3Cpath d='M40 0c22.091 0 40 17.909 40 40S62.091 80 40 80v-7c18.225 0 33-14.775 33-33S58.225 7 40 7V0z' fill='url(%23a)'/%3E%3Cpath d='M40 0v7C21.775 7 7 21.775 7 40s14.775 33 33 33v7C17.909 80 0 62.091 0 40S17.909 0 40 0z' fill='url(%23b)'/%3E%3Ccircle fill='%23606060' cx='40.5' cy='3.5' r='3.5'/%3E%3C/g%3E%3C/svg%3E\") no-repeat center center;background-size:contain;animation:qr-loading-spin-data-v-11924fb1 1s linear infinite;background-size:28px 28px}@keyframes qr-loading-spin-data-v-11924fb1{0%{transform:rotate(0)}to{transform:rotate(360deg)}}.qr-text[data-v-11924fb1]{font-size:12px;line-height:17px;font-weight:400;display:flex;flex-direction:column;color:#000000e6;justify-content:center;text-align:left}.qr-text-line[data-v-11924fb1]{white-space:nowrap}@media (max-width: 480px){.qr-popover[data-v-11924fb1]{padding:8px}.qr-content[data-v-11924fb1]{gap:8px;padding:6px}.qr-image-wrapper[data-v-11924fb1],.qr-code-image[data-v-11924fb1]{width:60px;height:60px}.qr-text[data-v-11924fb1]{font-size:11px;line-height:15px}}.product-title__outer[data-v-40afe61e]{margin-left:16px;margin-right:16px;margin-top:12px}.product-title__outer.little[data-v-40afe61e],.product-title__outer.bar[data-v-40afe61e]{margin:0}.product-title[data-v-40afe61e]{color:#000000e6;line-height:1.3;overflow:hidden;text-overflow:ellipsis}.product-title span[data-v-40afe61e]{font-size:15px}.two-line[data-v-40afe61e]{-webkit-box-orient:vertical;-webkit-line-clamp:2;line-clamp:2;display:-webkit-box}.one-line[data-v-40afe61e]{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.product-title img[data-v-40afe61e]{display:inline-block;height:1.1em;vertical-align:middle;margin-right:4px;margin-bottom:.2em}.product-title__outer.dark-mode .product-title[data-v-40afe61e]{color:#fffc}.product-shop__outer[data-v-1a13560c]{margin:16px 16px 8px}.product-shop__outer.bar[data-v-1a13560c]{margin:8px 12px}.product-shop[data-v-1a13560c]{overflow:hidden;position:relative;font-size:12px}.product-shop__inner[data-v-1a13560c]{align-items:center;display:flex;flex-direction:row;justify-content:space-between;overflow:hidden}.product-shop .left[data-v-1a13560c]{align-items:center;display:flex;flex-basis:0;flex-direction:row;flex-grow:1;height:1.4em;overflow:hidden}.product-shop .icon[data-v-1a13560c]{width:1.1em;height:1.1em;-o-object-fit:contain;object-fit:contain;border-radius:50%;flex-shrink:0;opacity:.5}.product-shop .right-icon[data-v-1a13560c]{-o-object-fit:contain;object-fit:contain;margin-left:.16em;flex-shrink:0}.product-shop .icon-r[data-v-1a13560c]{border-radius:50%;height:1.1em;width:1.1em}.product-shop .good-shop[data-v-1a13560c]{height:1.33em}.product-shop .text[data-v-1a13560c]{color:#0000004d;font-size:12px;line-height:1.4;margin-left:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.product-shop__outer.dark-mode .product-shop .text[data-v-1a13560c]{color:#ffffff4d}.product-shop__outer.dark-mode .product-shop .icon.img-color-invert[data-v-1a13560c]{filter:invert(1) brightness(2);opacity:.5}.btn__area[data-v-4b157c62]{display:flex;flex-direction:row;gap:8px}.btn[data-v-4b157c62]{-webkit-tap-highlight-color:rgba(0,0,0,0);align-items:center;background-color:#0000000d;border:0 solid transparent;border-radius:6px;color:#000000e6;cursor:pointer;display:flex;font-size:15px;font-weight:500;justify-content:center;margin:0;outline:none;overflow:hidden;padding:5.5px 12px;position:relative}.btn.type-primary[data-v-4b157c62]{background:#ff6146;color:#fff}.btn.type-secondary[data-v-4b157c62]{background:rgba(223,195,148,.3);color:#47332f}.btn.type-disabled[data-v-4b157c62]{background:rgba(0,0,0,.03);color:#00000026!important;cursor:not-allowed}.btn__area.dark-mode .btn[data-v-4b157c62]{color:#fff}.btn__area.dark-mode .btn.btn.type-secondary[data-v-4b157c62]{background:#faf0e7;color:#443a31}.btn__area.dark-mode .btn.btn.type-default[data-v-4b157c62]{background:hsla(0,0%,100%,.05);color:#fffc}.btn__area.dark-mode .btn.btn.type-disabled[data-v-4b157c62]{background:hsla(0,0%,100%,.3);color:#ffffff26!important}.product_status_text[data-v-4b157c62]{color:#0000004d;font-family:PingFang SC;font-size:12px;font-weight:400;line-height:1.75}.btn__area.dark-mode .product_status_text[data-v-4b157c62]{color:#ffffff4d}.product-img-container[data-v-c88442f6]{width:100%;position:relative;overflow:hidden;display:inline-block}.product-img.little[data-v-c88442f6]{border-radius:4px}.product-img.bar[data-v-c88442f6]{border-radius:2px}.product-img[data-v-c88442f6]{display:block}.product-img-error[data-v-c88442f6]{align-items:center;background-color:#00000005;color:#0000004d;font-size:14px;justify-content:center;position:absolute;top:0;left:0;right:0;bottom:0}.dark-mode .product-img-error[data-v-c88442f6]{background:#202020;color:#ffffff4d}.qrcode__outer[data-v-34552a2a]{margin-left:0;margin-right:0;padding-bottom:0;padding-top:0;position:relative;overflow:hidden;max-height:0;opacity:0;transition:max-height .4s cubic-bezier(.4,0,.2,1),opacity .3s cubic-bezier(.4,0,.2,1),padding .4s cubic-bezier(.4,0,.2,1);transform:translateY(-10px);transition:max-height .4s cubic-bezier(.4,0,.2,1),opacity .3s cubic-bezier(.4,0,.2,1),padding .4s cubic-bezier(.4,0,.2,1),transform .3s cubic-bezier(.4,0,.2,1)}.qrcode__outer[data-v-34552a2a]:before{border-top:1px solid rgba(0,0,0,.1);content:\"\";left:16px;position:absolute;right:16px;top:8px;transform:scaleY(.5)}.qrcode__outer.open[data-v-34552a2a]{max-height:300px;opacity:1;padding-bottom:44px;padding-top:8px;transform:translateY(0)}.qrcode__hd[data-v-34552a2a]{align-items:center;display:flex;flex-direction:row;justify-content:flex-end;margin-top:6px;opacity:0;transform:translateY(-5px);transition:opacity .3s cubic-bezier(.4,0,.2,1) .05s,transform .3s cubic-bezier(.4,0,.2,1) .05s}.qrcode__outer.open .qrcode__hd[data-v-34552a2a]{opacity:1;transform:translateY(0)}.close-area[data-v-34552a2a]{align-items:center;color:#00000080;cursor:pointer;display:flex;flex-direction:row;font-family:PingFang SC;font-size:14px;font-weight:400;margin-right:12px;padding:4px 4px 4px 0;position:relative;transition:color .2s ease,transform .2s ease;border-radius:4px}.close-area[data-v-34552a2a]:hover{color:#000000b3;transform:translateY(-1px)}.close-area[data-v-34552a2a]:active{transform:translateY(0)}.arrow-icon[data-v-34552a2a]{height:10px;margin-right:2px;opacity:.55;transform:rotate(180deg);width:20px;transition:opacity .2s ease,transform .3s cubic-bezier(.4,0,.2,1)}.close-area:hover .arrow-icon[data-v-34552a2a]{opacity:.8;transform:rotate(180deg) translateY(-1px)}.qrcode__bd[data-v-34552a2a]{align-items:center;display:flex;height:120px;justify-content:center;margin:10px auto 16px;position:relative;width:120px;opacity:0;transform:scale(.8);transition:opacity .3s cubic-bezier(.4,0,.2,1) .1s,transform .3s cubic-bezier(.4,0,.2,1) .1s}.qrcode__outer.open .qrcode__bd[data-v-34552a2a]{opacity:1;transform:scale(1)}.error-icon[data-v-34552a2a]{height:32px;opacity:.55;width:32px}.qrcode-img[data-v-34552a2a]{height:120px;width:120px;-o-object-fit:contain;object-fit:contain}.loading[data-v-34552a2a]{width:20px;height:20px;display:block;background:transparent url(\"data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient x1='94.087%25' y1='0%25' x2='94.087%25' y2='90.559%25' id='a'%3E%3Cstop stop-color='%23606060' stop-opacity='0' offset='0%25'/%3E%3Cstop stop-color='%23606060' stop-opacity='.3' offset='100%25'/%3E%3C/linearGradient%3E%3ClinearGradient x1='100%25' y1='8.674%25' y2='90.629%25' id='b'%3E%3Cstop stop-color='%23606060' offset='0%25'/%3E%3Cstop stop-color='%23606060' stop-opacity='.3' offset='100%25'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cg fill='none' fill-rule='evenodd' opacity='.9'%3E%3Cpath d='M40 0c22.091 0 40 17.909 40 40S62.091 80 40 80v-7c18.225 0 33-14.775 33-33S58.225 7 40 7V0z' fill='url(%23a)'/%3E%3Cpath d='M40 0v7C21.775 7 7 21.775 7 40s14.775 33 33 33v7C17.909 80 0 62.091 0 40S17.909 0 40 0z' fill='url(%23b)'/%3E%3Ccircle fill='%23606060' cx='40.5' cy='3.5' r='3.5'/%3E%3C/g%3E%3C/svg%3E\") no-repeat center center;background-size:contain;animation:spin-data-v-34552a2a 1s linear infinite}@keyframes spin-data-v-34552a2a{0%{transform:rotate(0)}to{transform:rotate(360deg)}}.qrcode__ft[data-v-34552a2a]{align-items:center;color:#00000080;display:flex;flex-direction:column;font-family:PingFang SC;font-size:14px;font-weight:400;line-height:1.4;opacity:0;transform:translateY(10px);transition:opacity .3s cubic-bezier(.4,0,.2,1) .2s,transform .3s cubic-bezier(.4,0,.2,1) .2s}.qrcode__outer.open .qrcode__ft[data-v-34552a2a]{opacity:1;transform:translateY(0)}.img-color-invert[data-v-34552a2a]{filter:invert(1);border:0 solid transparent}.qrcode__outer:before .dark-mode[data-v-34552a2a]{border-top:1px solid hsla(0,0%,100%,.1)}.qrcode__outer.dark-mode .close-area[data-v-34552a2a],.qrcode__outer.dark-mode .qrcode__ft[data-v-34552a2a]{color:#ffffff80}.product-price[data-v-4ce15964]{align-items:baseline;display:flex;flex-direction:row;flex-shrink:0}.price-box[data-v-4ce15964]{flex-shrink:0}.money[data-v-4ce15964]{color:#ff6146;font-family:WeChatSansStd-Medium;font-size:17px;font-weight:500;line-height:1.2}.more[data-v-4ce15964]{display:flex;align-items:baseline;gap:2px}.add[data-v-4ce15964],.tag[data-v-4ce15964]{color:#ff6146;font-family:PingFang SC;font-size:12px;font-weight:500;margin-left:2px}.product-tag__outer[data-v-339c50a0]{margin-left:16px;margin-right:16px;margin-top:4px;display:flex;flex:1;min-width:0}.product-tag__outer.little[data-v-339c50a0]{margin:0;border:0 solid transparent}.product-tag__outer.bar[data-v-339c50a0]{margin:0 8px .5px}.product-tag[data-v-339c50a0]{display:flex;flex-direction:row;font-size:12px;overflow:hidden;width:100%}.primary[data-v-339c50a0]{color:#0006}.dark-mode .primary[data-v-339c50a0]{color:#fff6}.marketing[data-v-339c50a0]{color:#ff6146}.tag-body[data-v-339c50a0]{display:flex;font-size:12px;font-weight:400;margin-left:8px;overflow:hidden;white-space:nowrap;align-items:center;flex-shrink:0}.tag-body[data-v-339c50a0]:first-child{margin-left:0}.tag-split[data-v-339c50a0]:after{background-color:#0006;content:\"\";height:100%;left:0;position:absolute;top:0;transform:scaleX(.5);width:1px}.product-card[data-v-6dc03843]{background:rgba(0,0,0,.02);border-radius:8px;overflow:hidden;max-width:100%}.mini-product-card[data-v-6dc03843]{border:0 solid transparent;cursor:pointer}.product-card__outer[data-v-6dc03843]{align-items:flex-start;display:flex;flex-direction:row;padding:12px 12px 0}.product-right[data-v-6dc03843]{display:flex;flex-basis:0;flex-direction:column;flex-grow:1;flex-shrink:0;justify-content:center;margin-left:8px;margin-right:12px;overflow:hidden}.product-right-top[data-v-6dc03843]{border:0 solid transparent}.product-right-bottom[data-v-6dc03843]{margin-top:2px;display:flex;flex-direction:row;align-items:end}.product-button__outer[data-v-6dc03843]{flex-shrink:0;margin:auto 0}.product-card.dark-mode[data-v-6dc03843],.product-card.dark-mode .mini-product-card[data-v-6dc03843]{background:#202020}.history[data-v-ca1abb60]{display:flex;border:0 solid transparent;flex-shrink:0;align-items:flex-end}.history.large[data-v-ca1abb60]{margin-left:4px}.history-inner[data-v-ca1abb60]{color:#0000004d;font-size:12px;line-height:1.3;white-space:nowrap}.history.dark-mode .history-inner[data-v-ca1abb60]{color:#ffffff4d}.product-large[data-v-5376dcc1]{background:rgba(0,0,0,.02);border-radius:8px;overflow:hidden;max-width:400px}.normal-product-large[data-v-5376dcc1]{width:100%;margin:0 auto;cursor:pointer}.product-info__outer[data-v-5376dcc1]{margin-left:16px;margin-right:16px;margin-top:6px}.product-info[data-v-5376dcc1]{align-items:flex-end;display:flex;flex-direction:row;justify-content:space-between;flex-wrap:wrap}.product-info .left[data-v-5376dcc1]{display:flex;flex-grow:1;flex-shrink:0}.product-info .right[data-v-5376dcc1]{flex-grow:0;flex-shrink:0}@media screen and (max-width: 600px){.product-large[data-v-5376dcc1]{max-width:100%;margin:0 auto}.normal-product-large[data-v-5376dcc1]{max-width:100%;width:100%}}.product-large.dark-mode[data-v-5376dcc1],.product-large.dark-mode .normal-product-large[data-v-5376dcc1]{background:#202020}.product-little[data-v-d8ab1782]{background-color:#00000005;border-radius:8px;overflow:hidden;width:100%}.small-product-little[data-v-d8ab1782]{border:0 solid transparent}.product-little__outer[data-v-d8ab1782]{align-items:flex-start;display:flex;flex-direction:row;padding:16px 16px 0}.product-right[data-v-d8ab1782]{display:flex;flex-basis:0;flex-direction:column;flex-grow:1;flex-shrink:0;justify-content:space-between;margin-left:10px;overflow:hidden;min-height:88px}.product-right-top[data-v-d8ab1782],.product-right-bottom[data-v-d8ab1782],.product-info__outer[data-v-d8ab1782]{border:0 solid transparent}.product-info[data-v-d8ab1782]{align-items:flex-end;display:flex;flex-wrap:wrap;flex-direction:row;justify-content:space-between}.product-info .info-left[data-v-d8ab1782]{display:flex;flex-grow:1;flex-shrink:0}.product-info .info-right[data-v-d8ab1782]{flex-grow:0;flex-shrink:0}.product-little.dark-mode[data-v-d8ab1782],.product-little.dark-mode .small-product-little[data-v-d8ab1782]{background:#202020}.product_image_link{position:relative;display:inline-block;large-align:bottom;-webkit-user-select:none;-moz-user-select:none;user-select:none;overflow:hidden}.product_image_link:before{background:rgba(95,95,95,.5);-webkit-backdrop-filter:blur(20px);backdrop-filter:blur(20px);border-radius:100%}.wxw-img{large-align:bottom}.product_image_link:after{-webkit-mask:url(\"data:image/svg+xml,%3Csvg width='25' height='25' viewBox='0 0 25 25' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M5.798 13.728c-.32 0-.636-.032-.942-.096-1.792-.378-3.042-1.754-3.042-3.348 0-.426.088-.84.262-1.232l.008-.02 2.008-4.498a3.696 3.696 0 0 1 3.372-2.186h9.8A3.697 3.697 0 0 1 20.662 4.6l1.984 4.432c.178.402.268.82.268 1.248 0 1.596-1.252 2.974-3.044 3.348a4.63 4.63 0 0 1-2.176-.074c-.816-.23-1.514-.68-2.002-1.268-.798.846-2.018 1.368-3.326 1.368-1.308 0-2.52-.52-3.322-1.364-.488.59-1.188 1.042-2.014 1.274-.394.11-.808.168-1.23.168l-.002-.004zM3.46 9.632l-.01.022c-.09.2-.136.412-.136.63 0 .878.762 1.65 1.85 1.88.47.098.994.082 1.458-.048.766-.214 1.368-.728 1.576-1.34a1.43 1.43 0 0 0 .046-.158.748.748 0 1 1 1.448-.056l.026.07.012.03c.392.892 1.448 1.49 2.634 1.49s2.25-.602 2.636-1.498c.02-.046.034-.082.046-.12a.744.744 0 0 1 .754-.502.75.75 0 0 1 .688.588c.012.056.026.108.042.152.214.62.802 1.118 1.572 1.334.466.132.99.148 1.46.048 1.092-.228 1.852-1.002 1.852-1.88 0-.216-.046-.43-.138-.636l-1.988-4.44-.008-.018-.018-.036a2.19 2.19 0 0 0-1.998-1.296h-9.8c-.864 0-1.648.51-2 1.298-.008.016-.014.032-.022.046L3.46 9.634v-.002zM12.364 21.642c-4.142 0-7.566-2.634-7.794-5.996a.75.75 0 1 1 1.498-.102c.174 2.578 2.94 4.598 6.298 4.598s6.122-2.02 6.296-4.598a.75.75 0 1 1 1.498.102c-.228 3.362-3.652 5.996-7.794 5.996h-.002z' fill='%23576B95'/%3E%3C/svg%3E\") no-repeat 50% 50%;mask:url(\"data:image/svg+xml,%3Csvg width='25' height='25' viewBox='0 0 25 25' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M5.798 13.728c-.32 0-.636-.032-.942-.096-1.792-.378-3.042-1.754-3.042-3.348 0-.426.088-.84.262-1.232l.008-.02 2.008-4.498a3.696 3.696 0 0 1 3.372-2.186h9.8A3.697 3.697 0 0 1 20.662 4.6l1.984 4.432c.178.402.268.82.268 1.248 0 1.596-1.252 2.974-3.044 3.348a4.63 4.63 0 0 1-2.176-.074c-.816-.23-1.514-.68-2.002-1.268-.798.846-2.018 1.368-3.326 1.368-1.308 0-2.52-.52-3.322-1.364-.488.59-1.188 1.042-2.014 1.274-.394.11-.808.168-1.23.168l-.002-.004zM3.46 9.632l-.01.022c-.09.2-.136.412-.136.63 0 .878.762 1.65 1.85 1.88.47.098.994.082 1.458-.048.766-.214 1.368-.728 1.576-1.34a1.43 1.43 0 0 0 .046-.158.748.748 0 1 1 1.448-.056l.026.07.012.03c.392.892 1.448 1.49 2.634 1.49s2.25-.602 2.636-1.498c.02-.046.034-.082.046-.12a.744.744 0 0 1 .754-.502.75.75 0 0 1 .688.588c.012.056.026.108.042.152.214.62.802 1.118 1.572 1.334.466.132.99.148 1.46.048 1.092-.228 1.852-1.002 1.852-1.88 0-.216-.046-.43-.138-.636l-1.988-4.44-.008-.018-.018-.036a2.19 2.19 0 0 0-1.998-1.296h-9.8c-.864 0-1.648.51-2 1.298-.008.016-.014.032-.022.046L3.46 9.634v-.002zM12.364 21.642c-4.142 0-7.566-2.634-7.794-5.996a.75.75 0 1 1 1.498-.102c.174 2.578 2.94 4.598 6.298 4.598s6.122-2.02 6.296-4.598a.75.75 0 1 1 1.498.102c-.228 3.362-3.652 5.996-7.794 5.996h-.002z' fill='%23576B95'/%3E%3C/svg%3E\") no-repeat 50% 50%;-webkit-mask-size:15px;mask-size:15px;background:#ffffff}.product_image_link:before,.product_image_link:after{content:\"\";position:absolute;top:8px;right:8px;width:20px;height:20px;display:flex;align-items:center;justify-content:center;z-index:1}.product-container[data-v-71c60811]{width:100%}.client-type-B[data-v-71c60811]{max-width:350px}body,.wx-root{--weui-BG-0: #EDEDED;--weui-BG-1: #F7F7F7;--weui-BG-2: #FFFFFF;--weui-BG-3: #F7F7F7;--weui-BG-4: #4C4C4C;--weui-BG-5: #FFFFFF;--weui-BLUE-100: #10AEFF;--weui-BLUE-120: #3FBEFF;--weui-BLUE-170: #B7E6FF;--weui-BLUE-80: #0C8BCC;--weui-BLUE-90: #0E9CE6;--weui-BLUE-BG-100: #48A6E2;--weui-BLUE-BG-110: #5AAFE4;--weui-BLUE-BG-130: #7FC0EA;--weui-BLUE-BG-90: #4095CB;--weui-BRAND-100: #07C160;--weui-BRAND-120: #38CD7F;--weui-BRAND-170: #B4ECCE;--weui-BRAND-80: #059A4C;--weui-BRAND-90: #06AE56;--weui-BRAND-BG-100: #2AAE67;--weui-BRAND-BG-110: #3EB575;--weui-BRAND-BG-130: #69C694;--weui-BRAND-BG-90: #259C5C;--weui-FG-0: rgba(0, 0, 0, .9);--weui-FG-0_5: rgba(0, 0, 0, .9);--weui-FG-1: rgba(0, 0, 0, .55);--weui-FG-2: rgba(0, 0, 0, .3);--weui-FG-3: rgba(0, 0, 0, .1);--weui-FG-4: rgba(0, 0, 0, .15);--weui-GLYPH-0: rgba(0, 0, 0, .9);--weui-GLYPH-1: rgba(0, 0, 0, .55);--weui-GLYPH-2: rgba(0, 0, 0, .3);--weui-GLYPH-WHITE-0: rgba(255, 255, 255, .8);--weui-GLYPH-WHITE-1: rgba(255, 255, 255, .5);--weui-GLYPH-WHITE-2: rgba(255, 255, 255, .3);--weui-GLYPH-WHITE-3: #FFFFFF;--weui-GREEN-100: #91D300;--weui-GREEN-120: #A7DB33;--weui-GREEN-170: #DEF1B3;--weui-GREEN-80: #74A800;--weui-GREEN-90: #82BD00;--weui-GREEN-BG-100: #96BE40;--weui-GREEN-BG-110: #A0C452;--weui-GREEN-BG-130: #B5D179;--weui-GREEN-BG-90: #86AA39;--weui-INDIGO-100: #1485EE;--weui-INDIGO-120: #439DF1;--weui-INDIGO-170: #B8DAF9;--weui-INDIGO-80: #106ABE;--weui-INDIGO-90: #1277D6;--weui-INDIGO-BG-100: #2B77BF;--weui-INDIGO-BG-110: #3F84C5;--weui-INDIGO-BG-130: #6BA0D2;--weui-INDIGO-BG-90: #266AAB;--weui-LIGHTGREEN-100: #95EC69;--weui-LIGHTGREEN-120: #AAEF87;--weui-LIGHTGREEN-170: #DEF9D1;--weui-LIGHTGREEN-80: #77BC54;--weui-LIGHTGREEN-90: #85D35E;--weui-LIGHTGREEN-BG-100: #72CF60;--weui-LIGHTGREEN-BG-110: #80D370;--weui-LIGHTGREEN-BG-130: #9CDD90;--weui-LIGHTGREEN-BG-90: #66B956;--weui-LINK-100: #576B95;--weui-LINK-120: #7888AA;--weui-LINK-170: #CCD2DE;--weui-LINK-80: #455577;--weui-LINK-90: #4E6085;--weui-LINKFINDER-100: #002666;--weui-MATERIAL-ATTACHMENTCOLUMN: rgba(245, 245, 245, .95);--weui-MATERIAL-NAVIGATIONBAR: rgba(237, 237, 237, .94);--weui-MATERIAL-REGULAR: rgba(247, 247, 247, .3);--weui-MATERIAL-THICK: rgba(247, 247, 247, .8);--weui-MATERIAL-THIN: rgba(255, 255, 255, .2);--weui-MATERIAL-TOOLBAR: rgba(246, 246, 246, .82);--weui-ORANGE-100: #FA9D3B;--weui-ORANGE-120: #FBB062;--weui-ORANGE-170: #FDE1C3;--weui-ORANGE-80: #C87D2F;--weui-ORANGE-90: #E08C34;--weui-ORANGE-BG-100: #EA7800;--weui-ORANGE-BG-110: #EC8519;--weui-ORANGE-BG-130: #F0A04D;--weui-ORANGE-BG-90: #D26B00;--weui-ORANGERED-100: #FF6146;--weui-OVERLAY: rgba(0, 0, 0, .5);--weui-OVERLAY-WHITE: rgba(242, 242, 242, .8);--weui-PURPLE-100: #6467F0;--weui-PURPLE-120: #8385F3;--weui-PURPLE-170: #D0D1FA;--weui-PURPLE-80: #5052C0;--weui-PURPLE-90: #595CD7;--weui-PURPLE-BG-100: #6769BA;--weui-PURPLE-BG-110: #7678C1;--weui-PURPLE-BG-130: #9496CE;--weui-PURPLE-BG-90: #5C5EA7;--weui-RED-100: #FA5151;--weui-RED-120: #FB7373;--weui-RED-170: #FDCACA;--weui-RED-80: #C84040;--weui-RED-90: #E14949;--weui-RED-BG-100: #CF5148;--weui-RED-BG-110: #D3625A;--weui-RED-BG-130: #DD847E;--weui-RED-BG-90: #B94840;--weui-SECONDARY-BG: rgba(0, 0, 0, .05);--weui-SEPARATOR-0: rgba(0, 0, 0, .1);--weui-SEPARATOR-1: rgba(0, 0, 0, .15);--weui-STATELAYER-HOVERED: rgba(0, 0, 0, .02);--weui-STATELAYER-PRESSED: rgba(0, 0, 0, .1);--weui-STATELAYER-PRESSEDSTRENGTHENED: rgba(0, 0, 0, .2);--weui-YELLOW-100: #FFC300;--weui-YELLOW-120: #FFCF33;--weui-YELLOW-170: #FFECB2;--weui-YELLOW-80: #CC9C00;--weui-YELLOW-90: #E6AF00;--weui-YELLOW-BG-100: #EFB600;--weui-YELLOW-BG-110: #F0BD19;--weui-YELLOW-BG-130: #F3CC4D;--weui-YELLOW-BG-90: #D7A400;--weui-FG-HALF: rgba(0, 0, 0, .9);--weui-RED: #FA5151;--weui-ORANGERED: #FF6146;--weui-ORANGE: #FA9D3B;--weui-YELLOW: #FFC300;--weui-GREEN: #91D300;--weui-LIGHTGREEN: #95EC69;--weui-TEXTGREEN: #06AE56;--weui-BRAND: #07C160;--weui-BLUE: #10AEFF;--weui-INDIGO: #1485EE;--weui-PURPLE: #6467F0;--weui-LINK: #576B95;--weui-TAG-TEXT-ORANGE: #FA9D3B;--weui-TAG-TEXT-GREEN: #06AE56;--weui-TAG-TEXT-BLUE: #10AEFF;--weui-REDORANGE: #FF6146;--weui-TAG-TEXT-BLACK: rgba(0, 0, 0, .5);--weui-TAG-BACKGROUND-BLACK: rgba(0, 0, 0, .05);--weui-WHITE: #FFFFFF;--weui-BG: #FFFFFF;--weui-FG: #000;--weui-FG-5: rgba(0, 0, 0, .05);--weui-TAG-BACKGROUND-ORANGE: rgba(250, 157, 59, .1);--weui-TAG-BACKGROUND-GREEN: rgba(6, 174, 86, .1);--weui-TAG-TEXT-RED: rgba(250, 81, 81, .6);--weui-TAG-BACKGROUND-RED: rgba(250, 81, 81, .1);--weui-TAG-BACKGROUND-BLUE: rgba(16, 174, 255, .1)}@media (prefers-color-scheme: dark){.wx-root:not([data-weui-theme=light]),body:not([data-weui-theme=light]){--weui-BG-0: #111111;--weui-BG-1: #1E1E1E;--weui-BG-2: #191919;--weui-BG-3: #202020;--weui-BG-4: #404040;--weui-BG-5: #2C2C2C;--weui-BLUE-100: #10AEFF;--weui-BLUE-120: #0C8BCC;--weui-BLUE-170: #04344D;--weui-BLUE-80: #3FBEFF;--weui-BLUE-90: #28B6FF;--weui-BLUE-BG-100: #48A6E2;--weui-BLUE-BG-110: #4095CB;--weui-BLUE-BG-130: #32749E;--weui-BLUE-BG-90: #5AAFE4;--weui-BRAND-100: #07C160;--weui-BRAND-120: #059A4C;--weui-BRAND-170: #023A1C;--weui-BRAND-80: #38CD7F;--weui-BRAND-90: #20C770;--weui-BRAND-BG-100: #2AAE67;--weui-BRAND-BG-110: #259C5C;--weui-BRAND-BG-130: #1D7A48;--weui-BRAND-BG-90: #3EB575;--weui-FG-0: rgba(255, 255, 255, .8);--weui-FG-0_5: rgba(255, 255, 255, .6);--weui-FG-1: rgba(255, 255, 255, .5);--weui-FG-2: rgba(255, 255, 255, .3);--weui-FG-3: rgba(255, 255, 255, .1);--weui-FG-4: rgba(255, 255, 255, .15);--weui-GLYPH-0: rgba(255, 255, 255, .8);--weui-GLYPH-1: rgba(255, 255, 255, .5);--weui-GLYPH-2: rgba(255, 255, 255, .3);--weui-GLYPH-WHITE-0: rgba(255, 255, 255, .8);--weui-GLYPH-WHITE-1: rgba(255, 255, 255, .5);--weui-GLYPH-WHITE-2: rgba(255, 255, 255, .3);--weui-GLYPH-WHITE-3: #FFFFFF;--weui-GREEN-100: #74A800;--weui-GREEN-120: #5C8600;--weui-GREEN-170: #233200;--weui-GREEN-80: #8FB933;--weui-GREEN-90: #82B01A;--weui-GREEN-BG-100: #789833;--weui-GREEN-BG-110: #6B882D;--weui-GREEN-BG-130: #65802B;--weui-GREEN-BG-90: #85A247;--weui-INDIGO-100: #1196FF;--weui-INDIGO-120: #0D78CC;--weui-INDIGO-170: #052D4D;--weui-INDIGO-80: #40ABFF;--weui-INDIGO-90: #28A0FF;--weui-INDIGO-BG-100: #0D78CC;--weui-INDIGO-BG-110: #0B6BB7;--weui-INDIGO-BG-130: #09548F;--weui-INDIGO-BG-90: #2585D1;--weui-LIGHTGREEN-100: #3EB575;--weui-LIGHTGREEN-120: #31905D;--weui-LIGHTGREEN-170: #123522;--weui-LIGHTGREEN-80: #64C390;--weui-LIGHTGREEN-90: #51BC83;--weui-LIGHTGREEN-BG-100: #31905D;--weui-LIGHTGREEN-BG-110: #2C8153;--weui-LIGHTGREEN-BG-130: #226541;--weui-LIGHTGREEN-BG-90: #31905D;--weui-LINK-100: #7D90A9;--weui-LINK-120: #647387;--weui-LINK-170: #252A32;--weui-LINK-80: #97A6BA;--weui-LINK-90: #899AB1;--weui-LINKFINDER-100: #DEE9FF;--weui-MATERIAL-ATTACHMENTCOLUMN: rgba(32, 32, 32, .93);--weui-MATERIAL-NAVIGATIONBAR: rgba(18, 18, 18, .9);--weui-MATERIAL-REGULAR: rgba(37, 37, 37, .6);--weui-MATERIAL-THICK: rgba(34, 34, 34, .9);--weui-MATERIAL-THIN: rgba(95, 95, 95, .4);--weui-MATERIAL-TOOLBAR: rgba(35, 35, 35, .93);--weui-ORANGE-100: #C87D2F;--weui-ORANGE-120: #A06425;--weui-ORANGE-170: #3B250E;--weui-ORANGE-80: #D39758;--weui-ORANGE-90: #CD8943;--weui-ORANGE-BG-100: #BB6000;--weui-ORANGE-BG-110: #A85600;--weui-ORANGE-BG-130: #824300;--weui-ORANGE-BG-90: #C1701A;--weui-ORANGERED-100: #FF6146;--weui-OVERLAY: rgba(0, 0, 0, .8);--weui-OVERLAY-WHITE: rgba(242, 242, 242, .8);--weui-PURPLE-100: #8183FF;--weui-PURPLE-120: #6768CC;--weui-PURPLE-170: #26274C;--weui-PURPLE-80: #9A9BFF;--weui-PURPLE-90: #8D8FFF;--weui-PURPLE-BG-100: #6768CC;--weui-PURPLE-BG-110: #5C5DB7;--weui-PURPLE-BG-130: #48498F;--weui-PURPLE-BG-90: #7677D1;--weui-RED-100: #FA5151;--weui-RED-120: #C84040;--weui-RED-170: #4B1818;--weui-RED-80: #FB7373;--weui-RED-90: #FA6262;--weui-RED-BG-100: #CF5148;--weui-RED-BG-110: #BA4940;--weui-RED-BG-130: #913832;--weui-RED-BG-90: #D3625A;--weui-SECONDARY-BG: rgba(255, 255, 255, .1);--weui-SEPARATOR-0: rgba(255, 255, 255, .05);--weui-SEPARATOR-1: rgba(255, 255, 255, .15);--weui-STATELAYER-HOVERED: rgba(0, 0, 0, .02);--weui-STATELAYER-PRESSED: rgba(255, 255, 255, .1);--weui-STATELAYER-PRESSEDSTRENGTHENED: rgba(255, 255, 255, .2);--weui-YELLOW-100: #CC9C00;--weui-YELLOW-120: #A37C00;--weui-YELLOW-170: #3D2F00;--weui-YELLOW-80: #D6AF33;--weui-YELLOW-90: #D1A519;--weui-YELLOW-BG-100: #BF9100;--weui-YELLOW-BG-110: #AB8200;--weui-YELLOW-BG-130: #866500;--weui-YELLOW-BG-90: #C59C1A;--weui-FG-HALF: rgba(255, 255, 255, .6);--weui-RED: #FA5151;--weui-ORANGERED: #FF6146;--weui-ORANGE: #C87D2F;--weui-YELLOW: #CC9C00;--weui-GREEN: #74A800;--weui-LIGHTGREEN: #3EB575;--weui-TEXTGREEN: #259C5C;--weui-BRAND: #07C160;--weui-BLUE: #10AEFF;--weui-INDIGO: #1196FF;--weui-PURPLE: #8183FF;--weui-LINK: #7D90A9;--weui-REDORANGE: #FF6146;--weui-TAG-TEXT-BLACK: rgba(255, 255, 255, .5);--weui-TAG-BACKGROUND-BLACK: rgba(255, 255, 255, .05);--weui-WHITE: rgba(255, 255, 255, .8);--weui-FG: #fff;--weui-BG: #000;--weui-FG-5: rgba(255, 255, 255, .1);--weui-TAG-BACKGROUND-ORANGE: rgba(250, 157, 59, .1);--weui-TAG-BACKGROUND-GREEN: rgba(6, 174, 86, .1);--weui-TAG-TEXT-RED: rgba(250, 81, 81, .6);--weui-TAG-BACKGROUND-RED: rgba(250, 81, 81, .1);--weui-TAG-BACKGROUND-BLUE: rgba(16, 174, 255, .1);--weui-TAG-TEXT-ORANGE: rgba(250, 157, 59, .6);--weui-TAG-TEXT-GREEN: rgba(6, 174, 86, .6);--weui-TAG-TEXT-BLUE: rgba(16, 174, 255, .6)}}.wx-root[data-weui-theme=dark],body[data-weui-theme=dark]{--weui-BG-0: #111111;--weui-BG-1: #1E1E1E;--weui-BG-2: #191919;--weui-BG-3: #202020;--weui-BG-4: #404040;--weui-BG-5: #2C2C2C;--weui-BLUE-100: #10AEFF;--weui-BLUE-120: #0C8BCC;--weui-BLUE-170: #04344D;--weui-BLUE-80: #3FBEFF;--weui-BLUE-90: #28B6FF;--weui-BLUE-BG-100: #48A6E2;--weui-BLUE-BG-110: #4095CB;--weui-BLUE-BG-130: #32749E;--weui-BLUE-BG-90: #5AAFE4;--weui-BRAND-100: #07C160;--weui-BRAND-120: #059A4C;--weui-BRAND-170: #023A1C;--weui-BRAND-80: #38CD7F;--weui-BRAND-90: #20C770;--weui-BRAND-BG-100: #2AAE67;--weui-BRAND-BG-110: #259C5C;--weui-BRAND-BG-130: #1D7A48;--weui-BRAND-BG-90: #3EB575;--weui-FG-0: rgba(255, 255, 255, .8);--weui-FG-0_5: rgba(255, 255, 255, .6);--weui-FG-1: rgba(255, 255, 255, .5);--weui-FG-2: rgba(255, 255, 255, .3);--weui-FG-3: rgba(255, 255, 255, .1);--weui-FG-4: rgba(255, 255, 255, .15);--weui-GLYPH-0: rgba(255, 255, 255, .8);--weui-GLYPH-1: rgba(255, 255, 255, .5);--weui-GLYPH-2: rgba(255, 255, 255, .3);--weui-GLYPH-WHITE-0: rgba(255, 255, 255, .8);--weui-GLYPH-WHITE-1: rgba(255, 255, 255, .5);--weui-GLYPH-WHITE-2: rgba(255, 255, 255, .3);--weui-GLYPH-WHITE-3: #FFFFFF;--weui-GREEN-100: #74A800;--weui-GREEN-120: #5C8600;--weui-GREEN-170: #233200;--weui-GREEN-80: #8FB933;--weui-GREEN-90: #82B01A;--weui-GREEN-BG-100: #789833;--weui-GREEN-BG-110: #6B882D;--weui-GREEN-BG-130: #65802B;--weui-GREEN-BG-90: #85A247;--weui-INDIGO-100: #1196FF;--weui-INDIGO-120: #0D78CC;--weui-INDIGO-170: #052D4D;--weui-INDIGO-80: #40ABFF;--weui-INDIGO-90: #28A0FF;--weui-INDIGO-BG-100: #0D78CC;--weui-INDIGO-BG-110: #0B6BB7;--weui-INDIGO-BG-130: #09548F;--weui-INDIGO-BG-90: #2585D1;--weui-LIGHTGREEN-100: #3EB575;--weui-LIGHTGREEN-120: #31905D;--weui-LIGHTGREEN-170: #123522;--weui-LIGHTGREEN-80: #64C390;--weui-LIGHTGREEN-90: #51BC83;--weui-LIGHTGREEN-BG-100: #31905D;--weui-LIGHTGREEN-BG-110: #2C8153;--weui-LIGHTGREEN-BG-130: #226541;--weui-LIGHTGREEN-BG-90: #31905D;--weui-LINK-100: #7D90A9;--weui-LINK-120: #647387;--weui-LINK-170: #252A32;--weui-LINK-80: #97A6BA;--weui-LINK-90: #899AB1;--weui-LINKFINDER-100: #DEE9FF;--weui-MATERIAL-ATTACHMENTCOLUMN: rgba(32, 32, 32, .93);--weui-MATERIAL-NAVIGATIONBAR: rgba(18, 18, 18, .9);--weui-MATERIAL-REGULAR: rgba(37, 37, 37, .6);--weui-MATERIAL-THICK: rgba(34, 34, 34, .9);--weui-MATERIAL-THIN: rgba(95, 95, 95, .4);--weui-MATERIAL-TOOLBAR: rgba(35, 35, 35, .93);--weui-ORANGE-100: #C87D2F;--weui-ORANGE-120: #A06425;--weui-ORANGE-170: #3B250E;--weui-ORANGE-80: #D39758;--weui-ORANGE-90: #CD8943;--weui-ORANGE-BG-100: #BB6000;--weui-ORANGE-BG-110: #A85600;--weui-ORANGE-BG-130: #824300;--weui-ORANGE-BG-90: #C1701A;--weui-ORANGERED-100: #FF6146;--weui-OVERLAY: rgba(0, 0, 0, .8);--weui-OVERLAY-WHITE: rgba(242, 242, 242, .8);--weui-PURPLE-100: #8183FF;--weui-PURPLE-120: #6768CC;--weui-PURPLE-170: #26274C;--weui-PURPLE-80: #9A9BFF;--weui-PURPLE-90: #8D8FFF;--weui-PURPLE-BG-100: #6768CC;--weui-PURPLE-BG-110: #5C5DB7;--weui-PURPLE-BG-130: #48498F;--weui-PURPLE-BG-90: #7677D1;--weui-RED-100: #FA5151;--weui-RED-120: #C84040;--weui-RED-170: #4B1818;--weui-RED-80: #FB7373;--weui-RED-90: #FA6262;--weui-RED-BG-100: #CF5148;--weui-RED-BG-110: #BA4940;--weui-RED-BG-130: #913832;--weui-RED-BG-90: #D3625A;--weui-SECONDARY-BG: rgba(255, 255, 255, .1);--weui-SEPARATOR-0: rgba(255, 255, 255, .05);--weui-SEPARATOR-1: rgba(255, 255, 255, .15);--weui-STATELAYER-HOVERED: rgba(0, 0, 0, .02);--weui-STATELAYER-PRESSED: rgba(255, 255, 255, .1);--weui-STATELAYER-PRESSEDSTRENGTHENED: rgba(255, 255, 255, .2);--weui-YELLOW-100: #CC9C00;--weui-YELLOW-120: #A37C00;--weui-YELLOW-170: #3D2F00;--weui-YELLOW-80: #D6AF33;--weui-YELLOW-90: #D1A519;--weui-YELLOW-BG-100: #BF9100;--weui-YELLOW-BG-110: #AB8200;--weui-YELLOW-BG-130: #866500;--weui-YELLOW-BG-90: #C59C1A;--weui-FG-HALF: rgba(255, 255, 255, .6);--weui-RED: #FA5151;--weui-ORANGERED: #FF6146;--weui-ORANGE: #C87D2F;--weui-YELLOW: #CC9C00;--weui-GREEN: #74A800;--weui-LIGHTGREEN: #3EB575;--weui-TEXTGREEN: #259C5C;--weui-BRAND: #07C160;--weui-BLUE: #10AEFF;--weui-INDIGO: #1196FF;--weui-PURPLE: #8183FF;--weui-LINK: #7D90A9;--weui-REDORANGE: #FF6146;--weui-TAG-TEXT-BLACK: rgba(255, 255, 255, .5);--weui-TAG-BACKGROUND-BLACK: rgba(255, 255, 255, .05);--weui-WHITE: rgba(255, 255, 255, .8);--weui-FG: #fff;--weui-BG: #000;--weui-FG-5: rgba(255, 255, 255, .1);--weui-TAG-BACKGROUND-ORANGE: rgba(250, 157, 59, .1);--weui-TAG-BACKGROUND-GREEN: rgba(6, 174, 86, .1);--weui-TAG-TEXT-RED: rgba(250, 81, 81, .6);--weui-TAG-BACKGROUND-RED: rgba(250, 81, 81, .1);--weui-TAG-BACKGROUND-BLUE: rgba(16, 174, 255, .1);--weui-TAG-TEXT-ORANGE: rgba(250, 157, 59, .6);--weui-TAG-TEXT-GREEN: rgba(6, 174, 86, .6);--weui-TAG-TEXT-BLUE: rgba(16, 174, 255, .6)}.wx-root[data-weui-mode=care],body[data-weui-mode=care]{--weui-BG-0: #EDEDED;--weui-BG-1: #F7F7F7;--weui-BG-2: #FFFFFF;--weui-BG-3: #F7F7F7;--weui-BG-4: #4C4C4C;--weui-BG-5: #FFFFFF;--weui-BLUE-100: #007DBB;--weui-BLUE-120: #3FBEFF;--weui-BLUE-170: #B7E6FF;--weui-BLUE-80: #0C8BCC;--weui-BLUE-90: #0E9CE6;--weui-BLUE-BG-100: #48A6E2;--weui-BLUE-BG-110: #5AAFE4;--weui-BLUE-BG-130: #7FC0EA;--weui-BLUE-BG-90: #4095CB;--weui-BRAND-100: #018942;--weui-BRAND-120: #38CD7F;--weui-BRAND-170: #B4ECCE;--weui-BRAND-80: #059A4C;--weui-BRAND-90: #06AE56;--weui-BRAND-BG-100: #2AAE67;--weui-BRAND-BG-110: #3EB575;--weui-BRAND-BG-130: #69C694;--weui-BRAND-BG-90: #259C5C;--weui-FG-0: #000000;--weui-FG-0_5: #000000;--weui-FG-1: rgba(0, 0, 0, .6);--weui-FG-2: rgba(0, 0, 0, .42);--weui-FG-3: rgba(0, 0, 0, .1);--weui-FG-4: rgba(0, 0, 0, .15);--weui-GLYPH-0: #000000;--weui-GLYPH-1: rgba(0, 0, 0, .6);--weui-GLYPH-2: rgba(0, 0, 0, .42);--weui-GLYPH-WHITE-0: rgba(255, 255, 255, .85);--weui-GLYPH-WHITE-1: rgba(255, 255, 255, .55);--weui-GLYPH-WHITE-2: rgba(255, 255, 255, .35);--weui-GLYPH-WHITE-3: #FFFFFF;--weui-GREEN-100: #4F8400;--weui-GREEN-120: #A7DB33;--weui-GREEN-170: #DEF1B3;--weui-GREEN-80: #74A800;--weui-GREEN-90: #82BD00;--weui-GREEN-BG-100: #96BE40;--weui-GREEN-BG-110: #A0C452;--weui-GREEN-BG-130: #B5D179;--weui-GREEN-BG-90: #86AA39;--weui-INDIGO-100: #0075E2;--weui-INDIGO-120: #439DF1;--weui-INDIGO-170: #B8DAF9;--weui-INDIGO-80: #106ABE;--weui-INDIGO-90: #1277D6;--weui-INDIGO-BG-100: #2B77BF;--weui-INDIGO-BG-110: #3F84C5;--weui-INDIGO-BG-130: #6BA0D2;--weui-INDIGO-BG-90: #266AAB;--weui-LIGHTGREEN-100: #2E8800;--weui-LIGHTGREEN-120: #AAEF87;--weui-LIGHTGREEN-170: #DEF9D1;--weui-LIGHTGREEN-80: #77BC54;--weui-LIGHTGREEN-90: #85D35E;--weui-LIGHTGREEN-BG-100: #72CF60;--weui-LIGHTGREEN-BG-110: #80D370;--weui-LIGHTGREEN-BG-130: #9CDD90;--weui-LIGHTGREEN-BG-90: #66B956;--weui-LINK-100: #576B95;--weui-LINK-120: #7888AA;--weui-LINK-170: #CCD2DE;--weui-LINK-80: #455577;--weui-LINK-90: #4E6085;--weui-LINKFINDER-100: #002666;--weui-MATERIAL-ATTACHMENTCOLUMN: rgba(245, 245, 245, .95);--weui-MATERIAL-NAVIGATIONBAR: rgba(237, 237, 237, .94);--weui-MATERIAL-REGULAR: rgba(247, 247, 247, .3);--weui-MATERIAL-THICK: rgba(247, 247, 247, .8);--weui-MATERIAL-THIN: rgba(255, 255, 255, .2);--weui-MATERIAL-TOOLBAR: rgba(246, 246, 246, .82);--weui-ORANGE-100: #E17719;--weui-ORANGE-120: #FBB062;--weui-ORANGE-170: #FDE1C3;--weui-ORANGE-80: #C87D2F;--weui-ORANGE-90: #E08C34;--weui-ORANGE-BG-100: #EA7800;--weui-ORANGE-BG-110: #EC8519;--weui-ORANGE-BG-130: #F0A04D;--weui-ORANGE-BG-90: #D26B00;--weui-ORANGERED-100: #D14730;--weui-OVERLAY: rgba(0, 0, 0, .5);--weui-OVERLAY-WHITE: rgba(242, 242, 242, .8);--weui-PURPLE-100: #6265F1;--weui-PURPLE-120: #8385F3;--weui-PURPLE-170: #D0D1FA;--weui-PURPLE-80: #5052C0;--weui-PURPLE-90: #595CD7;--weui-PURPLE-BG-100: #6769BA;--weui-PURPLE-BG-110: #7678C1;--weui-PURPLE-BG-130: #9496CE;--weui-PURPLE-BG-90: #5C5EA7;--weui-RED-100: #DC3636;--weui-RED-120: #FB7373;--weui-RED-170: #FDCACA;--weui-RED-80: #C84040;--weui-RED-90: #E14949;--weui-RED-BG-100: #CF5148;--weui-RED-BG-110: #D3625A;--weui-RED-BG-130: #DD847E;--weui-RED-BG-90: #B94840;--weui-SECONDARY-BG: rgba(0, 0, 0, .1);--weui-SEPARATOR-0: rgba(0, 0, 0, .1);--weui-SEPARATOR-1: rgba(0, 0, 0, .15);--weui-STATELAYER-HOVERED: rgba(0, 0, 0, .02);--weui-STATELAYER-PRESSED: rgba(0, 0, 0, .1);--weui-STATELAYER-PRESSEDSTRENGTHENED: rgba(0, 0, 0, .2);--weui-YELLOW-100: #BB8E00;--weui-YELLOW-120: #FFCF33;--weui-YELLOW-170: #FFECB2;--weui-YELLOW-80: #CC9C00;--weui-YELLOW-90: #E6AF00;--weui-YELLOW-BG-100: #EFB600;--weui-YELLOW-BG-110: #F0BD19;--weui-YELLOW-BG-130: #F3CC4D;--weui-YELLOW-BG-90: #D7A400;--weui-FG-HALF: #000000;--weui-RED: #DC3636;--weui-ORANGERED: #D14730;--weui-ORANGE: #E17719;--weui-YELLOW: #BB8E00;--weui-GREEN: #4F8400;--weui-LIGHTGREEN: #2E8800;--weui-TEXTGREEN: #06AE56;--weui-BRAND: #018942;--weui-BLUE: #007DBB;--weui-INDIGO: #0075E2;--weui-PURPLE: #6265F1;--weui-LINK: #576B95;--weui-TAG-TEXT-ORANGE: #E17719;--weui-TAG-TEXT-GREEN: #06AE56;--weui-TAG-TEXT-BLUE: #007DBB;--weui-REDORANGE: #D14730;--weui-TAG-TEXT-BLACK: rgba(0, 0, 0, .5);--weui-WHITE: #FFFFFF;--weui-BG: #FFFFFF;--weui-FG: #000;--weui-FG-5: rgba(0, 0, 0, .05);--weui-TAG-BACKGROUND-ORANGE: rgba(225, 119, 25, .1);--weui-TAG-BACKGROUND-GREEN: rgba(6, 174, 86, .1);--weui-TAG-TEXT-RED: rgba(250, 81, 81, .6);--weui-TAG-BACKGROUND-RED: rgba(250, 81, 81, .1);--weui-TAG-BACKGROUND-BLUE: rgba(0, 125, 187, .1);--weui-TAG-BACKGROUND-BLACK: rgba(0, 0, 0, .05)}@media (prefers-color-scheme: dark){.wx-root[data-weui-mode=care]:not([data-weui-theme=light]),body[data-weui-mode=care]:not([data-weui-theme=light]){--weui-BG-0: #111111;--weui-BG-1: #1E1E1E;--weui-BG-2: #191919;--weui-BG-3: #202020;--weui-BG-4: #404040;--weui-BG-5: #2C2C2C;--weui-BLUE-100: #10AEFF;--weui-BLUE-120: #0C8BCC;--weui-BLUE-170: #04344D;--weui-BLUE-80: #3FBEFF;--weui-BLUE-90: #28B6FF;--weui-BLUE-BG-100: #48A6E2;--weui-BLUE-BG-110: #4095CB;--weui-BLUE-BG-130: #32749E;--weui-BLUE-BG-90: #5AAFE4;--weui-BRAND-100: #07C160;--weui-BRAND-120: #059A4C;--weui-BRAND-170: #023A1C;--weui-BRAND-80: #38CD7F;--weui-BRAND-90: #20C770;--weui-BRAND-BG-100: #2AAE67;--weui-BRAND-BG-110: #259C5C;--weui-BRAND-BG-130: #1D7A48;--weui-BRAND-BG-90: #3EB575;--weui-FG-0: rgba(255, 255, 255, .85);--weui-FG-0_5: rgba(255, 255, 255, .65);--weui-FG-1: rgba(255, 255, 255, .55);--weui-FG-2: rgba(255, 255, 255, .35);--weui-FG-3: rgba(255, 255, 255, .1);--weui-FG-4: rgba(255, 255, 255, .15);--weui-GLYPH-0: rgba(255, 255, 255, .85);--weui-GLYPH-1: rgba(255, 255, 255, .55);--weui-GLYPH-2: rgba(255, 255, 255, .35);--weui-GLYPH-WHITE-0: rgba(255, 255, 255, .85);--weui-GLYPH-WHITE-1: rgba(255, 255, 255, .55);--weui-GLYPH-WHITE-2: rgba(255, 255, 255, .35);--weui-GLYPH-WHITE-3: #FFFFFF;--weui-GREEN-100: #74A800;--weui-GREEN-120: #5C8600;--weui-GREEN-170: #233200;--weui-GREEN-80: #8FB933;--weui-GREEN-90: #82B01A;--weui-GREEN-BG-100: #789833;--weui-GREEN-BG-110: #6B882D;--weui-GREEN-BG-130: #65802B;--weui-GREEN-BG-90: #85A247;--weui-INDIGO-100: #1196FF;--weui-INDIGO-120: #0D78CC;--weui-INDIGO-170: #052D4D;--weui-INDIGO-80: #40ABFF;--weui-INDIGO-90: #28A0FF;--weui-INDIGO-BG-100: #0D78CC;--weui-INDIGO-BG-110: #0B6BB7;--weui-INDIGO-BG-130: #09548F;--weui-INDIGO-BG-90: #2585D1;--weui-LIGHTGREEN-100: #3EB575;--weui-LIGHTGREEN-120: #31905D;--weui-LIGHTGREEN-170: #123522;--weui-LIGHTGREEN-80: #64C390;--weui-LIGHTGREEN-90: #51BC83;--weui-LIGHTGREEN-BG-100: #31905D;--weui-LIGHTGREEN-BG-110: #2C8153;--weui-LIGHTGREEN-BG-130: #226541;--weui-LIGHTGREEN-BG-90: #31905D;--weui-LINK-100: #7D90A9;--weui-LINK-120: #647387;--weui-LINK-170: #252A32;--weui-LINK-80: #97A6BA;--weui-LINK-90: #899AB1;--weui-LINKFINDER-100: #DEE9FF;--weui-MATERIAL-ATTACHMENTCOLUMN: rgba(32, 32, 32, .93);--weui-MATERIAL-NAVIGATIONBAR: rgba(18, 18, 18, .9);--weui-MATERIAL-REGULAR: rgba(37, 37, 37, .6);--weui-MATERIAL-THICK: rgba(34, 34, 34, .9);--weui-MATERIAL-THIN: rgba(245, 245, 245, .4);--weui-MATERIAL-TOOLBAR: rgba(35, 35, 35, .93);--weui-ORANGE-100: #C87D2F;--weui-ORANGE-120: #A06425;--weui-ORANGE-170: #3B250E;--weui-ORANGE-80: #D39758;--weui-ORANGE-90: #CD8943;--weui-ORANGE-BG-100: #BB6000;--weui-ORANGE-BG-110: #A85600;--weui-ORANGE-BG-130: #824300;--weui-ORANGE-BG-90: #C1701A;--weui-ORANGERED-100: #FF6146;--weui-OVERLAY: rgba(0, 0, 0, .8);--weui-OVERLAY-WHITE: rgba(242, 242, 242, .8);--weui-PURPLE-100: #8183FF;--weui-PURPLE-120: #6768CC;--weui-PURPLE-170: #26274C;--weui-PURPLE-80: #9A9BFF;--weui-PURPLE-90: #8D8FFF;--weui-PURPLE-BG-100: #6768CC;--weui-PURPLE-BG-110: #5C5DB7;--weui-PURPLE-BG-130: #48498F;--weui-PURPLE-BG-90: #7677D1;--weui-RED-100: #FA5151;--weui-RED-120: #C84040;--weui-RED-170: #4B1818;--weui-RED-80: #FB7373;--weui-RED-90: #FA6262;--weui-RED-BG-100: #CF5148;--weui-RED-BG-110: #BA4940;--weui-RED-BG-130: #913832;--weui-RED-BG-90: #D3625A;--weui-SECONDARY-BG: rgba(255, 255, 255, .15);--weui-SEPARATOR-0: rgba(255, 255, 255, .05);--weui-SEPARATOR-1: rgba(255, 255, 255, .15);--weui-STATELAYER-HOVERED: rgba(0, 0, 0, .02);--weui-STATELAYER-PRESSED: rgba(255, 255, 255, .1);--weui-STATELAYER-PRESSEDSTRENGTHENED: rgba(255, 255, 255, .2);--weui-YELLOW-100: #CC9C00;--weui-YELLOW-120: #A37C00;--weui-YELLOW-170: #3D2F00;--weui-YELLOW-80: #D6AF33;--weui-YELLOW-90: #D1A519;--weui-YELLOW-BG-100: #BF9100;--weui-YELLOW-BG-110: #AB8200;--weui-YELLOW-BG-130: #866500;--weui-YELLOW-BG-90: #C59C1A;--weui-FG-HALF: rgba(255, 255, 255, .65);--weui-RED: #FA5151;--weui-ORANGERED: #FF6146;--weui-ORANGE: #C87D2F;--weui-YELLOW: #CC9C00;--weui-GREEN: #74A800;--weui-LIGHTGREEN: #3EB575;--weui-TEXTGREEN: #259C5C;--weui-BRAND: #07C160;--weui-BLUE: #10AEFF;--weui-INDIGO: #1196FF;--weui-PURPLE: #8183FF;--weui-LINK: #7D90A9;--weui-REDORANGE: #FF6146;--weui-TAG-BACKGROUND-BLACK: rgba(255, 255, 255, .05);--weui-FG: #fff;--weui-WHITE: rgba(255, 255, 255, .8);--weui-FG-5: rgba(255, 255, 255, .1);--weui-TAG-BACKGROUND-ORANGE: rgba(250, 157, 59, .1);--weui-TAG-BACKGROUND-GREEN: rgba(6, 174, 86, .1);--weui-TAG-TEXT-RED: rgba(250, 81, 81, .6);--weui-TAG-BACKGROUND-RED: rgba(250, 81, 81, .1);--weui-TAG-BACKGROUND-BLUE: rgba(16, 174, 255, .1);--weui-TAG-TEXT-ORANGE: rgba(250, 157, 59, .6);--weui-BG: #000;--weui-TAG-TEXT-GREEN: rgba(6, 174, 86, .6);--weui-TAG-TEXT-BLUE: rgba(16, 174, 255, .6);--weui-TAG-TEXT-BLACK: rgba(255, 255, 255, .5)}}.wx-root[data-weui-mode=care][data-weui-theme=dark],body[data-weui-mode=care][data-weui-theme=dark]{--weui-BG-0: #111111;--weui-BG-1: #1E1E1E;--weui-BG-2: #191919;--weui-BG-3: #202020;--weui-BG-4: #404040;--weui-BG-5: #2C2C2C;--weui-BLUE-100: #10AEFF;--weui-BLUE-120: #0C8BCC;--weui-BLUE-170: #04344D;--weui-BLUE-80: #3FBEFF;--weui-BLUE-90: #28B6FF;--weui-BLUE-BG-100: #48A6E2;--weui-BLUE-BG-110: #4095CB;--weui-BLUE-BG-130: #32749E;--weui-BLUE-BG-90: #5AAFE4;--weui-BRAND-100: #07C160;--weui-BRAND-120: #059A4C;--weui-BRAND-170: #023A1C;--weui-BRAND-80: #38CD7F;--weui-BRAND-90: #20C770;--weui-BRAND-BG-100: #2AAE67;--weui-BRAND-BG-110: #259C5C;--weui-BRAND-BG-130: #1D7A48;--weui-BRAND-BG-90: #3EB575;--weui-FG-0: rgba(255, 255, 255, .85);--weui-FG-0_5: rgba(255, 255, 255, .65);--weui-FG-1: rgba(255, 255, 255, .55);--weui-FG-2: rgba(255, 255, 255, .35);--weui-FG-3: rgba(255, 255, 255, .1);--weui-FG-4: rgba(255, 255, 255, .15);--weui-GLYPH-0: rgba(255, 255, 255, .85);--weui-GLYPH-1: rgba(255, 255, 255, .55);--weui-GLYPH-2: rgba(255, 255, 255, .35);--weui-GLYPH-WHITE-0: rgba(255, 255, 255, .85);--weui-GLYPH-WHITE-1: rgba(255, 255, 255, .55);--weui-GLYPH-WHITE-2: rgba(255, 255, 255, .35);--weui-GLYPH-WHITE-3: #FFFFFF;--weui-GREEN-100: #74A800;--weui-GREEN-120: #5C8600;--weui-GREEN-170: #233200;--weui-GREEN-80: #8FB933;--weui-GREEN-90: #82B01A;--weui-GREEN-BG-100: #789833;--weui-GREEN-BG-110: #6B882D;--weui-GREEN-BG-130: #65802B;--weui-GREEN-BG-90: #85A247;--weui-INDIGO-100: #1196FF;--weui-INDIGO-120: #0D78CC;--weui-INDIGO-170: #052D4D;--weui-INDIGO-80: #40ABFF;--weui-INDIGO-90: #28A0FF;--weui-INDIGO-BG-100: #0D78CC;--weui-INDIGO-BG-110: #0B6BB7;--weui-INDIGO-BG-130: #09548F;--weui-INDIGO-BG-90: #2585D1;--weui-LIGHTGREEN-100: #3EB575;--weui-LIGHTGREEN-120: #31905D;--weui-LIGHTGREEN-170: #123522;--weui-LIGHTGREEN-80: #64C390;--weui-LIGHTGREEN-90: #51BC83;--weui-LIGHTGREEN-BG-100: #31905D;--weui-LIGHTGREEN-BG-110: #2C8153;--weui-LIGHTGREEN-BG-130: #226541;--weui-LIGHTGREEN-BG-90: #31905D;--weui-LINK-100: #7D90A9;--weui-LINK-120: #647387;--weui-LINK-170: #252A32;--weui-LINK-80: #97A6BA;--weui-LINK-90: #899AB1;--weui-LINKFINDER-100: #DEE9FF;--weui-MATERIAL-ATTACHMENTCOLUMN: rgba(32, 32, 32, .93);--weui-MATERIAL-NAVIGATIONBAR: rgba(18, 18, 18, .9);--weui-MATERIAL-REGULAR: rgba(37, 37, 37, .6);--weui-MATERIAL-THICK: rgba(34, 34, 34, .9);--weui-MATERIAL-THIN: rgba(245, 245, 245, .4);--weui-MATERIAL-TOOLBAR: rgba(35, 35, 35, .93);--weui-ORANGE-100: #C87D2F;--weui-ORANGE-120: #A06425;--weui-ORANGE-170: #3B250E;--weui-ORANGE-80: #D39758;--weui-ORANGE-90: #CD8943;--weui-ORANGE-BG-100: #BB6000;--weui-ORANGE-BG-110: #A85600;--weui-ORANGE-BG-130: #824300;--weui-ORANGE-BG-90: #C1701A;--weui-ORANGERED-100: #FF6146;--weui-OVERLAY: rgba(0, 0, 0, .8);--weui-OVERLAY-WHITE: rgba(242, 242, 242, .8);--weui-PURPLE-100: #8183FF;--weui-PURPLE-120: #6768CC;--weui-PURPLE-170: #26274C;--weui-PURPLE-80: #9A9BFF;--weui-PURPLE-90: #8D8FFF;--weui-PURPLE-BG-100: #6768CC;--weui-PURPLE-BG-110: #5C5DB7;--weui-PURPLE-BG-130: #48498F;--weui-PURPLE-BG-90: #7677D1;--weui-RED-100: #FA5151;--weui-RED-120: #C84040;--weui-RED-170: #4B1818;--weui-RED-80: #FB7373;--weui-RED-90: #FA6262;--weui-RED-BG-100: #CF5148;--weui-RED-BG-110: #BA4940;--weui-RED-BG-130: #913832;--weui-RED-BG-90: #D3625A;--weui-SECONDARY-BG: rgba(255, 255, 255, .15);--weui-SEPARATOR-0: rgba(255, 255, 255, .05);--weui-SEPARATOR-1: rgba(255, 255, 255, .15);--weui-STATELAYER-HOVERED: rgba(0, 0, 0, .02);--weui-STATELAYER-PRESSED: rgba(255, 255, 255, .1);--weui-STATELAYER-PRESSEDSTRENGTHENED: rgba(255, 255, 255, .2);--weui-YELLOW-100: #CC9C00;--weui-YELLOW-120: #A37C00;--weui-YELLOW-170: #3D2F00;--weui-YELLOW-80: #D6AF33;--weui-YELLOW-90: #D1A519;--weui-YELLOW-BG-100: #BF9100;--weui-YELLOW-BG-110: #AB8200;--weui-YELLOW-BG-130: #866500;--weui-YELLOW-BG-90: #C59C1A;--weui-FG-HALF: rgba(255, 255, 255, .65);--weui-RED: #FA5151;--weui-ORANGERED: #FF6146;--weui-ORANGE: #C87D2F;--weui-YELLOW: #CC9C00;--weui-GREEN: #74A800;--weui-LIGHTGREEN: #3EB575;--weui-TEXTGREEN: #259C5C;--weui-BRAND: #07C160;--weui-BLUE: #10AEFF;--weui-INDIGO: #1196FF;--weui-PURPLE: #8183FF;--weui-LINK: #7D90A9;--weui-REDORANGE: #FF6146;--weui-TAG-BACKGROUND-BLACK: rgba(255, 255, 255, .05);--weui-FG: #fff;--weui-WHITE: rgba(255, 255, 255, .8);--weui-FG-5: rgba(255, 255, 255, .1);--weui-TAG-BACKGROUND-ORANGE: rgba(250, 157, 59, .1);--weui-TAG-BACKGROUND-GREEN: rgba(6, 174, 86, .1);--weui-TAG-TEXT-RED: rgba(250, 81, 81, .6);--weui-TAG-BACKGROUND-RED: rgba(250, 81, 81, .1);--weui-TAG-BACKGROUND-BLUE: rgba(16, 174, 255, .1);--weui-TAG-TEXT-ORANGE: rgba(250, 157, 59, .6);--weui-BG: #000;--weui-TAG-TEXT-GREEN: rgba(6, 174, 86, .6);--weui-TAG-TEXT-BLUE: rgba(16, 174, 255, .6);--weui-TAG-TEXT-BLACK: rgba(255, 255, 255, .5)}.wx_hover_card:before{content:\" \";position:absolute;top:0;left:0;right:0;bottom:0;border-radius:8px;box-sizing:border-box;border:1px solid rgba(7,193,96,.3);pointer-events:none;z-index:9}.wx_selected_card:before{content:\" \";position:absolute;top:0;left:0;right:0;bottom:0;border-radius:8px;border:1.5px solid #07C160;box-sizing:border-box;background:rgba(7,193,96,.1);pointer-events:none;z-index:9}.product_card_text_wrp{display:inline;-webkit-user-select:none;-moz-user-select:none;user-select:none;-webkit-tap-highlight-color:transparent;font-family:PingFang SC}.iframe_wrp{display:flex;flex-direction:column;-webkit-user-select:none;-moz-user-select:none;user-select:none;align-items:center;position:relative}.iframe_style{height:0px}.product_wx_img_placeholder{width:100%;background:var(--weui-BG-3) url(\"data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='80px' height='80px' viewBox='0 0 80 80' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E9.\u5143\u7D20/\u52A0\u8F7D/Black%3C/title%3E%3Cdefs%3E%3ClinearGradient x1='94.0869141%25' y1='0%25' x2='94.0869141%25' y2='90.559082%25' id='linearGradient-1'%3E%3Cstop stop-color='%23606060' stop-opacity='0' offset='0%25'%3E%3C/stop%3E%3Cstop stop-color='%23606060' stop-opacity='0.3' offset='100%25'%3E%3C/stop%3E%3C/linearGradient%3E%3ClinearGradient x1='100%25' y1='8.67370605%25' x2='100%25' y2='90.6286621%25' id='linearGradient-2'%3E%3Cstop stop-color='%23606060' offset='0%25'%3E%3C/stop%3E%3Cstop stop-color='%23606060' stop-opacity='0.3' offset='100%25'%3E%3C/stop%3E%3C/linearGradient%3E%3C/defs%3E%3Cg id='\u9875\u9762-1' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' opacity='0.9'%3E%3Cg id='LoadingDefault'%3E%3Cpath d='M40,0 C62.09139,0 80,17.90861 80,40 C80,62.09139 62.09139,80 40,80 L40,73 C58.2253967,73 73,58.2253967 73,40 C73,21.7746033 58.2253967,7 40,7 L40,0 Z' id='\u8DEF\u5F84' fill='url(%23linearGradient-1)'%3E%3C/path%3E%3Cpath d='M40,0 L40,7 C21.7746033,7 7,21.7746033 7,40 C7,58.2253967 21.7746033,73 40,73 L40,80 C17.90861,80 0,62.09139 0,40 C0,17.90861 17.90861,0 40,0 Z' id='\u8DEF\u5F84' fill='url(%23linearGradient-2)'%3E%3C/path%3E%3Ccircle id='Oval' fill='%23606060' cx='40.5' cy='3.5' r='3.5'%3E%3C/circle%3E%3C/g%3E%3CanimateTransform attributeName='transform' begin='0s' dur='1s' type='rotate' values='0 40 40;360 40 40' repeatCount='indefinite'/%3E%3C/g%3E%3C/svg%3E%0A\") no-repeat 50% 50%!important;background-size:16px!important;border-radius:8px}:root{--weui-FG-6: rgba(0, 0, 0, .05)}.product_text_link{text-decoration:none;padding:2px 4px;color:var(--weui-LINK);cursor:default;-webkit-user-drag:none;border-radius:4px}.product_text_link:before{content:\"\";display:inline-block;mask-image:url(\"data:image/svg+xml,%3Csvg width='25' height='25' viewBox='0 0 25 25' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M5.798 13.728c-.32 0-.636-.032-.942-.096-1.792-.378-3.042-1.754-3.042-3.348 0-.426.088-.84.262-1.232l.008-.02 2.008-4.498a3.696 3.696 0 0 1 3.372-2.186h9.8A3.697 3.697 0 0 1 20.662 4.6l1.984 4.432c.178.402.268.82.268 1.248 0 1.596-1.252 2.974-3.044 3.348a4.63 4.63 0 0 1-2.176-.074c-.816-.23-1.514-.68-2.002-1.268-.798.846-2.018 1.368-3.326 1.368-1.308 0-2.52-.52-3.322-1.364-.488.59-1.188 1.042-2.014 1.274-.394.11-.808.168-1.23.168l-.002-.004zM3.46 9.632l-.01.022c-.09.2-.136.412-.136.63 0 .878.762 1.65 1.85 1.88.47.098.994.082 1.458-.048.766-.214 1.368-.728 1.576-1.34a1.43 1.43 0 0 0 .046-.158.748.748 0 1 1 1.448-.056l.026.07.012.03c.392.892 1.448 1.49 2.634 1.49s2.25-.602 2.636-1.498c.02-.046.034-.082.046-.12a.744.744 0 0 1 .754-.502.75.75 0 0 1 .688.588c.012.056.026.108.042.152.214.62.802 1.118 1.572 1.334.466.132.99.148 1.46.048 1.092-.228 1.852-1.002 1.852-1.88 0-.216-.046-.43-.138-.636l-1.988-4.44-.008-.018-.018-.036a2.19 2.19 0 0 0-1.998-1.296h-9.8c-.864 0-1.648.51-2 1.298-.008.016-.014.032-.022.046L3.46 9.634v-.002zM12.364 21.642c-4.142 0-7.566-2.634-7.794-5.996a.75.75 0 1 1 1.498-.102c.174 2.578 2.94 4.598 6.298 4.598s6.122-2.02 6.296-4.598a.75.75 0 1 1 1.498.102c-.228 3.362-3.652 5.996-7.794 5.996h-.002z' fill='%23576B95'/%3E%3C/svg%3E\");-webkit-mask-image:url(\"data:image/svg+xml,%3Csvg width='25' height='25' viewBox='0 0 25 25' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M5.798 13.728c-.32 0-.636-.032-.942-.096-1.792-.378-3.042-1.754-3.042-3.348 0-.426.088-.84.262-1.232l.008-.02 2.008-4.498a3.696 3.696 0 0 1 3.372-2.186h9.8A3.697 3.697 0 0 1 20.662 4.6l1.984 4.432c.178.402.268.82.268 1.248 0 1.596-1.252 2.974-3.044 3.348a4.63 4.63 0 0 1-2.176-.074c-.816-.23-1.514-.68-2.002-1.268-.798.846-2.018 1.368-3.326 1.368-1.308 0-2.52-.52-3.322-1.364-.488.59-1.188 1.042-2.014 1.274-.394.11-.808.168-1.23.168l-.002-.004zM3.46 9.632l-.01.022c-.09.2-.136.412-.136.63 0 .878.762 1.65 1.85 1.88.47.098.994.082 1.458-.048.766-.214 1.368-.728 1.576-1.34a1.43 1.43 0 0 0 .046-.158.748.748 0 1 1 1.448-.056l.026.07.012.03c.392.892 1.448 1.49 2.634 1.49s2.25-.602 2.636-1.498c.02-.046.034-.082.046-.12a.744.744 0 0 1 .754-.502.75.75 0 0 1 .688.588c.012.056.026.108.042.152.214.62.802 1.118 1.572 1.334.466.132.99.148 1.46.048 1.092-.228 1.852-1.002 1.852-1.88 0-.216-.046-.43-.138-.636l-1.988-4.44-.008-.018-.018-.036a2.19 2.19 0 0 0-1.998-1.296h-9.8c-.864 0-1.648.51-2 1.298-.008.016-.014.032-.022.046L3.46 9.634v-.002zM12.364 21.642c-4.142 0-7.566-2.634-7.794-5.996a.75.75 0 1 1 1.498-.102c.174 2.578 2.94 4.598 6.298 4.598s6.122-2.02 6.296-4.598a.75.75 0 1 1 1.498.102c-.228 3.362-3.652 5.996-7.794 5.996h-.002z' fill='%23576B95'/%3E%3C/svg%3E\");background-color:currentColor;-webkit-mask-size:contain;mask-size:contain;vertical-align:middle;height:1.1em;width:1.1em;margin-right:2px;margin-top:-.16em}.product-logo{height:1.1em;width:1.1em;display:inline-block;mask-image:url(\"data:image/svg+xml,%3Csvg width='25' height='25' viewBox='0 0 25 25' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M5.798 13.728c-.32 0-.636-.032-.942-.096-1.792-.378-3.042-1.754-3.042-3.348 0-.426.088-.84.262-1.232l.008-.02 2.008-4.498a3.696 3.696 0 0 1 3.372-2.186h9.8A3.697 3.697 0 0 1 20.662 4.6l1.984 4.432c.178.402.268.82.268 1.248 0 1.596-1.252 2.974-3.044 3.348a4.63 4.63 0 0 1-2.176-.074c-.816-.23-1.514-.68-2.002-1.268-.798.846-2.018 1.368-3.326 1.368-1.308 0-2.52-.52-3.322-1.364-.488.59-1.188 1.042-2.014 1.274-.394.11-.808.168-1.23.168l-.002-.004zM3.46 9.632l-.01.022c-.09.2-.136.412-.136.63 0 .878.762 1.65 1.85 1.88.47.098.994.082 1.458-.048.766-.214 1.368-.728 1.576-1.34a1.43 1.43 0 0 0 .046-.158.748.748 0 1 1 1.448-.056l.026.07.012.03c.392.892 1.448 1.49 2.634 1.49s2.25-.602 2.636-1.498c.02-.046.034-.082.046-.12a.744.744 0 0 1 .754-.502.75.75 0 0 1 .688.588c.012.056.026.108.042.152.214.62.802 1.118 1.572 1.334.466.132.99.148 1.46.048 1.092-.228 1.852-1.002 1.852-1.88 0-.216-.046-.43-.138-.636l-1.988-4.44-.008-.018-.018-.036a2.19 2.19 0 0 0-1.998-1.296h-9.8c-.864 0-1.648.51-2 1.298-.008.016-.014.032-.022.046L3.46 9.634v-.002zM12.364 21.642c-4.142 0-7.566-2.634-7.794-5.996a.75.75 0 1 1 1.498-.102c.174 2.578 2.94 4.598 6.298 4.598s6.122-2.02 6.296-4.598a.75.75 0 1 1 1.498.102c-.228 3.362-3.652 5.996-7.794 5.996h-.002z' fill='%23576B95'/%3E%3C/svg%3E\");-webkit-mask-image:url(\"data:image/svg+xml,%3Csvg width='25' height='25' viewBox='0 0 25 25' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M5.798 13.728c-.32 0-.636-.032-.942-.096-1.792-.378-3.042-1.754-3.042-3.348 0-.426.088-.84.262-1.232l.008-.02 2.008-4.498a3.696 3.696 0 0 1 3.372-2.186h9.8A3.697 3.697 0 0 1 20.662 4.6l1.984 4.432c.178.402.268.82.268 1.248 0 1.596-1.252 2.974-3.044 3.348a4.63 4.63 0 0 1-2.176-.074c-.816-.23-1.514-.68-2.002-1.268-.798.846-2.018 1.368-3.326 1.368-1.308 0-2.52-.52-3.322-1.364-.488.59-1.188 1.042-2.014 1.274-.394.11-.808.168-1.23.168l-.002-.004zM3.46 9.632l-.01.022c-.09.2-.136.412-.136.63 0 .878.762 1.65 1.85 1.88.47.098.994.082 1.458-.048.766-.214 1.368-.728 1.576-1.34a1.43 1.43 0 0 0 .046-.158.748.748 0 1 1 1.448-.056l.026.07.012.03c.392.892 1.448 1.49 2.634 1.49s2.25-.602 2.636-1.498c.02-.046.034-.082.046-.12a.744.744 0 0 1 .754-.502.75.75 0 0 1 .688.588c.012.056.026.108.042.152.214.62.802 1.118 1.572 1.334.466.132.99.148 1.46.048 1.092-.228 1.852-1.002 1.852-1.88 0-.216-.046-.43-.138-.636l-1.988-4.44-.008-.018-.018-.036a2.19 2.19 0 0 0-1.998-1.296h-9.8c-.864 0-1.648.51-2 1.298-.008.016-.014.032-.022.046L3.46 9.634v-.002zM12.364 21.642c-4.142 0-7.566-2.634-7.794-5.996a.75.75 0 1 1 1.498-.102c.174 2.578 2.94 4.598 6.298 4.598s6.122-2.02 6.296-4.598a.75.75 0 1 1 1.498.102c-.228 3.362-3.652 5.996-7.794 5.996h-.002z' fill='%23576B95'/%3E%3C/svg%3E\");background-color:currentColor;-webkit-mask-size:contain;mask-size:contain}.shop-verify-icon{height:1em;width:1em;display:inline-block;background-size:contain;background-position:center;background-repeat:no-repeat}.weui-toast{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background-color:#4c4c4c;border-radius:8px;color:#fff;font-size:14px;line-height:1.4;padding:0 20px}.discounted_price.fade-enter,.discounted_price.fade-leave-to{opacity:0;height:0}.discounted_price.fade-enter-to,.discounted_price.fade-leave{opacity:1;height:15px}.discounted_price.fade-enter-active,.discounted_price.fade-leave-active{transition:opacity .15s,height .15s}.activity_card_wrp{-webkit-user-select:none;-moz-user-select:none;user-select:none;width:-moz-fit-content;width:fit-content}.activity_card_wrp .activity_card_wrp__container{display:flex;flex-direction:column;align-items:center;background-color:#0000001a;-webkit-backdrop-filter:blur(50px);backdrop-filter:blur(50px);border-radius:8px;padding:10px}.activity_card_wrp .activity_card_wrp__container .product_image{width:52px;height:52px;border-radius:2px;margin-bottom:8px}.activity_card_wrp .discounted_price{overflow:hidden;font-weight:500;color:#e0b684;line-height:1;font-family:WeChatSansStd-Medium;line-height:normal;font-size:15px}@font-face{font-family:WeChatSansStd-Medium;src:url(data:application/octet-stream;base64,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AwYAAwABBAkABAAsA1oAAwABBAkABQAYA4YAAwABBAkABgAsA54AAwABBAkABwBMA8oAAwABBAkACAAWBBYAAwABBAkACQBGBCwAAwABBAkACwAwBHIAAwABBAkAEAAeBKIAAwABBAkAEQAMBMAAAwABBAkAEwAiBMwAAwABCAQAAABmBO4AAwABCAQAAQAsBVQAAwABCAQAAgAOBYAAAwABCAQABAAsBY4AAwABCAQABwBMBboAAwABCAQACAAWBgYAAwABCAQACQBGBhwAAwABCAQAEAAeBmIAAwABCAQAEQAMBoBDb3B5cmlnaHQgKGMpIDIwMTcgYnkgVGVuY2VudC4gQWxsIHJpZ2h0cyByZXNlcnZlZC5XZUNoYXQgU2FucyBTdGRNZWRpdW1IYW55aSBXZUNoYXQgU2FucyBTdGQtTWVkaXVtOyBWZXJzaW9uIDEuMDBXZUNoYXQgU2FucyBTdGQtTWVkaXVtVmVyc2lvbiAxLjAwV2VDaGF0LVNhbnMtU3RkLU1lZGl1bVdlQ2hhdCBTYW5zIGlzIGEgdHJhZGVtYXJrIG9mIFRlbmNlbnQuSGFueWkgRm9udHNaSEFORyBYdWFuLCBXQU5HIFRpYW5iaSwgTElVIFhpYW95dWh0dHA6Ly93d3cuaGFueWkuY29tLmNuL1dlQ2hhdCBTYW5zIFN0ZE1lZGl1bVdlQ2hhdCBTYW5zIFN0ZC1NZWRpdW3boiSjX7QKMTIzNDU2Nzg5MENvcHlyaWdodCAoYykgMjAxNyBieSBUZW5jZW50LiBBbGwgcmlnaHRzIHJlc2VydmVkLldlQ2hhdCBTYW5zIFN0ZE1lZGl1bUhhbnlpIFdlQ2hhdCBTYW5zIFN0ZC1NZWRpdW07IFZlcnNpb24gMS4wMFdlQ2hhdCBTYW5zIFN0ZC1NZWRpdW1WZXJzaW9uIDEuMDBXZUNoYXQtU2Fucy1TdGQtTWVkaXVtV2VDaGF0IFNhbnMgaXMgYSB0cmFkZW1hcmsgb2YgVGVuY2VudC5IYW55aSBGb250c1pIQU5HIFh1YW4sIFdBTkcgVGlhbmJpLCBMSVUgWGlhb3l1V2VDaGF0IFNhbnMgU3RkLU1lZGl1bQBDAG8AcAB5AHIAaQBnAGgAdAAgACgAYwApACAAMgAwADEANwAgAGIAeQAgAFQAZQBuAGMAZQBuAHQALgAgAEEAbABsACAAcgBpAGcAaAB0AHMAIAByAGUAcwBlAHIAdgBlAGQALgBXAGUAQwBoAGEAdAAgAFMAYQBuAHMAIABTAHQAZAAgAE0AZQBkAGkAdQBtAFIAZQBnAHUAbABhAHIASABhAG4AeQBpACAAVwBlAEMAaABhAHQAIABTAGEAbgBzACAAUwB0AGQALQBNAGUAZABpAHUAbQA7ACAAVgBlAHIAcwBpAG8AbgAgADEALgAwADAAVwBlAEMAaABhAHQAIABTAGEAbgBzACAAUwB0AGQALQBNAGUAZABpAHUAbQBWAGUAcgBzAGkAbwBuACAAMQAuADAAMABXAGUAQwBoAGEAdAAtAFMAYQBuAHMALQBTAHQAZAAtAE0AZQBkAGkAdQBtAFcAZQBDAGgAYQB0ACAAUwBhAG4AcwAgAGkAcwAgAGEAIAB0AHIAYQBkAGUAbQBhAHIAawAgAG8AZgAgAFQAZQBuAGMAZQBuAHQALgBIAGEAbgB5AGkAIABGAG8AbgB0AHMAWgBIAEEATgBHACAAWAB1AGEAbgAsACAAVwBBAE4ARwAgAFQAaQBhAG4AYgBpACwAIABMAEkAVQAgAFgAaQBhAG8AeQB1AGgAdAB0AHAAOgAvAC8AdwB3AHcALgBoAGEAbgB5AGkALgBjAG8AbQAuAGMAbgAvAFcAZQBDAGgAYQB0ACAAUwBhAG4AcwAgAFMAdABkAE0AZQBkAGkAdQBtIKwAogAkAKMgqQClAAoAMQAyADMANAA1ADYANwA4ADkAMABDAG8AcAB5AHIAaQBnAGgAdAAgACgAYwApACAAMgAwADEANwAgAGIAeQAgAFQAZQBuAGMAZQBuAHQALgAgAEEAbABsACAAcgBpAGcAaAB0AHMAIAByAGUAcwBlAHIAdgBlAGQALgBXAGUAQwBoAGEAdAAgAFMAYQBuAHMAIABTAHQAZAAgAE0AZQBkAGkAdQBtAFIAZQBnAHUAbABhAHIAVwBlAEMAaABhAHQAIABTAGEAbgBzACAAUwB0AGQALQBNAGUAZABpAHUAbQBXAGUAQwBoAGEAdAAgAFMAYQBuAHMAIABpAHMAIABhACAAdAByAGEAZABlAG0AYQByAGsAIABvAGYAIABUAGUAbgBjAGUAbgB0AC4ASABhAG4AeQBpACAARgBvAG4AdABzAFoASABBAE4ARwAgAFgAdQBhAG4ALAAgAFcAQQBOAEcAIABUAGkAYQBuAGIAaQAsACAATABJAFUAIABYAGkAYQBvAHkAdQBXAGUAQwBoAGEAdAAgAFMAYQBuAHMAIABTAHQAZABNAGUAZABpAHUAbQAAAAIAAAAAAAD/tQAyAAAAAAAAAAAAAAAAAAAAAAAAAAAAYwAAAAMAJAAlACYAJwAoACkAKgArACwALQAuAC8AMAAxADIAMwA0ADUANgA3ADgAOQA6ADsAPAA9AEQARQBGAEcASABJAEoASwBMAE0ATgBPAFAAUQBSAFMAVABVAFYAVwBYAFkAWgBbAFwAXQATABQAFQAWABcAGAAZABoAGwAcAA8AEQAQAQIBAwCEAQQAvQAHAQUBBgEHAQgBCQEKAQsBDAENAQ4BDwEQAREBEgCFARMBFAEVAJYBFgEXARgBGQEaAA4A7wd1bmkwRTNGB3VuaTIwQjUNY29sb25tb25ldGFyeQd1bmlGRTY5BGRvbmcERXVybwd1bmkyMEIyB3VuaTIwQjQHdW5pMjBBRAd1bmkyMEJFB3VuaTIwQkEHdW5pMjBCQwd1bmkyMEE2B3VuaTIwQjEHdW5pMjBCRAd1bmkyMEI5B3VuaTIwQUEHdW5pMjBCOAd1bmkyMEFFB3VuaTIwQTkHdW5pRkZFMAd1bmlGRjA0B3VuaUZGRTEHdW5pRkZFNgd1bmlGRkU1) format(\"truetype\")}.activity_card_wrp .origin_price{font-weight:500;color:#fff;line-height:1;transition:font-size .15s,font-weight .15s,color .15s,-webkit-text-decoration .15s;transition:font-size .15s,font-weight .15s,color .15s,text-decoration .15s;transition:font-size .15s,font-weight .15s,color .15s,text-decoration .15s,-webkit-text-decoration .15s;font-family:WeChatSansStd-Medium;line-height:normal;font-size:15px}@font-face{font-family:WeChatSansStd-Medium;src:url(data:application/octet-stream;base64,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AwYAAwABBAkABAAsA1oAAwABBAkABQAYA4YAAwABBAkABgAsA54AAwABBAkABwBMA8oAAwABBAkACAAWBBYAAwABBAkACQBGBCwAAwABBAkACwAwBHIAAwABBAkAEAAeBKIAAwABBAkAEQAMBMAAAwABBAkAEwAiBMwAAwABCAQAAABmBO4AAwABCAQAAQAsBVQAAwABCAQAAgAOBYAAAwABCAQABAAsBY4AAwABCAQABwBMBboAAwABCAQACAAWBgYAAwABCAQACQBGBhwAAwABCAQAEAAeBmIAAwABCAQAEQAMBoBDb3B5cmlnaHQgKGMpIDIwMTcgYnkgVGVuY2VudC4gQWxsIHJpZ2h0cyByZXNlcnZlZC5XZUNoYXQgU2FucyBTdGRNZWRpdW1IYW55aSBXZUNoYXQgU2FucyBTdGQtTWVkaXVtOyBWZXJzaW9uIDEuMDBXZUNoYXQgU2FucyBTdGQtTWVkaXVtVmVyc2lvbiAxLjAwV2VDaGF0LVNhbnMtU3RkLU1lZGl1bVdlQ2hhdCBTYW5zIGlzIGEgdHJhZGVtYXJrIG9mIFRlbmNlbnQuSGFueWkgRm9udHNaSEFORyBYdWFuLCBXQU5HIFRpYW5iaSwgTElVIFhpYW95dWh0dHA6Ly93d3cuaGFueWkuY29tLmNuL1dlQ2hhdCBTYW5zIFN0ZE1lZGl1bVdlQ2hhdCBTYW5zIFN0ZC1NZWRpdW3boiSjX7QKMTIzNDU2Nzg5MENvcHlyaWdodCAoYykgMjAxNyBieSBUZW5jZW50LiBBbGwgcmlnaHRzIHJlc2VydmVkLldlQ2hhdCBTYW5zIFN0ZE1lZGl1bUhhbnlpIFdlQ2hhdCBTYW5zIFN0ZC1NZWRpdW07IFZlcnNpb24gMS4wMFdlQ2hhdCBTYW5zIFN0ZC1NZWRpdW1WZXJzaW9uIDEuMDBXZUNoYXQtU2Fucy1TdGQtTWVkaXVtV2VDaGF0IFNhbnMgaXMgYSB0cmFkZW1hcmsgb2YgVGVuY2VudC5IYW55aSBGb250c1pIQU5HIFh1YW4sIFdBTkcgVGlhbmJpLCBMSVUgWGlhb3l1V2VDaGF0IFNhbnMgU3RkLU1lZGl1bQBDAG8AcAB5AHIAaQBnAGgAdAAgACgAYwApACAAMgAwADEANwAgAGIAeQAgAFQAZQBuAGMAZQBuAHQALgAgAEEAbABsACAAcgBpAGcAaAB0AHMAIAByAGUAcwBlAHIAdgBlAGQALgBXAGUAQwBoAGEAdAAgAFMAYQBuAHMAIABTAHQAZAAgAE0AZQBkAGkAdQBtAFIAZQBnAHUAbABhAHIASABhAG4AeQBpACAAVwBlAEMAaABhAHQAIABTAGEAbgBzACAAUwB0AGQALQBNAGUAZABpAHUAbQA7ACAAVgBlAHIAcwBpAG8AbgAgADEALgAwADAAVwBlAEMAaABhAHQAIABTAGEAbgBzACAAUwB0AGQALQBNAGUAZABpAHUAbQBWAGUAcgBzAGkAbwBuACAAMQAuADAAMABXAGUAQwBoAGEAdAAtAFMAYQBuAHMALQBTAHQAZAAtAE0AZQBkAGkAdQBtAFcAZQBDAGgAYQB0ACAAUwBhAG4AcwAgAGkAcwAgAGEAIAB0AHIAYQBkAGUAbQBhAHIAawAgAG8AZgAgAFQAZQBuAGMAZQBuAHQALgBIAGEAbgB5AGkAIABGAG8AbgB0AHMAWgBIAEEATgBHACAAWAB1AGEAbgAsACAAVwBBAE4ARwAgAFQAaQBhAG4AYgBpACwAIABMAEkAVQAgAFgAaQBhAG8AeQB1AGgAdAB0AHAAOgAvAC8AdwB3AHcALgBoAGEAbgB5AGkALgBjAG8AbQAuAGMAbgAvAFcAZQBDAGgAYQB0ACAAUwBhAG4AcwAgAFMAdABkAE0AZQBkAGkAdQBtIKwAogAkAKMgqQClAAoAMQAyADMANAA1ADYANwA4ADkAMABDAG8AcAB5AHIAaQBnAGgAdAAgACgAYwApACAAMgAwADEANwAgAGIAeQAgAFQAZQBuAGMAZQBuAHQALgAgAEEAbABsACAAcgBpAGcAaAB0AHMAIAByAGUAcwBlAHIAdgBlAGQALgBXAGUAQwBoAGEAdAAgAFMAYQBuAHMAIABTAHQAZAAgAE0AZQBkAGkAdQBtAFIAZQBnAHUAbABhAHIAVwBlAEMAaABhAHQAIABTAGEAbgBzACAAUwB0AGQALQBNAGUAZABpAHUAbQBXAGUAQwBoAGEAdAAgAFMAYQBuAHMAIABpAHMAIABhACAAdAByAGEAZABlAG0AYQByAGsAIABvAGYAIABUAGUAbgBjAGUAbgB0AC4ASABhAG4AeQBpACAARgBvAG4AdABzAFoASABBAE4ARwAgAFgAdQBhAG4ALAAgAFcAQQBOAEcAIABUAGkAYQBuAGIAaQAsACAATABJAFUAIABYAGkAYQBvAHkAdQBXAGUAQwBoAGEAdAAgAFMAYQBuAHMAIABTAHQAZABNAGUAZABpAHUAbQAAAAIAAAAAAAD/tQAyAAAAAAAAAAAAAAAAAAAAAAAAAAAAYwAAAAMAJAAlACYAJwAoACkAKgArACwALQAuAC8AMAAxADIAMwA0ADUANgA3ADgAOQA6ADsAPAA9AEQARQBGAEcASABJAEoASwBMAE0ATgBPAFAAUQBSAFMAVABVAFYAVwBYAFkAWgBbAFwAXQATABQAFQAWABcAGAAZABoAGwAcAA8AEQAQAQIBAwCEAQQAvQAHAQUBBgEHAQgBCQEKAQsBDAENAQ4BDwEQAREBEgCFARMBFAEVAJYBFgEXARgBGQEaAA4A7wd1bmkwRTNGB3VuaTIwQjUNY29sb25tb25ldGFyeQd1bmlGRTY5BGRvbmcERXVybwd1bmkyMEIyB3VuaTIwQjQHdW5pMjBBRAd1bmkyMEJFB3VuaTIwQkEHdW5pMjBCQwd1bmkyMEE2B3VuaTIwQjEHdW5pMjBCRAd1bmkyMEI5B3VuaTIwQUEHdW5pMjBCOAd1bmkyMEFFB3VuaTIwQTkHdW5pRkZFMAd1bmlGRjA0B3VuaUZGRTEHdW5pRkZFNgd1bmlGRkU1) format(\"truetype\")}.activity_card_wrp .origin_price.has_discount{font-weight:400;text-decoration:line-through;-webkit-text-decoration-color:#fff;text-decoration-color:#fff;color:#fff;opacity:.5;font-family:WeChatSansStd-Medium;line-height:normal;font-size:12px}@font-face{font-family:WeChatSansStd-Medium;src:url(data:application/octet-stream;base64,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AwYAAwABBAkABAAsA1oAAwABBAkABQAYA4YAAwABBAkABgAsA54AAwABBAkABwBMA8oAAwABBAkACAAWBBYAAwABBAkACQBGBCwAAwABBAkACwAwBHIAAwABBAkAEAAeBKIAAwABBAkAEQAMBMAAAwABBAkAEwAiBMwAAwABCAQAAABmBO4AAwABCAQAAQAsBVQAAwABCAQAAgAOBYAAAwABCAQABAAsBY4AAwABCAQABwBMBboAAwABCAQACAAWBgYAAwABCAQACQBGBhwAAwABCAQAEAAeBmIAAwABCAQAEQAMBoBDb3B5cmlnaHQgKGMpIDIwMTcgYnkgVGVuY2VudC4gQWxsIHJpZ2h0cyByZXNlcnZlZC5XZUNoYXQgU2FucyBTdGRNZWRpdW1IYW55aSBXZUNoYXQgU2FucyBTdGQtTWVkaXVtOyBWZXJzaW9uIDEuMDBXZUNoYXQgU2FucyBTdGQtTWVkaXVtVmVyc2lvbiAxLjAwV2VDaGF0LVNhbnMtU3RkLU1lZGl1bVdlQ2hhdCBTYW5zIGlzIGEgdHJhZGVtYXJrIG9mIFRlbmNlbnQuSGFueWkgRm9udHNaSEFORyBYdWFuLCBXQU5HIFRpYW5iaSwgTElVIFhpYW95dWh0dHA6Ly93d3cuaGFueWkuY29tLmNuL1dlQ2hhdCBTYW5zIFN0ZE1lZGl1bVdlQ2hhdCBTYW5zIFN0ZC1NZWRpdW3boiSjX7QKMTIzNDU2Nzg5MENvcHlyaWdodCAoYykgMjAxNyBieSBUZW5jZW50LiBBbGwgcmlnaHRzIHJlc2VydmVkLldlQ2hhdCBTYW5zIFN0ZE1lZGl1bUhhbnlpIFdlQ2hhdCBTYW5zIFN0ZC1NZWRpdW07IFZlcnNpb24gMS4wMFdlQ2hhdCBTYW5zIFN0ZC1NZWRpdW1WZXJzaW9uIDEuMDBXZUNoYXQtU2Fucy1TdGQtTWVkaXVtV2VDaGF0IFNhbnMgaXMgYSB0cmFkZW1hcmsgb2YgVGVuY2VudC5IYW55aSBGb250c1pIQU5HIFh1YW4sIFdBTkcgVGlhbmJpLCBMSVUgWGlhb3l1V2VDaGF0IFNhbnMgU3RkLU1lZGl1bQBDAG8AcAB5AHIAaQBnAGgAdAAgACgAYwApACAAMgAwADEANwAgAGIAeQAgAFQAZQBuAGMAZQBuAHQALgAgAEEAbABsACAAcgBpAGcAaAB0AHMAIAByAGUAcwBlAHIAdgBlAGQALgBXAGUAQwBoAGEAdAAgAFMAYQBuAHMAIABTAHQAZAAgAE0AZQBkAGkAdQBtAFIAZQBnAHUAbABhAHIASABhAG4AeQBpACAAVwBlAEMAaABhAHQAIABTAGEAbgBzACAAUwB0AGQALQBNAGUAZABpAHUAbQA7ACAAVgBlAHIAcwBpAG8AbgAgADEALgAwADAAVwBlAEMAaABhAHQAIABTAGEAbgBzACAAUwB0AGQALQBNAGUAZABpAHUAbQBWAGUAcgBzAGkAbwBuACAAMQAuADAAMABXAGUAQwBoAGEAdAAtAFMAYQBuAHMALQBTAHQAZAAtAE0AZQBkAGkAdQBtAFcAZQBDAGgAYQB0ACAAUwBhAG4AcwAgAGkAcwAgAGEAIAB0AHIAYQBkAGUAbQBhAHIAawAgAG8AZgAgAFQAZQBuAGMAZQBuAHQALgBIAGEAbgB5AGkAIABGAG8AbgB0AHMAWgBIAEEATgBHACAAWAB1AGEAbgAsACAAVwBBAE4ARwAgAFQAaQBhAG4AYgBpACwAIABMAEkAVQAgAFgAaQBhAG8AeQB1AGgAdAB0AHAAOgAvAC8AdwB3AHcALgBoAGEAbgB5AGkALgBjAG8AbQAuAGMAbgAvAFcAZQBDAGgAYQB0ACAAUwBhAG4AcwAgAFMAdABkAE0AZQBkAGkAdQBtIKwAogAkAKMgqQClAAoAMQAyADMANAA1ADYANwA4ADkAMABDAG8AcAB5AHIAaQBnAGgAdAAgACgAYwApACAAMgAwADEANwAgAGIAeQAgAFQAZQBuAGMAZQBuAHQALgAgAEEAbABsACAAcgBpAGcAaAB0AHMAIAByAGUAcwBlAHIAdgBlAGQALgBXAGUAQwBoAGEAdAAgAFMAYQBuAHMAIABTAHQAZAAgAE0AZQBkAGkAdQBtAFIAZQBnAHUAbABhAHIAVwBlAEMAaABhAHQAIABTAGEAbgBzACAAUwB0AGQALQBNAGUAZABpAHUAbQBXAGUAQwBoAGEAdAAgAFMAYQBuAHMAIABpAHMAIABhACAAdAByAGEAZABlAG0AYQByAGsAIABvAGYAIABUAGUAbgBjAGUAbgB0AC4ASABhAG4AeQBpACAARgBvAG4AdABzAFoASABBAE4ARwAgAFgAdQBhAG4ALAAgAFcAQQBOAEcAIABUAGkAYQBuAGIAaQAsACAATABJAFUAIABYAGkAYQBvAHkAdQBXAGUAQwBoAGEAdAAgAFMAYQBuAHMAIABTAHQAZABNAGUAZABpAHUAbQAAAAIAAAAAAAD/tQAyAAAAAAAAAAAAAAAAAAAAAAAAAAAAYwAAAAMAJAAlACYAJwAoACkAKgArACwALQAuAC8AMAAxADIAMwA0ADUANgA3ADgAOQA6ADsAPAA9AEQARQBGAEcASABJAEoASwBMAE0ATgBPAFAAUQBSAFMAVABVAFYAVwBYAFkAWgBbAFwAXQATABQAFQAWABcAGAAZABoAGwAcAA8AEQAQAQIBAwCEAQQAvQAHAQUBBgEHAQgBCQEKAQsBDAENAQ4BDwEQAREBEgCFARMBFAEVAJYBFgEXARgBGQEaAA4A7wd1bmkwRTNGB3VuaTIwQjUNY29sb25tb25ldGFyeQd1bmlGRTY5BGRvbmcERXVybwd1bmkyMEIyB3VuaTIwQjQHdW5pMjBBRAd1bmkyMEJFB3VuaTIwQkEHdW5pMjBCQwd1bmkyMEE2B3VuaTIwQjEHdW5pMjBCRAd1bmkyMEI5B3VuaTIwQUEHdW5pMjBCOAd1bmkyMEFFB3VuaTIwQTkHdW5pRkZFMAd1bmlGRjA0B3VuaUZGRTEHdW5pRkZFNgd1bmlGRkU1) format(\"truetype\")}.s1s_card_wrp{font-family:system-ui,PingFang SC;display:flex;align-items:center}.s1s_card_wrp .product-image{width:4em;height:4em;border-radius:2px;margin-right:12px}.s1s_card_wrp .product-info{flex:1;width:200px;line-height:1;display:flex;height:4em;flex-direction:column;box-sizing:border-box;padding:4px 0 0;justify-content:space-between}.s1s_card_wrp .product-title{color:var(--weui-FG-0);font-size:15px;width:100%;font-weight:400;padding-bottom:5px;text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.s1s_card_wrp .product-price{color:#b3b3b3;font-weight:400;text-decoration:line-through;font-family:WeChatSansStd-Medium;line-height:normal;font-size:13px;line-height:1;padding-left:4px;padding-right:6px;position:relative}@font-face{font-family:WeChatSansStd-Medium;src:url(data:application/octet-stream;base64,AAEAAAAOAIAAAwBgRFNJRwAAAAEAAADsAAAACEdERUYADwAAAAAA9AAAABBHUE9TvXTGagAAAQQAAAHKR1NVQhoeGpMAAALQAAAAfk9TLzJrL1pnAAADUAAAAGBjbWFwQHbxEAAAA7AAAAIWZ2x5Zvo1siwAAAXIAAAcqGhlYWQOn2bVAAAicAAAADZoaGVhBu4DIwAAIqgAAAAkaG10eNhnFGQAACLMAAABimxvY2E/+0eGAAAkWAAAAMhtYXhwANIAUwAAJSAAAAAgbmFtZVIudTIAACVAAAAI3nBvc3Tpjfc4AAAuIAAAAbAAAAABAAAAAAABAAAADAAAAAAAAAACAAAAAQAAAAoAHgAwAAFERkxUAAgABAAAAA

Source: https://mp.weixin.qq.com/s/03O5i8CiGrzm70r-wBS_bA
