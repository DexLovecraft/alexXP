// Ce fichier gere la logique de l'application internet 

// Comme toute les application ,  sont code html , css, et javascript doivent avoir le meme nom que son dossier,
// qui a lui porte le nom du data-appname de l'icone de l'app 

// declaration Variable d'historique 
let historyLink = [];
let historyName = [];
let historyLength = historyLink.length
let historyLengthOld = historyLength - 1 

// Fonction appeler lorsque l'on charge une page 
async function loadSite(url , websiteName, pages) {
  // en premier lieu on nettoie le navigateur 
  document.querySelector('.internet_function_bar_button-back').removeEventListener('click', goBack)
  if (document.querySelector(`link[href*="./internet/website/"]`)){
      document.querySelector(`link[href*="./internet/website/"]`).remove()
  }  
  document.querySelector('.internet_content').innerHTML = '';

  // Ensuite on genere l'url nécéssaire 
  let finalUrl = url
  if (pages) {
      finalUrl = url + pages
  }

  // On recupere l'html de la pages et on l'injecte dans le navigateur (internet_content) et on ajoute le style si nécéssaire
  const resp = await fetch(finalUrl);
  if (!resp.ok) throw new Error('Impossible de charger le site');
  const html = await resp.text();
  document.querySelector('.internet_content').innerHTML = html;
  if (!document.querySelector(`link[href="./internet/website/${websiteName}/${websiteName}.css"]`)) {
    const style = document.createElement('link');
    style.rel = 'stylesheet'
    style.href = `./internet/website/${websiteName}/${websiteName}.css`;
    document.querySelector('head').appendChild(style)
  } 
  
  // Puis on gere l'historique, si on est pas revenu en arriere , on rajoute la pages dans l'historique  
  if (historyLengthOld <= historyLength) {
    historyLink.push(finalUrl)
    historyName.push(websiteName) 
    historyLength = historyLink.length
  }
  historyLengthOld = -1

  // on attends que la page charge 
  await new Promise(r => setTimeout(r, 0));
   // on charge l'url a afficher dans la barre d'addresse 
  let urlToDisplay = document.querySelector("div[data-url]").dataset.url
  document.querySelector('.internet_address_bar_content_text').innerHTML = urlToDisplay

  // On met a jour le bouton retour
  goBackButton();
}

const goBackButton = () => {
  // comportement du bouton back pour l'historique si sur home on desactive, sinon on l'active et active l'ecouteur. 
  if (!document.querySelector(".internet_pages_home")){
    document.querySelector('.internet_function_bar_button-back').classList.remove('disable')
    document.querySelector('.internet_function_bar_button-back').addEventListener('click', goBack)
  } else if (document.querySelector(".internet_pages_home")){
    document.querySelector('.internet_function_bar_button-back').classList.add('disable')
  }
}

//fonction de gestion de l'historique du navigateur au click
const goBack = () => {
    // si on est pas sur la homepage, et qu'un fichier css est chargé : 
    if (document.querySelector(`link[href*="./internet/website/"]`) && historyLength >= 1) {
      // on nettoie
      document.querySelector(`link[href*="./internet/website/"]`).remove();

      // on note la taille avant modification , on suprime un element , on note la taille apres modification.
      //  Nécessaire dans loadSite pour verifié si on découvre une page ou si on reviens sur une pages
      historyLengthOld = historyLink.length
      historyLink.pop();
      historyName.pop();
      historyLength = historyLink.length

      // on load la page avant celle qu'on viens de consulter dans nos liste historique
      loadSite(historyLink[historyLength - 1], historyName[historyLength - 1])
    }
  } 

// on charge la page par default Home 
loadSite('./internet/website/home/home.html', 'home')