# What the browser sees when a WebSocket upgrade fails

verified: 2026-10-18

Answers what a web page can learn when the server refuses a WebSocket upgrade with an HTTP status, such as 401 or 404.

## Knowledge

- The WebSocket API does not expose the HTTP status of a refused upgrade. The page gets an `error` event and then a `close` event with code 1006, whatever the server answered.
- A reconnecting client such as partysocket retries on that close, so a refused upgrade looks like a dropped connection.
- When the socket closes without ever having opened, the page requests over HTTP the resource the upgrade depends on, and acts on the status of that response to learn why the server refused the upgrade.

## Sources

- WHATWG WebSockets standard, "fail the WebSocket connection": https://websockets.spec.whatwg.org/
- Program design and test design sessions, 2026-10-18.
