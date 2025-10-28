import { setCookie, getCookie, deleteCookie, getAccessToken, getRefreshToken } from './cookie.util';

describe('Cookie Utility', () => {
  beforeEach(() => {
    // Clear all cookies before each test
    if (typeof document !== 'undefined') {
      document.cookie.split(';').forEach((cookie) => {
        const [name] = cookie.trim().split('=');
        document.cookie = `${name}=; path=/; max-age=0`;
      });
    }
  });

  describe('setCookie', () => {
    it('should set a cookie with correct attributes', () => {
      setCookie('testCookie', 'testValue', 3600);

      const cookies = document.cookie;
      expect(cookies).toContain('testCookie=testValue');
    });

    it('should encode cookie value', () => {
      setCookie('testCookie', 'test value with spaces', 3600);

      const value = getCookie('testCookie');
      expect(value).toBe('test value with spaces');
    });
  });

  describe('getCookie', () => {
    it('should retrieve an existing cookie', () => {
      setCookie('testCookie', 'testValue', 3600);

      const value = getCookie('testCookie');
      expect(value).toBe('testValue');
    });

    it('should return null for non-existent cookie', () => {
      const value = getCookie('nonExistent');
      expect(value).toBeNull();
    });

    it('should decode cookie value', () => {
      document.cookie = 'testCookie=test%20value%20with%20spaces; path=/';

      const value = getCookie('testCookie');
      expect(value).toBe('test value with spaces');
    });
  });

  describe('deleteCookie', () => {
    it('should delete an existing cookie', () => {
      setCookie('testCookie', 'testValue', 3600);
      expect(getCookie('testCookie')).toBe('testValue');

      deleteCookie('testCookie');
      expect(getCookie('testCookie')).toBeNull();
    });

    it('should not throw error when deleting non-existent cookie', () => {
      expect(() => deleteCookie('nonExistent')).not.toThrow();
    });
  });

  describe('getAccessToken', () => {
    it('should retrieve access_token cookie', () => {
      setCookie('access_token', 'mytoken123', 3600);

      const token = getAccessToken();
      expect(token).toBe('mytoken123');
    });

    it('should return null when access_token does not exist', () => {
      const token = getAccessToken();
      expect(token).toBeNull();
    });
  });

  describe('getRefreshToken', () => {
    it('should retrieve refresh_token cookie', () => {
      setCookie('refresh_token', 'myrefreshtoken456', 7200);

      const token = getRefreshToken();
      expect(token).toBe('myrefreshtoken456');
    });

    it('should return null when refresh_token does not exist', () => {
      const token = getRefreshToken();
      expect(token).toBeNull();
    });
  });
});
