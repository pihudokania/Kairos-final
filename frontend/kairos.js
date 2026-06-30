// ═══════════════════════════════════════
// KAIROS — kairos.js
// All code wrapped in DOMContentLoaded
// to prevent crashes before HTML is ready
// ═══════════════════════════════════════

// ─────────────────────────────────────
// API CONFIG
// Set window.KAIROS_API_BASE before this script loads (e.g. in index.html)
// to point at your deployed backend. Falls back to localhost for dev.
// ─────────────────────────────────────
var API_BASE = window.KAIROS_API_BASE || 'http://localhost:5000/api';

async function apiRequest(path, options) {
  options = options || {};
  options.headers = Object.assign({ 'Content-Type': 'application/json' }, options.headers || {});
  var res = await fetch(API_BASE + path, options);
  var data = null;
  try { data = await res.json(); } catch (e) { /* no body */ }
  if (!res.ok) {
    var msg = (data && data.message) || ('Request failed (' + res.status + ')');
    throw new Error(msg);
  }
  return data;
}

document.addEventListener('DOMContentLoaded', function () {

  // ─────────────────────────────────────
  // PARTICLES
  // ─────────────────────────────────────
  var canvas = document.getElementById('particleCanvas');
  var ctx = null;
  var W = 0, H = 0, particles = [];

  if (canvas) {
    ctx = canvas.getContext('2d');

    function resizeCanvas() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    function initParticles() {
      particles = [];
      for (var i = 0; i < 60; i++) {
        particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          r: Math.random() * 1.5 + 0.5,
          a: Math.random() * 0.4 + 0.1,
          c: ['#4F8EF7','#8B5CF6','#C8A96E','#34D399'][Math.floor(Math.random() * 4)]
        });
      }
    }

    function drawParticles() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(function(p) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.c;
        ctx.globalAlpha = p.a;
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      requestAnimationFrame(drawParticles);
    }

    resizeCanvas();
    initParticles();
    drawParticles();
    window.addEventListener('resize', function() { resizeCanvas(); initParticles(); });
  }

  // ─────────────────────────────────────
  // PAGE / TAB SWITCHING
  // ─────────────────────────────────────
  window.launchApp = function() {
    var landing = document.getElementById('landingPage');
    var app = document.getElementById('app');
    if (landing) landing.style.display = 'none';
    if (app) {
      app.style.display = 'flex';
      app.style.minHeight = '100vh';
    }
    loadMissions();
  };

  window.switchTab = function(name, el) {
    document.querySelectorAll('.tab-content').forEach(function(t) {
      t.classList.remove('active');
    });
    document.querySelectorAll('.sb-item').forEach(function(i) {
      i.classList.remove('active');
    });
    var tab = document.getElementById('tab-' + name);
    if (tab) tab.classList.add('active');
    if (el) el.classList.add('active');
  };

  // ─────────────────────────────────────
  // FOCUS MODE
  // ─────────────────────────────────────
  var focusRunning = false;
  var focusSeconds = 25 * 60;
  var focusInterval = null;
  var totalFocusSec = 25 * 60;

  window.openFocus = function() {
    var fm = document.getElementById('focusMode');
    if (fm) fm.classList.add('open');
    if (!focusRunning) startFocusTimer();
  };

  window.closeFocus = function() {
    var fm = document.getElementById('focusMode');
    if (fm) fm.classList.remove('open');
    clearInterval(focusInterval);
    focusRunning = false;
  };

  function startFocusTimer() {
    focusRunning = true;
    focusInterval = setInterval(function() {
      if (focusSeconds <= 0) {
        clearInterval(focusInterval);
        focusRunning = false;
        return;
      }
      focusSeconds--;
      var m = String(Math.floor(focusSeconds / 60)).padStart(2, '0');
      var s = String(focusSeconds % 60).padStart(2, '0');
      var tv = document.getElementById('focusTimerVal');
      if (tv) tv.textContent = m + ':' + s;
      var prog = (totalFocusSec - focusSeconds) / totalFocusSec;
      var offset = 628 - prog * 628;
      var ring = document.getElementById('focusRingFill');
      if (ring) ring.style.strokeDashoffset = offset;
    }, 1000);
  }

  window.toggleFocus = function() {
    var btn = document.getElementById('focusBtn');
    if (focusRunning) {
      clearInterval(focusInterval);
      focusRunning = false;
      if (btn) btn.textContent = '\u25B6 Resume';
    } else {
      startFocusTimer();
      if (btn) btn.textContent = '\u23F8 Pause';
    }
  };

  // ─────────────────────────────────────
  // CRISIS MODE
  // ─────────────────────────────────────
  var crisisSeconds = 14 * 3600 + 22 * 60 + 37;
  var crisisInt = null;

  window.openCrisis = function() {
    var cm = document.getElementById('crisisMode');
    if (cm) cm.classList.add('open');
    crisisInt = setInterval(function() {
      if (crisisSeconds <= 0) return;
      crisisSeconds--;
      var h = String(Math.floor(crisisSeconds / 3600)).padStart(2, '0');
      var m = String(Math.floor((crisisSeconds % 3600) / 60)).padStart(2, '0');
      var s = String(crisisSeconds % 60).padStart(2, '0');
      var el = document.getElementById('crisisCountdown');
      if (el) el.textContent = h + ':' + m + ':' + s;
    }, 1000);
  };

  window.closeCrisis = function() {
    var cm = document.getElementById('crisisMode');
    if (cm) cm.classList.remove('open');
    clearInterval(crisisInt);
  };

  // ─────────────────────────────────────
  // FUTURE SIMULATOR
  // ─────────────────────────────────────
  window.simulateFuture = function() {
    var btn = document.querySelector('.simulate-btn');
    if (!btn) return;
    btn.textContent = 'Agents Thinking...';
    btn.disabled = true;
    var stages = [
      'Planner Thinking...',
      'Scheduler Optimizing...',
      'Risk Agent Predicting...',
      'Simulation Complete'
    ];
    var i = 0;
    var iv = setInterval(function() {
      btn.textContent = stages[i++];
      if (i >= stages.length) {
        clearInterval(iv);
        setTimeout(function() {
          btn.textContent = 'Re-Simulate My Future';
          btn.disabled = false;
        }, 600);
      }
    }, 700);
  };

  // ─────────────────────────────────────
  // ACHIEVEMENTS CONFETTI
  // ─────────────────────────────────────
  window.celebrateAch = function(el) {
    var colors = ['#4F8EF7','#8B5CF6','#C8A96E','#34D399','#F87171','#FBBF24'];
    for (var i = 0; i < 28; i++) {
      var piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.cssText =
        'left:' + (Math.random() * 100) + '%;' +
        'top:' + (Math.random() * 40) + '%;' +
        'background:' + colors[Math.floor(Math.random() * colors.length)] + ';' +
        'transform:rotate(' + (Math.random() * 360) + 'deg);' +
        'animation-delay:' + (Math.random() * 0.5) + 's;' +
        'animation-duration:' + (1.5 + Math.random()) + 's;';
      document.body.appendChild(piece);
      setTimeout(function() { if (piece.parentNode) piece.parentNode.removeChild(piece); }, 3000);
    }
    // Persist the unlock if this card carries a data-key (set in the HTML).
    var key = el && el.dataset ? el.dataset.key : null;
    if (key) {
      apiRequest('/achievements/' + key + '/unlock', { method: 'PATCH' }).catch(function(err) {
        console.warn('Achievement unlock failed:', err.message);
      });
    }
  };

  // ─────────────────────────────────────
  // MISSION HELPERS — render a mission object (from the API) into a card
  // ─────────────────────────────────────
  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str == null ? '' : String(str);
    return div.innerHTML;
  }

  function priorityClass(priority) {
    return ['critical', 'high', 'medium', 'low'].indexOf(priority) >= 0 ? priority : 'medium';
  }

  function statusLabel(status) {
    return {
      planning: 'AI PLANNING...',
      pending: 'SCHEDULED',
      'in-progress': 'IN PROGRESS',
      accomplished: 'ACCOMPLISHED'
    }[status] || 'SCHEDULED';
  }

  function renderMissionCard(mission) {
    var card = document.createElement('div');
    card.className = 'mission-card ' + priorityClass(mission.priority) + ' glass';
    card.dataset.missionId = mission._id;
    var progress = mission.progress || 0;
    card.innerHTML =
      '<div class="mc-row1">' +
        '<div class="mc-name">' + escapeHtml(mission.name) + '</div>' +
        '<div class="mc-status active">' + statusLabel(mission.status) + '</div>' +
      '</div>' +
      '<div class="mc-desc">' + escapeHtml(mission.description || 'AI has broken this mission into subtasks and scheduled it in your optimal focus window.') + '</div>' +
      '<div class="mc-meta">' +
        '<div class="mc-tag">AI-Scheduled</div>' +
        '<div class="mc-tag">Estimated: ' + Math.round((mission.estimatedMinutes || 0) / 60 * 10) / 10 + 'h</div>' +
        '<div class="mc-tag" style="color:' + (mission.missProbability > 60 ? 'var(--red)' : mission.missProbability > 35 ? 'var(--amber)' : 'var(--green)') + ';">' +
          (mission.missProbability || 0) + '% miss probability</div>' +
      '</div>' +
      '<div class="mc-progress-wrap"><div class="mc-prog-label"><span>Mission Progress</span><span>' + progress + '%</span></div>' +
      '<div class="mc-prog-bar"><div class="mc-prog-fill" style="width:' + progress + '%; background:linear-gradient(90deg,#4F8EF7,#22D3EE);"></div></div></div>';
    return card;
  }

  // Loads missions saved in the database and renders them under the
  // demo cards already in the HTML, inside a dedicated wrapper so we
  // never touch/duplicate the static markup.
  window.loadMissions = async function() {
    var container = document.getElementById('tab-missions');
    if (!container) return;
    var wrapper = document.getElementById('dynamicMissions');
    if (!wrapper) {
      wrapper = document.createElement('div');
      wrapper.id = 'dynamicMissions';
      container.appendChild(wrapper);
    }
    wrapper.innerHTML = '<div style="color:var(--text3); font-size:12px; padding:8px 0;">Loading your missions…</div>';
    try {
      var res = await apiRequest('/missions');
      wrapper.innerHTML = '';
      if (!res.data || res.data.length === 0) {
        wrapper.innerHTML = '<div style="color:var(--text3); font-size:12px; padding:8px 0;">No saved missions yet — add one above.</div>';
        return;
      }
      res.data.forEach(function(m) { wrapper.appendChild(renderMissionCard(m)); });
    } catch (err) {
      wrapper.innerHTML = '<div style="color:var(--red); font-size:12px; padding:8px 0;">Couldn\'t load missions: ' + escapeHtml(err.message) + '. Is the backend running?</div>';
    }
  };

  // ─────────────────────────────────────
  // ADD MISSION — now persists to the backend via POST /api/missions
  // ─────────────────────────────────────
  window.addMission = async function() {
    var name = prompt('Enter mission name:');
    if (!name || !name.trim()) return;

    var wrapper = document.getElementById('dynamicMissions') || (function() {
      var w = document.createElement('div');
      w.id = 'dynamicMissions';
      var c = document.getElementById('tab-missions');
      if (c) c.appendChild(w);
      return w;
    })();

    var card = document.createElement('div');
    card.className = 'mission-card medium glass';
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.innerHTML =
      '<div class="mc-row1">' +
        '<div class="mc-name">' + escapeHtml(name) + '</div>' +
        '<div class="mc-status active">AI PLANNING...</div>' +
      '</div>' +
      '<div class="mc-desc" style="color:var(--blue); font-size:12px;">Planner Thinking... Scheduler Optimizing... Risk Agent Predicting...</div>' +
      '<div class="mc-meta"><div class="mc-tag">Analyzing mission scope</div></div>';
    wrapper.appendChild(card);
    requestAnimationFrame(function() {
      card.style.transition = 'all 0.5s cubic-bezier(0.34,1.56,0.64,1)';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    });

    try {
      var res = await apiRequest('/missions', {
        method: 'POST',
        body: JSON.stringify({ name: name.trim(), priority: 'medium' })
      });
      var saved = res.data;
      setTimeout(function() {
        var replacement = renderMissionCard(saved);
        replacement.style.opacity = '0';
        card.replaceWith(replacement);
        requestAnimationFrame(function() {
          replacement.style.transition = 'opacity 0.4s ease';
          replacement.style.opacity = '1';
        });
      }, 1400);
    } catch (err) {
      var statusEl = card.querySelector('.mc-status');
      var descEl = card.querySelector('.mc-desc');
      if (statusEl) { statusEl.textContent = 'ERROR'; statusEl.style.color = 'var(--red)'; }
      if (descEl) descEl.textContent = 'Could not save mission: ' + err.message + '. Check that the backend is running and reachable.';
    }
  };

  // ─────────────────────────────────────
  // AI BRAIN LIVE ROTATION
  // ─────────────────────────────────────
  var newInsights = [
    { type: 'positive', label: 'Energy Pattern', text: 'You have <em>higher accuracy</em> on problem sets after a 10-minute walk. Schedule one at 3 PM.' },
    { type: 'alert',    label: 'Distraction Warning', text: 'You opened Instagram <em>4 times</em> in the last hour. Enabling Focus Guard.' },
    { type: '',         label: 'Optimization', text: 'Splitting the API task into <em>2 smaller blocks</em> increases completion probability to 96%.' }
  ];
  var insightIdx = 0;

  setInterval(function() {
    var container = document.getElementById('brainInsights');
    if (!container) return;
    var d = newInsights[insightIdx % newInsights.length];
    var chip = document.createElement('div');
    chip.className = 'insight-chip ' + d.type;
    chip.style.opacity = '0';
    chip.style.transform = 'translateX(12px)';
    chip.innerHTML = '<div class="insight-label">' + d.label + '</div>' + d.text;
    container.insertBefore(chip, container.firstChild);
    requestAnimationFrame(function() {
      chip.style.transition = 'all 0.4s ease';
      chip.style.opacity = '1';
      chip.style.transform = 'translateX(0)';
    });
    if (container.children.length > 5) {
      container.removeChild(container.lastChild);
    }
    insightIdx++;
  }, 6000);

  // ─────────────────────────────────────
  // MOMENTUM ORB — backed by GET/PATCH /api/stats instead of Math.random()
  // ─────────────────────────────────────
  async function refreshMomentum() {
    var el = document.getElementById('momentumVal');
    if (!el) return;
    try {
      var res = await apiRequest('/stats/momentum', { method: 'PATCH', body: JSON.stringify({}) });
      el.textContent = Math.round(res.data.momentum);
    } catch (err) {
      // Backend unreachable — leave last known value on screen rather than breaking the UI.
      console.warn('Momentum fetch failed:', err.message);
    }
  }
  setInterval(refreshMomentum, 5000);

  // ─────────────────────────────────────
  // FILTER PILLS
  // ─────────────────────────────────────
  document.querySelectorAll('.filter-pill').forEach(function(p) {
    p.addEventListener('click', function() {
      document.querySelectorAll('.filter-pill').forEach(function(fp) {
        fp.classList.remove('active');
      });
      p.classList.add('active');
    });
  });

}); // end DOMContentLoaded
