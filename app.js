var $=function(i){return document.getElementById(i)};
function el(t,c,h){var e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e}
function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function color(n){var h=0;for(var i=0;i<n.length;i++)h=(h*31+n.charCodeAt(i))%360;return"hsl("+h+" 65% 55%)"}
function toast(m){var t=$("toast");if(!t)return;t.textContent=m;t.classList.add("s");setTimeout(function(){t.classList.remove("s")},1800)}

/* Supabase (login) */
var sb=null;
try{if(C.supabaseUrl&&C.supabaseKey&&window.supabase)sb=window.supabase.createClient(C.supabaseUrl,C.supabaseKey)}catch(e){}

/* header + footer */
(function(){
 var pages=[["index.html","Beranda"],["store.html","Store"],["ranking.html","Peringkat"],["info.html","Info"]];
 var cur=location.pathname.split("/").pop()||"index.html";
 var links=pages.map(function(p){return"<a href='"+p[0]+"'"+(p[0]==cur||(cur==""&&p[0]=="index.html")?" aria-current='page'":"")+">"+p[1]+"</a>"}).join("");
 var h=$("hdr");if(h)h.outerHTML="<header class='top'><div class='w'><a class='brand' href='index.html'>"+esc(C.name)+"</a><nav class='nav' aria-label='Menu'>"+links+"<a class='acc' id='acc' href='login.html'>Masuk</a></nav></div></header>";
 var f=$("ftr");if(f)f.outerHTML="<footer><div class='w'><div><b class='px' style='color:var(--em)'>"+esc(C.name)+"</b><p style='margin:8px 0 0;max-width:340px'>Bukan produk resmi Minecraft dan tidak berafiliasi dengan Mojang atau Microsoft.</p></div><div><a href='"+esc(C.discord)+"'>Discord</a> · <a href='"+esc(C.tiktok)+"'>TikTok</a> · <a href='"+esc(C.youtube)+"'>YouTube</a></div></div></footer><div class='toast' id='toast' role='status'></div>";
 if(sb)sb.auth.getSession().then(function(r){if(r.data&&r.data.session){var a=$("acc");a.textContent="Akun";a.href="akun.html";sb.from("admins").select("user_id").eq("user_id",r.data.session.user.id).maybeSingle().then(function(x){if(x.data){var l=el("a","","Admin");l.href="admin.html";a.parentNode.insertBefore(l,a)}})}});
 [].forEach.call(document.querySelectorAll("[data-copy]"),function(b){b.onclick=copyIp});
 [].forEach.call(document.querySelectorAll("[data-ip]"),function(e){e.textContent=C.ip});
 [].forEach.call(document.querySelectorAll("[data-dc]"),function(e){e.href=C.discord});
 checkStatus();
})();

function copyIp(){var v=C.ip;function fb(){var a=document.createElement("textarea");a.value=v;document.body.appendChild(a);a.select();try{document.execCommand("copy")}catch(e){}a.remove();toast("IP tersalin!")}
 try{navigator.clipboard.writeText(v).then(function(){toast("IP tersalin!")},fb)}catch(e){fb()}}

function checkStatus(){var s=$("stt");if(!s)return;var c=new AbortController(),t=setTimeout(function(){c.abort()},6000);
 fetch("https://api.mcstatus.io/v2/status/java/"+C.ip+":"+C.javaPort,{signal:c.signal}).then(function(r){return r.json()}).then(function(d){clearTimeout(t);
  if(d&&d.online){$("st").classList.add("on");s.textContent="Online · "+d.players.online+"/"+d.players.max+" pemain"}else s.textContent="Server sedang offline"}).catch(function(){s.textContent="Status tidak tersedia"})}

/* renderers */
function put(id,fn){var b=$(id);if(b)fn(b)}
function renderModes(id){put(id,function(b){C.modes.forEach(function(m){b.appendChild(el("article","box mode","<div class='ico'>"+m[0]+"</div><h3>"+esc(m[1])+"</h3><p>"+esc(m[2])+"</p>"))})})}
function renderRanks(id){put(id,function(b){C.ranks.forEach(function(r){b.appendChild(el("article","box rank"+(r.hot?" hot":""),(r.hot?"<span class='tag'>POPULER</span>":"")+"<h3 style='color:"+r.c+"'>"+esc(r.n)+"</h3><div class='price'>"+esc(r.p)+"</div><ul>"+r.f.map(function(f){return"<li>"+esc(f)+"</li>"}).join("")+"</ul><a class='btn full "+(r.hot?"g":"")+"' href='"+esc(C.store)+"'>Beli "+esc(r.n)+"</a>"))})})}
function renderCoins(id){put(id,function(b){C.coins.forEach(function(c){b.appendChild(el("div","box vote","<div><b>"+esc(c[0])+"</b><div class='val'>"+esc(c[1])+"</div></div><a class='btn d' href='"+esc(C.store)+"'>Beli</a>"))})})}
function renderVotes(id){put(id,function(b){C.votes.forEach(function(v){b.appendChild(el("div","box vote","<b>"+esc(v[0])+"</b><a class='btn d' href='"+esc(v[1])+"'>Vote</a>"))})})}
function renderNews(id){put(id,function(b){C.news.forEach(function(n){b.appendChild(el("article","box news","<time>"+esc(n[0])+"</time><h3>"+esc(n[1])+"</h3><p>"+esc(n[2])+"</p>"))})})}
function renderStaff(id){put(id,function(b){C.staff.forEach(function(s){b.appendChild(el("div","box staff","<span class='face' style='background:"+s[2]+"'></span><small>"+esc(s[1])+"</small><span class='badge' style='background:"+s[2]+";color:#111'>"+esc(s[0])+"</span>"))})})}
function renderFaq(id){put(id,function(b){C.faq.forEach(function(f){b.appendChild(el("details","box","<summary>"+esc(f[0])+"</summary><p>"+esc(f[1])+"</p>"))})})}
function renderRules(id){put(id,function(b){C.rules.forEach(function(r){b.appendChild(el("li","",esc(r)))})})}
function tabs(box,items,cb){items.forEach(function(t,i){var b=el("button","tab",esc(t));b.type="button";b.setAttribute("role","tab");b.setAttribute("aria-selected",i==0);b.onclick=function(){[].forEach.call(box.children,function(x){x.setAttribute("aria-selected",x==b)});cb(t)};box.appendChild(b)});cb(items[0])}
function renderLb(tabId,boxId){put(tabId,function(t){tabs(t,Object.keys(C.lb),function(k){$(boxId).innerHTML=C.lb[k].map(function(r,i){return"<div class='row'><span class='pos'>#"+(i+1)+"</span><span><span class='face' style='background:"+color(r[0])+"'></span>"+esc(r[0])+"</span><span class='val'>"+esc(r[1])+"</span></div>"}).join("")})})}
function renderJoin(tabId,ipId,stepsId){put(tabId,function(t){
 var p={"Java (PC)":[C.ip,["Buka Minecraft Java, pilih <b>Multiplayer</b>.","Klik <b>Add Server</b>, isi alamat server di atas.","Masuk, lalu ketik <b>/register</b> di chat."]],
 "Bedrock (HP/Konsol)":[C.ip+" · Port "+C.bedrockPort,["Buka Minecraft Bedrock, pilih <b>Play → Servers → Add Server</b>.","Isi alamat "+esc(C.ip)+" dan port <b>"+C.bedrockPort+"</b>.","Masuk, lalu ketik <b>/register</b> di chat."]]};
 tabs(t,Object.keys(p),function(k){$(ipId).textContent=p[k][0];$(stepsId).innerHTML=p[k][1].map(function(s){return"<li class='box'><span>"+s+"</span></li>"}).join("")})})}

/* konfigurasi dari database (diedit lewat admin.html) */
var R=[];
["renderModes","renderRanks","renderCoins","renderVotes","renderNews","renderStaff","renderFaq","renderRules","renderLb","renderJoin"].forEach(function(n){var f=window[n];window[n]=function(){R.push([f,arguments]);return f.apply(null,arguments)}});
var cfgP=sb?sb.from("site_config").select("data").eq("id",1).maybeSingle().then(function(r){var d=r.data&&r.data.data;if(!d)return;
 Object.keys(d).forEach(function(k){if(k!="supabaseUrl"&&k!="supabaseKey")C[k]=d[k]});
 R.forEach(function(x){[].forEach.call(x[1],function(id){var e=$(id);if(e)e.innerHTML=""});x[0].apply(null,x[1])});
 [].forEach.call(document.querySelectorAll(".brand"),function(e){e.textContent=C.name});
 [].forEach.call(document.querySelectorAll("[data-ip]"),function(e){e.textContent=C.ip});
 [].forEach.call(document.querySelectorAll("[data-dc]"),function(e){e.href=C.discord})
}).catch(function(){}):Promise.resolve();
