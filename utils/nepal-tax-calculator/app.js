// app.js
import { calculateTax } from './calculator.js';

// --- State Variables ---
let currentTab = 'same'; // 'same' or 'diff'
let currentViewMode = 'compare'; // 'compare', '82', or '83'
let currentNavTab = 'calc'; // 'calc' or 'features'
let deferredPrompt = null;

// --- DOM Elements ---
const themeToggleBtn = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const installBtn = document.getElementById('install-btn');
const pwaBanner = document.getElementById('pwa-banner');
const bannerInstallBtn = document.getElementById('banner-install-btn');

// --- Synchronized Theme Management (Light / System / Dark) ---
const themeModes = ['auto', 'light', 'dark'];
let currentThemeMode = localStorage.getItem('alok_site_theme') || 'auto';

function applyTaxTheme(mode) {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    let isDark = false;
    if (mode === 'dark') isDark = true;
    else if (mode === 'light') isDark = false;
    else isDark = prefersDark;

    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    if (isDark) {
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
    }

    if (themeIcon) {
        if (mode === 'auto') themeIcon.textContent = 'brightness_medium';
        else if (mode === 'light') themeIcon.textContent = 'light_mode';
        else if (mode === 'dark') themeIcon.textContent = 'dark_mode';
    }
}

applyTaxTheme(currentThemeMode);

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        let nextIndex = themeModes.indexOf(currentThemeMode) + 1;
        if (nextIndex >= themeModes.length) nextIndex = 0;
        currentThemeMode = themeModes[nextIndex];
        localStorage.setItem('alok_site_theme', currentThemeMode);
        applyTaxTheme(currentThemeMode);
    });
}

window.addEventListener('storage', (e) => {
    if (e.key === 'alok_site_theme') {
        currentThemeMode = e.newValue || 'auto';
        applyTaxTheme(currentThemeMode);
    }
});

if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (currentThemeMode === 'auto') applyTaxTheme('auto');
    });
}

// Top Navigation Elements
const navCalcBtn = document.getElementById('nav-calc');
const navNegotiateBtn = document.getElementById('nav-negotiate');
const navFeaturesBtn = document.getElementById('nav-features');
const navAiBtn = document.getElementById('nav-ai');
const calculatorView = document.getElementById('calculator-view');
const negotiateView = document.getElementById('negotiate-view');
const featuresView = document.getElementById('features-view');
const aiUseView = document.getElementById('ai-use-view');

// View Mode Elements
const viewCompareBtn = document.getElementById('view-compare');
const view82Btn = document.getElementById('view-82');
const view83Btn = document.getElementById('view-83');

const tabSameBtn = document.getElementById('tab-same');
const tabDiffBtn = document.getElementById('tab-diff');
const mainContentLayout = document.getElementById('main-content-layout');

// Copy Buttons, Reset Button, Share/Export Buttons and Tabs Container
const btnCopyToB = document.getElementById('btn-copy-to-b');
const btnCopyToA = document.getElementById('btn-copy-to-a');
const btnReset = document.getElementById('btn-reset');
const btnShare = document.getElementById('btn-share');
const btnExportPdf = document.getElementById('btn-export-pdf');
const modeYSwitch = document.getElementById('mode-y');
const structureTabsContainer = document.getElementById('structure-tabs-container');

// Comparison selector (New vs New / Existing vs New)
const diffModeContainer = document.getElementById('diff-mode-container');
const diffModeSelect = document.getElementById('diff-mode-select');

// Profile A elements
const basicInputA = document.getElementById('basic-a');
const allowanceInputA = document.getElementById('allowance-a');
const bonusInputA = document.getElementById('bonus-a');
const splitBonusSwitchA = document.getElementById('split-bonus-a');
const statusSwitchA = document.getElementById('status-a'); // switch checkbox
const freelanceInputA = document.getElementById('freelance-a');
const otherInputA = document.getElementById('other-a');
const remoteSelectA = document.getElementById('remote-a');
const ssfSwitchA = document.getElementById('ssf-a');
const epfSwitchA = document.getElementById('epf-a');
const citInputA = document.getElementById('cit-a'); // numeric input
const gratuityWrapperA = document.getElementById('gratuity-wrapper-a');
const gratuityA = document.getElementById('gratuity-a');
const lifeInputA = document.getElementById('life-a');
const healthInputA = document.getElementById('health-a');
const medicalInputA = document.getElementById('medical-a');
const femaleSwitchA = document.getElementById('female-a');

// Profile B elements (used in 'different' structures mode)
const cardProfileB = document.getElementById('card-profile-b');
const basicInputB = document.getElementById('basic-b');
const allowanceInputB = document.getElementById('allowance-b');
const bonusInputB = document.getElementById('bonus-b');
const splitBonusSwitchB = document.getElementById('split-bonus-b');
const statusSwitchB = document.getElementById('status-b'); // switch checkbox
const freelanceInputB = document.getElementById('freelance-b');
const otherInputB = document.getElementById('other-b');
const remoteSelectB = document.getElementById('remote-b');
const ssfSwitchB = document.getElementById('ssf-b');
const epfSwitchB = document.getElementById('epf-b');
const citInputB = document.getElementById('cit-b'); // numeric input
const gratuityWrapperB = document.getElementById('gratuity-wrapper-b');
const gratuityB = document.getElementById('gratuity-b');
const lifeInputB = document.getElementById('life-b');
const healthInputB = document.getElementById('health-b');
const medicalInputB = document.getElementById('medical-b');
const femaleSwitchB = document.getElementById('female-b');

// Negotiation Mode elements
const negoBaseProfile = document.getElementById('nego-base-profile');
const negoBasicType = document.getElementById('nego-basic-type');
const negoBasicAction = document.getElementById('nego-basic-action');
const negoBasicVal = document.getElementById('nego-basic-val');
const negoAllowanceType = document.getElementById('nego-allowance-type');
const negoAllowanceAction = document.getElementById('nego-allowance-action');
const negoAllowanceVal = document.getElementById('nego-allowance-val');

// Negotiation result elements
const negoCashMonthlyBase = document.getElementById('nego-cash-monthly-base');
const negoCashAnnualBase = document.getElementById('nego-cash-annual-base');
const negoCashMonthlyNoteBase = document.getElementById('nego-cash-monthly-note-base');
const negoTaxMonthlyBase = document.getElementById('nego-tax-monthly-base');
const negoTaxAnnualBase = document.getElementById('nego-tax-annual-base');
const negoTaxMonthlyNoteBase = document.getElementById('nego-tax-monthly-note-base');
const negoCtcMonthlyBase = document.getElementById('nego-ctc-monthly-base');
const negoCtcAnnualBase = document.getElementById('nego-ctc-annual-base');
const negoCtcMonthlyNoteBase = document.getElementById('nego-ctc-monthly-note-base');
const negoSavingsMonthlyBase = document.getElementById('nego-savings-monthly-base');
const negoSavingsAnnualBase = document.getElementById('nego-savings-annual-base');
const negoSlabBarContainerBase = document.getElementById('nego-slab-bar-container-base');
const negoSlabBarLegendBase = document.getElementById('nego-slab-bar-legend-base');

const negoCashMonthlyNego = document.getElementById('nego-cash-monthly-nego');
const negoCashAnnualNego = document.getElementById('nego-cash-annual-nego');
const negoCashMonthlyNoteNego = document.getElementById('nego-cash-monthly-note-nego');
const negoTaxMonthlyNego = document.getElementById('nego-tax-monthly-nego');
const negoTaxAnnualNego = document.getElementById('nego-tax-annual-nego');
const negoTaxMonthlyNoteNego = document.getElementById('nego-tax-monthly-note-nego');
const negoCtcMonthlyNego = document.getElementById('nego-ctc-monthly-nego');
const negoCtcAnnualNego = document.getElementById('nego-ctc-annual-nego');
const negoCtcMonthlyNoteNego = document.getElementById('nego-ctc-monthly-note-nego');
const negoSavingsMonthlyNego = document.getElementById('nego-savings-monthly-nego');
const negoSavingsAnnualNego = document.getElementById('nego-savings-annual-nego');
const negoSlabBarContainerNego = document.getElementById('nego-slab-bar-container-nego');
const negoSlabBarLegendNego = document.getElementById('nego-slab-bar-legend-nego');

const negoComparisonTableBody = document.getElementById('nego-comparison-table-body');

// Result elements (General layout containers)
const savingCalloutEl = document.getElementById('saving-callout');
const savingCalloutTextEl = document.getElementById('saving-callout-text');
const savingCalloutValueEl = document.getElementById('saving-callout-value');

const comparisonTableBody = document.getElementById('comparison-table-body');
const slabBreakdown82El = document.getElementById('slab-breakdown-82');
const slabBreakdown83El = document.getElementById('slab-breakdown-83');

const slabBar82El = document.getElementById('slab-bar-container-82');
const slabLegend82El = document.getElementById('slab-bar-legend-82');
const slabBar83El = document.getElementById('slab-bar-container-83');
const slabLegend83El = document.getElementById('slab-bar-legend-83');

const optTipsCard = document.getElementById('optimization-tips-card');
const optTipsContent = document.getElementById('optimization-tips-content');

const tableHeaderA = document.getElementById('table-hdr-a');
const tableHeaderB = document.getElementById('table-hdr-b');

// --- PWA Registration & Lifecycle ---
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('Service Worker registered successfully!', reg.scope))
      .catch(err => console.error('Service Worker registration failed:', err));
  });
}

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.classList.remove('hidden');
  pwaBanner.classList.remove('hidden');
});

const handlePwaInstallation = async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  console.log(`PWA installation choice: ${outcome}`);
  deferredPrompt = null;
  installBtn.classList.add('hidden');
  pwaBanner.classList.add('hidden');
};

installBtn.addEventListener('click', handlePwaInstallation);
bannerInstallBtn.addEventListener('click', handlePwaInstallation);

// --- Theme Management ---
function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
  themeIcon.textContent = theme === 'dark' ? 'light_mode' : 'dark_mode';
}

themeToggleBtn.addEventListener('click', toggleTheme);

// --- Retirement Mutual Exclusivity Rules ---
ssfSwitchA.addEventListener('change', (e) => {
  if (e.target.selected && epfSwitchA.selected) {
    epfSwitchA.selected = false;
  }
  syncSsfAndGratuity();
  triggerRecalculation();
});
epfSwitchA.addEventListener('change', (e) => {
  if (e.target.selected && ssfSwitchA.selected) {
    ssfSwitchA.selected = false;
  }
  syncSsfAndGratuity();
  triggerRecalculation();
});
ssfSwitchB.addEventListener('change', (e) => {
  if (e.target.selected && epfSwitchB.selected) {
    epfSwitchB.selected = false;
  }
  syncSsfAndGratuity();
  triggerRecalculation();
});
epfSwitchB.addEventListener('change', (e) => {
  if (e.target.selected && ssfSwitchB.selected) {
    ssfSwitchB.selected = false;
  }
  syncSsfAndGratuity();
  triggerRecalculation();
});

// --- Tab Controls ---
tabSameBtn.addEventListener('click', () => {
  if (currentTab === 'same') return;
  currentTab = 'same';
  triggerRecalculation();
});

tabDiffBtn.addEventListener('click', () => {
  if (currentTab === 'diff') return;
  currentTab = 'diff';
  triggerRecalculation();
});

// --- Copy Profile Details Handlers ---
btnCopyToB.addEventListener('click', () => {
  basicInputB.value = basicInputA.value;
  allowanceInputB.value = allowanceInputA.value;
  bonusInputB.value = bonusInputA.value;
  splitBonusSwitchB.selected = splitBonusSwitchA.selected;
  statusSwitchB.selected = statusSwitchA.selected;
  freelanceInputB.value = freelanceInputA.value;
  otherInputB.value = otherInputA.value;
  remoteSelectB.value = remoteSelectA.value;
  ssfSwitchB.selected = ssfSwitchA.selected;
  epfSwitchB.selected = epfSwitchA.selected;
  citInputB.value = citInputA.value;
  if (gratuityB && gratuityA) {
    gratuityB.selected = gratuityA.selected;
  }
  lifeInputB.value = lifeInputA.value;
  healthInputB.value = healthInputA.value;
  medicalInputB.value = medicalInputA.value;
  femaleSwitchB.selected = femaleSwitchA.selected;
  syncSsfAndGratuity();
  triggerRecalculation();
});

btnCopyToA.addEventListener('click', () => {
  basicInputA.value = basicInputB.value;
  allowanceInputA.value = allowanceInputB.value;
  bonusInputA.value = bonusInputB.value;
  splitBonusSwitchA.selected = splitBonusSwitchB.selected;
  statusSwitchA.selected = statusSwitchB.selected;
  freelanceInputA.value = freelanceInputB.value;
  otherInputA.value = otherInputB.value;
  remoteSelectA.value = remoteSelectB.value;
  ssfSwitchA.selected = ssfSwitchB.selected;
  epfSwitchA.selected = epfSwitchB.selected;
  citInputA.value = citInputB.value;
  if (gratuityA && gratuityB) {
    gratuityA.selected = gratuityB.selected;
  }
  lifeInputA.value = lifeInputB.value;
  healthInputA.value = healthInputB.value;
  medicalInputA.value = medicalInputB.value;
  femaleSwitchA.selected = femaleSwitchB.selected;
  syncSsfAndGratuity();
  triggerRecalculation();
});

// --- Reset Calculator Handler ---
btnReset.addEventListener('click', () => {
  // Reset all Profile A values
  basicInputA.value = '';
  allowanceInputA.value = '';
  bonusInputA.value = '';
  splitBonusSwitchA.selected = false;
  statusSwitchA.selected = false;
  freelanceInputA.value = '';
  otherInputA.value = '';
  remoteSelectA.value = 'None';
  ssfSwitchA.selected = true;
  epfSwitchA.selected = false;
  citInputA.value = '';
  if (gratuityA) gratuityA.selected = false;
  lifeInputA.value = '';
  healthInputA.value = '';
  medicalInputA.value = '';
  femaleSwitchA.selected = false;

  // Reset all Profile B values
  basicInputB.value = '';
  allowanceInputB.value = '';
  bonusInputB.value = '';
  splitBonusSwitchB.selected = false;
  statusSwitchB.selected = false;
  freelanceInputB.value = '';
  otherInputB.value = '';
  remoteSelectB.value = 'None';
  ssfSwitchB.selected = true;
  epfSwitchB.selected = false;
  citInputB.value = '';
  if (gratuityB) gratuityB.selected = false;
  lifeInputB.value = '';
  healthInputB.value = '';
  medicalInputB.value = '';
  femaleSwitchB.selected = false;

  // Reset Negotiation adjustments
  negoBaseProfile.value = 'profileA_83';
  negoBasicType.value = 'percent';
  negoBasicAction.value = 'increase';
  negoBasicVal.value = '';
  negoAllowanceType.value = 'percent';
  negoAllowanceAction.value = 'increase';
  negoAllowanceVal.value = '';

  // Reset states
  currentTab = 'same';
  currentViewMode = 'compare';
  diffModeSelect.value = '82_vs_83';
  currentNavTab = 'calc';
  if (modeYSwitch) {
    modeYSwitch.selected = false;
    applyModeY(false);
  }

  // Sync navigation view
  switchNavTab('calc');
  switchViewMode('compare');
  syncSsfAndGratuity();
});

// Watch comparison basis select dropdown
diffModeSelect.addEventListener('change', triggerRecalculation);

// Watch Mode Y Switch
if (modeYSwitch) {
  modeYSwitch.addEventListener('change', (e) => {
    applyModeY(e.target.selected);
    triggerRecalculation();
  });
}

// --- State Persistence ---
function saveInputsToLocalStorage() {
  const state = {
    currentTab,
    currentViewMode,
    currentNavTab,
    diffMode: diffModeSelect.value,
    basicA: basicInputA.value,
    allowanceA: allowanceInputA.value,
    bonusA: bonusInputA.value,
    splitBonusA: splitBonusSwitchA.selected,
    statusA: statusSwitchA.selected,
    freelanceA: freelanceInputA.value,
    otherA: otherInputA.value,
    remoteA: remoteSelectA.value,
    ssfA: ssfSwitchA.selected,
    epfA: epfSwitchA.selected,
    citA: citInputA.value,
    lifeA: lifeInputA.value,
    healthA: healthInputA.value,
    medicalA: medicalInputA.value,
    femaleA: femaleSwitchA.selected,

    basicB: basicInputB.value,
    allowanceB: allowanceInputB.value,
    bonusB: bonusInputB.value,
    splitBonusB: splitBonusSwitchB.selected,
    statusB: statusSwitchB.selected,
    freelanceB: freelanceInputB.value,
    otherB: otherInputB.value,
    remoteB: remoteSelectB.value,
    ssfB: ssfSwitchB.selected,
    epfB: epfSwitchB.selected,
    citB: citInputB.value,
    lifeB: lifeInputB.value,
    healthB: healthInputB.value,
    medicalB: medicalInputB.value,
    femaleB: femaleSwitchB.selected,
    modeY: modeYSwitch ? modeYSwitch.selected : false,
    gratuityA: gratuityA ? gratuityA.selected : false,
    gratuityB: gratuityB ? gratuityB.selected : false,

    // Negotiation state
    negoBaseProfile: negoBaseProfile.value,
    negoBasicType: negoBasicType.value,
    negoBasicAction: negoBasicAction.value,
    negoBasicVal: negoBasicVal.value,
    negoAllowanceType: negoAllowanceType.value,
    negoAllowanceAction: negoAllowanceAction.value,
    negoAllowanceVal: negoAllowanceVal.value
  };
  localStorage.setItem('nepal_tax_calc_state', JSON.stringify(state));
}

function loadInputsFromLocalStorage() {
  const serialized = localStorage.getItem('nepal_tax_calc_state');
  if (!serialized) return;
  try {
    const state = JSON.parse(serialized);
    
    // Load tab
    if (state.currentTab) {
      currentTab = state.currentTab;
    }

    // Load Navigation Tab
    if (state.currentNavTab) {
      switchNavTab(state.currentNavTab);
    }

    // Load View Mode
    if (state.currentViewMode) {
      switchViewMode(state.currentViewMode);
    }

    if (state.diffMode !== undefined) {
      diffModeSelect.value = state.diffMode;
    }

    // Load Profile A
    if (state.basicA !== undefined) {
      basicInputA.value = state.basicA;
    }
    if (state.allowanceA !== undefined) allowanceInputA.value = state.allowanceA;
    if (state.bonusA !== undefined) bonusInputA.value = state.bonusA;
    if (state.splitBonusA !== undefined) splitBonusSwitchA.selected = state.splitBonusA;
    if (state.statusA !== undefined) statusSwitchA.selected = state.statusA;
    if (state.freelanceA !== undefined) freelanceInputA.value = state.freelanceA;
    if (state.otherA !== undefined) otherInputA.value = state.otherA;
    if (state.remoteA !== undefined) remoteSelectA.value = state.remoteA;
    if (state.ssfA !== undefined) ssfSwitchA.selected = state.ssfA;
    if (state.epfA !== undefined) epfSwitchA.selected = state.epfA;
    if (state.citA !== undefined) citInputA.value = state.citA;
    if (state.lifeA !== undefined) lifeInputA.value = state.lifeA;
    if (state.healthA !== undefined) healthInputA.value = state.healthA;
    if (state.medicalA !== undefined) medicalInputA.value = state.medicalA;
    if (state.femaleA !== undefined) femaleSwitchA.selected = state.femaleA;

    // Load Profile B
    if (state.basicB !== undefined) {
      basicInputB.value = state.basicB;
    }
    if (state.allowanceB !== undefined) allowanceInputB.value = state.allowanceB;
    if (state.bonusB !== undefined) bonusInputB.value = state.bonusB;
    if (state.splitBonusB !== undefined) splitBonusSwitchB.selected = state.splitBonusB;
    if (state.statusB !== undefined) statusSwitchB.selected = state.statusB;
    if (state.freelanceB !== undefined) freelanceInputB.value = state.freelanceB;
    if (state.otherB !== undefined) otherInputB.value = state.otherB;
    if (state.remoteB !== undefined) remoteSelectB.value = state.remoteB;
    if (state.ssfB !== undefined) ssfSwitchB.selected = state.ssfB;
    if (state.epfB !== undefined) epfSwitchB.selected = state.epfB;
    if (state.citB !== undefined) citInputB.value = state.citB;
    if (state.lifeB !== undefined) lifeInputB.value = state.lifeB;
    if (state.healthB !== undefined) healthInputB.value = state.healthB;
    if (state.medicalB !== undefined) medicalInputB.value = state.medicalB;
    if (state.femaleB !== undefined) femaleSwitchB.selected = state.femaleB;

    if (state.modeY !== undefined && modeYSwitch) {
      modeYSwitch.selected = state.modeY;
      applyModeY(state.modeY);
    }

    if (state.gratuityA !== undefined && gratuityA) {
      gratuityA.selected = state.gratuityA;
    }
    if (state.gratuityB !== undefined && gratuityB) {
      gratuityB.selected = state.gratuityB;
    }
    syncSsfAndGratuity();

    // Load Negotiation inputs
    if (state.negoBaseProfile !== undefined) negoBaseProfile.value = state.negoBaseProfile;
    if (state.negoBasicType !== undefined) negoBasicType.value = state.negoBasicType;
    if (state.negoBasicAction !== undefined) negoBasicAction.value = state.negoBasicAction;
    if (state.negoBasicVal !== undefined) negoBasicVal.value = state.negoBasicVal;
    if (state.negoAllowanceType !== undefined) negoAllowanceType.value = state.negoAllowanceType;
    if (state.negoAllowanceAction !== undefined) negoAllowanceAction.value = state.negoAllowanceAction;
    if (state.negoAllowanceVal !== undefined) negoAllowanceVal.value = state.negoAllowanceVal;

  } catch (e) {
    console.error("Failed to parse persisted state", e);
  }
}

// --- Navigation Controls ---
navCalcBtn.addEventListener('click', () => {
  switchNavTab('calc');
});

navNegotiateBtn.addEventListener('click', () => {
  switchNavTab('negotiate');
});

navFeaturesBtn.addEventListener('click', () => {
  switchNavTab('features');
});

navAiBtn.addEventListener('click', () => {
  switchNavTab('ai');
});

function switchNavTab(tab) {
  currentNavTab = tab;
  navCalcBtn.classList.toggle('active', tab === 'calc');
  navNegotiateBtn.classList.toggle('active', tab === 'negotiate');
  navFeaturesBtn.classList.toggle('active', tab === 'features');
  navAiBtn.classList.toggle('active', tab === 'ai');
  
  if (tab === 'calc') {
    calculatorView.classList.remove('hidden');
    negotiateView.classList.add('hidden');
    featuresView.classList.add('hidden');
    aiUseView.classList.add('hidden');
  } else if (tab === 'negotiate') {
    negotiateView.classList.remove('hidden');
    calculatorView.classList.add('hidden');
    featuresView.classList.add('hidden');
    aiUseView.classList.add('hidden');
    syncNegoBaseProfileSelect();
    triggerNegotiationRecalculation();
  } else if (tab === 'features') {
    featuresView.classList.remove('hidden');
    calculatorView.classList.add('hidden');
    negotiateView.classList.add('hidden');
    aiUseView.classList.add('hidden');
  } else if (tab === 'ai') {
    aiUseView.classList.remove('hidden');
    calculatorView.classList.add('hidden');
    negotiateView.classList.add('hidden');
    featuresView.classList.add('hidden');
  }
  saveInputsToLocalStorage();
}

// --- View Mode Controls ---
viewCompareBtn.addEventListener('click', () => {
  switchViewMode('compare');
});

view82Btn.addEventListener('click', () => {
  switchViewMode('82');
});

view83Btn.addEventListener('click', () => {
  switchViewMode('83');
});

function switchViewMode(mode) {
  currentViewMode = mode;
  
  // Update active status on buttons
  viewCompareBtn.classList.toggle('active', mode === 'compare');
  view82Btn.classList.toggle('active', mode === '82');
  view83Btn.classList.toggle('active', mode === '83');

  // Toggle layout classes on container for CSS styling
  mainContentLayout.classList.toggle('view-mode-82', mode === '82');
  mainContentLayout.classList.toggle('view-mode-83', mode === '83');

  triggerRecalculation();
}

// --- Bind all inputs to trigger Recalculation ---
const inputsToWatch = [
  basicInputA, allowanceInputA, bonusInputA, freelanceInputA, otherInputA, remoteSelectA, citInputA, lifeInputA, healthInputA, medicalInputA,
  basicInputB, allowanceInputB, bonusInputB, freelanceInputB, otherInputB, remoteSelectB, citInputB, lifeInputB, healthInputB, medicalInputB
];
inputsToWatch.forEach(input => {
  input.addEventListener('input', () => {
    triggerRecalculation();
    if (currentNavTab === 'negotiate') triggerNegotiationRecalculation();
  });
  input.addEventListener('change', () => {
    triggerRecalculation();
    if (currentNavTab === 'negotiate') triggerNegotiationRecalculation();
  });
});

// Watch custom switches
[
  statusSwitchA, ssfSwitchA, epfSwitchA, femaleSwitchA, splitBonusSwitchA, gratuityA,
  statusSwitchB, ssfSwitchB, epfSwitchB, femaleSwitchB, splitBonusSwitchB, gratuityB
].forEach(sw => {
  if (sw) {
    sw.addEventListener('change', () => {
      triggerRecalculation();
      if (currentNavTab === 'negotiate') triggerNegotiationRecalculation();
    });
  }
});

// Bind Negotiation inputs to trigger Negotiation Recalculation
const negoInputsToWatch = [
  negoBaseProfile, negoBasicType, negoBasicAction, negoBasicVal,
  negoAllowanceType, negoAllowanceAction, negoAllowanceVal
];
negoInputsToWatch.forEach(input => {
  input.addEventListener('input', triggerNegotiationRecalculation);
  input.addEventListener('change', triggerNegotiationRecalculation);
});

// --- SSF and Gratuity Synchronization ---
function syncSsfAndGratuity() {
  if (ssfSwitchA && gratuityA && gratuityWrapperA) {
    if (ssfSwitchA.selected) {
      gratuityA.selected = true;
      gratuityWrapperA.classList.add('hidden');
    } else {
      gratuityWrapperA.classList.remove('hidden');
    }
  }
  if (ssfSwitchB && gratuityB && gratuityWrapperB) {
    if (ssfSwitchB.selected) {
      gratuityB.selected = true;
      gratuityWrapperB.classList.add('hidden');
    } else {
      gratuityWrapperB.classList.remove('hidden');
    }
  }
}

// --- Mode Y Helper ---
function applyModeY(isModeY) {
  const labelAllowanceA = document.querySelector('label[for="allowance-a"]');
  const labelAllowanceB = document.querySelector('label[for="allowance-b"]');
  const labelCitA = document.querySelector('label[for="cit-a"]');
  const labelCitB = document.querySelector('label[for="cit-b"]');

  if (isModeY) {
    document.body.classList.add('mode-y-active');
    if (labelAllowanceA) labelAllowanceA.textContent = "Allowance + Add allowance (Lunch, Transport, Mobile, ...)";
    if (labelAllowanceB) labelAllowanceB.textContent = "Allowance + Add allowance (Lunch, Transport, Mobile, ...)";
    if (labelCitA) labelCitA.textContent = "CIT (Staff's Contribution)";
    if (labelCitB) labelCitB.textContent = "CIT (Staff's Contribution)";

    splitBonusSwitchA.selected = false;
    splitBonusSwitchB.selected = false;

    remoteSelectA.value = 'None';
    remoteSelectB.value = 'None';
    remoteSelectA.disabled = true;
    remoteSelectB.disabled = true;

    healthInputA.value = 0;
    healthInputB.value = 0;
    healthInputA.disabled = true;
    healthInputB.disabled = true;

    medicalInputA.value = 0;
    medicalInputB.value = 0;
    medicalInputA.disabled = true;
    medicalInputB.disabled = true;

    ssfSwitchA.selected = false;
    ssfSwitchB.selected = false;
    ssfSwitchA.disabled = true;
    ssfSwitchB.disabled = true;

    epfSwitchA.selected = true;
    epfSwitchB.selected = true;
    epfSwitchA.disabled = true;
    epfSwitchB.disabled = true;
    syncSsfAndGratuity();
  } else {
    document.body.classList.remove('mode-y-active');
    if (labelAllowanceA) labelAllowanceA.textContent = "Monthly Allowances";
    if (labelAllowanceB) labelAllowanceB.textContent = "Monthly Allowances";
    if (labelCitA) labelCitA.textContent = "Monthly Citizen Investment Trust (CIT) Contribution";
    if (labelCitB) labelCitB.textContent = "Monthly Citizen Investment Trust (CIT) Contribution";

    remoteSelectA.disabled = false;
    remoteSelectB.disabled = false;
    healthInputA.disabled = false;
    healthInputB.disabled = false;
    medicalInputA.disabled = false;
    medicalInputB.disabled = false;

    ssfSwitchA.disabled = false;
    ssfSwitchB.disabled = false;
    epfSwitchA.disabled = false;
    epfSwitchB.disabled = false;
    syncSsfAndGratuity();
  }
}

// --- Core Controller Calculation ---
function triggerRecalculation() {
  // Update structure tab buttons active state
  tabSameBtn.classList.toggle('active', currentTab === 'same');
  tabDiffBtn.classList.toggle('active', currentTab === 'diff');

  // Handle layout visibility based on View Mode and Salary Structure Tab
  if (currentViewMode === 'compare') {
    structureTabsContainer.classList.remove('hidden');
    
    if (currentTab === 'same') {
      cardProfileB.classList.add('hidden');
      diffModeContainer.classList.add('hidden');
      mainContentLayout.classList.remove('dual-input-layout');
      document.getElementById('input-container').classList.remove('dual-inputs');
      
      btnCopyToB.classList.add('hidden');
      btnCopyToA.classList.add('hidden');
    } else {
      cardProfileB.classList.remove('hidden');
      diffModeContainer.classList.remove('hidden');
      mainContentLayout.classList.add('dual-input-layout');
      document.getElementById('input-container').classList.add('dual-inputs');
      
      btnCopyToB.classList.remove('hidden');
      btnCopyToA.classList.remove('hidden');
    }
  } else {
    structureTabsContainer.classList.add('hidden');
    cardProfileB.classList.add('hidden');
    diffModeContainer.classList.add('hidden');
    mainContentLayout.classList.remove('dual-input-layout');
    document.getElementById('input-container').classList.remove('dual-inputs');
    
    btnCopyToB.classList.add('hidden');
    btnCopyToA.classList.add('hidden');
  }

  // Determine comparison settings for Profile A
  const yearA = (currentTab === 'diff' && diffModeSelect.value === '83_vs_83' && currentViewMode === 'compare') ? '2083_84' : '2082_83';

  // Update input profile A card title dynamically
  const profileATitleEl = document.getElementById('profile-a-title');
  if (profileATitleEl) {
    if (currentViewMode !== 'compare') {
      profileATitleEl.textContent = "Salary Profile Details";
    } else if (currentTab === 'same') {
      profileATitleEl.textContent = "Salary Profile Details";
    } else {
      profileATitleEl.textContent = `Salary Profile A (${yearA === '2083_84' ? 'FY 83/84' : 'FY 82/83'})`;
    }
  }

  // Update result card headers dynamically
  const cardTitle82 = document.querySelector('.result-card.existing .card-title span:last-child');
  const cardTitle83 = document.querySelector('.result-card.new .card-title span:last-child');
  
  if (currentViewMode !== 'compare' || currentTab === 'same') {
    if (cardTitle82) cardTitle82.textContent = "FY 2082/83 (Existing)";
    if (cardTitle83) cardTitle83.textContent = "FY 2083/84 (New Slabs)";
    tableHeaderA.textContent = "FY 2082/83";
    tableHeaderB.textContent = "FY 2083/84";
  } else {
    if (yearA === '2083_84') {
      if (cardTitle82) cardTitle82.textContent = "Profile A (FY 2083/84)";
      if (cardTitle83) cardTitle83.textContent = "Profile B (FY 2083/84)";
      tableHeaderA.textContent = "Profile A (FY 2083/84)";
      tableHeaderB.textContent = "Profile B (FY 2083/84)";
    } else {
      if (cardTitle82) cardTitle82.textContent = "Profile A (FY 2082/83)";
      if (cardTitle83) cardTitle83.textContent = "Profile B (FY 2083/84)";
      tableHeaderA.textContent = "Profile A (FY 2082/83)";
      tableHeaderB.textContent = "Profile B (FY 2083/84)";
    }
  }

  const isModeY = modeYSwitch ? modeYSwitch.selected : false;
  const basicSalaryValA = parseFloat(basicInputA.value) || 0;
  let citValA = parseFloat(citInputA.value) || 0;
  if (isModeY) {
    citValA = Math.max(0, citValA - (basicSalaryValA * 0.10));
  }

  // Read Profile A inputs
  const inputsA = {
    monthlyBasicSalary: basicSalaryValA,
    monthlyAllowances: parseFloat(allowanceInputA.value) || 0,
    annualBonus: parseFloat(bonusInputA.value) || 0,
    filingStatus: statusSwitchA.selected ? 'married' : 'single',
    monthlyFreelanceIncome: parseFloat(freelanceInputA.value) || 0,
    annualOtherIncome: parseFloat(otherInputA.value) || 0,
    remoteArea: remoteSelectA.value,
    useSSF: ssfSwitchA.selected,
    useEPF: epfSwitchA.selected,
    citMonthly: citValA,
    lifeInsurancePremium: parseFloat(lifeInputA.value) || 0,
    healthInsurancePremium: parseFloat(healthInputA.value) || 0,
    medicalExpenses: parseFloat(medicalInputA.value) || 0,
    femaleTaxpayer: femaleSwitchA.selected,
    splitBonus: splitBonusSwitchA.selected,
    modeY: isModeY,
    depositGratuity: gratuityA ? gratuityA.selected : true
  };

  // Read Profile B inputs (depends on mode)
  let inputsB;
  if (currentViewMode !== 'compare' || currentTab === 'same') {
    inputsB = { ...inputsA };
  } else {
    const basicSalaryValB = parseFloat(basicInputB.value) || 0;
    let citValB = parseFloat(citInputB.value) || 0;
    if (isModeY) {
      citValB = Math.max(0, citValB - (basicSalaryValB * 0.10));
    }
    inputsB = {
      monthlyBasicSalary: basicSalaryValB,
      monthlyAllowances: parseFloat(allowanceInputB.value) || 0,
      annualBonus: parseFloat(bonusInputB.value) || 0,
      filingStatus: statusSwitchB.selected ? 'married' : 'single',
      monthlyFreelanceIncome: parseFloat(freelanceInputB.value) || 0,
      annualOtherIncome: parseFloat(otherInputB.value) || 0,
      remoteArea: remoteSelectB.value,
      useSSF: ssfSwitchB.selected,
      useEPF: epfSwitchB.selected,
      citMonthly: citValB,
      lifeInsurancePremium: parseFloat(lifeInputB.value) || 0,
      healthInsurancePremium: parseFloat(healthInputB.value) || 0,
      medicalExpenses: parseFloat(medicalInputB.value) || 0,
      femaleTaxpayer: femaleSwitchB.selected,
      splitBonus: splitBonusSwitchB.selected,
      modeY: isModeY,
      depositGratuity: gratuityB ? gratuityB.selected : true
    };
  }

  // Calculate results
  const res82 = calculateTax({ ...inputsA, year: yearA });
  const res83 = calculateTax({ ...inputsB, year: '2083_84' });

  // Update Summary Cards
  updateSummaryCard('82', res82);
  updateSummaryCard('83', res83);

  // Update Saving Callout
  updateSavingCallout(res82, res83);

  // Update Detailed Breakdown Table
  updateDetailedTable(res82, res83, inputsA, inputsB);

  // Update Progressive Slab breakdowns
  updateSlabDisplay(slabBreakdown82El, res82);
  updateSlabDisplay(slabBreakdown83El, res83);

  // Draw Charts
  drawDonutChart('chart-svg-82', res82);
  drawDonutChart('chart-svg-83', res83);

  // Draw Progressive Slab Bars
  drawSlabProgressBar('82', res82);
  drawSlabProgressBar('83', res83);

  // Update Tax Optimization Advice
  updateOptimizationTips(res82, res83, inputsA, inputsB);

  // Sync Base Profile selector in Negotiation view
  syncNegoBaseProfileSelect();

  // Save State
  saveInputsToLocalStorage();
}

// --- Summary Updater Helper ---
function updateSummaryCard(suffix, results) {
  const isSplit = (suffix === '82') ? splitBonusSwitchA.selected : (currentTab === 'same' ? splitBonusSwitchA.selected : splitBonusSwitchB.selected);
  const bonusVal = (suffix === '82') ? (parseFloat(bonusInputA.value) || 0) : (currentTab === 'same' ? (parseFloat(bonusInputA.value) || 0) : (parseFloat(bonusInputB.value) || 0));

  // 1. Cash-in-Hand
  document.getElementById(`cash-monthly-${suffix}`).textContent = 'Rs. ' + Math.round(results.netCashInHandMonthly).toLocaleString('en-NP') + ' / mo';
  document.getElementById(`cash-annual-${suffix}`).textContent = 'Rs. ' + Math.round(results.netCashInHandAnnual).toLocaleString('en-NP') + ' / yr';
  
  const cashNoteEl = document.getElementById(`cash-monthly-note-${suffix}`);
  if (!isSplit && bonusVal > 0) {
    cashNoteEl.textContent = `(+Rs. ${Math.round(results.bonusAfterTax).toLocaleString('en-NP')} bonus when taken)`;
  } else {
    cashNoteEl.textContent = '';
  }

  // 2. Income Tax
  const monthlyTax = isSplit ? results.finalTaxLiability / 12 : results.taxWithoutBonus / 12;
  document.getElementById(`tax-monthly-${suffix}`).textContent = 'Rs. ' + Math.round(monthlyTax).toLocaleString('en-NP') + ' / mo';
  document.getElementById(`tax-annual-${suffix}`).textContent = 'Rs. ' + Math.round(results.finalTaxLiability).toLocaleString('en-NP') + ' / yr';

  const taxNoteEl = document.getElementById(`tax-monthly-note-${suffix}`);
  if (!isSplit && bonusVal > 0 && results.marginalTaxOnBonus > 0) {
    taxNoteEl.textContent = `(+Rs. ${Math.round(results.marginalTaxOnBonus).toLocaleString('en-NP')} tax on bonus when taken)`;
  } else {
    taxNoteEl.textContent = '';
  }

  // 3. Cost to Company (CTC)
  const ctcNoBonus = results.costToCompany - bonusVal;
  const ctcMonthlyVal = isSplit ? results.costToCompany / 12 : ctcNoBonus / 12;

  document.getElementById(`ctc-monthly-${suffix}`).textContent = 'Rs. ' + Math.round(ctcMonthlyVal).toLocaleString('en-NP') + ' / mo';
  document.getElementById(`ctc-annual-${suffix}`).textContent = 'Rs. ' + Math.round(results.costToCompany).toLocaleString('en-NP') + ' / yr';

  const ctcNoteEl = document.getElementById(`ctc-monthly-note-${suffix}`);
  if (!isSplit && bonusVal > 0) {
    ctcNoteEl.textContent = `(+Rs. ${Math.round(bonusVal).toLocaleString('en-NP')} bonus when taken)`;
  } else {
    ctcNoteEl.textContent = '';
  }

  // 4. Retirement Savings
  document.getElementById(`savings-monthly-${suffix}`).textContent = 'Rs. ' + Math.round(results.totalRetirementSavingsAnnual / 12).toLocaleString('en-NP') + ' / mo';
  document.getElementById(`savings-annual-${suffix}`).textContent = 'Rs. ' + Math.round(results.totalRetirementSavingsAnnual).toLocaleString('en-NP') + ' / yr';
}

// --- Dynamic Saving Callout Updater ---
function updateSavingCallout(res82, res83) {
  if (currentTab === 'same') {
    const savings = res82.finalTaxLiability - res83.finalTaxLiability;
    savingCalloutTextEl.textContent = "Annual Tax Savings with New Taxation (83/84)";
    
    if (savings > 0) {
      savingCalloutValueEl.textContent = 'Rs. ' + Math.round(savings).toLocaleString('en-NP');
      savingCalloutEl.style.background = 'var(--md-sys-color-primary-container)';
      savingCalloutEl.style.color = 'var(--md-sys-color-on-primary-container)';
      savingCalloutValueEl.style.color = 'var(--md-sys-color-primary)';
    } else if (savings < 0) {
      savingCalloutValueEl.textContent = 'Rs. ' + Math.round(Math.abs(savings)).toLocaleString('en-NP') + ' (Tax Increase)';
      savingCalloutEl.style.background = 'var(--md-sys-color-error-container)';
      savingCalloutEl.style.color = 'var(--md-sys-color-on-error-container)';
      savingCalloutValueEl.style.color = 'var(--md-sys-color-error)';
    } else {
      savingCalloutValueEl.textContent = 'Rs. 0';
      savingCalloutEl.style.background = 'var(--md-sys-color-surface-variant)';
      savingCalloutEl.style.color = 'var(--md-sys-color-on-surface-variant)';
      savingCalloutValueEl.style.color = 'var(--md-sys-color-on-surface-variant)';
    }
  } else {
    // Different structures
    const cashDiff = res83.netCashInHandAnnual - res82.netCashInHandAnnual;
    savingCalloutTextEl.textContent = "Annual Cash-in-Hand Difference (Profile B vs. Profile A)";
    
    if (cashDiff > 0) {
      savingCalloutValueEl.textContent = '+ Rs. ' + Math.round(cashDiff).toLocaleString('en-NP');
      savingCalloutEl.style.background = 'var(--md-sys-color-primary-container)';
      savingCalloutEl.style.color = 'var(--md-sys-color-on-primary-container)';
      savingCalloutValueEl.style.color = 'var(--md-sys-color-primary)';
    } else if (cashDiff < 0) {
      savingCalloutValueEl.textContent = '- Rs. ' + Math.round(Math.abs(cashDiff)).toLocaleString('en-NP');
      savingCalloutEl.style.background = 'var(--md-sys-color-error-container)';
      savingCalloutEl.style.color = 'var(--md-sys-color-on-error-container)';
      savingCalloutValueEl.style.color = 'var(--md-sys-color-error)';
    } else {
      savingCalloutValueEl.textContent = 'Rs. 0';
    }
  }
}

// --- Populates Detailed Comparison Table ---
function updateDetailedTable(res82, res83, inputsA, inputsB) {
  const formatCell = (num, isBold = false) => {
    const rounded = Math.round(num);
    if (rounded < 0) {
      const text = 'Rs. (' + Math.abs(rounded).toLocaleString('en-NP') + ') [Refund]';
      return isBold ? `<strong>${text}</strong>` : text;
    }
    const text = 'Rs. ' + rounded.toLocaleString('en-NP');
    return isBold ? `<strong>${text}</strong>` : text;
  };

  const formatDiffCell = (diff) => {
    const rounded = Math.round(diff);
    if (rounded === 0) return 'Rs. 0';
    if (rounded < 0) {
      return `<span class="highlight-negative">Rs. (${Math.abs(rounded).toLocaleString('en-NP')})</span>`;
    }
    return `<span class="highlight-positive">+Rs. ${rounded.toLocaleString('en-NP')}</span>`;
  };

  const createRow = (label, val82, val83, isHeader = false, isBold = false, isDiffInverse = false) => {
    const diff = val83 - val82;
    const diffVal = isDiffInverse ? -diff : diff;

    return `
      <tr class="${isHeader ? 'row-group-title' : ''} ${isBold ? 'net-highlight' : ''}">
        <td>${label}</td>
        <td>${formatCell(val82, isBold)}</td>
        <td>${formatCell(val83, isBold)}</td>
        <td>${formatDiffCell(diffVal)}</td>
      </tr>
    `;
  };

  let html = '';

  // 1. Gross Earnings
  // 1. Gross Earnings
  const isModeY = inputsA.modeY || inputsB.modeY;
  const allowanceLabel = 'Annual Allowances (Adjusted for Gratuity Carve-out)';

  html += createRow('Gross Cash Salary components:', 0, 0, true);
  html += createRow('Annual Basic Salary', inputsA.monthlyBasicSalary * 12, inputsB.monthlyBasicSalary * 12);
  html += createRow(allowanceLabel, res82.adjustedAllowancesAnnual, res83.adjustedAllowancesAnnual);

  const cashGratuityA = inputsA.depositGratuity ? 0 : res82.gratuityAnnual;
  const cashGratuityB = inputsB.depositGratuity ? 0 : res83.gratuityAnnual;
  html += createRow('Annual Gratuity (Paid in Cash)', cashGratuityA, cashGratuityB);

  html += createRow('Annual Bonus / Festive Allowance', inputsA.annualBonus, inputsB.annualBonus);
  html += createRow('Annual Freelance / Consultancy Income', res82.freelanceAnnual, res83.freelanceAnnual);
  html += createRow('Annual Other Income (Rent, Interest, etc.)', res82.otherAnnual, res83.otherAnnual);
  html += createRow('Bonus / Gratuity After Tax', res82.bonusAfterTax, res83.bonusAfterTax);
  html += createRow('Gross Cash Income (Annual)', res82.grossCashSalaryAnnual, res83.grossCashSalaryAnnual, false, true);

  // 2. Employer Additions & Cost to Company
  html += createRow('Employer Contributions & Cost to Company (CTC):', 0, 0, true);
  html += createRow('Employer SSF (20% basic)', res82.employerSSFAnnual, res83.employerSSFAnnual);
  html += createRow('Employer EPF (10% basic)', res82.employerEPFAnnual, res83.employerEPFAnnual);

  const depGratuityA = inputsA.depositGratuity ? res82.gratuityAnnual : 0;
  const depGratuityB = inputsB.depositGratuity ? res83.gratuityAnnual : 0;
  html += createRow('Employer Gratuity (8.33% basic deposited to CIT)', depGratuityA, depGratuityB);

  html += createRow('Assessable Income (Tax Base)', res82.assessableIncome, res83.assessableIncome, false, true);
  html += createRow('Cost to Company (CTC)', res82.costToCompany, res83.costToCompany, false, true);

  // 3. Deductions
  const retirementDeductionLabel = (inputsA.useSSF || inputsB.useSSF)
    ? 'Retirement Fund (SSF + EPF + CIT + Gratuity)'
    : 'Retirement Fund (EPF + CIT + Gratuity)';

  html += createRow('Allowable Tax Deductions:', 0, 0, true);
  html += createRow(retirementDeductionLabel, res82.allowedRetirementDeduction, res83.allowedRetirementDeduction, false, false, true);
  html += createRow('Life Insurance Exemption', res82.allowedLifeInsurance, res83.allowedLifeInsurance, false, false, true);
  html += createRow('Health Insurance Exemption', res82.allowedHealthInsurance, res83.allowedHealthInsurance, false, false, true);
  html += createRow('Remote Area Exemption', res82.allowedRemoteArea, res83.allowedRemoteArea, false, false, true);
  html += createRow('Total Taxable Income', res82.taxableIncome, res83.taxableIncome, false, true, true);

  // 4. Taxes & Credits
  html += createRow('Taxes and Credits Breakdown:', 0, 0, true);
  html += createRow('Base progressive Tax', res82.baseTaxLiability, res83.baseTaxLiability, false, false, true);
  html += createRow('Medical Expenses Tax Credit', res82.allowedMedicalCredit, res83.allowedMedicalCredit);
  html += createRow('Female Tax Rebate (10%)', res82.femaleRebate, res83.femaleRebate);
  html += createRow('Final Annual Income Tax Liability', res82.finalTaxLiability, res83.finalTaxLiability, false, true, true);
  html += createRow('TDS Paid at Source (15% Freelance + 10% Other)', res82.tdsPaidSource, res83.tdsPaidSource, false, false, true);
  html += createRow('Net Year-End Tax Payable / (Refund)', res82.netTaxPayable, res83.netTaxPayable, false, true, true);

  // 5. Cash in Hand
  html += createRow('Employee Cash flow (Net Take-home):', 0, 0, true);
  html += createRow('Out-of-Pocket Savings (Employee SSF+EPF+CIT)', res82.employeeOutofPocketDeductions, res83.employeeOutofPocketDeductions, false, false, true);
  html += createRow('Annual Cash in Hand (Take-Home)', res82.netCashInHandAnnual, res83.netCashInHandAnnual, false, true);
  
  let monthlyLabel = 'Monthly Cash in Hand (Take-Home)';
  if (currentTab === 'same') {
    monthlyLabel += splitBonusSwitchA.selected ? ' (incl. bonus)' : ' (excl. bonus & its tax)';
  } else {
    monthlyLabel += ` (A: ${splitBonusSwitchA.selected ? 'incl.' : 'excl.'} bonus, B: ${splitBonusSwitchB.selected ? 'incl.' : 'excl.'} bonus)`;
  }
  html += createRow(monthlyLabel, res82.netCashInHandMonthly, res83.netCashInHandMonthly, false, true);

  // 6. Savings Growth
  html += createRow('Retirement Wealth Accumulation:', 0, 0, true);
  html += createRow('Annual Retirement Savings (incl. Employer Match)', res82.totalRetirementSavingsAnnual, res83.totalRetirementSavingsAnnual, false, false);
  html += createRow('Est. CIT KBB Withdrawal Tax (5% on gain/interest)', res82.citKbbWithdrawalTax, res83.citKbbWithdrawalTax, false, false, true);
  html += createRow('Est. Gratuity (GFS) Withdrawal Tax (5% on gain/interest)', res82.gratuityWithdrawalTax, res83.gratuityWithdrawalTax, false, false, true);
  
  const totalWealth82 = res82.netCashInHandAnnual + res82.totalRetirementSavingsAnnual - res82.citKbbWithdrawalTax - res82.gratuityWithdrawalTax;
  const totalWealth83 = res83.netCashInHandAnnual + res83.totalRetirementSavingsAnnual - res83.citKbbWithdrawalTax - res83.gratuityWithdrawalTax;
  html += createRow('Total Financial Value (Take-Home + Savings - Exit Taxes)', totalWealth82, totalWealth83, false, true);

  comparisonTableBody.innerHTML = html;
}

// --- Updates Slab Breakdown displays ---
function updateSlabDisplay(container, results) {
  if (results.taxBreakdown.length === 0) {
    container.innerHTML = '<div style="color: var(--md-sys-color-tertiary); font-weight: 500;">No tax liability (Income below threshold or fully exempt)</div>';
    return;
  }

  let html = '';
  results.taxBreakdown.forEach(slab => {
    const ratePercent = (slab.rate * 100).toFixed(0);
    html += `
      <div style="display: flex; justify-content: space-between; border-bottom: 1px dotted var(--md-sys-color-outline-variant); padding: 4px 0;">
        <span>Slab: ${slab.range} (${ratePercent}%)</span>
        <strong>Rs. ${Math.round(slab.tax).toLocaleString('en-NP')}</strong>
      </div>
    `;
  });
  container.innerHTML = html;
}

// --- Dynamic Vector SVG Donut Chart Drawer ---
function drawDonutChart(svgId, results) {
  const svg = document.getElementById(svgId);
  if (!svg) return;
  svg.innerHTML = '';

  const takeHome = results.netCashInHandAnnual;
  const tax = results.finalTaxLiability;
  const savings = results.employeeOutofPocketDeductions;
  const total = takeHome + tax + savings;

  if (total === 0) return;

  const pctTakeHome = takeHome / total;
  const pctTax = tax / total;
  const pctSavings = savings / total;

  // Donut Config
  const cx = 90;
  const cy = 90;
  const r = 55;
  const strokeWidth = 18;
  const circumference = 2 * Math.PI * r;

  let offset = 0;

  const createSegment = (pct, color, label) => {
    if (pct <= 0) return '';
    const strokeDash = circumference * pct;
    const strokeOffset = circumference - offset;
    offset += strokeDash;

    return `
      <circle 
        cx="${cx}" cy="${cy}" r="${r}" 
        fill="transparent" 
        stroke="${color}" 
        stroke-width="${strokeWidth}" 
        stroke-dasharray="${strokeDash} ${circumference - strokeDash}" 
        stroke-dashoffset="${strokeOffset}" 
        transform="rotate(-90 ${cx} ${cy})"
        style="transition: stroke-dashoffset 0.5s ease-in-out;"
      />
    `;
  };

  const colorTakeHome = '#34D399';
  const colorTax = '#F87171';
  const colorSavings = '#60A5FA';

  let segmentsHtml = '';
  segmentsHtml += createSegment(pctTakeHome, colorTakeHome, 'Take-Home');
  segmentsHtml += createSegment(pctSavings, colorSavings, 'Savings');
  segmentsHtml += createSegment(pctTax, colorTax, 'Tax');

  const pctTakeHomeText = Math.round(pctTakeHome * 100) + '%';

  svg.innerHTML = `
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="transparent" stroke="var(--md-sys-color-outline-variant)" stroke-width="${strokeWidth + 2}" opacity="0.3" />
    ${segmentsHtml}
    <text x="${cx}" y="${cy - 4}" text-anchor="middle" font-family="var(--font-title)" font-size="14" font-weight="700" fill="var(--md-sys-color-on-surface)">
      Take-Home
    </text>
    <text x="${cx}" y="${cy + 14}" text-anchor="middle" font-family="var(--font-title)" font-size="16" font-weight="800" fill="#34D399">
      ${pctTakeHomeText}
    </text>
    <g transform="translate(195, 30)" font-family="var(--font-body)" font-size="10" font-weight="500" fill="var(--md-sys-color-on-surface-variant)">
      <rect x="0" y="0" width="10" height="10" rx="3" fill="${colorTakeHome}" />
      <text x="16" y="9">Take-Home: ${Math.round(pctTakeHome * 100)}%</text>
      <rect x="0" y="20" width="10" height="10" rx="3" fill="${colorSavings}" />
      <text x="16" y="29">Savings: ${Math.round(pctSavings * 100)}%</text>
      <rect x="0" y="40" width="10" height="10" rx="3" fill="${colorTax}" />
      <text x="16" y="49">Tax Paid: ${Math.round(pctTax * 100)}%</text>
    </g>
  `;
}

// --- Progressive Slab Bar Visualizer ---
function drawSlabProgressBar(suffix, results, prefix = '') {
  const containerId = prefix ? `${prefix}-slab-bar-container-${suffix}` : `slab-bar-container-${suffix}`;
  const legendContainerId = prefix ? `${prefix}-slab-bar-legend-${suffix}` : `slab-bar-legend-${suffix}`;
  const container = document.getElementById(containerId);
  const legendContainer = document.getElementById(legendContainerId);
  if (!container || !legendContainer) return;

  container.innerHTML = '';
  legendContainer.innerHTML = '';

  const taxableIncome = results.taxableIncome;
  if (taxableIncome <= 0 || results.taxBreakdown.length === 0) {
    container.innerHTML = `
      <div class="slab-segment slab-seg-0 has-tooltip" style="width: 100%; display: flex; align-items: center; justify-content: center; color: #047857; font-size: 10px; font-weight: 700;">
        100% Tax-Exempt / Income Below Threshold
        <span class="tooltip-text" style="bottom: 125%; width: 200px;">Your taxable income is Rs. 0. No tax is due.</span>
      </div>
    `;
    legendContainer.innerHTML = `
      <div class="legend-item">
        <div class="legend-color slab-seg-0"></div>
        <span>0% Tax Free</span>
      </div>
    `;
    return;
  }

  let barHtml = '';
  const uniqueRates = new Set();

  results.taxBreakdown.forEach(segment => {
    const widthPercent = (segment.income / taxableIncome) * 100;
    if (widthPercent <= 0) return;

    const ratePercent = segment.rate * 100;
    const rateKey = ratePercent === 0 ? '0' : ratePercent.toFixed(0);
    uniqueRates.add(ratePercent);

    barHtml += `
      <div class="slab-segment slab-seg-${rateKey} has-tooltip" style="width: ${widthPercent}%;">
        <span class="tooltip-text" style="bottom: 130%; width: 220px;">
          <strong>Slab Range:</strong> Rs. ${segment.range}<br>
          <strong>Income in Slab:</strong> Rs. ${Math.round(segment.income).toLocaleString('en-NP')}<br>
          <strong>Slab Rate:</strong> ${ratePercent.toFixed(0)}%<br>
          <strong>Tax in Slab:</strong> Rs. ${Math.round(segment.tax).toLocaleString('en-NP')}
        </span>
      </div>
    `;
  });

  container.innerHTML = barHtml;

  // Render Legend
  let legendHtml = '';
  // Sort rates numerically
  const sortedRates = Array.from(uniqueRates).sort((a, b) => a - b);
  sortedRates.forEach(rate => {
    const rateKey = rate === 0 ? '0' : rate.toFixed(0);
    const label = rate === 0 ? '0% (SSF Waived)' : `${rate.toFixed(0)}% Slab`;
    legendHtml += `
      <div class="legend-item">
        <div class="legend-color slab-seg-${rateKey}"></div>
        <span>${label}</span>
      </div>
    `;
  });
  legendContainer.innerHTML = legendHtml;
}

// --- Smart Tax Saving Recommendations (Optimization Advice) ---
function updateOptimizationTips(res82, res83, inputsA, inputsB) {
  optTipsContent.innerHTML = '';
  const tips = [];

  const analyzeProfile = (profileName, inputs, results, suffix) => {
    if (results.finalTaxLiability <= 0) return;

    // Get top marginal rate
    const topRate = results.taxBreakdown.length > 0 
      ? results.taxBreakdown[results.taxBreakdown.length - 1].rate 
      : 0.10;

    // 1. Life Insurance Exemption
    if (inputs.lifeInsurancePremium < 40000) {
      const remaining = 40000 - inputs.lifeInsurancePremium;
      const savings = remaining * topRate;
      if (savings > 100) {
        tips.push({
          title: `${profileName}: Maximize Life Insurance Exemption`,
          desc: `Invest up to Rs. ${Math.round(remaining).toLocaleString('en-NP')} more in Life Insurance premium. At your marginal tax rate, this will save you up to <strong>Rs. ${Math.round(savings).toLocaleString('en-NP')}</strong> in annual tax.`,
          icon: 'favorite_border'
        });
      }
    }

    // 2. Health Insurance Exemption
    if (inputs.healthInsurancePremium < 20000) {
      const remaining = 20000 - inputs.healthInsurancePremium;
      const savings = remaining * topRate;
      if (savings > 100) {
        tips.push({
          title: `${profileName}: Maximize Health Insurance Exemption`,
          desc: `Invest up to Rs. ${Math.round(remaining).toLocaleString('en-NP')} more in Health Insurance premium. This will save you up to <strong>Rs. ${Math.round(savings).toLocaleString('en-NP')}</strong> in annual tax.`,
          icon: 'health_and_safety'
        });
      }
    }

    // 3. Approved Medical Credit
    if (inputs.medicalExpenses < 10000) {
      const remaining = 10000 - inputs.medicalExpenses;
      const credit = remaining * 0.15;
      if (credit > 10) {
        tips.push({
          title: `${profileName}: Claim Approved Medical Expenses`,
          desc: `Submit up to Rs. ${Math.round(remaining).toLocaleString('en-NP')} more in approved medical bills. At a 15% credit rate, this directly reduces your final tax bill by <strong>Rs. ${Math.round(credit).toLocaleString('en-NP')}</strong>.`,
          icon: 'receipt'
        });
      }
    }

    // 4. Retirement Savings (CIT / SSF / EPF)
    const basicAnnual = inputs.monthlyBasicSalary * 12;
    const employeeSSF = inputs.useSSF ? basicAnnual * 0.11 : 0;
    const employerSSF = inputs.useSSF ? basicAnnual * 0.20 : 0;
    const employeeEPF = inputs.useEPF ? basicAnnual * 0.10 : 0;
    const employerEPF = inputs.useEPF ? basicAnnual * 0.10 : 0;
    const citAnnual = inputs.citMonthly * 12;

    const totalContribution = employeeSSF + employerSSF + employeeEPF + employerEPF + citAnnual;
    const maxLimit = Math.min(results.assessableIncome * 1/3, 500000);

    if (totalContribution < maxLimit) {
      const remaining = maxLimit - totalContribution;
      const savings = remaining * topRate;
      const monthlyIncrease = remaining / 12;

      if (savings > 100 && monthlyIncrease > 500) {
        tips.push({
          title: `${profileName}: Increase Citizen Investment Trust (CIT)`,
          desc: `Increase your monthly CIT contribution by up to Rs. ${Math.round(monthlyIncrease).toLocaleString('en-NP')} (or Rs. ${Math.round(remaining).toLocaleString('en-NP')} annually). This will reduce your taxable income, saving you up to <strong>Rs. ${Math.round(savings).toLocaleString('en-NP')}</strong> in annual tax.`,
          icon: 'savings'
        });
      }
    }

    // 5. SSF 1% SST Waiver
    if (!inputs.useSSF && results.taxableIncome > 0 && suffix === '83') {
      const taxableSubjectToSST = Math.min(results.taxableIncome, 1000000);
      const sstSavings = taxableSubjectToSST * 0.01;
      if (sstSavings > 100) {
        tips.push({
          title: `${profileName}: Enroll in Social Security Fund (SSF)`,
          desc: `By enrolling in SSF (instead of EPF/None), you receive a 1% SST waiver on your first Rs. 1,000,000 of taxable income, saving you <strong>Rs. ${Math.round(sstSavings).toLocaleString('en-NP')}</strong> in tax.`,
          icon: 'security'
        });
      }
    }

    // 6. Gratuity to CIT Recommendation
    if (!inputs.depositGratuity && topRate > 0.15) {
      const gratuityAnnual = results.gratuityAnnual || (inputs.monthlyBasicSalary * 0.0833 * 12);
      // Check remaining retirement limit
      const currentContribution = employeeSSF + employerSSF + employeeEPF + employerEPF + citAnnual;
      const potentialNewContribution = currentContribution + gratuityAnnual;
      const eligibleDeposit = Math.min(gratuityAnnual, Math.max(0, maxLimit - currentContribution));
      const savings = eligibleDeposit * topRate;

      if (savings > 100) {
        tips.push({
          title: `${profileName}: Deposit Gratuity to CIT Fund`,
          desc: `Enable "Deposit Gratuity to CIT Fund" instead of taking cash. Since your marginal tax rate is ${Math.round(topRate * 100)}%, this will save you up to <strong>Rs. ${Math.round(savings).toLocaleString('en-NP')}</strong> in annual tax.`,
          icon: 'savings'
        });
      }
    }
  };

  const nameA = (currentViewMode !== 'compare' || currentTab === 'same') ? 'Tax Plan' : 'Profile A';
  analyzeProfile(nameA, inputsA, res82, '82');

  if (currentViewMode === 'compare' && currentTab === 'diff') {
    analyzeProfile('Profile B', inputsB, res83, '83');
  }

  if (tips.length === 0) {
    optTipsCard.style.display = 'none';
    return;
  }

  optTipsCard.style.display = 'flex';
  
  let html = '';
  tips.forEach(tip => {
    html += `
      <div class="opt-tip-item">
        <span class="material-icons opt-tip-icon">${tip.icon}</span>
        <div class="opt-tip-text">
          <div class="opt-tip-title">${tip.title}</div>
          <div class="opt-tip-desc">${tip.desc}</div>
        </div>
      </div>
    `;
  });
  optTipsContent.innerHTML = html;
}

// --- URL State Serialization & Sharing ---
function generateShareLink() {
  const params = new URLSearchParams();
  params.set('mode', currentViewMode);
  params.set('tab', currentTab);
  params.set('modeY', modeYSwitch ? modeYSwitch.selected : false);
  params.set('diffMode', diffModeSelect.value);

  // Profile A inputs
  params.set('basicA', basicInputA.value);
  params.set('allowanceA', allowanceInputA.value);
  params.set('bonusA', bonusInputA.value);
  params.set('splitA', splitBonusSwitchA.selected);
  params.set('statusA', statusSwitchA.selected);
  params.set('freelanceA', freelanceInputA.value);
  params.set('otherA', otherInputA.value);
  params.set('remoteA', remoteSelectA.value);
  params.set('ssfA', ssfSwitchA.selected);
  params.set('epfA', epfSwitchA.selected);
  params.set('citA', citInputA.value);
  params.set('gratuityA', gratuityA ? gratuityA.selected : false);
  params.set('lifeA', lifeInputA.value);
  params.set('healthA', healthInputA.value);
  params.set('medicalA', medicalInputA.value);
  params.set('femaleA', femaleSwitchA.selected);

  // Profile B inputs
  params.set('basicB', basicInputB.value);
  params.set('allowanceB', allowanceInputB.value);
  params.set('bonusB', bonusInputB.value);
  params.set('splitB', splitBonusSwitchB.selected);
  params.set('statusB', statusSwitchB.selected);
  params.set('freelanceB', freelanceInputB.value);
  params.set('otherB', otherInputB.value);
  params.set('remoteB', remoteSelectB.value);
  params.set('ssfB', ssfSwitchB.selected);
  params.set('epfB', epfSwitchB.selected);
  params.set('citB', citInputB.value);
  params.set('gratuityB', gratuityB ? gratuityB.selected : false);
  params.set('lifeB', lifeInputB.value);
  params.set('healthB', healthInputB.value);
  params.set('medicalB', medicalInputB.value);
  params.set('femaleB', femaleSwitchB.selected);

  // Negotiation state
  params.set('negoBase', negoBaseProfile.value);
  params.set('negoBasicT', negoBasicType.value);
  params.set('negoBasicAct', negoBasicAction.value);
  params.set('negoBasicV', negoBasicVal.value);
  params.set('negoAllowanceT', negoAllowanceType.value);
  params.set('negoAllowanceAct', negoAllowanceAction.value);
  params.set('negoAllowanceV', negoAllowanceVal.value);

  const shareUrl = window.location.origin + window.location.pathname + '?' + params.toString();
  
  // Copy link to clipboard
  navigator.clipboard.writeText(shareUrl).then(() => {
    // Premium visual button feedback
    const originalHtml = btnShare.innerHTML;
    btnShare.innerHTML = '<span class="material-icons" style="font-size: 16px;">done</span><span>Link Copied!</span>';
    setTimeout(() => {
      btnShare.innerHTML = originalHtml;
    }, 2500);
  }).catch(err => {
    console.error('Failed to copy share link: ', err);
    prompt('Copy this shareable link:', shareUrl);
  });
}

function loadInputsFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  if (!urlParams.has('basicA')) return false; // Not a shared link

  try {
    if (urlParams.has('mode')) currentViewMode = urlParams.get('mode');
    if (urlParams.has('tab')) currentTab = urlParams.get('tab');
    if (urlParams.has('diffMode')) diffModeSelect.value = urlParams.get('diffMode');
    
    const hasModeY = urlParams.has('modeY') || urlParams.has('ycotek');
    if (hasModeY && modeYSwitch) {
      const isModeY = (urlParams.get('modeY') || urlParams.get('ycotek')) === 'true';
      modeYSwitch.selected = isModeY;
      applyModeY(isModeY);
    }

    if (urlParams.has('gratuityA') && gratuityA) {
      gratuityA.selected = urlParams.get('gratuityA') === 'true';
    }
    if (urlParams.has('gratuityB') && gratuityB) {
      gratuityB.selected = urlParams.get('gratuityB') === 'true';
    }
    syncSsfAndGratuity();

    // Profile A
    if (urlParams.has('basicA')) basicInputA.value = urlParams.get('basicA');
    if (urlParams.has('allowanceA')) allowanceInputA.value = urlParams.get('allowanceA');
    if (urlParams.has('bonusA')) bonusInputA.value = urlParams.get('bonusA');
    if (urlParams.has('splitA')) splitBonusSwitchA.selected = urlParams.get('splitA') === 'true';
    if (urlParams.has('statusA')) statusSwitchA.selected = urlParams.get('statusA') === 'true';
    if (urlParams.has('freelanceA')) freelanceInputA.value = urlParams.get('freelanceA');
    if (urlParams.has('otherA')) otherInputA.value = urlParams.get('otherA');
    if (urlParams.has('remoteA')) remoteSelectA.value = urlParams.get('remoteA');
    if (urlParams.has('ssfA')) ssfSwitchA.selected = urlParams.get('ssfA') === 'true';
    if (urlParams.has('epfA')) epfSwitchA.selected = urlParams.get('epfA') === 'true';
    if (urlParams.has('citA')) citInputA.value = urlParams.get('citA');
    if (urlParams.has('lifeA')) lifeInputA.value = urlParams.get('lifeA');
    if (urlParams.has('healthA')) healthInputA.value = urlParams.get('healthA');
    if (urlParams.has('medicalA')) medicalInputA.value = urlParams.get('medicalA');
    if (urlParams.has('femaleA')) femaleSwitchA.selected = urlParams.get('femaleA') === 'true';

    // Profile B
    if (urlParams.has('basicB')) basicInputB.value = urlParams.get('basicB');
    if (urlParams.has('allowanceB')) allowanceInputB.value = urlParams.get('allowanceB');
    if (urlParams.has('bonusB')) bonusInputB.value = urlParams.get('bonusB');
    if (urlParams.has('splitB')) splitBonusSwitchB.selected = urlParams.get('splitB') === 'true';
    if (urlParams.has('statusB')) statusSwitchB.selected = urlParams.get('statusB') === 'true';
    if (urlParams.has('freelanceB')) freelanceInputB.value = urlParams.get('freelanceB');
    if (urlParams.has('otherB')) otherInputB.value = urlParams.get('otherB');
    if (urlParams.has('remoteB')) remoteSelectB.value = urlParams.get('remoteB');
    if (urlParams.has('ssfB')) ssfSwitchB.selected = urlParams.get('ssfB') === 'true';
    if (urlParams.has('epfB')) epfSwitchB.selected = urlParams.get('epfB') === 'true';
    if (urlParams.has('citB')) citInputB.value = urlParams.get('citB');
    if (urlParams.has('lifeB')) lifeInputB.value = urlParams.get('lifeB');
    if (urlParams.has('healthB')) healthInputB.value = urlParams.get('healthB');
    if (urlParams.has('medicalB')) medicalInputB.value = urlParams.get('medicalB');
    if (urlParams.has('femaleB')) femaleSwitchB.selected = urlParams.get('femaleB') === 'true';

    // Negotiation state
    if (urlParams.has('negoBase')) negoBaseProfile.value = urlParams.get('negoBase');
    if (urlParams.has('negoBasicT')) negoBasicType.value = urlParams.get('negoBasicT');
    if (urlParams.has('negoBasicAct')) negoBasicAction.value = urlParams.get('negoBasicAct');
    if (urlParams.has('negoBasicV')) negoBasicVal.value = urlParams.get('negoBasicV');
    if (urlParams.has('negoAllowanceT')) negoAllowanceType.value = urlParams.get('negoAllowanceT');
    if (urlParams.has('negoAllowanceAct')) negoAllowanceAction.value = urlParams.get('negoAllowanceAct');
    if (urlParams.has('negoAllowanceV')) negoAllowanceVal.value = urlParams.get('negoAllowanceV');

    // Sync views
    switchNavTab(currentNavTab);
    switchViewMode(currentViewMode);

    // Clear URL parameters so bookmarking or refreshing doesn't lock these settings
    window.history.replaceState({}, document.title, window.location.pathname);

    return true;
  } catch (e) {
    console.error("Failed to load scenario from URL parameters", e);
    return false;
  }
}

// --- Sticky Header Height Calculation ---
function updateHeaderHeight() {
  const header = document.querySelector('header');
  if (header) {
    const rect = header.getBoundingClientRect();
    document.documentElement.style.setProperty('--header-height', `${rect.height}px`);
  }
}
window.addEventListener('load', updateHeaderHeight);
window.addEventListener('resize', updateHeaderHeight);

// --- Share & PDF Export Event Listeners ---
if (btnShare) {
  btnShare.addEventListener('click', generateShareLink);
}
if (btnExportPdf) {
  btnExportPdf.addEventListener('click', () => {
    window.print();
  });
}

// --- Helper to read main inputs ---
function getCalculatorInputs(suffix) {
  const isA = (suffix === 'a');
  const basicEl = isA ? basicInputA : basicInputB;
  const allowanceEl = isA ? allowanceInputA : allowanceInputB;
  const bonusEl = isA ? bonusInputA : bonusInputB;
  const statusEl = isA ? statusSwitchA : statusSwitchB;
  const freelanceEl = isA ? freelanceInputA : freelanceInputB;
  const otherEl = isA ? otherInputA : otherInputB;
  const remoteEl = isA ? remoteSelectA : remoteSelectB;
  const ssfEl = isA ? ssfSwitchA : ssfSwitchB;
  const epfEl = isA ? epfSwitchA : epfSwitchB;
  const citEl = isA ? citInputA : citInputB;
  const lifeEl = isA ? lifeInputA : lifeInputB;
  const healthEl = isA ? healthInputA : healthInputB;
  const medicalEl = isA ? medicalInputA : medicalInputB;
  const femaleEl = isA ? femaleSwitchA : femaleSwitchB;
  const splitBonusEl = isA ? splitBonusSwitchA : splitBonusSwitchB;
  const gratuityEl = isA ? gratuityA : gratuityB;

  return {
    monthlyBasicSalary: parseFloat(basicEl.value) || 0,
    monthlyAllowances: parseFloat(allowanceEl.value) || 0,
    annualBonus: parseFloat(bonusEl.value) || 0,
    filingStatus: statusEl.selected ? 'married' : 'single',
    monthlyFreelanceIncome: parseFloat(freelanceEl.value) || 0,
    annualOtherIncome: parseFloat(otherEl.value) || 0,
    remoteArea: remoteEl.value,
    useSSF: ssfEl.selected,
    useEPF: epfEl.selected,
    citMonthly: parseFloat(citEl.value) || 0,
    lifeInsurancePremium: parseFloat(lifeEl.value) || 0,
    healthInsurancePremium: parseFloat(healthEl.value) || 0,
    medicalExpenses: parseFloat(medicalEl.value) || 0,
    femaleTaxpayer: femaleEl.selected,
    splitBonus: splitBonusEl.selected,
    modeY: modeYSwitch ? modeYSwitch.selected : false,
    depositGratuity: gratuityEl ? gratuityEl.selected : false
  };
}

// --- Sync Base Profile selector options in Negotiation view ---
function syncNegoBaseProfileSelect() {
  const optionB = negoBaseProfile.querySelector('option[value="profileB_83"]');
  if (!optionB) return;

  const showProfileB = (currentViewMode === 'compare' && currentTab === 'diff');
  if (showProfileB) {
    optionB.disabled = false;
    optionB.style.display = 'block';
  } else {
    optionB.disabled = true;
    optionB.style.display = 'none';
    if (negoBaseProfile.value === 'profileB_83') {
      negoBaseProfile.value = 'profileA_83';
    }
  }
}

// --- Summary Card Updater for Negotiation View ---
function updateNegoSummaryCard(prefix, suffix, results, isSplit, bonusVal) {
  document.getElementById(`${prefix}-cash-monthly-${suffix}`).textContent = 'Rs. ' + Math.round(results.netCashInHandMonthly).toLocaleString('en-NP') + ' / mo';
  document.getElementById(`${prefix}-cash-annual-${suffix}`).textContent = 'Rs. ' + Math.round(results.netCashInHandAnnual).toLocaleString('en-NP') + ' / yr';
  
  const cashNoteEl = document.getElementById(`${prefix}-cash-monthly-note-${suffix}`);
  if (cashNoteEl) {
    if (!isSplit && bonusVal > 0) {
      cashNoteEl.textContent = `(+Rs. ${Math.round(results.bonusAfterTax).toLocaleString('en-NP')} bonus when taken)`;
    } else {
      cashNoteEl.textContent = '';
    }
  }

  const monthlyTax = isSplit ? results.finalTaxLiability / 12 : results.taxWithoutBonus / 12;
  document.getElementById(`${prefix}-tax-monthly-${suffix}`).textContent = 'Rs. ' + Math.round(monthlyTax).toLocaleString('en-NP') + ' / mo';
  document.getElementById(`${prefix}-tax-annual-${suffix}`).textContent = 'Rs. ' + Math.round(results.finalTaxLiability).toLocaleString('en-NP') + ' / yr';

  const taxNoteEl = document.getElementById(`${prefix}-tax-monthly-note-${suffix}`);
  if (taxNoteEl) {
    if (!isSplit && bonusVal > 0 && results.marginalTaxOnBonus > 0) {
      taxNoteEl.textContent = `(+Rs. ${Math.round(results.marginalTaxOnBonus).toLocaleString('en-NP')} tax on bonus when taken)`;
    } else {
      taxNoteEl.textContent = '';
    }
  }

  const ctcNoBonus = results.costToCompany - bonusVal;
  const ctcMonthlyVal = isSplit ? results.costToCompany / 12 : ctcNoBonus / 12;
  document.getElementById(`${prefix}-ctc-monthly-${suffix}`).textContent = 'Rs. ' + Math.round(ctcMonthlyVal).toLocaleString('en-NP') + ' / mo';
  document.getElementById(`${prefix}-ctc-annual-${suffix}`).textContent = 'Rs. ' + Math.round(results.costToCompany).toLocaleString('en-NP') + ' / yr';

  const ctcNoteEl = document.getElementById(`${prefix}-ctc-monthly-note-${suffix}`);
  if (ctcNoteEl) {
    if (!isSplit && bonusVal > 0) {
      ctcNoteEl.textContent = `(+Rs. ${Math.round(bonusVal).toLocaleString('en-NP')} bonus when taken)`;
    } else {
      ctcNoteEl.textContent = '';
    }
  }

  document.getElementById(`${prefix}-savings-monthly-${suffix}`).textContent = 'Rs. ' + Math.round(results.totalRetirementSavingsAnnual / 12).toLocaleString('en-NP') + ' / mo';
  document.getElementById(`${prefix}-savings-annual-${suffix}`).textContent = 'Rs. ' + Math.round(results.totalRetirementSavingsAnnual).toLocaleString('en-NP') + ' / yr';
}

// --- Detailed Table for Negotiation View ---
function updateNegoDetailedTable(resBase, resNego, inputsBase, inputsNego) {
  const formatCell = (num, isBold = false) => {
    const rounded = Math.round(num);
    if (rounded < 0) {
      const text = 'Rs. (' + Math.abs(rounded).toLocaleString('en-NP') + ') [Refund]';
      return isBold ? `<strong>${text}</strong>` : text;
    }
    const text = 'Rs. ' + rounded.toLocaleString('en-NP');
    return isBold ? `<strong>${text}</strong>` : text;
  };

  const formatDiffCell = (diff) => {
    const rounded = Math.round(diff);
    if (rounded === 0) return 'Rs. 0';
    if (rounded < 0) {
      return `<span class="highlight-negative">Rs. (${Math.abs(rounded).toLocaleString('en-NP')})</span>`;
    }
    return `<span class="highlight-positive">+Rs. ${rounded.toLocaleString('en-NP')}</span>`;
  };

  const createRow = (label, valBase, valNego, isHeader = false, isBold = false, isDiffInverse = false) => {
    const diff = valNego - valBase;
    const diffVal = isDiffInverse ? -diff : diff;

    return `
      <tr class="${isHeader ? 'row-group-title' : ''} ${isBold ? 'net-highlight' : ''}">
        <td>${label}</td>
        <td>${formatCell(valBase, isBold)}</td>
        <td>${formatCell(valNego, isBold)}</td>
        <td>${formatDiffCell(diffVal)}</td>
      </tr>
    `;
  };

  let html = '';

  // 1. Gross Earnings
  const allowanceLabel = 'Annual Allowances (Adjusted for Gratuity Carve-out)';

  html += createRow('Gross Cash Salary components:', 0, 0, true);
  html += createRow('Annual Basic Salary', inputsBase.monthlyBasicSalary * 12, inputsNego.monthlyBasicSalary * 12);
  html += createRow(allowanceLabel, resBase.adjustedAllowancesAnnual, resNego.adjustedAllowancesAnnual);

  const cashGratuityBase = inputsBase.depositGratuity ? 0 : resBase.gratuityAnnual;
  const cashGratuityNego = inputsNego.depositGratuity ? 0 : resNego.gratuityAnnual;
  html += createRow('Annual Gratuity (Paid in Cash)', cashGratuityBase, cashGratuityNego);

  html += createRow('Annual Bonus / Festive Allowance', inputsBase.annualBonus, inputsNego.annualBonus);
  html += createRow('Annual Freelance / Consultancy Income', resBase.freelanceAnnual, resNego.freelanceAnnual);
  html += createRow('Annual Other Income', resBase.otherAnnual, resNego.otherAnnual);
  html += createRow('Bonus / Gratuity After Tax', resBase.bonusAfterTax, resNego.bonusAfterTax);
  html += createRow('Gross Cash Income (Annual)', resBase.grossCashSalaryAnnual, resNego.grossCashSalaryAnnual, false, true);

  // 2. Employer Additions & Cost to Company
  html += createRow('Employer Contributions & Cost to Company (CTC):', 0, 0, true);
  html += createRow('Employer SSF (20% basic)', resBase.employerSSFAnnual, resNego.employerSSFAnnual);
  html += createRow('Employer EPF (10% basic)', resBase.employerEPFAnnual, resNego.employerEPFAnnual);

  const depGratuityBase = inputsBase.depositGratuity ? resBase.gratuityAnnual : 0;
  const depGratuityNego = inputsNego.depositGratuity ? resNego.gratuityAnnual : 0;
  html += createRow('Employer Gratuity (8.33% basic deposited to CIT)', depGratuityBase, depGratuityNego);

  html += createRow('Assessable Income (Tax Base)', resBase.assessableIncome, resNego.assessableIncome, false, true);
  html += createRow('Cost to Company (CTC)', resBase.costToCompany, resNego.costToCompany, false, true);

  // 3. Deductions
  const retirementDeductionLabel = (inputsBase.useSSF || inputsNego.useSSF)
    ? 'Retirement Fund (SSF + EPF + CIT + Gratuity)'
    : 'Retirement Fund (EPF + CIT + Gratuity)';

  html += createRow('Allowable Tax Deductions:', 0, 0, true);
  html += createRow(retirementDeductionLabel, resBase.allowedRetirementDeduction, resNego.allowedRetirementDeduction, false, false, true);
  html += createRow('Life Insurance Exemption', resBase.allowedLifeInsurance, resNego.allowedLifeInsurance, false, false, true);
  html += createRow('Health Insurance Exemption', resBase.allowedHealthInsurance, resNego.allowedHealthInsurance, false, false, true);
  html += createRow('Remote Area Exemption', resBase.allowedRemoteArea, resNego.allowedRemoteArea, false, false, true);
  html += createRow('Total Taxable Income', resBase.taxableIncome, resNego.taxableIncome, false, true, true);

  // 4. Taxes & Credits
  html += createRow('Taxes and Credits Breakdown:', 0, 0, true);
  html += createRow('Base progressive Tax', resBase.baseTaxLiability, resNego.baseTaxLiability, false, false, true);
  html += createRow('Medical Expenses Tax Credit', resBase.allowedMedicalCredit, resNego.allowedMedicalCredit);
  html += createRow('Female Tax Rebate (10%)', resBase.femaleRebate, resNego.femaleRebate);
  html += createRow('Final Annual Income Tax Liability', resBase.finalTaxLiability, resNego.finalTaxLiability, false, true, true);
  html += createRow('TDS Paid at Source (15% Freelance + 10% Other)', resBase.tdsPaidSource, resNego.tdsPaidSource, false, false, true);
  html += createRow('Net Year-End Tax Payable / (Refund)', resBase.netTaxPayable, resNego.netTaxPayable, false, true, true);

  // 5. Cash in Hand
  html += createRow('Employee Cash flow (Net Take-home):', 0, 0, true);
  html += createRow('Out-of-Pocket Savings (Employee SSF+EPF+CIT)', resBase.employeeOutofPocketDeductions, resNego.employeeOutofPocketDeductions, false, false, true);
  html += createRow('Annual Cash in Hand (Take-Home)', resBase.netCashInHandAnnual, resNego.netCashInHandAnnual, false, true);

  let monthlyLabel = 'Monthly Cash in Hand (Take-Home)';
  monthlyLabel += inputsBase.splitBonus ? ' (incl. bonus)' : ' (excl. bonus & its tax)';
  html += createRow(monthlyLabel, resBase.netCashInHandMonthly, resNego.netCashInHandMonthly, false, true);

  // 6. Savings Growth
  html += createRow('Retirement Wealth Accumulation:', 0, 0, true);
  html += createRow('Annual Retirement Savings (incl. Employer Match)', resBase.totalRetirementSavingsAnnual, resNego.totalRetirementSavingsAnnual, false, false);
  html += createRow('Est. CIT KBB Withdrawal Tax (5% on gain/interest)', resBase.citKbbWithdrawalTax, resNego.citKbbWithdrawalTax, false, false, true);
  html += createRow('Est. Gratuity (GFS) Withdrawal Tax (5% on gain/interest)', resBase.gratuityWithdrawalTax, resNego.gratuityWithdrawalTax, false, false, true);

  const totalNegoWealthBase = resBase.netCashInHandAnnual + resBase.totalRetirementSavingsAnnual - resBase.citKbbWithdrawalTax - resBase.gratuityWithdrawalTax;
  const totalNegoWealthNego = resNego.netCashInHandAnnual + resNego.totalRetirementSavingsAnnual - resNego.citKbbWithdrawalTax - resNego.gratuityWithdrawalTax;
  html += createRow('Total Financial Value (Take-Home + Savings - Exit Taxes)', totalNegoWealthBase, totalNegoWealthNego, false, true);

  negoComparisonTableBody.innerHTML = html;
}

// --- Core Recalculation for Negotiation Mode ---
function triggerNegotiationRecalculation() {
  if (currentNavTab !== 'negotiate') return;

  const baseProfile = negoBaseProfile.value;
  const isProfileB = (baseProfile === 'profileB_83');
  const suffix = isProfileB ? 'b' : 'a';
  const year = (baseProfile === 'profileA_82') ? '2082_83' : '2083_84';

  const baseInputs = getCalculatorInputs(suffix);
  const isModeY = modeYSwitch ? modeYSwitch.selected : false;

  // Enforce Mode Y settings on base inputs if Mode Y is ON
  if (isModeY) {
    baseInputs.useSSF = false;
    baseInputs.useEPF = true;
    baseInputs.remoteArea = 'None';
    baseInputs.healthInsurancePremium = 0;
    baseInputs.medicalExpenses = 0;
    baseInputs.splitBonus = false;
  }

  // Calculate base offer results
  let baseCit = baseInputs.citMonthly;
  if (isModeY) {
    baseCit = Math.max(0, baseCit - (baseInputs.monthlyBasicSalary * 0.10));
  }
  
  const baseCalcInputs = {
    ...baseInputs,
    citMonthly: baseCit,
    year: year
  };
  const resBase = calculateTax(baseCalcInputs);

  // Read negotiation adjustments
  const basicType = negoBasicType.value;
  const basicAction = negoBasicAction.value;
  const basicVal = parseFloat(negoBasicVal.value) || 0;

  const allowanceType = negoAllowanceType.value;
  const allowanceAction = negoAllowanceAction.value;
  const allowanceVal = parseFloat(negoAllowanceVal.value) || 0;

  // Compute adjusted monthly basic salary
  let basicAdj = 0;
  if (basicType === 'percent') {
    basicAdj = baseInputs.monthlyBasicSalary * (basicVal / 100);
  } else {
    basicAdj = basicVal;
  }
  const negoBasic = basicAction === 'increase'
    ? baseInputs.monthlyBasicSalary + basicAdj
    : Math.max(0, baseInputs.monthlyBasicSalary - basicAdj);

  // Compute adjusted allowances
  let allowanceAdj = 0;
  if (allowanceType === 'percent') {
    allowanceAdj = baseInputs.monthlyAllowances * (allowanceVal / 100);
  } else {
    allowanceAdj = allowanceVal;
  }
  const negoAllowance = allowanceAction === 'increase'
    ? baseInputs.monthlyAllowances + allowanceAdj
    : Math.max(0, baseInputs.monthlyAllowances - allowanceAdj);

  // Calculate negotiated offer results
  let negoCitVal = baseInputs.citMonthly;
  if (isModeY) {
    negoCitVal = Math.max(0, negoCitVal - (negoBasic * 0.10));
  }

  const negoCalcInputs = {
    ...baseInputs,
    monthlyBasicSalary: negoBasic,
    monthlyAllowances: negoAllowance,
    citMonthly: negoCitVal,
    year: year
  };
  const resNego = calculateTax(negoCalcInputs);

  // Update Summary displays
  updateNegoSummaryCard('nego', 'base', resBase, baseCalcInputs.splitBonus, baseCalcInputs.annualBonus);
  updateNegoSummaryCard('nego', 'nego', resNego, negoCalcInputs.splitBonus, negoCalcInputs.annualBonus);

  // Draw Slab Progress Bars
  drawSlabProgressBar('base', resBase, 'nego');
  drawSlabProgressBar('nego', resNego, 'nego');

  // Draw Charts
  drawDonutChart('nego-chart-svg-base', resBase);
  drawDonutChart('nego-chart-svg-nego', resNego);

  // Update Table
  updateNegoDetailedTable(resBase, resNego, baseCalcInputs, negoCalcInputs);

  // Save State
  saveInputsToLocalStorage();
}

// --- Initialize App ---
initTheme();
const loadedFromUrl = loadInputsFromUrl();
if (!loadedFromUrl) {
  loadInputsFromLocalStorage();
}
syncSsfAndGratuity();
syncNegoBaseProfileSelect();
triggerRecalculation();
if (currentNavTab === 'negotiate') {
  triggerNegotiationRecalculation();
}
updateHeaderHeight();
console.log('Nepal Income Tax Calculator Controller initialized!');
