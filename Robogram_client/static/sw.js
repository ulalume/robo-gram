importScripts('/_nuxt/workbox.dev.c21f51f2.js')

const workboxSW = new self.WorkboxSW({
  "cacheId": "my_nuxt_template",
  "clientsClaim": true,
  "directoryIndex": "/"
})

workboxSW.precache([
  {
    "url": "/_nuxt/app.8b46639fa859ae6a7d98.js",
    "revision": "048b87f6dda42a654a3097b3e3937012"
  },
  {
    "url": "/_nuxt/layouts/default.6299066a14a81a9fb024.js",
    "revision": "93851347ed2ba9fd5ebf4731b00e8dbc"
  },
  {
    "url": "/_nuxt/layouts/pattern/asideLeft.962168c8e717e5729f72.js",
    "revision": "6deeba445d49f2ddd02f93931dee2ee5"
  },
  {
    "url": "/_nuxt/layouts/pattern/standard.6763e2f8f5e52dd63e59.js",
    "revision": "cbca93c1208982de15aab22c0583e746"
  },
  {
    "url": "/_nuxt/manifest.a6ca35beb1b21c6714ce.js",
    "revision": "60e8718abd9b37263f346b334ff65bac"
  },
  {
    "url": "/_nuxt/pages/index.e5132636bbdec4220521.js",
    "revision": "9d0fd2ab47e160028da19d85baf504b7"
  },
  {
    "url": "/_nuxt/vendor.fb962e44d769d17f7e1c.js",
    "revision": "3a4b70d4d37b4ba0c5350e149700d721"
  }
])


workboxSW.router.registerRoute(new RegExp('/_nuxt/.*'), workboxSW.strategies.cacheFirst({}), 'GET')

workboxSW.router.registerRoute(new RegExp('/.*'), workboxSW.strategies.networkFirst({}), 'GET')

