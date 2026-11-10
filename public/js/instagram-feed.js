(() => {
  const data = window.INSTAGRAM_DATA || { profiles: [], posts: [] };
  const profiles = new Map(data.profiles.map(p => [p.id, p]));
  const grid = document.getElementById('feed-grid');
  const empty = document.getElementById('feed-empty');
  const count = document.getElementById('feed-count');
  const validUrl = value => { try { const u = new URL(value); return u.protocol === 'https:' && (u.hostname === 'instagram.com' || u.hostname === 'www.instagram.com') && /^\/(p|reel|reels)\/[A-Za-z0-9_-]+\/?$/.test(u.pathname) ? u : null; } catch { return null; } };
  const element = (tag, text, cls) => { const el = document.createElement(tag); if (text) el.textContent = text; if (cls) el.className = cls; return el; };
  function render() {
    const query = '';
    const available = data.posts.filter(post => post.visible === true && profiles.has(post.profileId) && validUrl(post.url));
    const posts = available.filter(post => [post.title, post.description, profiles.get(post.profileId).name].join(' ').toLocaleLowerCase('hu').includes(query)).sort((a,b) => (b.date || '').localeCompare(a.date || ''));
    grid.replaceChildren(); count.textContent = posts.length ? `${posts.length} bejegyzés` : '';
    empty.hidden = posts.length > 0;
    if (!posts.length) { empty.replaceChildren(element('strong', available.length ? 'Nincs találat' : 'A hírfolyam feltöltésre vár'), element('p', available.length ? 'Próbálj másik keresőkifejezést.' : 'A kiválasztott Instagram-bejegyzések hamarosan itt jelennek meg.')); return; }
    for (const post of posts) {
      const url = validUrl(post.url), profile = profiles.get(post.profileId), card = element('article', '', 'feed-card');
      if (post.title && post.title !== 'Instagram-bejegyzés') card.append(element('h3', post.title));
      if (post.date && /^\d{4}-\d{2}-\d{2}$/.test(post.date)) { const time=element('time', post.date); time.dateTime=post.date; card.append(time); }
      if (post.description) card.append(element('p', post.description));
      const frame=document.createElement('iframe');
      frame.src=`https://www.instagram.com${url.pathname.replace(/\/$/,'')}/embed/`;
      frame.title=`Instagram-bejegyzés: ${url.pathname.split('/')[2]}`;
      frame.loading='lazy'; frame.referrerPolicy='strict-origin-when-cross-origin';
      const link=element('a','Megnyitás az Instagramon ↗'); link.href=url.href; link.target='_blank'; link.rel='noopener noreferrer';
      card.append(frame, link); grid.append(card);
    }
  }
  render();
})();
