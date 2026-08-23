"use strict";

/* =====================================================
   N10 SERVER MENA
   FRONTEND SCRIPT
   VERSION: 2.0
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
  document.getElementById("loginFromRegister");

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

/* =====================================================
   STORAGE
===================================================== */

const STORAGE = {
  token: "n10SessionToken",
  username: "n10Username",
  accessKey: "n10AccessKey"
};

/* =====================================================
   STORAGE FUNCTIONS
===================================================== */

function saveToken(token) {
  if (!token) return;

  localStorage.setItem(
    STORAGE.token,
    String(token)
  );
}

function saveUsername(username) {
  if (!username) return;

  localStorage.setItem(
    STORAGE.username,
    String(username)
  );
}

function saveAccessKey(key) {
  if (!key) return;

  localStorage.setItem(
    STORAGE.accessKey,
    String(key)
  );
}

function getToken() {
  return localStorage.getItem(
    STORAGE.token
  );
}

function getUsername() {
  return localStorage.getItem(
    STORAGE.username
  );
}

function getAccessKey() {
  return localStorage.getItem(
    STORAGE.accessKey
  );
}

/*
   يمسح Session فقط
*/
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

/*
   مهم جدًا:
   عند دخول Discord جديد نمسح كل شيء قديم
   قبل حفظ الـKey الجديد.
*/
function clearOldDiscordSession() {
  localStorage.removeItem(
    STORAGE.token
  );

  localStorage.removeItem(
    STORAGE.username
  );

  localStorage.removeItem(
    STORAGE.accessKey
  );

  sessionStorage.removeItem(
    STORAGE.token
  );

  sessionStorage.removeItem(
    STORAGE.username
  );

  sessionStorage.removeItem(
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
    registerPage.classList.add("hidden");
  }

  if (keyPage) {
    keyPage.classList.add("hidden");
  }
}

function showHome() {
  hideAllPages();

  if (home) {
    home.classList.remove("hidden");
  }
}

function showRegister() {
  hideAllPages();

  if (registerPage) {
    registerPage.classList.remove("hidden");
  }
}

function showKeyPage(accessKey) {
  hideAllPages();

  if (keyPage) {
    keyPage.classList.remove("hidden");
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
   MESSAGE
===================================================== */

function showError(text) {
  if (!message) return;

  message.classList.remove(
    "success"
  );

  message.classList.add(
    "error"
  );

  message.textContent =
    text || "حدث خطأ.";
}

function showSuccess(text) {
  if (!message) return;

  message.classList.remove(
    "error"
  );

  message.classList.add(
    "success"
  );

  message.textContent =
    text || "تمت العملية بنجاح.";
}

function clearMessage() {
  if (!message) return;

  message.textContent = "";

  message.classList.remove(
    "error",
    "success"
  );
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
   DISCORD CALLBACK
===================================================== */

/*
   هذا أهم جزء.

   إذا رجعنا من Discord ومعنا Access Key:

   1. نمسح الـKey القديم.
   2. نمسح الـSession القديم.
   3. نحفظ الـKey الجديد فقط.
   4. نعرضه في التسجيل.
*/

function handleDiscordCallback() {
  if (!accessKeyFromURL) {
    return false;
  }

  const newKey =
    accessKeyFromURL.trim();

  if (
    !/^N10-[A-Za-z0-9]+$/.test(
      newKey
    )
  ) {
    showHome();

    showError(
      "Access Key القادم من Discord غير صالح."
    );

    cleanURL();

    return true;
  }

  /* امسح القديم بالكامل */
  clearOldDiscordSession();

  /* احفظ الجديد */
  saveAccessKey(
    newKey
  );

  /*
     إذا Discord أعاد Token أيضًا،
     احفظه بعد تنظيف القديم.
  */
  if (sessionTokenFromURL) {
    saveToken(
      sessionTokenFromURL
    );
  }

  if (usernameFromURL) {
    saveUsername(
      usernameFromURL
    );
  }

  /* ضع المفتاح الجديد في خانة التسجيل */
  if (keyInput) {
    keyInput.value =
      newKey;

    keyInput.readOnly =
      true;
  }

  if (discordInfo) {
    discordInfo.classList.remove(
      "hidden"
    );

    discordInfo.innerHTML =
      "✅ تم الحصول على Access Key جديد من Discord.<br>" +
      "يمكنك الآن إنشاء حسابك.";
  }

  /*
     أظهر صفحة التسجيل
  */
  showRegister();

  /*
     لا نخلي الـKey القديم يرجع
  */
  cleanURL();

  return true;
}

/* =====================================================
   DISCORD ERROR
===================================================== */

function handleDiscordError() {
  if (!discordError) {
    return false;
  }

  /*
     عند وجود خطأ Discord
     لا نمسح Session إلا إذا أردنا
     تسجيل دخول جديد.
  */

  showHome();

  showError(
    decodeURIComponent(
      discordError
    )
  );

  cleanURL();

  return true;
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
   BACK BUTTON
===================================================== */

if (backButton) {
  backButton.addEventListener(
    "click",
    () => {
      showHome();

      clearMessage();
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

      clearMessage();

      const username =
        document
          .getElementById("username")
          ?.value
          .trim() || "";

      const password =
        document
          .getElementById("password")
          ?.value || "";

      const confirmPassword =
        document
          .getElementById("confirm")
          ?.value || "";

      const accessKey =
        document
          .getElementById("key")
          ?.value
          .trim() || "";

      const human =
        document
          .getElementById("human")
          ?.checked || false;

      /* =================================================
         VALIDATION
      ================================================= */

      if (
        !username ||
        !password ||
        !confirmPassword ||
        !accessKey
      ) {
        showError(
          "الرجاء ملء جميع الخانات."
        );

        return;
      }

      if (
        !/^[a-zA-Z0-9_.-]{3,24}$/.test(
          username
        )
      ) {
        showError(
          "اسم المستخدم يجب أن يكون بين 3 و24 حرفاً ويمكن أن يحتوي على الحروف والأرقام و _ و - و ."
        );

        return;
      }

      const passwordLength =
        new TextEncoder()
          .encode(password)
          .length;

      if (
        passwordLength < 6
      ) {
        showError(
          "كلمة المرور يجب أن تحتوي على 6 بايت على الأقل."
        );

        return;
      }

      if (
        passwordLength > 72
      ) {
        showError(
          "كلمة المرور طويلة جداً."
        );

        return;
      }

      if (
        password !==
        confirmPassword
      ) {
        showError(
          "كلمتا المرور غير متطابقتين."
        );

        return;
      }

      if (
        !/^N10-[A-Za-z0-9]+$/.test(
          accessKey
        )
      ) {
        showError(
          "Access Key غير صالح."
        );

        return;
      }

      if (!human) {
        showError(
          "الرجاء تأكيد أنك إنسان."
        );

        return;
      }

      /* =================================================
         LOADING
      ================================================= */

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
          "جاري الاتصال بالسيرفر...";
      }

      try {
        /*
           لا نستعمل Key مخزن قديم.
           نستعمل الموجود حاليًا في خانة التسجيل.
        */

        const currentKey =
          keyInput?.value
            ?.trim() || accessKey;

        const response =
          await fetch(
            `${API_URL}/api/register`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",

                "Accept":
                  "application/json"
              },

              body:
                JSON.stringify({
                  username,
                  password,
                  confirmPassword,
                  accessKey:
                    currentKey
                })
            }
          );

        let data = {};

        const contentType =
          response.headers.get(
            "content-type"
          ) || "";

        if (
          contentType.includes(
            "application/json"
          )
        ) {
          try {
            data =
              await response.json();
          } catch {
            data = {};
          }
        } else {
          const text =
            await response.text();

          data = {
            message: text
          };
        }

        /* =================================================
           SERVER ERROR
        ================================================= */

        if (!response.ok) {
          throw new Error(
            data.message ||
            data.error ||
            `فشل إنشاء الحساب. HTTP ${response.status}`
          );
        }

        if (
          data.success === false
        ) {
          throw new Error(
            data.message ||
            "فشل إنشاء الحساب."
          );
        }

        /* =================================================
           SUCCESS
        ================================================= */

        /*
           Token
        */

        if (
          data.sessionToken
        ) {
          saveToken(
            data.sessionToken
          );
        }

        /*
           مهم:
           إذا Backend رجع Access Key جديد
           نستعمله.

           وإلا نستعمل الـKey الحالي
           الذي جاء من Discord.
        */

        const finalKey =
          (
            data.accessKey ||
            currentKey
          )
            .toString()
            .trim();

        if (finalKey) {
          saveAccessKey(
            finalKey
          );
        }

        saveUsername(
          username
        );

        showSuccess(
          "✅ تم إنشاء الحساب بنجاح!"
        );

        /*
           لا نخلي reset يمسح الـKey
           من localStorage.
        */

        if (registerForm) {
          registerForm.reset();
        }

        if (keyInput) {
          keyInput.value =
            finalKey;

          keyInput.readOnly =
            true;
        }

        /*
           عرض صفحة الـKey
        */

        setTimeout(
          () => {
            if (finalKey) {
              showKeyPage(
                finalKey
              );
            } else {
              window.location.href =
                "./login.html";
            }
          },
          500
        );

      } catch (error) {
        console.error(
          "N10 REGISTER ERROR:",
          error
        );

        let errorMessage =
          error?.message ||
          "";

        /*
           معالجة Failed to fetch
        */

        if (
          errorMessage ===
            "Failed to fetch" ||
          error instanceof TypeError
        ) {
          errorMessage =
            "❌ تعذر الاتصال بالسيرفر. تأكد أن Render يعمل وأن CORS يسمح بموقع GitHub Pages.";
        }

        showError(
          errorMessage ||
          "❌ تعذر الاتصال بسيرفر N10."
        );

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
        if (
          navigator.clipboard &&
          navigator.clipboard.writeText
        ) {
          await navigator.clipboard.writeText(
            key
          );
        } else {
          throw new Error(
            "Clipboard unavailable"
          );
        }

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

        try {
          if (accessKeyDisplay) {
            accessKeyDisplay.focus();
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

        } catch {
          if (copyMessage) {
            copyMessage.textContent =
              "❌ لم يتم النسخ. انسخ المفتاح يدوياً.";

            copyMessage.className =
              "error";
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
        getToken();

      /*
         حاول تسجيل الخروج من Backend
      */

      try {
        if (token) {
          await fetch(
            `${API_URL}/api/logout`,
            {
              method: "POST",

              headers: {
                "Authorization":
                  `Bearer ${token}`,

                "Accept":
                  "application/json"
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

      /*
         امسح كل شيء محليًا
      */

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
            "Authorization":
              `Bearer ${token}`,

            "Accept":
              "application/json"
          }
        }
      );

    let data = {};

    try {
      data =
        await response.json();
    } catch {
      data = {};
    }

    if (
      !response.ok ||
      !data.success ||
      !data.user
    ) {
      clearSession();

      return false;
    }

    /*
       Backend هو المصدر الصحيح للبيانات
    */

    if (
      data.user.username
    ) {
      saveUsername(
        data.user.username
      );
    }

    if (
      data.user.accessKey
    ) {
      saveAccessKey(
        data.user.accessKey
      );
    }

    if (
      data.user.accessKey
    ) {
      showKeyPage(
        data.user.accessKey
      );
    } else {
      showHome();
    }

    return true;

  } catch (error) {
    console.error(
      "Session restore error:",
      error
    );

    /*
       لا نمسح Session بسبب
       مشكلة اتصال مؤقتة.
    */

    return false;
  }
}

/* =====================================================
   INITIALIZATION
===================================================== */

(async function init() {

  /*
     =================================================
     1. Discord callback له الأولوية المطلقة
     =================================================
  */

  if (
    accessKeyFromURL
  ) {
    handleDiscordCallback();

    return;
  }

  /*
     =================================================
     2. Discord error
     =================================================
  */

  if (
    discordError
  ) {
    handleDiscordError();

    return;
  }

  /*
     =================================================
     3. Session من URL
     =================================================
  */

  if (
    sessionTokenFromURL
  ) {
    saveToken(
      sessionTokenFromURL
    );

    if (
      usernameFromURL
    ) {
      saveUsername(
        usernameFromURL
      );
    }

    cleanURL();
  }

  /*
     =================================================
     4. حاول استرجاع Session
     =================================================
  */

  const restored =
    await restoreSession();

  if (restored) {
    return;
  }

  /*
     =================================================
     5. لا يوجد Session
     =================================================
  */

  const savedKey =
    getAccessKey();

  if (
    savedKey &&
    keyInput
  ) {
    keyInput.value =
      savedKey;

    keyInput.readOnly =
      true;
  }

  showHome();

})();
