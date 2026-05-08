// ── Toast Notification System ─────────────────────────────────────
function showToast(message, type = 'info') {
  // Create container if it doesn't exist
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = {
    success: '✅',
    error:   '❌',
    info:    'ℹ️',
    warning: '⚠️'
  };

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${icons[type]}</span>
    <span class="toast-msg">${message}</span>
  `;

  // Click to dismiss
  toast.addEventListener('click', () => toast.remove());

  container.appendChild(toast);

  // Auto remove after 3 seconds
  setTimeout(() => toast.remove(), 3000);
}