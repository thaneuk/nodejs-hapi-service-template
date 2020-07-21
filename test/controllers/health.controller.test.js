'use strict';


describe('health component is available and usable', () => {
    const health = require('../../src/controllers/health.controller.js');

    it('should return start time in string format from get startTime method', () => {
        const startTime = health.startTime;

        expect(startTime).toBeString();
        expect(new Date(startTime)).toBeDate();
    });

    it('get health.response returns expected value', () => {
        expect(health.response).toBeObject();
        expect(health.response).toHaveProperty('nodeVersion');
        expect(health.response.nodeVersion).toBeString();
        expect(health.response).toHaveProperty('processId');
        expect(health.response.processId).toBeNumber();
        expect(health.response).toHaveProperty('platform');
        expect(health.response.platform).toBeString();
        expect(health.response).toHaveProperty('started');
        expect(health.response.started).toBeString();
        expect(health.response).toHaveProperty('uptime');
        expect(health.response.uptime).toBeNumber();
        expect(health.response).toHaveProperty('memory');
        expect(health.response.memory).toBeObject();
    });
});
