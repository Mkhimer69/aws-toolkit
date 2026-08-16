(function(){

if(document.getElementById('awsToolkit')){
  document.getElementById('awsToolkit').remove();
  return;
}

const p=document.createElement('div');

p.id='awsToolkit';

p.style=`
position:fixed;
top:100px;
right:20px;
width:280px;
background:#202124;
color:#fff;
border-radius:12px;
box-shadow:0 8px 24px rgba(0,0,0,.35);
z-index:999999;
font:12px Segoe UI;
`;

p.innerHTML=`
<div id="ath"
style="
padding:10px;
background:#0078d4;
border-radius:12px 12px 0 0;
cursor:move;
display:flex;
justify-content:space-between;
font-weight:600">
<span>🚀 AWS Toolkit</span>
<span id="att">−</span>
</div>

<div id="atb" style="padding:12px">

<div id="atc"></div>

<div id="ats"
style="margin:8px 0;color:#8ab4f8">
Ready
</div>

<div
style="
display:grid;
grid-template-columns:1fr 1fr;
gap:6px">

<button id="add">📥 Add</button>
<button id="show">📋 Show</button>

<button id="sel">✅ Select</button>
<button id="des">❌ Deselect</button>

<button id="dchat">💬 Driver Chat</button>
<button id="clr">🧹 Clear</button>

</div>

<div id="atl"
style="
display:none;
margin-top:10px;
max-height:180px;
overflow:auto;
background:#111;
padding:8px;
border-radius:6px">
</div>

</div>
`;

document.body.appendChild(p);

const c=document.getElementById('atc');
const s=document.getElementById('ats');
const l=document.getElementById('atl');

const wait=ms=>new Promise(r=>setTimeout(r,ms));

const get=()=>JSON.parse(
localStorage.awsUserCollector||'[]'
);

const upd=()=>{
  c.textContent=
  'Stored: '+get().length+' emails';
};

const toast=t=>{
  const d=document.createElement('div');

  d.textContent=t;

  d.style=`
  position:fixed;
  bottom:20px;
  right:20px;
  background:#0078d4;
  color:#fff;
  padding:8px 12px;
  border-radius:6px;
  z-index:1000000
  `;

  document.body.appendChild(d);

  setTimeout(()=>d.remove(),1500);
};

upd();

document.getElementById('add').onclick=
async()=>{
try{

let t=await navigator.clipboard.readText();

t=t.replace(/\s+/g,' ')
 .trim()
 .toLowerCase();

const m=t.match(
/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i
);

if(m)t=m[0];

let a=get();

if(!a.includes(t)){
  a.push(t);

  localStorage.awsUserCollector=
  JSON.stringify(a);
}

upd();

toast('Saved');

}catch{
toast('Clipboard failed');
}
};

document.getElementById('show').onclick=()=>{
l.style.display=
l.style.display==='block'
?'none'
:'block';

l.innerHTML=get().join('<br>');
};

document.getElementById('clr').onclick=()=>{
localStorage.removeItem(
'awsUserCollector'
);

upd();

l.innerHTML='';

toast('Cleared');
};

const run=async(mode)=>{

const emails=
get().map(x=>x.trim().toLowerCase());

if(!emails.length)
return toast('No emails');

const search=
document.querySelector(
'input[placeholder="Search users"]'
);

if(!search)
return toast('Search box not found');

const setter=
Object.getOwnPropertyDescriptor(
HTMLInputElement.prototype,
'value'
).set;

for(let i=0;i<emails.length;i++){

s.textContent=
(mode==='s'
?'Selecting '
:'Deselecting ')
+(i+1)+'/'+emails.length;

setter.call(search,emails[i]);

search.dispatchEvent(
new Event('input',{
bubbles:true
})
);

await wait(3000);

const cb=
[...document.querySelectorAll(
'input[type="checkbox"]'
)]
.find(x=>
(x.getAttribute('aria-label')||'')
.toLowerCase()
.includes(emails[i])
);

if(cb){

if(mode==='s'&&!cb.checked)
cb.click();

if(mode==='d'&&cb.checked)
cb.click();
}

}

setter.call(search,'');

search.dispatchEvent(
new Event('input',{bubbles:true})
);

s.textContent='Done';
};

async function driverChat(){

s.textContent=
'Applying Driver Chat...';

document.querySelectorAll(
'button[aria-haspopup="true"]'
)[1]?.click();

await wait(800);

[...document.querySelectorAll('li')]
.find(li=>
li.innerText.trim()===
'Routing profile'
)?.click();

await wait(1500);

const picker=
[...document.querySelectorAll(
'button[aria-haspopup="dialog"]'
)]
.find(b=>
b.textContent.includes(
'Search routing profiles'
)
);

picker?.dispatchEvent(
new MouseEvent(
'mousedown',
{
bubbles:true,
cancelable:true
})
);

await wait(1000);

const option=
[...document.querySelectorAll(
'[role="option"]'
)]
.find(o=>
o.textContent.trim()===
'Driver Chat Focus'
);

['mousedown','mouseup','click']
.forEach(evt=>
option?.dispatchEvent(
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

s.textContent=
'✅ Driver Chat Applied';

toast(
'Driver Chat Applied'
);
}

document.getElementById('sel')
.onclick=()=>run('s');

document.getElementById('des')
.onclick=()=>run('d');

document.getElementById('dchat')
.onclick=driverChat;

document.getElementById('att')
.onclick=()=>{

const b=
document.getElementById('atb');

b.style.display=
b.style.display==='none'
?'block'
:'none';
};

})();
