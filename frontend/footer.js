// Dynamically inject shared footer
(async function loadFooter(){
  const placeholder = document.getElementById('footer-placeholder');
  if(!placeholder) return;
  try {
    const res = await fetch('components/footer.html');
    if(!res.ok) throw new Error('Failed loading footer');
    const html = await res.text();
    placeholder.outerHTML = html; // replace placeholder div
  } catch(err){
    console.warn('Footer load failed:', err.message);
  }
})();
