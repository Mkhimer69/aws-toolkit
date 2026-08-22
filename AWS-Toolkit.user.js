// ==UserScript==
// @name         AWS Toolkit
// @namespace    https://github.com/Mkhimer69/aws-toolkit
// @version      2.5
// @description  A productivity toolkit built for Amazon Connect user administration workflows.
// @author       Fathy Mkhimer
// @match        https://lyft-support.my.connect.aws/users*
// @match        https://lyft-support.my.connect.aws/analytics-dashboards*
// @downloadURL  https://raw.githubusercontent.com/Mkhimer69/aws-toolkit/main/AWS-Toolkit.user.js
// @updateURL    https://raw.githubusercontent.com/Mkhimer69/aws-toolkit/main/AWS-Toolkit.user.js
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const path = window.location.pathname;

  if (path.includes('analytics-dashboards')) {
    if (window.awsToolkitDataGrabLoaded) return;
    window.awsToolkitDataGrabLoaded = true;

    window.magicMonitorData = [];
    const oldFetch = window.fetch;

    window.fetch = async function (input, init) {
      try {
        if (init && init.body && typeof init.body === 'string' && init.body.includes('AGENT') && init.body.includes('CHANNEL')) {
          const payload = JSON.parse(init.body);
          if (payload.columns?.length === 11 && payload.pageSize !== 1000) {
            payload.pageSize = 1000;
            init.body = JSON.stringify(payload);
          }
        }
      } catch (e) {}

      const res = await oldFetch(input, init);

      try {
        if (init && init.body && typeof init.body === 'string' && init.body.includes('AGENT') && init.body.includes('CHANNEL')) {
          const payload = JSON.parse(init.body);
          if (payload.columns?.length === 11) {
            const data = await res.clone().json();
            const getMetric = (row, id) => row.metrics.find(m => m.metric?.metricId === id)?.value || '';

            window.magicMonitorData = (data.rows || []).map(row => ({
              agent: getMetric(row, 'AGENT_VIEW_NAME'),
              email: (row.name || '').split(' ('),
              state: getMetric(row, 'AGENT_VIEW_STATE'),
              duration: Number(getMetric(row, 'AGENT_VIEW_STATE_DURATION')) || 0,
              profile: getMetric(row, 'AGENT_VIEW_PROFILE'),
              active: Number(getMetric(row, 'ACTIVE_SLOTS')) || 0,
              capacity: Number(getMetric(row, 'MAX_SLOTS')) || 0
            }));

            const syncTime = new Date().toLocaleTimeString();
            const bridgePayload = { time: syncTime, rows: window.magicMonitorData };
            localStorage.sharedMagicMonitorData = JSON.stringify(bridgePayload);

            const timeDisplay = document.getElementById('atgdTime');
            if (timeDisplay) timeDisplay.textContent = `Sync: ${syncTime}`;
          }
        }
      } catch (e) {}
      return res;
    };

    const panel = document.createElement('div');
    panel.id = 'awsToolkitDataGrab';
    Object.assign(panel.style, {
      position: 'fixed', top: '20px', left: '20px', backgroundColor: '#111827', color: '#f3f4f6',
      zIndex: '999999', borderRadius: '8px', padding: '10px 14px', fontFamily: 'system-ui, sans-serif',
      boxShadow: '0 4px 12px rgba(0,0,0,0.5)', border: '1px solid #374151', display: 'flex',
      flexDirection: 'column', gap: '4px', minWidth: '180px', cursor: 'move', userSelect: 'none'
    });

    panel.innerHTML = `
      <div style="font-size: 12px; font-weight: bold; color: #4ade80; text-transform: uppercase; letter-spacing: 0.5px; pointer-events: none;">📡 AWS Toolkit Grab</div>
      <div id="atgdTime" style="font-size: 11px; color: #9ca3af; pointer-events: none;">Sync: Waiting for data...</div>
    `;
    document.body.appendChild(panel);

    let isDragging = false, offsetX = 0, offsetY = 0;
    panel.addEventListener('mousedown', (e) => {
      isDragging = true;
      offsetX = e.clientX - panel.getBoundingClientRect().left;
      offsetY = e.clientY - panel.getBoundingClientRect().top;
      panel.style.opacity = '0.8';
    });
    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      panel.style.left = `${e.clientX - offsetX}px`;
      panel.style.top = `${e.clientY - offsetY}px`;
    });
    document.addEventListener('mouseup', () => {
      if (isDragging) { isDragging = false; panel.style.opacity = '1'; }
    });
  }

  else if (path.includes('users')) {
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
          <span>🚀 AWS Toolkit v3 </span>
          <span id="att" style="cursor:pointer; padding:0 4px;">−</span>
      </div>
      <div id="atb" style="padding:14px; display:flex; flex-direction:column; gap:10px;">
          <div id="atc" style="font-size:13px; color:#cbd5e1;"></div>
          <div id="ats" style="padding:8px; background:#111827; border-radius:8px; color:#8ab4f8; text-align:center; font-weight:600; font-size:13px;">Ready</div>

          <div style="background: #22272e; padding: 10px; border-radius: 8px; border: 1px solid #444; display: flex; flex-direction: column; gap: 6px;">
              <div id="toggleBridgeHeader" style="display:flex; justify-content:space-between; align-items:center; cursor:pointer; user-select:none;">
                  <span style="font-size: 11px; color: #4ade80; font-weight: bold; text-transform: uppercase;">⚡ Live Bridge Picker <span id="bridgeArrow">▼</span></span>
                  <span id="lastRefreshed" style="font-size: 10px; color: #8b949e;">Sync: None</span>
              </div>
              <div id="bridgeBody" style="display: flex; flex-direction: column; gap: 6px;">
                  <div style="display: flex; gap: 6px; align-items: center; margin-top: 4px;">
                      <span style="font-size:12px; color:#fff;">Pick</span>
                      <input id="pickCount" type="number" value="5" min="1" style="width: 45px; background: #111827; color: white; border: 1px solid #444; border-radius: 4px; padding: 4px; text-align: center; font-size: 12px;">
                      <span style="font-size:12px; color:#fff;">random agents from:</span>
                  </div>
                  <select id="sourceProfile" style="width:100%; background:#111827; color:#fff; border:1px solid #444; border-radius:6px; padding:6px; font-size:12px;">
                      <option value="" disabled selected>Loading active profiles...</option>
                  </select>
                  <button id="autoInject" style="width:100%; background:#22c55e; color:white; border:none; border-radius:6px; padding:6px; font-weight:600; font-size:12px; cursor:pointer;">⚡ Inject into Tool Stash</button>
              </div>
          </div>

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
      if(btn.id === 'autoInject') return;
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

    document.getElementById('toggleBridgeHeader').onclick = () => {
      const bBody = document.getElementById('bridgeBody');
      const bArrow = document.getElementById('bridgeArrow');
      if (bBody.style.display === 'none') {
        bBody.style.display = 'flex';
        bArrow.textContent = '▼';
      } else {
        bBody.style.display = 'none';
        bArrow.textContent = '▲';
      }
    };

    const syncDynamicProfiles = () => {
      try {
        const payload = JSON.parse(localStorage.sharedMagicMonitorData || '{}');
        const rows = payload.rows || [];
        const syncTime = payload.time || 'None';

        const selectEl = document.getElementById('sourceProfile');
        const timeEl = document.getElementById('lastRefreshed');

        if (!rows.length) {
          selectEl.innerHTML = '<option value="" disabled selected>❌ No live data found</option>';
          timeEl.textContent = 'Sync: None';
          return;
        }

        timeEl.textContent = `Sync: ${syncTime}`;

        const uniqueProfiles = [...new Set(rows.map(r => r.profile).filter(Boolean))].sort();
        const currentSelected = selectEl.value;

        selectEl.innerHTML = uniqueProfiles.map(prof =>
          `<option value="${prof}" ${prof === currentSelected ? 'selected' : ''}>${prof}</option>`
        ).join('');
      } catch (e) {}
    };

    syncDynamicProfiles();
    setInterval(syncDynamicProfiles, 2000);

    document.getElementById('autoInject').onclick = () => {
      const payload = JSON.parse(localStorage.sharedMagicMonitorData || '{}');
      const sourceData = payload.rows || [];
      if (!sourceData.length) return toast('⚠️ No active live data found! Please check Magic Monitor.');

      const targetProfile = document.getElementById('sourceProfile').value;
      const countToPick = parseInt(document.getElementById('pickCount').value) || 5;
      if(!targetProfile) return toast('Please select a valid routing profile');

      const validAgents = sourceData.filter(agent => agent.profile === targetProfile && agent.email);
      if (!validAgents.length) return toast(`No active agents found in profile: ${targetProfile}`);

      const shuffled = [...validAgents];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }

      const selectedAgents = shuffled.slice(0, countToPick);
      const currentStoredList = get();

      let newCount = 0;
      selectedAgents.forEach(agent => {
        const rawEmail = Array.isArray(agent.email) ? agent.email[0] : agent.email;
        const cleanEmail = (rawEmail || '').toLowerCase().trim();
        if (cleanEmail && !currentStoredList.includes(cleanEmail)) {
          currentStoredList.push(cleanEmail);
          newCount++;
        }
      });


      localStorage.awsUserCollector = JSON.stringify(currentStoredList);
      upd();
      if (l.style.display === 'block') l.innerHTML = currentStoredList.join('<br>');
      toast(`✅ Injected ${newCount} random agents from ${targetProfile}!`);
    };

    document.getElementById('add').onclick = async () => {
      try {
        const text = (await navigator.clipboard.readText()).trim();
        const found = text.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi) || [];
        if (!found.length) return toast('No valid email found');
        const arr = get();
        let addedCount = 0;
        found.forEach(email => {
          const cleanEmail = email.toLowerCase().trim();
          if (!arr.includes(cleanEmail)) { arr.push(cleanEmail); addedCount++; }
        });
        localStorage.awsUserCollector = JSON.stringify(arr);
        upd();
        if (found.length === 1) toast('Saved'); else toast(`Added ${addedCount} emails!`);
      } catch { toast('Clipboard access failed'); }
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

      pContainer.style.display = 'block'; pBar.style.width = '0%';
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
      setter.call(search, ''); search.dispatchEvent(new Event('input', { bubbles: true }));
      s.textContent = 'Done';
      notifyMe('AWS Toolkit Completed', `Processed ${emails.length} agents.`);
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
  }
})();

