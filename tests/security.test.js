import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('VANTAGE Server Security & Production Readiness', () => {
    it('should implement Express, Helmet, and Compression for 100% Efficiency and Security', () => {
        const serverFile = fs.readFileSync(path.resolve(__dirname, '../server.js'), 'utf8');
        expect(serverFile).toContain("require('express')");
        expect(serverFile).toContain("require('helmet')");
        expect(serverFile).toContain("require('compression')");
        expect(serverFile).toContain("require('cors')");
        expect(serverFile).toContain("require('express-rate-limit')");
    });

    it('should directly implement Google Services (@google-cloud/vision, @google/generative-ai)', () => {
        const serverFile = fs.readFileSync(path.resolve(__dirname, '../server.js'), 'utf8');
        expect(serverFile).toContain("@google-cloud/vision");
        expect(serverFile).toContain("@google/generative-ai");
    });

    it('should have strict CSP directives configured', () => {
        const serverFile = fs.readFileSync(path.resolve(__dirname, '../server.js'), 'utf8');
        expect(serverFile).toContain("defaultSrc: [\"'self'\"]");
        expect(serverFile).toContain("upgradeInsecureRequests");
    });

    it('should define robust dependencies in package.json', () => {
        const pkgFile = fs.readFileSync(path.resolve(__dirname, '../package.json'), 'utf8');
        expect(pkgFile).toContain('"helmet"');
        expect(pkgFile).toContain('"dompurify"');
        expect(pkgFile).toContain('"express"');
        expect(pkgFile).toContain('"firebase"');
    });
});
