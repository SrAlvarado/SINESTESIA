(function(){
  const rm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lerp=(a,b,t)=>a+(b-a)*t;

  // ----- portada
  const a=document.getElementById('a'), wrap=a.parentElement;
  const layers=[...a.querySelectorAll('.fig img')];
  const w1=document.getElementById('w1'), w2=document.getElementById('w2');
  let nx=0, ny=0, idle=true, t0=performance.now(), p=0;
  a.addEventListener('pointermove', e=>{ const r=a.getBoundingClientRect(); nx=((e.clientX-r.left)/r.width)*2-1; ny=((e.clientY-r.top)/r.height)*2-1; idle=false; });
  a.addEventListener('pointerleave', ()=>{ idle=true; });
  function onScroll(){
    const r=wrap.getBoundingClientRect(), total=Math.max(1,wrap.offsetHeight-innerHeight);
    p=Math.max(0,Math.min(1,-r.top/total))||0;
    a.classList.toggle('inv', p>0.74);
  }
  addEventListener('scroll',onScroll,{passive:true}); document.addEventListener('scroll',onScroll,{passive:true,capture:true}); addEventListener('resize',onScroll); onScroll();
  (function loop(now){
    onScroll();
    if(idle && !rm){ const t=(now-t0)/1000; nx=lerp(nx,Math.sin(t*.35)*.5,.02); ny=lerp(ny,Math.cos(t*.27)*.3,.02); }
    const k=1-p;
    layers.forEach(l=>{ const d=+l.dataset.depth*k; l.style.transform=`translate(${nx*d}px,${ny*d*0.6}px)`; });
    w1.style.transform=`translate(${-p*60}vw,0)`; w2.style.transform=`translate(${p*60}vw,0)`;
    w1.style.opacity=w2.style.opacity=String(1-Math.max(0,(p-.4)/.5));
    requestAnimationFrame(loop);
  })(t0);

  // ----- definición: luz de color que sigue al cursor
  const def=document.getElementById('def'), cv=document.getElementById('glow'), ctx=cv.getContext('2d');
  const cols=['#7a0b0b','#1b1f3b','#ffb400','#3cff8a','#2f3cff','#bfe3ff','#c9b79c','#e3007d'];
  let gx=-999, gy=-999, tx=-999, ty=-999, hue=0, rings=[];
  function size(){ const r=def.getBoundingClientRect(); cv.width=Math.round(r.width*devicePixelRatio); cv.height=Math.round(r.height*devicePixelRatio); ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0); }
  size(); addEventListener('resize',size);
  def.addEventListener('pointermove',e=>{ const r=def.getBoundingClientRect(); tx=e.clientX-r.left; ty=e.clientY-r.top; if(gx<0){gx=tx;gy=ty;} });
  def.addEventListener('pointerleave',()=>{ tx=-999; ty=-999; });
  def.addEventListener('click',e=>{ const r=def.getBoundingClientRect(); rings.push({x:e.clientX-r.left,y:e.clientY-r.top,r:0,c:cols[Math.floor(hue)%cols.length]}); });
  (function draw(){
    const W=cv.width/devicePixelRatio, H=cv.height/devicePixelRatio;
    ctx.clearRect(0,0,W,H);
    if(tx>-999){ gx=lerp(gx,tx,.12); gy=lerp(gy,ty,.12); hue+=0.012;
      const c=cols[Math.floor(hue)%cols.length], c2=cols[(Math.floor(hue)+1)%cols.length];
      const g=ctx.createRadialGradient(gx,gy,0,gx,gy,Math.min(W,H)*.32);
      g.addColorStop(0,c); g.addColorStop(.55,c2+'66'); g.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
    }
    rings=rings.filter(k=>k.r<Math.max(W,H));
    rings.forEach(k=>{ k.r+= rm?40:7; ctx.strokeStyle=k.c; ctx.globalAlpha=Math.max(0,1-k.r/Math.max(W,H)); ctx.lineWidth=2; ctx.beginPath(); ctx.arc(k.x,k.y,k.r,0,Math.PI*2); ctx.stroke(); ctx.globalAlpha=1; });
    requestAnimationFrame(draw);
  })();

  // ----- audio: previews de 30 s servidos por Apple (API pública de iTunes)
  const ALBUM_ID=1769448072;
  const PREV_FALLBACK={"1": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/65/b0/8c/65b08c07-acfa-f498-33c6-9f25592dcf2b/mzaf_270720526825456712.plus.aac.p.m4a", "2": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/66/ad/45/66ad45ad-c05d-5754-02cd-d63ab2ba2e7d/mzaf_15677818632799157720.plus.aac.p.m4a", "3": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/5e/cd/fb/5ecdfb61-9b96-ac5d-6496-6f36f67b4e59/mzaf_16394877690728518729.plus.aac.p.m4a", "4": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/a7/38/1b/a7381b0e-30ce-88fb-f834-e09e24566169/mzaf_12072973445122679888.plus.aac.p.m4a", "5": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/70/02/ba/7002ba10-4148-ec07-d802-2bcf2af47cf4/mzaf_15131799788038456596.plus.aac.p.m4a", "6": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/82/1f/d7/821fd739-a1c3-87e3-4f4d-2e85f72be664/mzaf_15885481440621389132.plus.aac.p.m4a", "7": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/7a/e8/c6/7ae8c644-2057-36ac-31e3-c9b7e525fabe/mzaf_11559461590708482042.plus.aac.p.m4a", "8": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/44/ad/20/44ad20df-6e03-d932-f751-8f61aa3dbdcb/mzaf_5556152982387665953.plus.aac.p.m4a", "9": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/84/c7/bd/84c7bd94-0e6e-6185-ef2e-f24f3a320871/mzaf_3069125312526562495.plus.aac.p.m4a"};
  const CHORUS={1:11,2:7,3:0,4:7.5,5:11.5,6:0,7:0,8:16.5,9:10}; // segundo del preview en el que entra el estribillo
  let previews=null;
  fetch('https://itunes.apple.com/lookup?id='+ALBUM_ID+'&entity=song&country=es').then(r=>r.json()).then(d=>{ const m={}; (d.results||[]).forEach(x=>{ if(x.wrapperType==='track' && x.previewUrl) m[x.trackNumber]=x.previewUrl; }); previews=Object.keys(m).length?m:PREV_FALLBACK; }).catch(()=>{ previews=PREV_FALLBACK; });
  const audio=new Audio(); audio.crossOrigin='anonymous'; audio.preload='none'; audio.volume=0; audio.loop=true;
  const sndBtn=document.getElementById('snd');
  let soundOn=false, actx=null, analyser=null, fdata=null, current=null, fadeId=0, level=0;
  function fadeTo(target,done){ cancelAnimationFrame(fadeId); const from=audio.volume, t0f=performance.now(), dur=target>from?350:250;
    (function step(now){ const k=Math.max(0,Math.min(1,(now-t0f)/dur)); audio.volume=Math.max(0,Math.min(1,from+(target-from)*k)); if(k<1) fadeId=requestAnimationFrame(step); else if(done) done(); })(t0f); }
  function playTrack(li){ if(!soundOn||!li) return; const n=+li.querySelector('.n').textContent; const url=(previews||PREV_FALLBACK)[n]; if(!url) return;
    if(audio.getAttribute('src')!==url){ audio.setAttribute('src',url); audio.load(); }
    const seek=()=>{ try{ audio.currentTime=CHORUS[n]||0; }catch(e){} };
    if(audio.readyState>=1) seek(); else audio.addEventListener('loadedmetadata',seek,{once:true});
    const pr=audio.play(); if(pr) pr.catch(()=>{}); fadeTo(1); }
  function stopAudio(){ fadeTo(0,()=>audio.pause()); }
  sndBtn.addEventListener('click',()=>{
    soundOn=!soundOn; sndBtn.setAttribute('aria-pressed',String(soundOn)); sndBtn.textContent=soundOn?'Sonido activado':'Activar sonido';
    if(soundOn && !actx){ try{ actx=new (window.AudioContext||window.webkitAudioContext)(); const src=actx.createMediaElementSource(audio); analyser=actx.createAnalyser(); analyser.fftSize=256; analyser.smoothingTimeConstant=.6; src.connect(analyser); analyser.connect(actx.destination); fdata=new Uint8Array(analyser.frequencyBinCount); }catch(e){ actx=null; } }
    if(actx) actx.resume();
    if(soundOn && locked) playTrack(locked); else stopAudio();
  });
  function audioLevel(){ if(!analyser||audio.paused||!soundOn) return -1; analyser.getByteFrequencyData(fdata); let sum=0; for(let i=1;i<=8;i++) sum+=fdata[i]; const v=sum/8/255; level=level*0.6+v*0.4; return level; }

  // ----- canciones
  const tr=document.getElementById('tr'), info=document.getElementById('info'), items=[...document.querySelectorAll('#list li')];
  const base='<div class="num">09</div><div class="name">Blanco</div><p>Pasa por cada canción para ver de qué color suena. El blanco es las nueve a la vez.</p>';
  const aura=document.getElementById('aura'); let curBpm=0, beatT0=0;
  let locked=null;
  function paint(li){
    items.forEach(x=>x.classList.toggle('on',x===li));
    if(+li.dataset.bpm!==curBpm){ curBpm=+li.dataset.bpm; beatT0=performance.now(); }
    tr.style.setProperty('--c',li.dataset.c); tr.style.setProperty('--fg',li.dataset.fg);
    tr.classList.toggle('white', li.dataset.c==='var(--t9)');
    tr.classList.add('has');
    info.innerHTML=`<div class="num">${li.querySelector('.n').textContent}</div><div class="name">${li.querySelector('.t').textContent}</div><p>${li.dataset.d}</p>`+(locked===li?'<p class="lock">■ Seleccionada · clic de nuevo para soltar</p>':'');
  }
  function clear(){ curBpm=0; items.forEach(x=>x.classList.remove('on')); tr.style.setProperty('--c','var(--blanco)'); tr.style.setProperty('--fg','var(--negro)'); tr.classList.remove('white'); tr.classList.remove('has'); info.innerHTML=base; }
  function on(li){ if(locked) return; paint(li); }              // pasar el ratón: solo color
  function off(){ if(locked) return; clear(); }
  function toggle(li){
    if(locked===li){ locked=null; current=null; stopAudio(); items.forEach(x=>x.classList.remove('locked')); clear(); return; }
    if(locked) return;                                         // hay otra seleccionada: hay que soltarla antes
    locked=li; current=li; li.classList.add('locked'); paint(li); playTrack(li);
  }
  items.forEach(li=>{
    li.addEventListener('pointerenter',e=>{ if(e.pointerType!=='touch') on(li); });
    li.addEventListener('focus',()=>on(li));
    li.addEventListener('click',()=>toggle(li));
    li.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); toggle(li); } });
  });
  tr.addEventListener('pointerleave',e=>{ if(e.pointerType!=='touch') off(); });
  (function beat(now){
    if(curBpm){
      const ph=((now-beatT0)*curBpm/60000)%1;
      const lv=audioLevel();
      const b = rm ? 0.5 : (lv>=0 ? Math.min(1,lv*1.6) : Math.pow(1-ph,1.6));
      aura.style.opacity=(0.28+0.32*b).toFixed(3);
      aura.style.setProperty('--b',b.toFixed(3));
    } else { aura.style.opacity='0'; }
    requestAnimationFrame(beat);
  })(0);

  // ----- cerebro: típico vs sinestésico, secuencia en bucle
  const brC=document.getElementById('brain'), bctx=brC.getContext('2d'), brMap=brC.parentElement, steps=[...document.querySelectorAll('#steps div')];
  const AZUL='#2e45b9', NEG='#0a0a0a', BL='#fbfbf9';
  const T=5600; let bt0=performance.now();
  function bsize(){ const r=brMap.getBoundingClientRect(); brC.width=Math.round(r.width*devicePixelRatio); brC.height=Math.round(r.height*devicePixelRatio); bctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0); }
  bsize(); addEventListener('resize',bsize);
  brMap.addEventListener('pointerdown',()=>{ bt0=performance.now(); });
  brMap.addEventListener('pointerenter',()=>{ const ph=(performance.now()-bt0)%T; if(ph>3800) bt0=performance.now(); });
  const ease=(a,b,x)=>Math.max(0,Math.min(1,(x-a)/(b-a)));
  const sm=x=>x*x*(3-2*x);
  function bez(p0,p1,p2,p3,t){ const u=1-t; return [u*u*u*p0[0]+3*u*u*t*p1[0]+3*u*t*t*p2[0]+t*t*t*p3[0], u*u*u*p0[1]+3*u*u*t*p1[1]+3*u*t*t*p2[1]+t*t*t*p3[1]]; }
  function brain(ox,oy,w,h,syn,ph){
    const P=(x,y)=>[ox+x*w,oy+y*h];
    const R=w*0.085, A=P(.46,.60), V=P(.80,.52), E=P(.33,.80);
    const path=()=>{ bctx.beginPath(); bctx.moveTo(...P(.10,.50));
      bctx.bezierCurveTo(...P(.08,.22),...P(.40,.08),...P(.60,.12)); bctx.bezierCurveTo(...P(.82,.14),...P(.96,.30),...P(.94,.50));
      bctx.bezierCurveTo(...P(.93,.62),...P(.88,.70),...P(.80,.74)); bctx.bezierCurveTo(...P(.86,.84),...P(.72,.92),...P(.64,.84));
      bctx.bezierCurveTo(...P(.60,.92),...P(.54,.92),...P(.52,.84)); bctx.bezierCurveTo(...P(.40,.86),...P(.30,.78),...P(.26,.70));
      bctx.bezierCurveTo(...P(.14,.70),...P(.09,.62),...P(.10,.50)); bctx.closePath(); };
    // fases
    const s1=sm(ease(0,700,ph)), s1out=1-sm(ease(1400,2000,ph));           // sonido entra
    const s2=sm(ease(600,1200,ph));                                         // auditiva procesa
    const s3=sm(ease(1900,3300,ph));                                        // viaje por las fibras
    const s4=sm(ease(2900,3600,ph));                                        // V4 se enciende
    const out=1-sm(ease(4700,5400,ph));                                     // todo se apaga
    // cerebro
    path(); bctx.fillStyle='#f1f0ec'; bctx.fill(); bctx.strokeStyle=NEG; bctx.lineWidth=1.4; bctx.stroke();
    bctx.globalAlpha=.12; bctx.lineWidth=1;
    [[.28,.36,.44,.28,.52,.40],[.52,.22,.62,.30,.72,.24],[.22,.56,.30,.50,.36,.56],[.66,.40,.74,.34,.84,.42],[.56,.74,.62,.68,.70,.74]].forEach(c=>{ bctx.beginPath(); bctx.moveTo(...P(c[0],c[1])); bctx.quadraticCurveTo(...P(c[2],c[3]),...P(c[4],c[5])); bctx.stroke(); });
    bctx.globalAlpha=1;
    // oído (fuera del cerebro, abajo a la izquierda del temporal)
    bctx.strokeStyle=NEG; bctx.lineWidth=1.4; bctx.beginPath(); bctx.arc(E[0],E[1],R*0.55,-Math.PI*0.55,Math.PI*0.55); bctx.stroke();
    bctx.beginPath(); bctx.arc(E[0],E[1],R*0.25,-Math.PI*0.5,Math.PI*0.5); bctx.stroke();
    // nota que llega: tres arcos que avanzan hacia el oído
    for(let i=0;i<3;i++){ const k=ease(0,1,s1*1.2-i*0.2); if(k<=0) continue; const x=E[0]-R*2.4+R*1.6*k; bctx.globalAlpha=(0.9-i*0.25)*s1out*out; bctx.beginPath(); bctx.arc(x,E[1],R*0.35+i*R*0.25,-Math.PI*0.4,Math.PI*0.4); bctx.stroke(); }
    bctx.globalAlpha=1;
    // fibras A → V4
    const ctrl=[[P(.56,.42),P(.70,.36)],[P(.60,.50),P(.72,.48)],[P(.62,.62),P(.74,.60)]];
    ctrl.forEach((c,i)=>{
      if(syn){ bctx.strokeStyle=NEG; bctx.globalAlpha=.35+.45*s3*out; bctx.lineWidth=1.6; bctx.setLineDash([]); bctx.beginPath(); bctx.moveTo(...A); bctx.bezierCurveTo(...c[0],...c[1],...V); bctx.stroke(); }
      else { bctx.strokeStyle=NEG; bctx.globalAlpha=.18; bctx.lineWidth=1; bctx.setLineDash([3,6]); bctx.beginPath(); bctx.moveTo(...A); bctx.bezierCurveTo(...c[0],...c[1],...V); bctx.stroke(); bctx.setLineDash([]); }
    });
    bctx.globalAlpha=1;
    // señal viajando
    if(s3>0){ ctrl.forEach((c,i)=>{ const tt=syn? s3 : Math.min(s3,0.22); const fade = syn ? 1 : (1-ease(0.12,0.3,s3)); if(fade<=0) return;
      for(let j=0;j<4;j++){ const tj=Math.max(0,tt-j*0.06); const q=bez(A,c[0],c[1],V,tj); bctx.globalAlpha=(0.9-j*0.2)*fade*out; bctx.fillStyle=syn?AZUL:NEG; bctx.beginPath(); bctx.arc(q[0],q[1],R*0.13,0,Math.PI*2); bctx.fill(); } }); bctx.globalAlpha=1; }
    // V4
    bctx.save(); bctx.beginPath(); bctx.arc(V[0],V[1],R,0,Math.PI*2); bctx.clip();
    if(syn){ bctx.globalAlpha=s4*out; bctx.fillStyle=AZUL; bctx.fillRect(V[0]-R,V[1]-R,2*R,2*R); }
    bctx.restore(); bctx.globalAlpha=1;
    if(syn && s4>0){ const g=bctx.createRadialGradient(V[0],V[1],R*0.8,V[0],V[1],R*2.2); g.addColorStop(0,AZUL+'88'); g.addColorStop(1,AZUL+'00'); bctx.save(); path(); bctx.clip(); bctx.globalAlpha=s4*out; bctx.fillStyle=g; bctx.fillRect(V[0]-R*2.2,V[1]-R*2.2,R*4.4,R*4.4); bctx.restore(); bctx.globalAlpha=1; }
    bctx.beginPath(); bctx.arc(V[0],V[1],R,0,Math.PI*2); bctx.strokeStyle=NEG; bctx.lineWidth=1.4; bctx.stroke();
    // corteza auditiva: se llena de negro al procesar, con anillos
    bctx.beginPath(); bctx.arc(A[0],A[1],R,0,Math.PI*2); bctx.strokeStyle=NEG; bctx.lineWidth=1.4; bctx.stroke();
    bctx.save(); bctx.beginPath(); bctx.arc(A[0],A[1],R,0,Math.PI*2); bctx.clip(); bctx.globalAlpha=s2*out; bctx.fillStyle=NEG; bctx.fillRect(A[0]-R,A[1]-R,2*R,2*R); bctx.restore();
    if(s2>0){ bctx.strokeStyle=BL; bctx.lineWidth=1.4; bctx.globalAlpha=s2*out; bctx.beginPath(); for(let i=0;i<=40;i++){ const x=A[0]-R*0.7+(R*1.4)*i/40; const env=Math.sin(i/40*Math.PI); const amp=R*0.4*env*Math.sin(i*0.9+ph/55); i?bctx.lineTo(x,A[1]+amp):bctx.moveTo(x,A[1]+amp); } bctx.stroke();
      for(let i=1;i<=2;i++){ const k=((ph/700)+i*0.5)%1; bctx.strokeStyle=NEG; bctx.globalAlpha=(1-k)*0.5*s2*out; bctx.beginPath(); bctx.arc(A[0],A[1],R*(1+k*0.9),0,Math.PI*2); bctx.stroke(); } }
    bctx.globalAlpha=1;
    // rótulos
    bctx.fillStyle=NEG; bctx.font='11px JetBrains Mono, Menlo, monospace'; bctx.textAlign='left';
    bctx.fillText('OÍDO', E[0]-R*0.3, E[1]+R*1.25);
    bctx.fillText('CORTEZA AUDITIVA', A[0]-R*1.2, A[1]+R*1.7);
    bctx.textAlign='right'; bctx.fillText('V4 · COLOR', V[0]+R*1.1, V[1]-R*1.5);
    bctx.textAlign='left'; bctx.font='700 12px JetBrains Mono, Menlo, monospace'; bctx.fillText(syn?'CEREBRO SINESTÉSICO':'CEREBRO TÍPICO', ox+w*0.08, oy+h*0.06);
    if(syn && s4>0){ bctx.globalAlpha=s4*out; bctx.fillStyle=AZUL; bctx.font='700 12px JetBrains Mono, Menlo, monospace'; bctx.textAlign='right'; bctx.fillText('VE AZUL', V[0]+R*1.1, V[1]+R*1.9); bctx.globalAlpha=1; }
  }
  (function bdraw(now){
    const W=brC.width/devicePixelRatio, H=brC.height/devicePixelRatio;
    const ph = rm ? 3700 : (now-bt0)%T;
    bctx.clearRect(0,0,W,H);
    if(W>=H*1.2){ const w=W*0.48, h=Math.min(H,w*0.95); const oy=(H-h)/2; brain(0,oy,w,h,false,ph); brain(W-w,oy,w,h,true,ph); }
    else { const h=H*0.48, w=Math.min(W,h/0.95); const ox=(W-w)/2; brain(ox,0,w,h,false,ph); brain(ox,H-h,w,h,true,ph); }
    const st = ph<1500?0 : ph<2600?1 : ph<4800?2 : -1;
    steps.forEach((d,i)=>d.classList.toggle('on',i===st));
    requestAnimationFrame(bdraw);
  })(performance.now());

  // ----- cierre: nueve cartulinas que se queman al bajar
  const end=document.getElementById('end'), endWrap=end.parentElement, burn=document.getElementById('burn'), bx2=burn.getContext('2d');
  const capn=document.getElementById('capn'), capt=document.getElementById('capt');
  const SHEETS=[['#d11c15','Big Checks'],['#4f4c6b','La otra de Juacko'],['#9f5f45','Aiaiai'],['#c47b24','Caramelo'],['#2e45b9','Cosquilleo'],['#bfe3ff','Un añito más'],['#b5b0a4','Manley'],['#e3b0f5','Esos ojitos'],['#fbfbf9','Aquí estoy']];
  const NW=480, NH=270, offc=document.createElement('canvas'); offc.width=NW; offc.height=NH; const octx=offc.getContext('2d');
  // ruido de valor con 4 octavas, una sola vez
  function noiseMap(seed){ const m=new Float32Array(NW*NH); let r=seed; const rnd=()=>{ r=(r*1664525+1013904223)>>>0; return r/4294967296; };
    const oct=[[6,1],[12,.5],[24,.25],[48,.125]]; let tot=0; oct.forEach(o=>tot+=o[1]);
    oct.forEach(([cells,amp])=>{ const gw=cells+1, gh=Math.ceil(cells*NH/NW)+1; const g=new Float32Array(gw*gh); for(let i=0;i<g.length;i++) g[i]=rnd();
      for(let y=0;y<NH;y++) for(let x=0;x<NW;x++){ const fx=x/NW*cells, fy=y/NW*cells; const x0=Math.floor(fx), y0=Math.floor(fy); const tx=fx-x0, ty=fy-y0; const sx=tx*tx*(3-2*tx), sy=ty*ty*(3-2*ty);
        const a=g[y0*gw+x0], b=g[y0*gw+x0+1], c=g[(y0+1)*gw+x0], d=g[(y0+1)*gw+x0+1]; m[y*NW+x]+= (a+(b-a)*sx+(c-a)*sy+(a-b-c+d)*sx*sy)*amp/tot; } });
    return m; }
  const maps=SHEETS.map((_,i)=>noiseMap(1234+i*97));
  const hex=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
  const scols=SHEETS.map(x=>hex(x[0]));
  const img=octx.createImageData(NW,NH), px=img.data;
  function esize(){ const r=end.getBoundingClientRect(); burn.width=Math.round(r.width*devicePixelRatio/2); burn.height=Math.round(r.height*devicePixelRatio/2); }
  esize(); addEventListener('resize',esize);
  // campo radial (0 en el centro, 1 en las esquinas)
  const radial=new Float32Array(NW*NH); for(let y=0;y<NH;y++) for(let x=0;x<NW;x++){ radial[y*NW+x]=Math.hypot((x-NW/2)/(NW/2),(y-NH/2)/(NH/2))/Math.SQRT2; }
  const mode='centro'; const LastKeyRef={v:''};
  const STAG=0.5, NS=8;                      // cada cartulina empieza cuando la anterior va por la mitad
  const SPAN=STAG*(NS-1)+1;                  // unidades de P hasta que arde la última
  const CHAR=[22,12,8], EMBER=[255,96,20];
  function drawBurn(P){
    const key=mode+':'+P.toFixed(3); if(key===LastKeyRef.v) return; LastKeyRef.v=key;
    const q=new Float32Array(NS); for(let i=0;i<NS;i++){ q[i]=Math.max(0,Math.min(1,P-i*STAG))*1.14-0.07; }
    const wN = mode==='centro' ? 0.32 : 1, wR = 1-wN;
    let topShown=NS;
    for(let k=0;k<NW*NH;k++){
      let c=null, i=0;
      for(;i<NS;i++){ const f = wN*maps[i][k] + wR*radial[k]; const qi=q[i];
        if(f>=qi){ // esta cartulina sigue aquí: ¿es borde?
          if(f<qi+0.03) c=CHAR; else if(f<qi+0.048) c=EMBER; else if(f<qi+0.07){ const t=scols[i]; c=[t[0]*0.55,t[1]*0.45,t[2]*0.4]; } else c=scols[i];
          break; } }
      if(c===null){ c=scols[NS]; i=NS; }
      const g=Math.floor((maps[i%NS][k]*53.17%1)*7)-3;
      px[k*4]=c[0]+g; px[k*4+1]=c[1]+g; px[k*4+2]=c[2]+g; px[k*4+3]=255; }
    octx.putImageData(img,0,0);
    bx2.imageSmoothingEnabled=true; bx2.drawImage(offc,0,0,burn.width,burn.height);
    // rótulo: la cartulina más alta que todavía cubre más de la mitad
    let shown=NS; for(let i=0;i<NS;i++){ if(q[i]<0.5){ shown=i; break; } }
    capn.textContent=String(shown+1).padStart(2,'0'); capt.textContent=SHEETS[shown][1];
  }
  function onEnd(){
    const r=endWrap.getBoundingClientRect(), total=Math.max(1,endWrap.offsetHeight-innerHeight);
    const p=Math.max(0,Math.min(1,-r.top/total))||0;
    const P=Math.min(SPAN, p/0.82*SPAN);
    drawBurn(P);
    end.classList.toggle('show', p>0.86);
    document.getElementById('cap2').style.opacity = p>0.86 ? '0' : '1';
  }
  addEventListener('scroll',onEnd,{passive:true}); document.addEventListener('scroll',onEnd,{passive:true,capture:true}); addEventListener('resize',onEnd); onEnd();
})();
