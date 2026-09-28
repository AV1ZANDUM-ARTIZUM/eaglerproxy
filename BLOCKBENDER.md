# Blockbender bridge

This setup uses two proxies:

```
EaglercraftX 1.8.9
        |
        v
EaglerProxy (WebSocket)
        |
        v
ViaProxy (Java TCP, 1.8.9 client side)
        |
        | protocol translation
        v
play.blockbender.com
```

The important reason for the extra ViaProxy layer is that this EaglerProxy speaks the
EaglercraftX 1.8.9 protocol and its vanilla side is Minecraft protocol 47 (1.8.9).
The Last Blockbender's official join instructions require Java Edition 1.16 or newer.
ViaProxy is designed to translate between supported Minecraft versions and supports
1.8.x clients connecting to modern Java servers.

## 1. Start ViaProxy

Use the official ViaProxy release or Docker image. Do not use an untrusted public
proxy for a Microsoft-authenticated account.

For Docker, ViaProxy documents:

```bash
docker run -it -v ./viaproxy-data:/app/run -p 25568:25568 ghcr.io/viaversion/viaproxy:latest
```

On first start, configure ViaProxy with:

- **Bind address:** `0.0.0.0:25568`
- **Target address:** `play.blockbender.com`
- **Target version:** the current Blockbender Java version (the server's exact current
  version should be selected in ViaProxy rather than guessing)
- **Client version:** `1.8.9`
- **Authentication:** use a legitimate Microsoft/Minecraft account if Blockbender
  requires online authentication.

ViaProxy's account setup stores authentication state locally. Never commit that
account/token data to this repository.

## 2. Start EaglerProxy

Build this repository normally:

```bash
npm install
npx tsc
node build/index.js
```

The new configuration defaults the Java upstream to:

```
127.0.0.1:25568
```

That means EaglerProxy sends its 1.8.9 Java connection to ViaProxy instead of
trying to speak a modern protocol itself.

You can override the endpoint without editing source:

```bash
EAGLER_UPSTREAM_HOST=127.0.0.1
EAGLER_UPSTREAM_PORT=25568
```

## 3. Connect from Eaglercraft

Connect your EaglercraftX 1.8.9 client to the WebSocket endpoint exposed by
EaglerProxy.

The flow is:

```
browser -> wss://YOUR-EAGLERPROXY-HOST
              |
              v
        EaglerProxy :8080
              |
              v
        ViaProxy :25568
              |
              v
      play.blockbender.com
```

## Important limitation

This repository does **not** pretend that changing an IP address makes 1.8.9
compatible with a modern server. EaglerProxy still speaks 1.8.9; ViaProxy is the
protocol-translation layer.

If Blockbender changes its required Java version or authentication requirements,
update the ViaProxy target configuration rather than changing the Eaglercraft
protocol constants in `src/meta.ts`.

## Security

Do not put Microsoft passwords, access tokens, or ViaProxy account save files in
GitHub. Keep the ViaProxy data directory private.
