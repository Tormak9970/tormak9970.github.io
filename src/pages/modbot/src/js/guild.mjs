import GuildObj from "./classes/guildObj.js";
import ReactionRole from "./classes/reactionRole.js";
import CustomCommand from "./classes/customCommand.js";
import Role from "./classes/role.js";
import Channel from "./classes/channel.js";
import {refreshUserInfo} from "./userInfoHandler.mjs";
let guild = null;
let toBeUpdated = null
let guildRoles = [];
let guildCatagories = [];
let guildVCs = [];
let guildTCs = [];
let botNickName = "";
let numEnabled = 0;
let user;

var createCCModal = document.getElementById("createCCModal");
var editCCModal = document.getElementById("editCCModal");
var existingCCContainer = document.getElementById("existingCCContainer");

let dynamicContentContainer = document.getElementById("guildPageContainer");
let loaderDiv = document.getElementById("guildLoaderContainerDiv");

var canvas = document.getElementById("gLoader");
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

function setEnabledAndDisabled(num){
  document.getElementById("enabledCommands").innerHTML = num;
  document.getElementById("disabledCommands").innerHTML = 14 - num;
}

function getNumEnabledOnLoad(guild){
  if(guild.setPrefix){
    numEnabled++;
  }
  if(guild.help){
    numEnabled++;
  }
  if(guild.botInfo){
    numEnabled++;
  }
  if(guild.serverInfo){
    numEnabled++;
  }
  if(guild.userInfo){
    numEnabled++;
  }
  if(guild.banWord){
    numEnabled++;
  }
  if(guild.getBannedWords){
    numEnabled++;
  }
  if(guild.removeBannedWords){
    numEnabled++;
  }
  if(guild.banUser){
    numEnabled++;
  }
  if(guild.kickUser){
    numEnabled++;
  }
  if(guild.muteUser){
    numEnabled++;
  }
  if(guild.reactionRole){
    numEnabled++;
  }
  if(guild.joinRole){
    numEnabled++;
  }
  if(guild.removeJoinRole){
    numEnabled++;
  }
}

async function getInfo(){

  guild = JSON.parse(sessionStorage.getItem('Guild Info'));
  toBeUpdated = guild;
  const rt = sessionStorage.getItem('user').refreshToken;
  user = await refreshUserInfo(rt);
  
  getNumEnabledOnLoad(toBeUpdated);

  //fetchRoles
  await fetch("http://localhost:8090/api/v1/modbot/database/data/roles/" + toBeUpdated.id)
  .then(roleRes => roleRes.json())
  .then(info => {
    info.forEach((r) => {
      guildRoles.push(new Role(r.name, r.color, r.roleId));
    });
  });
  //fetchChannels
  await fetch("http://localhost:8090/api/v1/modbot/database/data/channels/" + toBeUpdated.id)
  .then(channelRes => channelRes.json())
  .then(info => {
    info.forEach((c) => {
      if (c.type == 0){
        guildTCs.push(new Channel(c.type, c.name, c.channelId));
      } else if (c.type == 2){
        guildVCs.push(new Channel(c.type, c.name, c.channelId));
      } else if (c.type == 4){
        guildCatagories.push(new Channel(c.type, c.name, c.channelId));
      }
    });
  });
  //fetchBotNickname
  await fetch("http://localhost:8090/api/v1/modbot/database/data/nick/" + toBeUpdated.id)
  .then(nickRes => nickRes.json())
  .then(info => {
    botNickName = info.nick;
  });

  renderCCs(toBeUpdated);

  document.getElementById("adminOnlyCheckbox").checked = toBeUpdated.modOnly;
  document.getElementById("dTitleH1").innerHTML = toBeUpdated.name;
  document.getElementById("regionH3").innerHTML = toBeUpdated.region;
  document.getElementById("numCat").innerHTML = guildCatagories.length;
  document.getElementById("numTCs").innerHTML = guildTCs.length;
  document.getElementById("numVCs").innerHTML = guildVCs.length;
  document.getElementById("numRoles").innerHTML = guildRoles.length;
  document.getElementById("prefixField").innerHTML = toBeUpdated.prefix;
  document.getElementById("nickField").innerHTML = botNickName;
  document.getElementById("rrNum").innerHTML = toBeUpdated.listOfReactionRoles.length;
  document.getElementById("jrNum").innerHTML = toBeUpdated.listOfJoinRoles.length;
  document.getElementById("ccNum").innerHTML = toBeUpdated.listOfCCs.length;

  setEnabledAndDisabled(numEnabled);
  document.getElementById("setPrefixCheckbox").checked = toBeUpdated.setPrefix;
  document.getElementById("cmdHelpCheckbox").checked = toBeUpdated.help;
  document.getElementById("botInfoCheckbox").checked = toBeUpdated.botInfo;
  document.getElementById("serverInfoCheckbox").checked = toBeUpdated.serverInfo;
  document.getElementById("userInfoCheckbox").checked = toBeUpdated.userInfo;
  document.getElementById("banWordCheckbox").checked = toBeUpdated.banWord;
  document.getElementById("getBannedWordsCheckbox").checked = toBeUpdated.getBannedWords;
  document.getElementById("removeBannedWordCheckbox").checked = toBeUpdated.removeBannedWords;
  document.getElementById("banUserCheckbox").checked = toBeUpdated.banUser;
  document.getElementById("kickUserCheckbox").checked = toBeUpdated.kickUser;
  document.getElementById("muteUserCheckbox").checked = toBeUpdated.muteUser;
  document.getElementById("rrCheckbox").checked = toBeUpdated.reactionRole;
  document.getElementById("jrCheckbox").checked = toBeUpdated.joinRole;
  document.getElementById("removeJrCheckbox").checked = toBeUpdated.removeJoinRole;

  dynamicContentContainer.style.display = "block";
  loaderDiv.style.display = "none";
  loaded = false;
}

function setGuildRelatedValues(g){
  if (g.icon){
    var iconStr = g.icon;
    var type;
    if(iconStr.substring(0, 2) == "a_"){
      type = ".gif";
    } else {
      type = ".png";
    }
    document.getElementById("iconImg").src = `https://cdn.discordapp.com/icons/${g.id}/${iconStr}${type}`;
  } else {
    document.getElementById("iconImg").src = "src/img/default.png";
  }
  document.getElementById("guildName").innerHTML = g.name;
}

async function updateGuildInfo(gtp){
  if (!equals(gtp, guild)){
    console.log("posted guilds");
    await fetch("http://localhost:8090/api/v1/modbot/database/guild", {
      method: 'PUT',
	    body: JSON.stringify(gtp),
    });
    sessionStorage.setItem('Guild Info', JSON.stringify(gtp));
  }
}

function equals(gtp, og){
  var rrE = true;
  var ccE = true;
  var jrE = true;
  var bwE = true;

  if (gtp.listOfReactionRoles.length == og.listOfReactionRoles.length){
    for(var i = 0; i < gtp.listOfReactionRoles.length; i++){
      var gtpRR = gtp.listOfReactionRoles[i];
      var ogRR = og.listOfReactionRoles[i];
      if(
        gtpRR.mid == ogRR.mid &&
        gtpRR.cid == ogRR.cid &&
        gtpRR.iid == ogRR.iid &&
        gtpRR.rid == ogRR.rid &&
        gtpRR.isemote == ogRR.isemote &&
        gtpRR.type == ogRR.type
      ){

      } else {
        rrE = false;
        break;
      }
    }
  } else {
    rrE = false;
  }

  if (gtp.listOfCCs.length == og.listOfCCs.length){
    for(var i = 0; i < gtp.listOfCCs.length; i++){
      var gtpCC = gtp.listOfCCs[i];
      var ogCC = og.listOfCCs[i];
      if(
        gtpCC.name == ogCC.name &&
        gtpCC.handle == ogCC.handle &&
        gtpCC.help == ogCC.help
      ){

      } else {
        ccE = false;
        break;
      }
    }
  } else {
    ccE = false;
  }

  if (gtp.listOfJoinRoles.length == og.listOfJoinRoles.length){
    for(var i = 0; i < gtp.listOfJoinRoles.length; i++){
      if(gtp.listOfJoinRoles[i] == og.listOfJoinRoles[i]){

      } else {
        jrE = false;
        break;
      }
    }
  } else {
    jrE = false;
  }

  if (gtp.listOfBannedWords.length == og.listOfBannedWords.length){
    for(var i = 0; i < gtp.listOfJoinRoles.length; i++){
      if(gtp.listOfBannedWords[i] == og.listOfBannedWords[i]){

      } else {
        bwE = false;
        break;
      }
    }
  } else {
    bwE = false;
  }

  if(
    gtp.id == og.id &&
    gtp.name == og.name &&
    gtp.icon == og.icon &&
    gtp.features == og.features &&
    gtp.prefix == og.prefix &&
    gtp.region == og.region &&
    rrE &&
    ccE &&
    jrE &&
    bwE &&
    gtp.numMembers == og.numMembers &&
    gtp.modOnly == og.modOnly &&
    gtp.setPrefix == og.setPrefix &&
    gtp.help == og.help &&
    gtp.botInfo == og.botInfo &&
    gtp.serverInfo == og.serverInfo &&
    gtp.userInfo == og.userInfo &&
    gtp.banWord == og.banWord &&
    gtp.getBannedWords == og.getBannedWords &&
    gtp.removeBannedWords == og.removeBannedWords &&
    gtp.banUser == og.banUser &&
    gtp.kickUser == og.kickUser &&
    gtp.muteUser == og.muteUser &&
    gtp.joinRole == og.joinRole &&
    gtp.reactionRole == og.reactionRole &&
    gtp.removeJoinRole == og.removeJoinRole
  ){

  }
}

function renderCCs(guild){
  for(var i = 0; i < guild.listOfCCs.length; i++){
    renderCC(i, guild.listOfCCs[i]);
  }
}

async function renderCC(index, cc){
  var ccHtml = document.createElement("div");
  ccHtml.id = "ccIndex" + index;
  ccHtml.classList.add("cc-as-html-container");

    var ccName = document.createElement("div");
    ccName.classList.add("cc-name");

      var ccNameHeader = document.createElement("h3");
      ccNameHeader.innerHTML = cc.name;
      ccName.appendChild(ccNameHeader);

    var ccHelp = document.createElement("div");
    ccHelp.classList.add("cc-help");

      var ccHelpHeader = document.createElement("h3");
      ccHelpHeader.innerHTML = cc.help;
      ccHelp.appendChild(ccHelpHeader);

    var ccEdit = document.createElement("div");
    ccEdit.classList.add("cc-edit");

      var ccEditBtnContainer = document.createElement("div");
      ccEditBtnContainer.classList.add("edit-cc-btn__container");

        var ccEditBtn = document.createElement("div");
        ccEditBtn.classList.add("edit-cc-btn");
        ccEditBtn.onclick = () => {
          editCCModal.style.display = "block";
          document.getElementById("editCCHeader").dataset.indexNumber = index;
          document.getElementById("editedCCName").innerHTML = cc.name;
          document.getElementById("editedCCHelp").innerHTML = cc.help;
          document.getElementById("editedCCResponse").innerHTML = cc.handle;
        }

          var ccEditBtnHeader = document.createElement("h2");
          ccEditBtnHeader.classList.add("edit-cc-btn__h2");
          ccEditBtnHeader.innerHTML = "Edit";
          ccEditBtn.appendChild(ccEditBtnHeader);

        ccEditBtnContainer.appendChild(ccEditBtn);

      ccEdit.appendChild(ccEditBtnContainer);  

    ccHtml.appendChild(ccName);
    ccHtml.appendChild(ccHelp);
    ccHtml.appendChild(ccEdit);
  existingCCContainer.appendChild(ccHtml);
}

getInfo();
startLoadingAnimation();
setGuildRelatedValues(toBeUpdated);
document.getElementById("dashboardATag").addEventListener("click", function(){
  document.getElementById("cmdsContainer").style = "display:none; visibility:hidden;";
  document.getElementById("docContainer").style = "display:none; visibility:hidden;";
  document.getElementById("ccsContainer").style = "display:none; visibility:hidden;";
  document.getElementById("dashboardContainer").style = "";
});
document.getElementById("commandsATag").addEventListener("click", () => {
  document.getElementById("dashboardContainer").style = "display:none; visibility:hidden;";
  document.getElementById("docContainer").style = "display:none; visibility:hidden;";
  document.getElementById("ccsContainer").style = "display:none; visibility:hidden;";
  document.getElementById("cmdsContainer").style = "";
});
document.getElementById("customCommandsATag").addEventListener("click", () => {
  document.getElementById("dashboardContainer").style = "display:none; visibility:hidden;";
  document.getElementById("docContainer").style = "display:none; visibility:hidden;";
  document.getElementById("cmdsContainer").style = "display:none; visibility:hidden;";
  document.getElementById("ccsContainer").style = "";
});
document.getElementById("docATag").addEventListener("click", () => {
  document.getElementById("dashboardContainer").style = "display:none; visibility:hidden;";
  document.getElementById("docContainer").style = "";
  document.getElementById("ccsContainer").style = "display:none; visibility:hidden;";
  document.getElementById("cmdsContainer").style = "display:none; visibility:hidden;";
});

document.getElementById("docsButton").onclick = function(){
  document.getElementById("dashboardContainer").style = "display:none; visibility:hidden;";
  document.getElementById("docContainer").style = "";
  document.getElementById("ccsContainer").style = "display:none; visibility:hidden;";
  document.getElementById("cmdsContainer").style = "display:none; visibility:hidden;";
}
document.getElementById("variablesAccordian").addEventListener("click", function() {
  this.classList.toggle("active");
  var content = this.nextElementSibling;
  if (content.style.maxHeight){
    content.style.maxHeight = null;
  } else {
    content.style.maxHeight = content.scrollHeight + "px";
  }
});
document.getElementById("variablesEditAccordian").addEventListener("click", function() {
  this.classList.toggle("active");
  var content = this.nextElementSibling;
  if (content.style.maxHeight){
    content.style.maxHeight = null;
  } else {
    content.style.maxHeight = content.scrollHeight + "px";
  }
});

document.getElementById("confirmEditCCButton").onclick = function(){
  var name = document.getElementById("editedCCName");
  var index = document.getElementById("editCCHeader").dataset.indexNumber;
  var handle = document.getElementById("editedCCResponse");
  var help = document.getElementById("editedCCHelp");
  if (help.value != "" && name.value != "" && handle.value != ""){
    toBeUpdated.listOfCCs[index] = new CustomCommand(handle.value, name.value, help.value);
    editCCModal.style.display = "none";
    var htmlCCToUpdate = document.getElementById("ccIndex" + index);
    htmlCCToUpdate.getElementsByClassName("cc-name")[0].firstElementChild.innerHTML = name.value;
    htmlCCToUpdate.getElementsByClassName("cc-help")[0].firstElementChild.innerHTML = help.value;

    name.innerHTML = "";
    help.innerHTML = "";
    handle.innerHTML = "";
  } else {
    alert("Please fill out all the fields");
  }
}
document.getElementById("deleteEditCCButton").onclick = function(){
  editCCModal.style.display = "none";
  var index = document.getElementById("editCCHeader").dataset.indexNumber;
  toBeUpdated.listOfCCs.splice(index, 1);
  
  var htmlCCToUpdate = document.getElementById("ccIndex" + index);
  htmlCCToUpdate.remove();

  document.getElementById("editCCHeader").dataset.indexNumber = "";
  document.getElementById("editedCCName").innerHTML = "";
  document.getElementById("editedCCResponse").innerHTML = "";
  document.getElementById("editedCCHelp").innerHTML = "";
}
document.getElementById("cancelEditCCButton").onclick = function(){
  editCCModal.style.display = "none";
  document.getElementById("editCCHeader").dataset.indexNumber = "";
  document.getElementById("editedCCName").innerHTML = "";
  document.getElementById("editedCCResponse").innerHTML = "";
  document.getElementById("editedCCHelp").innerHTML = "";
}

document.getElementById("createCCButton").onclick = function(){
  var name = document.getElementById("ccName");
  var handle = document.getElementById("ccResponse");
  var help = document.getElementById("ccHelp");
  if (help.value != "" && name.value != "" && handle.value != ""){
    var newCC = new CustomCommand(handle.value, name.value, help.value);
    toBeUpdated.listOfCCs.push(newCC);
    renderCC(toBeUpdated.listOfCCs.length - 1, newCC);
    createCCModal.style.display = "none";
    name.innerHTML = "";
    help.innerHTML = "";
    handle.innerHTML = "";
  } else {
    alert("Please fill out all the fields");
  }
}
document.getElementById("cancelCreateCCButton").onclick = function(){
  createCCModal.style.display = "none";
  document.getElementById("ccName").innerHTML = "";
  document.getElementById("ccHelp").innerHTML = "";
  document.getElementById("ccResponse").innerHTML = "";
}
document.getElementById("pullUpCreateCCWindow").onclick = function(){
  createCCModal.style.display = "block";
}

document.getElementById("adminOnlyCheckbox").onclick = async function(){
  toBeUpdated.modOnly = !(toBeUpdated.modOnly);
  await updateGuildInfo(toBeUpdated);
  sessionStorage.setItem('Guild Info', JSON.stringify(toBeUpdated));
}

document.getElementById("setPrefixCheckbox").onclick = async function(){
  toBeUpdated.setPrefix = !(toBeUpdated.setPrefix);
  await updateGuildInfo(toBeUpdated);
  sessionStorage.setItem('Guild Info', JSON.stringify(toBeUpdated));
  if(toBeUpdated.setPrefix){
    console.log(numEnabled);
    numEnabled++;
    console.log(numEnabled);
  } else {
    console.log(numEnabled);
    numEnabled--;
    console.log(numEnabled);
  }
  setEnabledAndDisabled(numEnabled);
}
document.getElementById("cmdHelpCheckbox").onclick = async function(){
  toBeUpdated.help = !(toBeUpdated.help);
  sessionStorage.setItem('Guild Info', JSON.stringify(toBeUpdated));
  if(toBeUpdated.help){
    numEnabled++;
  } else {
    numEnabled--;
  }
  setEnabledAndDisabled(numEnabled);
}
document.getElementById("botInfoCheckbox").onclick = async function(){
  toBeUpdated.botInfo = !(toBeUpdated.botInfo);
  sessionStorage.setItem('Guild Info', JSON.stringify(toBeUpdated));
  if(toBeUpdated.botInfo){
    numEnabled++;
  } else {
    numEnabled--;
  }
  setEnabledAndDisabled(numEnabled);
}
document.getElementById("serverInfoCheckbox").onclick = async function(){
  toBeUpdated.serverInfo = !(toBeUpdated.serverInfo);
  sessionStorage.setItem('Guild Info', JSON.stringify(toBeUpdated));
  if(toBeUpdated.serverInfo){
    numEnabled++;
  } else {
    numEnabled--;
  }
  setEnabledAndDisabled(numEnabled);
}
document.getElementById("userInfoCheckbox").onclick = async function(){
  toBeUpdated.userInfo = !(toBeUpdated.userInfo);
  sessionStorage.setItem('Guild Info', JSON.stringify(toBeUpdated));
  if(toBeUpdated.userInfo){
    numEnabled++;
  } else {
    numEnabled--;
  }
  setEnabledAndDisabled(numEnabled);
}
document.getElementById("banWordCheckbox").onclick = async function(){
  toBeUpdated.banWord = !(toBeUpdated.banWord);
  sessionStorage.setItem('Guild Info', JSON.stringify(toBeUpdated));
  if(toBeUpdated.banWord){
    numEnabled++;
  } else {
    numEnabled--;
  }
  setEnabledAndDisabled(numEnabled);
}
document.getElementById("getBannedWordsCheckbox").onclick = async function(){
  toBeUpdated.getBannedWords = !(toBeUpdated.getBannedWords);
  sessionStorage.setItem('Guild Info', JSON.stringify(toBeUpdated));
  if(toBeUpdated.getBannedWords){
    numEnabled++;
  } else {
    numEnabled--;
  }
  setEnabledAndDisabled(numEnabled);
}
document.getElementById("removeBannedWordCheckbox").onclick = async function(){
  toBeUpdated.removeBannedWords = !(toBeUpdated.removeBannedWords);
  sessionStorage.setItem('Guild Info', JSON.stringify(toBeUpdated));
  if(toBeUpdated.removeBannedWords){
    numEnabled++;
  } else {
    numEnabled--;
  }
  setEnabledAndDisabled(numEnabled);
}
document.getElementById("banUserCheckbox").onclick = async function(){
  toBeUpdated.banUser = !(toBeUpdated.banUser);
  sessionStorage.setItem('Guild Info', JSON.stringify(toBeUpdated));
  if(toBeUpdated.banUser){
    numEnabled++;
  } else {
    numEnabled--;
  }
  setEnabledAndDisabled(numEnabled);
}
document.getElementById("kickUserCheckbox").onclick = async function(){
  toBeUpdated.kickUser = !(toBeUpdated.kickUser);
  sessionStorage.setItem('Guild Info', JSON.stringify(toBeUpdated));
  if(toBeUpdated.kickUser){
    numEnabled++;
  } else {
    numEnabled--;
  }
  setEnabledAndDisabled(numEnabled);
}
document.getElementById("muteUserCheckbox").onclick = async function(){
  toBeUpdated.muteUser = !(toBeUpdated.muteUser);
  sessionStorage.setItem('Guild Info', JSON.stringify(toBeUpdated));
  if(toBeUpdated.muteUser){
    numEnabled++;
  } else {
    numEnabled--;
  }
  setEnabledAndDisabled(numEnabled);
}
document.getElementById("rrCheckbox").onclick = async function(){
  toBeUpdated.reactionRole = !(toBeUpdated.reactionRole);
  sessionStorage.setItem('Guild Info', JSON.stringify(toBeUpdated));
  if(toBeUpdated.reactionRole){
    numEnabled++;
  } else {
    numEnabled--;
  }
  setEnabledAndDisabled(numEnabled);
}
document.getElementById("jrCheckbox").onclick = async function(){
  toBeUpdated.joinRole = !(toBeUpdated.joinRole);
  sessionStorage.setItem('Guild Info', JSON.stringify(toBeUpdated));
  if(toBeUpdated.joinRole){
    numEnabled++;
  } else {
    numEnabled--;
  }
  setEnabledAndDisabled(numEnabled);
}
document.getElementById("removeJrCheckbox").onclick = async function(){
  toBeUpdated.removeJoinRole = !(toBeUpdated.removeJoinRole);
  sessionStorage.setItem('Guild Info', JSON.stringify(toBeUpdated));
  if(toBeUpdated.removeJoinRole){
    numEnabled++;
  } else {
    numEnabled--;
  }
  setEnabledAndDisabled(numEnabled);
}


document.getElementById("prefixSubmitBtn").onclick = async function(){
  if (document.getElementById("prefixField").value != ""){
    toBeUpdated.prefix = document.getElementById("prefixField").value;
  }
}
document.getElementById("nickSubmitBtn").onclick = async function(){
  if (document.getElementById("nickField").value != ""){
    await fetch("http://localhost:8090/api/v1/modbot/database/data/nick/" + toBeUpdated.id, {
      method: 'POST',
      body: new URLSearchParams({
        'nick': document.getElementById("nickField").value
      }),
    });
  }
}

setInterval(() => {
  updateGuildInfo(toBeUpdated);
}, 30000);
