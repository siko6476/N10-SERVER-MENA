const form = document.getElementById('registerForm');
const message = document.getElementById('message');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  const confirm = document.getElementById('confirm').value;
  const key = document.getElementById('key').value.trim();

  if (password !== confirm) {
    message.textContent = 'Passwords do not match.';
    return;
  }

  if (password.length < 6) {
    message.textContent = 'Password must contain at least 6 characters.';
    return;
  }

  if (!key) {
    message.textContent = 'Please enter your access key.';
    return;
  }

  // Front-end demo only. Real account creation needs a backend/API.
  message.style.color = '#5cff8a';
  message.textContent = `Account "${username}" is ready to be connected to the server.`;
});

document.querySelector('.cookie button').addEventListener('click', () => {
  document.querySelector('.cookie').remove();
});
