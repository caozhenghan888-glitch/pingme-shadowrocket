(function () {
  var title = 'PingMeProbe';
  var body = 'queryBalanceAndBonus 命中 ' + new Date().toISOString();
  try {
    if (typeof $notification !== 'undefined' && $notification && typeof $notification.post === 'function') {
      $notification.post(title, 'hit', body);
    } else if (typeof $notify === 'function') {
      $notify(title, 'hit', body);
    }
  } catch (e) {}
  try { console.log('PINGME_PROBE_HIT ' + body); } catch (e) {}
  if (typeof $done === 'function') $done({});
})();
