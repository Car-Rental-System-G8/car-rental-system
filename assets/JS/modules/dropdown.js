export function dropdown () {
  document.querySelectorAll('[data-dropdown]').forEach((el) => {
    const dropdownClose = el.querySelectorAll('[data-dropdown-close]');
  
    const closeDropdown = () => {
      el.classList.remove('active', 'animated');
    };
  
    window.addEventListener('click', (e) => {
      const isInside = el.contains(e.target);
      const isPropagationAllowed = el.hasAttribute('data-dropdown-propagation');
      const clickedMenu = e.target.closest('.drop-down-menu');
  
      if (isInside) {
        if (!clickedMenu && isPropagationAllowed) {
          el.classList.toggle('active');
          setTimeout(() => el.classList.toggle('animated'), 0);
        } else if (!isPropagationAllowed) {
          el.classList.toggle('active');
          setTimeout(() => el.classList.toggle('animated'), 0);
        }
      } else {
        closeDropdown();
      }
    });
  
    dropdownClose.forEach((btn) => {
      btn.addEventListener('click', closeDropdown);
    });
  });
}