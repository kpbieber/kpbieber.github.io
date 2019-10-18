function loadEmbeddedTheme(){
    var head = document.getElementsByTagName('HEAD')[0];  
  
    // Create new link Element 
    var link = document.createElement('link'); 

    // set the attributes for link element  
    link.rel = 'stylesheet';  

    link.type = 'text/css'; 

    link.href = document.querySelector('script[src*=embedded]').src.replace('style.js','style.css')

    // Append link element to HTML head 
    head.appendChild(link);  
    console.log("Embedded Theme enabled")
}

console.log("Embedded Theme included")