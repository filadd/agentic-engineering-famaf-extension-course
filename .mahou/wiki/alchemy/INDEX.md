# Alchemy

- [`local-tests`](local-tests.md): one stack per test file, no reset of local D1 and R2, fixtures with importFiles, reading and failing local mail, no Durable Object failures, the afterAll hang, the state each run leaves behind
- [`local-dev`](local-dev.md): the fixed API port behind Vite's proxy, routing /api WebSocket upgrades to the proxy, Worker construction at plan time, Durable Object binding names, drizzle-kit migration folders, the per-stage web origin
