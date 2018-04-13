let page, pageURL, pageTitle
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
  const price = page.querySelectorAll('[class*="price"]')
  const name = page.querySelectorAll('[class*="name"]')
  const title = page.querySelector('title').innerText.trim()

  const titleNode = findTitleElement(title)
  console.log('TitleNode', titleNode)
  console.log({price, name, title})
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

  console.log({elements})
}