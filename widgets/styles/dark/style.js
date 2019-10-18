function loadDarkTheme(){
    var head = document.getElementsByTagName('HEAD')[0];  
  
    // Create new link Element 
    var link = document.createElement('link'); 

    // set the attributes for link element  
    link.rel = 'stylesheet';  

    link.type = 'text/css'; 

    link.href = document.querySelector('script[src*=dark]').src.replace('style.js','style.css')

    // Append link element to HTML head 
    head.appendChild(link);  
    console.log("Dark Theme enabled")
}

console.log("Dark Theme included")