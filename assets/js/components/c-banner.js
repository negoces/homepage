console.log("[Components: Banner]: Loaded.");

// Define <c-banner>

const tmpl = document.createElement("template");
tmpl.innerHTML = `
<div class="c-banner"><slot></slot></dev>
`;

const stylesheet = document.createElement("style");
stylesheet.textContent = `
div.c-banner {
  color: #ffffff;
  background-color: #4351e8;
  text-align: center;
  font-size: 0.9rem;
  line-height: 2rem;
}
`;

customElements.define(
  "c-banner",
  class extends HTMLElement {
    constructor() {
      self = super();
      let shadow = this.attachShadow({ mode: "open" });
      shadow.appendChild(stylesheet);
      shadow.appendChild(tmpl.content.cloneNode(true));
    }
  }
);
