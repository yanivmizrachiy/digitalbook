(async function(){
  const bar=document.createElement("div");
  bar.style.position="fixed";
  bar.style.left="0";
  bar.style.top="80px";
  bar.style.width="110px";
  bar.style.maxHeight="80vh";
  bar.style.overflow="auto";
  bar.style.background="rgba(0,0,0,.6)";
  bar.style.padding="6px";
  bar.style.borderRadius="10px";
  bar.style.zIndex="9999";
  bar.style.display="flex";
  bar.style.flexDirection="column";
  bar.style.gap="6px";
  document.body.appendChild(bar);

  function btn(txt){
    const b=document.createElement("button");
    b.textContent=txt;
    b.style.padding="6px";
    b.style.borderRadius="6px";
    b.style.border="none";
    b.style.cursor="pointer";
    b.style.background="#0b5cff";
    b.style.color="white";
    return b;
  }

  const prev=btn("▲");
  const next=btn("▼");
  bar.appendChild(prev);
  bar.appendChild(next);

  prev.onclick=()=>document.getElementById("btnPrev")?.click();
  next.onclick=()=>document.getElementById("btnNext")?.click();
})();
