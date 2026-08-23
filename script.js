"use strict";

/* =====================================================
   N10 SERVER MENA
   Frontend Script
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

const loginButton =
  document.getElementById("loginButton");

const loginFromRegister =
  document.getElementById(
    "loginFromRegister"
  );

const backButton =
  document.getElementById("backButton");

const registerForm =
  document.getElementById(
    "registerForm"
  );

const message =
  document.getElementById("message");

const discordInfo =
  document.getElementById(
    "discordInfo"
  );

const keyInput =
  document.getElementById("key");

const accessKeyDisplay =
  document.getElementById(
    "accessKey"
  );

const copyButton =
  document.getElementById(
    "copyButton"
  );

const copyMessage =
  document.getElementById(
    "copyMessage"
  );

const logoutButton =
  document.getElementById(
    "logoutButton"
  );

/* =====================================================
   LOCAL STORAGE
===================================================== */

const STORAGE = {
  token: "n10SessionToken",
  username: "n10Username",
  accessKey: "n10AccessKey"
};

function saveToken(token) {
  if (!token) return;

  localStorage.setItem(
    STORAGE.token,
    token
  );
}

function saveUsername(username) {
  if (!username) return;

  localStorage.setItem(
    STORAGE.username,
    username
  );
}

function saveAccessKey(key) {
  if (!key) return;

  localStorage.setItem(
    STORAGE.accessKey,
    key
  );
}

function getToken() {
  return localStorage.getItem(
    STORAGE.token
  );
}

function getAccessKey() {
  return localStorage.getItem(
    STORAGE.accessKey
  );
}

function clearSession() {
  localStorage.removeItem(
    STORAGE.token
  );

  localStorage.removeItem(
    STORAGE.username
  );

  localStorage.removeItem(
    STORAGE.accessKey
  );
}

/* =====================================================
   PAGE CONTROL
===================================================== */

function hideAllPages() {
  if (home) {
    home.classList.add("hidden");
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

function showHome() {
  hideAllPages();

  if (home) {
    home.classList.remove(
      "hidden"
    );
  }
}

function showRegister() {
  hideAllPages();

  if (registerPage) {
    registerPage.classList.remove(
      "hidden"
    );
  }
}

function showKeyPage(accessKey) {
  hideAllPages();

  if (keyPage) {
    keyPage.classList.remove(
      "hidden"
    );
  }

  if (
    accessKeyDisplay &&
    accessKey
  ) {
    accessKeyDisplay.value =
      accessKey;
  }
}

/* =====================================================
   URL PARAMETERS
===================================================== */

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
   DISCORD ACCESS KEY
===================================================== */

if (accessKeyFromURL) {
  saveAccessKey(
    accessKeyFromURL
  );

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

  cleanURL();
}

/* =====================================================
   SESSION FROM URL
===================================================== */

if (sessionTokenFromURL) {
  saveToken(
    sessionTokenFromURL
  );

  if (usernameFromURL) {
    saveUsername(
      usernameFromURL
    );
  }

  if (accessKeyFromURL) {
    saveAccessKey(
      accessKeyFromURL
    );
  }

  cleanURL();
}

/* =====================================================
   DISCORD ERROR
===================================================== */

if (discordError) {
  showHome();

  if (message) {
    message.textContent =
      discordError;

    message.classList.add(
      "error"
    );
  }

  cleanURL();
}

/* =====================================================
   REGISTER BUTTON
===================================================== */

if (registerButton) {
  registerButton.addEventListener(
    "click",
    () => {
      const savedKey =
        getAccessKey();

      if (
        keyInput &&
        savedKey
      ) {
        keyInput.value =
          savedKey;

        keyInput.readOnly =
          true;
      }

      showRegister();
    }
  );
}

/* =====================================================
   LOGIN BUTTON
===================================================== */

if (loginButton) {
  loginButton.addEventListener(
    "click",
    () => {
      window.location.href =
        "./login.html";
    }
  );
}

/* =====================================================
   LOGIN FROM REGISTER
===================================================== */

if (loginFromRegister) {
  loginFromRegister.addEventListener(
    "click",
    () => {
      window.location.href =
        "./login.html";
    }
  );
}

/* =====================================================
   BACK
===================================================== */

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

/* =====================================================
   REGISTER
===================================================== */

if (registerForm) {
  registerForm.addEventListener(
    "submit",
    async (event) => {
      event.preventDefault();

      const username =
        document
          .getElementById(
            "username"
          )
          ?.value
          .trim() || "";

      const password =
        document
          .getElementById(
            "password"
          )
          ?.value || "";

      const confirmPassword =
        document
          .getElementById(
            "confirm"
          )
          ?.value || "";

      const accessKey =
        document
          .getElementById(
            "key"
          )
          ?.value
          .trim() || "";

      const human =
        document
          .getElementById(
            "human"
          )?.checked || false;

      if (message) {
        message.classList.remove(
          "success"
        );

        message.classList.add(
          "error"
        );

        message.textContent =
          "";
      }

      /* VALIDATION */

      if (
        !username ||
        !password ||
        !confirmPassword ||
        !accessKey
      ) {
        if (message) {
          message.textContent =
            "الرجاء ملء جميع الخانات.";
        }

        return;
      }

      if (
        !/^[a-zA-Z0-9_.-]{3,24}$/.test(
          username
        )
      ) {
        if (message) {
          message.textContent =
            "اسم المستخدم يجب أن يكون بين 3 و24 حرفاً ويمكن أن يحتوي على الحروف والأرقام و _ و - و .";
        }

        return;
      }

      if (
        new TextEncoder()
          .encode(password)
          .length < 6
      ) {
        if (message) {
          message.textContent =
            "كلمة المرور يجب أن تحتوي على 6 بايت على الأقل.";
        }

        return;
      }

      if (
        new TextEncoder()
          .encode(password)
          .length > 72
      ) {
        if (message) {
          message.textContent =
            "كلمة المرور طويلة جداً.";
        }

        return;
      }

      if (
        password !==
        confirmPassword
      ) {
        if (message) {
          message.textContent =
            "كلمتا المرور غير متطابقتين.";
        }

        return;
      }

      if (
        !/^N10-[A-Za-z0-9]+$/.test(
          accessKey
        )
      ) {
        if (message) {
          message.textContent =
            "Access Key غير صالح.";
        }

        return;
      }

      if (!human) {
        if (message) {
          message.textContent =
            "الرجاء تأكيد أنك إنسان.";
        }

        return;
      }

      /* LOADING */

      const submitButton =
        document.getElementById(
          "registerButtonSubmit"
        );

      if (submitButton) {
        submitButton.classList.add(
          "loading"
        );

        submitButton.disabled =
          true;

        submitButton.textContent =
          "جاري التسجيل...";
      }

      if (message) {
        message.classList.remove(
          "error"
        );

        message.textContent =
          "جاري إنشاء الحساب...";
      }

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

              body:
                JSON.stringify({
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

        if (!response.ok) {
          throw new Error(
            data.message ||
            "فشل إنشاء الحساب."
          );
        }

        /* SUCCESS */

        if (
          data.sessionToken
        ) {
          saveToken(
            data.sessionToken
          );
        }

        if (
          data.accessKey
        ) {
          saveAccessKey(
            data.accessKey
          );
        } else {
          saveAccessKey(
            accessKey
          );
        }

        saveUsername(
          username
        );

        if (message) {
          message.classList.remove(
            "error"
          );

          message.classList.add(
            "success"
          );

          message.textContent =
            "✅ تم إنشاء الحساب بنجاح!";
        }

        if (
          registerForm
        ) {
          registerForm.reset();
        }

        if (keyInput) {
          keyInput.value =
            accessKey;

          keyInput.readOnly =
            true;
        }

        setTimeout(() => {
          const savedKey =
            getAccessKey();

          if (savedKey) {
            showKeyPage(
              savedKey
            );
          } else {
            window.location.href =
              "./login.html";
          }
        }, 800);

      } catch (error) {
        console.error(
          "❌ Register Error:",
          error
        );

        if (message) {
          message.classList.remove(
            "success"
          );

          message.classList.add(
            "error"
          );

          message.textContent =
            error.message ||
            "❌ تعذر الاتصال بسيرفر N10.";
        }
      } finally {
        if (submitButton) {
          submitButton.classList.remove(
            "loading"
          );

          submitButton.disabled =
            false;

          submitButton.textContent =
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
          ?.value
          ?.trim();

      if (!key) {
        return;
      }

      try {
        await navigator.clipboard.writeText(
          key
        );

        if (copyMessage) {
          copyMessage.textContent =
            "✅ تم نسخ Access Key.";
          copyMessage.className =
            "success";
        }
      } catch (error) {
        console.error(
          "Copy error:",
          error
        );

        if (accessKeyDisplay) {
          accessKeyDisplay.select();

          document.execCommand(
            "copy"
          );
        }

        if (copyMessage) {
          copyMessage.textContent =
            "✅ تم نسخ Access Key.";
          copyMessage.className =
            "success";
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
        getToken();

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

      clearSession();

      showHome();
    }
  );
}

/* =====================================================
   RESTORE SESSION
===================================================== */

async function restoreSession() {
  const token =
    getToken();

  if (!token) {
    return false;
  }

  try {
    const response =
      await fetch(
        `${API_URL}/api/user`,
        {
          method: "GET",

          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

    const data =
      await response.json();

    if (
      !response.ok ||
      !data.success ||
      !data.user
    ) {
      clearSession();

      return false;
    }

    saveUsername(
      data.user.username
    );

    saveAccessKey(
      data.user.accessKey
    );

    showKeyPage(
      data.user.accessKey
    );

    return true;
  } catch (error) {
    console.error(
      "Session restore error:",
      error
    );

    return false;
  }
}

/* =====================================================
   INITIAL PAGE
===================================================== */

(async function init() {
  /* Discord key has priority */

  if (accessKeyFromURL) {
    return;
  }

  if (discordError) {
    return;
  }

  const restored =
    await restoreSession();

  if (restored) {
    return;
  }

  const savedKey =
    getAccessKey();

  if (
    savedKey &&
    !getToken()
  ) {
    if (keyInput) {
      keyInput.value =
        savedKey;
    }
  }

  showHome();
})();
