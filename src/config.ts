// This folder contains options for both the bridge and networking adapter.
// Environment variables may override the Blockbender/bridge target so the same
// build can be used for normal 1.8.9 servers or through ViaProxy.

import { Config } from "./launcher_types.js";

const env = process.env;

const tlsKey = env.EAGLER_TLS_KEY;
const tlsCert = env.EAGLER_TLS_CERT;
const tlsEnabled = env.EAGLER_TLS === "true" || (!!tlsKey && !!tlsCert);

export const config: Config = {
  adapter: {
    name: "EaglerProxy",
    bindHost: env.EAGLER_BIND_HOST || "0.0.0.0",
    bindPort: Number(env.EAGLER_BIND_PORT || (tlsEnabled ? 443 : 8080)),
    maxConcurrentClients: Number(env.EAGLER_MAX_CLIENTS || 20),
    useNatives: env.EAGLER_USE_NATIVES !== "false",
    skinServer: {
      skinUrlWhitelist: undefined,
      cache: {
        useCache: true,
        folderName: "skinCache",
        skinCacheLifetime: 60 * 60 * 1000,
        skinCachePruneInterval: 10 * 60 * 1000,
      },
    },
    motd: "FORWARD",
    ratelimits: {
      lockout: 10,
      limits: {
        http: 100,
        ws: 100,
        motd: 100,
        skins: 1000,
        skinsIp: 10000,
        connect: 100,
      },
    },
    origins: {
      allowOfflineDownloads: true,
      originWhitelist: null,
      originBlacklist: null,
    },
    server: {
      // Blockbender bridge: EaglerProxy -> local ViaProxy -> Blockbender.
      // ViaProxy performs the Minecraft protocol translation.
      host: env.EAGLER_UPSTREAM_HOST || "127.0.0.1",
      port: Number(env.EAGLER_UPSTREAM_PORT || 25568),
    },
    tls: tlsEnabled && tlsKey && tlsCert
      ? {
          enabled: true,
          key: tlsKey,
          cert: tlsCert,
        }
      : undefined,
  },
};
