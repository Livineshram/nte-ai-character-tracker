// Constants and Configuration
const THRESHOLDS = [0, 500, 1500, 3500, 7000, 12000, 19000, 28000, 40000, 56000];
const MAX_AFFECTION = 56000;
const MAX_LEVEL = 10;
const GIFTS_PER_DAY = 3;
const STORAGE_KEY = 'nteBondV1';

// State Management
const defaultState = {
  character: 'chaos',
  goal: 'balanced',
  bond: { lv: 8, inside: 611, fons: 0 },
  owned: {},
  selected: {}
};

let state = loadState();
let currentCharacterId = state.character;

// Utility Functions
const $ = id => document.getElementById(id);
const money = n => Number(n).toLocaleString();
const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    return { ...defaultState, ...saved };
  } catch (error) {
    console.warn('Failed to load state, using defaults:', error);
    return { ...defaultState };
  }
}

function saveState() {
  try {
    state.character = currentCharacterId;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    updateLastSavedIndicator();
  } catch (error) {
    console.error('Failed to save state:', error);
    showToast('Failed to save data', 'error');
  }
}

// Character Functions
function getCurrentCharacter() {
  return getCharacter(currentCharacterId) || NTE_CHARACTERS[0];
}

function getCurrentGifts() {
  return getBondGifts(currentCharacterId) || [];
}

function giftKey(giftName) {
  return `${currentCharacterId}|${giftName}`;
}

// Affinity Calculations
function calculateTotalAffinity() {
  const level = clamp(Number(state.bond.lv) || 1, 1, MAX_LEVEL);
  const inside = Math.max(0, Number(state.bond.inside) || 0);
  const baseAffinity = THRESHOLDS[level - 1] || 0;
  return Math.min(MAX_AFFECTION, baseAffinity + inside);
}

function getLevelProgress() {
  const total = calculateTotalAffinity();
  const currentLevel = clamp(Number(state.bond.lv) || 1, 1, MAX_LEVEL);
  const currentThreshold = THRESHOLDS[currentLevel - 1] || 0;
  const nextThreshold = THRESHOLDS[currentLevel] || MAX_AFFECTION;
  
  return {
    level: currentLevel,
    progressInLevel: Math.max(0, total - currentThreshold),
    levelRequirement: nextThreshold - currentThreshold,
    total,
    remaining: Math.max(0, MAX_AFFECTION - total)
  };
}

// UI Rendering
function renderCharacterSelector() {
  const searchTerm = ($('search')?.value || '').toLowerCase().trim();
  const filteredCharacters = NTE_CHARACTERS.filter(c => 
    c.name.toLowerCase().includes(searchTerm) ||
    c.faction.toLowerCase().includes(searchTerm)
  );
  
  const charactersHTML = filteredCharacters.map(c => {
    const hasGiftData = getBondGifts(c.id).length > 0;
    const isActive = c.id === currentCharacterId;
    const badge = hasGiftData ? '' : '<span class="badge warning">No data</span>';
    
    return `
      <button class="char-card ${isActive ? 'active' : ''}" 
              data-character="${c.id}" 
              title="${c.name} - ${c.faction}${hasGiftData ? '' : ' (No gift data)'}">
        <div class="fallback">${c.icon}</div>
        <div class="char-info">
          <b>${c.name}</b>
          <small>${c.faction}</small>
          ${badge}
        </div>
      </button>
    `;
  }).join('');
  
  if ($('characters')) {
    $('characters').innerHTML = charactersHTML || '<div class="muted">No characters found</div>';
    
    document.querySelectorAll('[data-character]').forEach(btn => {
      btn.addEventListener('click', () => {
        currentCharacterId = btn.dataset.character;
        saveState();
        renderAll();
      });
    });
  }
}

function renderProfile() {
  const character = getCurrentCharacter();
  const progress = getLevelProgress();
  const percentage = (progress.total / MAX_AFFECTION) * 100;
  
  // Update character info
  if ($('charName')) $('charName').textContent = character.name;
  if ($('giftTitle')) $('giftTitle').textContent = character.name;
  if ($('heroName')) $('heroName').textContent = character.name.toUpperCase();
  
  // Update metadata
  if ($('charMeta')) {
    $('charMeta').innerHTML = `
      <span class="meta">${character.icon} ${character.faction}</span>
      <span class="meta">❤️ Bond Level ${progress.level}</span>
    `;
  }
  
  // Update bond stats
  if ($('bond')) $('bond').textContent = `Lv.${state.bond.lv}`;
  if ($('total')) $('total').textContent = money(progress.total);
  if ($('need')) $('need').textContent = money(progress.remaining);
  if ($('fonsText')) $('fonsText').textContent = state.bond.fons ? money(state.bond.fons) : '—';
  if ($('pct')) $('pct').textContent = `${Math.round(percentage)}%`;
  
  // Update progress ring
  if ($('ring')) {
    $('ring').style.setProperty('--pct', `${percentage}%`);
    $('ring').setAttribute('aria-valuenow', Math.round(percentage));
  }
  
  // Update level progress indicator
  if ($('levelProgress')) {
    const levelPct = (progress.progressInLevel / progress.levelRequirement) * 100;
    $('levelProgress').innerHTML = `
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${levelPct}%"></div>
      </div>
      <small>${money(progress.progressInLevel)} / ${money(progress.levelRequirement)} AP to next level</small>
    `;
  }
}

function getGiftIcon(gift) {
  const name = gift.name.toLowerCase();
  if (name.includes('letter')) return '💌';
  if (name.includes('cinema')) return '🎟️';
  if (gift.affection >= 1200) return '⭐';
  if (name.includes('kokoro')) return '🏍️';
  if (name.includes('asahi')) return '⚔️';
  if (gift.affection >= 400) return '💎';
  if (gift.affection >= 200) return '🎁';
  if (name.includes('food') || name.includes('snack') || name.includes('bread')) return '🍽️';
  return '🎀';
}

function renderGiftList() {
  const gifts = getCurrentGifts();
  const giftGrid = $('giftGrid');
  
  if (!giftGrid) return;
  
  if (!gifts.length) {
    giftGrid.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🔍</div>
        <h3>No Gift Data Available</h3>
        <p class="muted">This character has not been audited yet. We are deliberately leaving missing data blank rather than inventing gift values.</p>
      </div>
    `;
    return;
  }
  
  const giftsHTML = gifts.map(gift => {
    const key = giftKey(gift.name);
    const owned = Number(state.owned[key] || 0);
    const isSelected = state.selected[key] !== false;
    const encodedName = encodeURIComponent(gift.name);
    
    const priceDisplay = gift.price === null 
      ? 'No Fons price' 
      : `${money(gift.price)} Fons`;
    
    const availabilityIcon = {
      'shop': '🛒',
      'gacha': '🎰',
      'free': '🎁',
      'paid': '💳',
      'event': '📅',
      'story': '📖',
      'unknown': '❓'
    }[gift.availability] || '📦';
    
    return `
      <article class="gift-card ${isSelected ? 'selected' : ''}" data-gift="${encodedName}">
        <div class="gift-header">
          <div class="gift-icon">${getGiftIcon(gift)}</div>
          <div class="gift-badges">
            <span class="badge affection">❤️ ${money(gift.affection)} AP</span>
            <span class="badge price">${priceDisplay}</span>
            <span class="badge availability">${availabilityIcon} ${gift.availability}</span>
          </div>
        </div>
        
        <h3 class="gift-name">${gift.name}</h3>
        
        <div class="gift-location">📍 ${gift.location}</div>
        
        ${gift.unlimited ? '<span class="badge unlimited">∞ Unlimited</span>' : ''}
        
        <div class="gift-actions">
          <button class="btn-select ${isSelected ? 'on' : ''}" 
                  data-action="select" 
                  data-name="${encodedName}"
                  aria-pressed="${isSelected}">
            ${isSelected ? '✓ Selected' : 'Select'}
          </button>
          
          <div class="owned-control">
            <button class="btn-minus" data-action="minus" data-name="${encodedName}" aria-label="Decrease owned">−</button>
            <input class="owned-input" 
                   data-action="owned" 
                   data-name="${encodedName}" 
                   value="${owned}" 
                   type="number" 
                   min="0" 
                   aria-label="Owned quantity">
            <button class="btn-plus" data-action="plus" data-name="${encodedName}" aria-label="Increase owned">+</button>
          </div>
        </div>
      </article>
    `;
  }).join('');
  
  giftGrid.innerHTML = giftsHTML;
  
  // Event delegation for gift actions
  giftGrid.addEventListener('click', handleGiftAction);
  giftGrid.addEventListener('change', handleGiftChange);
}

function handleGiftAction(event) {
  const button = event.target.closest('[data-action]');
  if (!button) return;
  
  const action = button.dataset.action;
  const giftName = decodeURIComponent(button.dataset.name);
  const key = giftKey(giftName);
  
  switch (action) {
    case 'select':
      state.selected[key] = !(state.selected[key] === true);
      saveState();
      renderGiftList();
      calculateRoute();
      break;
      
    case 'minus':
      changeOwnedCount(giftName, -1);
      break;
      
    case 'plus':
      changeOwnedCount(giftName, 1);
      break;
  }
}

function handleGiftChange(event) {
  const input = event.target.closest('[data-action="owned"]');
  if (!input) return;
  
  const giftName = decodeURIComponent(input.dataset.name);
  const key = giftKey(giftName);
  const value = clamp(Number(input.value) || 0, 0, 999);
  
  state.owned[key] = value;
  saveState();
  calculateRoute();
}

function changeOwnedCount(giftName, delta) {
  const key = giftKey(giftName);
  state.owned[key] = clamp((state.owned[key] || 0) + delta, 0, 999);
  saveState();
  renderGiftList();
  calculateRoute();
}

// Route Planning
function chooseRoute() {
  const progress = getLevelProgress();
  const remaining = progress.remaining;
  const gifts = getCurrentGifts().filter(g => state.selected[giftKey(g.name)] !== false);
  
  if (!gifts.length) {
    return { plan: [], remaining, left: remaining, message: 'No gifts selected' };
  }
  
  let sortedGifts = [...gifts];
  
  // Sort based on goal
  switch (state.goal) {
    case 'fast':
      sortedGifts.sort((a, b) => b.affection - a.affection);
      break;
      
    case 'inventory':
      sortedGifts.sort((a, b) => 
        (state.owned[giftKey(b.name)] || 0) - (state.owned[giftKey(a.name)] || 0)
      );
      break;
      
    case 'easy':
      sortedGifts.sort((a, b) => 
        (a.availability === 'shop' ? 0 : 1) - (b.availability === 'shop' ? 0 : 1)
      );
      break;
      
    case 'cheap':
      sortedGifts.sort((a, b) => {
        const aValue = a.price === null ? Infinity : a.price / a.affection;
        const bValue = b.price === null ? Infinity : b.price / b.affection;
        return aValue - bValue;
      });
      break;
      
    default: // balanced
      sortedGifts.sort((a, b) => {
        const aValue = a.price === null ? Infinity : a.price / a.affection;
        const bValue = b.price === null ? Infinity : b.price / b.affection;
        return aValue - bValue;
      });
  }
  
  let left = remaining;
  let plan = [];
  
  for (const gift of sortedGifts) {
    if (left <= 0) break;
    
    const key = giftKey(gift.name);
    const owned = Math.max(0, state.owned[key] || 0);
    const neededCount = Math.ceil(left / gift.affection);
    const useOwned = Math.min(owned, neededCount);
    let buyCount = 0;
    
    if (useOwned < neededCount && gift.price !== null) {
      buyCount = neededCount - useOwned;
    } else if (useOwned === 0 && gift.price === null && 
               !['free', 'event', 'story'].includes(gift.availability)) {
      continue; // Skip non-purchasable gifts with no owned stock
    }
    
    const totalCount = useOwned + buyCount;
    
    if (totalCount > 0) {
      plan.push({
        gift,
        count: totalCount,
        owned: useOwned,
        buy: buyCount
      });
      left = Math.max(0, left - totalCount * gift.affection);
    }
  }
  
  return { 
    plan, 
    remaining, 
    left,
    message: left > 0 ? 'Insufficient gifts to reach max bond' : 'Route complete'
  };
}

function calculateRoute() {
  const result = chooseRoute();
  const totalAP = result.plan.reduce((sum, item) => sum + item.count * item.gift.affection, 0);
  const totalCost = result.plan.reduce((sum, item) => sum + item.buy * (item.gift.price || 0), 0);
  const totalGifts = result.plan.reduce((sum, item) => sum + item.count, 0);
  const daysNeeded = Math.ceil(totalGifts / GIFTS_PER_DAY);
  
  if ($('plan')) {
    $('plan').innerHTML = result.plan.length ? 
      result.plan.map(item => `
        <div class="plan-row">
          <div class="plan-icon">${getGiftIcon(item.gift)}</div>
          <div class="plan-details">
            <b>${item.gift.name}</b>
            <div class="muted">
              ${item.count} × ${money(item.gift.affection)} AP · 📍 ${item.gift.location}
            </div>
            ${item.owned > 0 ? `<div class="muted">Using ${item.owned} owned</div>` : ''}
          </div>
          <b class="plan-cost">
            ${item.buy > 0 ? money(item.buy * (item.gift.price || 0)) : 'Owned / free'}
          </b>
        </div>
      `).join('') : 
      '<div class="muted">Select gifts to build a route.</div>';
  }
  
  if ($('summary')) {
    const goalNames = {
      cheap: '💰 Cheapest',
      fast: '⚡ Fastest',
      inventory: '🎒 Inventory first',
      easy: '📍 Easiest',
      balanced: '⚖ Balanced'
    };
    
    $('summary').innerHTML = `
      <div class="summary-header">
        <div class="muted">Strategy</div>
        <div class="big">${goalNames[state.goal] || '⚖ Balanced'}</div>
      </div>
      
      <div class="summary-stats">
        <p><span class="green">❤️ ${money(totalAP)} AP planned</span></p>
        <p>💰 <b>${money(totalCost)}</b> Fons cost</p>
        <p>🎁 <b>${totalGifts}</b> gifts needed</p>
        <p>⏱️ <b>${daysNeeded}</b> day${daysNeeded === 1 ? '' : 's'} at ${GIFTS_PER_DAY}/day</p>
      </div>
      
      ${result.left > 0 ? 
        `<p class="warning">⚠️ ${money(result.left)} AP still missing</p>` : 
        '<p class="success">✅ Route complete!</p>'
      }
    `;
  }
  
  // Update daily plan
  if ($('dailyButton')) {
    $('dailyButton').disabled = result.plan.length === 0;
  }
}

function renderDailyPlan() {
  const result = chooseRoute();
  const dailyPanel = $('dailyPanel');
  
  if (!dailyPanel) return;
  
  const allGifts = result.plan.flatMap(item => 
    Array(item.count).fill(item.gift)
  );
  
  const days = [];
  for (let i = 0; i < allGifts.length; i += GIFTS_PER_DAY) {
    days.push(allGifts.slice(i, i + GIFTS_PER_DAY));
  }
  
  $('days').innerHTML = days.length ? 
    days.map((dayGifts, index) => `
      <div class="day-card">
        <h4>Day ${index + 1}</h4>
        ${dayGifts.map(gift => `
          <div class="day-gift">
            <span>${getGiftIcon(gift)}</span>
            <span>${gift.name}</span>
            <span class="muted">${money(gift.affection)} AP</span>
          </div>
        `).join('')}
      </div>
    `).join('') : 
    '<div class="muted">No route planned yet.</div>';
  
  dailyPanel.classList.remove('hidden');
}

// Toast Notifications
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => toast.classList.add('show'), 100);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function updateLastSavedIndicator() {
  const indicator = $('lastSaved');
  if (indicator) {
    const now = new Date();
    indicator.textContent = `Last saved: ${now.toLocaleTimeString()}`;
  }
}

// Event Handlers
function setupEventListeners() {
  // Search
  const searchInput = $('search');
  if (searchInput) {
    searchInput.addEventListener('input', debounce(renderCharacterSelector, 300));
  }
  
  // Bond inputs
  ['lv', 'inside', 'fons'].forEach(id => {
    const input = $(id);
    if (input) {
      input.addEventListener('input', () => {
        state.bond.lv = clamp(Number($('lv')?.value) || 1, 1, MAX_LEVEL);
        state.bond.inside = Math.max(0, Number($('inside')?.value) || 0);
        state.bond.fons = Math.max(0, Number($('fons')?.value) || 0);
        saveState();
        renderProfile();
        calculateRoute();
      });
    }
  });
  
  // Goal buttons
  document.querySelectorAll('.goal').forEach(button => {
    button.addEventListener('click', () => {
      state.goal = button.dataset.goal;
      document.querySelectorAll('.goal').forEach(b => b.classList.remove('active'));
      button.classList.add('active');
      saveState();
      calculateRoute();
    });
  });
  
  // Action buttons
  const actionButtons = {
    'all': () => {
      getCurrentGifts().forEach(gift => {
        state.selected[giftKey(gift.name)] = true;
      });
      saveState();
      renderGiftList();
      calculateRoute();
      showToast('All gifts selected', 'success');
    },
    'none': () => {
      getCurrentGifts().forEach(gift => {
        state.selected[giftKey(gift.name)] = false;
      });
      saveState();
      renderGiftList();
      calculateRoute();
      showToast('All gifts deselected', 'info');
    },
    'reset': () => {
      if (confirm('Reset all Bond data? This cannot be undone.')) {
        localStorage.removeItem(STORAGE_KEY);
        location.reload();
      }
    },
    'export': () => {
      const dataStr = JSON.stringify(state, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nte-bond-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Backup downloaded', 'success');
    },
    'save': () => {
      saveState();
      showToast('Saved successfully', 'success');
    },
    'daily': () => {
      renderDailyPlan();
    }
  };
  
  Object.entries(actionButtons).forEach(([id, handler]) => {
    const button = $(id);
    if (button) {
      button.addEventListener('click', handler);
    }
  });
  
  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 's':
          e.preventDefault();
          saveState();
          showToast('Saved', 'success');
          break;
        case 'e':
          e.preventDefault();
          actionButtons.export();
          break;
      }
    }
  });
}

// Utility: Debounce
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Initialization
function initializeApp() {
  // Set initial input values
  if ($('lv')) $('lv').value = state.bond.lv;
  if ($('inside')) $('inside').value = state.bond.inside;
  if ($('fons')) $('fons').value = state.bond.fons || '';
  
  // Set active goal button
  document.querySelectorAll('.goal').forEach(button => {
    if (button.dataset.goal === state.goal) {
      button.classList.add('active');
    }
  });
  
  // Setup event listeners
  setupEventListeners();
  
  // Initial render
  renderAll();
}

function renderAll() {
  renderCharacterSelector();
  renderProfile();
  renderGiftList();
  calculateRoute();
  updateLastSavedIndicator();
}

// Start the app
document.addEventListener('DOMContentLoaded', initializeApp);