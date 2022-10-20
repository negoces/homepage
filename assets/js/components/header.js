const ele_header = document.getElementById("header");
const ele_html = document.querySelector("html");
const ele_navItems = document.getElementsByClassName("navbar-menu-item");

function func_toggleHerderClass() {
    if (ele_html.scrollTop > 4) {
        ele_header.classList.add("header-bg");
    } else {
        ele_header.classList.remove("header-bg");
    }
}

func_toggleHerderClass();
window.addEventListener("scroll", func_toggleHerderClass);

// Header:Navbar:当前路由高亮
console.log("当前位置：", window.location.pathname);
for (var i = 0; i < ele_navItems.length; i++) {
    const element = ele_navItems.item(i);
    if (element.href === document.URL) {
        element.classList.add("navbar-current-item");
    }
}