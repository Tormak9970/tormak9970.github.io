import GuildObj from "./classes/guildObj.js";
import ReactionRole from "./classes/reactionRole.js";
import CustomCommand from "./classes/customCommand.js";
import getUserInfo from "./userInfoHandler.mjs";
import refreshUserInfo from "./userInfoHandler.mjs";
const url = new URL(window.location.href);
const urlObj = url.searchParams;

let serverDiv = document.getElementById("serverContainerDiv");
let loaderDiv = document.getElementById("loaderContainerDiv");

let guilds = [];
let user;

var canvas = document.getElementById("loader");
var ctx = canvas.getContext("2d");

var x = 400;
var y = 400;
var r = 25;
var changeInterval = 5;
var color = "#e89c0e";
var loaded = false;

function drawCircle(x, y, radius, color){
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
}

function runLoadingAnimation(horizontal, away, c, x1, y1, x2, y2, r, color){
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawCircle(x1, y1, r, color);
  drawCircle(x2, y2, r, color);
  
  if ((x2 <= 300 && x2 >= 200) && (x1 >= 500 && x1 <= 600) && c > 1 && c <= 5){
    if (away){
      c -= .1;
    } else {
      c += .1;
    }
  }

  if ((y2 <= 300 && y2 >= 200) && (y1 >= 500 && y1 <= 600) && c > 1 && c <= 5){
    if (away){
      c -= .1;
    } else {
      c += .1;
    }
  }

  if(x2 <= 200 && x1 >= 600 && away){
    away = false;
  }
  if(y2 <= 200 && y1 >= 600 && away){
    away = false;
  }
  if(x2 == 400 && x1 == 400 && y2 == 400 && y1 == 400){
    horizontal = !horizontal;
    away = true;
  }

  if(horizontal){
    if(away){
      x1 += c;
      x2 -= c;
    } else {
      x2 += c;
      x1 -= c;
    }
  } else {
    if(away){
      y1 += c;
      y2 -= c;
    } else {
      y2 += c;
      y1 -= c;
    }
  }

  if (!loaded){
    requestAnimationFrame(() => {
      runLoadingAnimation(horizontal, away, c, x1, y1, x2, y2, r, color);
    });
  }
}

function startLoadingAnimation(){
  runLoadingAnimation(false, true, changeInterval, x, y, x, y, r, color);
}

if (urlObj.get("code") || sessionStorage.getItem('user')) {
  getInfo();
  
  startLoadingAnimation();
}

async function getInfo(){
  if (sessionStorage.getItem('user')){
    const accessCode = sessionStorage.getItem('user').refreshToken;
    user = await refreshUserInfo(accessCode);
  } else {
    const accessCode = urlObj.get("code");
    user = await getUserInfo(accessCode);
  }

  if(user){
    guilds = await getUserGuilds(user);
    
    if (guilds.length > 0){
      displayGuilds(guilds);
    }
  }
}

function displayGuilds(guilds){
  guilds.forEach((elem) => {
    createGuildDiv(elem);
  });
  loaderDiv.style.display = "none";
  serverDiv.style.display = "flex";
  loaded = false;
}
function createGuildDiv(guild){
  var guildContainer = document.createElement("div");
  guildContainer.className = "server-div";

  var pageLink = document.createElement("a");
  pageLink.onclick = function(){
    sessionStorage.setItem('Guild Info', JSON.stringify(guild));
  }
  pageLink.href = "../../guild.html";

  var guildIcon = document.createElement("img");
  if (guild.icon){
    var iconStr = guild.icon;
    var type;
    if(iconStr.substring(0, 2) == "a_"){
      type = ".gif";
    } else {
      type = ".png";
    }
    guildIcon.src = `https://cdn.discordapp.com/icons/${guild.id}/${iconStr}${type}`;
  } else {
    guildIcon.src = "src/img/default.png";
  }

  guildIcon.width = "120";
  guildIcon.height = "120";
  pageLink.appendChild(guildIcon);
  guildContainer.appendChild(pageLink);
  document.getElementById("serverDiv").appendChild(guildContainer);

}

async function getUserGuilds(user){
  let guilds = [];
  const data = {
    'accesstoken': user.accessToken,
    'tokentype': user.tokenType
  }
  console.log(data);
  await fetch('http://localhost:8090/api/v1/modbot/database/data/guilds', {
  	method: 'POST',
	  body: new URLSearchParams(data),
  })
  .then(guildRes => guildRes.json())
  .then(info => {
    console.log(info);
    info.forEach((e) => {
      var rrl = [];
      var ccl = [];
      var jrl = [];
      var bwl = [];

      e.listOfReactionRoles.forEach((e) => {
        rrl.push(new ReactionRole(e.mid, e.cid, e.iid, e.rid, e.isemote, e.type));
      });
      e.listOfCCs.forEach((e) => {
        ccl.push(new CustomCommand(e.handle, e.name, e.help));
      });
      e.listOfJoinRoles.forEach((e) => {
        jrl.push(e);
      });
      e.listOfBannedWords.forEach((e) => {
        bwl.push(e);
      });

      var guild = new GuildObj(e.id, e.name, e.icon, e.features, e.prefix, e.region, rrl, 
        ccl, jrl, bwl, e.numMembers, e.modOnly, e.setPrefix, e.help, e.botInfo, e.serverInfo, 
        e.userInfo, e.banWord, e.getBannedWords, e.removeBannedWords, e.banUser, e.kickUser, 
        e.muteUser, e.joinRole, e.reactionRole, e.removeJoinRole);
      guilds.push(guild);
    });
  });
  return guilds;
}