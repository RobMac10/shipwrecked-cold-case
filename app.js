(function(){
const C=window.CC,S=C.sections,KEY='shipwrecked-cold-case-v1';
let st={};try{st=JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){st={}}
const save=()=>localStorage.setItem(KEY,JSON.stringify(st));
const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;');
const fmt=s=>esc(s).replace(/\[CHECK[^\]]*\]/g,m=>'<span class="check">'+m+'</span>');
const P=a=>a.map(x=>'<p>'+fmt(x)+'</p>').join('');
const box=lines=>'<div class="typed">'+lines.map((l,i)=>i==0?'<b>'+fmt(l)+'</b>':fmt(l)).join('\n')+'</div>';
const reopened=C.boxes['CASE FILE: REOPENED'];
const stage=k=>Object.keys(S).find(h=>h.startsWith('Stage '+k));
const s6=S[stage(6)].p, closing=s6[s6.length-1], s6p=s6.slice(0,-1);
let uid=0;
function txt(id,label,multi){const v=esc(st[id]||'');const i='f'+(uid++);
 return '<label for="'+i+'">'+esc(label)+'</label>'+(multi?'<textarea id="'+i+'" data-k="'+id+'">'+v+'</textarea>':'<input type="text" id="'+i+'" data-k="'+id+'" value="'+v.replace(/"/g,'&quot;')+'">');}
function chk(id,label){return '<label><input type="checkbox" data-k="'+id+'"'+(st[id]?' checked':'')+'> '+esc(label)+'</label>';}
function rad(name,val,label){return '<label><input type="radio" name="'+name+'" value="'+esc(val)+'" data-k="'+name+'"'+(st[name]===val?' checked':'')+'> '+esc(label)+'</label>';}
const screens={
file:()=>'<h2>Case file reopened</h2>'+box(reopened)+P(S._intro.p.slice(0,5))+'<h3>Big question</h3>'+P(S['Big question'].p)+'<h3>How this case works</h3>'+P(S['How this case works'].p)+'<p class="note">Evidence to set side by side: '+fmt(S._intro.p[5].split(': ').slice(1).join(': '))+'</p>',
witnesses:()=>{const w=st._w||'1';return '<h2>Witness files</h2><p style="text-align:center">Open one witness at a time, or flip between them to compare entries.</p><div class="wtabs" role="group" aria-label="Choose a witness">'+
 [['1','Jo'],['2','Powell'],['3','The Scout']].map(([n,l])=>'<button class="btn'+(w==n?' dark':'')+'" data-w="'+n+'" aria-pressed="'+(w==n)+'">Witness '+n+': '+l+'</button>').join('')+'</div>'+
 box(C.boxes['WITNESS FILE '+w])+C.entries.filter(e=>e.tag.startsWith('Entry '+w+'.')).map(e=>'<div class="tag">'+fmt(e.tag)+'</div>'+P(e.text)).join('')+
 '<div class="wtabs noprint" style="margin-top:14px"><button class="btn" data-w="'+(w=='1'?'3':+w-1)+'">&larr; Previous witness</button><button class="btn" data-w="'+(w=='3'?'1':+w+1)+'">Next witness &rarr;</button></div>';},
sources:()=>'<h2>Sources</h2>'+['Source A · newspaper voice','Source B · officer voice'].map(h=>'<h3>'+esc(h)+'</h3><span class="label">Classroom extract · written in the language of the time</span><p><em>'+fmt(S[h].p[0])+'</em></p><blockquote>'+fmt(S[h].p[1])+'</blockquote>').join('')+'<p>'+fmt(S['How this case works'].p[0])+'</p>',
s1:()=>{const h=stage(1),t=S[h].t;return '<h2>'+esc(h)+'</h2>'+P(S[h].p)+t.slice(1).map((r,i)=>'<div class="row"><div class="q">Source '+esc(r[0])+'</div>'+txt('s1_'+i+'_sp',t[0][1])+txt('s1_'+i+'_nh',t[0][2])+'</div>').join('');},
s2:()=>{const h=stage(2),t=S[h].t;return '<h2>'+esc(h)+'</h2>'+P(S[h].p)+t.slice(1).map((r,i)=>'<div class="row"><div class="q">“'+esc(r[0])+'”</div>'+txt('s2_'+i+'_f',t[0][1])+txt('s2_'+i+'_q',t[0][2])+'</div>').join('');},
s3:()=>{const h=stage(3),t=S[h].t;return '<h2>'+esc(h)+'</h2>'+P(S[h].p)+t.slice(1).map((r,i)=>'<div class="row"><div class="q">'+esc(r[0])+'</div><div class="ticks">'+chk('s3_'+i+'_a',t[0][1])+chk('s3_'+i+'_b',t[0][2])+'</div>'+txt('s3_'+i+'_w',t[0][3])+'</div>').join('');},
s4:()=>{const h=stage(4),t=S[h].t;return '<h2>'+esc(h)+'</h2>'+P(S[h].p)+t.slice(1).map((r,i)=>'<div class="row"><div class="q">'+esc(r[0])+'</div>'+['a','b'].map((s,j)=>'<fieldset class="ticks" style="border:0;padding:0;margin:4px 0"><legend style="font-size:14px">'+esc(t[0][j+1])+'</legend>'+rad('s4_'+i+'_'+s,'pass','Pass')+rad('s4_'+i+'_'+s,'fail','Fail')+'</fieldset>').join('')+txt('s4_'+i+'_r',t[0][3])+'</div>').join('');},
s5:()=>{const h=stage(5),p=S[h].p;const starts=p[1].replace(/^Start with one of these openings: /,'').split('… ').map((s,i,a)=>i<a.length-1?s+'…':s);
 const sure=p[2].replace('How sure are you? ','').split(/\.\s*/).filter(Boolean);
 return '<h2>'+esc(h)+'</h2>'+P([p[0]])+'<p>Start with one of these openings. Tap one to add it to your verdict.</p><div class="chips">'+starts.map(s=>'<button class="btn" data-ins="'+esc(s).replace(/"/g,'&quot;')+'">'+esc(s)+'</button>').join('')+'</div>'+txt('s5_v','My verdict',true)+
 '<fieldset class="sure" style="border:1px solid var(--rule);margin-top:10px"><legend>How sure are you?</legend>'+sure.map(x=>rad('s5_sure',x.split(/\s*—\s*/)[0],x+'.')).join('')+'</fieldset>';},
s6:()=>{const h=stage(6);return '<h2>'+esc(h)+'</h2>'+P(s6p)+txt('s6_src','The sentence from Source A')+txt('s6_scout','As the Scout might tell it',true)+txt('s6_jo','As Jo might tell it from Calliope',true)+txt('s6_change','What changes when the speaker changes?',true);},
finding:()=>'<h2>Finding</h2><div class="typed"><b>CASE FILE: FINDING</b>'+'</div>'+txt('f_status','Case status:')+txt('f_reason','Reason, from the evidence:',true)+'<p style="margin-top:14px">'+fmt(closing)+'</p><p class="noprint"><button class="btn dark" id="printbtn">Print or save my case file</button></p>'
};
const order=[['file','Case file'],['witnesses','Witnesses'],['sources','Sources'],['s1','Stage 1'],['s2','Stage 2'],['s3','Stage 3'],['s4','Stage 4'],['s5','Stage 5'],['s6','Stage 6'],['finding','Finding']];
const nav=document.getElementById('nav'),main=document.getElementById('main');
function go(k,push){if(!screens[k])k='file';uid=0;main.innerHTML=screens[k]();
 nav.innerHTML=order.map(([id,l])=>'<button data-go="'+id+'" aria-current="'+(id==k)+'">'+l+'</button>').join('');
 const i=order.findIndex(o=>o[0]==k);
 main.insertAdjacentHTML('beforeend','<div class="wtabs noprint" style="margin-top:18px">'+(i>0?'<button class="btn" data-go="'+order[i-1][0]+'">&larr; '+order[i-1][1]+'</button>':'')+(i<order.length-1?'<button class="btn dark" data-go="'+order[i+1][0]+'">'+order[i+1][1]+' &rarr;</button>':'')+'</div>');
 if(push!==false)history.replaceState(null,'','#'+k);}
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
 if(b.dataset.go){go(b.dataset.go);window.scrollTo(0,0);}
 else if(b.dataset.w){st._w=b.dataset.w;save();go('witnesses');}
 else if(b.dataset.ins){const ta=main.querySelector('textarea[data-k="s5_v"]');ta.value=(ta.value?ta.value.trimEnd()+' ':'')+b.dataset.ins+' ';st.s5_v=ta.value;save();ta.focus();}
 else if(b.id=='printbtn'){buildPrint();window.print();}
 else if(b.id=='clear'){if(confirm('Clear all your answers from this browser?')){localStorage.removeItem(KEY);st={};go(location.hash.slice(1)||'file');}}});
document.addEventListener('input',e=>{const k=e.target.dataset&&e.target.dataset.k;if(!k)return;
 st[k]=e.target.type=='checkbox'?e.target.checked:e.target.value;save();});
function buildPrint(){const g=k=>esc(st[k]||'—');let h='<h1>CASE FILE: FINDING</h1><p>Mount Larcombe station, Port Curtis district · Christmas 1855 · Investigator: me</p>';
 h+='<h4>Case status</h4><p>'+g('f_status')+'</p><h4>Reason, from the evidence</h4><p>'+g('f_reason').replace(/\n/g,'<br>')+'</p>';
 const t3=S[stage(3)].t.slice(1);const ticked=t3.map((r,i)=>(st['s3_'+i+'_a']||st['s3_'+i+'_b'])?esc(r[0])+' (A '+(st['s3_'+i+'_a']?'✓':'–')+', B '+(st['s3_'+i+'_b']?'✓':'–')+')':null).filter(Boolean);
 h+='<h4>Stage 3 ticks</h4><p>'+(ticked.join('; ')||'—')+'</p>';
 const t4=S[stage(4)].t.slice(1);h+='<h4>Stage 4 tests</h4>'+t4.map((r,i)=>'<p>'+esc(r[0])+' A: '+g('s4_'+i+'_a')+', B: '+g('s4_'+i+'_b')+'</p>').join('');
 h+='<h4>Verdict</h4><p>'+g('s5_v').replace(/\n/g,'<br>')+'</p><p>How sure: '+g('s5_sure')+'</p>';
 document.getElementById('print').innerHTML=h;}
window.addEventListener('beforeprint',buildPrint);
const RD=S['Real documents to compare'].p,TN=S['Teacher note'].p;
document.getElementById('foot').innerHTML='<p><strong>Your answers are saved only in this browser. Nothing is sent anywhere.</strong> <button class="btn" id="clear">Clear my answers</button></p><h3>Real documents to compare</h3>'+P(RD)+'<h3>Teacher note</h3>'+P(TN)+'<p><a href="https://robmac10.github.io/shipwrecked-situations-vacant/">Situations Vacant: the characters’ jobs</a> · <a href="https://robmac10.github.io/shipwrecked-on-ancient-ground-reader/">Read the novel</a></p>';
go(location.hash.slice(1)||'file',false);
})();
