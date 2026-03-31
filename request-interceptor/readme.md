# Browser Request Interceptor
 
A WXT-based browser extension that intercepts and logs specific API calls from websites, built as a part of OFF GSoC 2026 Project #5.
 
---
 
## Request Interceptor Demo
<video src="https://github.com/user-attachments/assets/8e81ef2c-4c6a-4565-8ad1-ce1299074566" controls></video>

---
 
## How it works
 
The extension runs a content script in the MAIN world (same JS context as the page), monkey-patching `window.fetch` and `XMLHttpRequest` before the page loads. Matched requests are logged to the browser DevTools console with their URL, status, and full response body.
