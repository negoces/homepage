const btn = document.getElementById("navbar-darkMode-toggle");
const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
const currentTheme = localStorage.getItem("theme");
const ele_bodyClass = document.body.classList;

function func_saveStatus() {
    var theme = ele_bodyClass.contains("dark-theme") ? "dark" : "light";
    localStorage.setItem("theme", theme);
}

if (currentTheme == "dark") {
    ele_bodyClass.add("dark-theme");
} else if (currentTheme == "light") {
    ele_bodyClass.remove("dark-theme");
} else {
    if (prefersDarkScheme.matches) {
        ele_bodyClass.add("dark-theme");
    } else {
        ele_bodyClass.remove("dark-theme");
    }
    func_saveStatus();
}

btn.addEventListener("click", () => {
    ele_bodyClass.toggle("dark-theme")
    func_saveStatus();
});