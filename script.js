(function () {
  const MONTHS = { Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6, Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12 };

  function parseDate(s) {
    const [mon, year] = (s || '').split('-');
    const m = MONTHS[mon] || 0;
    const y = parseInt(year, 10) || 0;
    return y * 12 + m;
  }

  function sortExperiencesByDate(experiences) {
    return [...experiences].sort((a, b) => parseDate(b.to) - parseDate(a.to));
  }

  var ODP = { cyan: '#56b6c2', blue: '#61afef', green: '#98c379', red: '#e06c75', yellow: '#e5c07b', orange: '#d19a66', purple: '#c678dd' };

  function getSkillIcon(area) {
    var icons = {
      Backend: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="' + ODP.cyan + '" stroke-width="2"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><path d="M6 6v.01M6 18v.01"/></svg>',
      Versioning: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="' + ODP.orange + '" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M14 8h2a2 2 0 012 2v8a2 2 0 01-2 2h-2"/><path d="M10 16V8a2 2 0 012-2h2"/><path d="M6 16v-4"/></svg>',
      Testing: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="' + ODP.green + '" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14"/></svg>',
      Infrastructure: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="' + ODP.blue + '" stroke-width="2"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 12h.01M10 12h.01M14 12h.01M18 12h.01"/></svg>',
      Blockchain: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="' + ODP.yellow + '" stroke-width="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/><circle cx="12" cy="12" r="4"/><path d="M12 8v8M8 12h8"/></svg>',
      Frontend: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="' + ODP.purple + '" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>',
      Data: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="' + ODP.cyan + '" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>',
      Agile: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="' + ODP.yellow + '" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
      Communication: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="' + ODP.blue + '" stroke-width="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>',
      Languages: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="' + ODP.green + '" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>'
    };
    return icons[area] || icons.Backend;
  }

  function getAge(birthDateStr) {
    if (!birthDateStr) return '';
    var d = new Date(birthDateStr);
    if (isNaN(d.getTime())) return '';
    var today = new Date();
    var age = today.getFullYear() - d.getFullYear();
    var m = today.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--;
    return age + ' years old';
  }

  function getTagIcon(title) {
    if ((title || '').toLowerCase().indexOf('goal') !== -1) return '<svg class="tag-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>';
    return '<svg class="tag-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>';
  }

  function renderPersonal(data) {
    const p = data['personal-info'];
    if (!p) return;

    var name = p['full-name'] || '';
    var position = p['main-position'] || '';
    document.getElementById('personal-name').textContent = name;
    document.getElementById('personal-position').textContent = position;
    document.getElementById('personal-location').textContent = p.location || '';
    document.getElementById('personal-remote').textContent = p.remote || '';
    document.getElementById('personal-age').textContent = getAge(p['date-of-birth'] || '');

    var photo = document.getElementById('personal-photo');
    photo.src = p['image-url'] || '';
    photo.alt = name + ', ' + position;
    photo.onerror = function () { this.style.display = 'none'; };

    var titleText = name + ' — ' + position;
    document.title = titleText;
    var titleEl = document.getElementById('page-title');
    if (titleEl) titleEl.textContent = titleText;

    var baseUrl = typeof window !== 'undefined' && window.location && window.location.origin ? window.location.origin + window.location.pathname.replace(/\/$/, '') || window.location.origin : '';
    if (baseUrl) {
      var canonical = document.getElementById('canonical-url');
      if (canonical) canonical.href = baseUrl;
      var ogUrl = document.getElementById('og-url');
      if (ogUrl) ogUrl.content = baseUrl;
    }
    var desc = 'Senior .NET Software Engineer specializing in microservices and distributed systems. Full-stack developer, remote.';
    var ogDesc = document.getElementById('og-description');
    if (ogDesc) ogDesc.content = desc;
    var twDesc = document.getElementById('twitter-description');
    if (twDesc) twDesc.content = desc;
    var ogTitle = document.getElementById('og-title');
    if (ogTitle) ogTitle.content = titleText;
    var twTitle = document.getElementById('twitter-title');
    if (twTitle) twTitle.content = titleText;
    var imgUrl = p['image-url'] || '';
    if (imgUrl) {
      var ogImg = document.getElementById('og-image');
      if (ogImg) ogImg.content = imgUrl;
      var twImg = document.getElementById('twitter-image');
      if (twImg) twImg.content = imgUrl;
    }

    var mail = p.mail || '';
    document.getElementById('link-email').href = 'mailto:' + mail;
    document.getElementById('email-text').textContent = mail;
    document.getElementById('link-linkedin').href = p['linkedin-url'] || '#';
    document.getElementById('link-github').href = p['github-url'] || '#';

    const tagsContainer = document.getElementById('personal-tags');
    (data.tags || []).forEach(function (tag) {
      const div = document.createElement('div');
      div.className = 'tag-item';
      div.setAttribute('role', 'listitem');
      div.innerHTML = '<span class="tag-item-header">' + getTagIcon(tag.title) + '<strong class="tag-item-title">' + escapeHtml(tag.title) + '</strong></span><span class="tag-item-desc">' + escapeHtml(tag.descripcion) + '</span>';
      tagsContainer.appendChild(div);
    });

    injectJsonLd(data);
  }

  function injectJsonLd(data) {
    var p = data && data['personal-info'];
    if (!p) return;
    var existing = document.getElementById('json-ld-person');
    if (existing) existing.remove();
    var sameAs = [p['linkedin-url'], p['github-url']].filter(Boolean);
    var script = document.createElement('script');
    script.id = 'json-ld-person';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: p['full-name'] || '',
      jobTitle: p['main-position'] || '',
      url: typeof window !== 'undefined' && window.location ? (window.location.origin + (window.location.pathname || '')) : '',
      email: p.mail || undefined,
      image: p['image-url'] || undefined,
      sameAs: sameAs.length ? sameAs : undefined,
      address: p.location ? { '@type': 'Place', name: p.location } : undefined
    });
    document.head.appendChild(script);
  }

  function getCountryCode(companyName) {
    var n = (companyName || '').toLowerCase();
    if (n.indexOf('paramo') !== -1) return 'pa';
    if (n.indexOf('geovictoria') !== -1) return 'cl';
    if (n.indexOf('totvs') !== -1) return 'br';
    return 'ar';
  }

  function renderExperience(experiences) {
    const sorted = sortExperiencesByDate(experiences);
    const track = document.getElementById('carousel-track');
    const dotsContainer = document.getElementById('carousel-dots');
    track.innerHTML = '';
    dotsContainer.innerHTML = '';

    sorted.forEach(function (exp, i) {
      const techList = (exp.techs || '').split(',').map(function (t) { return t.trim(); }).filter(Boolean);
      const country = getCountryCode(exp['company-name']);
      const roleLine = '<span class="exp-role-highlight">' + escapeHtml(exp.position) + '</span> working in the <span class="exp-role-highlight">' + escapeHtml(exp['business-area']) + '</span> business area';
      const slide = document.createElement('div');
      slide.className = 'carousel-slide';
      slide.innerHTML =
        '<div class="exp-card glass-card">' +
          '<div class="exp-header">' +
            '<div class="exp-company-wrap">' +
              '<img class="exp-flag" src="https://flagcdn.com/w40/' + country + '.png" alt="" width="28" height="20" loading="lazy">' +
              '<span class="exp-company">' + escapeHtml(exp['company-name']) + '</span>' +
            '</div>' +
            '<span class="exp-dates">' + escapeHtml(exp.from) + ' — ' + escapeHtml(exp.to) + '</span>' +
          '</div>' +
          '<p class="exp-role-line">' + roleLine + '</p>' +
          '<div class="exp-techs">' + techList.map(function (t) { return '<span class="exp-tech">' + escapeHtml(t) + '</span>'; }).join('') + '</div>' +
          '<ul class="exp-tasks">' + (exp['tasks-descriptions'] || []).map(function (task) { return '<li>' + escapeHtml(task) + '</li>'; }).join('') + '</ul>' +
        '</div>';
      track.appendChild(slide);

      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', 'Experience ' + (i + 1));
      dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      dot.dataset.index = String(i);
      dotsContainer.appendChild(dot);
    });

    let current = 0;
    const total = sorted.length;

    function goTo(index) {
      current = (index + total) % total;
      track.style.transform = 'translateX(-' + current * 100 + '%)';
      dotsContainer.querySelectorAll('.carousel-dot').forEach(function (d, i) {
        d.classList.toggle('active', i === current);
        d.setAttribute('aria-selected', i === current ? 'true' : 'false');
      });
      document.querySelector('.carousel-prev').disabled = total <= 1;
      document.querySelector('.carousel-next').disabled = total <= 1;
    }

    document.querySelector('.carousel-prev').onclick = function () { goTo(current - 1); };
    document.querySelector('.carousel-next').onclick = function () { goTo(current + 1); };
    dotsContainer.querySelectorAll('.carousel-dot').forEach(function (dot) {
      dot.onclick = function () { goTo(parseInt(this.dataset.index, 10)); };
    });

    var viewport = track.parentElement;
    var touchStartX = 0;
    viewport.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches ? e.changedTouches[0].clientX : e.touches[0].clientX;
    }, { passive: true });
    viewport.addEventListener('touchend', function (e) {
      if (!e.changedTouches || !e.changedTouches.length) return;
      var touchEndX = e.changedTouches[0].clientX;
      var dx = touchStartX - touchEndX;
      if (Math.abs(dx) > 50) {
        if (dx > 0) goTo(current + 1);
        else goTo(current - 1);
      }
    }, { passive: true });

    goTo(0);
  }

  function renderSkills(skills) {
    const grid = document.getElementById('skills-grid');
    grid.innerHTML = '';

    var list = (skills || []).slice().sort(function (a, b) { return (a.order || 0) - (b.order || 0); });
    list.forEach(function (skill) {
      const chipsRaw = Array.isArray(skill.chips) ? skill.chips.join(' ') : (skill.chips || '');
      const chips = chipsRaw.split(/\s*\|\s*/).map(function (c) { return c.trim(); }).filter(Boolean);
      const card = document.createElement('div');
      card.className = 'skill-card';
      card.innerHTML =
        '<div class="skill-header" role="button" tabindex="0" aria-expanded="false">' +
          '<div class="skill-title-wrap">' +
            '<span class="skill-icon">' + getSkillIcon(skill.area) + '</span>' +
            '<span class="skill-title">' + escapeHtml(skill.area) + '</span>' +
          '</div>' +
          '<svg class="skill-chevron" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>' +
        '</div>' +
        '<div class="skill-chips">' + chips.map(function (c) { return '<span class="skill-chip">' + escapeHtml(c) + '</span>'; }).join('') + '</div>' +
        '<div class="skill-detail">' +
          '<p class="skill-description">' + escapeHtml(skill.description || '') + '</p>' +
        '</div>';
      grid.appendChild(card);

      const header = card.querySelector('.skill-header');
      header.addEventListener('click', function () {
        card.classList.toggle('expanded');
        header.setAttribute('aria-expanded', card.classList.contains('expanded'));
      });
      header.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          header.click();
        }
      });
    });
  }

  function escapeHtml(s) {
    if (!s) return '';
    const div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  function setupNavbar() {
    const nav = document.getElementById('navbar');
    window.addEventListener('scroll', function () {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    });
  }

  function setupReveal() {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.section-title, .section-subtitle, .personal-card, .carousel, .skills-grid').forEach(function (el) {
      el.classList.add('reveal');
      observer.observe(el);
    });
  }

  function setupMobileMenu() {
    /* Hamburger removed; nav links always visible */
  }

  function renderAtsContent(data) {
    var el = document.getElementById('ats-content');
    if (!el) return;
    var experiences = sortExperiencesByDate(data['work-experiences'] || []);
    var skills = (data.skills || []).slice().sort(function (a, b) { return (a.order || 0) - (b.order || 0); });
    var html = '<h2>Experience</h2>';
    experiences.forEach(function (exp) {
      html += '<article><h3>' + escapeHtml(exp['company-name']) + '</h3>';
      html += '<p><strong>' + escapeHtml(exp.position) + '</strong> — ' + escapeHtml(exp.from) + ' to ' + escapeHtml(exp.to) + '. ' + escapeHtml(exp['business-area']) + '.</p>';
      html += '<ul>';
      (exp['tasks-descriptions'] || []).forEach(function (t) { html += '<li>' + escapeHtml(t) + '</li>'; });
      html += '</ul>';
      html += '<p>Technologies: ' + escapeHtml((exp.techs || '').replace(/,/g, ', ')) + '</p></article>';
    });
    html += '<h2>Skills</h2><ul>';
    skills.forEach(function (s) {
      var chips = (Array.isArray(s.chips) ? s.chips.join(' ') : s.chips || '').split(/\s*\|\s*/).map(function (c) { return c.trim(); }).filter(Boolean);
      html += '<li><strong>' + escapeHtml(s.area) + '</strong>: ' + escapeHtml(chips.join(', ')) + '</li>';
    });
    html += '</ul>';
    el.innerHTML = html;
  }

  function init(data) {
    renderPersonal(data);
    renderExperience(data['work-experiences'] || []);
    renderSkills(data.skills || []);
    renderAtsContent(data);
    setupNavbar();
    setupReveal();
    setupMobileMenu();
  }

  var dataUrl = 'cv-data.json';
  if (typeof window !== 'undefined' && window.location && window.location.protocol !== 'file:') {
    dataUrl += '?v=' + (typeof __CV_BUILD_TIME__ !== 'undefined' ? __CV_BUILD_TIME__ : Date.now());
  }
  fetch(dataUrl, { cache: 'no-store' })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(init)
    .catch(function () {
      if (window.CV_DATA) init(window.CV_DATA);
      else console.warn('Could not load cv-data.json. Serve the folder via HTTP or set window.CV_DATA.');
    });
})();
