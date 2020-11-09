---
id: http
title: HTTP Server
sidebar_label: HTTP
---

HTTP server is the core part of any back-end framework, including Silvie. It uses an instance of 
[Express](https://expressjs.com) as its underlying web server.

## Port Decision
Silvie goes through the following steps to choose a port number to run its HTTP server. 

1- Look for the `--port` in command line args
2- Look for the `-p` in command line args
3- Look for the `APP_PORT` in `.env` file
4- Look for the port number in HTTP configuration file

If port number could not be found in any of these steps, Silvie will take `5000` as its fallback port number.

## HTTPS
You can run your HTTP server on HTTPS protocol. Silvie uses Node.js default HTTPS module to serve the application over 
HTTPS. All you need to do is to enable **SSL** and provide **Certificate Files** in the 
[SSL part of your HTTP Configuration](configuration.md#ssl).

## HTTP/2
HTTP/2 has a lot to offer. It speeds the content serving up, by responding to multiple requests in parallel in a single
connection, compressing the headers, etc. Silvie is using [SPDY](https://www.npmjs.com/package/spdy) as the HTTP/2 
server. All you need to do is enabling it by setting the `http2` option to `true` in your HTTP configuration.

:::tip
Please note that you need to configure SSL, in order to make HTTP/2 work as expected.
:::

## CORS
## Cookie
## Session
## File Uploads
## Static Assets
## Request Bodies
