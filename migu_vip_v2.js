(function () {
  var AUTH = {
    userToken: 'nlps4840006C8E8B5958769A',
    userId: '1245377469',
    passId: '395831016729557547',
    userNum: 'NTDrsyM1kTO5YTNwcTNxYDO',
    encrypted: '1',
    carrierCode: 'CM',
    areaId: '551',
    cityId: '0551',
    expiredOn: '1783920728000',
    sign: 'A0C9ED100281B5EFF979D46468C1003F',
    clientId: '809f891b829f43ad8105bfd7e82335fb',
    l_s: '06c8eea357521254e2565a7357fa6825',
    l_t: '1778736725'
  };
  var MIGU_UID = '2377a93d-03c8-447b-a82d-84687dd522ac';
  var LOGIN_DEVICE_ID = '95cf83d8-2e8e-4f43-bf96-0b0d61cbb37a';
  var FORCE_RATE = '4';

  function notify(title, body) {
    try {
      if (typeof $notification !== 'undefined' && $notification && typeof $notification.post === 'function') {
        $notification.post('咪咕V2', title, body);
        return;
      }
    } catch (e) {}
    try {
      if (typeof $notify === 'function') {
        $notify('咪咕V2', title, body);
        return;
      }
    } catch (e) {}
  }

  function setQ(u, k, v) {
    var re = new RegExp('([?&]' + k + '=)[^&]*', 'i');
    if (re.test(u)) return u.replace(re, '$1' + v);
    return u + (u.indexOf('?') >= 0 ? '&' : '?') + k + '=' + v;
  }

  try {
    var url = $request.url || '';
    if (/play-pre\.miguvideo\.com\/playurl\//.test(url)) {
      url = setQ(url, 'rateType', FORCE_RATE);
      url = setQ(url, '4kDifinition', 'true');
      url = setQ(url, '4kvivid', 'true');
      url = setQ(url, '2Kvivid', 'true');
      url = setQ(url, 'super4k', 'true');
      url = setQ(url, 'superPlay', '1');
      url = setQ(url, 'h265', 'true');
      url = setQ(url, 'h265N', 'true');
      url = setQ(url, 'xh265', 'true');
      url = setQ(url, 'dolby', 'true');
      url = setQ(url, 'vivid', '2');
      url = setQ(url, 'needDrm', '1');
      url = setQ(url, 'drm', 'true');
      url = setQ(url, 'drmN2', '1');
    }

    var userInfo = JSON.stringify({
      areaId: AUTH.areaId,
      cityId: AUTH.cityId,
      expiredOn: AUTH.expiredOn,
      mobile: '',
      passId: AUTH.passId,
      userId: AUTH.userId,
      carrierCode: AUTH.carrierCode,
      encrypted: AUTH.encrypted,
      userNum: AUTH.userNum,
      userToken: AUTH.userToken,
      blurMobile: '***'
    });

    var H = {
      userToken: AUTH.userToken,
      userId: AUTH.userId,
      userInfo: userInfo,
      sign: AUTH.sign,
      clientId: AUTH.clientId,
      l_c: AUTH.clientId,
      l_s: AUTH.l_s,
      l_t: AUTH.l_t,
      csessionId: AUTH.clientId + '0000DEAD-BEEF-4444-8888-000000000001'
    };
    var COOKIE = 'MIGU_UID=' + MIGU_UID + '; REMEMBER_CODE=' + MIGU_UID + '; login_deviceId=' + LOGIN_DEVICE_ID;

    var headers = $request.headers || {};
    for (var k in H) {
      headers[k] = H[k];
      var lk = k.toLowerCase();
      if (lk !== k && headers[lk] !== undefined) headers[lk] = H[k];
    }
    headers['Cookie'] = COOKIE;
    if (headers['cookie'] !== undefined) headers['cookie'] = COOKIE;

    console.log('MIGU_V2_HIT ' + url);
    notify('脚本命中', url.indexOf('play-pre.miguvideo.com') >= 0 ? '播放链接已改写' : '请求头已改写');
    $done({ url: url, headers: headers });
  } catch (e) {
    console.log('MIGU_V2_ERR ' + (e && e.message ? e.message : String(e)));
    notify('脚本报错', String(e && e.message ? e.message : e));
    $done({});
  }
})();
