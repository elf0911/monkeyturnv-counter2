const VERSION="stage1-ui-judge-layout-v8";
const STORAGE_KEY="monkeyturnv-counter-stage1-ui";
const SETS=[1,2,4,5,6];

const DISPLAY=[
 ["games","総ゲーム数",false],["normalGames","通常ゲーム数",false],["atGames","ATゲーム数",false],["atHit","AT初当たり",false],
 ["fiveCoin","5枚役",false],["rare","レア小役",false],["chargeVoice","激走チャージ後セリフ",false],
 ["medal","SGメダル",false],["trophy","トロフィー",false],["immediateYushutsu","即優出",false],["ticket","舟券",false],
 ["direct","AT直撃",false],["chargeItem","激走チャージ中アイテム",false],["rival","ライバルモード",false],
 ["atSignals","AT中示唆",false],["endingVoice","エンディング中サブ液晶",false]
];
const SINGLE={
 games:{label:"総ゲーム数",unit:"G",game:true},normalGames:{label:"通常ゲーム数",unit:"G",game:true},atGames:{label:"ATゲーム数",unit:"G",game:true},
 atHit:{label:"AT初当たり",unit:"回",denom:"normalGames"},fiveCoin:{label:"5枚役",unit:"回",denom:"normalGames"},immediateYushutsu:{label:"即優出",unit:"回",pctBase:"atHitMinus1"}
};
const GROUPS=["rare","chargeVoice","medal","trophy","ticket","direct","chargeItem","rival","atSignals","endingVoice"];
const NOTE={
 medalBlue:"偶数示唆",medalYellow:"高設定示唆",medalBlack:"高設定示唆・強",
 trophyBronze:"設定2以上",trophyGold:"設定4以上",trophyKerot:"設定5以上",trophyRainbow:"設定6",
 ticketSilver:"偶数濃厚",ticketGold:"設定4以上",ticketRainbow:"設定6",
 voiceCalm:"",voiceSign:"",voiceOtsukare:"偶数濃厚",voiceTeio:"設定4以上",
 over456:"設定4以上",over803:"設定5以上",over666:"設定6",
 roundBoatKerot:"設定5以上",roundRaceSuit:"偶数示唆",roundDress:"高設定示唆",roundAoshimaHatano:"設定5以上",
 endIkeryze:"デフォルト",endIkuyo:"偶数示唆",endIiKanji:"高設定示唆・弱",endYarujanai:"高設定示唆・強",endOtsukare:"偶数濃厚",endTeio:"設定4以上",endKitakita:"設定5以上",endOmedeto:"設定6"
};
const GDEF={
 rare:{label:"レア小役",children:[["boat","ボート"],["weakCherry","弱チェリー"],["weakChance","弱チャンス目"],["strongCherry","強チェリー"],["strongChance","強チャンス目"]],rate:"normalGames"},
 direct:{label:"AT直撃",children:[["directBoat","ボート"],["directWeakCherry","弱チェリー"],["directWeakChance","弱チャンス目"],["directStrongCherry","強チェリー"],["directStrongChance","強チャンス目"]]},
 rival:{label:"ライバルモード",children:[["rivalEnoki","榎木"],["rivalGamo","蒲生"],["rivalHamaoka","浜岡"]],percent:"atHit"},
 chargeItem:{label:"激走チャージ中アイテム",paired:true,children:[["chargeWeakCherry","弱チェリー"],["chargeStrongCherry","強チェリー"],["chargeWeakChance","弱チャンス目"],["chargeStrongChance","強チャンス目"],["chargeBoat","ボート"]]},
 chargeVoice:{label:"激走チャージ後セリフ",children:[["voiceCalm","波多野「落ち着くんだ…」"],["voiceSign","波多野「この気配は！？」"],["voiceOtsukare","榎木「おつかれ」","red"],["voiceTeio","榎木「これが艇王と…」","red"]]},
 atSignals:{label:"AT中示唆",sections:[
  {title:"獲得枚数表示",children:[["over456","456枚OVER"],["over803","803枚OVER"],["over666","666枚OVER"]]},
  {title:"ラウンド開始画面：AT",children:[["roundBoatKerot","ボートケロット"]]},
  {title:"ラウンド開始画面：上位AT",children:[["roundRaceSuit","レース服"],["roundDress","ドレス"],["roundAoshimaHatano","青島＆波多野"]]}
 ]},
 endingVoice:{label:"エンディング中サブ液晶",children:[["endIkeryze","波多野「いけるぜ！」"],["endIkuyo","青島「いっくよー！」","blue"],["endIiKanji","波多野「いい感じだ！」","blue"],["endYarujanai","ありさ「やるじゃない」","green"],["endOtsukare","榎木「おつかれ」","red"],["endTeio","榎木「これが艇王と…」","red"],["endKitakita","青島「きたきたきたぁー！」","red"],["endOmedeto","澄「おめでとう！」","red"]]},
 medal:{label:"SGメダル",children:[["medalBlue","青"],["medalYellow","黄"],["medalBlack","黒"]]},
 trophy:{label:"トロフィー",children:[["trophyBronze","銅"],["trophyGold","金"],["trophyKerot","ケロット柄"],["trophyRainbow","虹"]]},
 ticket:{label:"舟券",children:[["ticketSilver","銀"],["ticketGold","金"],["ticketRainbow","虹"]]}
};
const PUB={atHit:{label:"AT初当たり",values:{1:299.8,2:295.5,4:258.8,5:235.7,6:222.9}},fiveCoin:{label:"5枚役",values:{1:38.15,2:36.86,4:30.27,5:24.51,6:22.53}},immediateYushutsu:{label:"即優出",unit:"%",values:{1:1.6,2:1.7,4:2.2,5:3.0,6:3.7}}};
const DEF={data:{games:0,normalGames:0,atGames:0,atHit:0,fiveCoin:0},visible:{},judgeUse:{},showImpact:false,fiveCoinBase:"games",step:{plus:500,minus:100},open:{},lastGames:["games","normalGames"]};
for(const [k] of DISPLAY){DEF.visible[k]=true;DEF.judgeUse[k]=["atHit"].includes(k)}
for(const [g,d] of Object.entries(GDEF)){if(d.sections){d.sections.forEach(sec=>sec.children.forEach(([k])=>DEF.data[k]=0))}else if(d.paired){for(const [k] of d.children){DEF.data[k+"Hit"]=0;DEF.data[k+"Item"]=0}}else{for(const [k] of d.children)DEF.data[k]=0}}
let S=load();let hold=null,lastTouch=0;
document.addEventListener("touchend",e=>{let n=Date.now();if(n-lastTouch<300)e.preventDefault();lastTouch=n},{passive:false});
document.addEventListener("DOMContentLoaded",()=>{bind();S.open={};save();render()});
function $(id){return document.getElementById(id)}
function load(){try{return merge(structuredClone(DEF),JSON.parse(localStorage.getItem(STORAGE_KEY))||{})}catch{return structuredClone(DEF)}}
function merge(a,b){for(const k in b){if(b[k]&&typeof b[k]==="object"&&!Array.isArray(b[k])&&a[k]&&typeof a[k]==="object")merge(a[k],b[k]);else a[k]=b[k]}return a}
function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify(S))}
function bind(){
 $("settingsBtn").onclick=()=>screen("settings");$("judgeBtn").onclick=()=>screen("judge");
 document.querySelectorAll(".back").forEach(b=>b.onclick=()=>screen(b.dataset.to));
 $("resetBtn").onclick=reset;$("useAll").onclick=()=>{for(const k in S.judgeUse)if(S.visible[k]&&k!=="games")S.judgeUse[k]=true;save();render()};
 $("useNone").onclick=()=>{for(const k in S.judgeUse)S.judgeUse[k]=false;save();render()};
 $("impactToggle").onchange=e=>{S.showImpact=e.target.checked;save();render()};
 $("plusStep").onchange=e=>{S.step.plus=+e.target.value;save();render()};$("minusStep").onchange=e=>{S.step.minus=+e.target.value;save();render()};
}
function screen(id){document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));$(id).classList.add("active");render()}
function render(){home();settings();judge()}
function home(){let h="";for(const [k] of DISPLAY){if(!S.visible[k])continue;if(SINGLE[k])h+=row(k,SINGLE[k]);else h+=group(k)}$("homeList").innerHTML=h;dyn($("homeList"))}
function row(k,it,sub=false){let v=S.data[k]||0,denomKey=(k==="fiveCoin"?S.fiveCoinBase:it.denom),r="";if(k==="immediateYushutsu"){let den=Math.max(0,(S.data.atHit||0)-1);r=den?`${trim(v/den*100,1)}%`:"0%";}else if(denomKey)r=rate(v,S.data[denomKey]);let cls=sub?"subrow":"row";let btn=it.game?`<button class="btn gamebtn" data-c="${k}" data-d="${S.step.plus}">＋${S.step.plus}</button><button class="btn gamebtn" data-c="${k}" data-d="-${S.step.minus}">－${S.step.minus}</button>`:`<button class="btn" data-c="${k}" data-d="1">＋</button><button class="btn" data-c="${k}" data-d="-1">－</button>`;return `<div class="${cls}" data-hold="${k}"><div class="top"><div class="name">${it.label}</div><div class="value">${v}${it.unit||"回"}</div>${btn}</div>${r?`<div class="rate">${r}</div>`:""}</div>`}
function group(g){let d=GDEF[g],open=S.open[g]?"open":"",total=gtotal(g),body="";if(d.sections){body=d.sections.map(sec=>`<div class="sectionTitle">${sec.title}</div>`+sec.children.map(ch=>childRow(g,ch)).join("")).join("")}else if(d.paired){body=d.children.map(([k,l])=>paired(k,l)).join("")}else{body=d.children.map(ch=>childRow(g,ch)).join("")}return `<div class="group ${open}"><button class="ghead" data-t="${g}"><span class="chev">${S.open[g]?"▼":"▶"}</span><span class="groupTitle">${d.label}</span><span class="gtotal">${total}回</span></button><div class="gbody">${body}</div></div>`}
function childRow(g,[k,l,c]){let sub=info(g,k),note=NOTE[k],cc=c?` ${c}`:"",extra=sub?`<div class="subnote subextra">${sub}</div>`:"";return `<div class="subrow trirow" data-hold="${k}"><div class="tri"><div class="triName name${cc}">${l}</div><div class="triCount">${S.data[k]||0}回</div><div class="triNote">${note||""}</div></div><div class="subBtns"><button class="btn" data-c="${k}" data-d="1">＋</button><button class="btn" data-c="${k}" data-d="-1">－</button></div>${extra}</div>`}
function paired(k,l){let h=S.data[k+"Hit"]||0,i=S.data[k+"Item"]||0,p=h?trim(i/h*100,1)+"%":"-";return `<div class="subrow"><div class="name">${l}</div><div class="top" data-hold="${k}Hit"><div class="name subnote">成立</div><div class="value">${h}回</div><button class="btn" data-c="${k}Hit" data-d="1">＋</button><button class="btn" data-c="${k}Hit" data-d="-1">－</button></div><div class="top" data-hold="${k}Item"><div class="name subnote">獲得</div><div class="value">${i}回</div><button class="btn" data-c="${k}Item" data-d="1">＋</button><button class="btn" data-c="${k}Item" data-d="-1">－</button></div><div class="subnote">${p}</div></div>`}
function info(g,k){if(g==="rare")return rate(S.data[k]||0,S.data.normalGames);if(g==="rival")return pct(S.data[k]||0,S.data.atHit);if(g==="chargeVoice"&&(k==="voiceCalm"||k==="voiceSign")){let a=S.data.voiceCalm||0,b=S.data.voiceSign||0;return `波多野比率 ${a}：${b}`}if(g==="direct")return directRateText(k);return ""}
function directRateText(k){let map={directBoat:"boat",directWeakCherry:"weakCherry",directWeakChance:"weakChance",directStrongCherry:"strongCherry",directStrongChance:"strongChance"},base=map[k],cnt=S.data[k]||0,rare=S.data[base]||0;if(!cnt)return "";if(rare)return `直撃率 ${trim(cnt/rare*100,2)}%`;let est=estimatedRare(base);return est?`推定直撃率 ${trim(cnt/est*100,2)}%`:`推定直撃率 -`}
function estimatedRare(base){let n=S.data.normalGames||0;if(!n)return 0;const denom={boat:99.9,weakCherry:81.9,weakChance:199.8,strongCherry:399.6,strongChance:399.6};return n/(denom[base]||1)}
function dyn(root){root.querySelectorAll("[data-c]").forEach(b=>b.onclick=e=>{e.stopPropagation();chg(b.dataset.c,+b.dataset.d)});root.querySelectorAll("[data-t]").forEach(b=>b.onclick=()=>{S.open[b.dataset.t]=!S.open[b.dataset.t];save();render()});root.querySelectorAll("[data-hold]").forEach(el=>{["touchend","touchcancel","mouseup","mouseleave"].forEach(ev=>el.addEventListener(ev,cancel));el.addEventListener("touchstart",e=>{if(e.target.tagName==="BUTTON")return;start(el.dataset.hold)},{passive:true});el.addEventListener("mousedown",e=>{if(e.target.tagName==="BUTTON")return;start(el.dataset.hold)});el.addEventListener("contextmenu",e=>e.preventDefault())})}
function chg(k,d){S.data[k]=Math.max(0,(S.data[k]||0)+d);gameRel(k);save();render()}
function start(k){cancel();hold=setTimeout(()=>promptVal(k),550)}function cancel(){if(hold)clearTimeout(hold);hold=null}
function promptVal(k){let v=prompt(`${label(k)}を入力`,String(S.data[k]||0));if(v===null)return;let n=Math.max(0,Math.floor(+v));if(Number.isFinite(n)){S.data[k]=n;gameRel(k);save();render()}}
function label(k){if(SINGLE[k])return SINGLE[k].label;for(const d of Object.values(GDEF)){let arr=d.sections?d.sections.flatMap(s=>s.children):d.children;if(d.paired){for(const [b,l] of d.children){if(k===b+"Hit")return l+" 成立";if(k===b+"Item")return l+" 獲得"}}else if(arr){for(const [x,l] of arr)if(x===k)return l}}return k}
function gameRel(k){if(!["games","normalGames","atGames"].includes(k))return;S.lastGames=S.lastGames.filter(x=>x!==k);S.lastGames.push(k);if(S.lastGames.length>2)S.lastGames.shift();let [a,b]=S.lastGames,g=S.data.games||0,n=S.data.normalGames||0,at=S.data.atGames||0;if(!a||!b)return;if(a!=="games"&&b!=="games")S.data.games=n+at;if(a!=="normalGames"&&b!=="normalGames")S.data.normalGames=Math.max(0,g-at);if(a!=="atGames"&&b!=="atGames")S.data.atGames=Math.max(0,g-n)}
function settings(){let h=DISPLAY.map(([k,l,f])=>`<label class="setrow"><span>${l}</span><input type="checkbox" data-v="${k}" ${S.visible[k]?"checked":""} ${f?"disabled":""}></label>`).join("");h+=`<div class="setrow"><span>5枚役の分母</span><div class="radioLine"><label><input type="radio" name="fiveBase" value="games" ${S.fiveCoinBase==="games"?"checked":""}>総G</label><label><input type="radio" name="fiveBase" value="normalGames" ${S.fiveCoinBase==="normalGames"?"checked":""}>通常G</label></div></div>`;$("settingList").innerHTML=h;$("settingList").querySelectorAll("[data-v]").forEach(c=>c.onchange=()=>{let k=c.dataset.v;S.visible[k]=c.checked;if(!c.checked)S.judgeUse[k]=false;save();render()});$("settingList").querySelectorAll("input[name=fiveBase]").forEach(r=>r.onchange=()=>{S.fiveCoinBase=r.value;save();render()});let opts=[50,100,150,200,250,300,500,1000].map(n=>`<option value="${n}">${n}</option>`).join("");$("plusStep").innerHTML=opts;$("minusStep").innerHTML=opts;$("plusStep").value=S.step.plus;$("minusStep").value=S.step.minus}
function judge(){$("impactToggle").checked=!!S.showImpact;bars();signals();jitems()}
function probs(){let sc=Object.fromEntries(SETS.map(s=>[s,1]));if(S.visible.atHit&&S.judgeUse.atHit)pois(sc,S.data.atHit||0,S.data.normalGames||0,PUB.atHit.values,.45);if(S.visible.fiveCoin&&S.judgeUse.fiveCoin)pois(sc,S.data.fiveCoin||0,S.data[S.fiveCoinBase]||0,PUB.fiveCoin.values,.55);if(S.visible.direct&&S.judgeUse.direct)applyDirect(sc);let allow=allowed();let hasRestrict=allow.length<SETS.length;SETS.forEach(s=>{if(!allow.includes(s))sc[s]=0});let sum=Object.values(sc).reduce((a,b)=>a+b,0)||1;let raw=Object.fromEntries(SETS.map(s=>[s,sc[s]/sum*100]));return hasRestrict?round(raw):floorRound(raw,1)}
function pois(sc,c,den,vals,w){if(!c||!den)return;for(const s of SETS){let p=1/vals[s],exp=den*p;let score=Math.exp(-Math.pow(c-exp,2)/(2*Math.max(1,exp)))*Math.pow(Math.max(.0001,p),c*w);sc[s]*=Math.max(.000001,score)}}
function applyDirect(sc){let counts={directBoat:S.data.directBoat||0,directWeakCherry:S.data.directWeakCherry||0,directWeakChance:S.data.directWeakChance||0,directStrongCherry:S.data.directStrongCherry||0,directStrongChance:S.data.directStrongChance||0};const rates={weak:{1:.01,2:.01,4:.4,5:2.0,6:3.1},weakChance:{1:.01,2:.01,4:.8,5:2.0,6:3.1},strong:{1:.4,2:1.2,4:2.0,5:3.9,6:6.3}};for(const s of SETS){if(counts.directBoat)sc[s]*=Math.pow(rates.weak[s],counts.directBoat*1.1);if(counts.directWeakCherry)sc[s]*=Math.pow(rates.weak[s],counts.directWeakCherry*1.1);if(counts.directWeakChance)sc[s]*=Math.pow(rates.weakChance[s],counts.directWeakChance*1.2);if(counts.directStrongCherry)sc[s]*=Math.pow(rates.strong[s],counts.directStrongCherry*1.2);if(counts.directStrongChance)sc[s]*=Math.pow(rates.strong[s],counts.directStrongChance*1.2)}}
function allowed(){let a=[...SETS];const ge=n=>a=a.filter(s=>s>=n),only=n=>a=a.filter(s=>s===n),even=()=>a=a.filter(s=>s===2||s===4||s===6);if(S.data.trophyBronze)ge(2);if(S.data.trophyGold||S.data.ticketGold||S.data.voiceTeio||S.data.endTeio||S.data.over456)ge(4);if(S.data.trophyKerot||S.data.over803||S.data.roundBoatKerot||S.data.roundAoshimaHatano||S.data.endKitakita)ge(5);if(S.data.trophyRainbow||S.data.ticketRainbow||S.data.over666||S.data.endOmedeto)only(6);if(S.data.ticketSilver||S.data.voiceOtsukare||S.data.endOtsukare)even();return a.length?a:SETS}
function floorRound(raw,floorPct){const keys=Object.keys(raw);let out={},fixed=0,flex=[];for(const k of keys){if(raw[k]<=0)out[k]=0;else{out[k]=floorPct;fixed+=floorPct;flex.push(k)}}const remain=Math.max(0,100-fixed),rawSum=flex.reduce((a,k)=>a+raw[k],0)||1;flex.forEach(k=>out[k]+=raw[k]/rawSum*remain);let rounded=round(out),need=0;for(const k of flex){if(rounded[k]<floorPct){need+=floorPct-rounded[k];rounded[k]=floorPct}}while(need>0){let c=flex.filter(k=>rounded[k]>floorPct);if(!c.length)break;let m=c.sort((a,b)=>rounded[b]-rounded[a])[0];rounded[m]-=1;need--}return rounded}
function round(raw){let e=Object.entries(raw).map(([k,v])=>({k,f:Math.floor(v),r:v-Math.floor(v)}));let s=e.reduce((a,x)=>a+x.f,0);e.sort((a,b)=>b.r-a.r);for(let i=0;s<100&&i<e.length;i++,s++)e[i].f++;e.sort((a,b)=>+a.k-+b.k);return Object.fromEntries(e.map(x=>[x.k,x.f]))}
function bars(){let p=probs(),v=Object.values(p),mx=Math.max(...v),mn=Math.min(...v);$("bars").innerHTML=Object.entries(p).map(([s,x])=>`<div class="bar"><div>設定${s}</div><div class="track"><div class="fill ${x===mx?"max":x===mn?"min":""}" style="width:${Math.max(1,x)}%"></div></div><div>${x}%</div></div>`).join("")}
function signals(){let l=[];if(S.data.trophyRainbow)l.push("トロフィー 虹（設定6確定）");if(S.data.ticketRainbow)l.push("舟券 虹（設定6確定）");if(S.data.over666)l.push("666枚OVER（設定6確定）");if(S.data.endOmedeto)l.push("澄『おめでとう！』（設定6確定）");if(S.data.trophyKerot)l.push("トロフィー ケロット柄（設定5以上）");if(S.data.over803)l.push("803枚OVER（設定5以上）");if(S.data.roundBoatKerot)l.push("ボートケロット（設定5以上）");if(S.data.roundAoshimaHatano)l.push("青島＆波多野（設定5以上）");if(S.data.endKitakita)l.push("青島『きたきたきたぁー！』（設定5以上）");if(S.data.trophyGold)l.push("トロフィー 金（設定4以上）");if(S.data.ticketGold)l.push("舟券 金（設定4以上）");if(S.data.voiceTeio)l.push("榎木『これが艇王と…』（設定4以上）");if(S.data.endTeio)l.push("榎木『これが艇王と…』（設定4以上）");if(S.data.over456)l.push("456枚OVER（設定4以上）");if(S.data.trophyBronze)l.push("トロフィー 銅（設定2以上）");if(S.data.ticketSilver)l.push("舟券 銀（偶数濃厚）");if(S.data.voiceOtsukare)l.push("榎木『おつかれ』（偶数濃厚）");if(S.data.endOtsukare)l.push("榎木『おつかれ』（偶数濃厚）");$("signals").classList.toggle("on",l.length>0);$("signals").innerHTML=l.length?`<div class="blockTitle">確定・否定</div>${l.map(x=>`<div class="signal">${x}</div>`).join("")}`:""}
function jitems(){let keys=DISPLAY.map(([k])=>k).filter(k=>S.visible[k]&&! ["games","normalGames","atGames","rare"].includes(k));$("judgeItems").innerHTML=keys.map(jitem).join("");$("judgeItems").querySelectorAll("[data-use]").forEach(c=>c.onchange=()=>{S.judgeUse[c.dataset.use]=c.checked;save();render()});$("judgeItems").querySelectorAll("[data-open]").forEach(el=>el.onclick=e=>{if(e.target.tagName==="INPUT")return;el.parentElement.classList.toggle("open")})}
function jitem(k){let checked=S.judgeUse[k]?"checked":"",title,main="-",near="",pub="";
 if(k==="atHit"||k==="fiveCoin"){
  let inf=PUB[k],c=S.data[k]||0,den=(k==="fiveCoin"?S.data[S.fiveCoinBase]:S.data.normalGames)||0,rn=c&&den?den/c:null;
  title=inf.label;let n=rn?nearest(rn,inf.values):"-";main=rn?`1/${trim(rn,1)}（${n}）`:"-";near="";
  pub=publicOneRowTable(Object.fromEntries(Object.entries(inf.values).map(([set,val])=>[set,`1/${val}`])));
 }else if(k==="immediateYushutsu"){
  let inf=PUB[k],c=S.data[k]||0,den=Math.max(0,(S.data.atHit||0)-1),rv=den?c/den*100:null;
  title=inf.label;let n=rv!==null?nearestPct(rv,inf.values):"-";main=rv!==null?`${trim(rv,1)}%（${n}）`:"0%";near=den?`分母：AT初当たり−1 = ${den}`:"分母：AT初当たり−1";
  pub=pubFold("公表値",publicOneRowTable(Object.fromEntries(Object.entries(inf.values).map(([set,val])=>[set,`${val}%`]))));
 }else{
  title=GDEF[k].label;main=gtotal(k)?`${gtotal(k)}回`:"-";pub=gtext(k)
 }
 let imp=S.showImpact?`<div class="starImpact">影響度 ${impactStars(k)}</div>`:"";
 return `<div class="jitem"><div class="jsum" data-open="${k}"><input type="checkbox" data-use="${k}" ${checked}><div><div class="jtitle">${title}</div><div class="jrate">${main}</div><div class="near">${near}</div>${imp}</div><div class="chev">▼</div></div><div class="pub">${pub}</div></div>`}
function detailLine(l,cnt,note,cls=""){return `<div class="pubTri"><div class="pubName ${cls}">${l}</div><div class="pubNote">${note||""}</div><div class="pubCount">${cnt}回</div></div>`}
function detailRows(rows){return `<div class="pubRows">${rows.join("")}</div>`}
function pubFold(title,body){return `<details class="pubFold"><summary>${title}</summary><div class="pubFoldBody">${body}</div></details>`}
function publicList(rows){return `<div class="publicList">${rows.map(r=>`<div>${r}</div>`).join("")}</div>`}
function publicTable(rows){const heads=["項目","設定1","設定2","設定4","設定5","設定6"];return `<div class="pubTableWrap"><table class="pubTable"><thead><tr>${heads.map(h=>`<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map((c,i)=>`<td class="${i===0?"left":"num"}">${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`}
function publicOneRowTable(vals){const heads=[1,2,4,5,6];return `<div class="pubTableWrap"><table class="pubTable oneRow"><thead><tr>${heads.map(s=>`<th>設定${s}</th>`).join("")}</tr></thead><tbody><tr>${heads.map(s=>`<td class="num">${vals[s]||"-"}</td>`).join("")}</tr></tbody></table></div>`}
function gtext(g){
 if(g==="direct")return directPublicText();
 if(g==="chargeVoice"){
  let ratio=`<div class="pubRatio">波多野比率　${S.data.voiceCalm||0}：${S.data.voiceSign||0}</div>`;
  let rows=detailRows([
   detailLine("波多野「落ち着くんだ…」",S.data.voiceCalm||0,""),
   detailLine("波多野「この気配は！？」",S.data.voiceSign||0,""),
   detailLine("榎木「おつかれ」",S.data.voiceOtsukare||0,"偶数濃厚","red"),
   detailLine("榎木「これが艇王と…」",S.data.voiceTeio||0,"設定4以上","red")
  ]);
  let pv=publicTable([
   ["榎木 おつかれ","-","0.75%","0.75%","-","1.25%"],
   ["榎木 これが艇王と…","-","-","0.25%","0.25%","0.25%"]
  ]);
  return ratio+rows+pubFold("公表値",pv)
 }
 if(g==="atSignals")return sectionPublicText(g);
 if(g==="endingVoice")return detailRows(GDEF.endingVoice.children.map(([k,l,c])=>detailLine(l,S.data[k]||0,NOTE[k],c||"")))+pubFold("公表値",endingPublic());
 if(g==="chargeItem")return pairPublicText(g);
 if(g==="rival"){let rows=detailRows(GDEF.rival.children.map(([k,l,c])=>detailLine(l,S.data[k]||0,NOTE[k],c||"")));let pv=publicTable([
 ["榎木","7.8%","8.2%","9.4%","10.5%","10.9%"],
 ["蒲生","7.8%","8.6%","10.9%","14.1%","15.6%"],
 ["浜岡","7.8%","8.2%","9.4%","10.5%","10.9%"],
 ["トータル","30.0%","31.6%","36.3%","41.7%","44.0%"]
]);return rows+pubFold("公表値",pv)}
 if(g==="ticket"){let rows=detailRows(GDEF.ticket.children.map(([k,l,c])=>detailLine(l,S.data[k]||0,NOTE[k],c||"")));let pv=publicTable([
 ["銀","-","0.5%","0.6%","-","0.6%"],
 ["金","-","-","0.2%","0.5%","0.3%"],
 ["虹","-","-","-","-","0.1%"]
]);return rows+pubFold("公表値",pv)}
 if(g==="medal"){let rows=detailRows(GDEF.medal.children.map(([k,l,c])=>detailLine(l,S.data[k]||0,NOTE[k],c||"")));let pv=publicTable([
 ["黒メダル","1.25%","1.5%","4.0%","4.5%","4.5%"],
 ["黒後 青","50.0%","45.0%","37.5%","25.0%","37.5%"],
 ["黒後 黄","50.0%","30.0%","37.5%","50.0%","37.5%"]
]);return rows+pubFold("公表値",pv)}
 if(g==="trophy"){let rows=detailRows(GDEF.trophy.children.map(([k,l,c])=>detailLine(l,S.data[k]||0,NOTE[k],c||"")));let pv=publicTable([
 ["銅 通常","-","5.0%","3.4%","3.4%","3.5%"],
 ["金 通常","-","-","4.4%","3.6%","3.9%"],
 ["ケロット 通常","-","-","-","2.1%","1.6%"],
 ["虹 通常","-","-","-","-","0.8%"],
 ["銅 黒後","-","25.0%","12.5%","10.0%","10.0%"],
 ["金 黒後","-","-","12.5%","11.25%","11.0%"],
 ["ケロット 黒後","-","-","-","3.75%","3.0%"],
 ["虹 黒後","-","-","-","-","1.0%"]
]);return rows+pubFold("公表値",pv)}
 let d=GDEF[g];if(d.paired)return pairPublicText(g);let rows=detailRows(flatChildren(d).map(([k,l,c])=>detailLine(l,S.data[k]||0,NOTE[k],c||"")));return rows
}

function endingPublic(){return publicTable([
 ["榎木 おつかれ","-","2.5%","2.5%","-","1.25%"],
 ["榎木 これが艇王と…","-","-","2.5%","2.5%","1.25%"],
 ["青島 きたきた…","-","-","-","2.5%","1.25%"],
 ["澄 おめでとう","-","-","-","-","1.25%"]
])}

function sectionPublicText(g){let rows=GDEF[g].sections.map(sec=>`<div class="pubSectionTitle">${sec.title}</div>`+detailRows(sec.children.map(([k,l,c])=>detailLine(l,S.data[k]||0,NOTE[k],c||"")))).join("");let pv=publicTable([
 ["ドレス","20.0%","25.0%","35.0%","37.5〜40.8%","37.5〜40.5%"],
 ["青島＆波多野","-","-","-","5.2%","4.5%"]
]);return rows+pubFold("公表値",pv)}
function directPublicText(){let rows=detailRows([
 detailLine("ボート",S.data.directBoat||0,"設定4以上"),
 detailLine("弱チェリー",S.data.directWeakCherry||0,"設定4以上"),
 detailLine("弱チャンス目",S.data.directWeakChance||0,"設定4以上"),
 detailLine("強チェリー",S.data.directStrongCherry||0,""),
 detailLine("強チャンス目",S.data.directStrongChance||0,"")
]);let pv=publicTable([
 ["ボート・弱チェリー","-","-","0.4%","2.0%","3.1%"],
 ["弱チャンス目","-","-","0.8%","2.0%","3.1%"],
 ["強チェリー・強チャンス目","0.4%","1.2%","2.0%","3.9%","6.3%"]
]);return rows+pubFold("公表値",pv)}
function pairPublicText(g){let d=GDEF[g];let rows=detailRows(d.children.map(([b,l])=>{let h=S.data[b+"Hit"]||0,i=S.data[b+"Item"]||0,p=h?trim(i/h*100,1)+"%":"-";return `<div class="pubTri"><div class="pubName">${l}</div><div class="pubNote">${p}</div><div class="pubCount">${i}/${h}</div></div>`}));if(g==="chargeItem"){let pv=publicTable([
 ["ボート","25.0%","26.2%","32.8%","39.1%","43.0%"],
 ["弱チェリー","31.3%","32.0%","37.5%","40.6%","46.9%"],
 ["弱チャンス目","50.0%","50.8%","58.6%","62.5%","66.4%"],
 ["強チェリー","100%","100%","100%","100%","100%"],
 ["強チャンス目","100%","100%","100%","100%","100%"]
]);return rows+pubFold("公表値",pv)}return rows}
function flatChildren(d){return d.sections?d.sections.flatMap(s=>s.children):d.children}
function nearest(r,vals){let b=null,d=1e9;for(const [s,v] of Object.entries(vals)){let x=Math.abs(r-v);if(x<d){d=x;b=s}}return b?`設定${b}近似値`:"-"}
function nearestPct(r,vals){let b=null,d=1e9;for(const [s,v] of Object.entries(vals)){let x=Math.abs(r-v);if(x<d){d=x;b=s}}return b?`設定${b}近似値`:"-"}
function impactStars(k){let n={atHit:5,fiveCoin:4,direct:4,chargeVoice:3,atSignals:5,endingVoice:5,trophy:5,ticket:5,medal:2,rival:2,chargeItem:2}[k]||1;return "★★★★★".slice(0,n)+"☆☆☆☆☆".slice(0,5-n)}
function gtotal(g){let d=GDEF[g];if(d.sections)return d.sections.reduce((a,sec)=>a+sec.children.reduce((b,[k])=>b+(S.data[k]||0),0),0);if(d.paired)return d.children.reduce((a,[k])=>a+(S.data[k+"Hit"]||0)+(S.data[k+"Item"]||0),0);return d.children.reduce((a,[k])=>a+(S.data[k]||0),0)}
function rate(c,d){return c&&d?`1/${trim(d/c,1)}`:"-"}function pct(c,d){return c&&d?`${trim(c/d*100,1)}%`:"-"}function trim(v,n){return Number(v.toFixed(n)).toString()}
function reset(){if(!confirm("現在の実戦データをリセットしますか？"))return;let keep={visible:structuredClone(S.visible),judgeUse:structuredClone(S.judgeUse),step:structuredClone(S.step),showImpact:S.showImpact,fiveCoinBase:S.fiveCoinBase};S=structuredClone(DEF);Object.assign(S,keep);save();render()}
