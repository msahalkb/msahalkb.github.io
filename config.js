/* ==========================================================================
   INDRA website: the only file you need to edit for day-to-day updates.
   After changing anything here, save and re-upload the file to your host.
   Dates are written as "YYYY-MM-DD".
   ========================================================================== */

window.INDRA = {

  /* ---------- Social links ---------- */
  social: {
    linkedin: "https://www.linkedin.com/company/indracusat/",
    instagram: "https://www.instagram.com/indra_cusat/",
    email: "" // optional, e.g. "indra@cusat.ac.in"
  },

  /* ---------- Contact form ----------
     Messages from the contact form are emailed to this address. */
  contact: {
    email: "indradoi@ug.cusat.ac.in"
  },

  /* ---------- Membership form ----------
     Turn it on only when you are recruiting.
       open: true   -> the "Join" section and nav button appear
       open: false  -> they disappear completely
     closesOn: the form hides itself automatically after this date
               (the whole of that day is still open). Leave "" for no deadline.
     formUrl:  link to your Google Form (or any form). Create the form at
               forms.google.com, click Send > link icon, paste the link here.
     embed:    true shows the form inside the page, false opens it in a new tab. */
  membership: {
    open: true,
    closesOn: "2026-11-30",
    formUrl: "",
    embed: false,
    title: "Join Indra",
    text: "Memberships are open for a limited time. If you want to be part of something bigger, fill in the form before the deadline."
  },

  /* ---------- Announcements ----------
     A banner at the top of the page for anything new: a recruitment drive,
     a competition, a registration link. Each one shows only between
     "from" and "until" (both optional). Add as many as you like. */
  announcements: [
    // {
    //   text: "Robo Wars registrations are open.",
    //   linkText: "Register",
    //   linkUrl: "https://example.com",
    //   from: "2026-10-01",
    //   until: "2026-10-31"
    // }
  ],

  /* ---------- Events ----------
     Add one block per event. The site sorts them and splits them into
     "Upcoming" and "Past" automatically using the date.
     The two below are SAMPLES. Replace them with your real events. */
  events: [
    {
      title: "Sample: Introduction to Robotics Workshop",
      date: "2026-11-14",
      time: "10:00 AM",
      venue: "Department seminar hall, CUSAT",
      description: "Replace this with a short description of the event.",
      linkText: "",
      linkUrl: ""
    },
    {
      title: "Sample: Lecture on Machine Learning",
      date: "2026-08-20",
      time: "3:00 PM",
      venue: "CUSAT",
      description: "Replace this with a short description of the event.",
      linkText: "",
      linkUrl: ""
    }
  ],

  /* ---------- Gallery ----------
     Put photos in the folder images/gallery/ and list them here.
     Landscape or square photos around 1200px wide work best.
     The entries below are SAMPLES: until a photo file exists with that
     name, an empty placeholder tile is shown. */
  gallery: [
    { src: "images/gallery/photo1.jpg", alt: "Robo Wars team with their bot", caption: "Robo Wars" },
    { src: "images/gallery/photo2.jpg", alt: "Students at a workshop", caption: "Workshop" },
    { src: "images/gallery/photo3.jpg", alt: "Members building a robotic arm", caption: "Building the arm" },
    { src: "images/gallery/photo4.jpg", alt: "Guest lecture session", caption: "Guest lecture" },
    { src: "images/gallery/photo5.jpg", alt: "Team photo", caption: "The team" },
    { src: "images/gallery/photo6.jpg", alt: "Project demo", caption: "Project demo" }
  ]
};
