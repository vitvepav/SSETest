# SSE issue

This example shows issues with running SSE in angular when optimization flag is set to true.

## Server

`node server.js`

## FE

`npm run-script serve-working`

`npm run-script serve-not-working`

Browser prints heartbeat every 5 sec for working example, for not working it prints it out after res.end() is sent or server is killed.
