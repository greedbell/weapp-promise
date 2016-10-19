/**
 * Created by Bell on 16/10/19.
 */

const promise = module.exports = {};
promise.default = promise;

/**
 * promise.app ==> getApp()
 */
Object.defineProperty(promise, 'app', {
  get: function () {
    return getApp();
  }
});

function forEach(key) {
  if (key.substr(0, 2) === 'on' || /\w+Sync$/.test(key)) {
    if (wx.__lookupGetter__(key)) { // wx. 有的，且以 on 开关，或者 Sync 结尾的用原始的方法
      Object.defineProperty(promise, key, {
        get: function () {
          return wx[key];
        }
      });
    } else { // wx. 没有有，且以 on 开关，或者 Sync 结尾的返回wx
      promise[key] = wx;
    }
    return;
  }

  // 转成 promise
  promise[key] = function (obj) {
    obj = obj || {};
    return new Promise(function (resolve, reject) {
      obj.success = resolve;
      obj.fail = function (res) {
        if (res && res.errMsg) {
          reject(new Error(res.errMsg));
        } else {
          reject(res);
        }
      };
      wx[key](obj);
    });
  };
}

Object.keys(wx).forEach(forEach);
