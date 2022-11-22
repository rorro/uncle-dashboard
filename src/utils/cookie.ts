import Cookie from 'js-cookie';

const setCookie = (name: string, value: string) => {
  Cookie.set(name, value, {
    expires: 7 // days
  });
};

const getCookie = (name: string) => {
  const cookie = Cookie.get(name);
  return cookie ? encodeURIComponent(cookie) : undefined;
};

const removeCookie = (name: string) => {
  Cookie.remove(name);
};

export { setCookie, getCookie, removeCookie };
