const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return "";
};

const setCookie = (name, value, days) => {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000)); // تحديد مدة الكوكي
  document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`;
};

export function theme() {
  const theme = document.querySelector(".theme-switcher"),
    themeToggle = document.querySelector(".theme-switcher-toggle"),
    themeButtons = document.querySelectorAll(".theme-switcher-button"),
    themeElement = document.querySelector("[data-bs-theme]");
  
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      theme.classList.toggle("show");
    });
  }
  
  const setTheme = (themeName) => {
    themeElement.setAttribute("data-bs-theme", themeName);
    themeButtons.forEach((button) => {
      button.classList.remove("active");
      if (button.hasAttribute(`data-bs-theme-${themeName}`)) {
        button.classList.add("active");
      }
    });
  };
  
  const initializeTheme = () => {
    const storedTheme = getCookie("theme");
    if (!storedTheme) {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        setTheme("dark");
      } else {
        setTheme("light");
      }
    } else {
      setTheme(storedTheme);
    }
  };
  
  initializeTheme();
  
  themeButtons.forEach((el) => {
    el.addEventListener("click", () => {
      const themeType = el.hasAttribute("data-bs-theme-light") ? "light" : "dark";
      setCookie("theme", themeType, 300);
      setTheme(themeType);
    });
  });
}