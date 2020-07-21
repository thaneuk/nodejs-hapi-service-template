'use strict';


class HealthController {
    #startTime = new Date().toISOString();

    constructor() {
    }

    get startTime() {
        return this.#startTime;
    }

    get response() {
        return {
            nodeVersion: process.version,
            processId: process.pid,
            platform: process.platform,
            started: this.startTime,
            uptime: process.uptime(),
            memory: process.memoryUsage()
        };
    }
}


module.exports = new HealthController();
