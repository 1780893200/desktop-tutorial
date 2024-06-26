window.addEventListener('DOMContentLoaded', () => {
  const style = document.createElement('style');
  style.innerHTML = `
    .title-bar-maximize {
      display: none !important;
    }
  `;
  document.head.appendChild(style);
});