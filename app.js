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
 var h=$("hdr");if(h)h.outerHTML="<header class='top'><div class='w'><a class='brand' href='index.html'>"+esc(C.name)+"</a><button class='burger' id='bg' type='button' aria-label='Menu' aria-expanded='false' aria-controls='nv'><i></i><i></i><i></i></button><nav class='nav' id='nv' aria-label='Menu' hidden>"+links+"<a class='acc' id='acc' href='login.html'>Masuk</a></nav></div></header>";
 var f=$("ftr");if(f)f.outerHTML="<footer><div class='w'><div><b class='px' style='color:var(--em)'>"+esc(C.name)+"</b><p style='margin:8px 0 0;max-width:340px'>Bukan produk resmi Minecraft dan tidak berafiliasi dengan Mojang atau Microsoft.</p></div><div><a href='"+esc(C.discord)+"'>Discord</a> · <a href='"+esc(C.tiktok)+"'>TikTok</a> · <a href='"+esc(C.youtube)+"'>YouTube</a></div></div></footer><div class='toast' id='toast' role='status'></div>";
 var bg=$("bg"),nv=$("nv");if(bg){bg.onclick=function(){var o=nv.hidden;nv.hidden=!o;bg.setAttribute("aria-expanded",o)};
  document.addEventListener("click",function(e){if(!nv.hidden&&!e.target.closest(".top"))bg.click()});
  document.addEventListener("keydown",function(e){if(e.key=="Escape"&&!nv.hidden)bg.click()})}
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
function renderRanks(id){put(id,function(b){C.ranks.forEach(function(r){b.appendChild(el("article","box rank"+(r.hot?" hot":""),(r.hot?"<span class='tag'>POPULER</span>":"")+"<h3 style='color:"+r.c+"'>"+esc(r.n)+"</h3><div class='price'>"+esc(r.p)+"</div><ul>"+r.f.map(function(f){return"<li>"+esc(f)+"</li>"}).join("")+"</ul><button type='button' class='btn full "+(r.hot?"g":"")+"' data-buy='"+esc(r.n)+"' data-price='"+esc(r.p)+"'>Beli "+esc(r.n)+"</button>"))})})}
function renderCoins(id){put(id,function(b){C.coins.forEach(function(c){b.appendChild(el("div","box vote","<div><b>"+esc(c[0])+"</b><div class='val'>"+esc(c[1])+"</div></div><button type='button' class='btn d' data-buy='"+esc(c[0])+"' data-price='"+esc(c[1])+"'>Beli</button>"))})})}
function renderPays(id){put(id,function(b){C.pays.forEach(function(p){b.appendChild(el("div","box pay","<div class='ico'>"+esc(p[0])+"</div><div><b>"+esc(p[1])+"</b><small>"+(p[3]?"a.n. "+esc(p[3]):"Bayar manual")+"</small></div>"))})})}
function renderVotes(id){put(id,function(b){C.votes.forEach(function(v){b.appendChild(el("div","box vote","<b>"+esc(v[0])+"</b><a class='btn d' href='"+esc(v[1])+"'>Vote</a>"))})})}
function renderNews(id){put(id,function(b){C.news.forEach(function(n){b.appendChild(el("article","box news","<time>"+esc(n[0])+"</time><h3>"+esc(n[1])+"</h3><p>"+esc(n[2])+"</p>"))})})}
function face(s){var p=s[3]||"";if(/^mc:/i.test(p))p="https://mc-heads.net/avatar/"+encodeURIComponent(p.slice(3).trim())+"/128";return p?"<img class='face' alt='' src='"+esc(p)+"'>":"<span class='face' style='background:"+esc(s[2])+"'></span>"}
function renderStaff(id){put(id,function(b){C.staff.forEach(function(s){b.appendChild(el("div","box staff",face(s)+"<small>"+esc(s[1])+"</small><span class='badge' style='background:"+s[2]+";color:#111'>"+esc(s[0])+"</span>"))})})}
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
["renderModes","renderRanks","renderCoins","renderPays","renderVotes","renderNews","renderStaff","renderFaq","renderRules","renderLb","renderJoin"].forEach(function(n){var f=window[n];window[n]=function(){R.push([f,arguments]);return f.apply(null,arguments)}});
var cfgP=sb?sb.from("site_config").select("data").eq("id",1).maybeSingle().then(function(r){var d=r.data&&r.data.data;if(!d)return;
 Object.keys(d).forEach(function(k){if(k!="supabaseUrl"&&k!="supabaseKey")C[k]=d[k]});
 R.forEach(function(x){[].forEach.call(x[1],function(id){var e=$(id);if(e)e.innerHTML=""});x[0].apply(null,x[1])});
 [].forEach.call(document.querySelectorAll(".brand"),function(e){e.textContent=C.name});
 [].forEach.call(document.querySelectorAll("[data-ip]"),function(e){e.textContent=C.ip});
 [].forEach.call(document.querySelectorAll("[data-dc]"),function(e){e.href=C.discord})
}).catch(function(){}):Promise.resolve();

/* checkout manual (DANA, GoPay, dll) */
function copyTxt(v){function fb(){var a=document.createElement("textarea");a.value=v;document.body.appendChild(a);a.select();try{document.execCommand("copy")}catch(e){}a.remove();toast("Tersalin!")}
 try{navigator.clipboard.writeText(v).then(function(){toast("Tersalin!")},fb)}catch(e){fb()}}
function openBuy(item,price){
 if(!C.pays||!C.pays.length){location.href=C.discord;return}
 var old=$("buy");if(old)old.remove();
 var m=el("div","modal"),sel=0;m.id="buy";m.setAttribute("role","dialog");m.setAttribute("aria-modal","true");m.setAttribute("aria-label","Beli "+item);
 m.innerHTML="<div class='box'><h3 class='px' style='font-size:20px'>Beli "+esc(item)+"</h3><div class='val' style='font-size:22px;margin:6px 0 16px'>"+esc(price)+"</div>"+
  "<label class='field'><span>Nickname Minecraft</span><input id='bn' maxlength='16' placeholder='contoh: Steve_123' autocomplete='off'></label>"+
  "<div class='field'><span>Metode pembayaran</span><div class='pm' id='bm' role='tablist'></div></div><div class='acct' id='ba'></div><div id='bx'></div>"+
  "<div class='bact'><button type='button' class='btn' id='bok'>Saya sudah bayar</button><button type='button' class='btn d' id='bno'>Batal</button></div></div>";
 document.body.appendChild(m);
 function close(){m.remove();document.removeEventListener("keydown",key)}
 function key(e){if(e.key=="Escape")close()}
 document.addEventListener("keydown",key);
 m.onclick=function(e){if(e.target==m)close()};
 $("bno").onclick=close;
 function pick(i){sel=i;[].forEach.call($("bm").children,function(x,j){x.setAttribute("aria-selected",j==i)});var p=C.pays[i];
  $("ba").innerHTML="<small>Transfer tepat "+esc(price)+" ke "+esc(p[1])+":</small><div class='num'>"+esc(p[2])+"</div>"+(p[3]?"<small>a.n. "+esc(p[3])+"</small>":"")+"<button type='button' class='btn d' id='bc' style='margin-top:10px;padding:8px 14px;font-size:13px'>Salin nomor</button>";
  $("bc").onclick=function(){var v=String(p[2]);copyTxt(/^[\d\s-]+$/.test(v)?v.replace(/[\s-]/g,""):v)}}
 C.pays.forEach(function(p,i){var b=el("button","tab",esc(p[0])+" "+esc(p[1]));b.type="button";b.setAttribute("role","tab");b.onclick=function(){pick(i)};$("bm").appendChild(b)});
 pick(0);
 if(sb)sb.auth.getSession().then(function(r){var s=r.data&&r.data.session;if(s)sb.from("profiles").select("mc_name").eq("id",s.user.id).maybeSingle().then(function(x){var n=$("bn");if(n&&x.data&&x.data.mc_name&&!n.value)n.value=x.data.mc_name})});
 $("bn").focus();
 $("bok").onclick=function(){var n=$("bn").value.trim(),x=$("bx");
  if(!/^[A-Za-z0-9_]{3,16}$/.test(n)){x.innerHTML="<div class='alert err'>Nickname 3–16 karakter: huruf, angka, atau garis bawah.</div>";return}
  var p=C.pays[sel],subj="Pesanan: "+item+" ("+price+")",txt=subj+"\nNickname: "+n+"\nMetode: "+p[1]+"\nStatus: sudah transfer, bukti pembayaran menyusul.";
  $("bok").disabled=true;
  function fallback(){x.innerHTML="<div class='alert info'>Salin pesanan di bawah, lalu kirim bersama bukti pembayaran ke Discord kami. Atau <a href='login.html' style='text-decoration:underline'>masuk</a> agar pesanan tercatat otomatis.</div><textarea readonly id='bt'>"+esc(txt)+"</textarea><div class='bact'><button type='button' class='btn d' id='bcp'>Salin pesanan</button><a class='btn p' href='"+esc(C.discord)+"'>Buka Discord</a></div>";$("bcp").onclick=function(){copyTxt(txt)};$("bok").hidden=true}
  if(!sb){fallback();return}
  sb.auth.getSession().then(function(r){var s=r.data&&r.data.session;if(!s){fallback();return}
   sb.from("tickets").insert({subject:subj,message:txt}).then(function(r2){
    if(r2.error){$("bok").disabled=false;x.innerHTML="<div class='alert err'>"+esc(r2.error.message)+"</div>";return}
    x.innerHTML="<div class='alert ok'>Pesanan tercatat sebagai tiket di halaman Akun. Kirim bukti pembayaran (screenshot) lewat Discord agar cepat diproses.</div><a class='btn p full' href='"+esc(C.discord)+"'>Kirim bukti di Discord</a>";
    $("bok").hidden=true;$("bno").textContent="Tutup"})})}}
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-buy]");if(b){e.preventDefault();openBuy(b.getAttribute("data-buy"),b.getAttribute("data-price"))}});
