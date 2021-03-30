let poOpen = false;
let oApClosed = true;
let wasJS = false;
let valsDic = {
    height: "192px",
    width: "162px"
}
let wdBtn = document.getElementById("wd");
let backendBtn = document.getElementById("backend");
let fsBtn = document.getElementById("fs");
let otherBtn = document.getElementById("other");
let torcBtn = document.getElementById("torc");
let slicersBtn = document.getElementById("slicers");

let wdDDBtn = document.getElementById("wdDDBtn");
let backDDBtn = document.getElementById("backDDBtn");
let fsDDBtn = document.getElementById("fsDDBtn");
let otherDDBtn = document.getElementById("otherDDBtn");
let torcDDBtn = document.getElementById("torcDDBtn");
let slicersDDBtn = document.getElementById("slicersDDBtn");

let wdOverlay = document.getElementById("wdOverlay");
let backendOverlay = document.getElementById("backendOverlay");
let fsOverlay = document.getElementById("fsOverlay");
let otherOverlay = document.getElementById("otherOverlay");
let torcOverlay = document.getElementById("torcOverlay");
let slicersOverlay = document.getElementById("slicersOverlay");

let projectCatsOverlay = document.getElementById("projectCatsOverlay");
let oAp = document.getElementById("openAndCloseSpan__cats");

let po = document.getElementById("projectOverlay");
let oAC = document.getElementById("openAndCloseSpan__proj");

let pwProjLink = document.getElementById("pwProjLink");
let pwProjPage = document.getElementById("pwProjPage");

let torcProjLink = document.getElementById("torcProjLink");

let cdProjLink = document.getElementById("cdProjLink");
let cdProjPage = document.getElementById("cdProjPage");

let mbUIProjLink = document.getElementById("mbUIProjLink");
let mbBackProjLink = document.getElementById("mbBackProjLink");
let mbDiscBotProjLink = document.getElementById("mbDiscBotProjLink");
let fsModbotProjLink = document.getElementById("fsModbotProjLink");
let mbProjPage = document.getElementById("mbProjPage");

let mDBUIProjLink = document.getElementById("mDBUIProjLink");
let mDBBackProjLink = document.getElementById("mDBBackProjLink");
let fsMemeDBProjLink = document.getElementById("fsMemeDBProjLink");
let memedbProjPage = document.getElementById("memedbProjPage");

let msVersionCheckbox = document.getElementById("msVersionCheckbox");
let msNormal = document.getElementById("msNormal");
let msAnimated = document.getElementById("msAnimated");

let ogMSProjLink = document.getElementById("ogMSProjLink");
let aMSProjLink = document.getElementById("aMSProjLink");
let msProjPage = document.getElementById("msProjPage");

let pongProjLink = document.getElementById("pongProjLink");
let pongProjPage = document.getElementById("pongProjPage");

let tetProjLink = document.getElementById("tetProjLink");
let tetProjPage = document.getElementById("tetProjPage");

let toBack = document.getElementById("toBack");
let skillBack = document.getElementById("skillBack");

let toFront = document.getElementById("toFront");
let skillFront = document.getElementById("skillFront");

let mobileMenu = document.getElementById("mobileMenu");
let mobileMenuList = document.getElementById("mobileMenuList");
let projectDDBtn = document.getElementById("projectDDBtn");
let projectDDCont = document.getElementById("projectDDCont");
let projectDDContWrapper = document.getElementById("projectDDContWrapper");
let orgsDDBtn = document.getElementById("orgsDDBtn");
let orgsDDCont = document.getElementById("orgsDDCont");
let orgsDDContWrapper = document.getElementById("orgsDDContWrapper");

let projLinks = [
    pwProjLink,
    cdProjLink,
    [
        mbUIProjLink,
        mbBackProjLink,
        mbDiscBotProjLink,
        fsModbotProjLink
    ],
    [
        mDBUIProjLink,
        mDBBackProjLink,
        fsMemeDBProjLink
    ],
    [
        ogMSProjLink,
        aMSProjLink
    ],
    pongProjLink,
    tetProjLink
];
let projPages = [
    pwProjPage,
    cdProjPage,
    mbProjPage,
    memedbProjPage,
    msProjPage,
    pongProjPage,
    tetProjPage
];
let projectCatsBtnList = [wdBtn, backendBtn, fsBtn, otherBtn, torcBtn, slicersBtn];
let mbDDBtnList = [
    wdDDBtn,
    backDDBtn,
    fsDDBtn,
    otherDDBtn,
    torcDDBtn,
    slicersDDBtn
];
let projectCatsOverlayList = [wdOverlay, backendOverlay, fsOverlay, otherOverlay, torcOverlay, slicersOverlay];

oAC.addEventListener("click", (e) => {
    e.preventDefault();
    if (po.style[mode] != `calc(100% - ${valsDic[mode]})`) {
        if (!wasJS) {
            displayFeaturedProj();
            if (oApClosed) {
                oAp.click();
            }
        }
        po.style[mode] = `calc(100% - ${valsDic[mode]})`;
        oAC.innerHTML = openArrow;
        poOpen = true;
    } else {
        po.style[mode] = 0;
        oAC.innerHTML = closedArrow;
        resetProjectElems();
        poOpen = false;
    }
});
torcProjLink.addEventListener("click", (e) => {
    e.preventDefault();
    torcBtn.click();
    poOpen = false;
});
msVersionCheckbox.addEventListener("change", () => {
    if (msVersionCheckbox.checked) {
        msNormal.style.display = "none";
        msAnimated.style.display = "";
    } else {
        msAnimated.style.display = "none";
        msNormal.style.display = "";
    }
});
toBack.addEventListener("click", () => {
    skillBack.classList.toggle("mb-hide");
    skillFront.classList.toggle("mb-hide");
});
toFront.addEventListener("click", () => {
    skillBack.classList.toggle("mb-hide");
    skillFront.classList.toggle("mb-hide");
});
mobileMenu.addEventListener("click", (e) => {
    e.currentTarget.classList.toggle("change");
    if (mobileMenuList.classList.contains("mb-hide")) {
        mobileMenuList.parentElement.style.height = "84px";
        
    } else {
        mobileMenuList.parentElement.style.height = 0;
        projectDDBtn.innerHTML = '<i class="fas fa-plus"></i>';
        projectDDCont.style.height = 0;
        projectDDContWrapper.style.display = "none";
        orgsDDBtn.innerHTML = '<i class="fas fa-plus"></i>';
        orgsDDCont.style.height = 0;
        orgsDDContWrapper.style.display = "none";
    }
    mobileMenuList.classList.toggle("mb-hide");
});
projectDDBtn.addEventListener("click", () => {
    if (projectDDContWrapper.style.display == "none") {
        projectDDBtn.innerHTML = '<i class="fas fa-minus"></i>';
        projectDDCont.style.height = "126px";
        projectDDContWrapper.style.display = "flex";
        if (orgsDDContWrapper.style.display == "none") {
            mobileMenuList.parentElement.style.height = "210px";
        } else {
            mobileMenuList.parentElement.style.height = "268px";
        }
    } else {
        projectDDBtn.innerHTML = '<i class="fas fa-plus"></i>';
        projectDDCont.style.height = 0;
        projectDDContWrapper.style.display = "none";
        if (orgsDDContWrapper.style.display == "none") {
            mobileMenuList.parentElement.style.height = "84px";
        } else {
            mobileMenuList.parentElement.style.height = "142px";
        }
    }
});
orgsDDBtn.addEventListener("click", () => {
    if (orgsDDContWrapper.style.display == "none") {
        orgsDDBtn.innerHTML = '<i class="fas fa-minus"></i>';
        orgsDDCont.style.height = "58px";
        orgsDDContWrapper.style.display = "flex";
        if (projectDDContWrapper.style.display == "none") {
            mobileMenuList.parentElement.style.height = "142px";
        } else {
            mobileMenuList.parentElement.style.height = "268px";
        }
    } else {
        orgsDDBtn.innerHTML = '<i class="fas fa-plus"></i>';
        orgsDDCont.style.height = 0;
        orgsDDContWrapper.style.display = "none";
        if (projectDDContWrapper.style.display == "none") {
            mobileMenuList.parentElement.style.height = "84px";
        } else {
            mobileMenuList.parentElement.style.height = "210px";
        }
    }
});
oAp.addEventListener("click", (e) => {
    e.preventDefault();
    if (projectCatsOverlay.style[mode] == 0 || projectCatsOverlay.style[mode] == "0px") {
        projectCatsOverlay.style[mode] = `calc(100% - ${valsDic[mode]})`;
        oAp.innerHTML = openArrow;
        wdBtn.classList.add("project-btn__displaying");
        wdOverlay.style.display = "flex";
        oApClosed = false;
    } else {
        if (poOpen) {
            oAC.click();
        }
        projectCatsOverlay.style[mode] = 0;
        oAp.innerHTML = closedArrow;
        resetElems();
        oApClosed = true;
    }
});

for (let i = 0; i < projLinks.length; i++) {
    let projLink = projLinks[i];
    let projPage = projPages[i];

    if (Array.isArray(projLink)) {
        projLink.forEach((link) => {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                resetProjectElems();
                showPage(projPage);
                wasJS = true;
                oAC.click();
                wasJS = false;
            });
        });
    } else {
        projLink.addEventListener("click", (e) => {
            e.preventDefault();
            resetProjectElems();
            showPage(projPage);
            wasJS = true;
            oAC.click();
            wasJS = false;
        });
    }
}
for (let i = 0; i < projectCatsBtnList.length; i++) {
    let pb = projectCatsBtnList[i];
    let mbPB = mbDDBtnList[i];
    let po = projectCatsOverlayList[i];

    pb.addEventListener("click", (e) => {
        e.preventDefault();
        resetElems();
        pb.classList.add("project-btn__displaying");
        if (projectCatsOverlay.style[mode] != `calc(100% - ${valsDic[mode]})`) {
            projectCatsOverlay.style[mode] = `calc(100% - ${valsDic[mode]})`;
            oAp.innerHTML = openArrow;
        }
        po.style.display = "flex";
    });

    mbPB.addEventListener("click", (e) => {
        e.preventDefault();
        resetElems();
        mobileMenu.click();
        if (projectCatsOverlay.style[mode] != `calc(100% - ${valsDic[mode]})`) {
            projectCatsOverlay.style[mode] = `calc(100% - ${valsDic[mode]})`;
            oAp.innerHTML = openArrow;
        }
        po.style.display = "flex";
    });
}

function displayFeaturedProj() {
    showPage(cdProjPage);
}
function resetProjectElems() {
    projPages.forEach((page) => {
        page.style.display = "none";
    });
}
function showPage(page) {
    page.style.display = "";
}
function resetElems() {
    projectCatsOverlayList.forEach((po) => {
        po.style.display = "none";
    });
    projectCatsBtnList.forEach((pb) => {
        pb.classList.remove("project-btn__displaying");
    });
}

let openArrow = '<i class="fas fa-angle-double-right"></i>';
let closedArrow = '<i class="fas fa-angle-double-left"></i>';
let mode = "width";
const mq = window.matchMedia("(orientation: portrait)");
if (mq.matches) {
    mode = "height";
    openArrow = '<i class="fas fa-angle-double-down"></i>';
    closedArrow = '<i class="fas fa-angle-double-up"></i>';
    oAC.innerHTML = closedArrow;
    oAp.innerHTML = closedArrow;
}