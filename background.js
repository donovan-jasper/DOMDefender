// Store findings in a list
let findings = [];

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type === "sinkFound") {
    console.log(`Background received finding: Sink = ${request.sink}, Details = ${request.details}`);
    findings.push({ sink: request.sink, details: request.details });
  }
});

// Provide findings to the popup when requested
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type === "getFindings") {
    sendResponse(findings);
  }
});
