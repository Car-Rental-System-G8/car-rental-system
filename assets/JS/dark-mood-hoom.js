// Dark Mode Functionality
document.addEventListener("DOMContentLoaded", () => {
    // Function to set theme
    function setTheme(themeName) {
      localStorage.setItem('theme', themeName);
      document.documentElement.setAttribute('data-theme', themeName);
      
      // Update the icons based on theme
      updateThemeIcon(themeName);
    }
  
    // Function to toggle between light and dark themes
    function toggleTheme() {
      const currentTheme = localStorage.getItem('theme') || 'light';
      if (currentTheme === 'light') {
        setTheme('dark');
      } else {
        setTheme('light');
      }
    }
  
    // Function to update icon based on current theme
    function updateThemeIcon(theme) {
      const moonIcon = document.querySelector('.theme-toggle .fa-moon');
      const sunIcon = document.querySelector('.theme-toggle .fa-sun');
      
      if (moonIcon && sunIcon) {
        if (theme === 'dark') {
          moonIcon.style.display = 'none';
          sunIcon.style.display = 'inline-block';
        } else {
          moonIcon.style.display = 'inline-block';
          sunIcon.style.display = 'none';
        }
      }
    }
  
    // Initialize theme from localStorage or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
  
    // Load event listener for theme toggle after navbar is loaded
    const checkForThemeToggle = setInterval(() => {
      const themeToggle = document.querySelector('.theme-toggle');
      if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
        clearInterval(checkForThemeToggle);
      }
    }, 100);
  });