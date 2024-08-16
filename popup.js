document.addEventListener('DOMContentLoaded', function() {
    const resultsContainer = document.getElementById('results');
    
    console.log("DOMGuard popup loaded.");
  
    // Request findings from the background script
    chrome.runtime.sendMessage({ type: "getFindings" }, function(response) {
      if (response && response.length > 0) {
        response.forEach(finding => {
          const resultElement = document.createElement('div');
          resultElement.className = 'result';
          
          const sinkInfo = document.createElement('span');
          sinkInfo.className = 'sink-info';
          sinkInfo.textContent = `Sink: ${finding.sink}`;
          
          const detailsInfo = document.createElement('span');
          detailsInfo.className = 'details-info';
          detailsInfo.textContent = finding.details;
  
          resultElement.appendChild(sinkInfo);
          resultElement.appendChild(detailsInfo);
          resultsContainer.appendChild(resultElement);
        });
      } else {
        resultsContainer.textContent = "No findings detected.";
      }
    });
  });
  