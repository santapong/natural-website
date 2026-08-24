/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  turbopack: {
    resolveAlias: {
      "../libs/draco/draco_decoder.js": "./stubs/empty.js",
      "../libs/draco/draco_decoder.wasm": "./stubs/empty.js",
      "../libs/draco/draco_wasm_wrapper.js": "./stubs/empty.js",
      "../libs/draco/gltf/draco_decoder.wasm": "./stubs/empty.js",
      "../libs/draco/gltf/draco_wasm_wrapper.js": "./stubs/empty.js",
      "boolean_wasm_bg.wasm": "./stubs/empty.js",
    },
  },
};

module.exports = nextConfig;
