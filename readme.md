# Cloudflare IPs for NGINX

Grabs the list of IPs from [cloudflare](https://www.cloudflare.com/ips) and formats it into a valid conf file for nginx, placing it at `/nginx/conf/` for easy referencing.

Using this configuration file allows you to block all traffic through nginx that does not originate from cloudflare, or to block traffic through a single nginx server.

## Usage

Run `app.js` with `node`.

```bat
node app.js
```

This will place a file called `allow-cloudflare-only.conf` at `/nginx/conf/` alongside your `nginx.conf`.

Add the following line to your `nginx.conf`. See [nginx http access.](http://nginx.org/en/docs/http/ngx_http_access_module.html)

```txt
include     allow-cloudflare-only.conf;
```  

It is possible that cloudflare will update their IPs so make sure this is scheduled to run occasionally, every time it runs it will replace the existing file.

---

## Additional information

TODO: Add console feedback.

TODO: Implement different directories based on platform.

Currently this script supports:

* Windows
* Linux (Untested)

Missing platforms:

* aix
* darwin
* freebsd
* openbsd
* sunos

If you would like to add valid directories for other platforms or have tested this on linux and have feedback please submit a pull request <3

Note: If you modify the script to place the conf file in a different directory, or are referencing it from a different directory, you will have to reference it using an absolute path.

---

## Example Generated file

### **`allow-cloudflare-only.conf`**

```conf
# This file was automatically generated on: Sun Apr 17 2022 23:31:19 GMT-0400 (Eastern Daylight Time)
# https://www.cloudflare.com/ips

# User defined list
allow 192.168.50.0/24;

# IPv4
allow 173.245.48.0/20;
allow 103.21.244.0/22;
allow 103.22.200.0/22;
allow 103.31.4.0/22;
allow 141.101.64.0/18;
allow 108.162.192.0/18;
allow 190.93.240.0/20;
allow 188.114.96.0/20;
allow 197.234.240.0/22;
allow 198.41.128.0/17;
allow 162.158.0.0/15;
allow 104.16.0.0/13;
allow 104.24.0.0/14;
allow 172.64.0.0/13;
allow 131.0.72.0/22;

# IPv6
allow 2400:cb00::/32;
allow 2606:4700::/32;
allow 2803:f800::/32;
allow 2405:b500::/32;
allow 2405:8100::/32;
allow 2a06:98c0::/29;
allow 2c0f:f248::/32;

# Deny all remaining ips
deny all;
```
