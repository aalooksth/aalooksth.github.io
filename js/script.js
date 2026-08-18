document.addEventListener('DOMContentLoaded', () => {

    // Inject global theme elements (Canvas, Scripts, Backgrounds)
    const scriptTags = document.getElementsByTagName('script');
    let baseUrl = '';
    for (let s of scriptTags) {
        if (s.src && s.src.includes('js/script.js')) {
            baseUrl = s.src.replace('js/script.js', '');
            break;
        }
    }

    if (!document.getElementById('three-canvas')) {
        const canvas = document.createElement('canvas');
        canvas.id = 'three-canvas';
        document.body.prepend(canvas);
    }
    
    // Inject Three.js modules if not present
    if (!document.querySelector('script[src*="three-journey.js"]')) {
        const threeScript = document.createElement('script');
        threeScript.type = 'module';
        threeScript.src = baseUrl + 'js/three-journey.js';
        document.body.appendChild(threeScript);
    }

    // Inject bugs.js if not present
    if (!document.querySelector('script[src*="bugs.js"]')) {
        const bugsScript = document.createElement('script');
        bugsScript.src = baseUrl + 'js/bugs.js';
        document.body.appendChild(bugsScript);
    }

    // Inject seasonal containers if they don't exist
    if (!document.getElementById('seasonal-top')) {
        const topEl = document.createElement('div');
        topEl.id = 'seasonal-top';
        document.body.prepend(topEl);
    }
    if (!document.getElementById('seasonal-bottom')) {
        const bottomEl = document.createElement('div');
        bottomEl.id = 'seasonal-bottom';
        document.body.prepend(bottomEl);
    }

    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links li');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('toggle');
    });

    // Close menu when clicking a link
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('toggle');
        });
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Theme Toggle Functionality (Light ☀️ / System 💻 / Dark 🌑)
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const themeModes = ['auto', 'light', 'dark'];
    let currentThemeMode = localStorage.getItem('alok_site_theme') || 'auto';

    function applyThemeMode(mode) {
        let isDark = false;
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const now = new Date();
        const month = now.getMonth();
        const hour = now.getHours();
        
        let seasonName = 'summer';
        if (month >= 2 && month <= 4) seasonName = 'spring';
        else if (month >= 5 && month <= 7) seasonName = 'summer';
        else if (month >= 8 && month <= 10) seasonName = 'fall';
        else seasonName = 'winter';

        let isDay = (hour >= 6 && hour < 19);

        // Clean up previous seasonal/time classes
        document.body.classList.remove('theme-auto', 'season-spring', 'season-summer', 'season-fall', 'season-winter', 'time-day', 'time-night');
        document.body.classList.add(`season-${seasonName}`);

        if (mode === 'dark') {
            isDark = true;
            document.body.classList.add('time-night');
        } else if (mode === 'light') {
            isDark = false;
            document.body.classList.add('time-day');
        } else {
            // mode === 'auto' (System preference + Day/Night ambient)
            document.body.classList.add('theme-auto');
            isDark = prefersDark;
            document.body.classList.add(isDay ? 'time-day' : 'time-night');
        }

        if (isDark) {
            document.body.classList.remove('light-theme');
            document.body.classList.add('dark-theme');
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.body.classList.remove('dark-theme');
            document.body.classList.add('light-theme');
            document.documentElement.setAttribute('data-theme', 'light');
        }
        
        // Update Icon
        if (themeToggleBtn) {
            if (mode === 'auto') {
                themeToggleBtn.innerHTML = '<i class="fa-solid fa-laptop" title="Theme: System"></i>';
            } else if (mode === 'light') {
                themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun" title="Theme: Light"></i>';
            } else if (mode === 'dark') {
                themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon" title="Theme: Dark"></i>';
            }
        }
    }

    // Expose globally for sub-pages
    window.applySiteThemeMode = applyThemeMode;

    applyThemeMode(currentThemeMode);

    // Cross-tab theme sync
    window.addEventListener('storage', (e) => {
        if (e.key === 'alok_site_theme') {
            currentThemeMode = e.newValue || 'auto';
            applyThemeMode(currentThemeMode);
        }
    });

    // Listen for OS system theme changes dynamically
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
            if (currentThemeMode === 'auto') {
                applyThemeMode('auto');
            }
        });
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            let nextIndex = themeModes.indexOf(currentThemeMode) + 1;
            if (nextIndex >= themeModes.length) nextIndex = 0;
            currentThemeMode = themeModes[nextIndex];
            localStorage.setItem('alok_site_theme', currentThemeMode);
            applyThemeMode(currentThemeMode);
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.section-title, .project-card, .skill-category, .timeline-item, .contact-card, .hero-content, .hero-image-container');
    
    animatedElements.forEach((el) => {
        el.classList.add('hidden-element');
        observer.observe(el);
    });

    // Site-wide AD/BS Clock
    const nepaliDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
    function toNepaliDigits(num) {
        return num.toString().replace(/[0-9]/g, match => nepaliDigits[match]);
    }

    function updateClock() {
        const clockEl = document.getElementById('siteClock');
        if (!clockEl) return;
        const now = new Date();
        const timeOpts = { hour: '2-digit', minute: '2-digit' }; // removed seconds to reduce clutter
        const dateOpts = { month: 'short', day: 'numeric' };
        const timeStr = now.toLocaleTimeString('en-US', timeOpts);
        const dateStr = now.toLocaleDateString('en-US', dateOpts);
        const adYmd = now.getFullYear() + "-" + String(now.getMonth()+1).padStart(2,'0') + "-" + String(now.getDate()).padStart(2,'0');
        
        let bsStr = "";
        if (window['@sbmdkl/nepali-date-converter']) {
            try {
                const rawBs = window['@sbmdkl/nepali-date-converter'].adToBs(adYmd);
                const parts = rawBs.split('-');
                const bsMonthNames = ["वैशाख", "जेठ", "असार", "साउन", "भदौ", "असोज", "कात्तिक", "मंसिर", "पुष", "माघ", "फागुन", "चैत"];
                const bsM = parseInt(parts[1], 10);
                bsStr = `${toNepaliDigits(parts[2])} ${bsMonthNames[bsM - 1]} ${toNepaliDigits(parts[0])}`;
            } catch(e) {}
        }
        
        clockEl.innerHTML = `<span style="font-weight: 500;">${dateStr} ${timeStr}</span>` + 
            (bsStr ? `<span style="color:var(--text-muted); font-size: 0.8em; margin-left: 0.5rem; border-left: 1px solid var(--border-color); padding-left: 0.5rem;">वि.सं. ${bsStr}</span>` : "");
        clockEl.style.flexDirection = "row";
        clockEl.style.alignItems = "center";
    }
    setInterval(updateClock, 1000);
    updateClock();

    // Automatic Experience Duration Calculator
    function calculateDurations() {
        document.querySelectorAll('.timeline-duration[data-start]').forEach(el => {
            const startStr = el.getAttribute('data-start'); // format: YYYY-MM
            const endStr = el.getAttribute('data-end') || 'present'; // format: YYYY-MM or 'present'
            
            const startParts = startStr.split('-');
            const startDate = new Date(parseInt(startParts[0], 10), parseInt(startParts[1], 10) - 1, 1);
            
            let endDate = new Date();
            if (endStr !== 'present') {
                const endParts = endStr.split('-');
                endDate = new Date(parseInt(endParts[0], 10), parseInt(endParts[1], 10) - 1, 1);
            }
            
            let months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth()) + 1;
            if (months < 1) months = 1;
            
            const yrs = Math.floor(months / 12);
            const mos = months % 12;
            
            let durationText = '';
            if (yrs > 0 && mos > 0) {
                durationText = `${yrs} yr${yrs > 1 ? 's' : ''} ${mos} mo${mos > 1 ? 's' : ''}`;
            } else if (yrs > 0) {
                durationText = `${yrs} yr${yrs > 1 ? 's' : ''}`;
            } else {
                durationText = `${mos} mo${mos > 1 ? 's' : ''}`;
            }
            
            el.innerHTML = `<i class="fa-regular fa-clock"></i> ${durationText}`;
        });

        const totalExpEl = document.getElementById('totalExpDisplay');
        if (totalExpEl) {
            const careerStart = new Date(2017, 8, 1); // Sep 2017 (0-indexed: 8 is Sept)
            const now = new Date();
            const totalMonths = (now.getFullYear() - careerStart.getFullYear()) * 12 + (now.getMonth() - careerStart.getMonth()) + 1;
            const totalYrs = Math.floor(totalMonths / 12);
            const remMos = totalMonths % 12;
            totalExpEl.textContent = `${totalYrs}+ Years (${totalYrs} yrs ${remMos} mos)`;
        }
    }
    calculateDurations();

    // Register Service Worker for PWA
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                })
                .catch(err => {
                    console.log('ServiceWorker registration failed: ', err);
                });
        });
    }
});
