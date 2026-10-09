# Indra club website

 Files:

- `index.html`: page structure
- `style.css`: look and feel
- `script.js`: renders events, gallery, membership and the hero arm
- `config.js`: **the only file you edit day to day**
- `images/gallery/`: put your photos here (create this folder next to index.html)

## Everyday updates (all in config.js)

**Add an event:** copy one block in `events`, change the details. It moves from Upcoming to Past by itself after its date.

**Add gallery photos:** drop the file in `images/gallery/`, then add a line in `gallery`.

**Open membership for a limited period:**
1. Create a Google Form (forms.google.com), click Send, then the link icon, and copy the link.
2. In `membership` set `open: true`, paste the link in `formUrl`, and set `closesOn` to the last day.
3. Upload the changed `config.js`. The Join section and the nav button appear, and disappear automatically after the deadline.

To close early, set `open: false`.

**Announce anything new:** add an item to `announcements` with `from` and `until` dates. It shows as a yellow banner on top of every page load during that window.

## Publishing on your own domain

Any static host works. Easy free options: Cloudflare Pages, Netlify or GitHub Pages. Upload this folder, then in the host's settings add your custom domain and set the DNS records they show you at your domain registrar. HTTPS is added automatically.

## Before you publish

- The two events and six gallery entries in `config.js` are samples. Replace them.
- Add `email` under `social` if you want a contact button.
