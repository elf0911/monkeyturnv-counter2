const VERSION="mobile-v3";
const STORAGE_KEY="monkeyturnv-counter-clean-v1";
const SETS=[1,2,4,5,6];

const DISPLAY=[
 ["games","総ゲーム数",false],["normalGames","通常ゲーム数",false],["atGames","ATゲーム数",false],["atHit","AT初当たり",false],
 ["fiveCoin","5枚役",false],["rare","レア小役",false],["direct","AT直撃",false],["rival","ライバルモード",false],
 ["chargeItem","激走チャージ中",false],["chargeVoice","激走チャージ終了時セリフ",false],["endingVoice","エンディング中サブ液晶",false],
 ["medal","SGメダル",false],["trophy","トロフィー",false],["ticket","舟券",false]
];
const SINGLE={
 games:{label:"総ゲーム数",unit:"G",game:true},normalGames:{label:"通常ゲーム数",unit:"G",game:true},atGames:{label:"ATゲーム数",unit:"G",game:true},
 atHit:{label:"AT初当たり",unit:"回",denom:"normalGames"},fiveCoin:{label:"5枚役",unit:"回",denom:"normalGames"}
};
const GROUPS=["rare","direct","rival","chargeItem","chargeVoice","endingVoice","medal","trophy","ticket"];
const JUDGE_GROUPS=["direct","rival","chargeItem","chargeVoice","medal","trophy","ticket"];
const GDEF={
 rare:{label:"レア小役",children:[["weakCherry","弱チェリー"],["strongCherry","強チェリー"],["weakChance","弱チャンス目"],["strongChance","強チャンス目"],["boat","ボート"]],rate:"normalGames"},
 direct:{label:"AT直撃",children:[["directStrongCherry","強チェリー直撃"],["directStrongChance","強チャンス目直撃"],["directOther","その他直撃"],["directUnknown","契機不明"]]},
 rival:{label:"ライバルモード",children:[["rivalEnoki","榎木"],["rivalGamo","蒲生"],["rivalHamaoka","浜岡"]],percent:"atHit"},
 chargeItem:{label:"激走チャージ中",paired:true,children:[["chargeWeakCherry","弱チェリー"],["chargeStrongCherry","強チェリー"],["chargeWeakChance","弱チャンス目"],["chargeStrongChance","強チャンス目"],["chargeBoat","ボート"]]},
 chargeVoice:{label:"激走チャージ終了時セリフ",children:[["voiceCalm","落ち着くんだ"],["voiceSign","この気配は"],["voiceOtsukare","おつかれ"],["voiceTeio","これが艇王と…"]]},
 endingVoice:{label:"エンディング中サブ液晶",children:[["endIkeryze","波多野　いけるぜ",""],["endIkuyo","青島　いっくよ","blue"],["endIiKanji","波多野　いい感じ","blue"],["endYarujanai","アリサ　やるじゃない","green"],["endOtsukare","榎木　おつかれ","red"],["endTeio","榎木　これが艇王と…","red"],["endKitakita","青島　きたきたきた","red"],["endOmedeto","澄　おめでとう","red"]]},
 medal:{label:"SGメダル",children:[["medalBlue","青"],["medalYellow","黄"],["medalBlack","黒"],["medalRainbow","虹"]]},
 trophy:{label:"トロフィー",children:[["trophyBronze","銅"],["trophyGold","金"],["trophyKerot","ケロット柄"],["trophyRainbow","虹"]]},
 ticket:{label:"舟券",children:[["ticketSilver","銀"],["ticketGold","金"],["ticketRainbow","虹"]]}
};
const PUB={
 atHit:{label:"AT初当たり",values:{1:299.8,2:295.5,4:258.8,5:235.7,6:222.9}},
 fiveCoin:{label:"5枚役",values:{1:38.15,2:36.86,4:30.27,5:24.51,6:22.53}},
 rival:{enoki:{1:7.8,2:8.2,4:9.4,5:10.5,6:10.9},gamo:{1:7.8,2:8.6,4:10.9,5:14.1,6:15.6},hamaoka:{1:7.8,2:8.2,4:9.4,5:10.5,6:10.9}},
 chargeItem:{boat:{1:25.0,2:26.2,4:32.8,5:39.1,6:43.0},weakCherry:{1:25.0,2:26.2,4:32.8,5:39.1,6:43.0},weakChance:{1:31.3,2:32.0,4:37.5,5:40.6,6:46.9},strongChance:{1:50.0,2:50.8,4:58.6,5:62.5,6:66.4}},
 chargeVoice:{calm:{1:50.0,2:40.0,4:40.0,5:70.0,6:40.0},sign:{1:50.0,2:60.0,4:60.0,5:30.0,6:60.0},otsukare:{1:0,2:.75,4:.75,5:0,6:.75},teio:{1:0,2:0,4:.25,5:.50,6:.25}}
};
const RARE_DENOM={strongCherry:569.9,strongChance:448.9};

const DEF={data:{games:0,normalGames:0,atGames:0,atHit:0,fiveCoin:0},visible:{},judgeUse:{},showImpact:false,fiveCoinBase:"games",step:{plus:500,minus:100},open:{},lastGames:["games","normalGames"]};
for(const [k] of DISPLAY){DEF.visible[k]=["games","normalGames","atGames","atHit"].includes(k); DEF.judgeUse[k]=k==="atHit";}
DEF.judgeUse.games=false; DEF.judgeUse.rare=false;
for(const [g,d] of Object.entries(GDEF)){if(d.paired){for(const [k] of d.children){DEF.data[k+"Hit"]=0;DEF.data[k+"Item"]=0}}else{for(const [k] of d.children)DEF.data[k]=0}}
let S=load(); let hold=null; let lastTouch=0;
document.addEventListener("touchend",e=>{let n=Date.now(); if(n-lastTouch<300)e.preventDefault(); lastTouch=n},{passive:false});
document.addEventListener("DOMContentLoaded",()=>{bind();S.open={};save();render()});
function $(id){return document.getElementById(id)}
function load(){try{return normalize(merge(structuredClone(DEF),JSON.parse(localStorage.getItem(STORAGE_KEY))||{}))}catch{return structuredClone(DEF)}}
function normalize(s){
 if(s.data.directStrong!==undefined){s.data.directStrongCherry=(s.data.directStrongCherry||0)+(s.data.directStrong||0); delete s.data.directStrong}
 if(s.data.directWeak!==undefined){s.data.directOther=(s.data.directOther||0)+(s.data.directWeak||0); delete s.data.directWeak}
 if(s.data.directWeakChance!==undefined){s.data.directOther=(s.data.directOther||0)+(s.data.directWeakChance||0); delete s.data.directWeakChance}
 if(s.data.ticketSix!==undefined){s.data.ticketRainbow=(s.data.ticketRainbow||0)+(s.data.ticketSix||0); delete s.data.ticketSix}
 if(s.data.ticketOver4!==undefined){s.data.ticketGold=(s.data.ticketGold||0)+(s.data.ticketOver4||0); delete s.data.ticketOver4}
 if(s.data.ticketOver5!==undefined){delete s.data.ticketOver5}
 s.judgeUse.games=false; s.judgeUse.rare=false;
 return s;
}
function merge(a,b){for(const k in b){if(b[k]&&typeof b[k]==="object"&&!Array.isArray(b[k])&&a[k]&&typeof a[k]==="object")merge(a[k],b[k]);else a[k]=b[k]}return a}
function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify(S))}
function bind(){
 $("settingsBtn").onclick=()=>screen("settings"); $("judgeBtn").onclick=()=>screen("judge");
 document.querySelectorAll(".back").forEach(b=>b.onclick=()=>screen(b.dataset.to));
 $("resetBtn").onclick=reset; $("useAll").onclick=()=>{for(const k in S.judgeUse)if(S.visible[k]&&k!=="games"&&k!=="rare")S.judgeUse[k]=true;save();render()};
 $("useNone").onclick=()=>{for(const k in S.judgeUse)S.judgeUse[k]=false;save();render()};
 $("impactToggle").onchange=e=>{S.showImpact=e.target.checked;save();render()};
 $("plusStep").onchange=e=>{S.step.plus=+e.target.value;save();render()};
 $("minusStep").onchange=e=>{S.step.minus=+e.target.value;save();render()};
}
function screen(id){document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));$(id).classList.add("active");render()}
function render(){home();settings();judge()}
function home(){let h="";["games","normalGames","atGames","atHit","fiveCoin"].forEach(k=>{if(S.visible[k])h+=row(k,SINGLE[k])});GROUPS.forEach(g=>{if(S.visible[g])h+=group(g)});$("homeList").innerHTML=h;dyn($("homeList"))}
function row(k,it,sub=false){let v=S.data[k]||0, denomKey=(k==="fiveCoin"?S.fiveCoinBase:it.denom), r=denomKey?rate(v,S.data[denomKey]):"", cls=sub?"subrow":"row";let btn=it.game?`<button class="btn gamebtn" data-c="${k}" data-d="${S.step.plus}">＋${S.step.plus}</button><button class="btn gamebtn" data-c="${k}" data-d="-${S.step.minus}">－${S.step.minus}</button>`:`<button class="btn" data-c="${k}" data-d="1">＋</button><button class="btn" data-c="${k}" data-d="-1">－</button>`;return `<div class="${cls}" data-hold="${k}"><div class="top"><div class="name">${it.label}</div><div class="value">${v}${it.unit||"回"}</div>${btn}</div>${r?`<div class="rate">${r}</div>`:""}</div>`}
function group(g){let d=GDEF[g], open=S.open[g]?"open":"", total=gtotal(g), body=""; if(d.paired){body=d.children.map(([k,l])=>paired(k,l)).join("")}else{body=d.children.map(([k,l,c])=>{let sub=info(g,k), cc=c?` ${c}`:"";return `<div class="subrow" data-hold="${k}"><div class="top"><div class="name${cc}">${l}</div><div class="value">${S.data[k]||0}回</div><button class="btn" data-c="${k}" data-d="1">＋</button><button class="btn" data-c="${k}" data-d="-1">－</button></div>${sub?`<div class="subnote">${sub}</div>`:""}</div>`}).join("")}return `<div class="group ${open}"><button class="ghead" data-t="${g}"><span class="chev">${S.open[g]?"▼":"▶"}</span><span class="groupTitle">${d.label}</span><span class="gtotal">${total?total+"回":""}</span></button><div class="gbody">${body}</div></div>`}
function paired(k,l){let h=S.data[k+"Hit"]||0,i=S.data[k+"Item"]||0,p=h?trim(i/h*100,1)+"%":"-";return `<div class="subrow"><div class="name">${l}</div><div class="top" data-hold="${k}Hit"><div class="name subnote">成立</div><div class="value">${h}回</div><button class="btn" data-c="${k}Hit" data-d="1">＋</button><button class="btn" data-c="${k}Hit" data-d="-1">－</button></div><div class="top" data-hold="${k}Item"><div class="name subnote">獲得</div><div class="value">${i}回</div><button class="btn" data-c="${k}Item" data-d="1">＋</button><button class="btn" data-c="${k}Item" data-d="-1">－</button></div><div class="subnote">${p}</div></div>`}
function info(g,k){if(g==="rare")return rate(S.data[k]||0,S.data.normalGames);if(g==="rival")return pct(S.data[k]||0,S.data.atHit);if(g==="chargeVoice"&&(k==="voiceCalm"||k==="voiceSign")){let a=S.data.voiceCalm||0,b=S.data.voiceSign||0,t=a+b;return t?`${a}:${b} / ${trim((S.data[k]||0)/t*100,1)}%`:"-"}return ""}
function dyn(root){root.querySelectorAll("[data-c]").forEach(b=>b.onclick=e=>{e.stopPropagation();chg(b.dataset.c,+b.dataset.d)});root.querySelectorAll("[data-t]").forEach(b=>b.onclick=()=>{S.open[b.dataset.t]=!S.open[b.dataset.t];save();render()});root.querySelectorAll("[data-hold]").forEach(el=>{["touchend","touchcancel","mouseup","mouseleave"].forEach(ev=>el.addEventListener(ev,cancel));el.addEventListener("touchstart",e=>{if(e.target.tagName==="BUTTON")return;start(el.dataset.hold)},{passive:true});el.addEventListener("mousedown",e=>{if(e.target.tagName==="BUTTON")return;start(el.dataset.hold)});el.addEventListener("contextmenu",e=>e.preventDefault())})}
function chg(k,d){S.data[k]=Math.max(0,(S.data[k]||0)+d);gameRel(k);save();render()}
function start(k){cancel();hold=setTimeout(()=>promptVal(k),550)}
function cancel(){if(hold)clearTimeout(hold);hold=null}
function promptVal(k){let v=prompt(`${label(k)}を入力`,String(S.data[k]||0));if(v===null)return;let n=Math.max(0,Math.floor(+v));if(Number.isFinite(n)){S.data[k]=n;gameRel(k);save();render()}}
function label(k){if(SINGLE[k])return SINGLE[k].label;for(const d of Object.values(GDEF)){if(d.paired){for(const [b,l] of d.children){if(k===b+"Hit")return l+" 成立";if(k===b+"Item")return l+" 獲得"}}else for(const [x,l] of d.children)if(x===k)return l}return k}
function gameRel(k){if(!["games","normalGames","atGames"].includes(k))return;S.lastGames=S.lastGames.filter(x=>x!==k);S.lastGames.push(k);if(S.lastGames.length>2)S.lastGames.shift();let [a,b]=S.lastGames,g=S.data.games||0,n=S.data.normalGames||0,at=S.data.atGames||0;if(!a||!b)return;if(a!=="games"&&b!=="games")S.data.games=n+at;if(a!=="normalGames"&&b!=="normalGames")S.data.normalGames=Math.max(0,g-at);if(a!=="atGames"&&b!=="atGames")S.data.atGames=Math.max(0,g-n)}
function settings(){let h=DISPLAY.map(([k,l,f])=>`<label class="setrow"><span>${l}</span><input type="checkbox" data-v="${k}" ${S.visible[k]?"checked":""} ${f?"disabled":""}></label>`).join("");h+=`<div class="setrow"><span>5枚役の分母</span><div class="radioLine"><label><input type="radio" name="fiveBase" value="games" ${S.fiveCoinBase==="games"?"checked":""}>総G</label><label><input type="radio" name="fiveBase" value="normalGames" ${S.fiveCoinBase==="normalGames"?"checked":""}>通常G</label></div></div>`;$("settingList").innerHTML=h;$("settingList").querySelectorAll("[data-v]").forEach(c=>c.onchange=()=>{let k=c.dataset.v;S.visible[k]=c.checked;if(!c.checked)S.judgeUse[k]=false;save();render()});$("settingList").querySelectorAll("input[name=fiveBase]").forEach(r=>r.onchange=()=>{S.fiveCoinBase=r.value;save();render()});let opts=[50,100,150,200,250,300,500,1000].map(n=>`<option value="${n}">${n}</option>`).join("");$("plusStep").innerHTML=opts;$("minusStep").innerHTML=opts;$("plusStep").value=S.step.plus;$("minusStep").value=S.step.minus}
function judge(){$("impactToggle").checked=!!S.showImpact;bars();signals();jitems()}
function probs(){let sc=Object.fromEntries(SETS.map(s=>[s,1]));
 if(S.visible.atHit&&S.judgeUse.atHit)pois(sc,S.data.atHit||0,S.data.normalGames||0,PUB.atHit.values,.45);
 if(S.visible.fiveCoin&&S.judgeUse.fiveCoin)pois(sc,S.data.fiveCoin||0,S.data[S.fiveCoinBase]||0,PUB.fiveCoin.values,.55);
 if(S.visible.direct&&S.judgeUse.direct)applyDirect(sc);
 if(S.visible.rival&&S.judgeUse.rival)applyRival(sc);
 if(S.visible.chargeItem&&S.judgeUse.chargeItem)applyChargeItem(sc);
 if(S.visible.chargeVoice&&S.judgeUse.chargeVoice)applyChargeVoice(sc);
 let allow=allowed();let hasRestrict=allow.length<SETS.length;SETS.forEach(s=>{if(!allow.includes(s))sc[s]=0});let sum=Object.values(sc).reduce((a,b)=>a+b,0)||1;let raw=Object.fromEntries(SETS.map(s=>[s,sc[s]/sum*100]));return hasRestrict?round(raw):floorRound(raw,1)}
function pois(sc,count,den,denomVals,w){if(!count||!den)return;for(const s of SETS){let expected=den/denomVals[s];let diff=Math.abs(count-expected)/Math.sqrt(expected+1);sc[s]*=Math.exp(-diff*w)}}
function applyRateScore(sc,count,base,rateVals,w){if(!count||!base)return;for(const s of SETS){let exp=base*(rateVals[s]/100);let diff=Math.abs(count-exp)/Math.sqrt(exp+1);sc[s]*=Math.exp(-diff*w)}}
function applyDirect(sc){
 const scCount=S.data.directStrongCherry||0, schCount=S.data.directStrongChance||0, other=S.data.directOther||0, unknown=S.data.directUnknown||0;
 const scBase=directBase("strongCherry"), schBase=directBase("strongChance");
 const strongRate={1:.4,2:1.2,4:2.0,5:3.9,6:6.3};
 if(scCount&&scBase.base)applyRateScore(sc,scCount,scBase.base,strongRate,scBase.estimated?.85:1.3); else if(scCount)boost(sc,strongRate,scCount,.45);
 if(schCount&&schBase.base)applyRateScore(sc,schCount,schBase.base,strongRate,schBase.estimated?.85:1.3); else if(schCount)boost(sc,strongRate,schCount,.45);
 if(other)boost(sc,{1:.2,2:.6,4:1.4,5:2.2,6:3.0},other,.25);
 if(unknown)boost(sc,{1:.2,2:.7,4:1.5,5:2.4,6:3.1},unknown,.18);
}
function directBase(k){let actual=S.data[k]||0;if(actual)return {base:actual,estimated:false};let ng=S.data.normalGames||0,den=RARE_DENOM[k];return ng&&den?{base:ng/den,estimated:true}:{base:0,estimated:false}}
function boost(sc,vals,count,w){for(const s of SETS)sc[s]*=Math.pow(Math.max(.01,vals[s]),count*w)}
function applyRival(sc){applyRateScore(sc,S.data.rivalEnoki||0,S.data.atHit||0,PUB.rival.enoki,.35);applyRateScore(sc,S.data.rivalGamo||0,S.data.atHit||0,PUB.rival.gamo,.55);applyRateScore(sc,S.data.rivalHamaoka||0,S.data.atHit||0,PUB.rival.hamaoka,.35)}
function applyChargeItem(sc){const map={chargeBoat:"boat",chargeWeakCherry:"weakCherry",chargeWeakChance:"weakChance",chargeStrongChance:"strongChance"};for(const [b,p] of Object.entries(map))applyRateScore(sc,S.data[b+"Item"]||0,S.data[b+"Hit"]||0,PUB.chargeItem[p],.55)}
function applyChargeVoice(sc){let a=S.data.voiceCalm||0,b=S.data.voiceSign||0,t=a+b;if(t){applyRateScore(sc,a,t,PUB.chargeVoice.calm,.6)} if(S.data.voiceOtsukare)boost(sc,{1:.01,2:.75,4:.75,5:.01,6:.75},S.data.voiceOtsukare,.6); if(S.data.voiceTeio)boost(sc,{1:.01,2:.01,4:.25,5:.50,6:.25},S.data.voiceTeio,.9)}
function allowed(){let min=1,max=6,even=false;
 if(S.data.medalRainbow||S.data.trophyRainbow||S.data.ticketRainbow)min=6;
 if(S.data.trophyKerot)min=Math.max(min,5);
 if(S.data.trophyGold||S.data.ticketGold||S.data.voiceTeio)min=Math.max(min,4);
 if(S.data.trophyBronze)min=Math.max(min,2);
 if(S.data.ticketSilver||S.data.voiceOtsukare)even=true;
 return SETS.filter(s=>s>=min&&s<=max&&(!even||[2,4,6].includes(s)));
}
function floorRound(raw,floorPct){const keys=Object.keys(raw);let out={},fixed=0,flex=[];for(const k of keys){if(raw[k]<=0){out[k]=0}else{out[k]=floorPct;fixed+=floorPct;flex.push(k)}}const remain=Math.max(0,100-fixed);const rawSum=flex.reduce((a,k)=>a+raw[k],0)||1;flex.forEach(k=>out[k]+=raw[k]/rawSum*remain);let rounded=round(out);let need=0;for(const k of flex){if(rounded[k]<floorPct){need+=floorPct-rounded[k];rounded[k]=floorPct}}while(need>0){let candidates=flex.filter(k=>rounded[k]>floorPct);if(!candidates.length)break;let maxK=candidates.sort((a,b)=>rounded[b]-rounded[a])[0];rounded[maxK]-=1;need-=1}return rounded}
function round(raw){let e=Object.entries(raw).map(([k,v])=>({k,f:Math.floor(v),r:v-Math.floor(v)}));let s=e.reduce((a,x)=>a+x.f,0);e.sort((a,b)=>b.r-a.r);for(let i=0;s<100&&i<e.length;i++,s++)e[i].f++;e.sort((a,b)=>+a.k-+b.k);return Object.fromEntries(e.map(x=>[x.k,x.f]))}
function bars(){let p=probs(),v=Object.values(p),mx=Math.max(...v),mn=Math.min(...v);$("bars").innerHTML=Object.entries(p).map(([s,x])=>`<div class="bar"><div>設定${s}</div><div class="track"><div class="fill ${x===mx?"max":x===mn?"min":""}" style="width:${Math.max(1,x)}%"></div></div><div>${x}%</div></div>`).join("")}
function signals(){let l=[]; if(S.data.medalRainbow)l.push(`SGメダル 虹 ${S.data.medalRainbow}回（設定6確定）`); if(S.data.trophyRainbow)l.push(`トロフィー 虹 ${S.data.trophyRainbow}回（設定6確定）`); if(S.data.ticketRainbow)l.push(`舟券 虹 ${S.data.ticketRainbow}回（設定6確定）`); if(S.data.trophyKerot)l.push(`トロフィー ケロット柄 ${S.data.trophyKerot}回（設定5以上確定）`); if(S.data.trophyGold)l.push(`トロフィー 金 ${S.data.trophyGold}回（設定4以上確定）`); if(S.data.ticketGold)l.push(`舟券 金 ${S.data.ticketGold}回（設定4以上確定）`); if(S.data.voiceTeio)l.push(`セリフ これが艇王と… ${S.data.voiceTeio}回（設定4以上確定）`); if(S.data.trophyBronze)l.push(`トロフィー 銅 ${S.data.trophyBronze}回（設定2以上確定）`); if(S.data.ticketSilver)l.push(`舟券 銀 ${S.data.ticketSilver}回（偶数設定確定）`); if(S.data.voiceOtsukare)l.push(`セリフ おつかれ ${S.data.voiceOtsukare}回（偶数設定確定）`); $("signals").classList.toggle("on",l.length>0);$("signals").innerHTML=l.length?`<div class="blockTitle">確定・否定</div>${l.map(x=>`<div class="signal">${x}</div>`).join("")}`:""}
function jitems(){let keys=["atHit","fiveCoin",...JUDGE_GROUPS].filter(k=>S.visible[k]);$("judgeItems").innerHTML=keys.map(jitem).join("");$("judgeItems").querySelectorAll("[data-use]").forEach(c=>c.onchange=()=>{S.judgeUse[c.dataset.use]=c.checked;save();render()});$("judgeItems").querySelectorAll("[data-open]").forEach(el=>el.onclick=e=>{if(e.target.tagName==="INPUT")return;el.parentElement.classList.toggle("open")})}
function jitem(k){let checked=S.judgeUse[k]?"checked":"",title,main="-",near="",pub="";if(k==="atHit"||k==="fiveCoin"){let inf=PUB[k],c=S.data[k]||0,den=(k==="fiveCoin"?S.data[S.fiveCoinBase]:S.data.normalGames)||0,rn=c&&den?den/c:null;title=inf.label;main=rn?`1/${trim(rn,1)}`:"-";near=rn?`（${nearest(rn,inf.values)}）`:"（-）";pub=Object.entries(inf.values).map(([s,v])=>`設定${s}　1/${v}`).join("<br>")}else{title=GDEF[k].label;main=summaryText(k);pub=gtext(k)}let imp=S.showImpact?`<div class="starImpact">影響度 ${impactStars(k)}</div>`:"";return `<div class="jitem"><div class="jsum" data-open="${k}"><input type="checkbox" data-use="${k}" ${checked}><div><div class="jtitle">${title}</div><div class="jrate">${main}</div><div class="near">${near}</div>${imp}</div><div class="chev">▼</div></div><div class="pub">${pub}</div></div>`}
function summaryText(k){if(k==="direct")return directSummary(); if(k==="chargeVoice"){let a=S.data.voiceCalm||0,b=S.data.voiceSign||0;return a+b?`${a}:${b}`:`${gtotal(k)||0}回`} if(["medal","trophy","ticket"].includes(k))return confirmSummary(k); return gtotal(k)?`${gtotal(k)}回`:"-"}
function confirmSummary(k){let d=GDEF[k];return d.children.map(([id,l])=>`${l} ${S.data[id]||0}回${confirmLabel(id)?`（${confirmLabel(id)}）`:""}`).join(" / ")}
function confirmLabel(id){return {medalRainbow:"設定6確定",trophyRainbow:"設定6確定",ticketRainbow:"設定6確定",trophyKerot:"設定5以上確定",trophyGold:"設定4以上確定",ticketGold:"設定4以上確定",trophyBronze:"設定2以上確定",ticketSilver:"偶数設定確定",voiceOtsukare:"偶数設定確定",voiceTeio:"設定4以上確定"}[id]||""}
function gtext(g){if(g==="direct")return directPublicText(); if(g==="rival")return "榎木モード<br>設定1　7.8%<br>設定2　8.2%<br>設定4　9.4%<br>設定5　10.5%<br>設定6　10.9%<br><br>蒲生モード<br>設定1　7.8%<br>設定2　8.6%<br>設定4　10.9%<br>設定5　14.1%<br>設定6　15.6%<br><br>浜岡モード<br>設定1　7.8%<br>設定2　8.2%<br>設定4　9.4%<br>設定5　10.5%<br>設定6　10.9%"; if(g==="chargeVoice")return chargeVoiceText(); if(g==="chargeItem")return chargeItemText(); if(g==="medal")return "青　"+(S.data.medalBlue||0)+"回（偶数設定示唆）<br>黄　"+(S.data.medalYellow||0)+"回（高設定示唆 弱）<br>黒　"+(S.data.medalBlack||0)+"回（高設定示唆 強＋次回SGメダル/トロフィー出現濃厚）<br>虹　"+(S.data.medalRainbow||0)+"回（設定6確定）"; if(g==="trophy")return "銅　"+(S.data.trophyBronze||0)+"回（設定2以上確定）<br>金　"+(S.data.trophyGold||0)+"回（設定4以上確定）<br>ケロット柄　"+(S.data.trophyKerot||0)+"回（設定5以上確定）<br>虹　"+(S.data.trophyRainbow||0)+"回（設定6確定）"; if(g==="ticket")return "銀　"+(S.data.ticketSilver||0)+"回（偶数設定確定）<br>金　"+(S.data.ticketGold||0)+"回（設定4以上確定）<br>虹　"+(S.data.ticketRainbow||0)+"回（設定6確定）"; let d=GDEF[g];return d.children.map(([k,l])=>`${l}　${S.data[k]||0}回`).join("<br>")}
function directSummary(){let a=S.data.directStrongCherry||0,b=S.data.directStrongChance||0,o=S.data.directOther||0,u=S.data.directUnknown||0;let x=directBase("strongCherry"),y=directBase("strongChance"),base=x.base+y.base,est=x.estimated||y.estimated,label=est?"推定強レア直撃率":"強レア直撃率";let rateText=base?(" / "+label+" "+trim((a+b)/base*100,1)+"%（"+(a+b)+"/"+trim(base,1)+"）"):" / 分母未入力";return `${a+b+o+u}回${rateText}`}
function directPublicText(){let x=directBase("strongCherry"),y=directBase("strongChance"),a=S.data.directStrongCherry||0,b=S.data.directStrongChance||0;let rateA=x.base?`${x.estimated?"推定直撃率 ":"直撃率 "}${trim(a/x.base*100,1)}%（${a}/${trim(x.base,1)}）`:"分母未入力";let rateB=y.base?`${y.estimated?"推定直撃率 ":"直撃率 "}${trim(b/y.base*100,1)}%（${b}/${trim(y.base,1)}）`:"分母未入力";return [`強チェリー直撃　${a}回　${rateA}<br>設定1　0.4%<br>設定2　1.2%<br>設定4　2.0%<br>設定5　3.9%<br>設定6　6.3%<br>※レア小役未入力時は通常ゲーム数÷1/${RARE_DENOM.strongCherry}で推定`,`強チャンス目直撃　${b}回　${rateB}<br>設定1　0.4%<br>設定2　1.2%<br>設定4　2.0%<br>設定5　3.9%<br>設定6　6.3%<br>※レア小役未入力時は通常ゲーム数÷1/${RARE_DENOM.strongChance}で推定`,`その他直撃　${S.data.directOther||0}回<br>契機の分母が特定できないため回数ベースで弱めに評価`,`契機不明　${S.data.directUnknown||0}回<br>契機不明は最も弱く評価`].join("<br><br>")}
function chargeVoiceText(){let a=S.data.voiceCalm||0,b=S.data.voiceSign||0;return `落ち着くんだ：この気配は　${a}:${b}<br>設定1　50:50<br>設定2　40:60<br>設定4　40:60<br>設定5　70:30<br>設定6　40:60<br><br>おつかれ　${S.data.voiceOtsukare||0}回<br>設定1　-<br>設定2　0.75%<br>設定4　0.75%<br>設定5　-<br>設定6　0.75%<br><br>これが艇王と…　${S.data.voiceTeio||0}回<br>設定1　-<br>設定2　-<br>設定4　0.25%<br>設定5　0.50%<br>設定6　0.25%`}
function chargeItemText(){return ["ボート・弱チェリー<br>設定1　25.0%<br>設定2　26.2%<br>設定4　32.8%<br>設定5　39.1%<br>設定6　43.0%","弱チャンス目<br>設定1　31.3%<br>設定2　32.0%<br>設定4　37.5%<br>設定5　40.6%<br>設定6　46.9%","強チャンス目<br>設定1　50.0%<br>設定2　50.8%<br>設定4　58.6%<br>設定5　62.5%<br>設定6　66.4%"].join("<br><br>")}
function nearest(r,vals){let b=null,d=1e9;for(const [s,v] of Object.entries(vals)){let x=Math.abs(r-v);if(x<d){d=x;b=s}}return b?`設定${b}近似値`:"-"}
function impactStars(k){const n={atHit:3,fiveCoin:4,direct:5,rival:3,chargeItem:3,chargeVoice:4,medal:4,trophy:5,ticket:5}[k]||1;return "★★★★★".slice(0,n)+"☆☆☆☆☆".slice(0,5-n)}
function gtotal(g){let d=GDEF[g];if(d.paired)return d.children.reduce((a,[k])=>a+(S.data[k+"Hit"]||0)+(S.data[k+"Item"]||0),0);return d.children.reduce((a,[k])=>a+(S.data[k]||0),0)}
function rate(c,d){return c&&d?`1/${trim(d/c,1)}`:"-"}function pct(c,d){return c&&d?`${trim(c/d*100,1)}%`:"-"}function trim(v,n){return Number(v.toFixed(n)).toString()}
function reset(){if(!confirm("現在の実戦データをリセットしますか？"))return;let keep={visible:structuredClone(S.visible),judgeUse:structuredClone(S.judgeUse),step:structuredClone(S.step),showImpact:S.showImpact,fiveCoinBase:S.fiveCoinBase};S=structuredClone(DEF);Object.assign(S,keep);save();render()}
