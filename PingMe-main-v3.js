(function () {
  var scriptName = 'PingMeV3';
  var storeKey = 'pingme_accounts_v3';

  function notify(title, body) {
    try {
      if (typeof $notification !== 'undefined' && $notification && typeof $notification.post === 'function') {
        $notification.post(scriptName, title, body);
        return;
      }
    } catch (e) {}
    try {
      if (typeof $notify === 'function') {
        $notify(scriptName, title, body);
        return;
      }
    } catch (e) {}
    try { console.log('NOTIFY ' + title + ' :: ' + body); } catch (e) {}
  }

  function loadStore() {
    try {
      var raw = $prefs.valueForKey(storeKey);
      if (!raw) return { version: 1, accounts: {}, order: [] };
      var obj = JSON.parse(raw);
      if (!obj.accounts) obj.accounts = {};
      if (!obj.order || !obj.order.length) obj.order = Object.keys(obj.accounts);
      return obj;
    } catch (e) {
      return { version: 1, accounts: {}, order: [] };
    }
  }

  function saveStore(store) {
    $prefs.setValueForKey(JSON.stringify(store), storeKey);
  }

  function parseRawQuery(url) {
    var query = (url.split('?')[1] || '').split('#')[0];
    var rawMap = {};
    if (!query) return rawMap;
    query.split('&').forEach(function (pair) {
      if (!pair) return;
      var idx = pair.indexOf('=');
      if (idx < 0) return;
      rawMap[pair.slice(0, idx)] = pair.slice(idx + 1);
    });
    return rawMap;
  }

  function normalizeHeaders(headers) {
    var out = {};
    Object.keys(headers || {}).forEach(function (k) { out[k] = headers[k]; });
    return out;
  }

  function simpleIdFrom(paramsRaw) {
    var parts = [];
    ['email', 'uniquedeviceid', 'installTime', 'platform', 'clienttag'].forEach(function (k) {
      if (paramsRaw && paramsRaw[k]) parts.push(k + '=' + paramsRaw[k]);
    });
    var base = parts.join('&') || JSON.stringify(paramsRaw || {});
    var hash = 0, i, chr;
    for (i = 0; i < base.length; i++) {
      chr = base.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0;
    }
    return ('acc_' + Math.abs(hash)).slice(0, 16);
  }

  if (typeof $request !== 'undefined' && $request) {
    try {
      var paramsRaw = parseRawQuery($request.url || '');
      var headersMap = normalizeHeaders($request.headers || {});
      var store = loadStore();
      var id = simpleIdFrom(paramsRaw);
      var existed = !!store.accounts[id];
      store.accounts[id] = {
        id: id,
        alias: existed && store.accounts[id] && store.accounts[id].alias ? store.accounts[id].alias : ('账号' + (store.order.length + (existed ? 0 : 1))),
        capture: { url: $request.url, paramsRaw: paramsRaw, headers: headersMap },
        updatedAt: Date.now()
      };
      if (!existed) store.order.push(id);
      saveStore(store);
      console.log('PINGME_V3_CAPTURE ' + id + ' total=' + store.order.length);
      notify(existed ? '账号参数已更新' : '新账号已入库', 'id=' + id + '\n总数=' + store.order.length);
    } catch (e) {
      console.log('PINGME_V3_CAPTURE_ERR ' + (e && e.message ? e.message : String(e)));
      notify('抓包报错', String(e && e.message ? e.message : e));
    }
    $done({});
    return;
  }

  try {
    var store2 = loadStore();
    var ids = (store2.order || []).filter(function (id) { return !!store2.accounts[id]; });
    console.log('PINGME_V3_CRON accounts=' + ids.length);
    if (!ids.length) {
      notify('未抓到账号', '请先打开 PingMe 触发抓包');
      $done({});
      return;
    }
    var lines = ['已抓到账号数：' + ids.length];
    ids.forEach(function (id, idx) {
      var acc = store2.accounts[id];
      var p = (acc && acc.capture && acc.capture.paramsRaw) || {};
      lines.push((idx + 1) + '. ' + (acc.alias || id) + ' / ' + (p.email || p.uniquedeviceid || id));
    });
    notify('定时任务已触发', lines.join('\n'));
  } catch (e2) {
    console.log('PINGME_V3_CRON_ERR ' + (e2 && e2.message ? e2.message : String(e2)));
    notify('定时任务报错', String(e2 && e2.message ? e2.message : e2));
  }
  $done({});
})();
