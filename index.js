#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');

const host = process.env['WRITEFILESRV_HOST'] || 'localhost';
const port = process.env['WRITEFILESRV_PORT'] || 8889;
const outDir = path.resolve(__dirname, process.env['WRITEFILESRV_OUTDIR'] || './files');
const urlRex = /^\/file\/([^\/]+)/;

// Make sure that files output directory exists
try {
    fs.accessSync(outDir);
}
catch (err) {
    // Assume that directory does not yet exists and try to create it
    try {
        fs.mkdirSync(outDir, 0o755);
    }
    catch (err2) {
        console.error('Unable to create files output directory:', err2);
        process.exit(-1);
    }
}

let server;

try {
    // Create HTTP server
    server = http.createServer((req, res) => {
        let matchResult;

        if (req.method === 'POST' && (matchResult = urlRex.exec(req.url))) {
            try {
                // Write request payload to file
                const filename = matchResult[1];
                let readData = Buffer.from('');

                req.on('readable', () => {
                    try {
                        let body = req.read();

                        if (body) {
                            readData = Buffer.concat([readData, body]);
                        }
                        else {
                            if (req.headers['content-type'] === 'application/base64') {
                                readData = Buffer.from(readData.toString(), 'base64');
                            }

                            fs.writeFileSync(path.join(outDir, filename), readData);
                            res.end();
                        }
                    }
                    catch (err) {
                        console.error('Error writing output file:', err);
                        res.writeHead(500, 'Error processing request');
                        res.end();
                    }
                });
            }
            catch (err) {
                console.error('Error preparing to read request payload:', err);
                res.writeHead(500, 'Error processing request');
                res.end();
            }
        }
        else {
            res.writeHead(404);
            res.end();
        }
    });
}
catch (err) {
    console.error('Error creating HTTP server:', err);
    process.exit(-2);
}

server.on('error', (err) => {
    console.error('HTTP server error:', err);
    process.exit(-3);
});

server.listen({
    host: host,
    port: port
}, () => {
    console.log('Listening to port', port, 'at', host);
    console.log('Files will be written to:', outDir);
});
