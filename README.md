# Write File Server

A tiny Node.js web server application used to write data contents to files.

## Installation

Make sure that you have Node.js (ver. 8.x or later) installed. Then use npm to install the application.

```shell
npm install -g write-file-server
```

## Usage

### Starting the application

The following environment variables can be used the configure the application:

- WRITEFILESRV_HOST - The local network address at which the web server will be listening for HTTP connections. Default: **localhost**

- WRITEFILESRV_PORT - The TCP port to which the web server will be listening for HTTP connections. Default: **8889**
 
- WRITEFILESRV_OUTDIR - The directory to which the files will be written. Relative paths are relative to the application's
 install directory. Default: **./files**

To run the application, just issue the command:

```shell
writefilesrv
```

Alternatively, on a unix-like OS, one may use `nohup` to run the application and avoid it to block the terminal.

```shell
nohup writefilesrv &
```

### Sending contents

Once the server is running, use any HTTP client application to send POST requests to the <code>/files/<i>:filename</i></code> URL,
 where ***:filename*** should be replaced with the actual name of the file to be written.

Example:

```shell
curl -X POST --data-binary "This is my file's contents." -H "Content-Type: text/plain" http://localhost:8889/file/MyTestFile
```

> **Note**: if the file already exists, it will be overwritten.

As an option, to send binary contents to be written to files, one may choose to base64 encode the contents before
 posting it. In that case, a *Content-Type* HTTP header with the value `application/base64` should be sent.

```shell
curl -X POST --data-binary "VGhpcyBpcyBteSBmaWxlJ3MgY29udGVudHMu" -H "Content-Type: application/base64" http://localhost:8889/file/MyTestFile
```

> **Note**: if any other *Content-Type* value is used, or if no *Content-Type* header is present, the posted data will
 be written to the file as is.

## License

This Node.js application is released under the [MIT License](LICENSE). Feel free to fork, and modify!

Copyright © 2019, Blockchain of Things Inc.
