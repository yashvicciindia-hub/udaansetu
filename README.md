# UdaanSetu Website

A static, responsive marketing website for UdaanSetu — India's Integrated Livelihood
Infrastructure Platform. Plain HTML/CSS/JS, no build step, no backend. Registration
runs through 3 Google Forms.

## Structure

```
/
├── index.html              Homepage
├── pages/
│   ├── how-it-works.html
│   ├── solutions.html
│   ├── opportunities.html
│   ├── ecosystem.html
│   ├── impact.html
│   ├── about.html
│   ├── partner.html
│   └── contact.html
├── css/
│   └── style.css           All styles (design tokens at the top)
├── js/
│   ├── config.js           ⭐ Google Form URLs + contact info — edit here only
│   └── main.js              Nav, modal, animations, form-link wiring
├── assets/
│   ├── logo/                logo.svg, favicon.svg (placeholders — replace)
│   ├── images/               (empty — see checklist in the chat response)
│   └── icons/                 (empty — icons are inline SVG in the HTML)
└── README.md
```

## Editing form URLs, email, phone, address

Open `js/config.js`. Every "Get Started", "Partner With Us" and "Contact" button
across the whole site reads from this one file — change a URL there and it
updates everywhere automatically.

## Opening the site

Just open `index.html` in a browser, or serve the folder with any static server
(e.g. `python3 -m http.server`).
