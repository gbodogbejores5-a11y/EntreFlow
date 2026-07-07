self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => e.respondWith(fetch(e.request).catch(() => new Response('Offline'))));
self.addEventListener('push', e => {
  let data = { title: 'EntreFlow', body: 'Notification' };
  try { data = e.data ? JSON.parse(e.data.text()) : data; } catch(_) {}
  e.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      vibrate: [200, 100, 200],
      tag: 'entreflow-notif',
      renotify: false,
      actions: [{ action: 'view', title: 'Ouvrir' }]
    })
  );
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clients => {
      if (clients[0]) return clients[0].focus();
      return self.clients.openWindow('/');
    })
  );
});
