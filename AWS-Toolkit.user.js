// ==UserScript==
// @name         AWS Toolkit
// @namespace    https://github.com/Mkhimer69/aws-toolkit
// @version      2.2
// @description  A productivity toolkit built for Amazon Connect user administration workflows.
// @author       Fathy Mkhimer
// @match        https://lyft-support.my.connect.aws/users*
// @downloadURL  https://raw.githubusercontent.com/Mkhimer69/aws-toolkit/main/AWS-Toolkit.user.js
// @updateURL    https://raw.githubusercontent.com/Mkhimer69/aws-toolkit/main/AWS-Toolkit.user.js
// @grant        none
// ==/UserScript==
(function () {
  'use strict';
  if (document.getElementById('awsToolkit')) return;

  if (Notification.permission === 'default') {
    Notification.requestPermission();
  }

  const get = () => JSON.parse(localStorage.awsUserCollector || '[]');
  const upd = () => { document.getElementById('atc').textContent = `Stored: ${get().length} emails`; };
  const wait = ms => new Promise(r => setTimeout(r, ms));

  const toast = txt => {
    const d = document.createElement('div');
    d.textContent = txt;
    d.style = `position:fixed; bottom:20px; right:20px; background:linear-gradient(90deg,#0078d4,#0a84ff); color:#fff; padding:8px 12px; border-radius:8px; z-index:1000000; font-family:system-ui; font-size:13px;`;
    document.body.appendChild(d);
    setTimeout(() => d.remove(), 1500);
  };

  const notifyMe = (title, body) => {
    if (Notification.permission === 'granted') {
      new Notification(title, { body: body, icon: 'https://google.com' });
    }
  };

  const p = document.createElement('div');
  p.id = 'awsToolkit';
  Object.assign(p.style, {
    position: 'fixed', top: '100px', right: '20px', width: '340px', background: '#1b1f24',
    color: '#fff', border: '1px solid #3a3f46', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,.35)',
    zIndex: '999999', fontFamily: 'system-ui, sans-serif'
  });

  p.innerHTML = `
    <div id="ath" style="padding:12px; background:linear-gradient(90deg,#0078d4,#0a84ff); border-radius:12px 12px 0 0; cursor:move; display:flex; justify-content:space-between; font-weight:600; font-size:13px; user-select:none;">
        <span>🚀 AWS Toolkit v2</span>
        <span id="att" style="cursor:pointer; padding:0 4px;">−</span>
    </div>
    <div id="atb" style="padding:14px; display:flex; flex-direction:column; gap:10px;">
        <div id="atc" style="font-size:13px; color:#cbd5e1;"></div>
        <div id="ats" style="padding:8px; background:#111827; border-radius:8px; color:#8ab4f8; text-align:center; font-weight:600; font-size:13px;">Ready</div>

        <div id="progContainer" style="width:100%; background:#2d333b; height:6px; border-radius:3px; overflow:hidden; display:none;">
            <div id="progBar" style="width:0%; height:100%; background:#4ade80; transition:width 0.3s ease;"></div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
            <button id="add">📥 Add</button><button id="show">📋 Show</button>
            <button id="sel">✅ Select</button><button id="des">❌ Deselect</button>

            <select id="rp" style="grid-column:1/3; width:100%; background:#111827; color:#fff; border:1px solid #444; border-radius:8px; padding:8px; font-size:13px;">
                <option selected>Driver Chat Focus</option><option>Driver Default Omnichannel</option>
                <option>Driver Email Focus</option><option>Driver Voice Focus</option>
                <option>Rider Chat Single Concurrency</option><option>Rider Email</option>
                <option>Rider Omnichannel</option><option>Safety Chat - Training</option>
                <option>Safety Email - Training</option><option>Safety General</option>
                <option>Safety SMAA AST Sutherland</option><option>Safety SMAA Sutherland</option>
                <option>Supervisor - Sutherland</option>
            </select>
            <button id="applyrp" style="grid-column:1/3; background:#0a84ff; color:white; border:none; border-radius:8px; padding:10px; font-weight:600; font-size:13px;">🚀 Apply Profile</button>
            <button id="clr" style="grid-column:1/3;">🧹 Clear</button>
        </div>
        <div id="atl" style="display:none; max-height:180px; overflow:auto; background:#111; padding:8px; border-radius:8px; font-family:monospace; font-size:12px; border:1px solid #333;"></div>
    </div>
  `;
  document.body.appendChild(p);

  p.querySelectorAll('button').forEach(btn => {
    const isApply = btn.id === 'applyrp';
    Object.assign(btn.style, {
      background: isApply ? '#0a84ff' : '#2d333b', color: '#fff', border: isApply ? 'none' : '1px solid #444',
      borderRadius: '8px', padding: isApply ? '10px' : '8px', cursor: 'pointer', fontWeight: '500', fontSize: '13px'
    });
    if (!isApply) {
      btn.onmouseenter = () => btn.style.background = '#3a424d';
      btn.onmouseleave = () => btn.style.background = '#2d333b';
    }
  });

  upd();
  const s = document.getElementById('ats');
  const l = document.getElementById('atl');
  const pContainer = document.getElementById('progContainer');
  const pBar = document.getElementById('progBar');

  document.getElementById('add').onclick = async () => {
    try {
      const text = (await navigator.clipboard.readText()).trim();
      const found = text.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi) || [];

      if (!found.length) return toast('No valid email found');

      const arr = get();
      let addedCount = 0;

      found.forEach(email => {
        const cleanEmail = email.toLowerCase().trim();
        if (!arr.includes(cleanEmail)) {
          arr.push(cleanEmail);
          addedCount++;
        }
      });

      localStorage.awsUserCollector = JSON.stringify(arr);
      upd();

      if (found.length === 1) {
        toast('Saved');
      } else {
        toast(`Added ${addedCount} emails from list!`);
      }
    } catch {
      toast('Clipboard access failed');
    }
  };

  document.getElementById('show').onclick = () => {
    l.style.display = l.style.display === 'block' ? 'none' : 'block';
    l.innerHTML = get().join('<br>');
  };

  document.getElementById('clr').onclick = () => {
    localStorage.removeItem('awsUserCollector');
    upd(); l.innerHTML = ''; pBar.style.width = '0%'; pContainer.style.display = 'none'; toast('Cleared');
  };

  async function run(mode) {
    const emails = get().map(x => x.trim().toLowerCase());
    if (!emails.length) return toast('No emails');
    const search = document.querySelector('input[placeholder="Search users"]');
    if (!search) return toast('Search box not found');

    pContainer.style.display = 'block';
    pBar.style.width = '0%';

    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;

    for (let i = 0; i < emails.length; i++) {
      s.textContent = `${mode === 's' ? 'Selecting' : 'Deselecting'} ${i + 1}/${emails.length}`;
      pBar.style.width = `${((i + 1) / emails.length) * 100}%`;

      setter.call(search, emails[i]);
      search.dispatchEvent(new Event('input', { bubbles: true }));
      await wait(3000);

      const cb = [...document.querySelectorAll('input[type="checkbox"]')].find(x =>
        (x.getAttribute('aria-label') || '').toLowerCase().includes(emails[i])
      );
      if (cb) {
        if (mode === 's' && !cb.checked) cb.click();
        if (mode === 'd' && cb.checked) cb.click();
      }
    }

    setter.call(search, '');
    search.dispatchEvent(new Event('input', { bubbles: true }));
    s.textContent = 'Done';

    notifyMe('AWS Toolkit Task Completed', `Successfully processed ${emails.length} agents.`);
    setTimeout(() => { pContainer.style.display = 'none'; }, 2000);
  }

  async function applyRoutingProfile(profileName) {
    s.textContent = 'Applying ' + profileName + '...';
    document.querySelectorAll('button[aria-haspopup="true"]')[1]?.click();
    await wait(800);
    [...document.querySelectorAll('li')].find(li => li.innerText.trim() === 'Routing profile')?.click();
    await wait(1500);

    const picker = [...document.querySelectorAll('button[aria-haspopup="dialog"]')].find(b =>
      b.textContent.includes('Search routing profiles')
    );
    picker?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
    await wait(1000);

    const boxes = [...document.querySelectorAll('input[role="combobox"]')];
    const searchBox = boxes[boxes.length - 1];
    if(!searchBox){ return toast('Routing profile search not found'); }

    searchBox.focus();
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
    setter.call(searchBox, profileName);
    searchBox.dispatchEvent(new Event('input', { bubbles: true }));
    searchBox.dispatchEvent(new Event('change', { bubbles: true }));
    await wait(1500);

    const options = [...document.querySelectorAll('[role="option"]')];
    const option = options.find(o => o.textContent.trim().toLowerCase().includes(profileName.toLowerCase()));
    if(!option){
      console.table(options.map(x => x.textContent.trim()));
      return toast(profileName + ' not found');
    }

    ['mousedown', 'mouseup', 'click'].forEach(evt =>
      option.dispatchEvent(new MouseEvent(evt, { bubbles: true, cancelable: true }))
    );
    await wait(1000);
    document.querySelector('[data-testid="edit-routing-profile-submit-button"]')?.click();
    s.textContent = '✅ Applied';
    toast(profileName + ' Applied');

    notifyMe('Profile Applied Successfully', `Routing Profile: ${profileName}`);
  }

  document.getElementById('sel').onclick = () => run('s');
  document.getElementById('des').onclick = () => run('d');

  const rp = document.getElementById('rp');
  if (localStorage.awsLastProfile) rp.value = localStorage.awsLastProfile;

  document.getElementById('applyrp').onclick = () => {
    localStorage.awsLastProfile = rp.value;
    applyRoutingProfile(rp.value);
  };

  const body = document.getElementById('atb');
  document.getElementById('att').onclick = () => {
    body.style.display = body.style.display === 'none' ? 'block' : 'none';
    document.getElementById('att').textContent = body.style.display === 'none' ? '+' : '−';
  };

  const header = document.getElementById('ath');
  header.onmousedown = (e) => {
    if (e.target.id === 'att') return;
    e.preventDefault();
    let posX = e.clientX, posY = e.clientY;
    document.onmousemove = (ev) => {
      p.style.left = `${p.offsetLeft + (ev.clientX - posX)}px`;
      p.style.top = `${p.offsetTop + (ev.clientY - posY)}px`;
      posX = ev.clientX; posY = ev.clientY;
    };
    document.onmouseup = () => document.onmousemove = document.onmouseup = null;
  };
})();
