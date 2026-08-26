/**
 * Shopify Admin Product Search URL Maker
 * Author: Alok Shrestha (hello@aloks.com.np)
 * Description: Client-side JavaScript application to generate Shopify Admin Product URLs 
 * with multi-vendor, multi-status, and custom filter support.
 */

(function () {
  'use strict';

  // --- STATE MANAGEMENT ---
  const state = {
    store: 'rugsdoneright-store',
    savedViewId: '819195150620',
    order: 'created_at desc',
    selectedColumns: 'IMAGE,TITLE,STATUS,INVENTORY,CATEGORY,SALES_CHANNEL_COUNT,CATALOGS,PRODUCT_TYPE,VENDOR',
    vendors: ['Annie Selke MW', 'Annie Selke Sale'],
    statuses: [],
    customQuery: '',
    vendorSearchQuery: '',
    theme: 'system',
    logs: [],
    history: []
  };

  // --- DOM ELEMENTS ---
  const elements = {
    storeInput: document.getElementById('storeInput'),
    savedViewIdInput: document.getElementById('savedViewIdInput'),
    orderSelect: document.getElementById('orderSelect'),
    selectedColumnsInput: document.getElementById('selectedColumnsInput'),
    customQueryInput: document.getElementById('customQueryInput'),
    selectedVendorPillsContainer: document.getElementById('selectedVendorPillsContainer'),
    vendorSelectedCount: document.getElementById('vendorSelectedCount'),
    clearAllVendorsBtn: document.getElementById('clearAllVendorsBtn'),
    vendorSearchInput: document.getElementById('vendorSearchInput'),
    addVendorBtn: document.getElementById('addVendorBtn'),
    vendorMatchCount: document.getElementById('vendorMatchCount'),
    selectAllFilteredVendorsBtn: document.getElementById('selectAllFilteredVendorsBtn'),
    deselectAllVendorsBtn: document.getElementById('deselectAllVendorsBtn'),
    vendorChecklistContainer: document.getElementById('vendorChecklistContainer'),
    statusPillsContainer: document.getElementById('statusPillsContainer'),
    urlOutputDisplay: document.getElementById('urlOutputDisplay'),
    copyUrlBtn: document.getElementById('copyUrlBtn'),
    openUrlBtn: document.getElementById('openUrlBtn'),
    queryBreakdownTable: document.getElementById('queryBreakdownTable'),
    themeBtns: document.querySelectorAll('.theme-btn'),
    historyList: document.getElementById('historyList'),
    clearHistoryBtn: document.getElementById('clearHistoryBtn'),
    logModal: document.getElementById('logModal'),
    viewLogsBtn: document.getElementById('viewLogsBtn'),
    closeLogsBtn: document.getElementById('closeLogsBtn'),
    downloadLogsBtn: document.getElementById('downloadLogsBtn'),
    logConsole: document.getElementById('logConsole'),
    toastContainer: document.getElementById('toastContainer')
  };

  // Pre-configured popular vendors (Extracted from Shopify Admin filter metadata)
  const DEFAULT_PRESET_VENDORS = [
    'Abani',
    'Addison Rugs',
    'Amer',
    'AminCo',
    'AminCo Clearance',
    'Anji Mountain Bamboo Rug, Co.',
    'Annie Selke MW',
    'Annie Selke Sale',
    'Antrim',
    'Bashian',
    'Bokara Rug Co.',
    'Boston & Post',
    'Boutique Rugs',
    'Capel',
    'Capel Custom',
    'Chandra',
    'Classic Home Rugs',
    'Colonial Mills',
    'Couristan',
    'Dalyn Clearance',
    'Dalyn Customizable',
    'Dalyn Rug',
    'Dash & Albert',
    'Dash & Albert Custom',
    'Dash & Albert Pads',
    'Delos, Inc.',
    'Dynamic Rugs',
    'Flagship Carpets',
    'Flokati',
    'Foothill Oriental Rugs',
    'Global Views',
    'Hauteloom',
    'Homespice Decor',
    'HRI',
    'Jade',
    'Jaipur Closeout',
    'Jaipur Living',
    'Joy Carpets, Inc.',
    'Kalaty Clearance',
    'Kalaty Rug Co.',
    'Kaleen',
    'Kane Carpet',
    'Karastan',
    'Kas Clearance',
    'Kas Oriental',
    'Lavin Rugs',
    'Linon Home Decor',
    'Livabliss',
    'Loloi Rugs',
    'Louis De Poortere',
    'LR Home',
    'Luxacor',
    'Mercer Street',
    'Modern Nature Design',
    'Momeni',
    'Momeni Closeout',
    'Momeni Sale',
    'Mulberry',
    'N/A',
    'Nourison',
    'Nourison Clearance',
    'Nourison Pillows',
    'Nourison Sale',
    'Nuloom',
    'Obeetee',
    'Private Label',
    'RDR Gift Card',
    'RDR Pads',
    'Rhody Rug',
    'Route',
    'Rugs Done Right',
    'Rugs Done Right Custom',
    'Safa Clearance',
    'Safavieh Clearance',
    'Safavieh Pads',
    'Shalom Brothers',
    'Spicher and Company',
    'St. Croix Clearance',
    'Store Clearance',
    'Surya Closeout',
    'Surya Pads',
    'Surya Pillows',
    'Surya Rug Co.',
    'The Rug Market',
    'Tibet Rug Company',
    'Tibet Rug Company Liquidation',
    'Trans-Ocean Inc.',
    'Unique Loom',
    'United Weavers'
  ];

  // Available statuses
  const STATUS_OPTIONS = ['ACTIVE', 'DRAFT', 'ARCHIVED', 'UNLISTED'];

  // --- LOGGING UTILITY ---
  function logEvent(level, message, detail = null) {
    const timestamp = new Date().toISOString();
    const logEntry = { timestamp, level, message, detail };
    state.logs.push(logEntry);

    // Keep max 200 log entries in state
    if (state.logs.length > 200) {
      state.logs.shift();
    }

    // Save to localStorage for debugging/persistence
    try {
      localStorage.setItem('shopify_url_maker_logs', JSON.stringify(state.logs));
    } catch (e) {
      console.error('Failed to save logs to localStorage', e);
    }
  }

  // --- TOAST NOTIFICATIONS ---
  function showToast(message, duration = 3000) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    elements.toastContainer.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  // --- THEME MANAGEMENT ---
  function initTheme() {
    const savedTheme = localStorage.getItem('theme_preference') || 'system';
    setTheme(savedTheme, false);

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (state.theme === 'system') {
        applyThemeToDOM('system');
      }
    });
  }

  function setTheme(theme, updateHash = true) {
    state.theme = theme;
    localStorage.setItem('theme_preference', theme);
    applyThemeToDOM(theme);

    elements.themeBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.theme === theme);
    });

    logEvent('INFO', `Theme changed to: ${theme}`);
    if (updateHash) updateStateAndHash();
  }

  function applyThemeToDOM(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }

  // --- URL CONSTRUCTION ---
  function generateShopifyUrl() {
    const store = (elements.storeInput.value || state.store).trim();
    const savedViewId = (elements.savedViewIdInput.value || state.savedViewId).trim();
    const order = (elements.orderSelect.value || state.order).trim();
    const selectedColumns = (elements.selectedColumnsInput.value || state.selectedColumns).trim();
    const customQuery = (elements.customQueryInput.value || '').trim();

    const queryParts = [];

    // Add status query component
    if (state.statuses.length > 0) {
      const statusValue = state.statuses.join(',');
      queryParts.push(`status:"${statusValue}"`);
    }

    // Add vendor query component (comma-separated inside quotes)
    if (state.vendors.length > 0) {
      const vendorValue = state.vendors.join(',');
      queryParts.push(`vendor:"${vendorValue}"`);
    }

    // Add custom query component
    if (customQuery) {
      queryParts.push(customQuery);
    }

    const rawQuery = queryParts.join(' ');

    // Construct base URL
    const baseUrl = `https://admin.shopify.com/store/${encodeURIComponent(store)}/products`;
    const searchParams = new URLSearchParams();

    if (savedViewId) searchParams.set('savedViewId', savedViewId);
    if (rawQuery) searchParams.set('query', rawQuery);
    if (order) searchParams.set('order', order);
    if (selectedColumns) searchParams.set('selectedColumns', selectedColumns);

    const fullUrl = `${baseUrl}?${searchParams.toString()}`;

    // Update UI Output
    elements.urlOutputDisplay.textContent = fullUrl;
    elements.openUrlBtn.href = fullUrl;

    // Update query breakdown inspection table
    updateQueryBreakdown(store, savedViewId, state.statuses, state.vendors, rawQuery, order);

    logEvent('DEBUG', 'Generated Shopify URL', { fullUrl, rawQuery });
    return fullUrl;
  }

  function updateQueryBreakdown(store, savedViewId, statuses, vendors, rawQuery, order) {
    const html = `
      <tr>
        <th>Store Name</th>
        <td>${escapeHtml(store)}</td>
      </tr>
      <tr>
        <th>Saved View ID</th>
        <td>${escapeHtml(savedViewId || 'None')}</td>
      </tr>
      <tr>
        <th>Selected Statuses (${statuses.length})</th>
        <td>${statuses.length > 0 ? escapeHtml(statuses.join(', ')) : '<em>All Statuses</em>'}</td>
      </tr>
      <tr>
        <th>Selected Vendors (${vendors.length})</th>
        <td>${vendors.length > 0 ? escapeHtml(vendors.join(', ')) : '<em>All Vendors</em>'}</td>
      </tr>
      <tr>
        <th>Decoded Search Query</th>
        <td><code>${escapeHtml(rawQuery || 'None')}</code></td>
      </tr>
      <tr>
        <th>Sorting Order</th>
        <td>${escapeHtml(order)}</td>
      </tr>
    `;
    elements.queryBreakdownTable.innerHTML = html;
  }

  // --- STATE SYNCHRONIZATION WITH URL HASH ---
  function updateStateAndHash() {
    state.store = elements.storeInput.value.trim();
    state.savedViewId = elements.savedViewIdInput.value.trim();
    state.order = elements.orderSelect.value;
    state.selectedColumns = elements.selectedColumnsInput.value.trim();
    state.customQuery = elements.customQueryInput.value.trim();

    const url = generateShopifyUrl();

    // Serialize to location hash for single-page refresh persistence
    const hashData = {
      store: state.store,
      savedViewId: state.savedViewId,
      order: state.order,
      vendors: state.vendors,
      statuses: state.statuses,
      customQuery: state.customQuery
    };

    const hashString = '#' + encodeURIComponent(JSON.stringify(hashData));
    if (window.location.hash !== hashString) {
      history.replaceState(null, '', hashString);
    }
  }

  function loadStateFromHash() {
    if (!window.location.hash || window.location.hash.length < 2) {
      renderVendorSection();
      renderStatusPills();
      generateShopifyUrl();
      return;
    }

    try {
      const jsonStr = decodeURIComponent(window.location.hash.substring(1));
      const parsed = JSON.parse(jsonStr);

      if (parsed.store) elements.storeInput.value = parsed.store;
      if (parsed.savedViewId) elements.savedViewIdInput.value = parsed.savedViewId;
      if (parsed.order) elements.orderSelect.value = parsed.order;
      if (Array.isArray(parsed.vendors)) state.vendors = parsed.vendors;
      if (Array.isArray(parsed.statuses)) state.statuses = parsed.statuses;
      if (parsed.customQuery !== undefined) elements.customQueryInput.value = parsed.customQuery;

      renderVendorSection();
      renderStatusPills();
      generateShopifyUrl();

      logEvent('INFO', 'Loaded application state from URL hash', parsed);
    } catch (err) {
      logEvent('WARN', 'Failed to parse URL hash state', { error: err.message });
      renderVendorSection();
      renderStatusPills();
      generateShopifyUrl();
    }
  }

  // --- SEARCHABLE VENDOR MULTI-SELECT RENDERING ---
  function renderVendorSection() {
    renderSelectedVendorPills();
    renderVendorChecklist();
  }

  function renderSelectedVendorPills() {
    elements.selectedVendorPillsContainer.innerHTML = '';
    elements.vendorSelectedCount.textContent = `${state.vendors.length} selected`;
    elements.clearAllVendorsBtn.style.display = state.vendors.length > 0 ? 'inline-block' : 'none';

    if (state.vendors.length === 0) {
      elements.selectedVendorPillsContainer.innerHTML = `
        <div class="vendor-empty-state" style="padding: 4px 8px; width: 100%;">
          No vendors selected. Search and check vendors from the list below.
        </div>
      `;
      return;
    }

    state.vendors.forEach(vendor => {
      const pill = document.createElement('div');
      pill.className = 'pill-option selected';
      pill.innerHTML = `
        <span>${escapeHtml(vendor)}</span>
        <button type="button" class="tag-remove" aria-label="Remove vendor">&times;</button>
      `;

      pill.querySelector('.tag-remove').addEventListener('click', (e) => {
        e.stopPropagation();
        toggleVendor(vendor, false);
      });

      elements.selectedVendorPillsContainer.appendChild(pill);
    });
  }

  function getFilteredVendors() {
    const allOptions = Array.from(new Set([...DEFAULT_PRESET_VENDORS, ...state.vendors]));
    const q = (state.vendorSearchQuery || '').toLowerCase().trim();
    if (!q) return { allOptions, filtered: allOptions };

    const filtered = allOptions.filter(v => v.toLowerCase().includes(q));
    return { allOptions, filtered };
  }

  function renderVendorChecklist() {
    elements.vendorChecklistContainer.innerHTML = '';
    const { allOptions, filtered } = getFilteredVendors();

    const q = (state.vendorSearchQuery || '').trim();
    if (q) {
      elements.vendorMatchCount.textContent = `Showing ${filtered.length} of ${allOptions.length} vendors`;
    } else {
      elements.vendorMatchCount.textContent = `${allOptions.length} vendors available`;
    }

    if (filtered.length === 0) {
      elements.vendorChecklistContainer.innerHTML = `
        <div class="vendor-empty-state">
          No matching vendors found for "<strong>${escapeHtml(q)}</strong>".<br>
          Press <strong>Enter</strong> or click <strong>+ Add</strong> to add as a custom vendor.
        </div>
      `;
      return;
    }

    filtered.forEach(vendor => {
      const isSelected = state.vendors.includes(vendor);
      const label = document.createElement('label');
      label.className = `vendor-checkbox-item ${isSelected ? 'selected' : ''}`;

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = isSelected;

      checkbox.addEventListener('change', (e) => {
        toggleVendor(vendor, e.target.checked);
      });

      const span = document.createElement('span');
      span.textContent = vendor;

      label.appendChild(checkbox);
      label.appendChild(span);
      elements.vendorChecklistContainer.appendChild(label);
    });
  }

  function toggleVendor(vendor, forceSelect) {
    const index = state.vendors.indexOf(vendor);
    if (forceSelect && index === -1) {
      state.vendors.push(vendor);
      logEvent('INFO', `Vendor added: ${vendor}`);
    } else if (!forceSelect && index !== -1) {
      state.vendors.splice(index, 1);
      logEvent('INFO', `Vendor removed: ${vendor}`);
    }
    renderVendorSection();
    updateStateAndHash();
  }

  function handleAddCustomVendor() {
    const val = (elements.vendorSearchInput.value || '').trim();
    if (!val) return;

    const newVendors = val.split(',').map(v => v.trim()).filter(Boolean);
    let addedCount = 0;

    newVendors.forEach(vendor => {
      if (!state.vendors.includes(vendor)) {
        state.vendors.push(vendor);
        addedCount++;
      }
    });

    elements.vendorSearchInput.value = '';
    state.vendorSearchQuery = '';

    renderVendorSection();
    updateStateAndHash();

    if (addedCount > 0) {
      showToast(`Selected vendor(s): ${newVendors.join(', ')}`);
    }
  }

  function selectAllFilteredVendors() {
    const { filtered } = getFilteredVendors();
    let added = 0;
    filtered.forEach(vendor => {
      if (!state.vendors.includes(vendor)) {
        state.vendors.push(vendor);
        added++;
      }
    });
    renderVendorSection();
    updateStateAndHash();
    showToast(`Selected ${added} filtered vendor(s)`);
  }

  function clearAllVendors() {
    state.vendors = [];
    renderVendorSection();
    updateStateAndHash();
    showToast('Cleared all vendor filters');
  }

  // --- STATUS PILLS RENDERING ---
  function renderStatusPills() {
    elements.statusPillsContainer.innerHTML = '';

    STATUS_OPTIONS.forEach(status => {
      const isSelected = state.statuses.includes(status);
      const pill = document.createElement('div');
      const statusClass = `pill-status-${status.toLowerCase()}`;
      pill.className = `pill-option ${statusClass} ${isSelected ? 'selected' : ''}`;
      pill.textContent = status;

      pill.addEventListener('click', () => {
        const index = state.statuses.indexOf(status);
        if (index === -1) {
          state.statuses.push(status);
        } else {
          state.statuses.splice(index, 1);
        }
        renderStatusPills();
        updateStateAndHash();
      });

      elements.statusPillsContainer.appendChild(pill);
    });
  }

  // --- HISTORY MANAGEMENT ---
  function addToHistory(url) {
    // Avoid duplicate top entry
    if (state.history.length > 0 && state.history[0].url === url) return;

    const vendorLabel = state.vendors.length > 0 ? state.vendors.join(', ') : 'All Vendors';
    const statusLabel = state.statuses.length > 0 ? state.statuses.join(', ') : 'All Statuses';

    const historyItem = {
      url,
      timestamp: new Date().toLocaleTimeString(),
      label: `${vendorLabel} [${statusLabel}]`
    };

    state.history.unshift(historyItem);
    if (state.history.length > 10) state.history.pop();

    renderHistory();
    try {
      localStorage.setItem('shopify_url_maker_history', JSON.stringify(state.history));
    } catch (e) {}
  }

  function loadFromHistoryUrl(urlStr) {
    try {
      const urlObj = new URL(urlStr);
      const pathParts = urlObj.pathname.split('/');
      const storeIdx = pathParts.indexOf('store');
      if (storeIdx !== -1 && pathParts[storeIdx + 1]) {
        elements.storeInput.value = decodeURIComponent(pathParts[storeIdx + 1]);
      }

      const searchParams = urlObj.searchParams;
      if (searchParams.has('savedViewId')) {
        elements.savedViewIdInput.value = searchParams.get('savedViewId');
      }
      if (searchParams.has('order')) {
        elements.orderSelect.value = searchParams.get('order');
      }
      if (searchParams.has('selectedColumns')) {
        elements.selectedColumnsInput.value = searchParams.get('selectedColumns');
      }

      if (searchParams.has('query')) {
        const queryStr = searchParams.get('query');
        state.vendors = [];
        state.statuses = [];
        elements.customQueryInput.value = '';

        const vendorMatch = queryStr.match(/vendor:"([^"]+)"/);
        if (vendorMatch && vendorMatch[1]) {
          state.vendors = vendorMatch[1].split(',').map(v => v.trim()).filter(Boolean);
        }

        const statusMatch = queryStr.match(/status:"([^"]+)"/);
        if (statusMatch && statusMatch[1]) {
          state.statuses = statusMatch[1].split(',').map(s => s.trim()).filter(Boolean);
        }

        let customParts = queryStr
          .replace(/vendor:"[^"]+"/, '')
          .replace(/status:"[^"]+"/, '')
          .trim();
        elements.customQueryInput.value = customParts;
      }

      renderVendorSection();
      renderStatusPills();
      updateStateAndHash();
      showToast('Loaded configuration from URL history! ⚡');
      logEvent('INFO', 'Loaded configuration from history URL', { urlStr });
    } catch (e) {
      showToast('Failed to parse history URL');
      logEvent('ERROR', 'Parse history URL failed', { error: e.message });
    }
  }

  function renderHistory() {
    elements.historyList.innerHTML = '';
    if (state.history.length === 0) {
      elements.historyList.innerHTML = '<div style="color: var(--text-secondary); font-size: 0.8rem; text-align: center; padding: 10px;">No URL history saved yet.</div>';
      return;
    }

    state.history.forEach((item, idx) => {
      const div = document.createElement('div');
      div.className = 'history-item';
      div.innerHTML = `
        <div class="history-info">
          <div class="history-label">${escapeHtml(item.label)}</div>
          <div class="history-url" title="${escapeHtml(item.url)}">${escapeHtml(item.url)}</div>
        </div>
        <div class="history-actions">
          <button class="btn btn-secondary btn-sm copy-hist-btn" data-index="${idx}" title="Copy URL">📋</button>
          <button class="btn btn-secondary btn-sm load-hist-btn" data-index="${idx}" title="Load into Form">⚡</button>
          <button class="btn btn-secondary btn-sm delete-hist-btn" data-index="${idx}" title="Remove">&times;</button>
        </div>
      `;
      elements.historyList.appendChild(div);
    });

    // Event Delegation / Handlers for History Actions
    elements.historyList.querySelectorAll('.copy-hist-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.dataset.index, 10);
        if (state.history[idx]) {
          navigator.clipboard.writeText(state.history[idx].url).then(() => {
            showToast('History URL copied to clipboard!');
          });
        }
      });
    });

    elements.historyList.querySelectorAll('.load-hist-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.dataset.index, 10);
        if (state.history[idx]) {
          loadFromHistoryUrl(state.history[idx].url);
        }
      });
    });

    elements.historyList.querySelectorAll('.delete-hist-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.dataset.index, 10);
        if (!isNaN(idx) && state.history[idx]) {
          state.history.splice(idx, 1);
          try {
            localStorage.setItem('shopify_url_maker_history', JSON.stringify(state.history));
          } catch (err) {}
          renderHistory();
          showToast('History item removed');
        }
      });
    });
  }

  function loadHistoryFromStorage() {
    try {
      const saved = localStorage.getItem('shopify_url_maker_history');
      if (saved) {
        state.history = JSON.parse(saved);
        renderHistory();
      }
    } catch (e) {}
  }

  // --- LOG MODAL & EXPORT ---
  function openLogModal() {
    elements.logConsole.textContent = state.logs.map(l =>
      `[${l.timestamp}] [${l.level}] ${l.message} ${l.detail ? JSON.stringify(l.detail) : ''}`
    ).join('\n');
    elements.logModal.classList.add('open');
  }

  function closeLogModal() {
    elements.logModal.classList.remove('open');
  }

  function downloadLogs() {
    const content = state.logs.map(l =>
      `[${l.timestamp}] [${l.level}] ${l.message} ${l.detail ? JSON.stringify(l.detail) : ''}`
    ).join('\r\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shopify_url_maker_log_${new Date().toISOString().slice(0, 10)}.log`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    logEvent('INFO', 'Downloaded session log file');
    showToast('Log file downloaded!');
  }

  // --- HELPER UTILS ---
  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // --- EVENT LISTENERS INITIALIZATION ---
  function initEventListeners() {
    // Theme Switchers
    elements.themeBtns.forEach(btn => {
      btn.addEventListener('click', () => setTheme(btn.dataset.theme));
    });

    // Inputs change listeners
    [
      elements.storeInput,
      elements.savedViewIdInput,
      elements.orderSelect,
      elements.selectedColumnsInput,
      elements.customQueryInput
    ].forEach(input => {
      input.addEventListener('input', updateStateAndHash);
    });

    // Searchable Vendor Multi-Select Events
    elements.vendorSearchInput.addEventListener('input', (e) => {
      state.vendorSearchQuery = e.target.value;
      renderVendorChecklist();
    });

    elements.vendorSearchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleAddCustomVendor();
      }
    });

    elements.addVendorBtn.addEventListener('click', handleAddCustomVendor);
    elements.clearAllVendorsBtn.addEventListener('click', clearAllVendors);
    elements.selectAllFilteredVendorsBtn.addEventListener('click', selectAllFilteredVendors);
    elements.deselectAllVendorsBtn.addEventListener('click', clearAllVendors);

    // Copy URL Button
    elements.copyUrlBtn.addEventListener('click', () => {
      const url = elements.urlOutputDisplay.textContent;
      navigator.clipboard.writeText(url).then(() => {
        showToast('URL copied to clipboard! 📋');
        addToHistory(url);
        logEvent('INFO', 'URL copied to clipboard', { url });
      }).catch(err => {
        showToast('Failed to copy URL');
        logEvent('ERROR', 'Clipboard write failed', { error: err.message });
      });
    });

    // Open URL Button
    elements.openUrlBtn.addEventListener('click', () => {
      const url = elements.urlOutputDisplay.textContent;
      addToHistory(url);
      logEvent('INFO', 'Opened URL in new tab', { url });
    });

    // Clear History
    elements.clearHistoryBtn.addEventListener('click', () => {
      state.history = [];
      localStorage.removeItem('shopify_url_maker_history');
      renderHistory();
      showToast('History cleared');
    });

    // Logs modal
    elements.viewLogsBtn.addEventListener('click', openLogModal);
    elements.closeLogsBtn.addEventListener('click', closeLogModal);
    elements.downloadLogsBtn.addEventListener('click', downloadLogs);
    elements.logModal.addEventListener('click', (e) => {
      if (e.target === elements.logModal) closeLogModal();
    });

    // Hash change event (stay on page on refresh / browser back/forward)
    window.addEventListener('hashchange', loadStateFromHash);
  }

  // --- INITIALIZATION ---
  function init() {
    logEvent('INFO', 'Initializing Shopify URL Maker Application');
    initTheme();
    loadHistoryFromStorage();
    initEventListeners();
    loadStateFromHash();
  }

  // Run on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
