const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Revert Brand Icon
html = html.replace(/<svg class="brand-icon".*?<\/svg>/, '<span class="material-icons brand-icon">how_to_vote</span>');

// Revert Input Icons
html = html.replace(/<span class="input-icon" style="[^"]*"><svg[^>]*>.*?<\/svg><\/span>/g, (match, offset, string) => {
    if (offset < 2000) return '<span class="material-icons-outlined input-icon">badge</span>';
    if (offset < 2500) return '<span class="material-icons-outlined input-icon">lock</span>';
    if (offset < 3500) return '<span class="material-icons-outlined input-icon">cake</span>';
    return '<span class="material-icons-outlined input-icon">public</span>';
});

// Revert Button Icons
html = html.replace(/<svg[^>]*>.*?<\/svg>\s*<span id="btn-text">Authenticate Securely<\/span>/, '<span class="material-icons-outlined" style="margin-right:8px; font-size:20px;">fingerprint</span>\n                        <span id="btn-text">Authenticate Securely</span>');
html = html.replace(/<button type="submit" class="primary-btn ripple-btn"[^>]*>\s*<svg[^>]*>.*?<\/svg> Verify Status\s*<\/button>/, '<button type="submit" class="primary-btn ripple-btn" style="background:var(--accent-blue);" aria-label="Verify my voting eligibility status">\n                        <span class="material-icons">fact_check</span> Verify Status\n                    </button>');

// Revert Footer Icons
html = html.replace(/<div class="auth-footer" style="flex-direction:column; gap:8px;">\s*<div[^>]*><svg[^>]*>.*?<\/svg> End-to-End Encrypted via ECI Standards<\/div>\s*<div[^>]*>\s*<svg[^>]*>.*?<\/svg>\s*Non-Partisan.*?<\/div>/, '<div class="auth-footer" style="flex-direction:column; gap:8px;">\n                    <div><span class="material-icons-outlined lock-icon">shield</span> End-to-End Encrypted via ECI Standards</div>\n                    <div style="margin-top:4px; padding:8px 12px; background:rgba(167,215,197,0.08); border:1px solid rgba(167,215,197,0.2); border-radius:8px; font-size:0.8rem; color:var(--sage-mint); display:flex; align-items:center; gap:6px;">\n                        <span class="material-icons-outlined" style="font-size:1rem;">balance</span>\n                        Non-Partisan &middot; Verified data from ECI &amp; NVSP only\n                    </div>');

// Revert Sidebar Icons
html = html.replace(/<div class="sidebar-brand">\s*<svg[^>]*>.*?<\/svg>/, '<div class="sidebar-brand">\n                    <span class="material-icons">how_to_vote</span>');
html = html.replace(/<div class="sidebar-user"[^>]*>\s*<svg[^>]*>.*?<\/svg>/, '<div class="sidebar-user" style="margin-top:1rem; padding:0.8rem 1rem; background:rgba(167,215,197,0.05); border-radius:10px; border:1px solid rgba(167,215,197,0.1); font-size:0.9rem; color:var(--text-muted);">\n                    <span class="material-icons-outlined" style="font-size:1rem; vertical-align:middle; margin-right:6px; color:var(--sage-mint);">account_circle</span>');

html = html.replace(/<a href="#" class="nav-item active ripple-btn"[^>]*>\s*<svg[^>]*>.*?<\/svg>\s*<span data-i18n="nav-dash">Dashboard<\/span>\s*<\/a>/, '<a href="#" class="nav-item active ripple-btn" onclick="switchNav(this, \'overview\')" aria-label="Go to Dashboard Overview"><span class="material-icons-outlined">dashboard</span> <span data-i18n="nav-dash">Dashboard</span></a>');
html = html.replace(/<a href="#" class="nav-item ripple-btn" onclick="switchNav\(this, 'journey'\)"[^>]*>\s*<svg[^>]*>.*?<\/svg>\s*<span data-i18n="nav-journey">Guided Journey<\/span>\s*<\/a>/, '<a href="#" class="nav-item ripple-btn" onclick="switchNav(this, \'journey\')" aria-label="Go to Guided Election Journey"><span class="material-icons-outlined">route</span> <span data-i18n="nav-journey">Guided Journey</span></a>');
html = html.replace(/<a href="#" class="nav-item ripple-btn" onclick="switchNav\(this, 'intel'\)"[^>]*>\s*<svg[^>]*>.*?<\/svg>\s*<span data-i18n="nav-intel">Live Intel<\/span>\s*<\/a>/, '<a href="#" class="nav-item ripple-btn" onclick="switchNav(this, \'intel\')" aria-label="View Live Crowd and Booth Intel"><span class="material-icons-outlined">query_stats</span> <span data-i18n="nav-intel">Live Intel</span></a>');
html = html.replace(/<a href="#" class="nav-item ripple-btn" onclick="switchNav\(this, 'evm'\)"[^>]*>\s*<svg[^>]*>.*?<\/svg>\s*<span data-i18n="nav-evm">EVM Sim<\/span>\s*<\/a>/, '<a href="#" class="nav-item ripple-btn" onclick="switchNav(this, \'evm\')" aria-label="Open EVM Simulator"><span class="material-icons-outlined">touch_app</span> <span data-i18n="nav-evm">EVM Sim</span></a>');
html = html.replace(/<a href="#" class="nav-item ripple-btn" onclick="switchNav\(this, 'knowledge'\)"[^>]*>\s*<svg[^>]*>.*?<\/svg>\s*<span data-i18n="nav-knowledge">Knowledge<\/span>\s*<\/a>/, '<a href="#" class="nav-item ripple-btn" onclick="switchNav(this, \'knowledge\')" aria-label="View Myth vs Reality Knowledge base"><span class="material-icons-outlined">school</span> <span data-i18n="nav-knowledge">Knowledge</span></a>');

html = html.replace(/<button class="logout-btn"[^>]*>\s*<svg[^>]*>.*?<\/svg>\s*<span data-i18n="btn-logout">Log Out<\/span>\s*<\/button>/, '<button class="logout-btn" onclick="logout()" style="width:100%; border:1px solid rgba(255,255,255,0.1); border-radius:8px;"><span class="material-icons-outlined">logout</span> <span data-i18n="btn-logout">Log Out</span></button>');

// Revert Header Search
html = html.replace(/<div class="header-search">\s*<svg[^>]*>.*?<\/svg>/, '<div class="header-search">\n                        <span class="material-icons-outlined">search</span>');

// Revert EVM
html = html.replace(/<div class="widget-header"[^>]*>\s*<h3[^>]*><svg[^>]*>.*?<\/svg>\s*<span data-i18n="ai-triage">Smart Q&A Triage<\/span><\/h3>\s*<span[^>]*>\s*<svg[^>]*>.*?<\/svg>\s*<span data-i18n="ai-gemini">Powered by Gemini<\/span>\s*<\/span>\s*<\/div>/, '<div class="widget-header" style="background:rgba(10,15,24,0.8); padding:1.5rem; border-bottom:1px solid rgba(255,255,255,0.05); display:flex; justify-content:space-between; align-items:center;">\n                                    <h3 style="display:flex; align-items:center; gap:8px;"><span class="material-icons-outlined" style="color:var(--sage-mint);">smart_toy</span> <span data-i18n="ai-triage">Smart Q&A Triage</span></h3>\n                                    <span style="font-size:0.75rem; font-weight:600; color:var(--text-muted); background:rgba(255,255,255,0.05); padding:4px 8px; border-radius:12px; display:flex; align-items:center; gap:4px; border: 1px solid rgba(255,255,255,0.1);">\n                                        <span class="material-icons" style="font-size:1rem; color:#4285F4;">auto_awesome</span> <span data-i18n="ai-gemini">Powered by Gemini</span>\n                                    </span>\n                                </div>');

html = html.replace(/<div class="evm-col symbol"><svg[^>]*>.*?<\/svg><\/div>/g, (match, offset) => {
    if (offset < 24000) return '<div class="evm-col symbol"><span class="material-icons">eco</span></div>';
    if (offset < 24800) return '<div class="evm-col symbol"><span class="material-icons">water_drop</span></div>';
    return '<div class="evm-col symbol"><span class="material-icons">block</span></div>';
});

// Update Font Link to Material Symbols which is more robust
html = html.replace(/<link href="https:\/\/fonts.googleapis.com\/icon\?family=Material\+Icons\|Material\+Icons\+Outlined" rel="stylesheet">/, '<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" rel="stylesheet">\n    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">');

// Update version
html = html.replace(/vantage_version', '2.0.0'/g, "vantage_version', '3.0.0'");
html = html.replace(/script.js\?v=2.0.0/, "script.js?v=3.0.0");

fs.writeFileSync('index.html', html);
console.log("Reverted SVGs");
