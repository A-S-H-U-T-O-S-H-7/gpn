
export const cleanupAuthData = () => {
  if (typeof window === 'undefined') return;

  // Remove old persist data from localStorage
  const oldAuthKeys = [
    'gpn-user-auth-storage',
    'gpn-admin-auth-storage',
    'user',
    'admin',
    'token',
    'session',
    'auth'
  ];

  oldAuthKeys.forEach(key => {
    try {
      const data = localStorage.getItem(key);
      if (data) {
        const parsed = JSON.parse(data);
        // If it contains auth data, remove it
        if (parsed?.state?.sessionToken || parsed?.state?.isAuthenticated) {
          localStorage.removeItem(key);
        }
      }
    } catch (e) {
      localStorage.removeItem(key);
    }
  });

  // Clear session storage
  sessionStorage.clear();

  // Clean URL params
  const url = new URL(window.location.href);
  const sensitiveParams = ['token', 'session', 'auth', 'userId', 'uid'];
  let hasSensitiveParams = false;

  sensitiveParams.forEach(param => {
    if (url.searchParams.has(param)) {
      url.searchParams.delete(param);
      hasSensitiveParams = true;
    }
  });

  if (hasSensitiveParams) {
    window.history.replaceState({}, '', url.toString());
  }
};