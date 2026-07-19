"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAccountPageHtml = deleteAccountPageHtml;
function deleteAccountPageHtml() {
    return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Delete Your FaithfulMatch.love Account</title>
<style>
  :root { color-scheme: light; }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif;
    background: #F7F5FB;
    color: #332E81;
    display: flex;
    min-height: 100vh;
    align-items: center;
    justify-content: center;
    padding: 24px;
  }
  .card {
    width: 100%;
    max-width: 480px;
    background: #fff;
    border-radius: 20px;
    padding: 36px 32px;
    box-shadow: 0 12px 40px rgba(51, 46, 129, 0.12);
  }
  h1 { font-size: 22px; margin: 0 0 8px; }
  p { color: #667085; line-height: 1.6; font-size: 15px; }
  label { display: block; font-weight: 600; font-size: 14px; margin: 20px 0 6px; }
  input[type="email"] {
    width: 100%;
    padding: 14px 16px;
    border-radius: 12px;
    border: 1px solid #E4E0F2;
    font-size: 15px;
    outline: none;
  }
  input[type="email"]:focus { border-color: #6D4AFF; }
  button {
    width: 100%;
    margin-top: 24px;
    padding: 16px;
    border: none;
    border-radius: 24px;
    background: linear-gradient(135deg, #332E81, #6D4AFF);
    color: #fff;
    font-weight: 600;
    font-size: 15px;
    cursor: pointer;
  }
  button:disabled { opacity: 0.6; cursor: default; }
  .msg { margin-top: 16px; font-size: 14px; line-height: 1.5; }
  .msg.success { color: #1a7f4b; }
  .msg.error { color: #c0392b; }
</style>
</head>
<body>
  <div class="card">
    <h1>Request Account Deletion</h1>
    <p>
      Enter the email address on your FaithfulMatch.love account. We'll review
      your request and permanently delete your account and personal data
      within 30 days, then email you a confirmation.
    </p>
    <form id="delete-form">
      <label for="email">Email address</label>
      <input type="email" id="email" name="email" required placeholder="you@example.com" />
      <button type="submit" id="submit-btn">Request Deletion</button>
      <div id="msg" class="msg" role="status"></div>
    </form>
  </div>
  <script>
    var form = document.getElementById('delete-form');
    var btn = document.getElementById('submit-btn');
    var msg = document.getElementById('msg');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = document.getElementById('email').value.trim();
      if (!email) return;

      btn.disabled = true;
      btn.textContent = 'Submitting...';
      msg.textContent = '';
      msg.className = 'msg';

      fetch('/api/v1/auth/deletion-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email }),
      })
        .then(function (res) { return res.json().then(function (body) { return { ok: res.ok, body: body }; }); })
        .then(function (result) {
          if (result.ok) {
            form.querySelector('input').setAttribute('disabled', 'true');
            btn.style.display = 'none';
            msg.className = 'msg success';
            msg.textContent = (result.body && result.body.data && result.body.data.message)
              || "If an account with that email exists, we've received your request.";
          } else {
            btn.disabled = false;
            btn.textContent = 'Request Deletion';
            msg.className = 'msg error';
            msg.textContent = 'Something went wrong. Please try again or email support@faithfulmatch.love directly.';
          }
        })
        .catch(function () {
          btn.disabled = false;
          btn.textContent = 'Request Deletion';
          msg.className = 'msg error';
          msg.textContent = 'Network error. Please try again or email support@faithfulmatch.love directly.';
        });
    });
  </script>
</body>
</html>`;
}
//# sourceMappingURL=delete-account.page.js.map