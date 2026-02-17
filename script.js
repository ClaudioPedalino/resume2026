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
    var t = (title || '').toLowerCase();
    if (t.indexOf('goal') !== -1) return '<span class="tag-icon tag-icon-img icon-goal" aria-hidden="true"></span>';
    if (t.indexOf('looking') !== -1) return '<span class="tag-icon tag-icon-img icon-search" aria-hidden="true"></span>';
    return '<span class="tag-icon tag-icon-img icon-location" aria-hidden="true"></span>';
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
    photo.removeAttribute('data-failed');
    photo.removeAttribute('data-fallback-tried');
    photo.alt = name + ', ' + position;
    photo.onerror = function () {
      if (this.dataset.fallback && !this.dataset.fallbackTried) {
        this.dataset.fallbackTried = '1';
        this.src = this.dataset.fallback;
      } else {
        this.setAttribute('data-failed', 'true');
      }
    };
    if (p['image-url']) {
      photo.src = p['image-url'];
    } else {
      photo.removeAttribute('src');
      photo.setAttribute('data-failed', 'true');
    }

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

    var list = (skills || []).slice()
      .filter(function (s) { return (s.area || '') !== 'Languages'; })
      .sort(function (a, b) { return (a.order || 0) - (b.order || 0); });
    list.forEach(function (skill) {
      const chipsRaw = Array.isArray(skill.chips) ? skill.chips.join(' ') : (skill.chips || '');
      const chips = chipsRaw.split(/\s*\|\s*/).map(function (c) { return c.trim(); }).filter(Boolean);
      const card = document.createElement('div');
      card.className = 'skill-card';
      card.dataset.area = skill.area || '';
      card.innerHTML =
        '<div class="skill-toggle" role="button" tabindex="0" aria-expanded="false">' +
          '<div class="skill-header">' +
            '<div class="skill-title-wrap">' +
              '<span class="skill-icon"><span class="skill-icon-img" aria-hidden="true"></span></span>' +
              '<span class="skill-title">' + escapeHtml(skill.area) + '</span>' +
            '</div>' +
            '<span class="skill-chevron" aria-hidden="true"></span>' +
          '</div>' +
          '<div class="skill-chips">' + chips.map(function (c) { return '<span class="skill-chip">' + escapeHtml(c) + '</span>'; }).join('') + '</div>' +
        '</div>' +
        '<div class="skill-detail">' +
          '<p class="skill-description">' + escapeHtml(skill.description || '') + '</p>' +
        '</div>';
      grid.appendChild(card);

      const toggle = card.querySelector('.skill-toggle');
      toggle.addEventListener('click', function () {
        var expanded = card.classList.toggle('expanded');
        toggle.setAttribute('aria-expanded', expanded);
      });
      toggle.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle.click();
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

    document.querySelectorAll('.section-title, .personal-card, .carousel, .skills-grid').forEach(function (el) {
      el.classList.add('reveal');
      observer.observe(el);
    });
  }

  function renderAtsContent(data) {
    var el = document.getElementById('ats-content');
    if (!el) return;
    var experiences = sortExperiencesByDate(data['work-experiences'] || []);
    var skills = (data.skills || []).slice().filter(function (s) { return (s.area || '') !== 'Languages'; }).sort(function (a, b) { return (a.order || 0) - (b.order || 0); });
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
