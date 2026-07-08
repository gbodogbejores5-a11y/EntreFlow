self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => self.clients.claim());
self.addEventListener('fetch', e => e.respondWith(fetch(e.request).catch(() => new Response('Offline'))));

self.addEventListener('push', e => {
  let data = { title: 'EntreFlow', body: 'Notification' };
  try { data = e.data ? JSON.parse(e.data.text()) : data; } catch (_) {}
  e.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      data: { url: data.url || '/' }
    })
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
 אחדe.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      const url = e.notification.data?.url || '/';
      for (const c of windowClients) { if (c.url === url) return c.focus(); }
      return clients.openWindow(url);
    })
  );
});
