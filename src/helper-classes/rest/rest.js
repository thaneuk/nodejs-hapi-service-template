'use strict';


const ResponseError = require('./response.error.js');
let httpProxy = process.env.http_proxy || process.env.HTTP_PROXY || false;
let httpsProxy = process.env.https_proxy || process.env.HTTPS_PROXY || false;
let noProxy = process.env.no_proxy || process.env.NO_PROXY || false;


httpProxy = httpProxy ? httpProxy.trim() : httpProxy;
httpsProxy = httpsProxy ? httpsProxy.trim() : httpsProxy;
if (typeof noProxy === 'string') {
    noProxy = noProxy.split(',').map(h => h.trim()).filter(h => !!h);
}


/**
 * make JSON REST-ful calls
 * @class Rest
 * @summary usage: rest.get('http://www.google.com').then(console.info).catch(console.error);
 *                 rest.get('https://www.google.com', {verbose: true, parse: true, rejectUnauthorized: false, redirectLimit: 0}).then(console.info).catch(console.error);
 */
class Rest {
    constructor() {
        this.http = require('http');
        this.https = require('https');
        this.defaultCharset = 'utf-8';
        this.charsetRegex = /charset=(.*)$/i;
        this.colonRegex = /:/;
        this.defaultRedirectLimit = 2;
        /* set download limit to 50mb */
        this.responseDataBufferLengthLimit = 51250000000;
        this.noop = () => () => {
        };

        console.info(`REST: http proxy "${httpProxy ? httpProxy : 'none'}", https proxy "${httpsProxy ? httpsProxy : 'none'}", no proxy "${noProxy ? noProxy.join('", "') : 'none'}"`);
    }

    /**
     * method to make REST-ful API call
     * @param opts {Object} options for REST call
     * @param opts.url {string} url to send request to
     * @param opts.method {string} method to use with request
     * @param [opts.headers] {Object} request headers
     * @param [opts.qs] {Object} query string object of values
     * @param [opts.payload] {string} payload to send
     * @param [opts.proxy] {string} proxy host to be used for the request, default is env values
     * @param [opts.followRedirects] {boolean} follow redirect instructions in a response
     * @param [opts.redirectLimit] {number} limit on attempts to follow redirect instructions in a response
     * @param [opts.parse] {boolean} set to false to prevent parsing response
     * @param [opts.logging] {boolean} show logging for request
     * @param [opts.verbose] {boolean} expanded response including response information like headers and status codes
     * @param [opts.rejectUnauthorized] {boolean} reject unauthorised TLS certs
     * @param [opts.responseSizeLimit] {number} numeric byte limit for a payload (default 25mb), terminates request once hit, zero is no limit
     * @param [opts.onSent] {function} callback to execute on sent, even if response is an error (this will be executed before response and the return promise)
     * @returns {Promise<*>}
     */
    call(opts) {
        const {
            url,
            method = 'GET',
            headers = {},
            qs = {},
            payload,
            callStartTime = new Date().valueOf(),
            followRedirects = true,
            redirectLimit = this.defaultRedirectLimit,
            timeout = 0,
            rejectUnauthorized = true,
            parse = true,
            logging = false,
            verbose = false,
            responseSizeLimit = this.responseDataBufferLengthLimit,
            onSent = this.noop()
        } = opts;
        let {proxy = false} = opts;

        return new Promise((resolve, reject) => {
            if (url) {
            } else {
                reject(new Error('Rest.call: missing url'));
            }

            let {requestOptions, usingProxy} = {
                ...this.prepareRequestOptions({
                    url,
                    qs,
                    rejectUnauthorized,
                    proxy,
                    logging,
                    method
                })
            };

            if (logging) {
                console.info(`REST.call: Starting${usingProxy ? ` proxy ${requestOptions.host}:${requestOptions.port}` : ''} request to ${url}`);
            }

            const request = this[requestOptions.protocol.replace(this.colonRegex, '')].request(requestOptions, response => {
                const {statusCode} = response;
                const responseData = [];
                let responseDataBufferLength = 0;

                if (statusCode >= 300 && statusCode < 400 && response.headers.hasOwnProperty('location') && followRedirects) {
                    response.destroy();

                    if (logging) {
                        console.info(`REST.call: Call to "${url}" redirected to "${response.headers.location}"`);
                    }

                    return redirectLimit > 0 ? resolve(this.call({
                        url: response.headers.location,
                        method: statusCode === 303 ? 'GET' : method,
                        headers,
                        qs,
                        payload,
                        proxy,
                        callStartTime,
                        followRedirects: followRedirects,
                        redirectLimit: redirectLimit - 1,
                        timeout,
                        rejectUnauthorized,
                        logging,
                        verbose,
                        responseSizeLimit
                    })) : reject(new ResponseError(`REST.call: Exceeded redirect limit from "${url}"`, {
                        statusCode,
                        body: undefined,
                        headers: {...response.headers},
                        request,
                        response
                    }));
                }

                /* triggered on response data */
                response.on('data', data => {
                    responseData.push(data);
                    responseDataBufferLength += data.length;

                    /* test for exceeding payload limit */
                    if (responseSizeLimit && responseDataBufferLength > responseSizeLimit) {
                        resolve(new ResponseError(`413 Payload Too Large from "${url}"`, {
                            statusCode: 413,
                            body: undefined,
                            headers: {...response.headers},
                            request,
                            response
                        }));
                        response.destroy();
                    }
                });

                /* triggered when response is complete and closed */
                response.on('end', () => {
                    /* concat response buffer */
                    let body;
                    try {
                        body = Buffer.concat(responseData, responseDataBufferLength).toString(this.charset(response.headers));
                    } catch (e) {
                        /* in-case of unsupported encoding */
                        body = Buffer.concat(responseData, responseDataBufferLength).toString();
                    }

                    if (statusCode >= 200 && statusCode < 300) {
                        resolve(verbose ? {
                            method,
                            href: usingProxy ? requestOptions.path : `${requestOptions.protocol}//${requestOptions.host}${requestOptions.path}`,
                            duration: new Date().valueOf() - callStartTime,
                            statusCode,
                            headers: {...response.headers},
                            body: parse ? Rest.safeParse(body) : body,
                            size: responseDataBufferLength
                        } : parse ? Rest.safeParse(body) : body);
                    } else {
                        reject(new ResponseError(`${statusCode} when calling "${usingProxy ? requestOptions.path : `${requestOptions.protocol}//${requestOptions.host}:${requestOptions.port}${requestOptions.path}`}"`, {
                            statusCode,
                            body,
                            headers: {...response.headers},
                            request,
                            response
                        }));
                    }
                });

            }).on('error', error => {
                reject(new ResponseError(`REST: Error when calling "${usingProxy ? requestOptions.path : `${requestOptions.protocol}//${requestOptions.host}:${requestOptions.port}${requestOptions.path}`}" "${error.message}"`, {
                    statusCode: 0,
                    request,
                    error
                }));
            });

            if (timeout !== 0 && !isNaN(Number(timeout))) {
                request.setTimeout(Number(timeout), () => {
                    reject(new ResponseError(`REST: Timeout when calling "${usingProxy ? requestOptions.path : `${requestOptions.protocol}//${requestOptions.host}:${requestOptions.port}${requestOptions.path}`}"`, {
                        statusCode: 408,
                        request
                    }));
                });
            }

            /* add request headers to request prior to sending*/
            this.addHeaders(request, {...headers, ...requestOptions.headers});

            /* dispatch REST request with payload */
            request.end(Rest.checkPayload(payload), onSent);
        });
    }

    /**
     * short hand method for GET calls
     * @param url {string}
     * @param [opts] {{}}
     * @return Promise<*>
     */
    get(url, opts) {
        return this.call({...opts, method: 'GET', url});
    }

    /**
     * short hand method for POST calls
     * @param url {string}
     * @param [opts] {{}}
     * @return Promise<*>
     */
    post(url, opts) {
        return this.call({...opts, method: 'POST', url});
    }

    /**
     * short hand method for PUT calls
     * @param url {string}
     * @param [opts] {{}}
     * @return Promise<*>
     */
    put(url, opts) {
        return this.call({...opts, method: 'PUT', url});
    }

    /**
     * short hand method for DELETE calls
     * @param url {string}
     * @param [opts] {{}}
     * @return Promise<*>
     */
    del(url, opts) {
        return this.call({...opts, method: 'DELETE', url});
    }

    /**
     * prepare object with information for the request
     * @param method
     * @param url
     * @param qs
     * @param rejectUnauthorized
     * @param proxy
     * @param logging
     * @return {{requestOptions: {method: string, rejectUnauthorized: boolean, path: string, headers: {}, protocol: string, port: string, host: string}, usingProxy: boolean}}
     */
    prepareRequestOptions({method, url, qs, rejectUnauthorized, proxy, logging}) {
        let callURL = new URL(url);
        let usingProxy = false;

        /* append qs values to current request URL */
        this.addQueryStringParams(callURL.searchParams, qs);

        const requestOptions = {
            method,
            host: callURL.hostname,
            port: callURL.port,
            path: callURL.pathname + callURL.search,
            rejectUnauthorized: !!rejectUnauthorized,
            headers: {},
            protocol: callURL.protocol
        };

        /* check for proxy and modify callURL to use */
        if (proxy || ((requestOptions.protocol === 'http:' && httpProxy || requestOptions.protocol === 'https:' && httpsProxy) && !this.excludeFromProxy(callURL.hostname))) {

            proxy = proxy ? proxy : requestOptions.protocol === 'https:' ? httpsProxy : httpProxy;

            if (logging) {
                console.info(`REST.call: Proxy server in use ${proxy} for request to ${url}`);
            }

            usingProxy = true;

            const parsedProxy = new URL(proxy);

            requestOptions.host = parsedProxy.hostname;
            requestOptions.port = parsedProxy.port;

            requestOptions.headers.host = callURL.host;
            requestOptions.path = callURL.href;

            requestOptions.protocol = parsedProxy.protocol;
        }

        if (requestOptions.protocol !== 'http:' && requestOptions.protocol !== 'https:') {
            throw `Rest.call: Unmanageable or unable to resolve protocol [${requestOptions.protocol}] from url ${url}`;
        }

        return {requestOptions, usingProxy};
    }

    /**
     * add query string values to URL object
     * @param searchParams {{}}
     * @param qs {{}}
     */
    addQueryStringParams(searchParams, qs) {
        /* iterate query string object and add to URL */
        Object.keys(qs).forEach(id => searchParams.append(id, qs[id]));
    }

    /**
     * add headers to request
     * @param request {{}} HttpClientRequest
     * @param headers {{}} headers object
     */
    addHeaders(request, headers) {
        /* set default header for content-type */
        request.setHeader('content-type', 'application/json');

        Object.keys(headers).forEach(key => {
            request.setHeader(key.toString().toLowerCase(), headers[key]);
        });
    }

    /**
     * attempt to extract char encoding from response header
     * @param headers
     * @return {string|boolean | * | string | string}
     */
    charset(headers) {
        const encoding = headers.hasOwnProperty('content-type') && (headers['content-type'].match(this.charsetRegex) || '')[1] || this.defaultCharset;
        switch (encoding.toLowerCase()) {
            case 'us-ascii':
                return 'utf-8';
            case 'iso-8859-1':
                return 'latin1';
            default:
                return encoding || this.defaultCharset;
        }
    }

    excludeFromProxy(host) {
        return noProxy ? noProxy.some(noProxyHost => {
            if (noProxyHost === '*') {
                return true;
            }
            if (noProxyHost.includes('*.')) {
                return host.endsWith(noProxyHost.split('*.')[1]);
            }

            return host === noProxyHost;
        }) : false;
    }

    /**
     * safely parse string, return original string if parsing fails
     * @static
     * @param str {string}
     * @return {string|{}}
     */
    static safeParse(str) {
        try {
            return JSON.parse(str);
        } catch (e) {
            return str;
        }
    }

    /**
     * check payload, Buffer type is usable, if not string attempt to convert to string
     * @param data
     * @return {string|*}
     */
    static checkPayload(data) {
        if (data instanceof Buffer) {
            return data;
        }

        try {
            return JSON.stringify(data);
        } catch (e) {
            return data;
        }
    }
}


module.exports = new Rest();
