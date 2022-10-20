const ele_postsCover = document.getElementsByClassName("posts-card-cover");
const ele_singleTitle = document.getElementById("single-title");
const ele_htm = document.querySelector("html");
const topBtn = document.getElementById("single-title-top");

for (var i = 0; i < ele_postsCover.length; i++) {
    const element = ele_postsCover.item(i);
    const imageURL = element.getAttribute("data-cover");
    element.setAttribute("style", "background-image: url(" + imageURL + ");");
}

if (topBtn != null) {
    topBtn.addEventListener("click", () => {
        window.scrollTo({
            left: 0,
            top: 0,
            behavior: 'smooth'
        });
    });
}

function func_toggleTitleClass() {
    if (ele_htm.scrollTop > 4) {
        ele_singleTitle.classList.add("title-bg");
    } else {
        ele_singleTitle.classList.remove("title-bg");
    }
}

func_toggleTitleClass();
window.addEventListener("scroll", func_toggleTitleClass);