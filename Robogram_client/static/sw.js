importScripts('/_nuxt/workbox.dev.c21f51f2.js')

const workboxSW = new self.WorkboxSW({
  "cacheId": "my_nuxt_template",
  "clientsClaim": true,
  "directoryIndex": "/"
})

workboxSW.precache([
  {
    "url": "/_nuxt/app.2f6b1aa980bbfcdf396d.js",
    "revision": "3d97906b8587bd24d8e8c76b93850363"
  },
  {
    "url": "/_nuxt/layouts/default.eda47263406dd4f6815f.js",
    "revision": "768ebd2ae8a1727584a23f47172d5695"
  },
  {
    "url": "/_nuxt/layouts/pattern/asideLeft.43c5bd73afe880d4ad15.js",
    "revision": "fea9e96ce0e8fb7bd723856e4e2431e7"
  },
  {
    "url": "/_nuxt/layouts/pattern/standard.11662144a90139e6ce26.js",
    "revision": "25bf329f31854ee08559b2185a2b684a"
  },
  {
    "url": "/_nuxt/manifest.6a49a85bf7adf6c1e4f1.js",
    "revision": "817751ad19aeee4fc41c5b2581babf6e"
  },
  {
    "url": "/_nuxt/pages/index.f90cb92b082bca99e389.js",
    "revision": "32cbbd938cf27cab761230b86c17bb5c"
  },
  {
    "url": "/_nuxt/vendor.fb962e44d769d17f7e1c.js",
    "revision": "3a4b70d4d37b4ba0c5350e149700d721"
  }
])


workboxSW.router.registerRoute(new RegExp('/_nuxt/.*'), workboxSW.strategies.cacheFirst({}), 'GET')

workboxSW.router.registerRoute(new RegExp('/.*'), workboxSW.strategies.networkFirst({}), 'GET')

