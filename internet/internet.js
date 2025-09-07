let historyLink = [];
let historyName = [];
let historyLength = historyLink.length
let historyLengthOld = historyLength - 1 

async function loadSite(url , websiteName, pages) {
  document.querySelector('.internet_function_bar_button-back').removeEventListener('click', goBack)
  let finalUrl = url
  if (document.querySelector(`link[href*="/alexXP/internet/website/"]`)){
      document.querySelector(`link[href*="/alexXP/internet/website/"]`).remove()
  }  
  document.querySelector('.internet_content').innerHTML = '';
  if (pages) {
      finalUrl = url + pages
  }
  const resp = await fetch(finalUrl);
  if (!resp.ok) throw new Error('Impossible de charger le site');
  const html = await resp.text();
  document.querySelector('.internet_content').innerHTML = html;
  if (!document.querySelector(`link[href="/alexXP/internet/website/${websiteName}/${websiteName}.css"]`)) {
    const style = document.createElement('link');
    style.rel = 'stylesheet'
    style.href = `/internet/website/${websiteName}/${websiteName}.css`;
    document.querySelector('head').appendChild(style)
  } 
  
  if (historyLengthOld <= historyLength) {
    historyLink.push(finalUrl)
    historyName.push(websiteName) 
    historyLength = historyLink.length
  }
  historyLengthOld = -1

  await new Promise(r => setTimeout(r, 0));
  loadPages();
}

const loadPages = () => {
  let urlToDisplay = document.querySelector("div[data-url]").dataset.url
  document.querySelector('.internet_address_bar_content_text').innerHTML = urlToDisplay
  const links = document.querySelectorAll('.internet_pages_link a');
  links.forEach(link => {
      link.addEventListener('click', event => {
      event.preventDefault();
      loadSite(`/internet/website/${link.dataset.link}/${link.dataset.link}.html` , link.dataset.link).catch(err => console.error(err));
    });
  });
  // comportement outside link (menu)
  if (!document.querySelector(".internet_pages_link")){
    document.querySelector('.internet_function_bar_button-back').classList.remove('disable')
    document.querySelector('.internet_function_bar_button-back').addEventListener('click', goBack)
  } else if (document.querySelector(".internet_pages_link")){
    document.querySelector('.internet_function_bar_button-back').classList.add('disable')
  }
}

const goBack = () => {
   if (document.querySelector(`link[href*="/alexXP/internet/website/"]`)) document.querySelector(`link[href*="/alexXP/internet/website/"]`).remove();
      
      if (historyLength >= 1) {

        historyLengthOld = historyLink.length
        
        historyLink.pop();
        historyName.pop();
      
        historyLength = historyLink.length

        loadSite(historyLink[historyLength - 1], historyName[historyLength - 1])
      } 
}

loadSite('/internet/website/home/home.html', 'home')

