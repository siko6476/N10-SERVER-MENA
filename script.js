const API_URL =
  "https://n10-discord-backend-new.onrender.com";

const form =
  document.getElementById("registerForm");

const message =
  document.getElementById("message");

// ==================================================
// URL PARAMETERS
// ==================================================

const params =
  new URLSearchParams(
    window.location.search
  );

const accessKeyFromURL =
  params.get("accessKey");

const discordError =
  params.get("discordError");

const sessionTokenFromURL =
  params.get("sessionToken");

const usernameFromURL =
  params.get("username");

// ==================================================
// SESSION FROM DISCORD
// ==================================================

if (sessionTokenFromURL) {
  try {
    localStorage.setItem(
      "n10SessionToken",
      sessionTokenFromURL
    );

    if (usernameFromURL) {
      localStorage.setItem(
        "n10Username",
        usernameFromURL
      );
    }

    if (accessKeyFromURL) {
      localStorage.setItem(
        "n10AccessKey",
        accessKeyFromURL
      );
    }

  } catch (error) {
    console.error(
      "Session storage error:",
      error
    );
  }
}

// ==================================================
// ACCESS KEY FROM DISCORD
// ==================================================

if (accessKeyFromURL) {
  const keyInput =
    document.getElementById("key");

  if (keyInput) {
    keyInput.value =
      accessKeyFromURL;

    keyInput.readOnly = true;
  }

  const discordInfo =
    document.getElementById(
      "discordInfo"
    );

  if (discordInfo) {
    discordInfo.classList.remove(
      "hidden"
    );
  }

  try {
    localStorage.setItem(
      "n10AccessKey",
      accessKeyFromURL
    );
  } catch (error) {
    console.error(
      "Access Key storage error:",
      error
    );
  }

  if (
    typeof showRegister ===
    "function"
  ) {
    showRegister();
  }
}

// ==================================================
// DISCORD ERROR
// ==================================================

if (discordError) {
  if (message) {
    message.style.color =
      "#ff5555";

    message.textContent =
      discordError;
  }

  if (
    typeof showHome ===
    "function"
  ) {
    showHome();
  }
}

// ==================================================
// REGISTER
// ==================================================

if (form) {
  form.addEventListener(
    "submit",
    async (e) => {
      e.preventDefault();

      const username =
        document
          .getElementById("username")
          .value
          .trim();

      const password =
        document
          .getElementById("password")
          .value;

      const confirmPassword =
        document
          .getElementById("confirm")
          .value;

      const accessKey =
        document
          .getElementById("key")
          .value
          .trim();

      const human =
        document
          .getElementById("human")
          .checked;

      message.style.color =
        "#ff5555";

      message.textContent =
        "جاري إنشاء الحساب...";

      // ------------------------------------------------
      // Validation
      // ------------------------------------------------

      if (
        !username ||
        !password ||
        !confirmPassword ||
        !accessKey
      ) {
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

      if (
        !/^[a-zA-Z0-9_-]+$/.test(
          username
        )
      ) {
        message.textContent =
          "اسم المستخدم يمكن أن يحتوي على الحروف والأرقام و _ و - فقط.";

        return;
      }

      if (password.length < 6) {
        message.textContent =
          "كلمة المرور يجب أن تحتوي على 6 أحرف على الأقل.";

        return;
      }

      if (
        password !==
        confirmPassword
      ) {
        message.textContent =
          "كلمتا المرور غير متطابقتين.";

        return;
      }

      if (!human) {
        message.textContent =
          "الرجاء تأكيد أنك إنسان.";

        return;
      }

      // ------------------------------------------------
      // Request
      // ------------------------------------------------

      try {
        const response =
          await fetch(
            `${API_URL}/api/register`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json"
              },

              body: JSON.stringify({
                username,
                password,
                confirmPassword,
                accessKey
              })
            }
          );

        let data = {};

        try {
          data =
            await response.json();
        } catch {
          data = {};
        }

        // ------------------------------------------------
        // Error
        // ------------------------------------------------

        if (!response.ok) {
          message.style.color =
            "#ff5555";

          message.textContent =
            data.message ||
            "فشل إنشاء الحساب.";

          return;
        }

        // ------------------------------------------------
        // Success
        // ------------------------------------------------

        message.style.color =
          "#5cff8a";

        message.textContent =
          "✅ تم إنشاء الحساب بنجاح!";

        if (data.sessionToken) {
          localStorage.setItem(
            "n10SessionToken",
            data.sessionToken
          );
        }

        if (data.accessKey) {
          localStorage.setItem(
            "n10AccessKey",
            data.accessKey
          );
        }

        localStorage.setItem(
          "n10Username",
          username
        );

        form.reset();

        // المفتاح كان readonly، نرجعه
        const keyInput =
          document.getElementById(
            "key"
          );

        if (keyInput) {
          keyInput.value =
            accessKey;

          keyInput.readOnly =
            true;
        }

        // إزالة query من الرابط
        try {
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );
        } catch {}

        setTimeout(() => {
          window.location.href =
            "./login.html";
        }, 1200);

      } catch (error) {
        console.error(
          "Register Error:",
          error
        );

        message.style.color =
          "#ff5555";

        message.textContent =
          "❌ تعذر الاتصال بسيرفر N10. حاول مرة أخرى.";
      }
    }
  );
}

// ==================================================
// COOKIES
// ==================================================

const cookieButton =
  document.querySelector(
    ".cookie button"
  );

if (cookieButton) {
  cookieButton.addEventListener(
    "click",
    () => {
      const cookie =
        document.querySelector(
          ".cookie"
        );

      if (cookie) {
        cookie.remove();
      }

      localStorage.setItem(
        "n10CookiesAccepted",
        "true"
      );
    }
  );
}

if (
  localStorage.getItem(
    "n10CookiesAccepted"
  ) === "true"
) {
  const cookie =
    document.querySelector(
      ".cookie"
    );

  if (cookie) {
    cookie.remove();
  }
}
