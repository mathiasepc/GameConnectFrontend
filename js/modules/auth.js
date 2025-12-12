// ===========================
// Authentication Helper Module
// ===========================

export function getStoredToken() {
    const raw = localStorage.getItem("user");
    if (!raw) return null;

    try {
        const data = JSON.parse(raw);
        return data.token || null;
    } catch {
        return null;
    }
}

export function decodeJwt(token) {
    try {
        const payload = token.split(".")[1];
        return JSON.parse(atob(payload));
    } catch (e) {
        console.error("Invalid JWT:", e);
        return null;
    }
}

export function getLoggedInUser() {
    const token = getStoredToken();
    if (!token) return null;

    const data = decodeJwt(token);
    if (!data) return null;

    return {
        id: Number(data.sub),
        role: data.role,
        // issuedAt: data.iat,
        // expiresAt: data.exp,
        token: token
    };
}

export function logout() {
    localStorage.removeItem("user");
    window.location.href = "../html/user-login.html";
}
