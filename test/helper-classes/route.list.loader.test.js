'use strict';


describe('route list loader loads route list', () => {

    let routeFiles;

    beforeEach(() => {
        routeFiles = require('../../src/helper-classes/route.list.loader.js');
    });

    it('should return a promise', () => {
        expect(routeFiles).toResolve();
    });

    describe('routes should be loaded', () => {

        it('should return a list of route definitions in the promise', async () => {
            const fileList = await routeFiles;

            expect(fileList).toBeArray();
            expect(fileList.length).toBeGreaterThan(0);
        });

        it('each entry should have minimal properties for a route', async () => {
            const fileList = await routeFiles;

            fileList.forEach((route, i) => {
                expect(route).toBeObject();
                expect(route).toHaveProperty('method');
                expect(route.method).toBeString();
                expect(route).toHaveProperty('path');
                expect(route.path).toBeString();
                expect(route).toHaveProperty('handler');
                expect(route.handler).toBeFunction();
            });
        });
    });

});
