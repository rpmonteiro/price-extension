let page;
let pageURL;
let pageTitle;
const container = document.querySelector('.container');
const priceRegex = new RegExp(/(CHF|USD|EUR|\$|\u20AC)\s?(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2}))|(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?)\s?(USD|EUR|CHF|\$|\u20AC)/gi);


chrome.tabs.query({active: true, currentWindow: true}, tabs => {
  const tab = tabs[0]
  chrome.tabs.executeScript(tab.id, {
    code: 'document.documentElement.outerHTML'
  }, documentString => {
    page = document.createElement('html')
    page.innerHTML = documentString
    init()
  })
})


function init() {
  const price = getPrice();
  const name = page.querySelectorAll('[class*="name"]')
  const title = page.querySelector('title').innerText.trim()

  const titleNode = findTitleElement(title)

  printToScreen({ price, name, titleNode });
}


function getPrice() {
  const priceEls = Array.from(page.querySelectorAll('[class*="price"]'));
  console.log({priceEls})
  if (!priceEls.length) {
    console.warn('No price elements found...');
    return '';
  }

  const priceStrings = priceEls
    .map(node => node.innerText)
    .map(removeAllWhitespace);

  priceStrings.map(s => {
    console.log(s, '->>>', priceRegex, s.match(priceRegex))
  })
}


function removeAllWhitespace(string) {
  return string.replace(/\s/g,'');
}


function printToScreen({ price, name, title }) {
  const priceEl = document.createElement('div');
  priceEl.innerHTML = price;

  const nameEl = document.createElement('div');
  nameEl.innerHTML = name;

  const titleEl = document.createElement('div');
  titleEl.innerHTML = title;

  container.appendChild(priceEl);
  container.appendChild(nameEl);
  container.appendChild(titleEl);
  console.log({ price, name, title });
}

// find title:
// use page title
// find match in body

// find price:
// get title element
// look for first node with "price" in it immediately after 

function findTitleElement(title) {
  const firstHalf = title.substring(0, title.length / 2)
  const secondHalf = title.substring(title.length / 2)
  const body = page.querySelector('body')
  const elements = Array.from(body.querySelectorAll('*')).filter(node => {
    return node.innerText
      && (node.innerText.includes(firstHalf) || node.innerText.includes(secondHalf))
      && node.innerText.trim().length <= title.length
  })

  console.log('title nodes', {elements})
}