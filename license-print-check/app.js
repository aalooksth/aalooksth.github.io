/**
 * Unified Driving License Print Check - Application Engine
 * Supports Pure Nepali ('ne') & Pure English ('en') UI Language Switching
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const searchForm = document.getElementById('searchForm');
    const licenseInput = document.getElementById('licenseInput');
    const clearInputBtn = document.getElementById('clearInputBtn');
    const validationErrorMsg = document.getElementById('validationErrorMsg');
    const resultsSection = document.getElementById('resultsSection');
    const placeholderSection = document.getElementById('placeholderSection');
    const summaryCard = document.getElementById('summaryCard');
    const officeGrid = document.getElementById('officeGrid');
    const resultsCount = document.getElementById('resultsCount');
    const historyList = document.getElementById('historyList');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');
    const copyShareLinkBtn = document.getElementById('copyShareLinkBtn');
    const printReportBtn = document.getElementById('printReportBtn');
    const copyApiUrlBtn = document.getElementById('copyApiUrlBtn');
    const portalsGrid = document.getElementById('portalsGrid');
    const officesDirectoryGrid = document.getElementById('officesDirectoryGrid');

    // Language & Theme State
    const langToggleBtn = document.getElementById('langToggleBtn');
    const langLabel = document.getElementById('langLabel');
    const themeToggleBtn = document.getElementById('themeToggleBtn');

    let currentLang = localStorage.getItem('license_check_lang') || 'en';
    let currentResults = [];
    const csvCache = {};

    // Language Dictionary
    const DICTIONARY = {
        ne: {
            navTitle: "स्मार्ट लाइसेन्स प्रिन्ट जाँच",
            navSub: "बागमती प्रदेश लाइसेन्स छापा स्थिति",
            heroTitle: "स्मार्ट लाइसेन्स छापा र वितरण स्थिति जाँच",
            heroSubtitle: "बागमती प्रदेशका यातायात व्यवस्था कार्यालयहरूमा सवारी चालक अनुमतिपत्र छापा स्थिति हेर्नुहोस्",
            inputPlaceholder: "सवारी चालक अनुमतिपत्र नं. (उदा. 01-06-00000000)",
            searchBtn: "स्थिति खोज्नुहोस्",
            formatHint: "लाइसेन्स नम्बर १२ अंकको <code>XX-XX-XXXXXXXX</code> ढाँचामा प्रविष्ट गर्नुहोस्।",
            feedbackBarText: "नतिजामा त्रुटि भेटियो वा नयाँ सुझाव छ?",
            fbGithubLink: "सुझाव पठाउनुहोस् (GitHub)",
            fbContactLink: "डेभलपरलाई सम्पर्क गर्नुहोस्",
            placeholderTitle: "आफ्नो सवारी चालक अनुमतिपत्र (लाइसेन्स) नम्बर राखेर खोज्नुहोस्",
            placeholderDesc: "बागमती प्रदेशका ४ यातायात कार्यालयहरू (एकान्तकुना, ठूलोभर्याङ कलङ्की, चाबहिल, राधेराधे) मा कार्ड छापिएको स्थिति एकैसाथ हेर्न सकिनेछ।",
            shareBtn: "लिङ्क कपी",
            printBtn: "प्रिन्ट",
            recentSearches: "हालै खोजिएका नम्बरहरू",
            clearHistory: "सबै हटाउनुहोस्",
            directoryTitle: "बागमती प्रदेशका यातायात व्यवस्था कार्यालयहरू",
            directorySubtitle: "कार्यालयहरूको ठेगाना र आधिकारिक सम्पर्क विवरण",
            guideTitle: "लाइसेन्स कार्ड बुझ्न जाँदा चाहिने कागजातहरू",
            guideSubtitle: "विभिन्न कार्यालयहरूको वितरण कोठा र आवश्यक प्रक्रियाहरू",
            portalsTitle: "आधिकारिक सरकारी वेबसाइटहरू",
            portalsSubtitle: "बागमती प्रदेश तथा यातायात व्यवस्था विभागका वेबसाइटहरू",
            notFoundTitle: "कुनै पनि कार्यालयमा नतिजा भेटिएन (Record Not Found)",
            notFoundSub: "सवारी चालक अनुमतिपत्र बागमती प्रदेशका कुनै पनि यातायात व्यवस्था कार्यालयको सूचीमा भेटिएन। कार्ड छापाखानाबाट छापिएर कार्यालयमा प्राप्त नभएको हुनसक्छ।",
            checkedSummary: "Checked {count} Transport Offices (कार्यालयहरूको प्रिन्ट पोर्टल र विवरण)",
            disclaimerTitle: "अस्वीकरण (Disclaimer)",
            disclaimerText: "यो वेबसाइट बागमती प्रदेशका यातायात व्यवस्था कार्यालयहरू (TMO) को सार्वजनिक प्रणालीमा उपलब्ध छापा स्थिति खोज्न प्रयोगकर्तालाई सहज बनाउन तयार पारिएको एक अनौपचारिक खुला पोर्टल हो। यसले कुनै पनि सरकारी निकायको आधिकारिक प्रतिनिधित्व गर्दैन। प्रस्तुत विवरणहरू सम्बन्धित कार्यालयका सार्वजनिक वेब सर्भरहरूबाट वास्तविक समयमा प्राप्त गरिएका हुन्।"
        },
        en: {
            navTitle: "Smart License Print Status",
            navSub: "Bagamati Province License Checker",
            heroTitle: "Check Driving License Print & Collection Status",
            heroSubtitle: "Check Smart Driving License Print & Collection Status across Bagamati Province Transport Offices",
            inputPlaceholder: "Enter Driving License No. (e.g. 01-06-00000000)",
            searchBtn: "Check Status",
            formatHint: "Enter 12-character license number in <code>XX-XX-XXXXXXXX</code> format.",
            feedbackBarText: "Notice an inaccuracy or have a feature request?",
            fbGithubLink: "Report Inaccuracy (GitHub)",
            fbContactLink: "Contact Developer",
            placeholderTitle: "Enter your Driving License Number to search",
            placeholderDesc: "Simultaneously search print status across 4 Bagamati Transport Management Offices (Ekantakuna, Kalanki, Chabahil, Radhe Radhe).",
            shareBtn: "Share Link",
            printBtn: "Print Report",
            recentSearches: "Recent Searches",
            clearHistory: "Clear All",
            directoryTitle: "Bagamati Province Transport Management Offices",
            directorySubtitle: "Offices Directory & Contact Details",
            guideTitle: "Required Documents & Collection Instructions",
            guideSubtitle: "Counter rooms and required documents by office",
            portalsTitle: "Official Government Portals",
            portalsSubtitle: "Bagamati Province & DoTM Official Websites",
            notFoundTitle: "Record Not Found in Any Office",
            notFoundSub: "License record was not found in any queried transport office. The card is likely not printed yet or not received at provincial offices.",
            checkedSummary: "Checked {count} Transport Offices (Offices Directory & Print Portals)",
            disclaimerTitle: "Disclaimer",
            disclaimerText: "This website is an independent civic utility created to assist citizens in checking smart driving license print status across Bagamati Province transport management offices. It is not affiliated with or an official representative of the Department of Transport Management (DoTM) or any government entity. Data is fetched live from public endpoints maintained by respective offices."
        }
    };

    // Initialize Theme & Language
    initTheme();
    applyLanguage(currentLang);

    // Call checkUrlParameters on page load for direct query & JSON API links!
    checkUrlParameters();

    // Language Toggle Listener
    langToggleBtn.addEventListener('click', () => {
        currentLang = currentLang === 'ne' ? 'en' : 'ne';
        localStorage.setItem('license_check_lang', currentLang);
        applyLanguage(currentLang);
        if (currentResults.length > 0) {
            renderResults(currentResults, licenseInput.value);
        }
    });

    // Theme Toggle Listener
    themeToggleBtn.addEventListener('click', () => {
        const isDark = document.body.classList.contains('dark-theme');
        if (isDark) {
            document.body.classList.remove('dark-theme');
            document.body.classList.add('light-theme');
            localStorage.setItem('license_check_theme', 'light');
        } else {
            document.body.classList.remove('light-theme');
            document.body.classList.add('dark-theme');
            localStorage.setItem('license_check_theme', 'dark');
        }
    });

    function applyLanguage(lang) {
        const t = DICTIONARY[lang];
        langLabel.textContent = lang === 'ne' ? '🇬🇧 English' : '🇳🇵 नेपाली';

        document.getElementById('navTitle').textContent = t.navTitle;
        document.getElementById('navSub').textContent = t.navSub;
        document.getElementById('heroTitle').textContent = t.heroTitle;
        document.getElementById('heroSubtitle').textContent = t.heroSubtitle;
        licenseInput.placeholder = t.inputPlaceholder;
        document.getElementById('searchBtnText').textContent = t.searchBtn;
        document.getElementById('formatHint').innerHTML = t.formatHint;

        if (document.getElementById('feedbackBarText')) document.getElementById('feedbackBarText').textContent = t.feedbackBarText;
        if (document.getElementById('fbGithubLink')) document.getElementById('fbGithubLink').textContent = t.fbGithubLink;
        if (document.getElementById('fbContactLink')) document.getElementById('fbContactLink').textContent = t.fbContactLink;

        document.getElementById('placeholderTitle').textContent = t.placeholderTitle;
        document.getElementById('placeholderDesc').textContent = t.placeholderDesc;
        document.getElementById('shareBtnText').textContent = t.shareBtn;
        document.getElementById('printBtnText').textContent = t.printBtn;
        document.getElementById('historyTitle').textContent = t.recentSearches;
        document.getElementById('clearHistoryText').textContent = t.clearHistory;
        document.getElementById('directoryTitle').textContent = t.directoryTitle;
        document.getElementById('directorySubtitle').textContent = t.directorySubtitle;
        document.getElementById('guideTitle').textContent = t.guideTitle;
        document.getElementById('guideSubtitle').textContent = t.guideSubtitle;
        document.getElementById('portalsTitle').textContent = t.portalsTitle;
        document.getElementById('portalsSubtitle').textContent = t.portalsSubtitle;

        if (document.getElementById('disclaimerTitle')) document.getElementById('disclaimerTitle').textContent = t.disclaimerTitle;
        if (document.getElementById('disclaimerText')) document.getElementById('disclaimerText').textContent = t.disclaimerText;

        renderGuideGrid(lang);
        renderOfficialPortals();
        renderOfficesDirectory();
    }

    // Format Helper & Validation (Nepal format: 12 alphanumeric characters, XX-XX-XXXXXXXX)
    function cleanLicenseInput(input) {
        return (input || '').replace(/[^a-zA-Z0-9]/g, '').trim().toUpperCase();
    }

    function isValidLicenseFormat(rawInput) {
        const clean = cleanLicenseInput(rawInput);
        return clean.length === 12;
    }

    function showValidationError(message) {
        validationErrorMsg.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> ${message}`;
        validationErrorMsg.classList.remove('hidden');
        licenseInput.classList.add('input-error');
        licenseInput.focus();
    }

    function hideValidationError() {
        validationErrorMsg.classList.add('hidden');
        licenseInput.classList.remove('input-error');
    }

    // Auto-formatting Input into XX-XX-XXXXXXXX format as user types
    licenseInput.addEventListener('input', () => {
        hideValidationError();
        const raw = licenseInput.value;
        const formatted = formatLicenseNumber(raw);

        if (formatted !== raw) {
            licenseInput.value = formatted;
        }

        if (licenseInput.value.trim().length > 0) {
            clearInputBtn.classList.remove('hidden');
        } else {
            clearInputBtn.classList.add('hidden');
        }
    });

    clearInputBtn.addEventListener('click', () => {
        licenseInput.value = '';
        clearInputBtn.classList.add('hidden');
        hideValidationError();
        licenseInput.focus();
    });

    function formatLicenseNumber(raw) {
        if (!raw) return '';
        const clean = raw.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 12);

        let result = '';
        if (clean.length > 0) result += clean.slice(0, 2);
        if (clean.length > 2) result += '-' + clean.slice(2, 4);
        if (clean.length > 4) result += '-' + clean.slice(4, 12);
        return result;
    }

    // Event Listeners
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const rawValue = licenseInput.value;

        if (!isValidLicenseFormat(rawValue)) {
            const err = currentLang === 'ne'
                ? "गलत लाइसेन्स ढाँचा! लाइसेन्स नम्बर १२ अंकको (XX-XX-XXXXXXXX) हुनुपर्छ।"
                : "Invalid license format! License number must follow XX-XX-XXXXXXXX format.";
            showValidationError(err);
            return;
        }

        hideValidationError();
        executeSearch(formatLicenseNumber(rawValue));
    });

    // Share & Print Buttons
    copyShareLinkBtn.addEventListener('click', () => {
        const val = formatLicenseNumber(licenseInput.value);
        if (val) {
            const shareUrl = `${window.location.origin}${window.location.pathname}?q=${encodeURIComponent(val)}`;
            navigator.clipboard.writeText(shareUrl).then(() => {
                const msg = currentLang === 'ne' ? 'डायरेक्ट सर्च लिङ्क कपी गरियो!' : 'Direct search link copied to clipboard!';
                alert(msg + '\n' + shareUrl);
            });
        }
    });

    printReportBtn.addEventListener('click', () => {
        window.print();
    });

    if (copyApiUrlBtn) {
        copyApiUrlBtn.addEventListener('click', () => {
            const val = formatLicenseNumber(licenseInput.value) || '01-06-00000000';
            const apiUrl = `${window.location.origin}${window.location.pathname}?q=${encodeURIComponent(val)}&format=json`;
            navigator.clipboard.writeText(apiUrl).then(() => {
                alert('AI API Endpoint URL copied!\n' + apiUrl);
            });
        });
    }

    clearHistoryBtn.addEventListener('click', () => {
        localStorage.removeItem('license_check_history');
        renderHistory();
    });

    // Core Search Function
    async function executeSearch(licenseNo) {
        const newUrl = `${window.location.pathname}?q=${encodeURIComponent(licenseNo)}`;
        window.history.pushState({ q: licenseNo }, '', newUrl);

        placeholderSection.classList.add('hidden');
        resultsSection.classList.remove('hidden');
        renderSkeletons();

        saveToHistory(licenseNo);

        const offices = window.OfficeRegistry.getEnabledOffices();
        const promises = offices.map(office => fetchOfficeStatus(office, licenseNo));

        const results = await Promise.allSettled(promises);

        currentResults = results.map((res, index) => {
            const office = offices[index];
            if (res.status === 'fulfilled') {
                return { office, ...res.value };
            } else {
                return {
                    office,
                    found: false,
                    caseType: 1,
                    error: res.reason ? res.reason.message : 'Network error',
                    status: 'Error',
                    isPrinted: false
                };
            }
        });

        renderResults(currentResults, licenseNo);
    }

    // Single Office API Fetcher
    async function fetchOfficeStatus(office, licenseNo) {
        // If office defines its own async fetch (e.g. multi-endpoint), use it directly
        if (typeof office.customFetch === 'function') {
            return office.customFetch(licenseNo);
        }

        if (office.format === 'csv') {
            try {
                let csvText = csvCache[office.id];
                if (!csvText) {
                    const resp = await fetch(office.urlTemplate, { method: 'GET' });
                    if (!resp.ok) throw new Error(`HTTP ${resp.status} - ${resp.statusText}`);
                    csvText = await resp.text();
                    csvCache[office.id] = csvText;
                }
                return office.parseResponse(csvText, licenseNo);
            } catch (err) {
                throw err;
            }
        }

        const url = office.urlTemplate.replace('{license_number}', encodeURIComponent(licenseNo));
        const options = {
            method: office.method || 'GET',
            headers: { ...office.headers },
        };

        if (office.method === 'POST' && office.bodyTemplate) {
            options.body = office.bodyTemplate.replace('{license_number}', licenseNo);
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        options.signal = controller.signal;

        try {
            const resp = await fetch(url, options);
            clearTimeout(timeoutId);

            if (!resp.ok) {
                throw new Error(`HTTP ${resp.status} - ${resp.statusText}`);
            }

            const data = await resp.json();
            return office.parseResponse(data, licenseNo);
        } catch (err) {
            clearTimeout(timeoutId);
            throw err;
        }
    }


    // Render Skeletons
    function renderSkeletons() {
        summaryCard.className = "summary-card";
        summaryCard.innerHTML = `
            <div class="hero-card-header">
                <div class="skeleton-line" style="width:44px; height:44px; border-radius:50%;"></div>
                <div style="flex:1;">
                    <div class="skeleton-line" style="width:220px; height:20px; margin-bottom:8px;"></div>
                    <div class="skeleton-line" style="width:160px; height:14px;"></div>
                </div>
            </div>
        `;

        const offices = window.OfficeRegistry.getEnabledOffices();
        officeGrid.innerHTML = offices.map(() => `
            <div class="skeleton-card">
                <div class="skeleton-line" style="width:60%; height:20px; margin-bottom:12px;"></div>
                <div class="skeleton-line" style="width:40%; height:14px; margin-bottom:16px;"></div>
                <div class="skeleton-line" style="width:100%; height:60px;"></div>
            </div>
        `).join('');
    }

    // Render Results with Green Theme for Collected Status
    function renderResults(results, licenseNo) {
        const foundItem = results.find(r => r.found && r.isPrinted);
        const t = DICTIONARY[currentLang];

        if (foundItem) {
            const o = foundItem.office;
            const caseType = foundItem.caseType || 4;

            let heroClass = 'summary-card';
            let heroAvatarIcon = 'fa-id-card';
            let actionNoticeHtml = '';

            const greetingName = foundItem.name !== 'N/A' ? foundItem.name : (currentLang === 'ne' ? 'सेवाग्राही' : 'Applicant');
            const officeDisplayName = currentLang === 'ne' ? (o.nepaliName || o.name) : o.name;

            // Prominent Box Code / Received ID Display Banner
            let boxCodeHtml = '';
            if (foundItem.boxCode && foundItem.boxCode !== 'N/A') {
                boxCodeHtml = `
                    <div class="hero-box-code-container">
                        <div class="hero-box-code-label">${currentLang === 'ne' ? 'बक्स कोड (BOX CODE)' : 'BOX CODE'}:</div>
                        <div class="hero-box-code-value">${foundItem.boxCode}</div>
                    </div>
                `;
            } else if (foundItem.receivedId) {
                boxCodeHtml = `
                    <div class="hero-box-code-container">
                        <div class="hero-box-code-label">${currentLang === 'ne' ? 'RECEIVED ID (प्राप्त परिचय नं.)' : 'RECEIVED ID'}:</div>
                        <div class="hero-box-code-value">${foundItem.receivedId} ${foundItem.counterRoom ? `<span style="font-size:1.1rem; color:var(--text-main);">(${foundItem.counterRoom})</span>` : ''}</div>
                    </div>
                `;
            }

            // CASE 2: Received but Needs Form Fill
            if (caseType === 2) {
                heroClass += ' hero-case-warning';
                heroAvatarIcon = 'fa-file-circle-exclamation';

                const inst = currentLang === 'ne' ? (foundItem.instructionNp || o.additionalSteps.instructionNp) : (foundItem.instructionEn || o.additionalSteps.instructionEn);
                actionNoticeHtml = `
                    ${boxCodeHtml}
                    <div class="hero-instruction-box">
                        <strong><i class="fa-solid fa-triangle-exclamation"></i> ${currentLang === 'ne' ? 'सूचना / Faram Registration Required' : 'Action Required'}:</strong><br>
                        ${inst}
                    </div>
                    <div class="hero-action-row">
                        <button type="button" class="btn btn-primary btn-open-portal" data-office-id="${o.id}">
                            <i class="fa-solid fa-arrow-up-right-from-square"></i> Open ${o.shortName} Official Portal (License Pre-copied)
                        </button>
                    </div>
                `;
            }
            // CASE 3 / COLLECTED: GREEN THEME FOR COLLECTED STATUS
            else if (caseType === 3 || foundItem.isCollected) {
                heroClass += ' hero-case-collected'; // Green theme styling!
                heroAvatarIcon = foundItem.isCollected ? 'fa-circle-check' : 'fa-box-archive';

                const inst = currentLang === 'ne' ? foundItem.instructionNp : foundItem.instructionEn;
                actionNoticeHtml = `
                    ${boxCodeHtml}
                    <div class="hero-instruction-box">
                        <strong><i class="fa-solid fa-circle-check text-success"></i> ${currentLang === 'ne' ? 'दर्ता / संकलन विवरण' : 'Registration / Collection Status'}:</strong><br>
                        ${inst}
                    </div>
                `;
            }
            // CASE 4: Direct Counter Pickup Ready
            else {
                heroClass += ' hero-case-direct';
                heroAvatarIcon = 'fa-circle-check';

                const inst = currentLang === 'ne' ? foundItem.instructionNp : foundItem.instructionEn;
                actionNoticeHtml = `
                    ${boxCodeHtml}
                    <div class="hero-instruction-box">
                        <strong><i class="fa-solid fa-circle-check text-success"></i> ${currentLang === 'ne' ? 'बुझ्ने तरिका' : 'Collection Instructions'}:</strong><br>
                        ${inst}
                    </div>
                `;
            }

            const statusText = currentLang === 'ne' ? (foundItem.statusNp || foundItem.status) : (foundItem.statusEn || foundItem.status);

            summaryCard.className = heroClass;
            summaryCard.innerHTML = `
                <div class="hero-card-header">
                    <div class="hero-status-avatar">
                        <i class="fa-solid ${heroAvatarIcon}"></i>
                    </div>
                    <div>
                        <div class="hero-greeting-title">${currentLang === 'ne' ? 'नमस्ते' : 'Hi'} ${greetingName}! 👋</div>
                        <div class="hero-greeting-sub">
                            ${currentLang === 'ne' ? 'सवारी चालक अनुमतिपत्र' : 'Driving License'} <strong>${foundItem.licenseNumber || licenseNo}</strong> ${foundItem.category !== 'N/A' ? `(${currentLang === 'ne' ? 'वर्ग' : 'Category'}: <strong>${foundItem.category}</strong>)` : ''} <strong>${officeDisplayName}</strong> ${currentLang === 'ne' ? 'मा' : 'is'} <strong>${statusText}</strong>।
                        </div>
                    </div>
                </div>
                ${actionNoticeHtml}
            `;

            // Render matched office card prominently + 1 collapsible row for other checked offices
            const matchedCardHtml = renderOfficeCard(foundItem, licenseNo);
            const otherResults = results.filter(r => r.office.id !== foundItem.office.id);

            const accordionSummaryText = currentLang === 'ne'
                ? `Checked ${otherResults.length} other transport offices (अन्य कार्यालयमा भेटिएन)`
                : `Checked ${otherResults.length} other transport offices (No records found)`;

            const accordionHtml = `
                <details class="checked-offices-accordion">
                    <summary><span><i class="fa-solid fa-list-check"></i> ${accordionSummaryText}</span></summary>
                    <div class="checked-offices-list">
                        ${otherResults.map(r => `
                            <div class="checked-office-item">
                                <span class="checked-office-title">${currentLang === 'ne' ? (r.office.nepaliName || r.office.name) : r.office.name}</span>
                                <div class="checked-office-links">
                                    <span class="text-muted" style="font-size:0.82rem;"><i class="fa-solid fa-xmark text-danger"></i> Not Found</span>
                                    ${r.office.officialWebsite ? `<a href="${r.office.officialWebsite}" target="_blank" title="Official Website" class="portal-text-link"><i class="fa-solid fa-globe"></i></a>` : ''}
                                    ${r.office.mapUrl ? `<a href="${r.office.mapUrl}" target="_blank" title="Google Maps Location" class="portal-text-link"><i class="fa-solid fa-location-dot"></i></a>` : ''}
                                    ${r.office.phone ? `<a href="tel:${r.office.phone}" title="Phone: ${r.office.phone}" class="portal-text-link"><i class="fa-solid fa-phone"></i></a>` : ''}
                                    ${r.office.printCheckPortal ? `<a href="${r.office.printCheckPortal}" target="_blank" class="portal-text-link">${currentLang === 'ne' ? 'प्रिन्ट पोर्टल' : 'Print Portal'} ↗</a>` : ''}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </details>
            `;

            officeGrid.innerHTML = matchedCardHtml + accordionHtml;
            resultsCount.textContent = `1 matching print record found across ${results.length} transport offices`;

        } else {
            // NOT FOUND STATE (No "Case 1:" text!)
            summaryCard.className = 'summary-card hero-case-notfound';
            summaryCard.innerHTML = `
                <div class="hero-card-header">
                    <div class="hero-status-avatar">
                        <i class="fa-solid fa-circle-xmark"></i>
                    </div>
                    <div>
                        <div class="hero-greeting-title">${t.notFoundTitle}</div>
                        <div class="hero-greeting-sub">
                            ${currentLang === 'ne' ? 'सवारी चालक अनुमतिपत्र' : 'Driving License'} <strong>${licenseNo}</strong> ${t.notFoundSub}
                        </div>
                    </div>
                </div>
            `;

            const accordionSummaryText = t.checkedSummary.replace('{count}', results.length);

            // Single collapsible accordion listing all checked offices with print website & icons
            const accordionHtml = `
                <details class="checked-offices-accordion" open>
                    <summary><span><i class="fa-solid fa-building-circle-check"></i> ${accordionSummaryText}</span></summary>
                    <div class="checked-offices-list">
                        ${results.map(r => `
                            <div class="checked-office-item">
                                <div>
                                    <div class="checked-office-title">${currentLang === 'ne' ? (r.office.nepaliName || r.office.name) : r.office.name}</div>
                                    <div class="text-muted" style="font-size:0.8rem;">${r.office.address || ''}</div>
                                </div>
                                <div class="checked-office-links">
                                    <span class="text-danger" style="font-weight:600; font-size:0.82rem;"><i class="fa-solid fa-xmark"></i> Not Found</span>
                                    ${r.office.officialWebsite ? `<a href="${r.office.officialWebsite}" target="_blank" title="Official Website" class="portal-text-link"><i class="fa-solid fa-globe"></i></a>` : ''}
                                    ${r.office.mapUrl ? `<a href="${r.office.mapUrl}" target="_blank" title="Google Maps Location" class="portal-text-link"><i class="fa-solid fa-location-dot"></i></a>` : ''}
                                    ${r.office.phone ? `<a href="tel:${r.office.phone}" title="Phone: ${r.office.phone}" class="portal-text-link"><i class="fa-solid fa-phone"></i></a>` : ''}
                                    ${r.office.printCheckPortal ? `<a href="${r.office.printCheckPortal}" target="_blank" class="portal-text-link">${currentLang === 'ne' ? 'प्रिन्ट पोर्टल' : 'Print Portal'} ↗</a>` : ''}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </details>
            `;

            officeGrid.innerHTML = accordionHtml;
            resultsCount.textContent = `Checked ${results.length} transport offices - No print records found`;
        }

        // ── Bookmarklet Banner ─────────────────────────────────────────────────
        renderBookmarklet(licenseNo);

        // Attach Portal Opener Event Listeners with clipboard helper
        document.querySelectorAll('.btn-open-portal').forEach(btn => {
            btn.addEventListener('click', () => {
                const officeId = btn.dataset.officeId;
                const office = window.OfficeRegistry.offices.find(o => o.id === officeId);
                if (office && typeof office.openPortalWithQuery === 'function') {
                    office.openPortalWithQuery(licenseNo);
                } else if (office && office.printCheckPortal) {
                    if (navigator.clipboard) navigator.clipboard.writeText(licenseNo);
                    window.open(office.printCheckPortal, '_blank');
                }
            });
        });
    }

    // Bookmarklet: floating pill — drag on desktop, Share/Copy on mobile
    function renderBookmarklet(licenseNo) {
        // Remove any previous FAB
        const existing = document.getElementById('bookmarkletFab');
        if (existing) existing.remove();

        const bar = document.getElementById('bookmarkletBar');
        if (bar) bar.classList.add('hidden'); // keep old inline bar hidden

        const searchUrl = `https://aloks.com.np/license-print-check/?q=${encodeURIComponent(licenseNo)}`;
        const bookmarkletHref = `javascript:(function(){window.open('${searchUrl}','_blank');})();`;
        const isNe = currentLang === 'ne';
        const isMobile = window.matchMedia('(max-width: 640px)').matches || navigator.maxTouchPoints > 0;
        const hasShare = !!navigator.share;

        const fab = document.createElement(isMobile ? 'button' : 'a');
        fab.id = 'bookmarkletFab';
        fab.className = 'bookmarklet-fab hidden';

        if (isMobile) {
            fab.type = 'button';
            const label = hasShare
                ? (isNe ? '🔗 यो खोज सेयर गर्नुहोस्' : '🔗 Share this Search')
                : (isNe ? '📋 लिङ्क कपी गर्नुहोस्' : '📋 Copy Search Link');
            fab.innerHTML = `<i class="fa-solid ${hasShare ? 'fa-share-nodes' : 'fa-link'} bookmarklet-fab-icon"></i><span class="bookmarklet-fab-label">${label}</span>`;

            fab.addEventListener('click', async () => {
                if (hasShare) {
                    try {
                        await navigator.share({
                            title: isNe ? `लाइसेन्स स्थिति जाँच — ${licenseNo}` : `License Status — ${licenseNo}`,
                            text: isNe ? 'बागमती प्रदेश स्मार्ट लाइसेन्स छापा स्थिति' : 'Bagamati Province Smart License Print Status',
                            url: searchUrl
                        });
                    } catch (_) { /* user cancelled */ }
                } else {
                    try {
                        await navigator.clipboard.writeText(searchUrl);
                        const orig = fab.querySelector('.bookmarklet-fab-label').textContent;
                        fab.querySelector('.bookmarklet-fab-label').textContent = isNe ? '✅ कपी भयो!' : '✅ Copied!';
                        setTimeout(() => { fab.querySelector('.bookmarklet-fab-label').textContent = orig; }, 2000);
                    } catch (_) { /* fallback: do nothing */ }
                }
            });
        } else {
            // Desktop: draggable bookmarklet <a>
            fab.href = bookmarkletHref;
            fab.draggable = true;
            fab.title = isNe ? 'बुकमार्क बारमा तान्नुहोस् — Right-click → Bookmark this link' : 'Drag to bookmarks bar — or Right-click → Bookmark this link';
            fab.innerHTML = `<i class="fa-solid fa-bookmark bookmarklet-fab-icon"></i><span class="bookmarklet-fab-label">${isNe ? `लाइसेन्स ${licenseNo} बुकमार्क` : `Bookmark: License ${licenseNo}`}</span>`;
            fab.addEventListener('click', e => e.preventDefault());
            fab.addEventListener('dragstart', e => {
                e.dataTransfer.setData('text/uri-list', searchUrl);
                e.dataTransfer.setData('text/plain', searchUrl);
            });
        }

        document.body.appendChild(fab);
        // Slight delay so CSS transition fires
        requestAnimationFrame(() => fab.classList.remove('hidden'));
    }

    // Office Card Template Generator tailored to specific case rules
    function renderOfficeCard(item, licenseNo) {
        const o = item.office;
        const caseType = item.caseType || 1;
        const officeDisplayName = currentLang === 'ne' ? (o.nepaliName || o.name) : o.name;

        let badgeHtml = '';
        if (item.error) {
            badgeHtml = `<span class="status-badge danger"><i class="fa-solid fa-triangle-exclamation"></i> Error</span>`;
        } else if (!item.found || caseType === 1) {
            badgeHtml = `<span class="status-badge danger"><i class="fa-solid fa-xmark"></i> Not Found</span>`;
        } else if (caseType === 2) {
            badgeHtml = `<span class="status-badge pending"><i class="fa-solid fa-file-signature"></i> Faram Fill Required</span>`;
        } else if (caseType === 3 && item.isCollected) {
            badgeHtml = `<span class="status-badge success"><i class="fa-solid fa-circle-check"></i> Distributed / Collected</span>`;
        } else if (caseType === 3) {
            badgeHtml = `<span class="status-badge info"><i class="fa-solid fa-box-archive"></i> Form Registered</span>`;
        } else {
            badgeHtml = `<span class="status-badge success"><i class="fa-solid fa-check"></i> Printed & Ready</span>`;
        }

        const instText = currentLang === 'ne' ? item.instructionNp : item.instructionEn;

        // Custom details grid based on case type
        let detailItemsHtml = '';

        // If Case 2 (Form Pending): Do NOT show Box Code or Room Number!
        if (caseType === 2) {
            detailItemsHtml = `
                <div class="detail-item">
                    <span class="detail-label">${currentLang === 'ne' ? 'Applicant Name (नाम)' : 'Applicant Name'}</span>
                    <span class="detail-value highlight">${item.name || 'N/A'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">${currentLang === 'ne' ? 'License Number (अनुमतिपत्र नं.)' : 'License Number'}</span>
                    <span class="detail-value">${item.licenseNumber || licenseNo}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">${currentLang === 'ne' ? 'Category (वर्ग)' : 'Category'}</span>
                    <span class="detail-value">${item.category || 'N/A'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">${currentLang === 'ne' ? 'Printed Date (मिती)' : 'Printed Date'}</span>
                    <span class="detail-value">${item.printedDate || 'N/A'}</span>
                </div>
                <div class="detail-item" style="grid-column: span 2;">
                    <span class="detail-label">${currentLang === 'ne' ? 'RECEIVED FROM / वितरण कोठा' : 'Counter / Room'}</span>
                    <span class="detail-value text-muted" style="font-size:0.88rem; font-style:italic;">${item.counterRoom}</span>
                </div>
            `;
        }
        // If Distributed / Collected: Show collected details WITHOUT phone number!
        else if (item.isCollected) {
            detailItemsHtml = `
                <div class="detail-item">
                    <span class="detail-label">${currentLang === 'ne' ? 'Applicant Name (नाम)' : 'Applicant Name'}</span>
                    <span class="detail-value highlight">${item.name || 'N/A'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">${currentLang === 'ne' ? 'License Number (अनुमतिपत्र नं.)' : 'License Number'}</span>
                    <span class="detail-value">${item.licenseNumber || licenseNo}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">${currentLang === 'ne' ? 'Category (वर्ग)' : 'Category'}</span>
                    <span class="detail-value">${item.category || 'N/A'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">${currentLang === 'ne' ? 'Collected Date (प्राप्त मिती)' : 'Collected Date'}</span>
                    <span class="detail-value">${item.receivedDate || item.printedDate || 'N/A'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">${currentLang === 'ne' ? 'Received By (बुझिलिने)' : 'Received By'}</span>
                    <span class="detail-value highlight">${item.receiverName || 'Self'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">${currentLang === 'ne' ? 'Distributed By (वितरणकर्ता)' : 'Distributed By'}</span>
                    <span class="detail-value">${item.distributedBy || 'Staff'}</span>
                </div>
            `;
        }
        // Case 3 (Pending Counter Pickup) or Case 4 (Direct Pickup): Show Received ID & Room
        else {
            detailItemsHtml = `
                <div class="detail-item">
                    <span class="detail-label">${currentLang === 'ne' ? 'Applicant Name (नाम)' : 'Applicant Name'}</span>
                    <span class="detail-value highlight">${item.name || 'N/A'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">${currentLang === 'ne' ? 'License Number (अनुमतिपत्र नं.)' : 'License Number'}</span>
                    <span class="detail-value">${item.licenseNumber || licenseNo}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">${currentLang === 'ne' ? 'Category (वर्ग)' : 'Category'}</span>
                    <span class="detail-value">${item.category || 'N/A'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">${currentLang === 'ne' ? 'Printed Date (मिती)' : 'Printed Date'}</span>
                    <span class="detail-value">${item.printedDate || 'N/A'}</span>
                </div>
                ${item.boxCode ? `
                <div class="detail-item">
                    <span class="detail-label">${currentLang === 'ne' ? 'Block / Box Code (बक्स कोड)' : 'Block / Box Code'}</span>
                    <span class="detail-value highlight">${item.boxCode}</span>
                </div>
                ` : ''}
                <div class="detail-item">
                    <span class="detail-label">${currentLang === 'ne' ? 'Room / Counter (कोठा नं.)' : 'Counter / Room'}</span>
                    <span class="detail-value">${item.counterRoom || 'N/A'}</span>
                </div>
                ${item.receivedId ? `
                <div class="detail-item">
                    <span class="detail-label">${currentLang === 'ne' ? 'RECEIVED ID / S.N.' : 'Received ID / S.N.'}</span>
                    <span class="detail-value highlight">${item.receivedId}</span>
                </div>
                ` : ''}
            `;
        }

        return `
            <div class="office-card">
                <div class="office-card-header">
                    <div>
                        <div class="office-name">${officeDisplayName}</div>
                        <div class="office-sub">${o.address || ''}</div>
                    </div>
                    ${badgeHtml}
                </div>
                <div class="details-grid">
                    ${detailItemsHtml}
                </div>
                ${instText ? `
                <div class="office-instruction-banner">
                    <i class="fa-solid fa-circle-info"></i> <strong>${currentLang === 'ne' ? 'सूचना' : 'Instructions'}:</strong> ${instText}
                </div>
                ` : ''}
                <div class="office-footer-info">
                    <div>
                        <button type="button" class="btn btn-sm btn-outline-sm btn-open-portal" data-office-id="${o.id}">
                            <i class="fa-solid fa-arrow-up-right-from-square"></i> Open Office Portal
                        </button>
                    </div>
                    <div class="office-links-group">
                        ${o.officialWebsite ? `<a href="${o.officialWebsite}" target="_blank" class="office-link" title="Official Office Portal"><i class="fa-solid fa-globe"></i> Official Site</a>` : ''}
                        ${o.mapUrl ? `<a href="${o.mapUrl}" target="_blank" class="office-link" title="Google Maps Directions"><i class="fa-solid fa-location-dot"></i> Maps</a>` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    // Render Guide Cards by Active Language
    function renderGuideGrid(lang) {
        const grid = document.getElementById('guideGrid');
        if (!grid) return;

        if (lang === 'ne') {
            grid.innerHTML = `
                <div class="guide-card">
                    <div class="guide-card-header">
                        <i class="fa-solid fa-building-columns text-success"></i>
                        <h3>TMO Ekantakuna (एकान्तकुना)</h3>
                    </div>
                    <ul class="guide-list">
                        <li>सक्कल राजस्व तिरेको रसिद</li>
                        <li>RECEIVED ID (उदा. <strong>8736</strong>)</li>
                        <li>वितरण कोठा: <strong>कोठा नं. 208-(ग)</strong></li>
                    </ul>
                </div>

                <div class="guide-card">
                    <div class="guide-card-header">
                        <i class="fa-solid fa-building-columns text-warning"></i>
                        <h3>TMO Kalanki (कलङ्की/ठूलोभर्याङ)</h3>
                    </div>
                    <ul class="guide-list">
                        <li>अनलाइन संकलन फारम भर्नुपर्ने (Collector Name & Mobile No.)</li>
                        <li>बक्स कोड (BOX CODE): उदा. <strong>01-G12-023</strong></li>
                        <li>सक्कल राजस्व रसिद र नागरिकता</li>
                    </ul>
                </div>

                <div class="guide-card">
                    <div class="guide-card-header">
                        <i class="fa-solid fa-building-columns text-info"></i>
                        <h3>TMO Chabahil (चाबहिल)</h3>
                    </div>
                    <ul class="guide-list">
                        <li>सक्कल राजस्व रसिद वा पुरानो लाइसेन्स</li>
                        <li>वितरण कोठा: <strong>वितरण कोठा नं. ३०१</strong></li>
                    </ul>
                </div>

                <div class="guide-card">
                    <div class="guide-card-header">
                        <i class="fa-solid fa-building-columns text-success"></i>
                        <h3>TMO Radhe Radhe (राधेराधे)</h3>
                    </div>
                    <ul class="guide-list">
                        <li>सक्कल राजस्व रसिद र नागरिकता</li>
                        <li>वितरण कोठा: <strong>कोठा नं. १</strong></li>
                    </ul>
                </div>
            `;
        } else {
            grid.innerHTML = `
                <div class="guide-card">
                    <div class="guide-card-header">
                        <i class="fa-solid fa-building-columns text-success"></i>
                        <h3>TMO Ekantakuna (Lalitpur)</h3>
                    </div>
                    <ul class="guide-list">
                        <li>Original Revenue Payment Receipt</li>
                        <li>RECEIVED ID (e.g. <strong>8736</strong>)</li>
                        <li>Distribution Counter: <strong>Room No. 208-(G)</strong></li>
                    </ul>
                </div>

                <div class="guide-card">
                    <div class="guide-card-header">
                        <i class="fa-solid fa-building-columns text-warning"></i>
                        <h3>TMO Kalanki (Thulobharyang)</h3>
                    </div>
                    <ul class="guide-list">
                        <li>Online Pre-Collection Form Required</li>
                        <li>BOX CODE (e.g. <strong>01-G12-023</strong>)</li>
                        <li>Original Payment Receipt & Citizenship Certificate</li>
                    </ul>
                </div>

                <div class="guide-card">
                    <div class="guide-card-header">
                        <i class="fa-solid fa-building-columns text-info"></i>
                        <h3>TMO Chabahil (Kathmandu)</h3>
                    </div>
                    <ul class="guide-list">
                        <li>Original Revenue Receipt or Old Driving License</li>
                        <li>Distribution Counter: <strong>Room No. 301</strong></li>
                    </ul>
                </div>

                <div class="guide-card">
                    <div class="guide-card-header">
                        <i class="fa-solid fa-building-columns text-success"></i>
                        <h3>TMO Radhe Radhe (Bhaktapur)</h3>
                    </div>
                    <ul class="guide-list">
                        <li>Original Payment Receipt & Citizenship Certificate</li>
                        <li>Distribution Counter: <strong>Room No. 1</strong></li>
                    </ul>
                </div>
            `;
        }
    }

    // Render Full Transport Management Offices Directory Grid
    function renderOfficesDirectory() {
        if (!officesDirectoryGrid) return;
        const offices = window.OfficeRegistry.offices || [];

        officesDirectoryGrid.innerHTML = offices.map(o => `
            <div class="directory-card">
                <div class="directory-title"><i class="fa-solid fa-building-flag" style="color:var(--brand-primary);"></i> ${currentLang === 'ne' ? (o.nepaliName || o.name) : o.name}</div>
                <p class="directory-desc">${o.description || 'Bagamati Province Transport Management Office'}</p>
                <div class="directory-details">
                    <div><i class="fa-solid fa-location-dot"></i> ${o.address || 'Bagamati Province'}</div>
                    ${o.phone ? `<div><i class="fa-solid fa-phone"></i> ${o.phone}</div>` : ''}
                </div>
                <div class="directory-actions">
                    ${o.officialWebsite ? `<a href="${o.officialWebsite}" target="_blank" class="btn btn-sm btn-secondary"><i class="fa-solid fa-globe"></i> Official Site</a>` : ''}
                    ${o.printCheckPortal ? `<a href="${o.printCheckPortal}" target="_blank" class="btn btn-sm btn-outline-sm"><i class="fa-solid fa-magnifying-glass"></i> Print Portal</a>` : ''}
                    ${o.mapUrl ? `<a href="${o.mapUrl}" target="_blank" class="btn btn-sm btn-outline-sm"><i class="fa-solid fa-diamond-turn-right"></i> Maps</a>` : ''}
                </div>
            </div>
        `).join('');
    }

    // Render Official Portals List
    function renderOfficialPortals() {
        if (!portalsGrid) return;
        const portals = window.OFFICIAL_PORTALS || [];
        portalsGrid.innerHTML = portals.map(p => `
            <a href="${p.url}" target="_blank" class="portal-card">
                <div class="portal-card-title">
                    <i class="fa-solid fa-arrow-up-right-from-square"></i> ${currentLang === 'ne' ? (p.nameNp || p.name) : (p.nameEn || p.name)}
                </div>
                <div class="portal-card-desc">${currentLang === 'ne' ? (p.descNp || p.desc) : (p.descEn || p.desc)}</div>
                <div class="portal-card-url">${p.url}</div>
            </a>
        `).join('');
    }

    // History Manager
    function saveToHistory(licenseNo) {
        try {
            let history = JSON.parse(localStorage.getItem('license_check_history') || '[]');
            history = history.filter(h => h !== licenseNo);
            history.unshift(licenseNo);
            if (history.length > 8) history = history.slice(0, 8);
            localStorage.setItem('license_check_history', JSON.stringify(history));
            renderHistory();
        } catch (e) {
            console.warn('LocalStorage history error:', e);
        }
    }

    function renderHistory() {
        try {
            const history = JSON.parse(localStorage.getItem('license_check_history') || '[]');
            if (history.length === 0) {
                historyList.innerHTML = `<p class="text-muted" style="font-size:0.85rem;">No recent searches yet.</p>`;
                clearHistoryBtn.classList.add('hidden');
            } else {
                clearHistoryBtn.classList.remove('hidden');
                historyList.innerHTML = history.map(item => `
                    <button type="button" class="history-item" data-val="${item}">
                        <i class="fa-solid fa-clock-rotate-left"></i> ${item}
                    </button>
                `).join('');

                historyList.querySelectorAll('.history-item').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const val = btn.dataset.val;
                        licenseInput.value = val;
                        clearInputBtn.classList.remove('hidden');
                        hideValidationError();
                        executeSearch(val);
                    });
                });
            }
        } catch (e) {
            console.warn(e);
        }
    }

    function initTheme() {
        const saved = localStorage.getItem('license_check_theme');
        if (saved === 'dark') {
            document.body.classList.remove('light-theme');
            document.body.classList.add('dark-theme');
        } else if (saved === 'light') {
            document.body.classList.remove('dark-theme');
            document.body.classList.add('light-theme');
        } else {
            // Respect system preference if no explicit user override is saved
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.body.classList.remove('light-theme');
                document.body.classList.add('dark-theme');
            } else {
                document.body.classList.remove('dark-theme');
                document.body.classList.add('light-theme');
            }
        }
    }

    // Listen for OS system theme changes dynamically if user hasn't explicitly set a preference
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (!localStorage.getItem('license_check_theme')) {
                initTheme();
            }
        });
    }

    // AI & URL Parameters Checker
    async function checkUrlParameters() {
        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get('q') || urlParams.get('license') || urlParams.get('search');
        const format = (urlParams.get('format') || '').toLowerCase();

        if (query) {
            if (!isValidLicenseFormat(query)) {
                showValidationError("गलत लाइसेन्स ढाँचा! Invalid license format in URL!");
                return;
            }

            const formattedQuery = formatLicenseNumber(query);
            licenseInput.value = formattedQuery || query;
            clearInputBtn.classList.remove('hidden');

            if (format === 'json') {
                document.body.innerHTML = '<pre style="padding:20px; font-family:monospace; background:#0f172a; color:#38bdf8;">Querying license status across transport offices...</pre>';
                const offices = window.OfficeRegistry.getEnabledOffices();
                const promises = offices.map(o => fetchOfficeStatus(o, licenseInput.value));
                const results = await Promise.allSettled(promises);

                const output = {
                    query: licenseInput.value,
                    searchedAt: new Date().toISOString(),
                    summary: {
                        isPrinted: results.some(r => r.status === 'fulfilled' && r.value.found && r.value.isPrinted),
                        totalOfficesChecked: offices.length
                    },
                    results: results.map((r, i) => ({
                        officeId: offices[i].id,
                        officeName: offices[i].name,
                        officialWebsite: offices[i].officialWebsite || null,
                        found: r.status === 'fulfilled' ? r.value.found : false,
                        caseType: r.status === 'fulfilled' ? r.value.caseType : 1,
                        status: r.status === 'fulfilled' ? r.value.status : 'Error',
                        isPrinted: r.status === 'fulfilled' ? r.value.isPrinted : false,
                        requiresFormFill: r.status === 'fulfilled' ? r.value.requiresFormFill : false,
                        details: r.status === 'fulfilled' && r.value.found ? {
                            name: r.value.name,
                            licenseNumber: r.value.licenseNumber,
                            category: r.value.category,
                            printedDate: r.value.printedDate,
                            blockNumber: r.value.blockNumber,
                            boxCode: r.value.boxCode || null,
                            counterRoom: r.value.counterRoom,
                            sn: r.value.sn,
                            receivedId: r.value.receivedId || null,
                            distributedBy: r.value.distributedBy || null,
                            receivedDate: r.value.receivedDate || null,
                            receiverName: r.value.receiverName || null
                        } : null
                    }))
                };

                document.body.innerHTML = `<pre style="padding:20px; font-family:monospace; background:#0f172a; color:#38bdf8; word-wrap:break-word; white-space:pre-wrap;">${JSON.stringify(output, null, 2)}</pre>`;
            } else {
                executeSearch(licenseInput.value);
            }
        }
    }
});
