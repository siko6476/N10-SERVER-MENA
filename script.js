"use strict";

/* =====================================================
   N10 SERVER MENA
   Frontend Script
   Compatible with:
   - index.html
   - server.js
===================================================== */

const API_URL =
  "https://n10-discord-backend-new.onrender.com";

/* =====================================================
   ELEMENTS
===================================================== */

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

const registerSubmit =
  document.getElementById(
    "registerButtonSubmit"
  );

const message =
  document.getElementById("message");

const discordInfo =
  document.getElementById("discordInfo");

const usernameInput =
  document.getElementById("username");

const passwordInput =
  document.getElementById("password");

const confirmInput =
  document.getElementById("confirm");

const keyInput =
  document.getElementById("key");

const humanInput =
  document.getElementById("human");

const accessKeyDisplay =
  document.getElementById("accessKey");

const copyButton =
  document.getElementById("copyButton");

const copyMessage =
  document.getElementById("copyMessage");

const logoutButton =
  document.getElementById("logoutButton");

/* =====================================================
   URL PARAMETERS
===================================================== */

const urlParams =
  new URLSearchParams(
    window.location.search
  );

const accessKeyFromURL =
  urlParams.get("accessKey");

const discordStatus =
  urlParams.get("discord");

const errorFromURL =
  urlParams.get("error");

const oldDiscordError =
  urlParams.get("discordError");

/* =====================================================
   STORAGE HELPERS
===================================================== */

function saveStorage(
  key,
  value
) {
  try {
    if (
      value !== null &&
      value !== undefined &&
      String(value) !== ""
    ) {
      localStorage.setItem(
        key,
        String(value)
      );
    }
  } catch (error) {
    console.error(
      "Storage error:",
      error
    );
  }
}

function getStorage(key) {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error(
      "Storage read error:",
      error
    );

    return null;
  }
}

function removeStorage(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(
      "Storage remove error:",
      error
    );
  }
}

/* =====================================================
   PAGE FUNCTIONS
===================================================== */

function showHome() {
  if (home) {
    home.classList.remove(
      "hidden"
    );
  }

  if (registerPage) {
    registerPage.classList.add(
      "hidden"
    );
  }

  if (keyPage) {
    keyPage.classList.add(
      "hidden"
    );
  }
}

function showRegister() {
  if (home) {
    home.classList.add(
      "hidden"
    );
  }

  if (registerPage) {
    registerPage.classList.remove(
      "hidden"
    );
  }

  if (keyPage) {
    keyPage.classList.add(
      "hidden"
    );
  }
}

function showKeyPage(accessKey) {
  if (home) {
    home.classList.add(
      "hidden"
    );
  }

  if (registerPage) {
    registerPage.classList.add(
      "hidden"
    );
  }

  if (keyPage) {
    keyPage.classList.remove(
      "hidden"
    );
  }

  if (accessKeyDisplay) {
    accessKeyDisplay.value =
      accessKey || "";
  }
}

/* =====================================================
   CLEAN URL
===================================================== */

function cleanURL() {
  try {
    window.history.replaceState(
      {},
      document.title,
      window.location.pathname
    );
  } catch (error) {
    console.error(
      "URL cleanup error:",
      error
    );
  }
}

/* =====================================================
   MESSAGE
===================================================== */

function setMessage(
  text,
  type = "error"
) {
  if (!message) {
    return;
  }

  message.textContent =
    text || "";

  if (type === "success") {
    message.classList.add(
      "success"
    );

    message.classList.remove(
      "error"
    );

    message.style.color =
      "#5cff8a";
  } else {
    message.classList.remove(
      "success"
    );

    message.classList.add(
      "error"
    );

    message.style.color =
      "#ff5555";
  }
}

/* =====================================================
   DISCORD ACCESS KEY
===================================================== */

function handleDiscordResult() {
  /*
    server.js returns:

    FRONTEND_URL?accessKey=N10-...&discord=new

    OR

    FRONTEND_URL?accessKey=N10-...&discord=existing

    OR

    FRONTEND_URL?error=...
  */

  if (accessKeyFromURL) {
    saveStorage(
      "n10AccessKey",
      accessKeyFromURL
    );

    /*
      If Discord says this account already exists,
      don't try to register again.
      Send the user to login.
    */

    if (
      discordStatus ===
      "existing"
    ) {
      showHome();

      setTimeout(() => {
        window.location.href =
          "./login.html";
      }, 700);

      return;
    }

    /*
      New Discord user:
      automatically open registration.
    */

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

    /*
      Remove Discord parameters
      only after saving the key.
    */

    cleanURL();

    return;
  }

  /*
    Discord cancelled or server returned an error.
  */

  const discordError =
    errorFromURL ||
    oldDiscordError;

  if (discordError) {
    showHome();

    if (message) {
      message.style.color =
        "#ff5555";

      message.textContent =
        "❌ حدث خطأ أثناء تسجيل الدخول عبر Discord: " +
        discordError;
    }

    cleanURL();

    return;
  }
}

/* =====================================================
   REGISTER BUTTON
===================================================== */

if (registerButton) {
  registerButton.addEventListener(
    "click",
    () => {
      /*
        If there is already a key saved,
        automatically put it into the form.
      */

      const savedKey =
        getStorage(
          "n10AccessKey"
        );

      if (
        savedKey &&
        keyInput &&
        !keyInput.value
      ) {
        keyInput.value =
          savedKey;

        keyInput.readOnly = true;

        if (discordInfo) {
          discordInfo.classList.remove(
            "hidden"
          );
        }
      }

      showRegister();
    }
  );
}

/* =====================================================
   BACK BUTTON
===================================================== */

if (backButton) {
  backButton.addEventListener(
    "click",
    () => {
      showHome();

      setMessage(
        ""
      );
    }
  );
}

/* =====================================================
   REGISTER
===================================================== */

if (registerForm) {
  registerForm.addEventListener(
    "submit",
    async (event) => {
      event.preventDefault();

      if (
        registerSubmit &&
        registerSubmit.disabled
      ) {
        return;
      }

      const username =
        usernameInput
          ? usernameInput.value.trim()
          : "";

      const password =
        passwordInput
          ? passwordInput.value
          : "";

      const confirmPassword =
        confirmInput
          ? confirmInput.value
          : "";

      const accessKey =
        keyInput
          ? keyInput.value.trim()
          : "";

      const human =
        humanInput
          ? humanInput.checked
          : false;

      /* -------------------------------------------------
         VALIDATION
      ------------------------------------------------- */

      if (
        !username ||
        !password ||
        !confirmPassword ||
        !accessKey
      ) {
        setMessage(
          "الرجاء ملء جميع الخانات."
        );

        return;
      }

      if (
        !/^[a-zA-Z0-9_.-]{3,24}$/.test(
          username
        )
      ) {
        setMessage(
          "اسم المستخدم يجب أن يكون بين 3 و24 حرفاً، ويمكن أن يحتوي على الحروف والأرقام و _ و - و ."
        );

        return;
      }

      if (
        password.length < 6
      ) {
        setMessage(
          "كلمة المرور يجب أن تحتوي على 6 أحرف على الأقل."
        );

        return;
      }

      /*
        server.js checks UTF-8 byte length <= 72.
      */

      const passwordBytes =
        new TextEncoder().encode(
          password
        ).length;

      if (
        passwordBytes > 72
      ) {
        setMessage(
          "كلمة المرور طويلة جداً."
        );

        return;
      }

      if (
        password !==
        confirmPassword
      ) {
        setMessage(
          "كلمتا المرور غير متطابقتين."
        );

        return;
      }

      if (
        !/^N10-[A-Za-z0-9]+$/.test(
          accessKey
        )
      ) {
        setMessage(
          "Access Key غير صالح."
        );

        return;
      }

      if (!human) {
        setMessage(
          "الرجاء تأكيد أنك إنسان."
        );

        return;
      }

      /* -------------------------------------------------
         LOADING
      ------------------------------------------------- */

      setMessage(
        "جاري إنشاء الحساب..."
      );

      if (registerSubmit) {
        registerSubmit.disabled =
          true;

        registerSubmit.classList.add(
          "loading"
        );

        registerSubmit.textContent =
          "جاري التسجيل...";
      }

      /* -------------------------------------------------
         REQUEST
      ------------------------------------------------- */

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
        } catch (jsonError) {
          console.error(
            "JSON error:",
            jsonError
          );
        }

        /* -------------------------------------------------
           SERVER ERROR
        ------------------------------------------------- */

        if (!response.ok) {
          setMessage(
            data.message ||
            `فشل إنشاء الحساب. رمز الخطأ: ${response.status}`
          );

          return;
        }

        /* -------------------------------------------------
           SUCCESS
        ------------------------------------------------- */

        setMessage(
          data.message ||
          "✅ تم إنشاء الحساب بنجاح!",
          "success"
        );

        saveStorage(
          "n10Username",
          username
        );

        /*
          server.js returns accessKey
          after successful registration.
        */

        if (data.accessKey) {
          saveStorage(
            "n10AccessKey",
            data.accessKey
          );
        } else {
          saveStorage(
            "n10AccessKey",
            accessKey
          );
        }

        /*
          IMPORTANT:
          Current server.js does NOT return
          sessionToken during registration,
          so we don't try to save one here.
        */

        /*
          Wait a little so the user can see
          the success message, then go to login.
        */

        setTimeout(() => {
          window.location.href =
            "./login.html";
        }, 1200);

      } catch (error) {
        console.error(
          "Register request error:",
          error
        );

        setMessage(
          "❌ تعذر الاتصال بسيرفر N10. تأكد أن السيرفر يعمل ثم حاول مرة أخرى."
        );
      } finally {
        if (registerSubmit) {
          registerSubmit.disabled =
            false;

          registerSubmit.classList.remove(
            "loading"
          );

          registerSubmit.textContent =
            "REGISTER";
        }
      }
    }
  );
}

/* =====================================================
   COPY ACCESS KEY
===================================================== */

if (copyButton) {
  copyButton.addEventListener(
    "click",
    async () => {
      const key =
        accessKeyDisplay
          ? accessKeyDisplay.value
          : "";

      if (!key) {
        if (copyMessage) {
          copyMessage.textContent =
            "لا يوجد Access Key لنسخه.";
        }

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
            "✅ تم نسخ Access Key.";
        }
      } catch (error) {
        console.error(
          "Clipboard error:",
          error
        );

        /*
          Fallback for older browsers.
        */

        if (accessKeyDisplay) {
          accessKeyDisplay.select();
          accessKeyDisplay.setSelectionRange(
            0,
            99999
          );

          try {
            document.execCommand(
              "copy"
            );

            if (copyMessage) {
              copyMessage.style.color =
                "#5cff8a";

              copyMessage.textContent =
                "✅ تم نسخ Access Key.";
            }
          } catch {
            if (copyMessage) {
              copyMessage.style.color =
                "#ff5555";

              copyMessage.textContent =
                "❌ لم يتم النسخ. انسخ المفتاح يدوياً.";
            }
          }
        }
      }
    }
  );
}

/* =====================================================
   LOGOUT
===================================================== */

if (logoutButton) {
  logoutButton.addEventListener(
    "click",
    async () => {
      const token =
        getStorage(
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
      } finally {
        removeStorage(
          "n10SessionToken"
        );

        removeStorage(
          "n10Username"
        );

        /*
          Keep Access Key because it may still
          be needed by the account.
        */

        showHome();

        if (copyMessage) {
          copyMessage.textContent =
            "";
        }
      }
    }
  );
}

/* =====================================================
   COOKIE SUPPORT
===================================================== */

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

      saveStorage(
        "n10CookiesAccepted",
        "true"
      );
    }
  );
}

if (
  getStorage(
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

/* =====================================================
   INITIAL PAGE
===================================================== */

handleDiscordResult();
