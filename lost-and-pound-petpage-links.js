// ==UserScript==
// @name         Neopets Lost and Pound: Petpage URLs
// @version      0.0.1
// @description  Changes Lost and Pound pet lookup links into petpage links
// @author       Amu
// @match        *://*.lost.quiggle.org/*
// @match        *://lost.quiggle.org/*
// @grant        none
// @icon         https://www.neopets.com/favicon.ico
// ==/UserScript==

(function() {
    'use strict';
    const links = document.querySelectorAll('a[href*="www.neopets.com/search.phtml?selected_type=pet&string="]');
    links.forEach(link => {
        const href = link.getAttribute("href");
        const tempURL = new URL(href);
        const petName = tempURL.searchParams.get("string");
        const newURL = new URL("https://www.neopets.com/~" + petName);
        link.setAttribute("href", newURL.href.toString());
    })
})();
