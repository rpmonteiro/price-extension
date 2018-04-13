chrome.runtime.onMessage.addListener((request, options, sendResponse) => {
  chrome.tabs.executeScript(options.tabId, {}, () => {
    sendResponse({data: document, success: true});
  })
});