// Run the content script when the extension icon is clicked
chrome.browserAction.onClicked.addListener(function(tab) {

  chrome.tabs.executeScript({
  file: 'js/sync.js'
  });

});
