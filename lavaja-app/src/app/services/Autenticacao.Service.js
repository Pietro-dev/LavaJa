const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080";

class AuthService {
  constructor() {
    this.baseUrl = API_BASE;
    this.TOKEN_KEY = "token";
    this.USER_KEY = "user";
    this.USER_TYPE_KEY = "userType";
  }

  getAuthHeaders() {
    const token = this.getToken();
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
  }

  async fetchWithAuth(path, options = {}) {
    const url = `${this.baseUrl}${path}`;
    const headers = { ...(options.headers || {}), ...this.getAuthHeaders() };
    const merged = { ...options, headers };
    const resp = await fetch(url, merged);
    return resp;
  }

  async register(userData) {
    const response = await fetch(`${this.baseUrl}/auth/cadastro`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      const t = await response.text();
      let message = "Erro ao cadastrar usuário";
      try { message = JSON.parse(t).message || message } catch {}
      throw new Error(message);
    }
    return { success: true };
  }

  async login(email, senha) {
    const payload = { email, senha, password: senha };
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const text = await response.text();
    let data = null;
    try { data = text ? JSON.parse(text) : null } catch {}

    if (!response.ok) {
      const message = (data && (data.message || data.error)) || text || `Erro ${response.status}`;
      throw new Error(message);
    }

    const token = data?.token;
    if (!token) throw new Error("Token não recebido do servidor");

    this.setToken(token);

    if (data && data.usuarioId) {
      const user = {
        id: data.usuarioId,
        email: email,
        tipo: 'CLIENTE'
      };
      this.setUser(user);
    } else {
      throw new Error("ID do usuário não recebido");
    }

    return data;
  }

  async loginLavaRapido(email, senha) {
    const payload = { email, senha, password: senha };
    const response = await fetch(`${this.baseUrl}/auth/login/lava-rapidos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const text = await response.text();
    let data = null;
    try { data = text ? JSON.parse(text) : null } catch {}

    if (!response.ok) {
      const message = (data && (data.message || data.error)) || text || `Erro ${response.status}`;
      throw new Error(message);
    }

    console.log('🔑 Resposta do login lava-rápido:', data);

    const token = data?.token;
    if (!token) throw new Error("Token não recebido do servidor");

    this.setToken(token);

    const userData = {
      id: data.lavaRapidoId,
      email: email,
      nome: `Lava-Rápido ${data.lavaRapidoId}`, 
      tipo: 'LAVA_RAPIDO',
      lavaRapidoId: data.lavaRapidoId
    };

    console.log('💾 Salvando usuário lava-rápido:', userData);
    this.setUser(userData);

    return data;
  }

  setToken(token) {
    try { 
      localStorage.setItem(this.TOKEN_KEY, token);
      console.log('✅ Token salvo com sucesso');
    } catch (error) {
      console.error('❌ Erro ao salvar token:', error);
    }
  }

  getToken() {
    try { 
      return localStorage.getItem(this.TOKEN_KEY);
    } catch { 
      return null;
    }
  }

  setUser(user) {
    try { 
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      
      if (user.tipo) {
        localStorage.setItem(this.USER_TYPE_KEY, user.tipo);
      }
      
      console.log('✅ User salvo com sucesso:', user);
    } catch (error) {
      console.error('❌ Erro ao salvar user:', error);
    }
  }

  getUser() {
    try {
      const u = localStorage.getItem(this.USER_KEY);
      return u ? JSON.parse(u) : null;
    } catch { 
      return null;
    }
  }

  getUserType() {
    try {
      return localStorage.getItem(this.USER_TYPE_KEY);
    } catch {
      return null;
    }
  }

  isLavaRapido() {
    return this.getUserType() === 'LAVA_RAPIDO';
  }

  isCliente() {
    const userType = this.getUserType();
    return !userType || userType === 'CLIENTE';
  }

  getLavaRapidoId() {
    const user = this.getUser();
    return user?.lavaRapidoId || user?.id;
  }

  async getCurrentUser() {
    const user = this.getUser();
    if (user) return user;

    const token = this.getToken();
    if (!token) return null;

    const decoded = this.decodeJwt(token);
    if (!decoded) return null;

    const userFromToken = {
      email: decoded.sub || decoded.email || null,
      ...this.pickIfExists(decoded, ["name","roles","authorities"])
    };
    this.setUser(userFromToken);
    return userFromToken;
  }

  pickIfExists(obj, keys) {
    const out = {};
    keys.forEach(k => { if (obj[k] !== undefined) out[k] = obj[k] });
    return out;
  }

  decodeJwt(token) {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const payload = parts[1];
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const padded = base64 + '==='.slice((base64.length + 3) % 4);
      const json = decodeURIComponent(atob(padded).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(json);
    } catch (e) {
      return null;
    }
  }

  logout() {
    try { 
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
      localStorage.removeItem(this.USER_TYPE_KEY);
      console.log('✅ Logout realizado com sucesso');
    } catch (error) {
      console.error('❌ Erro ao fazer logout:', error);
    }
  }

  isAuthenticated() {
    return !!this.getToken();
  }

  redirectBasedOnUserType(router) {
    if (this.isLavaRapido()) {
      router.push('/lava-rapido/dashboard');
    } else {
      router.push('/');
    }
  }
}

export default new AuthService();