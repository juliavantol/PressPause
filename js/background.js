chrome.action.onClicked.addListener((tab) => {
	chrome.scripting.executeScript({
	  target: {tabId: tab.id},
	  files: ['js/toolbar.js', 'js/functions.js', 'js/sync.js']
	});
  });
  