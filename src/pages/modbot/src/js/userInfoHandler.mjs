let refreshToken = "";

async function getUserInfo(accessCode){
  var user = {
    tokenType: '',
    refreshToken: '',
    accessToken: '',
    avatar: "",
    discriminator: "",
    email: "",
    id: "",
    locale: "",
    username: "",
    verified: false
  }
  const data = {
    'code': accessCode
  }
  await fetch('http://localhost:8090/api/v1/modbot/database/data/uin', {
	  method: 'POST',
	  body: new URLSearchParams(data),
  })
	  .then(discordRes => discordRes.json())
	  .then(info => {
      user.tokenType = info.tokenType;
      user.refreshToken = info.refreshToken;
      user.accessToken = info.accessToken;
      user.avatar = info.avatar;
      user.discriminator = info.discriminator;
      user.email = info.email;
      user.id = info.id;
      user.locale = info.locale;
      user.username = info.username;
      user.verified = info.verified;
    });

    sessionStorage.setItem("user", JSON.stringify(user));
    refreshToken = user.refreshToken;
    return user;
}

async function refreshUserInfo(token){
  var user = {
    tokenType: '',
    refreshToken: '',
    accessToken: '',
    avatar: "",
    discriminator: "",
    email: "",
    id: "",
    locale: "",
    username: "",
    verified: false
  }
  const data = {
    'refreshToken': token
  }
  await fetch('http://localhost:8090/api/v1/modbot/database/data/refresh', {
	  method: 'POST',
	  body: new URLSearchParams(data),
  })
	  .then(discordRes => discordRes.json())
	  .then(info => {
      user.tokenType = info.tokenType;
      user.refreshToken = info.refreshToken;
      user.accessToken = info.accessToken;
      user.avatar = info.avatar;
      user.discriminator = info.discriminator;
      user.email = info.email;
      user.id = info.id;
      user.locale = info.locale;
      user.username = info.username;
      user.verified = info.verified;
    });

    sessionStorage.setItem("user", JSON.stringify(user));
    refreshToken = user.refreshToken;
    return user;
}
export {refreshUserInfo};
export default getUserInfo;