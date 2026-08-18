// ==UserScript==
// @name         AWS Toolkit
// @namespace    https://github.com/Mkhimer69/aws-toolkit
// @version      2.1
// @description  AWS Connect Productivity Toolkit
// @author       Fathy Mkhimer
// @match        https://lyft-support.my.connect.aws/users*
// @downloadURL  https://raw.githubusercontent.com/Mkhimer69/aws-toolkit/main/AWS-Toolkit.user.js
// @updateURL    https://raw.githubusercontent.com/Mkhimer69/aws-toolkit/main/AWS-Toolkit.user.js
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    if (document.getElementById('awsToolkit')) return;

    const p = document.createElement('div');
    p.id = 'awsToolkit';

    p.style = `
        position:fixed;
        top:100px;
        right:20px;
        width:340px;
        background:#1b1f24;
        color:#fff;
        border:1px solid #3a3f46;
        border-radius:12px;
        box-shadow:0 8px 24px rgba(0,0,0,.35);
        z-index:999999;
        font:12px Segoe UI;
    `;

    p.innerHTML = `
        <div id="ath" style="
            padding:10px;
            background:linear-gradient(90deg,#0078d4,#0a84ff);
            border-radius:12px 12px 0 0;
            cursor:move;
            display:flex;
            justify-content:space-between;
            font-weight:600;">
            <span>🚀 AWS Toolkit v2</span>
            <span id="att">−</span>
        </div>

        <div id="atb" style="padding:12px">

            <div id="atc"></div>

            <div id="ats" style="
                margin:10px 0;
                padding:8px;
                background:#111827;
                border-radius:8px;
                color:#8ab4f8;
                text-align:center;
                font-weight:600;">
                Ready
            </div>

            <div style="
                display:grid;
                grid-template-columns:1fr 1fr;
                gap:8px;">

                <button id="add">📥 Add</button>
                <button id="show">📋 Show</button>

                <button id="sel">✅ Select</button>
                <button id="des">❌ Deselect</button>

                <select id="rp" style="
                    grid-column:1/3;
                    width:100%;
                    background:#111827;
                    color:#fff;
                    border:1px solid #444;
                    border-radius:8px;
                    padding:8px;">

                   <option selected>Driver Chat Focus</option>
<option>Driver Default Omnichannel</option>
<option>Driver Email Focus</option>
<option>Driver Voice Focus</option>

<option>Rider Chat Single Concurrency</option>
<option>Rider Email</option>
<option>Rider Omnichannel</option>

<option>Safety Chat - Training</option>
<option>Safety Email - Training</option>
<option>Safety General</option>
<option>Safety SMAA AST Sutherland</option>
<option>Safety SMAA Sutherland</option>

<option>Supervisor - Sutherland</option>

                </select>

                <button id="applyrp" style="
                    grid-column:1/3;
                    background:#0a84ff;
                    color:white;
                    border:none;
                    border-radius:8px;
                    padding:10px;
                    font-weight:600;">
                    🚀 Apply Profile
                </button>

                <button id="clr" style="grid-column:1/3;">
                    🧹 Clear
                </button>

            </div>

            <div id="atl" style="
                display:none;
                margin-top:10px;
                max-height:180px;
                overflow:auto;
                background:#111;
                padding:8px;
                border-radius:8px;">
            </div>

        </div>
    `;

    document.body.appendChild(p);

    p.querySelectorAll('button').forEach(btn => {

        if (btn.id !== 'applyrp') {
            btn.style.background = '#2d333b';
        }

        btn.style.color = '#fff';
        btn.style.border = '1px solid #444';
        btn.style.borderRadius = '8px';
        btn.style.padding = '8px';
        btn.style.cursor = 'pointer';

        btn.addEventListener('mouseenter', () => {
            if (btn.id !== 'applyrp') {
                btn.style.background = '#3a424d';
            }
        });

        btn.addEventListener('mouseleave', () => {
            if (btn.id !== 'applyrp') {
                btn.style.background = '#2d333b';
            }
        });
    });

    const c = document.getElementById('atc');
    const s = document.getElementById('ats');
    const l = document.getElementById('atl');

    const wait = ms => new Promise(r => setTimeout(r, ms));

    const get = () =>
        JSON.parse(localStorage.awsUserCollector || '[]');

    const upd = () => {
        c.textContent = `Stored: ${get().length} emails`;
    };

    const toast = txt => {

        const d = document.createElement('div');

        d.textContent = txt;

        d.style = `
            position:fixed;
            bottom:20px;
            right:20px;
            background:linear-gradient(90deg,#0078d4,#0a84ff);
            color:#fff;
            padding:8px 12px;
            border-radius:8px;
            z-index:1000000;
        `;

        document.body.appendChild(d);

        setTimeout(() => d.remove(), 1500);
    };

    upd();

    document.getElementById('add').onclick = async () => {

        try {

            let t = await navigator.clipboard.readText();

            t = t.trim().toLowerCase();

            const m = t.match(
                /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i
            );

            if (!m) {
                return toast('No email found');
            }

            const email = m[0];

            const arr = get();

            if (!arr.includes(email)) {

                arr.push(email);

                localStorage.awsUserCollector =
                    JSON.stringify(arr);
            }

            upd();

            toast('Saved');

        } catch {

            toast('Clipboard failed');
        }
    };

    document.getElementById('show').onclick = () => {

        l.style.display =
            l.style.display === 'block'
                ? 'none'
                : 'block';

        l.innerHTML = get().join('<br>');
    };

    document.getElementById('clr').onclick = () => {

        localStorage.removeItem('awsUserCollector');

        upd();

        l.innerHTML = '';

        toast('Cleared');
    };

    async function run(mode) {

        const emails =
            get().map(x => x.trim().toLowerCase());

        if (!emails.length) {
            return toast('No emails');
        }

        const search =
            document.querySelector(
                'input[placeholder="Search users"]'
            );

        if (!search) {
            return toast('Search box not found');
        }

        const setter =
            Object.getOwnPropertyDescriptor(
                HTMLInputElement.prototype,
                'value'
            ).set;

        for (let i = 0; i < emails.length; i++) {

            s.textContent =
                (mode === 's'
                    ? 'Selecting '
                    : 'Deselecting ') +
                (i + 1) +
                '/' +
                emails.length;

            setter.call(search, emails[i]);

            search.dispatchEvent(
                new Event('input', {
                    bubbles: true
                })
            );

            await wait(3000);

            const cb =
                [...document.querySelectorAll(
                    'input[type="checkbox"]'
                )].find(x =>
                    (
                        x.getAttribute('aria-label') || ''
                    )
                        .toLowerCase()
                        .includes(emails[i])
                );

            if (cb) {

                if (mode === 's' && !cb.checked)
                    cb.click();

                if (mode === 'd' && cb.checked)
                    cb.click();
            }
        }

        setter.call(search, '');

        search.dispatchEvent(
            new Event('input', {
                bubbles: true
            })
        );

        s.textContent = 'Done';
    }

    async function applyRoutingProfile(profileName) {

        s.textContent = 'Applying ' + profileName + '...';

        document.querySelectorAll(
            'button[aria-haspopup="true"]'
        )[1]?.click();

        await wait(800);

        [...document.querySelectorAll('li')]
            .find(li =>
                li.innerText.trim() ===
                'Routing profile'
            )?.click();

        await wait(1500);

        const picker =
            [...document.querySelectorAll(
                'button[aria-haspopup="dialog"]'
            )].find(b =>
                b.textContent.includes(
                    'Search routing profiles'
                )
            );

        picker?.dispatchEvent(
            new MouseEvent('mousedown', {
                bubbles: true,
                cancelable: true
            })
        );

await wait(1000);

const dialog =
document.querySelector(
    '[role="dialog"]'
);

const searchBox =
dialog?.querySelector(
    'input[role="combobox"]'
);

if(searchBox){

    const setter =
        Object.getOwnPropertyDescriptor(
            HTMLInputElement.prototype,
            'value'
        ).set;

    setter.call(
        searchBox,
        profileName
    );

    searchBox.dispatchEvent(
        new Event('input',{
            bubbles:true
        })
    );

    await wait(1500);
}

const options =
[...document.querySelectorAll(
    '[role="option"]'
)];

console.log(
    'Searching for:',
    profileName
);

console.table(
    options.map(x =>
        x.textContent.trim()
    )
);

const option =
options.find(o =>
    o.textContent
        .trim()
        .toLowerCase()
        .includes(
            profileName.toLowerCase()
        )
);

if (!option) {

    console.log(
        'Profile not found:',
        profileName
    );

    return toast(
        profileName + ' not found'
    );
}

['mousedown','mouseup','click']
.forEach(evt =>
    option.dispatchEvent(
        new MouseEvent(evt,{
            bubbles:true,
            cancelable:true
        })
    )
);

        await wait(1000);

        document.querySelector(
            '[data-testid="edit-routing-profile-submit-button"]'
        )?.click();

        s.textContent = '✅ Applied';

        toast(profileName + ' Applied');
    }

    document.getElementById('sel').onclick =
        () => run('s');

    document.getElementById('des').onclick =
        () => run('d');

    const rp =
        document.getElementById('rp');

    if (localStorage.awsLastProfile) {
        rp.value =
            localStorage.awsLastProfile;
    }

    document.getElementById('applyrp').onclick =
        () => {

            localStorage.awsLastProfile =
                rp.value;

            applyRoutingProfile(
                rp.value
            );
        };

    document.getElementById('att').onclick = () => {

        const b =
            document.getElementById('atb');

        b.style.display =
            b.style.display === 'none'
                ? 'block'
                : 'none';

        document.getElementById('att')
            .textContent =
            b.style.display === 'none'
                ? '+'
                : '−';
    };

    let drag = false;
    let ox = 0;
    let oy = 0;

    const header =
        document.getElementById('ath');

    header.addEventListener(
        'mousedown',
        e => {

            drag = true;

            const rect =
                p.getBoundingClientRect();

            ox = e.clientX - rect.left;
            oy = e.clientY - rect.top;
        }
    );

    document.addEventListener(
        'mousemove',
        e => {

            if (!drag) return;

            p.style.left =
                (e.clientX - ox) + 'px';

            p.style.top =
                (e.clientY - oy) + 'px';

            p.style.right = 'auto';
        }
    );

    document.addEventListener(
        'mouseup',
        () => {
            drag = false;
        }
    );

    console.log('AWS Toolkit v2 Loaded');

})();
