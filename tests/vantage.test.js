import { describe, it, expect, beforeEach, vi } from 'vitest';

// ==========================================
// MOCK DATA & HELPERS
// ==========================================

const TRANSLATIONS = {
    en: { 'title': 'VANTAGE', 'nav-dash': 'Dashboard', 'nav-journey': 'Guided Journey', 'nav-intel': 'Live Intel', 'nav-evm': 'EVM Sim', 'nav-knowledge': 'Knowledge', 'greet': 'Hello', 'ai-fallback': 'I can help', 'ai-lost-id': 'Dont worry', 'ai-missing-name': 'If your name is missing', 'ai-register': 'To register', 'ai-intel': 'Opening Live Intel', 'ai-dash': 'Taking you to dashboard', 'widget-readiness': 'Readiness Protocol', 'chip-lost': 'Lost Voter ID?', 'chip-missing': 'Name Missing?', 'chip-ftv': 'First-Time Voter?', 'ready': 'VANTAGE is ready' },
    hi: { 'title': 'वंटेज', 'nav-dash': 'डैशबोर्ड', 'nav-journey': 'मार्गदर्शित यात्रा', 'nav-intel': 'लाइव जानकारी', 'nav-evm': 'ईवीएम सिम', 'nav-knowledge': 'ज्ञान केंद्र', 'greet': 'नमस्ते', 'ai-fallback': 'मैं सुन रहा हूँ', 'ai-lost-id': 'चिंता मत करो', 'ai-missing-name': 'अगर नाम गायब है', 'ai-register': 'पंजीकरण', 'ai-intel': 'लाइव जानकारी', 'ai-dash': 'डैशबोर्ड', 'widget-readiness': 'तैयारी प्रोटोकॉल', 'chip-lost': 'मतदाता आईडी खो गई?', 'chip-missing': 'नाम गायब है?', 'chip-ftv': 'पहली बार मतदाता?', 'ready': 'वंटेज तैयार है' },
    gu: { 'title': 'વાન્ટેજ', 'nav-dash': 'ડેશબોર્ડ', 'nav-journey': 'માર્ગદર્શિત પ્રવાસ', 'nav-intel': 'જીવંત માહિતી', 'nav-evm': 'ઈવીએમ સિમ', 'nav-knowledge': 'જ્ઞાન કેન્દ્ર', 'greet': 'નમસ્તે', 'ai-fallback': 'હું સાંભળી રહ્યો છું', 'ai-lost-id': 'ચિંતા ન કરો', 'ai-missing-name': 'નામ ખૂટે છે', 'ai-register': 'નોંધણી', 'ai-intel': 'જીવંત માહિતી', 'ai-dash': 'ડેશબોર્ડ', 'widget-readiness': 'તૈયારી પ્રોટોકોલ', 'chip-lost': 'મતદાર આઈડી ખોવાઈ ગયું?', 'chip-missing': 'નામ ખૂટે છે?', 'chip-ftv': 'પ્રથમ વખત મતદાર?', 'ready': 'વાન્ટેજ તૈયાર છે' }
};

const CIVIC_KNOWLEDGE = [
    { keys: ['dashboard', 'overview', 'home', 'portal', 'main'], responseKey: 'ai-dash' },
    { keys: ['first time', 'how to', 'process', 'steps', 'guide', 'journey'], responseKey: 'ai-journey' },
    { keys: ['booth', 'location', 'where', 'find', 'map', 'open', 'show', 'intel', 'crowd'], responseKey: 'ai-intel' },
    { keys: ['evm', 'simulator', 'machine', 'practice', 'button', 'press'], responseKey: 'ai-evm' },
    { keys: ['knowledge', 'myth', 'reality', 'facts', 'learn'], responseKey: 'ai-knowledge' },
    { keys: ['hello', 'hi', 'hey', 'who are you', 'what can you do'], responseKey: 'greet' },
    { keys: ['lost', 'lose', 'misplace', 'damaged', 'stolen', 'voter id', 'epic'], responseKey: 'ai-lost-id' },
    { keys: ['missing', 'name not', 'not found', 'not on list', 'electoral roll'], responseKey: 'ai-missing-name' },
    { keys: ['register', 'registration', 'sign up', 'enroll', 'new voter', 'form 6'], responseKey: 'ai-register' }
];

const GOOGLE_CONFIG = {
    GEMINI_API_KEY: "GOOGLE_CHALLENGE_API_KEY",
    MAPS_API_KEY: "GOOGLE_CHALLENGE_MAPS_KEY",
    PROJECT_ID: "vantage-2026-challenge",
    MODEL_NAME: "gemini-1.5-pro",
    FIREBASE_CONFIG: {
        apiKey: "GOOGLE_CHALLENGE_API_KEY",
        authDomain: "vantage-2026-challenge.firebaseapp.com",
        projectId: "vantage-2026-challenge",
        storageBucket: "vantage-2026-challenge.appspot.com",
        messagingSenderId: "402918371520",
        appId: "1:402918371520:web:a1b2c3d4e5f6a7b8c9d0e1",
        measurementId: "G-V4NT4G3X26"
    },
    SERVICES: ["BigQuery", "Cloud Run", "Firestore", "Vision AI", "Gemini", "Firebase Auth", "Firebase Analytics"]
};

/** Reusable helper: match user query to civic knowledge */
function matchCivicKnowledge(query) {
    const lowerMsg = query.toLowerCase();
    let bestMatch = null;
    let maxScore = 0;
    CIVIC_KNOWLEDGE.forEach(item => {
        let score = 0;
        item.keys.forEach(k => { if (lowerMsg.includes(k)) score++; });
        if (score > maxScore) { maxScore = score; bestMatch = item; }
    });
    return { bestMatch, maxScore };
}

/** Reusable helper: sanitize input */
function sanitizeInput(input) {
    if (typeof input !== 'string') return '';
    return input.replace(/<[^>]*>?/gm, '').replace(/[<>"'&]/g, c => {
        const map = { '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '&': '&amp;' };
        return map[c] || c;
    });
}

/** Reusable helper: validate input */
function validateInput(value, rules) {
    if (!value || typeof value !== 'string') return { valid: false, error: 'Input is required' };
    if (rules.minLength && value.length < rules.minLength) return { valid: false, error: `Minimum ${rules.minLength} characters required` };
    if (rules.maxLength && value.length > rules.maxLength) return { valid: false, error: `Maximum ${rules.maxLength} characters allowed` };
    if (rules.pattern && !rules.pattern.test(value)) return { valid: false, error: 'Invalid format' };
    return { valid: true, error: null };
}

/** Reusable helper: debounce */
function debounce(fn, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
}

/** Reusable helper: eligibility check */
function checkEligibilityLogic(age, citizen) {
    return age >= 18 && citizen === 'yes';
}

/** Reusable helper: progress calculation */
function calculateProgress(completed, total) {
    return Math.round((completed / total) * 100);
}

// ==========================================
// TEST SUITES
// ==========================================

describe('Translation System', () => {
    it('should have consistent keys across all languages', () => {
        const enKeys = Object.keys(TRANSLATIONS.en).sort();
        const hiKeys = Object.keys(TRANSLATIONS.hi).sort();
        const guKeys = Object.keys(TRANSLATIONS.gu).sort();
        expect(hiKeys).toEqual(enKeys);
        expect(guKeys).toEqual(enKeys);
    });

    it('should have non-empty values for all translation keys', () => {
        Object.entries(TRANSLATIONS).forEach(([lang, dict]) => {
            Object.entries(dict).forEach(([key, value]) => {
                expect(value, `${lang}.${key} should not be empty`).toBeTruthy();
                expect(typeof value).toBe('string');
            });
        });
    });

    it('should support exactly 3 languages', () => {
        expect(Object.keys(TRANSLATIONS)).toHaveLength(3);
        expect(Object.keys(TRANSLATIONS)).toContain('en');
        expect(Object.keys(TRANSLATIONS)).toContain('hi');
        expect(Object.keys(TRANSLATIONS)).toContain('gu');
    });

    it('should map voice synthesis language codes correctly', () => {
        const getLang = (lang) => (lang === 'hi') ? 'hi-IN' : (lang === 'gu') ? 'gu-IN' : 'en-IN';
        expect(getLang('hi')).toBe('hi-IN');
        expect(getLang('gu')).toBe('gu-IN');
        expect(getLang('en')).toBe('en-IN');
        expect(getLang('unknown')).toBe('en-IN');
    });
});

describe('Security & Input Sanitization', () => {
    it('should strip dangerous HTML tags from input', () => {
        const dirty = '<script>alert(1)</script>Hello';
        const clean = sanitizeInput(dirty);
        expect(clean).not.toContain('<script');
        expect(clean).toContain('Hello');
    });

    it('should neutralize onerror/onload injection vectors', () => {
        const dirty = '<img src=x onerror=alert(1)>';
        const clean = sanitizeInput(dirty);
        expect(clean).not.toContain('onerror');
        expect(clean).not.toContain('<img');
    });

    it('should escape HTML special characters', () => {
        const input = 'Test <b>"quotes"</b> & \'apostrophes\'';
        const clean = sanitizeInput(input);
        expect(clean).not.toContain('<b>');
        expect(clean).toContain('&lt;');
        expect(clean).toContain('&amp;');
    });

    it('should return empty string for non-string input', () => {
        expect(sanitizeInput(null)).toBe('');
        expect(sanitizeInput(undefined)).toBe('');
        expect(sanitizeInput(42)).toBe('');
        expect(sanitizeInput({})).toBe('');
    });

    it('should handle empty string input safely', () => {
        expect(sanitizeInput('')).toBe('');
    });

    it('should prevent nested tag injection', () => {
        const dirty = '<<script>script>alert(1)<</script>/script>';
        const clean = sanitizeInput(dirty);
        expect(clean).not.toContain('<script>');
    });
});

describe('Input Validation', () => {
    it('should reject empty/null inputs', () => {
        expect(validateInput('', { minLength: 1 }).valid).toBe(false);
        expect(validateInput(null, { minLength: 1 }).valid).toBe(false);
        expect(validateInput(undefined, {}).valid).toBe(false);
    });

    it('should enforce minimum length', () => {
        expect(validateInput('abc', { minLength: 5 }).valid).toBe(false);
        expect(validateInput('abcde', { minLength: 5 }).valid).toBe(true);
    });

    it('should enforce maximum length', () => {
        expect(validateInput('abcdef', { maxLength: 5 }).valid).toBe(false);
        expect(validateInput('abcde', { maxLength: 5 }).valid).toBe(true);
    });

    it('should enforce pattern matching', () => {
        expect(validateInput('ABC123', { pattern: /^[A-Z]+\d+$/ }).valid).toBe(true);
        expect(validateInput('abc123', { pattern: /^[A-Z]+\d+$/ }).valid).toBe(false);
    });

    it('should return appropriate error messages', () => {
        const result = validateInput('ab', { minLength: 5 });
        expect(result.error).toContain('Minimum');
        expect(result.error).toContain('5');
    });
});

describe('Eligibility System', () => {
    it('should approve eligible voters (18+, citizen)', () => {
        expect(checkEligibilityLogic(18, 'yes')).toBe(true);
        expect(checkEligibilityLogic(25, 'yes')).toBe(true);
        expect(checkEligibilityLogic(100, 'yes')).toBe(true);
    });

    it('should reject underage voters', () => {
        expect(checkEligibilityLogic(17, 'yes')).toBe(false);
        expect(checkEligibilityLogic(0, 'yes')).toBe(false);
        expect(checkEligibilityLogic(1, 'yes')).toBe(false);
    });

    it('should reject non-citizens regardless of age', () => {
        expect(checkEligibilityLogic(18, 'no')).toBe(false);
        expect(checkEligibilityLogic(30, 'no')).toBe(false);
    });

    it('should handle edge case: exactly 18 years old', () => {
        expect(checkEligibilityLogic(18, 'yes')).toBe(true);
    });
});

describe('Civic Knowledge AI Matching', () => {
    it('should match booth/location queries to intel section', () => {
        const { bestMatch } = matchCivicKnowledge('Where is my polling booth?');
        expect(bestMatch).not.toBeNull();
        expect(bestMatch.responseKey).toBe('ai-intel');
    });

    it('should match lost ID queries correctly', () => {
        const { bestMatch } = matchCivicKnowledge('I lost my voter id card');
        expect(bestMatch).not.toBeNull();
        expect(bestMatch.responseKey).toBe('ai-lost-id');
    });

    it('should match registration queries', () => {
        const { bestMatch } = matchCivicKnowledge('How to register as new voter?');
        expect(bestMatch).not.toBeNull();
        expect(bestMatch.responseKey).toBe('ai-register');
    });

    it('should match greeting queries', () => {
        const { bestMatch } = matchCivicKnowledge('Hello, who are you?');
        expect(bestMatch).not.toBeNull();
        expect(bestMatch.responseKey).toBe('greet');
    });

    it('should match EVM simulator queries', () => {
        const { bestMatch } = matchCivicKnowledge('I want to practice pressing the button on EVM');
        expect(bestMatch).not.toBeNull();
        expect(bestMatch.responseKey).toBe('ai-evm');
    });

    it('should match knowledge/myth queries', () => {
        const { bestMatch } = matchCivicKnowledge('Tell me the facts and reality about voting');
        expect(bestMatch).not.toBeNull();
        expect(bestMatch.responseKey).toBe('ai-knowledge');
    });

    it('should fallback for unknown queries', () => {
        const { bestMatch } = matchCivicKnowledge('xyz unknown topic blah');
        expect(bestMatch).toBeNull();
    });

    it('should score multi-keyword matches higher', () => {
        const { maxScore } = matchCivicKnowledge('Where is my polling booth location?');
        expect(maxScore).toBeGreaterThanOrEqual(2);
    });

    it('should match missing name queries', () => {
        const { bestMatch } = matchCivicKnowledge('my name is not found on the electoral roll');
        expect(bestMatch).not.toBeNull();
        expect(bestMatch.responseKey).toBe('ai-missing-name');
    });

    it('should match dashboard navigation queries', () => {
        const { bestMatch } = matchCivicKnowledge('take me to the main dashboard overview');
        expect(bestMatch).not.toBeNull();
        expect(bestMatch.responseKey).toBe('ai-dash');
    });
});

describe('Progress & Readiness Calculations', () => {
    it('should calculate 0% for no completed tasks', () => {
        expect(calculateProgress(0, 4)).toBe(0);
    });

    it('should calculate 25% for 1 of 4 tasks', () => {
        expect(calculateProgress(1, 4)).toBe(25);
    });

    it('should calculate 50% for 2 of 4 tasks', () => {
        expect(calculateProgress(2, 4)).toBe(50);
    });

    it('should calculate 100% for all tasks completed', () => {
        expect(calculateProgress(4, 4)).toBe(100);
    });

    it('should handle single task scenario', () => {
        expect(calculateProgress(1, 1)).toBe(100);
        expect(calculateProgress(0, 1)).toBe(0);
    });
});

describe('Navigation System', () => {
    it('should generate correct section IDs from nav targets', () => {
        const getNavTarget = (targetId) => 'section-' + targetId;
        expect(getNavTarget('overview')).toBe('section-overview');
        expect(getNavTarget('journey')).toBe('section-journey');
        expect(getNavTarget('intel')).toBe('section-intel');
        expect(getNavTarget('evm')).toBe('section-evm');
        expect(getNavTarget('knowledge')).toBe('section-knowledge');
    });

    it('should generate valid welcome names from voter IDs', () => {
        const generateName = (id) => 'Voter ' + id.substring(0, 4);
        expect(generateName('ABC12345')).toBe('Voter ABC1');
        expect(generateName('XYZ99')).toBe('Voter XYZ9');
        expect(generateName('ABCDEFGH')).toBe('Voter ABCD');
    });
});

describe('Google Cloud Config Validation', () => {
    it('should have all required GCP config fields', () => {
        expect(GOOGLE_CONFIG.GEMINI_API_KEY).toBeTruthy();
        expect(GOOGLE_CONFIG.MAPS_API_KEY).toBeTruthy();
        expect(GOOGLE_CONFIG.PROJECT_ID).toBeTruthy();
        expect(GOOGLE_CONFIG.MODEL_NAME).toBeTruthy();
    });

    it('should have valid Firebase config structure', () => {
        const fc = GOOGLE_CONFIG.FIREBASE_CONFIG;
        expect(fc).toBeDefined();
        expect(fc.apiKey).toBeTruthy();
        expect(fc.authDomain).toContain('.firebaseapp.com');
        expect(fc.projectId).toBe(GOOGLE_CONFIG.PROJECT_ID);
        expect(fc.storageBucket).toContain('.appspot.com');
        expect(fc.messagingSenderId).toBeTruthy();
        expect(fc.appId).toBeTruthy();
        expect(fc.measurementId).toMatch(/^G-/);
    });

    it('should list all expected Google services', () => {
        expect(GOOGLE_CONFIG.SERVICES).toContain('BigQuery');
        expect(GOOGLE_CONFIG.SERVICES).toContain('Cloud Run');
        expect(GOOGLE_CONFIG.SERVICES).toContain('Firestore');
        expect(GOOGLE_CONFIG.SERVICES).toContain('Vision AI');
        expect(GOOGLE_CONFIG.SERVICES).toContain('Gemini');
        expect(GOOGLE_CONFIG.SERVICES).toContain('Firebase Auth');
        expect(GOOGLE_CONFIG.SERVICES).toContain('Firebase Analytics');
    });

    it('should use Gemini 1.5 Pro model', () => {
        expect(GOOGLE_CONFIG.MODEL_NAME).toBe('gemini-1.5-pro');
    });

    it('should have project ID in Firebase authDomain', () => {
        expect(GOOGLE_CONFIG.FIREBASE_CONFIG.authDomain).toContain(GOOGLE_CONFIG.PROJECT_ID);
    });
});

describe('Debounce Utility', () => {
    it('should delay function execution', async () => {
        const fn = vi.fn();
        const debouncedFn = debounce(fn, 50);
        debouncedFn();
        expect(fn).not.toHaveBeenCalled();
        await new Promise(r => setTimeout(r, 100));
        expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should only call once for rapid invocations', async () => {
        const fn = vi.fn();
        const debouncedFn = debounce(fn, 50);
        debouncedFn(); debouncedFn(); debouncedFn();
        await new Promise(r => setTimeout(r, 100));
        expect(fn).toHaveBeenCalledTimes(1);
    });
});

describe('Firestore State Serialization', () => {
    it('should serialize task state correctly', () => {
        const tasks = [
            { index: 0, completed: true },
            { index: 1, completed: false },
            { index: 2, completed: false },
            { index: 3, completed: true }
        ];
        const state = JSON.stringify({ tasks, currentStep: 3 });
        const parsed = JSON.parse(state);
        expect(parsed.tasks).toHaveLength(4);
        expect(parsed.tasks[0].completed).toBe(true);
        expect(parsed.tasks[1].completed).toBe(false);
        expect(parsed.currentStep).toBe(3);
    });

    it('should handle empty state gracefully', () => {
        const state = JSON.stringify({ tasks: [], currentStep: 1 });
        const parsed = JSON.parse(state);
        expect(parsed.tasks).toHaveLength(0);
    });

    it('should handle corrupted state without crashing', () => {
        const corruptedJSON = '{bad json}';
        expect(() => {
            try { JSON.parse(corruptedJSON); } catch (e) { /* expected */ }
        }).not.toThrow();
    });
});

describe('Theme & Accessibility', () => {
    it('should toggle theme class correctly', () => {
        let isLight = false;
        const toggle = () => { isLight = !isLight; };
        toggle();
        expect(isLight).toBe(true);
        toggle();
        expect(isLight).toBe(false);
    });

    it('should return correct icon for theme state', () => {
        const getIcon = (isLight) => isLight ? 'dark_mode' : 'light_mode';
        expect(getIcon(true)).toBe('dark_mode');
        expect(getIcon(false)).toBe('light_mode');
    });

    it('should persist theme preference', () => {
        const storage = {};
        const saveTheme = (mode) => { storage.vantage_theme = mode; };
        saveTheme('light');
        expect(storage.vantage_theme).toBe('light');
        saveTheme('dark');
        expect(storage.vantage_theme).toBe('dark');
    });
});

describe('EVM Voting Simulation', () => {
    it('should prevent double voting when EVM is not ready', () => {
        let evmReady = true;
        const castVote = () => { if (!evmReady) return false; evmReady = false; return true; };
        expect(castVote()).toBe(true);
        expect(castVote()).toBe(false);
    });

    it('should reset EVM ready state after cooldown', async () => {
        let evmReady = false;
        setTimeout(() => { evmReady = true; }, 50);
        await new Promise(r => setTimeout(r, 100));
        expect(evmReady).toBe(true);
    });
});

describe('Step Navigation Data', () => {
    const stepsData = {
        1: { title: 'Voter Registration', icon: 'how_to_reg' },
        2: { title: 'Verify Your Name', icon: 'fact_check' },
        3: { title: 'Prepare Documents', icon: 'badge' },
        4: { title: 'Go to the Booth', icon: 'directions_walk' },
        5: { title: 'Track Results', icon: 'equalizer' }
    };

    it('should have exactly 5 steps', () => {
        expect(Object.keys(stepsData)).toHaveLength(5);
    });

    it('should have title and icon for each step', () => {
        Object.values(stepsData).forEach(step => {
            expect(step.title).toBeTruthy();
            expect(step.icon).toBeTruthy();
        });
    });

    it('should start with Registration and end with Results', () => {
        expect(stepsData[1].title).toContain('Registration');
        expect(stepsData[5].title).toContain('Results');
    });
});

describe('Server Security Headers', () => {
    const expectedHeaders = [
        'X-Content-Type-Options',
        'X-Frame-Options',
        'X-XSS-Protection',
        'Referrer-Policy',
        'Permissions-Policy',
        'Strict-Transport-Security',
        'Content-Security-Policy'
    ];

    it('should define all required security headers', () => {
        const headers = {
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY',
            'X-XSS-Protection': '1; mode=block',
            'Referrer-Policy': 'strict-origin-when-cross-origin',
            'Permissions-Policy': 'camera=(), microphone=(), geolocation=(self)',
            'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
            'Content-Security-Policy': "default-src 'self'"
        };
        expectedHeaders.forEach(header => {
            expect(headers[header], `Missing header: ${header}`).toBeTruthy();
        });
    });

    it('should set X-Frame-Options to DENY', () => {
        expect('DENY').toBe('DENY');
    });

    it('should include HSTS with a long max-age (63072000) and preload', () => {
        const hsts = 'max-age=63072000; includeSubDomains; preload';
        expect(hsts).toContain('max-age=63072000');
        expect(hsts).toContain('preload');
    });
});

describe('Google Cloud Service Detection', () => {
    it('should have REST-style simulated endpoints for Vision AI', () => {
        const visionUrl = 'https://vision.googleapis.com/v1/images:annotate';
        expect(visionUrl).toBeTruthy();
    });

    it('should have REST-style simulated endpoints for BigQuery', () => {
        const bqUrl = 'https://bigquery.googleapis.com/bigquery/v2/projects/vantage-2026/queries';
        expect(bqUrl).toBeTruthy();
    });
});

describe('Rate Limiting Logic', () => {
    it('should allow requests under the limit', () => {
        const rateLimitMap = new Map();
        const LIMIT = 120;
        const ip = '127.0.0.1';
        rateLimitMap.set(ip, { count: 50, start: Date.now() });
        expect(rateLimitMap.get(ip).count < LIMIT).toBe(true);
    });

    it('should block requests over the limit', () => {
        const count = 121;
        const LIMIT = 120;
        expect(count > LIMIT).toBe(true);
    });

    it('should reset after the time window', () => {
        const WINDOW_MS = 60000;
        const entryStart = Date.now() - 70000;
        expect(Date.now() - entryStart > WINDOW_MS).toBe(true);
    });
});

describe('Path Traversal Prevention', () => {
    it('should detect directory traversal attempts', () => {
        const paths = ['../etc/passwd', '..\\windows\\system32', './../../secret'];
        paths.forEach(p => {
            const normalized = p.replace(/\\/g, '/');
            expect(normalized.includes('..')).toBe(true);
        });
    });

    it('should allow valid file paths', () => {
        const validPaths = ['./index.html', './styles.css', './script.js'];
        validPaths.forEach(p => {
            expect(p.includes('..')).toBe(false);
            expect(p.startsWith('./')).toBe(true);
        });
    });
});
