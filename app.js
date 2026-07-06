const VERSION="stage1-ui";
const STORAGE_KEY="monkeyturnv-counter-clean-v1";
const SETS=[1,2,4,5,6];

const DISPLAY=[
 ["games","総ゲーム数",false],["normalGames","通常ゲーム数",false],["atGames","ATゲーム数",false],["atHit","AT初当たり",false],
 ["fiveCoin","5枚役",false],["rare","レア小役",false],["direct","AT直撃",false],["rival","ライバルモード",false],
 ["chargeItem","激走チャージ中",false],["chargeVoice","激走チャージ後セリフ",false],
 ["medal","SGメダル",false],["trophy","トロフィー",false],["ticket","舟券",false],["atSuggest","AT中示唆",false]
];
const SINGLE={
 games:{label:"総ゲーム数",unit:"G",game:true},normalGames:{label:"通常ゲーム数",unit:"G",game:true},atGames:{label:"ATゲーム数",unit:"G",game:true},
 atHit:{label:"AT初当たり",unit:"回",denom:"normalGames"},fiveCoin:{label:"5枚役",unit:"回",denom:"normalGames"}
};
const GROUPS=["rare","direct","rival","chargeItem","chargeVoice","medal","trophy","ticket","atSuggest"];
const GDEF={
 rare:{label:"レア小役",children:[["boat","ボート"],["weakCherry","弱チェリー"],["weakChance","弱チャンス目"],["strongCherry","強チェリー"],["strongChance","強チャンス目"]],rate:"normalGames"},
 direct:{label:"AT直撃",children:[["directBoat","ボート"],["directWeakCherry","弱チェリー"],["directWeakChance","弱チャンス目"],["directStrongCherry","強チェリー"],["directStrongChance","強チャンス目"]]},
 rival:{label:"ライバルモード",children:[["rivalEnoki","榎木"],["rivalGamo","蒲生"],["rivalHamaoka","浜岡"]],percent:"atHit"},
 chargeItem:{label:"激走チャージ中",paired:true,children:[["chargeWeakCherry","弱チェリー"],["chargeStrongCherry","強チェリー"],["chargeWeakChance","弱チャンス目"],["chargeStrongChance","強チャンス目"],["chargeBoat","ボート"]]},
 chargeVoice:{label:"激走チャージ後セリフ",children:[["voiceCalm","波多野 落ち着くんだ憲二…"],["voiceSign","波多野 この気配は!?"],["voiceOtsukare","榎木 おつかれ","red"],["voiceTeio","榎木 これが艇王と呼ばれる私のレースだ！","red"]]},
 medal:{label:"SGメダル",children:[["medalBlue","青","","偶数設定示唆"],["medalYellow","黄","","高設定示唆・弱"],["medalBlack","黒","","高設定示唆・強／次回SGメダル・トロフィー出現濃厚"]]},
 trophy:{label:"トロフィー",children:[["trophyBronze","銅","","設定2以上"],["trophyGold","金","","設定4以上"],["trophyKerot","ケロット柄","","設定5以上"],["trophyRainbow","虹","","設定6"]]},
 ticket:{label:"舟券",children:[["ticketSilver","銀","","偶数設定濃厚"],["ticketGold","金","","設定4以上"],["ticketRainbow","虹","","設定6"]]},
 atSuggest:{label:"AT中示唆",children:[["over456","456枚OVER","","設定4以上"],["over803","803枚OVER","","設定5以上"],["over666","666枚OVER","","設定6"],["roundBoatKerot","AT ボートケロット","","設定5以上"],["upperRace","上位AT レース服","","偶数設定示唆"],["upperDress","上位AT ドレス","","高設定示唆"],["upperAoshimaHatano","上位AT 青島＆波多野","","設定5以上"]]}
};
const PUB={
 atHit:{label:"AT初当たり",values:{1:299.8,2:295.5,4:258.8,5:235.7,6:222.9}},
 fiveCoin:{label:"5枚役",values:{1:38.15,2:36.86,4:30.27,5:24.51,6:22.53}}
};

const DEF={data:{games:0,normalGames:0,atGames:0,atHit:0,fiveCoin:0},visible:{},judgeUse:{},showImpact:false,fiveCoinBase:"games",step:{plus:500,minus:100},open:{},lastGames:["games","normalGames"]};
for(const [k,,fixed] of DISPLAY){DEF.visible[k]=["games","normalGames","atGames","atHit"].includes(k); DEF.judgeUse[k]=k==="atHit";}
for(const [g,d] of Object.entries(GDEF)){if(d.paired){for(const [k] of d.children){DEF.data[k+"Hit"]=0;DEF.data[k+"Item"]=0}}else{for(const [k] of d.children)DEF.data[k]=0}}
let S=load(); let hold=null; let lastTouch=0;
document.addEventListener("touchend",e=>{let n=Date.now(); if(n-lastTouch<300)e.preventDefault(); lastTouch=n},{passive:false});
document.addEventListener("DOMContentLoaded",()=>{bind();S.open={};save();render()});
function $(id){return document.getElementById(id)}
function load(){try{return merge(structuredClone(DEF),JSON.parse(localStorage.getItem(STORAGE_KEY))||{})}catch{return structuredClone(DEF)}}
function merge(a,b){for(const k in b){if(b[k]&&typeof b[k]==="object"&&!Array.isArray(b[k])&&a[k]&&typeof a[k]==="object")merge(a[k],b[k]);else a[k]=b[k]}return a}
function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify(S))}
function bind(){
 $("settingsBtn").onclick=()=>screen("settings"); $("judgeBtn").onclick=()=>screen("judge");
 document.querySelectorAll(".back").forEach(b=>b.onclick=()=>screen(b.dataset.to));
 $("resetBtn").onclick=reset; $("useAll").onclick=()=>{for(const k in S.judgeUse)if(S.visible[k])S.judgeUse[k]=true;save();render()};
 $("useNone").onclick=()=>{for(const k in S.judgeUse)S.judgeUse[k]=false;save();render()};
 $("impactToggle").onchange=e=>{S.showImpact=e.target.checked;save();render()};
 $("plusStep").onchange=e=>{S.step.plus=+e.target.value;save();render()};
 $("minusStep").onchange=e=>{S.step.minus=+e.target.value;save();render()};
}
function screen(id){document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));$(id).classList.add("active");render()}
function render(){home();settings();judge()}
function home(){let h="";["games","normalGames","atGames","atHit","fiveCoin"].forEach(k=>{if(S.visible[k])h+=row(k,SINGLE[k])});GROUPS.forEach(g=>{if(S.visible[g])h+=group(g)});$("homeList").innerHTML=h;dyn($("homeList"))}
function row(k,it,sub=false){let v=S.data[k]||0, denomKey=(k==="fiveCoin"?S.fiveCoinBase:it.denom), r=denomKey?rate(v,S.data[denomKey]):"", cls=sub?"subrow":"row";let btn=it.game?`<button class="btn gamebtn" data-c="${k}" data-d="${S.step.plus}">＋${S.step.plus}</button><button class="btn gamebtn" data-c="${k}" data-d="-${S.step.minus}">－${S.step.minus}</button>`:`<button class="btn" data-c="${k}" data-d="1">＋</button><button class="btn" data-c="${k}" data-d="-1">－</button>`;return `<div class="${cls}" data-hold="${k}"><div class="top"><div class="name">${it.label}</div><div class="value">${v}${it.unit||"回"}</div>${btn}</div>${r?`<div class="rate">${r}</div>`:""}</div>`}
function group(g){let d=GDEF[g], open=S.open[g]?"open":"", total=gtotal(g), body=""; if(g==="atSuggest"){body=atSuggestBody()}else if(d.paired){body=d.children.map(([k,l])=>paired(k,l)).join("")}else{body=d.children.map(([k,l,c,note])=>{let sub=info(g,k,note), cc=c?` ${c}`:"";return `<div class="subrow" data-hold="${k}"><div class="top"><div class="name${cc}">${l}</div><div class="value">${S.data[k]||0}回</div><button class="btn" data-c="${k}" data-d="1">＋</button><button class="btn" data-c="${k}" data-d="-1">－</button></div>${sub?`<div class="subnote">${sub}</div>`:""}</div>`}).join("")}return `<div class="group ${open}"><button class="ghead" data-t="${g}"><span class="chev">${S.open[g]?"▼":"▶"}</span><span class="groupTitle">${d.label}</span><span class="gtotal">${total?"合計 "+total+"回":""}</span></button><div class="gbody">${body}</div></div>`}
function atSuggestBody(){
 const line=(k,l,n)=>`<div class="subrow" data-hold="${k}"><div class="top"><div class="name">${l}</div><div class="value">${S.data[k]||0}回</div><button class="btn" data-c="${k}" data-d="1">＋</button><button class="btn" data-c="${k}" data-d="-1">－</button></div><div class="subnote">${n}</div></div>`;
 return `<div class="sectionLabel">獲得枚数表示</div>`+
 line("over456","456枚OVER","設定4以上")+line("over803","803枚OVER","設定5以上")+line("over666","666枚OVER","設定6")+
 `<div class="sectionLabel">ラウンド開始画面</div><div class="miniLabel">AT</div>`+
 line("roundBoatKerot","ボートケロット","設定5以上")+
 `<div class="miniLabel">上位AT</div>`+
 line("upperRace","レース服","偶数設定示唆")+line("upperDress","ドレス","高設定示唆")+line("upperAoshimaHatano","青島＆波多野","設定5以上");
}
function paired(k,l){let h=S.data[k+"Hit"]||0,i=S.data[k+"Item"]||0,p=h?trim(i/h*100,1)+"%":"-";return `<div class="subrow"><div class="name">${l}</div><div class="top" data-hold="${k}Hit"><div class="name subnote">成立</div><div class="value">${h}回</div><button class="btn" data-c="${k}Hit" data-d="1">＋</button><button class="btn" data-c="${k}Hit" data-d="-1">－</button></div><div class="top" data-hold="${k}Item"><div class="name subnote">獲得</div><div class="value">${i}回</div><button class="btn" data-c="${k}Item" data-d="1">＋</button><button class="btn" data-c="${k}Item" data-d="-1">－</button></div><div class="subnote">${p}</div></div>`}
function info(g,k,note){if(g==="rare")return rate(S.data[k]||0,S.data.normalGames);if(g==="rival")return pct(S.data[k]||0,S.data.atHit);if(g==="chargeVoice"&&(k==="voiceCalm"||k==="voiceSign")){let a=S.data.voiceCalm||0,b=S.data.voiceSign||0;return `波多野比率 ${a}：${b}`}return note||""}
function dyn(root){root.querySelectorAll("[data-c]").forEach(b=>b.onclick=e=>{e.stopPropagation();chg(b.dataset.c,+b.dataset.d)});root.querySelectorAll("[data-t]").forEach(b=>b.onclick=()=>{S.open[b.dataset.t]=!S.open[b.dataset.t];save();render()});root.querySelectorAll("[data-hold]").forEach(el=>{["touchend","touchcancel","mouseup","mouseleave"].forEach(ev=>el.addEventListener(ev,cancel));el.addEventListener("touchstart",e=>{if(e.target.tagName==="BUTTON")return;start(el.dataset.hold)},{passive:true});el.addEventListener("mousedown",e=>{if(e.target.tagName==="BUTTON")return;start(el.dataset.hold)});el.addEventListener("contextmenu",e=>e.preventDefault())})}
function chg(k,d){S.data[k]=Math.max(0,(S.data[k]||0)+d);gameRel(k);save();render()}
function start(k){cancel();hold=setTimeout(()=>promptVal(k),550)}
function cancel(){if(hold)clearTimeout(hold);hold=null}
function promptVal(k){let v=prompt(`${label(k)}を入力`,String(S.data[k]||0));if(v===null)return;let n=Math.max(0,Math.floor(+v));if(Number.isFinite(n)){S.data[k]=n;gameRel(k);save();render()}}
function label(k){if(SINGLE[k])return SINGLE[k].label;for(const d of Object.values(GDEF)){if(d.paired){for(const [b,l] of d.children){if(k===b+"Hit")return l+" 成立";if(k===b+"Item")return l+" 獲得"}}else for(const [x,l] of d.children)if(x===k)return l}return k}
function gameRel(k){if(!["games","normalGames","atGames"].includes(k))return;S.lastGames=S.lastGames.filter(x=>x!==k);S.lastGames.push(k);if(S.lastGames.length>2)S.lastGames.shift();let [a,b]=S.lastGames,g=S.data.games||0,n=S.data.normalGames||0,at=S.data.atGames||0;if(!a||!b)return;if(a!=="games"&&b!=="games")S.data.games=n+at;if(a!=="normalGames"&&b!=="normalGames")S.data.normalGames=Math.max(0,g-at);if(a!=="atGames"&&b!=="atGames")S.data.atGames=Math.max(0,g-n)}
function settings(){let h=DISPLAY.map(([k,l,f])=>`<label class="setrow"><span>${l}</span><input type="checkbox" data-v="${k}" ${S.visible[k]?"checked":""} ${f?"disabled":""}></label>`).join("");
h+=`<div class="setrow"><span>5枚役の分母</span><div class="radioLine"><label><input type="radio" name="fiveBase" value="games" ${S.fiveCoinBase==="games"?"checked":""}>総G</label><label><input type="radio" name="fiveBase" value="normalGames" ${S.fiveCoinBase==="normalGames"?"checked":""}>通常G</label></div></div>`;$("settingList").innerHTML=h;$("settingList").querySelectorAll("[data-v]").forEach(c=>c.onchange=()=>{let k=c.dataset.v;S.visible[k]=c.checked;if(!c.checked)S.judgeUse[k]=false;save();render()});$("settingList").querySelectorAll("input[name=fiveBase]").forEach(r=>r.onchange=()=>{S.fiveCoinBase=r.value;save();render()});let opts=[50,100,150,200,250,300,500,1000].map(n=>`<option value="${n}">${n}</option>`).join("");$("plusStep").innerHTML=opts;$("minusStep").innerHTML=opts;$("plusStep").value=S.step.plus;$("minusStep").value=S.step.minus}
function judge(){$("impactToggle").checked=!!S.showImpact;bars();signals();jitems()}
function probs(){let sc=Object.fromEntries(SETS.map(s=>[s,1]));if(S.visible.atHit&&S.judgeUse.atHit)pois(sc,S.data.atHit||0,S.data.normalGames||0,PUB.atHit.values,.45);if(S.visible.fiveCoin&&S.judgeUse.fiveCoin)pois(sc,S.data.fiveCoin||0,S.data[S.fiveCoinBase]||0,PUB.fiveCoin.values,.55);let allow=allowed();let hasRestrict=allow.length<SETS.length;SETS.forEach(s=>{if(!allow.includes(s))sc[s]=0});let sum=Object.values(sc).reduce((a,b)=>a+b,0)||1;let raw=Object.fromEntries(SETS.map(s=>[s,sc[s]/sum*100]));return hasRestrict?round(raw):floorRound(raw,1)}
function pois(sc,count,den,vals,w){if(!count||!den)return;for(const s of SETS){const p=1/(vals[s]||999);const mean=den*p;const like=Math.pow(mean+0.0001,count)*Math.exp(-mean);sc[s]*=Math.pow(Math.max(like,1e-12),w)}}
function allowed(){let a=[...SETS];const min=n=>{a=a.filter(s=>s>=n)};const only=n=>{a=a.filter(s=>s===n)};const even=()=>{a=a.filter(s=>s===2||s===4||s===6)};if(S.data.trophyBronze)min(2);if(S.data.trophyGold||S.data.ticketGold||S.data.over456||S.data.voiceTeio)min(4);if(S.data.trophyKerot||S.data.over803||S.data.roundBoatKerot||S.data.upperAoshimaHatano)min(5);if(S.data.trophyRainbow||S.data.ticketRainbow||S.data.over666)only(6);if(S.data.ticketSilver||S.data.voiceOtsukare)even();return a}
function floorRound(raw,floorPct){const keys=Object.keys(raw);let out={},fixed=0,flex=[];for(const k of keys){if(raw[k]<=0){out[k]=0}else{out[k]=floorPct;fixed+=floorPct;flex.push(k)}}const remain=Math.max(0,100-fixed);const rawSum=flex.reduce((a,k)=>a+raw[k],0)||1;flex.forEach(k=>out[k]+=raw[k]/rawSum*remain);let rounded=round(out);let need=0;for(const k of flex){if(rounded[k]<floorPct){need+=floorPct-rounded[k];rounded[k]=floorPct}}while(need>0){let candidates=flex.filter(k=>rounded[k]>floorPct);if(!candidates.length)break;let maxK=candidates.sort((a,b)=>rounded[b]-rounded[a])[0];rounded[maxK]-=1;need-=1}return rounded}
function round(raw){let e=Object.entries(raw).map(([k,v])=>({k,f:Math.floor(v),r:v-Math.floor(v)}));let s=e.reduce((a,x)=>a+x.f,0);e.sort((a,b)=>b.r-a.r);for(let i=0;s<100&&i<e.length;i++,s++)e[i].f++;e.sort((a,b)=>+a.k-+b.k);return Object.fromEntries(e.map(x=>[x.k,x.f]))}
function bars(){let p=probs(),v=Object.values(p),mx=Math.max(...v),mn=Math.min(...v);$("bars").innerHTML=Object.entries(p).map(([s,x])=>`<div class="bar"><div>設定${s}</div><div class="track"><div class="fill ${x===mx?"max":x===mn?"min":""}" style="width:${Math.max(1,x)}%"></div></div><div>${x}%</div></div>`).join("")}
function signals(){let l=[];if(S.data.trophyRainbow)l.push("トロフィー 虹（設定6確定）");if(S.data.ticketRainbow)l.push("舟券 虹（設定6確定）");if(S.data.over666)l.push("666枚OVER（設定6確定）");if(S.data.trophyKerot)l.push("トロフィー ケロット柄（設定5以上確定）");if(S.data.over803)l.push("803枚OVER（設定5以上確定）");if(S.data.roundBoatKerot)l.push("ボートケロット（設定5以上確定）");if(S.data.upperAoshimaHatano)l.push("上位AT 青島＆波多野（設定5以上確定）");if(S.data.trophyGold)l.push("トロフィー 金（設定4以上確定）");if(S.data.ticketGold)l.push("舟券 金（設定4以上確定）");if(S.data.over456)l.push("456枚OVER（設定4以上確定）");if(S.data.voiceTeio)l.push("榎木 これが艇王と呼ばれる私のレースだ！（設定4以上確定）");if(S.data.trophyBronze)l.push("トロフィー 銅（設定2以上確定）");if(S.data.ticketSilver)l.push("舟券 銀（偶数設定確定）");if(S.data.voiceOtsukare)l.push("榎木 おつかれ（偶数設定確定）");$("signals").classList.toggle("on",l.length>0);$("signals").innerHTML=l.length?`<div class="blockTitle">確定・否定</div>${l.map(x=>`<div class="signal">${x}</div>`).join("")}`:""}
function jitems(){let keys=["atHit","fiveCoin",...GROUPS].filter(k=>S.visible[k]&&k!=="rare");$("judgeItems").innerHTML=keys.map(jitem).join("");$("judgeItems").querySelectorAll("[data-use]").forEach(c=>c.onchange=()=>{S.judgeUse[c.dataset.use]=c.checked;save();render()});$("judgeItems").querySelectorAll("[data-open]").forEach(el=>el.onclick=e=>{if(e.target.tagName==="INPUT")return;el.parentElement.classList.toggle("open")})}
function jitem(k){let checked=S.judgeUse[k]?"checked":"",title,main="-",near="",pub="";if(k==="atHit"||k==="fiveCoin"){let inf=PUB[k],c=S.data[k]||0,den=(k==="fiveCoin"?S.data[S.fiveCoinBase]:S.data.normalGames)||0,rn=c&&den?den/c:null;title=inf.label;main=rn?`1/${trim(rn,1)}`:"-";near=rn?`（${nearest(rn,inf.values)}）`:"（-）";pub=Object.entries(inf.values).map(([s,v])=>`設定${s}　1/${v}`).join("<br>")}else{title=GDEF[k].label;main=gtotal(k)?`合計 ${gtotal(k)}回`:"-";pub=gtext(k)}let imp=S.showImpact?`<div class="starImpact">影響度 ${impactStars(k)}</div>`:"";return `<div class="jitem"><div class="jsum" data-open="${k}"><input type="checkbox" data-use="${k}" ${checked}><div><div class="jtitle">${title}</div><div class="jrate">${main}</div><div class="near">${near}</div>${imp}</div><div class="chev">▼</div></div><div class="pub">${pub}</div></div>`}
function gtext(g){if(g==="direct")return directPublicText();if(g==="chargeVoice")return `波多野比率　${S.data.voiceCalm||0}：${S.data.voiceSign||0}<br><br>波多野「落ち着くんだ憲二…」　${S.data.voiceCalm||0}回<br>波多野「この気配は!?」　${S.data.voiceSign||0}回<br><span class="red">榎木「おつかれ」　${S.data.voiceOtsukare||0}回（偶数設定濃厚）</span><br><span class="red">榎木「これが艇王と呼ばれる私のレースだ！」　${S.data.voiceTeio||0}回（設定4以上）</span>`;if(g==="chargeItem")return pairPublicText(g);if(g==="atSuggest")return atSuggestText();if(g==="rival")return "ライバルモードの入力回数を表示。判別ロジックへの詳細反映は第2弾で調整。";let d=GDEF[g];if(d.paired)return pairPublicText(g);return d.children.map(([k,l,,note])=>`${l}　${S.data[k]||0}回${note?`（${note}）`:""}`).join("<br>")}
function directPublicText(){return [`ボート　${S.data.directBoat||0}回<br>設定1　-<br>設定2　-<br>設定4　0.4%<br>設定5　2.0%<br>設定6　3.1%`,`弱チェリー　${S.data.directWeakCherry||0}回<br>設定1　-<br>設定2　-<br>設定4　0.4%<br>設定5　2.0%<br>設定6　3.1%`,`弱チャンス目　${S.data.directWeakChance||0}回<br>設定1　-<br>設定2　-<br>設定4　0.8%<br>設定5　2.0%<br>設定6　3.1%`,`強チェリー　${S.data.directStrongCherry||0}回<br>設定1　0.4%<br>設定2　1.2%<br>設定4　2.0%<br>設定5　3.9%<br>設定6　6.3%`,`強チャンス目　${S.data.directStrongChance||0}回<br>設定1　0.4%<br>設定2　1.2%<br>設定4　2.0%<br>設定5　3.9%<br>設定6　6.3%`].join("<br><br>")}
function atSuggestText(){return `獲得枚数表示<br>456枚OVER　${S.data.over456||0}回（設定4以上）<br>803枚OVER　${S.data.over803||0}回（設定5以上）<br>666枚OVER　${S.data.over666||0}回（設定6）<br><br>ラウンド開始画面<br>AT ボートケロット　${S.data.roundBoatKerot||0}回（設定5以上）<br>上位AT レース服　${S.data.upperRace||0}回（偶数設定示唆）<br>上位AT ドレス　${S.data.upperDress||0}回（高設定示唆）<br>上位AT 青島＆波多野　${S.data.upperAoshimaHatano||0}回（設定5以上）`}
function pairPublicText(g){let d=GDEF[g];return d.children.map(([b,l])=>`${l}　${S.data[b+"Item"]||0}/${S.data[b+"Hit"]||0}　${S.data[b+"Hit"]?trim((S.data[b+"Item"]||0)/(S.data[b+"Hit"]||1)*100,1)+"%":"-"}<br>公表値は第2弾で調整`).join("<br><br>")}
function impactStars(k){const n={atHit:5,fiveCoin:4,direct:5,chargeVoice:4,trophy:5,ticket:5,atSuggest:5,medal:2,rival:2,chargeItem:2}[k]||1;return "★★★★★".slice(0,n)+"☆☆☆☆☆".slice(0,5-n)}
function nearest(r,vals){let b=null,d=1e9;for(const [s,v] of Object.entries(vals)){let x=Math.abs(r-v);if(x<d){d=x;b=s}}return b?`設定${b}近似値`:"-"}
function gtotal(g){let d=GDEF[g];if(d.paired)return d.children.reduce((a,[k])=>a+(S.data[k+"Hit"]||0)+(S.data[k+"Item"]||0),0);return d.children.reduce((a,[k])=>a+(S.data[k]||0),0)}
function rate(c,d){return c&&d?`1/${trim(d/c,1)}`:"-"}function pct(c,d){return c&&d?`${trim(c/d*100,1)}%`:"-"}function trim(v,n){return Number(v.toFixed(n)).toString()}
function reset(){if(!confirm("現在の実戦データをリセットしますか？"))return;let keep={visible:structuredClone(S.visible),judgeUse:structuredClone(S.judgeUse),step:structuredClone(S.step),showImpact:S.showImpact,fiveCoinBase:S.fiveCoinBase};S=structuredClone(DEF);Object.assign(S,keep);save();render()}
/* service worker disabled during development */
