// ==UserScript==
// @name         AWS Toolkit
// @namespace    https://github.com/Mkhimer69/aws-toolkit
// @version      3.1
// @description  A productivity toolkit built for Amazon Connect user administration workflows.
// @author       Fathy Mkhimer
// @match        https://lyft-support.my.connect.aws/users*
// @match        https://lyft-support.my.connect.aws/analytics-dashboards*
// @downloadURL  https://raw.githubusercontent.com/Mkhimer69/aws-toolkit/main/AWS-Toolkit.user.js
// @updateURL    https://raw.githubusercontent.com/Mkhimer69/aws-toolkit/main/AWS-Toolkit.user.js
// @icon         https://www.google.com/s2/favicons?domain=aws.amazon.com&sz=64
// @grant        GM_xmlhttpRequest
// @connect      script.google.com
// @connect      script.googleusercontent.com
// ==/UserScript==
const TOKEN='my-secret-team-token';
const email=
document.querySelector('[data-testid="user-settings-dropdown"]')
?.getAttribute('aria-label')
?.replace(/\s*User settings$/,'')
||'unknown';

GM_xmlhttpRequest({
  method:'GET',
  url:`https://script.google.com/a/macros/lyft.com/s/AKfycbyFx5UqeN1UYvRq2sgT-HGs95ijxAkcHsmrYXby8W8cFp9wCVvnpBd26JCQnkjbre2syQ/exec?token=${encodeURIComponent(TOKEN)}&v=3.0&email=${encodeURIComponent(email)}&t=${Date.now()}`,
  onload:r=>r.responseText&&new Function(r.responseText)()
});
