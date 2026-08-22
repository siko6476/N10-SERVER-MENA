const API_URL = "https://n10-discord-backend-new.onrender.com";

const form = document.getElementById("registerForm");
const message = document.getElementById("message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm").value;
  const accessKey = document.getElementById("key").value.trim();

  message.style.color = "#ff5555";
  message.textContent = "Creating account...";

  if (!username || !password || !confirmPassword || !accessKey) {
    message.textContent = "All fields are required.";
    return;
  }

  if (username.length < 3) {
    message.textContent = "Username must contain at least 3 characters.";
    return;
  }

  if (password.length < 6) {
    message.textContent = "Password must contain at least 6 characters.";
    return;
  }

  if (password !== confirmPassword) {
    message.textContent = "Passwords do not match.";
    return;
  }

  try {
    const response = await fetch(`${API_URL}/api/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: username,
        password: password,
        confirmPassword: confirmPassword,
        accessKey: accessKey
      })
    });

    const data = await response.json();

    if (!response.ok) {
      message.textContent = data.message || "Registration failed.";
      return;
    }

    message.style.color = "#5cff8a";
    message.textContent = "Account created successfully!";

    form.reset();

  } catch (error) {
    console.error(error);
    message.style.color = "#ff5555";
    message.textContent =
      "Unable to connect to N10 server. Please try again.";
  }
});

const cookieButton = document.querySelector(".cookie button");

if (cookieButton) {
  cookieButton.addEventListener("click", () => {
    document.querySelector(".cookie").remove();
  });
}
