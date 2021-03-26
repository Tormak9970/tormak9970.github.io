class GuildObj{
  constructor(id, name, icon, features, prefix, region, listOfReactionRoles, listOfCCs, listOfJoinRoles, listOfBannedWords, numMembers, modOnly, 
    setPrefix, help, botInfo, serverInfo, userInfo, banWord, getBannedWords, removeBannedWords, banUser, kickUser, muteUser, joinRole, reactionRole, removeJoinRole){
    this.id = id;
    this.name = name;
    this.icon = icon;
    this.features = features;
    this.prefix = prefix;
    this.region = region;
    this.listOfReactionRoles = listOfReactionRoles;
    this.listOfCCs = listOfCCs;
    this.listOfJoinRoles = listOfJoinRoles;
    this.listOfBannedWords = listOfBannedWords;
    this.numMembers = numMembers;
    this.modOnly = modOnly;
    this.setPrefix = setPrefix;
    this.help = help;
    this.botInfo = botInfo;
    this.serverInfo = serverInfo;
    this.userInfo = userInfo;
    this.banWord = banWord;
    this.getBannedWords = getBannedWords;
    this.removeBannedWords = removeBannedWords;
    this.banUser = banUser;
    this.kickUser = kickUser;
    this.muteUser = muteUser;
    this.joinRole = joinRole;
    this.reactionRole = reactionRole;
    this.removeJoinRole = removeJoinRole;
  }
  
}

export default GuildObj;