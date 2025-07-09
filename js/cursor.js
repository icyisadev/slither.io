document.body.style.cursor = 'none';

// Create the cursor container
const cursor = document.createElement('div');
cursor.style.position = 'fixed';
cursor.style.width = '12px';
cursor.style.height = '12px';
cursor.style.pointerEvents = 'none';
cursor.style.zIndex = '9999';
cursor.style.top = '0';
cursor.style.left = '0';
cursor.style.transform = 'translate(-50%, -50%)';
document.body.appendChild(cursor);

// Insert animated SVG into the div
cursor.innerHTML = `
  <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style="
    width: 100%;
    height: 100%;
    animation: spin 1s linear infinite;
  ">
    <polygon points="16,0 32,16 16,32 0,16" fill="white" stroke="black" stroke-width="1"/>
  </svg>
`;

// Inject CSS animation via JavaScript
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);

// Update cursor position on mouse move
document.addEventListener('mousemove', e => {
  cursor.style.top = e.clientY + 'px';
  cursor.style.left = e.clientX + 'px';
});
