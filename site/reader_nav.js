async function loadChapters(){
  const r = await fetch("generated/chapters.json");
  return await r.json();
}

function getIndex(list,url){
  return list.findIndex(x=>x.url===url);
}

function navButton(txt,href){
  const a=document.createElement("a");
  a.href=href;
  a.textContent=txt;
  a.style.margin="10px";
  a.style.padding="8px 14px";
  a.style.background="#0b5cff";
  a.style.color="white";
  a.style.borderRadius="6px";
  a.style.textDecoration="none";
  return a;
}

async function initNav(){
  const params=new URLSearchParams(location.search);
  const file=params.get("file");
  if(!file) return;

  const data=await loadChapters();
  const list=[];

  function walk(x){
    if(Array.isArray(x)) x.forEach(walk);
    else if(typeof x==="object"){
      if(x.url) list.push(x);
      Object.values(x).forEach(walk);
    }
  }
  walk(data);

  const i=getIndex(list,file);

  const nav=document.createElement("div");
  nav.style.margin="20px";

  if(i>0){
    nav.appendChild(
      navButton("← הקודם","reader.html?file="+encodeURIComponent(list[i-1].url))
    );
  }

  nav.appendChild(
    navButton("תוכן עניינים","index.html")
  );

  if(i<list.length-1){
    nav.appendChild(
      navButton("הבא →","reader.html?file="+encodeURIComponent(list[i+1].url))
    );
  }

  document.body.prepend(nav);
}

initNav();
