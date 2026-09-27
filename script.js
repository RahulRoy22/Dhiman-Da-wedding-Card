const weddingDate = new Date('2026-10-16T18:00:00+05:30');
const $ = s => document.querySelector(s);

// Entrance interaction
$('#openBtn').addEventListener('click', () => {
  document.body.animate([{opacity:.75},{opacity:1}], {duration:500});
  $('#story').scrollIntoView({behavior:'smooth'});
  burst(window.innerWidth/2, window.innerHeight*.5, 18);
});

// Flip invitation
const miniCard = $('#miniCard');
let cardFlipping = false;
function flipCard(e) {
  if (e) {
    if (e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
  }
  if (cardFlipping) return;
  cardFlipping = true;
  miniCard.classList.toggle('flipped');
  setTimeout(() => { cardFlipping = false; }, 400);
}
miniCard.addEventListener('click', flipCard);
miniCard.addEventListener('keydown', flipCard);

// Countdown
function tick(){
  const diff = weddingDate - Date.now();
  if(diff <= 0){ ['days','hours','minutes','seconds'].forEach(id=>$('#'+id).textContent='00'); return; }
  const d=Math.floor(diff/86400000), h=Math.floor(diff/3600000)%24, m=Math.floor(diff/60000)%60, s=Math.floor(diff/1000)%60;
  $('#days').textContent=String(d).padStart(2,'0'); $('#hours').textContent=String(h).padStart(2,'0'); $('#minutes').textContent=String(m).padStart(2,'0'); $('#seconds').textContent=String(s).padStart(2,'0');
}
tick(); setInterval(tick,1000);

// Scroll reveal
const observer = new IntersectionObserver(entries => entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}), {threshold:.14});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

// Flower garden + celebration particles
const garden = $('#garden');
garden.addEventListener('click', e => {
  const r=garden.getBoundingClientRect();
  burst(e.clientX-r.left,e.clientY-r.top,12,true);
  showToast();
});
function burst(x,y,n=12,inside=false){
  const root=inside?garden:document.body;
  for(let i=0;i<n;i++){
    const p=document.createElement('span'); p.textContent=['✦','·','✿','❋'][Math.floor(Math.random()*4)]; p.className='burst';
    p.style.left=(inside?x:Math.random()*innerWidth)+'px'; p.style.top=(inside?y:Math.random()*innerHeight)+'px';
    p.style.setProperty('--x',(Math.random()-.5)*180+'px'); p.style.setProperty('--y',(Math.random()-.5)*180+'px');
    root.appendChild(p); setTimeout(()=>p.remove(),900);
  }
}
const burstStyle=document.createElement('style'); burstStyle.textContent='.burst{position:absolute;color:#c89d42;font-size:18px;z-index:100;pointer-events:none;animation:burst .9s ease-out forwards}@keyframes burst{to{transform:translate(var(--x),var(--y)) scale(.2) rotate(180deg);opacity:0}}'; document.head.appendChild(burstStyle);

function showToast(){const t=$('#toast');t.classList.add('show');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>t.classList.remove('show'),1500)}

// Falling petals
function petal(){const p=document.createElement('span');p.className='petal';p.textContent=Math.random()>.5?'❀':'✦';p.style.left=Math.random()*100+'vw';p.style.setProperty('--drift',(Math.random()*180-90)+'px');p.style.animationDuration=(6+Math.random()*7)+'s';p.style.fontSize=(10+Math.random()*13)+'px';$('.petals').appendChild(p);setTimeout(()=>p.remove(),14000)}
setInterval(petal,900);

// Tiny ambient chime using Web Audio; only starts after a user gesture.
let audioCtx=null, soundOn=false, timer=null;
function chime(){if(!soundOn)return; const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type='sine';o.frequency.value=392;g.gain.setValueAtTime(.0001,audioCtx.currentTime);g.gain.exponentialRampToValueAtTime(.025,audioCtx.currentTime+.02);g.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+.8);o.connect(g).connect(audioCtx.destination);o.start();o.stop(audioCtx.currentTime+.85)}
$('#soundBtn').addEventListener('click',()=>{if(!audioCtx)audioCtx=new (window.AudioContext||window.webkitAudioContext)();soundOn=!soundOn;$('#soundBtn').textContent=soundOn?'♫':'♪';if(soundOn){chime();timer=setInterval(chime,6000)}else clearInterval(timer)});
