let fbLogin = document.getElementById("fbLogin");
let aboutPage = document.getElementById("aboutPage");
let whyPage = document.getElementById("whyPage");
let responsibilityPage = document.getElementById("responsibilityPage");
let benefitsPage = document.getElementById("benefitsPage");
let eligibilityPage = document.getElementById("eligibilityPage");
let menu = document.getElementById("menu");
let menuWrapper = document.getElementById("menuWrapper");

document.getElementById("about").addEventListener("click", (e) => {
  closeNav();
  aboutPage.style.display = "block";
});
document.getElementById("why").addEventListener("click", (e) => {
  whyPage.style.display = "block";
  closeNav();
});
document.getElementById("responsibility").addEventListener("click", (e) => {
  responsibilityPage.style.display = "block";
  closeNav();
});
document.getElementById("benefits").addEventListener("click", (e) => {
  benefitsPage.style.display = "block";
  closeNav();
});
document.getElementById("eligibility").addEventListener("click", (e) => {
  eligibilityPage.style.display = "block";
  closeNav();
});

document.getElementById("aboutClose").addEventListener("click", (e) => {
  aboutPage.style.display = "none";
    enableFb();
});

document.getElementById("whyClose").addEventListener("click", (e) => {
  whyPage.style.display = "none";
    enableFb();
});


document
  .getElementById("responsibilityClose")
  .addEventListener("click", (e) => {
    responsibilityPage.style.display = "none";
    enableFb();
  });

document.getElementById("benefitsClose").addEventListener("click", (e) => {
  benefitsPage.style.display = "none";
    enableFb();
});
document.getElementById("eligibilityClose").addEventListener("click", (e) => {
  eligibilityPage.style.display = "none";
    enableFb();
});


document.getElementById("navClose").addEventListener("click", (e) => {
  if (menu.classList.contains("gn-selected"));
  {
    menu.classList.remove("gn-selected");
    menuWrapper.classList.remove("gn-open-all");
  }
});

function closeNav() {
  menu.classList.remove("gn-selected");
  menuWrapper.classList.remove("gn-open-all");
}

function enableFb() {
  fbLogin.style.zIndex = 1;
}

let socialElements = document.getElementsByClassName("social-item");

for(let item of socialElements) {
  item.addEventListener("mouseover", () => {
    item.classList.add("animate__heartBeat");
  })
  item.addEventListener("mouseout", () => {
    item.classList.remove("animate__heartBeat");
  })
}



// menu.addEventListener("click", (e) => {
//   menu.classList.add("gn-selected");
//   menuWrapper.classList.add("gn-open-all");
// });

// document.getElementById("menuWrapper").addEventListener("mouseleave", (e) => {
//   document.getElementById("menu").classList.remove("gn-selected");
//   document.getElementById("menuWrapper").classList.remove("gn-open-all");
// });
