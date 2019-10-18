// control font size
var html = document.querySelector('html');
html.addEventListener("keydown", (e) => {
  if(e.altKey && e.shiftKey && e.key === '+') {
    const size = html.style.fontSize ? parseFloat(html.style.fontSize.slice(0, -3)) : 1;
    html.style.fontSize = `${size + .1}rem`;
  } else if (e.altKey && e.shiftKey && e.key === '_') {
    const size = html.style.fontSize ? parseFloat(html.style.fontSize.slice(0, -3)) : 1;
    html.style.fontSize = `${size - .1}rem`;
  }
});
