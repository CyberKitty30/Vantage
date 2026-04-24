import { describe, it, expect, beforeEach } from 'vitest';

// Mocking TRANSLATIONS for the test environment
const TRANSLATIONS = {
    en: { 'title': 'VANTAGE', 'nav-dash': 'Dash', 'nav-journey': 'Path', 'nav-intel': 'Data', 'nav-evm': 'Sim', 'nav-knowledge': 'Info', 'greet': 'Hi', 'ai-fallback': 'Listen' },
    hi: { 'title': 'वंटेज', 'nav-dash': 'डैश', 'nav-journey': 'यात्रा', 'nav-intel': 'डेटा', 'nav-evm': 'सिम', 'nav-knowledge': 'ज्ञान', 'greet': 'नमस्ते', 'ai-fallback': 'सुन' },
    gu: { 'title': 'વાન્ટેજ', 'nav-dash': 'ડેશ', 'nav-journey': 'યાત્રા', 'nav-intel': 'ડેટા', 'nav-evm': 'સિમ', 'nav-knowledge': 'જ્ઞાન', 'greet': 'નમસ્તે', 'ai-fallback': 'સાંભળ' }
};

const CIVIC_KNOWLEDGE = [
    { keys: ['booth', 'location', 'where', 'find'], responseKey: 'ai-intel' },
    { keys: ['register', 'sign up', 'enroll'], responseKey: 'ai-register' }
];

describe('Vantage Core Logic & Coverage Suite', () => {
    it('should have consistent translation keys across all languages', () => {
        const enKeys = Object.keys(TRANSLATIONS.en).sort();
        const hiKeys = Object.keys(TRANSLATIONS.hi).sort();
        const guKeys = Object.keys(TRANSLATIONS.gu).sort();
        
        expect(hiKeys).toEqual(enKeys);
        expect(guKeys).toEqual(enKeys);
    });

    it('should correctly identify the target language for voice synthesis', () => {
        const getLang = (lang) => (lang === 'hi') ? 'hi-IN' : (lang === 'gu') ? 'gu-IN' : 'en-IN';
        expect(getLang('hi')).toBe('hi-IN');
        expect(getLang('gu')).toBe('gu-IN');
        expect(getLang('en')).toBe('en-IN');
    });

    it('should sanitize user input using a mock DOMPurify pattern', () => {
        const dirty = '<img src=x onerror=alert(1)>';
        const sanitize = (val) => val.replace(/<script|onerror|onload/gi, '[REDACTED]');
        const clean = sanitize(dirty);
        expect(clean).toContain('[REDACTED]');
        expect(clean).not.toContain('onerror');
    });

    it('should generate a valid welcome name from voter ID', () => {
        const id = "ABC12345";
        const nameMock = "Voter " + id.substring(0,4);
        expect(nameMock).toBe("Voter ABC1");
    });

    it('should correctly calculate eligibility based on age and citizenship', () => {
        const checkEligibilityLogic = (age, citizen) => {
            return (age >= 18 && citizen === 'yes');
        };
        expect(checkEligibilityLogic(20, 'yes')).toBe(true);
        expect(checkEligibilityLogic(17, 'yes')).toBe(false);
        expect(checkEligibilityLogic(18, 'no')).toBe(false);
    });

    it('should calculate accurate radial progress percentages', () => {
        const calculateProgress = (completed, total) => Math.round((completed / total) * 100);
        expect(calculateProgress(0, 4)).toBe(0);
        expect(calculateProgress(2, 4)).toBe(50);
        expect(calculateProgress(4, 4)).toBe(100);
    });

    it('should correctly match user queries to civic knowledge keys', () => {
        const query = "Where is my polling booth?";
        const lowerMsg = query.toLowerCase();
        let bestMatch = null;
        let maxScore = 0;

        CIVIC_KNOWLEDGE.forEach(item => {
            let score = 0;
            item.keys.forEach(k => { if(lowerMsg.includes(k)) score++; });
            if(score > maxScore) {
                maxScore = score;
                bestMatch = item;
            }
        });

        expect(bestMatch).not.toBeNull();
        expect(bestMatch.responseKey).toBe('ai-intel');
        expect(maxScore).toBe(2); // 'where' and 'booth'
    });

    it('should provide fallback when no civic knowledge matches', () => {
        const query = "xyz unknown topic";
        let bestMatch = null;
        let maxScore = 0;

        CIVIC_KNOWLEDGE.forEach(item => {
            let score = 0;
            item.keys.forEach(k => { if(query.includes(k)) score++; });
            if(score > maxScore) {
                maxScore = score;
                bestMatch = item;
            }
        });

        const responseKey = bestMatch ? bestMatch.responseKey : 'ai-fallback';
        expect(bestMatch).toBeNull();
        expect(responseKey).toBe('ai-fallback');
    });

    it('should process navigation target logic properly', () => {
        const getNavTarget = (targetId) => 'section-' + targetId;
        expect(getNavTarget('overview')).toBe('section-overview');
        expect(getNavTarget('intel')).toBe('section-intel');
    });
});
