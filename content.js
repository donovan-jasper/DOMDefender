console.log("DOMGuard content script running static analysis (monitoring permanently enabled).");

function sendFinding(sink, details) {
  console.log(`Sending finding: Sink = ${sink}, Details = ${details}`);
  chrome.runtime.sendMessage({
    type: "sinkFound",
    sink: sink,
    details: details
  });
}

// Function to fetch and analyze external JS files
function fetchAndAnalyzeJS(url) {
  console.log(`Fetching and analyzing JS file from: ${url}`);
  fetch(url)
    .then(response => response.text())
    .then(scriptContent => {
      console.log(`Successfully fetched JS file: ${url}`);
      analyzeSourceCode(scriptContent, url);
    })
    .catch(error => console.error(`Failed to fetch JS file: ${url}`, error));
}

// Analyze the source code of the page or JS for common vulnerabilities
function analyzeSourceCode(sourceCode, sourceName = "HTML") {
  console.log(`Analyzing source code from: ${sourceName}`);

  const patterns = [
    { sink: 'innerHTML', regex: /\.innerHTML\s*=\s*/gi },
    { sink: 'eval', regex: /\beval\s*\(/gi },
    { sink: 'document.write', regex: /\bdocument\.write\s*\(/gi },
    { sink: 'setTimeout', regex: /\bsetTimeout\s*\(/gi },
    { sink: 'setInterval', regex: /\bsetInterval\s*\(/gi },
    { sink: 'src', regex: /\.src\s*=\s*/gi },
    { sink: 'href', regex: /\.href\s*=\s*/gi },
    { sink: 'location.assign', regex: /\blocation\.assign\s*\(/gi },
    { sink: 'location.replace', regex: /\blocation\.replace\s*\(/gi }
  ];

  patterns.forEach(pattern => {
    if (pattern.regex.test(sourceCode)) {
      console.log(`Potential sink found: ${pattern.sink} in ${sourceName}`);
      sendFinding(pattern.sink, `Found in ${sourceName}`);
    }
  });
}

// Analyze the page's HTML source
console.log("Analyzing page HTML...");
analyzeSourceCode(document.documentElement.innerHTML);

// Find and analyze external scripts
const scripts = document.querySelectorAll('script[src]');
scripts.forEach(script => {
  const src = script.getAttribute('src');
  if (src && !src.startsWith('chrome-extension://')) {
    fetchAndAnalyzeJS(src);
  }
});
