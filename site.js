const $ = selector => document.querySelector(selector);
let destinationEmail = '';

function setText(selector, text, fallback = '') {
  const element = $(selector);
  if (element) element.textContent = text || fallback;
}

function formatDate(value) {
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? value || '' : new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
}

function renderNotices(notices = []) {
  const list = $('#noticeList');
  const sorted = [...notices].sort((a, b) => String(b.date).localeCompare(String(a.date)));
  $('#noticeCount').textContent = `${sorted.length} ${sorted.length === 1 ? 'notice' : 'notices'}`;
  $('#noticeTicker').textContent = sorted[0]?.title || 'Welcome to our school website.';
  list.replaceChildren();
  if (!sorted.length) {
    const empty = document.createElement('div');
    empty.className = 'no-notices';
    empty.textContent = 'School notices will appear here.';
    list.append(empty);
    return;
  }
  for (const notice of sorted) {
    const article = document.createElement('article');
    article.className = 'notice-item';
    const date = document.createElement('div');
    date.className = 'notice-date';
    date.textContent = formatDate(notice.date);
    const content = document.createElement('div');
    content.className = 'notice-body';
    const category = document.createElement('div');
    category.className = 'notice-category';
    category.textContent = notice.category || 'General';
    const title = document.createElement('h3');
    title.textContent = notice.title;
    const message = document.createElement('p');
    message.textContent = notice.message;
    content.append(category, title, message);
    const arrow = document.createElement('span');
    arrow.className = 'notice-arrow';
    arrow.textContent = '↗';
    article.append(date, content, arrow);
    list.append(article);
  }
}

async function loadHomepage() {
  const response = await fetch('./site-data.json');
  if (!response.ok) throw new Error('Could not load the school website content.');
  const site = await response.json();
  destinationEmail = String(site.email || '').trim();
  document.title = site.schoolName || 'School website';
  setText('#brandName', site.schoolName, 'Your School Name');
  setText('#captionName', site.schoolName, 'Your School Name');
  setText('#footerName', site.schoolName, 'Your School Name');
  setText('#heroSchoolName', (site.schoolName || 'YOUR SCHOOL').toLocaleUpperCase());
  setText('#copyrightName', site.schoolName, 'Your School Name');
  setText('#currentYear', new Date().getFullYear());
  setText('#brandTagline', site.tagline, 'A place to learn, grow, and thrive.');
  setText('#footerTagline', site.tagline, 'A place to learn, grow, and thrive.');
  setText('#heroTitle', site.heroTitle, 'Every student deserves a bright future.');
  setText('#heroText', site.heroText);
  setText('#aboutText', site.aboutText);
  setText('#contactAddress', site.address, 'School address');
  setText('#contactPhone', site.phone, 'School phone');
  setText('#contactEmail', site.email, 'School email');
  setText('#contactHours', site.officeHours, 'Office hours');
  const emailLink = $('#footerEmail');
  if (emailLink && site.email) {
    emailLink.href = `mailto:${site.email}`;
    emailLink.textContent = `${site.email} ↗`;
  }
  if (site.schoolImage) {
    $('#schoolImage').src = site.schoolImage;
    $('#schoolImage').alt = `${site.schoolName || 'School'} campus`;
  }
  renderNotices(site.notices || []);
  const form = $('#contactForm');
}

$('#contactForm').addEventListener('submit', event => {
  event.preventDefault();
  const status = $('#formMessage');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(destinationEmail)) {
    status.textContent = 'The school email is not set correctly yet. Please use the email shown above.';
    return;
  }
  const details = Object.fromEntries(new FormData(event.currentTarget).entries());
  const subject = details.subject || `Website enquiry from ${details.name}`;
  const body = [
    `Name: ${details.name}`,
    `Email: ${details.email}`,
    `Phone: ${details.phone || 'Not provided'}`,
    `Subject: ${details.subject || 'Not provided'}`,
    '',
    'Message:',
    String(details.message || '').slice(0, 1200),
  ].join('\n');
  const mailto = `mailto:${destinationEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  status.textContent = 'Your email app should open with this message. Review it and press Send there. If it does not open, email the school using the address above.';
  window.location.href = mailto;
});

$('#menuToggle').addEventListener('click', () => {
  const menu = $('#mainNav');
  const open = menu.classList.toggle('open');
  $('#menuToggle').setAttribute('aria-expanded', String(open));
});
$('#mainNav').addEventListener('click', event => {
  if (event.target.closest('a')) {
    $('#mainNav').classList.remove('open');
    $('#menuToggle').setAttribute('aria-expanded', 'false');
  }
});

loadHomepage().catch(error => {
  const message = document.createElement('p');
  message.textContent = error.message;
  message.style.cssText = 'position:fixed;bottom:12px;left:12px;background:#fff7f6;color:#963e3c;padding:10px 14px;z-index:20;font-size:12px';
  document.body.append(message);
});
