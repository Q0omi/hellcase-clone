/* Original synthesized effects. No audio downloads or network requests. */
const sounds = (() => {
  let context, master, enabled = true;
  try { enabled = localStorage.getItem('embercase-sound') !== 'off'; } catch {}
  function unlock() {
    if (!enabled) return;
    try {
      if (!context) { const Audio = window.AudioContext || window.webkitAudioContext; if (!Audio) return; context = new Audio(); master = context.createGain(); master.gain.value = .2; master.connect(context.destination); }
      if (context.state === 'suspended') context.resume().catch(() => {});
    } catch {}
  }
  function tone(freq, delay=0, duration=.16, type='sine', volume=.4, end=freq) {
    if (!enabled || !context || context.state !== 'running') return;
    const start=context.currentTime+delay, oscillator=context.createOscillator(), gain=context.createGain();
    oscillator.type=type; oscillator.frequency.setValueAtTime(freq,start); oscillator.frequency.exponentialRampToValueAtTime(Math.max(end,20),start+duration);
    gain.gain.setValueAtTime(.0001,start); gain.gain.exponentialRampToValueAtTime(volume,start+.009); gain.gain.exponentialRampToValueAtTime(.0001,start+duration);
    oscillator.connect(gain); gain.connect(master); oscillator.start(start); oscillator.stop(start+duration+.02);
    oscillator.onended=()=>{oscillator.disconnect();gain.disconnect();};
  }
  function tick(){tone(850,0,.035,'triangle',.18,500);}
  function success(){[392,523.25,659.25,783.99].forEach((n,i)=>tone(n,i*.1,.32,'sine',.38));tone(196,0,.45,'triangle',.2);}
  function fail(){tone(220,0,.32,'triangle',.3,90);tone(145,.12,.35,'sine',.25,60);}
  function drop(skin,delay=0){
    const patterns={'Classified':[523,659],'Covert':[523,659,784],'Contraband':[440,554,659,880,1108],'Rare Special':[587,740,880,1175,1480]};
    (patterns[skin.rarity]||[440,554]).forEach((n,i)=>tone(n,delay+i*.085,.3,'sine',.32));
    if(skin.rarity==='Rare Special'||skin.rarity==='Contraband')tone(147,delay,.65,'triangle',.22);
  }
  function update(){const b=document.getElementById('sound-toggle');if(b){b.textContent=enabled?'SFX ON':'SFX OFF';b.setAttribute('aria-pressed',String(enabled));b.setAttribute('aria-label',enabled?'Mute sound effects':'Enable sound effects');}}
  function toggle(){enabled=!enabled;if(master)master.gain.value=enabled?.2:0;try{localStorage.setItem('embercase-sound',enabled?'on':'off');}catch{}if(enabled){unlock();tone(660);}update();}
  return {unlock,tick,success,fail,drop,toggle,update};
})();
