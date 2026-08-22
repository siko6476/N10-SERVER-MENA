const API_URL = "https://n10-discord-backend-new.onrender.com";

const form = document.getElementById("registerForm");
const message = document.getElementById("message");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document
      .getElementById("username")
      .value
      .trim();

    const password = document
      .getElementById("password")
      .value;

    const confirmPassword = document
      .getElementById("confirm")
      .value;

    const accessKey = document
      .getElementById("key")
      .value
      .trim();

    const human = document
      .getElementById("human")
      .checked;

    message.className = "";
    message.style.color = "#ff5555";
    message.textContent = "جاري إنشاء الحساب...";

    if (!username || !password || !confirmPassword || !accessKey) {
      message.textContent =
        "الرجاء ملء جميع الخانات.";
      return;
    }

    if (username.length < 3) {
      message.textContent =
        "اسم المستخدم يجب أن يحتوي على 3 أحرف على الأقل.";
      return;
    }

    if (username.length > 24) {
      message.textContent =
        "اسم المستخدم طويل جداً.";
      return;
    }

    if (password.length < 6) {
      message.textContent =
        "كلمة المرور يجب أن تحتوي على 6 أحرف على الأقل.";
      return;
    }

    if (password !== confirmPassword) {
      message.textContent =
        "كلمتا المرور غير متطابقتين.";
      return;
    }

    if (!human) {
      message.textContent =
        "الرجاء تأكيد أنك إنسان.";
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/register`,
        {
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
        }
      );

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        message.textContent =
          data.message ||
          "فشل إنشاء الحساب.";
        return;
      }

      message.style.color = "#5cff8a";

      message.textContent =
        "✅ تم إنشاء الحساب بنجاح!";

      form.reset();

      setTimeout(() => {
        window.location.href = "./login.html";
      }, 1200);

    } catch (error) {
      console.error(error);

      message.style.color = "#ff5555";

      message.textContent =
        "❌ تعذر الاتصال بسيرفر N10. حاول مرة أخرى.";
    }
  });
}


/*
  Cookies
*/

const cookieButton =
  document.querySelector(".cookie button");

if (cookieButton) {
  cookieButton.addEventListener("click", () => {

    const cookie =
      document.querySelector(".cookie");

    if (cookie) {
      cookie.remove();
    }

    localStorage.setItem(
      "n10CookiesAccepted",
      "true"
    );
  });
}


/*
  إخفاء Cookies إذا سبق للمستخدم قبولها
*/

if (
  localStorage.getItem("n10CookiesAccepted") === "true"
) {
  const cookie =
    document.querySelector(".cookie");

  if (cookie) {
    cookie.remove();
  }
}
