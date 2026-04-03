// High Sierra Handymen — Interactive Features
// =========================================

// ── 1. Scroll Reveal Animations ─────────────────────────────
(function () {
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal,.reveal-scale').forEach(function (el) {
    io.observe(el);
  });
})();

// ── 2. Service Detail Modal ─────────────────────────────────
var SVC = {
  drywall: {
    c: 'orange',
    p: 'Most jobs $75\u2013$250',
    i: ['Hole patching $75\u2013$150', 'Water damage repair $150\u2013$400', 'Texture matching & paint $100\u2013$225', 'Full wall repair $250\u2013$500']
  },
  plumbing: {
    c: 'orange',
    p: 'Most jobs $85\u2013$300',
    i: ['Faucet replacement $85\u2013$200', 'Toilet repair $75\u2013$175', 'Pipe unclogging $100\u2013$250', 'Water heater service $150\u2013$400']
  },
  electrical: {
    c: 'orange',
    p: 'Most jobs $75\u2013$350',
    i: ['Outlet/switch replacement $75\u2013$150', 'Light fixture install $100\u2013$250', 'Ceiling fan install $125\u2013$275', 'Panel inspection $150\u2013$350']
  },
  doors: {
    c: 'orange',
    p: 'Most jobs $75\u2013$200',
    i: ['Weather stripping $60\u2013$120', 'Lock replacement $75\u2013$175', 'Handle/hinge repair $65\u2013$130', 'Screen repair $50\u2013$120']
  },
  flooring: {
    c: 'orange',
    p: 'Most jobs $100\u2013$300',
    i: ['Squeaky floor fix $100\u2013$200', 'Tile repair $125\u2013$300', 'Carpet patching $75\u2013$175', 'Hardwood dent repair $80\u2013$160']
  },
  painting: {
    c: 'orange',
    p: 'Most jobs $100\u2013$400',
    i: ['Touch-up painting $100\u2013$200', 'Feature wall $150\u2013$300', 'Trim repaint $175\u2013$350', 'Cabinet refinishing $300\u2013$700']
  },
  'network-install': {
    c: 'cyan',
    p: 'Most jobs $150\u2013$500',
    i: ['Router setup & config $75\u2013$150', 'Ethernet run per drop $100\u2013$175', 'Access point install $100\u2013$200', 'Full home network $350\u2013$900']
  },
  'wifi-optimize': {
    c: 'cyan',
    p: 'Most jobs $100\u2013$250',
    i: ['WiFi audit & optimization $100\u2013$175', 'Mesh system setup $150\u2013$400', 'Dead zone solution $125\u2013$300 per zone', 'ISP coordination & routing $75\u2013$150']
  },
  'smart-home': {
    c: 'cyan',
    p: 'Most jobs $100\u2013$350',
    i: ['Smart device setup $75\u2013$150', 'Automation scripting $100\u2013$250', 'Whole-home integration $250\u2013$600', 'Voice assistant config $50\u2013$125']
  },
  security: {
    c: 'cyan',
    p: 'Most jobs $150\u2013$600',
    i: ['Camera install $100\u2013$200 per camera', 'DVR/NVR setup $150\u2013$350', 'Mobile viewing config $75\u2013$125', 'Vacation rental systems $300\u2013$800']
  },
  'server-backup': {
    c: 'cyan',
    p: 'Most jobs $150\u2013$500',
    i: ['NAS setup & config $150\u2013$400', 'Cloud backup setup $100\u2013$250', 'Home server install $200\u2013$600', 'Data migration $75\u2013$200']
  },
  'av-entertainment': {
    c: 'cyan',
    p: 'Most jobs $100\u2013$400',
    i: ['TV mount & setup $75\u2013$175', 'Surround sound install $150\u2013$350', 'Whole-house audio $250\u2013$800', 'Cable management $50\u2013$150']
  }
};

var TITLE_MAP = {
  drywall: 'Drywall & Patching', plumbing: 'Plumbing Repairs', electrical: 'Electrical',
  doors: 'Doors & Windows', flooring: 'Flooring Repairs', painting: 'Painting',
  'network-install': 'Network Installation', 'wifi-optimize': 'WiFi Optimization',
  'smart-home': 'Smart Home Setup', security: 'Security Systems',
  'server-backup': 'Server & Backup', 'av-entertainment': 'AV & Entertainment'
};

var SVC_ICON = {
  orange: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
  cyan: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>'
};

function openSvcModal(key) {
  var d = SVC[key];
  if (!d) return;
  var bg = d.c === 'orange'
    ? 'linear-gradient(135deg,var(--accent-orange),#FF8F65)'
    : 'linear-gradient(135deg,var(--accent-cyan),#00A8CC)';
  var check = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px;height:18px;flex-shrink:0;margin-top:2px"><polyline points="20 6 9 17 4 12"/></svg>';
  document.getElementById('modalContent').innerHTML =
    '<button class="service-modal-close" onclick="closeSvcModal()">&#215;</button>' +
    '<div class="service-modal-icon" style="background:' + bg + '">' + SVC_ICON[d.c] + '</div>' +
    '<h3 style="color:var(--accent-' + d.c + ')">' + (TITLE_MAP[key] || key) + '</h3>' +
    '<span class="price-hint">' + d.p + '</span>' +
    '<ul>' + d.i.map(function (x) { return '<li class="' + d.c + '">' + check + x + '</li>'; }).join('') + '</ul>' +
    '<a href="#contact" class="btn btn-primary" onclick="closeSvcModal()">' +
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>Request a Quote</a>';
  document.getElementById('serviceModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeSvcModal() {
  document.getElementById('serviceModal').classList.remove('open');
  document.body.style.overflow = '';
}

// Attach to all service list items with data-skey
document.querySelectorAll('.service-list-item[data-skey]').forEach(function (it) {
  it.addEventListener('click', function () {
    openSvcModal(it.getAttribute('data-skey'));
  });
});

// Also attach to the service card headers
document.querySelectorAll('.service-card').forEach(function (card) {
  card.addEventListener('click', function (e) {
    if (e.target.closest('.service-list-item')) return;
    var key = card.classList.contains('orange') ? 'handyman' : 'network';
    // open a general modal for the category
  });
});

// ── 3. Before / After Slider ────────────────────────────────
(function () {
  var slider = document.getElementById('baSlider1');
  if (!slider) return;
  var after = document.getElementById('baAfter1');
  var divider = document.getElementById('baDivider1');
  var handle = document.getElementById('baHandle1');

  function setPos(pct) {
    if (pct < 2) pct = 2;
    if (pct > 98) pct = 98;
    after.style.clipPath = 'inset(0 ' + (100 - pct) + '% 0 0)';
    divider.style.left = pct + '%';
    handle.style.left = pct + '%';
  }

  function getPct(e) {
    var rect = slider.getBoundingClientRect();
    var x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    return (x / rect.width) * 100;
  }

  var dragging = false;

  slider.addEventListener('mousedown', function (e) {
    dragging = true;
    setPos(getPct(e));
  });
  window.addEventListener('mousemove', function (e) {
    if (dragging) setPos(getPct(e));
  });
  window.addEventListener('mouseup', function () { dragging = false; });

  slider.addEventListener('touchstart', function (e) {
    dragging = true;
    setPos(getPct(e));
  }, { passive: true });
  window.addEventListener('touchmove', function (e) {
    if (dragging) setPos(getPct(e));
  }, { passive: true });
  window.addEventListener('touchend', function () { dragging = false; });

  slider.addEventListener('click', function (e) {
    if (e.target === slider || e.target === after || e.target === divider || e.target === handle) {
      setPos(getPct(e));
    }
  });

  setPos(50);
})();

// ── 4. Project Estimator ───────────────────────────────────
var estS = '', estSz = '';

function selectEst(el, val) {
  var step = el.closest('.estimator-step');
  step.querySelectorAll('.estimator-option').forEach(function (o) { o.classList.remove('selected'); });
  el.classList.add('selected');
  if (step.id === 'step1') {
    estS = val;
    var btn = document.getElementById('btn1Next');
    if (btn) btn.disabled = false;
  }
  if (step.id === 'step2') {
    estSz = val;
    var btn2 = document.getElementById('btn2Next');
    if (btn2) btn2.disabled = false;
  }
}

function goEstNext(n) {
  var steps = ['step1', 'step2', 'step3'];
  if (n === 1 && !estS) return;
  if (n === 2 && !estSz) return;
  document.getElementById(steps[n - 1]).classList.remove('active');
  document.getElementById(steps[n]).classList.add('active');
  for (var i = 0; i < n; i++) {
    document.getElementById('prog' + (i + 1)).classList.add('done');
  }
  document.getElementById('prog' + (n + 1)).classList.add('active');
}

function goEstPrev(n) {
  var steps = ['step1', 'step2', 'step3'];
  document.getElementById(steps[n - 1]).classList.remove('active');
  document.getElementById(steps[n - 2]).classList.add('active');
  for (var i = n - 1; i < 3; i++) {
    document.getElementById('prog' + (i + 1)).classList.remove('done', 'active');
  }
  document.getElementById('prog' + (n - 1)).classList.add('active');
}

var PRICE = {
  'handyman-small': '$75\u2013$150', 'handyman-medium': '$150\u2013$350',
  'handyman-large': '$350\u2013$800', 'handyman-unsure': '$75\u2013$500',
  'plumbing-small': '$85\u2013$175', 'plumbing-medium': '$175\u2013$400',
  'plumbing-large': '$400\u2013$900', 'plumbing-unsure': '$85\u2013$500',
  'electrical-small': '$75\u2013$150', 'electrical-medium': '$150\u2013$350',
  'electrical-large': '$350\u2013$800', 'electrical-unsure': '$75\u2013$500',
  'network-small': '$100\u2013$200', 'network-medium': '$200\u2013$500',
  'network-large': '$500\u2013$1200', 'network-unsure': '$100\u2013$600',
  'smart-small': '$75\u2013$175', 'smart-medium': '$175\u2013$400',
  'smart-large': '$400\u2013$900', 'smart-unsure': '$75\u2013$500',
  'security-small': '$150\u2013$350', 'security-medium': '$350\u2013$700',
  'security-large': '$700\u2013$1500', 'security-unsure': '$150\u2013$800',
};

var SVC_LABEL = {
  handyman: 'Handyman Repairs', plumbing: 'Plumbing Fixes',
  electrical: 'Electrical Work', network: 'Network & WiFi',
  smart: 'Smart Home Setup', security: 'Security Cameras'
};
var SZ_LABEL = {
  small: 'Quick Fix (\u22641 hr)', medium: 'Medium Job (1\u20133 hrs)',
  large: 'Large Project (half day+)', unsure: 'Custom / Need Advice'
};

function showPriceResult() {
  var key = estS + '-' + estSz;
  var range = PRICE[key] || '$75\u2013$400';
  var svc = SVC_LABEL[estS] || estS;
  var sz = SZ_LABEL[estSz] || estSz;
  var note = document.getElementById('estDetails') && document.getElementById('estDetails').value.trim();

  document.getElementById('step3').classList.remove('active');
  document.getElementById('stepResult').classList.add('active');
  for (var i = 0; i < 3; i++) document.getElementById('prog' + (i + 1)).classList.add('done');

  var detailNote = note ? '<p style="color:var(--text-secondary);font-size:13px;margin-top:12px;font-style:italic">Based on: ' + note.substring(0, 80) + (note.length > 80 ? '...' : '') + '</p>' : '';

  document.getElementById('estResultContent').innerHTML =
    '<div style="text-align:center">' +
    '<p style="color:var(--text-secondary);font-size:14px;text-transform:uppercase;letter-spacing:2px;margin-bottom:4px">Estimated Range</p>' +
    '<div class="price-range">' + range + '</div>' +
    '<p class="price-note">' + svc + ' \u00b7 ' + sz + '</p>' +
    detailNote +
    '<p style="color:var(--text-secondary);font-size:12px;margin-bottom:24px">* Final price confirmed after on-site assessment. This is a guide only.</p>' +
    '<a href="#contact" class="btn btn-primary" onclick="resetEstimator()">' +
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>Request a Quote</a>' +
    '<span class="estimator-restart" onclick="resetEstimator()">Start over</span>' +
    '</div>';
}

function resetEstimator() {
  estS = '';
  estSz = '';
  document.getElementById('stepResult').classList.remove('active');
  document.getElementById('step1').classList.add('active');
  document.querySelectorAll('.estimator-step').forEach(function (s) { s.classList.remove('active'); });
  document.getElementById('step1').classList.add('active');
  document.querySelectorAll('.estimator-option').forEach(function (o) { o.classList.remove('selected'); });
  document.querySelectorAll('.estimator-progress-step').forEach(function (p) { p.classList.remove('done', 'active'); });
  document.getElementById('prog1').classList.add('active');
  if (document.getElementById('btn1Next')) document.getElementById('btn1Next').disabled = true;
  if (document.getElementById('btn2Next')) document.getElementById('btn2Next').disabled = true;
  var ta = document.getElementById('estDetails');
  if (ta) ta.value = '';
}

// ── 5. Add data-skey attributes to service list items ────────
document.addEventListener('DOMContentLoaded', function () {
  var map = {
    'Drywall & Patching': 'drywall',
    'Plumbing Repairs': 'plumbing',
    'Electrical': 'electrical',
    'Doors & Windows': 'doors',
    'Flooring Repairs': 'flooring',
    'Painting': 'painting',
    'Network Installation': 'network-install',
    'WiFi Optimization': 'wifi-optimize',
    'Smart Home Setup': 'smart-home',
    'Security Systems': 'security',
    'Server & Backup': 'server-backup',
    'AV & Entertainment': 'av-entertainment'
  };
  document.querySelectorAll('.service-list-item h4').forEach(function (h) {
    var key = map[h.textContent.trim()];
    if (key) {
      h.closest('.service-list-item').setAttribute('data-skey', key);
      h.closest('.service-list-item').style.cursor = 'pointer';
    }
  });
});
