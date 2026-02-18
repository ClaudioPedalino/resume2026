(function () {
  var cvLoadedData = null;

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

  var skillBiIcons = {
    Backend: 'bi-cpu',
    Versioning: 'bi-git',
    'Infrastructure & Versioning': 'bi-git',
    Testing: 'bi-bug',
    Infrastructure: 'bi-hdd-rack',
    Blockchain: 'bi-currency-bitcoin',
    Frontend: 'bi-window',
    Data: 'bi-database',
    Agile: 'bi-kanban',
    Communication: 'bi-chat-dots',
    'AI & Developer Productivity': 'bi-robot',
  };
  function getSkillIconClass(area) {
    return skillBiIcons[area] || 'bi-cpu';
  }

  function getTheme() {
    return (document.documentElement && document.documentElement.dataset && document.documentElement.dataset.theme) || 'dark';
  }

  function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem('theme', theme); } catch (_) { }
  }

  function updateThemeToggleUi() {
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;
    var theme = getTheme();
    btn.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
    btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    if (theme === 'light') {
      btn.classList.add('is-light');
    } else {
      btn.classList.remove('is-light');
    }
  }

  function setupThemeToggle() {
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;

    updateThemeToggleUi();

    btn.addEventListener('click', function () {
      var next = getTheme() === 'dark' ? 'light' : 'dark';
      setTheme(next);
      updateThemeToggleUi();
    });
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
    if (t.indexOf('goal') !== -1) return '<i class="bi bi-bullseye tag-icon" aria-hidden="true"></i>';
    if (t.indexOf('looking') !== -1) return '<i class="bi bi-search tag-icon" aria-hidden="true"></i>';
    return '<i class="bi bi-geo-alt tag-icon" aria-hidden="true"></i>';
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
    var desc = 'Senior .NET Software Engineer specializing in microservices, distributed systems, and cloud. 8+ years full-stack experience. Remote. C#, .NET, Docker, Kubernetes, Azure.';
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
      div.innerHTML = '<span class="tag-item-header">' + getTagIcon(tag.title) + '<strong class="tag-item-title">' + escapeHtml(tag.title) + '</strong></span><span class="tag-item-desc">' + escapeHtml(tag.description) + '</span>';
      tagsContainer.appendChild(div);
    });

    injectJsonLd(data);
  }

  function renderPdfHtml(data) {
    var p = data && data['personal-info'] ? data['personal-info'] : {};
    var name = p['full-name'] || 'Resume';
    var position = p['main-position'] || '';
    var mail = p.mail || '';
    var location = p.location || '';
    var remote = p.remote || '';

    var experiences = sortExperiencesByDate(data['work-experiences'] || []).slice(0, 6);
    var skills = (data.skills || []).slice().filter(function (s) { return (s.area || '') !== 'Languages'; }).sort(function (a, b) { return (a.order || 0) - (b.order || 0); });

    var html = '<div class="pdf-page">';
    html += '<header class="pdf-header">';
    html += '<h1>' + escapeHtml(name) + '</h1>';
    if (position) html += '<p class="subtitle">' + escapeHtml(position) + '</p>';
    html += '<p class="meta">' + [mail, location, remote].filter(Boolean).map(escapeHtml).join(' · ') + '</p>';
    html += '</header>';

    html += '<section class="pdf-section"><h2>Experience</h2><div class="exp-list">';
    experiences.forEach(function (exp) {
      var tasks = (exp['tasks-descriptions'] || []).slice(0, 2);
      html += '<div class="exp">';
      html += '<div class="exp-head"><span class="exp-company">' + escapeHtml(exp['company-name'] || '') + '</span><span class="exp-dates">' + escapeHtml(exp.from || '') + ' — ' + escapeHtml(exp.to || '') + '</span></div>';
      html += '<p class="exp-role">' + escapeHtml(exp.position || '') + (exp['business-area'] ? ' · ' + escapeHtml(exp['business-area']) : '') + '</p>';
      if (tasks.length) html += '<ul>' + tasks.map(function (t) { return '<li>' + escapeHtml(t) + '</li>'; }).join('') + '</ul>';
      if (exp.techs) html += '<p class="tech">' + escapeHtml(String(exp.techs).replace(/,/g, ', ')) + '</p>';
      html += '</div>';
    });
    html += '</div></section>';

    html += '<section class="pdf-section"><h2>Skills</h2><div class="skills-grid">';
    skills.forEach(function (s) {
      var chips = (Array.isArray(s.chips) ? s.chips.join(' ') : s.chips || '').split(/\s*\|\s*/).map(function (c) { return c.trim(); }).filter(Boolean);
      html += '<div class="skill-row"><strong>' + escapeHtml(s.area || '') + '</strong> ' + escapeHtml(chips.join(', ')) + '</div>';
    });
    html += '</div></section></div>';

    return html;
  }

  function getPdfPrintStyles(theme) {
    var isLight = theme === 'light';
    var bg = isLight ? '#faf8f5' : '#282c34';
    var text = isLight ? '#1c1917' : '#abb2bf';
    var textMuted = isLight ? '#713f12' : '#8b92a0';
    var border = isLight ? '#e5e7eb' : '#3e4451';
    var accent = isLight ? '#2563eb' : '#56b6c2';
    return '@page{size:A4;margin:20mm;}'
      + 'html,body{margin:0;padding:0;font-family:system-ui,-apple-system,sans-serif;color:' + text + ';background:' + bg + ';font-size:9px;line-height:1.35;}'
      + '.pdf-page{max-width:100%;padding:4px 0;}'
      + '.pdf-header{border-bottom:2px solid ' + accent + ';padding-bottom:8px;margin-bottom:12px;}'
      + '.pdf-header h1{font-size:18px;margin:0 0 4px;font-weight:700;color:' + text + ';letter-spacing:-0.02em;}'
      + '.pdf-header .subtitle{margin:0;font-size:11px;font-weight:600;color:' + text + ';}'
      + '.pdf-header .meta{margin:4px 0 0;font-size:9px;color:' + textMuted + ';}'
      + '.pdf-section{margin-bottom:14px;}'
      + '.pdf-section h2{font-size:11px;margin:0 0 8px;padding:5px 0 5px 8px;border-left:3px solid ' + accent + ';background:' + (isLight ? 'rgba(37,99,235,0.06)' : 'rgba(86,182,194,0.1)') + ';color:' + text + ';font-weight:700;}'
      + '.exp-list{display:block;}'
      + '.exp{margin-bottom:8px;padding:4px 0 4px 8px;border-left:2px solid ' + border + ';page-break-inside:avoid;}'
      + '.exp:last-child{margin-bottom:0;}'
      + '.exp-head{display:flex;justify-content:space-between;align-items:baseline;gap:8px;margin-bottom:2px;}'
      + '.exp-company{font-weight:700;font-size:10px;color:' + text + ';}'
      + '.exp-dates{font-size:8px;color:' + textMuted + ';white-space:nowrap;}'
      + '.exp-role{margin:0 0 3px;font-size:9px;color:' + textMuted + ';}'
      + '.exp ul{margin:0 0 3px 10px;padding:0;}'
      + '.exp li{margin:0 0 1px;font-size:8px;}'
      + '.exp .tech{margin:0;font-size:8px;color:' + textMuted + ';}'
      + '.skills-grid{display:grid;grid-template-columns:1fr 1fr;gap:4px 20px;}'
      + '.skill-row{font-size:9px;margin:0 0 3px;padding:0;}'
      + '.skill-row strong{font-size:9px;font-weight:700;}'
      + '@media print{html,body{height:auto;background:' + bg + ';-webkit-print-color-adjust:exact;print-color-adjust:exact;} .pdf-section h2{break-after:avoid;} .exp{break-inside:avoid;}}';
  }

  function downloadPdf(data) {
    var JsPDF = typeof window !== 'undefined' && window.jspdf && window.jspdf.jsPDF;
    if (!JsPDF) {
      if (window.open) openPdfPrintWindow(data);
      return;
    }
    var theme = getTheme();
    var isLight = theme === 'light';
    var text = isLight ? [28, 25, 23] : [171, 178, 191];
    var muted = isLight ? [113, 63, 18] : [139, 146, 160];
    var accent = isLight ? [37, 99, 235] : [86, 182, 194];
    var p = data && data['personal-info'] ? data['personal-info'] : {};
    var fileName = (p['full-name'] || 'resume').replace(/\s+/g, '_') + '.pdf';
    var experiences = sortExperiencesByDate(data['work-experiences'] || []).slice(0, 6);
    var skills = (data.skills || []).slice().filter(function (s) { return (s.area || '') !== 'Languages'; }).sort(function (a, b) { return (a.order || 0) - (b.order || 0); });

    var doc = new JsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
    var pageW = doc.internal.pageSize.getWidth();
    var pageH = doc.internal.pageSize.getHeight();
    var margin = 56;
    var x = margin;
    var y = margin;
    var w = pageW - 2 * margin;
    var bottomLimit = pageH - margin - 40;

    function lineHeight(fontSize) { return fontSize * 1.35; }
    function checkNewPage(needHeight) {
      if (y + (needHeight || 0) > bottomLimit) {
        doc.addPage();
        y = margin;
      }
    }

    doc.setFillColor(accent[0], accent[1], accent[2]);
    doc.setTextColor(text[0], text[1], text[2]);
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text(p['full-name'] || 'Resume', x, y);
    y += lineHeight(18);
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    if (p['main-position']) { doc.text(p['main-position'], x, y); y += lineHeight(11); }
    doc.setFont(undefined, 'normal');
    doc.setFontSize(9);
    doc.setTextColor(muted[0], muted[1], muted[2]);
    var meta = [p.mail, p.location, p.remote].filter(Boolean).join(' · ');
    if (meta) { doc.text(meta, x, y); y += lineHeight(9); }
    y += 4;
    doc.setDrawColor(accent[0], accent[1], accent[2]);
    doc.setLineWidth(2);
    doc.line(x, y, x + w, y);
    y += 14;

    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(text[0], text[1], text[2]);
    doc.setFillColor(accent[0], accent[1], accent[2]);
    doc.rect(x, y - 10, 3, 14, 'F');
    doc.text('Experience', x + 10, y);
    y += 12;

    var contentW = w - 75;
    experiences.forEach(function (exp) {
      checkNewPage(70);
      var blockTop = y;
      doc.setFontSize(10);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(text[0], text[1], text[2]);
      var companyLines = doc.splitTextToSize(exp['company-name'] || '', contentW - 8);
      doc.text(companyLines, x + 8, y + 6);
      doc.setFont(undefined, 'normal');
      doc.setFontSize(8);
      doc.setTextColor(muted[0], muted[1], muted[2]);
      var dates = (exp.from || '') + ' — ' + (exp.to || '');
      doc.text(dates, pageW - margin - doc.getTextWidth(dates), y + 6);
      y = blockTop + 6 + companyLines.length * lineHeight(10) + 4;
      doc.setFontSize(9);
      var roleLine = exp.position || '';
      if (exp['business-area']) roleLine += ' · ' + exp['business-area'];
      var roleLines = doc.splitTextToSize(roleLine, contentW - 8);
      doc.text(roleLines, x + 8, y + 4);
      y += roleLines.length * lineHeight(9) + 6;
      var tasks = (exp['tasks-descriptions'] || []).slice(0, 2);
      if (tasks.length) {
        doc.setFontSize(8);
        tasks.forEach(function (t) {
          var lines = doc.splitTextToSize('• ' + t, contentW - 12);
          doc.text(lines, x + 12, y + 4);
          y += lines.length * lineHeight(8) + 3;
        });
      }
      if (exp.techs) {
        doc.setFontSize(8);
        var techStr = String(exp.techs).replace(/,/g, ', ');
        var techLines = doc.splitTextToSize(techStr, contentW - 8);
        doc.text(techLines, x + 8, y + 4);
        y += techLines.length * lineHeight(8) + 6;
      } else {
        y += 4;
      }
      doc.setDrawColor(muted[0], muted[1], muted[2]);
      doc.setLineWidth(0.5);
      doc.line(x, blockTop, x, y);
      y += 8;
    });

    y += 6;
    checkNewPage(120);
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(text[0], text[1], text[2]);
    doc.rect(x, y - 10, 3, 14, 'F');
    doc.text('Skills', x + 10, y);
    y += 18;

    doc.setFont(undefined, 'normal');
    doc.setFontSize(9);
    var colW = (w - 24) / 2;
    var half = Math.ceil(skills.length / 2);
    var yCol0 = y;
    var yCol1 = y;
    var areaLineH = lineHeight(9);
    var chipLineH = lineHeight(8);
    for (var i = 0; i < skills.length; i++) {
      var isCol0 = i < half;
      var sx = x + (isCol0 ? 0 : colW + 24);
      var sy = isCol0 ? yCol0 : yCol1;
      var s = skills[i];
      var chips = (Array.isArray(s.chips) ? s.chips.join(' ') : s.chips || '').split(/\s*\|\s*/).map(function (c) { return c.trim(); }).filter(Boolean);
      var chipStr = chips.join(', ');
      var chipLines = doc.splitTextToSize(chipStr, colW - 36);
      var blockH = areaLineH + 4 + chipLines.length * chipLineH + 6;
      var colY = isCol0 ? yCol0 : yCol1;
      if (colY + blockH > bottomLimit) {
        doc.addPage();
        y = margin;
        doc.setFontSize(11);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(text[0], text[1], text[2]);
        doc.rect(x, y - 10, 3, 14, 'F');
        doc.text('Skills (continued)', x + 10, y);
        y += 18;
        yCol0 = y;
        yCol1 = y;
        sy = y;
      }
      doc.setFont(undefined, 'bold');
      doc.setTextColor(text[0], text[1], text[2]);
      doc.text(s.area || '', sx, sy + 4);
      doc.setFont(undefined, 'normal');
      doc.setFontSize(8);
      doc.setTextColor(muted[0], muted[1], muted[2]);
      doc.text(chipLines, sx, sy + 4 + areaLineH + 4);
      doc.setFontSize(9);
      doc.setTextColor(text[0], text[1], text[2]);
      if (isCol0) yCol0 += blockH; else yCol1 += blockH;
    }

    doc.save(fileName);
  }

  function openPdfPrintWindow(data) {
    var theme = getTheme();
    var p = data && data['personal-info'] ? data['personal-info'] : {};
    var fileName = (p['full-name'] || 'resume').replace(/\s+/g, '_');
    var html = '<!doctype html><html><head><meta charset="utf-8"><title>' + escapeHtml(fileName) + '</title><style>'
      + getPdfPrintStyles(theme)
      + '</style></head><body>'
      + renderPdfHtml(data)
      + '</body></html>';
    var iframe = document.createElement('iframe');
    iframe.setAttribute('style', 'position:fixed;width:0;height:0;border:0;');
    document.body.appendChild(iframe);
    var doc = iframe.contentWindow.document;
    doc.open();
    doc.write(html);
    doc.close();
    iframe.contentWindow.onload = function () {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      setTimeout(function () { document.body.removeChild(iframe); }, 500);
    };
  }

  function setupPdfDownload() {
    var btn = document.getElementById('link-pdf');
    if (!btn) return;
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var data = cvLoadedData;
      if (!data) {
        console.warn('CV data not loaded yet.');
        return;
      }
      downloadPdf(data);
    });
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
      current = Math.max(0, Math.min(index, total - 1));
      track.style.transform = 'translateX(-' + current * 100 + '%)';
      dotsContainer.querySelectorAll('.carousel-dot').forEach(function (d, i) {
        d.classList.toggle('active', i === current);
        d.setAttribute('aria-selected', i === current ? 'true' : 'false');
      });
      document.querySelector('.carousel-prev').disabled = total <= 1 || current === 0;
      document.querySelector('.carousel-next').disabled = total <= 1 || current === total - 1;
    }

    document.querySelector('.carousel-prev').onclick = function () { if (current > 0) goTo(current - 1); };
    document.querySelector('.carousel-next').onclick = function () { if (current < total - 1) goTo(current + 1); };
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
        if (dx > 0 && current < total - 1) goTo(current + 1);
        else if (dx < 0 && current > 0) goTo(current - 1);
      }
    }, { passive: true });

    goTo(0);
  }

  function renderSkills(skills) {
    const grid = document.getElementById('skills-grid');
    grid.innerHTML = '';

    function renderSkillDescription(description) {
      if (!description) return '';
      var lines = Array.isArray(description) ? description : [description];
      lines = lines.map(function (x) { return String(x || '').trim(); }).filter(Boolean);
      if (!lines.length) return '';
      return lines.map(function (line) {
        return '<p class="skill-description-line">' + escapeHtml(line) + '</p>';
      }).join('');
    }

    var list = (skills || []).slice()
      .filter(function (s) { return (s.area || '') !== 'Languages'; })
      .sort(function (a, b) { return (a.order || 0) - (b.order || 0); });
    list.forEach(function (skill) {
      const chipsRaw = Array.isArray(skill.chips) ? skill.chips.join(' ') : (skill.chips || '');
      const chips = chipsRaw.split(/\s*\|\s*/).map(function (c) { return c.trim(); }).filter(Boolean);
      const card = document.createElement('div');
      card.className = 'skill-card';
      card.dataset.area = skill.area || '';
      var iconClass = getSkillIconClass(skill.area);
      card.innerHTML =
        '<div class="skill-toggle" role="button" tabindex="0" aria-expanded="false">' +
        '<div class="skill-header">' +
        '<div class="skill-title-wrap">' +
        '<span class="skill-icon"><i class="bi ' + iconClass + ' skill-bi-icon" aria-hidden="true"></i></span>' +
        '<span class="skill-title">' + escapeHtml(skill.area) + '</span>' +
        '</div>' +
        '<i class="bi bi-chevron-down skill-chevron" aria-hidden="true"></i>' +
        '</div>' +
        '<div class="skill-chips">' + chips.map(function (c) { return '<span class="skill-chip">' + escapeHtml(c) + '</span>'; }).join('') + '</div>' +
        '</div>' +
        '<div class="skill-detail">' +
        '<div class="skill-description">' + renderSkillDescription(skill.description) + '</div>' +
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
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        nav.classList.toggle('scrolled', window.scrollY > 40);
        ticking = false;
      });
    }, { passive: true });
  }

  function setupReveal() {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });

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
    cvLoadedData = data;
    setupThemeToggle();
    renderPersonal(data);
    renderExperience(data['work-experiences'] || []);
    renderSkills(data.skills || []);
    renderAtsContent(data);
    setupNavbar();
    setupReveal();
    setupPdfDownload();
    setupFooterSupport();
  }

  function setupFooterSupport() {
    var wrap = document.getElementById('footer-support-wrap');
    var btn = document.getElementById('footer-support-btn');
    var fingerprintEl = document.getElementById('footer-support-fingerprint');
    var dotsEl = document.getElementById('footer-support-dots');
    var done = document.getElementById('footer-support-done');
    if (!wrap || !btn || !done) return;
    var clicks = 0;
    var totalClicks = 5;
    var paths = fingerprintEl ? fingerprintEl.querySelectorAll('.fingerprint-path') : [];
    var dots = dotsEl ? dotsEl.querySelectorAll('.footer-support-dot') : [];

    function updateFingerprint() {
      paths.forEach(function (path, i) {
        path.classList.toggle('visible', i < clicks);
        path.classList.toggle('placeholder', i >= clicks);
      });
    }

    updateFingerprint();
    btn.addEventListener('click', function () {
      clicks = Math.min(clicks + 1, totalClicks);
      updateFingerprint();
      btn.classList.remove('footer-support-btn--neon');
      btn.offsetWidth;
      btn.classList.add('footer-support-btn--neon');
      setTimeout(function () { btn.classList.remove('footer-support-btn--neon'); }, 500);
      if (dots[clicks - 1]) dots[clicks - 1].classList.add('filled');
      if (clicks >= totalClicks) {
        btn.setAttribute('hidden', '');
        done.removeAttribute('hidden');
        wrap.setAttribute('aria-hidden', 'true');
      }
    });
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
