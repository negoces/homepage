const btn = document.getElementById("navbar-darkMode-toggle");
const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
const currentTheme = localStorage.getItem("theme");
const ele_bodyClass = document.body.classList;
const ele_themeHtml = document.querySelector("html");

function func_saveStatus() {
    var theme = ele_themeHtml.getAttribute("theme");
    localStorage.setItem("theme", theme);
}

if (currentTheme == "dark") {
    ele_themeHtml.setAttribute("theme", "dark")
} else if (currentTheme == "light") {
    ele_themeHtml.setAttribute("theme", "light")
} else {
    if (prefersDarkScheme.matches) {
        ele_themeHtml.setAttribute("theme", "dark")
    } else {
        ele_themeHtml.setAttribute("theme", "light")
    }
    func_saveStatus();
}

btn.addEventListener("click", () => {
    var theme = (ele_themeHtml.getAttribute("theme") == "light") ? "dark" : "light";
    ele_themeHtml.setAttribute("theme", theme);
    func_saveStatus();
});