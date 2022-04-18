const https = require('https');
const fs = require('fs');

const IPLIST_URL = "https://www.cloudflare.com/ips";

const OUTPUT_DIR = GetOutputDir();
const OUTPUT_NAME = "allow-cloudflare-only.conf";

const CUSTOM_ALLOW_LIST = ["192.168.50.0/24"];
const IPv4_ALLOW_LIST = [];
const IPv6_ALLOW_LIST = [];

if (!fs.existsSync(OUTPUT_DIR)){
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}
const file = fs.createWriteStream(OUTPUT_DIR + OUTPUT_NAME);

let x = 0;

https.get(IPLIST_URL + "-v4", function(response){ 
    ParseResponse(response, IPv4_ALLOW_LIST)
});

https.get(IPLIST_URL + "-v6", function(response){ 
    ParseResponse(response, IPv6_ALLOW_LIST)
});

function ParseResponse(res, list){
    const { statusCode } = res;
    const contentType = res.headers['content-type'];

    let error;
    // Any 2xx status code signals a successful response but
    // here we're only checking for 200.
    if (statusCode !== 200) {
        error = new Error('Request Failed.\n' + `Status Code: ${statusCode}`);
    }

    if (error) {
        console.error(error.message);
        // Consume response data to free up memory
        res.resume();
        return;
    }

    res.setEncoding('utf8');
    let rawData = '';
    res.on('data', (chunk) => { rawData += chunk; });
    res.on('end', () => {
        ParseList(rawData, list);
    });
}

function GetOutputDir(){
    switch(process.platform){
        case 'aix':
            throw "Unsupported platform"; 
            return '';
        case 'darwin':
            throw "Unsupported platform"; 
            return '';
        case 'freebsd':
            throw "Unsupported platform"; 
            return '';
        case 'linux':
            return '/etc/nginx/conf/';
        case 'openbsd':
            throw "Unsupported platform"; 
            return '';
        case 'sunos':
            throw "Unsupported platform"; 
            return '';
        case 'win32':
            return 'C:/nginx/conf/';
        default:
            throw "Unexpected platform"; 
    }
}

function ParseList(rawData, list){
    x++;
    //parsing code goes here
    arry = rawData.split('\n');
    arry.forEach(ip => {
        list.push(ip);
    });
    // ----
    WriteFile();
}

function WriteFile(){
    if ( x < 2 ) return;

    file.write("# This file was automatically generated on: " + new Date() + "\n");
    file.write("# " + IPLIST_URL + "\n");

    file.write("\n# User defined list" + "\n");
    CUSTOM_ALLOW_LIST.forEach(ip => {
        file.write("allow " + ip + ";\n");
    });

    file.write("\n# IPv4" + "\n");
    IPv4_ALLOW_LIST.forEach(ip => {
        file.write("allow " + ip + ";\n");
    });

    file.write("\n# IPv6" + "\n");
    IPv6_ALLOW_LIST.forEach(ip => {
        file.write("allow " + ip + ";\n");
    });

    file.write("\n# Deny all remaining ips" + "\n");
    file.write("deny all;");

    file.end();
}



