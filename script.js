"use strict";

// ==================================================
// CONFIG
// ==================================================

const API_URL =
  "https://n10-discord-backend-new.onrender.com";

// ==================================================
// ELEMENTS
// ==================================================

const home =
  document.getElementById("home");

const registerPage =
  document.getElementById("registerPage");

const keyPage =
  document.getElementById("keyPage");

const registerButton =
  document.getElementById("registerButton");

const backButton =
  document.getElementById("backButton");

const registerForm =
  document.getElementById("registerForm");

const message =
  document.getElementById("message");

const discordInfo =
  document.getElementById("discordInfo");

const keyInput =
  document.getElementById("key");

const accessKeyDisplay =
  document.getElementById("accessKey");

const copyButton =
  document.getElementById("copyButton");

const copyMessage =
  document.getElementById("copyMessage");

const logoutButton =
  document.getElementById("logoutButton");

// ==================================================
// PAGE FUNCTIONS
// ==================================================

function showHome() {
  if (home) {
    home.classList.remove("hidden");
  }

  if (registerPage) {
    registerPage.classList.add("hidden");
  }

  if (keyPage) {
    keyPage.classList.add("hidden");
  }
}

function showRegister() {
  if (home) {
    home.classList.add("hidden");
  }

  if (registerPage) {
    registerPage.classList.remove("hidden");
  }

  if (keyPage) {
    keyPage.classList.add("hidden");
  }
}

function showKeyPage(accessKey) {
  if (home) {
    home.classList.add("hidden");
  }

  if (registerPage) {
    registerPage.classList.add("hidden");
  }

  if (keyPage) {
    keyPage.classList.remove("hidden");
  }

  if (accessKeyDisplay) {
    accessKeyDisplay.value =
      accessKey || "";
  }
}

// ==================================================
// URL PARAMETERS
// ==================================================

const params =
  new URLSearchParams(
    window.location.search
  );

const accessKeyFromURL =
  params.get("accessKey");

const errorFromURL =
  params.get("error");

const discordFromURL =
  params.get("discord");

// ==================================================
// ACCESS KEY FROM DISCORD
// ==================================================

if (accessKeyFromURL) {
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

  if (keyInput) {
    keyInput.value =
      accessKeyFromURL;

    keyInput.readOnly = true;
  }

  if (discordInfo) {
    discordInfo.classList.remove(
      "hidden"
    );
  }

  showRegister();

  console.log(
    "✅ Access Key received:",
    accessKeyFromURL
  );
}

// ==================================================
// DISCORD ERROR
// ==================================================

if (errorFromURL) {
  showHome();

  if (message) {
    message.style.color =
      "#ff5555";

    const errors = {
      invalid_oauth_state:
        "رابط Discord غير صالح أو انتهت صلاحيته.",

      discord_cancelled:
        "تم إلغاء تسجيل الدخول عبر Discord.",

      discord_token_error:
        "حدث خطأ أثناء الاتصال بـ Discord.",

      discord_user_error:
        "تعذر الحصول على معلومات Discord.",

      key_generation_failed:
        "تعذر إنشاء Access Key.",

      discord_error:
        "حدث خطأ أثناء تسجيل الدخول عبر Discord."
    };

    message.textContent =
      errors[errorFromURL] ||
      "حدث خطأ في Discord.";
  }

  console.error(
    "Discord error:",
    errorFromURL
  );
}

// ==================================================
// OPEN REGISTER BUTTON
// ==================================================

if (registerButton) {
  registerButton.addEventListener(
    "click",
    () => {
      showRegister();

      if (message) {
        message.textContent = "";
      }
    }
  );
}

// ==================================================
// BACK BUTTON
// ==================================================

if (backButton) {
  backButton.addEventListener(
    "click",
    () => {
      showHome();

      if (message) {
        message.textContent = "";
      }
    }
  );
}

// ==================================================
// REGISTER
// ==================================================

if (registerForm) {
  registerForm.addEventListener(
    "submit",
    async (event) => {
      event.preventDefault();

      const username =
        document
          .getElementById("username")
          ?.value
          .trim();

      const password =
        document
          .getElementById("password")
          ?.value || "";

      const confirmPassword =
        document
          .getElementById("confirm")
          ?.value || "";

      let accessKey =
        document
          .getElementById("key")
          ?.value
          .trim();

      const human =
        document
          .getElementById("human")
          ?.checked;

      // ==================================================
      // VALIDATION
      // ==================================================

      if (!username) {
        message.textContent =
          "الرجاء إدخال اسم المستخدم.";
        return;
      }

      if (!password) {
        message.textContent =
          "الرجاء إدخال كلمة المرور.";
        return;
      }

      if (!confirmPassword) {
        message.textContent =
          "الرجاء تأكيد كلمة المرور.";
        return;
      }

      if (!accessKey) {
        try {
          accessKey =
            localStorage.getItem(
              "n10AccessKey"
            ) || "";
        } catch {}

        if (keyInput) {
          keyInput.value =
            accessKey;
        }
      }

      if (!accessKey) {
        message.textContent =
          "الرجاء الحصول على Access Key من Discord.";
        return;
      }

      if (!human) {
        message.textContent =
          "الرجاء تأكيد أنك إنسان.";
        return;
      }

      if (
        !/^[a-zA-Z0-9_.-]{3,24}$/.test(
          username
        )
      ) {
        message.textContent =
          "اسم المستخدم يجب أن يكون بين 3 و24 حرفاً ويمكن أن يحتوي على الحروف والأرقام و _ و - و .";
        return;
      }

      if (password.length < 6) {
        message.textContent =
          "كلمة المرور يجب أن تحتوي على 6 أحرف على الأقل.";
        return;
      }

      if (
        password.length > 72
      ) {
        message.textContent =
          "كلمة المرور طويلة جداً.";
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

      if (
        !/^N10-[A-Za-z0-9]+$/.test(
          accessKey
        )
      ) {
        message.textContent =
          "Access Key غير صالح.";
        return;
      }

      // ==================================================
      // LOADING
      // ==================================================

      const submitButton =
        document.getElementById(
          "registerButtonSubmit"
        );

      if (submitButton) {
        submitButton.disabled =
          true;

        submitButton.textContent =
          "جاري التسجيل...";
      }

      message.style.color =
        "#a9c9e8";

      message.textContent =
        "جاري إنشاء الحساب...";

      // ==================================================
      // API REQUEST
      // ==================================================

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

        // ==================================================
        // API ERROR
        // ==================================================

        if (!response.ok) {
          message.style.color =
            "#ff5555";

          message.textContent =
            data.message ||
            "فشل إنشاء الحساب.";

          return;
        }

        // ==================================================
        // SUCCESS
        // ==================================================

        message.style.color =
          "#5cff8a";

        message.textContent =
          "✅ تم إنشاء الحساب بنجاح!";

        try {
          localStorage.setItem(
            "n10Username",
            username
          );

          localStorage.setItem(
            "n10AccessKey",
            data.accessKey ||
              accessKey
          );

          if (
            data.sessionToken
          ) {
            localStorage.setItem(
              "n10SessionToken",
              data.sessionToken
            );
          }

        } catch (error) {
          console.error(
            "Storage error:",
            error
          );
        }

        // ==================================================
        // REMOVE URL PARAMETERS
        // ==================================================

        try {
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );
        } catch {}

        // ==================================================
        // GO LOGIN
        // ==================================================

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

      } finally {
        if (submitButton) {
          submitButton.disabled =
            false;

          submitButton.textContent =
            "REGISTER";
        }
      }
    }
  );
}

// ==================================================
// COPY ACCESS KEY
// ==================================================

if (copyButton) {
  copyButton.addEventListener(
    "click",
    async () => {
      const key =
        accessKeyDisplay
          ?.value
          .trim();

      if (!key) {
        return;
      }

      try {
        await navigator.clipboard.writeText(
          key
        );

        if (copyMessage) {
          copyMessage.style.color =
            "#5cff8a";

          copyMessage.textContent =
            "✅ تم نسخ Access Key";
        }

      } catch {
        if (accessKeyDisplay) {
          accessKeyDisplay.select();
          document.execCommand(
            "copy"
          );
        }

        if (copyMessage) {
          copyMessage.style.color =
            "#5cff8a";

          copyMessage.textContent =
            "✅ تم نسخ Access Key";
        }
      }
    }
  );
}

// ==================================================
// LOGOUT
// ==================================================

if (logoutButton) {
  logoutButton.addEventListener(
    "click",
    async () => {
      const token =
        localStorage.getItem(
          "n10SessionToken"
        );

      try {
        if (token) {
          await fetch(
            `${API_URL}/api/logout`,
            {
              method: "POST",

              headers: {
                Authorization:
                  `Bearer ${token}`
              }
            }
          );
        }
      } catch (error) {
        console.error(
          "Logout error:",
          error
        );
      }

      try {
        localStorage.removeItem(
          "n10SessionToken"
        );

        localStorage.removeItem(
          "n10Username"
        );

        localStorage.removeItem(
          "n10AccessKey"
        );
      } catch {}

      window.location.href =
        "./index.html";
    }
  );
}

// ==================================================
// SHOW SAVED ACCESS KEY
// ==================================================

if (
  !accessKeyFromURL &&
  keyInput
) {
  try {
    const savedKey =
      localStorage.getItem(
        "n10AccessKey"
      );

    if (savedKey) {
      keyInput.value =
        savedKey;

      keyInput.readOnly =
        true;
    }
  } catch {}
}

// ==================================================
// INITIAL PAGE
// ==================================================

if (
  !accessKeyFromURL &&
  !errorFromURL
) {
  showHome();
}

// ==================================================
// CLEAN OLD URL
// ==================================================

if (
  accessKeyFromURL ||
  errorFromURL
) {
  try {
    window.history.replaceState(
      {},
      document.title,
      window.location.pathname +
        "#register"
    );
  } catch {}
}

console.log(
  "✅ N10 script.js loaded"
);
