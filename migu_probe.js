(function () {
  var url = ($request && $request.url) || '';
  try {
    if (typeof $notification !== 'undefined' && $notification && typeof $notification.post === 'function') {
      $notification.post('咪咕Probe', '命中', url);
    } else if (typeof $notify === 'function') {
      $notify('咪咕Probe', '命中', url);
    }
  } catch (e) {}
  try { console.log('MIGU_PROBE_HIT ' + url); } catch (e) {}
  $done({});
})();
