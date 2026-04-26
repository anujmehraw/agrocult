const AUTH_KEY = "user";

function canUseStorage(): boolean {
  return typeof window !== "undefined";
}

export function saveUser(email: string): boolean {
  if (!canUseStorage()) return false;

  try {
    localStorage.setItem(AUTH_KEY, email);
    return true;
  } catch {
    try {
      sessionStorage.setItem(AUTH_KEY, email);
      return true;
    } catch {
      return false;
    }
  }
}

export function getUser(): string | null {
  if (!canUseStorage()) return null;

  try {
    const localUser = localStorage.getItem(AUTH_KEY);
    if (localUser) return localUser;
  } catch {
    // ignore localStorage access failures on restricted browsers
  }

  try {
    return sessionStorage.getItem(AUTH_KEY);
  } catch {
    return null;
  }
}

export function clearUser(): void {
  if (!canUseStorage()) return;

  try {
    localStorage.removeItem(AUTH_KEY);
  } catch {
    // ignore
  }

  try {
    sessionStorage.removeItem(AUTH_KEY);
  } catch {
    // ignore
  }
}
