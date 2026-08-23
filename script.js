"use strict";

/* =====================================================
   N10 SERVER MENA
   FRONTEND SCRIPT
===================================================== */

const API_URL =
  "https://n10-discord-backend-new.onrender.com";

/* =====================================================
   ELEMENTS
===================================================== */

const home =
  document.getElementById("home");

const registerPage =
  document.getElementById(
    "registerPage"
  );

const keyPage =
  document.getElementById(
    "keyPage"
  );

const logo =
  document.getElementById(
    "logo"
  );

const registerButton =
  document.getElementById(
    "registerButton"
  );

const backButton =
  document.getElementById(
    "backButton"
  );

const copyButton =
  document.getElementById(
    "copyButton"
  );

const logoutButton =
  document.getElementById(
    "logoutButton"
  );

const registerForm =
  document.getElementById(
    "registerForm"
  );

const registerSubmit =
  document.getElementById(
    "registerButtonSubmit"
  );

const message =
  document.getElementById(
    "message"
  );

const keyInput =
  document.getElementById(
    "key"
  );

const accessKeyInput =
  document.getElementById(
    "accessKey"
  );

const discordInfo =
  document.getElementById(
    "discordInfo"
  );

const copyMessage =
  document.getElementById(
    "copyMessage"
  );

/* =====================================================
   URL PARAMETERS
===================================================== */

const urlParams =
  new URLSearchParams(
    window.location.search
  );

const discordAccessKey =
  urlParams.get(
    "accessKey"
  );

const discordError =
  urlParams.get(
    "error"
  );

/* =====================================================
   STORAGE
===================================================== */

const STORAGE_KEY =
  "n10AccessKey";

const STORAGE_TOKEN =
  "n10Token";

const STORAGE_USER =
  "n10User";

/* =====================================================
   SHOW HOME
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

  if (logo) {
    logo.innerHTML = "N10";
  }
}

/* =====================================================
   SHOW REGISTER
===================================================== */

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

  if (logo) {
    logo.innerHTML = "N10";
  }
}

/* =====================================================
   SHOW KEY
===================================================== */

function showKeyPage(
  accessKey
) {
  if (!accessKey) {
    return;
  }

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

  if (logo) {
    logo.innerHTML =
      '<span class="key-icon">🔑</span>';
  }

  if (accessKeyInput) {
    accessKeyInput.value =
      accessKey;
  }
}

/* =====================================================
   REGISTER BUTTON
===================================================== */

if (registerButton) {
  registerButton.addEventListener(
    "click",
    () => {
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
    }
  );
}

/* =====================================================
   DISCORD ERROR
===================================================== */

function showDiscordError(
  error
) {
  if (!message) {
    return;
  }

  const errors = {
    invalid_oauth_state:
      "❌ جلسة Discord غير صالحة. عاود المحاولة.",

    discord_cancelled:
      "❌ تم إلغاء تسجيل الدخول عبر Discord.",

    discord_token_error:
      "❌ حدث خطأ أثناء الاتصال بـ Discord.",

    discord_user_error:
      "❌ تعذر الحصول على معلومات Discord.",

    key_generation_failed:
      "❌ تعذر إنشاء Access Key.",

    discord_error:
      "❌ حدث خطأ أثناء تسجيل الدخول عبر Discord."
  };

  message.className =
    "error";

  message.textContent =
    errors[error] ||
    "❌ حدث خطأ غير معروف.";
}

/* =====================================================
   DISCORD ACCESS KEY
===================================================== */

if (discordAccessKey) {
  showRegister();

  if (keyInput) {
    keyInput.value =
      discordAccessKey;

    keyInput.readOnly =
      true;
  }

  if (discordInfo) {
    discordInfo.classList.remove(
      "hidden"
    );
  }

  try {
    localStorage.setItem(
      STORAGE_KEY,
      discordAccessKey
    );
  } catch (error) {
    console.error(
      "Storage error:",
      error
    );
  }

  /*
    حذف accessKey من الرابط
    بعد قراءته
  */

  try {
    window.history.replaceState(
      {},
      document.title,
      window.location.pathname
    );
  } catch (error) {
    console.error(
      "History error:",
      error
    );
  }
}

/* =====================================================
   DISCORD ERROR PARAMETER
===================================================== */

if (discordError) {
  showRegister();
  showDiscordError(
    discordError
  );

  try {
    window.history.replaceState(
      {},
      document.title,
      window.location.pathname
    );
  } catch (error) {
    console.error(error);
  }
}

/* =====================================================
   LOAD SAVED ACCESS KEY
===================================================== */

if (
  !discordAccessKey &&
  !discordError
) {
  try {
    const savedAccessKey =
      localStorage.getItem(
        STORAGE_KEY
      );

    const savedToken =
      localStorage.getItem(
        STORAGE_TOKEN
      );

    /*
      إذا عندنا Token:
      نتحقق من Session
    */

    if (savedToken) {
      fetch(
        `${API_URL}/api/user`,
        {
          method: "GET",

          headers: {
            Authorization:
              `Bearer ${savedToken}`,

            Accept:
              "application/json"
          }
        }
      )
        .then(
          async (response) => {
            if (!response.ok) {
              throw new Error(
                "Session expired"
              );
            }

            const data =
              await response.json();

            if (
              data.user
            ) {
              localStorage.setItem(
                STORAGE_USER,
                JSON.stringify(
                  data.user
                )
              );

              if (
                data.user.accessKey
              ) {
                localStorage.setItem(
                  STORAGE_KEY,
                  data.user.accessKey
                );

                showKeyPage(
                  data.user.accessKey
                );
              }
            }
          }
        )
        .catch(
          () => {
            localStorage.removeItem(
              STORAGE_TOKEN
            );

            if (
              savedAccessKey
            ) {
              showKeyPage(
                savedAccessKey
              );
            }
          }
        );
    } else if (
      savedAccessKey
    ) {
      showKeyPage(
        savedAccessKey
      );
    }
  } catch (error) {
    console.error(
      "Storage load error:",
      error
    );
  }
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
          .value
          .trim();

      const password =
        document
          .getElementById(
            "password"
          )
          .value;

      const confirmPassword =
        document
          .getElementById(
            "confirm"
          )
          .value;

      const accessKey =
        document
          .getElementById(
            "key"
          )
          .value
          .trim();

      const human =
        document
          .getElementById(
            "human"
          )
          .checked;

      /* RESET */

      message.className = "";

      message.style.color =
        "#ff5555";

      /* VALIDATION */

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

      if (
        !/^[a-zA-Z0-9_.-]{3,24}$/.test(
          username
        )
      ) {
        message.textContent =
          "اسم المستخدم يجب أن يكون بين 3 و24 حرفاً.";

        return;
      }

      if (
        password.length < 6
      ) {
        message.textContent =
          "كلمة المرور يجب أن تحتوي على 6 أحرف على الأقل.";

        return;
      }

      if (
        new TextEncoder()
          .encode(password)
          .length > 72
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

      if (!human) {
        message.textContent =
          "الرجاء تأكيد أنك إنسان.";

        return;
      }

      /* LOADING */

      message.style.color =
        "#a9c9e8";

      message.textContent =
        "جاري إنشاء الحساب...";

      if (registerSubmit) {
        registerSubmit.disabled =
          true;

        registerSubmit.classList.add(
          "loading"
        );

        registerSubmit.textContent =
          "جاري التسجيل...";
      }

      try {
        const response =
          await fetch(
            `${API_URL}/api/register`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",

                Accept:
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
          message.className =
            "error";

          message.textContent =
            data.message ||
            "فشل إنشاء الحساب.";

          return;
        }

        /* SUCCESS */

        message.className =
          "success";

        message.textContent =
          "✅ تم إنشاء الحساب بنجاح!";

        /*
          نخزن المعلومات
        */

        if (data.user) {
          localStorage.setItem(
            STORAGE_USER,
            JSON.stringify(
              data.user
            )
          );

          if (
            data.user.accessKey
          ) {
            localStorage.setItem(
              STORAGE_KEY,
              data.user.accessKey
            );
          }
        }

        /*
          بعد التسجيل
          نذهب للـ Login
        */

        setTimeout(
          () => {
            window.location.href =
              "./login.html";
          },
          1000
        );
      } catch (error) {
        console.error(
          "Register error:",
          error
        );

        message.className =
          "error";

        message.textContent =
          "❌ تعذر الاتصال بسيرفر N10. حاول مرة أخرى.";
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
   COPY KEY
===================================================== */

if (copyButton) {
  copyButton.addEventListener(
    "click",
    async () => {
      const key =
        accessKeyInput
          ? accessKeyInput.value
          : "";

      if (!key) {
        return;
      }

      try {
        await navigator.clipboard.writeText(
          key
        );

        if (copyMessage) {
          copyMessage.className =
            "success";

          copyMessage.textContent =
            "✅ تم نسخ المفتاح";
        }
      } catch (error) {
        /*
          Fallback
        */

        try {
          accessKeyInput.select();

          accessKeyInput.setSelectionRange(
            0,
            99999
          );

          document.execCommand(
            "copy"
          );

          if (copyMessage) {
            copyMessage.className =
              "success";

            copyMessage.textContent =
              "✅ تم نسخ المفتاح";
          }
        } catch (
          copyError
        ) {
          console.error(
            "Copy error:",
            copyError
          );

          if (copyMessage) {
            copyMessage.className =
              "error";

            copyMessage.textContent =
              "❌ تعذر نسخ المفتاح.";
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
        localStorage.getItem(
          STORAGE_TOKEN
        );

      try {
        if (token) {
          await fetch(
            `${API_URL}/api/logout`,
            {
              method: "POST",

              headers: {
                Authorization:
                  `Bearer ${token}`,

                Accept:
                  "application/json"
              }
            }
          );
        }
      } catch (error) {
        console.error(
          "Logout request error:",
          error
        );
      }

      localStorage.removeItem(
        STORAGE_TOKEN
      );

      localStorage.removeItem(
        STORAGE_USER
      );

      localStorage.removeItem(
        STORAGE_KEY
      );

      showHome();
    }
  );
}

/* =====================================================
   DEFAULT
===================================================== */

if (
  !discordAccessKey &&
  !discordError
) {
  /*
    إذا ماكان حتى شيء،
    الصفحة الرئيسية تبقى ظاهرة.
  */
}
