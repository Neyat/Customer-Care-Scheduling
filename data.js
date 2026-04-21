// Default seed data for Customer Solutions Team Hub — April 2026 schedule.
// Anyone in the editors list can make changes in-browser; changes persist in localStorage.
// Use Export/Import JSON to share state across the team.
//
// workDays array is [Sun, Mon, Tue, Wed, Thu, Fri, Sat]

window.DEFAULT_DATA = {
  agents: [
    // ----- 6:00-2:30 team (9 agents) -----
    { name: "Rosa Nuno",           shift: "6:00-2:30",  supervisor: "Angy",    workDays: [false,true,true,true,true,true,false] },
    { name: "Cristie Avant",       shift: "6:00-2:30",  supervisor: "Angy",    workDays: [false,true,true,true,true,true,false] },
    { name: "Amber Bailey",        shift: "6:00-2:30",  supervisor: "Angy",    workDays: [false,true,true,true,true,true,false] },
    { name: "Sam De Castro",       shift: "6:00-2:30",  supervisor: "Angy",    workDays: [false,true,true,true,true,true,false] },
    { name: "Rachel Dunlap",       shift: "6:00-2:30",  supervisor: "Angy",    workDays: [false,false,true,true,true,true,true] },
    { name: "Chassidy Williams",   shift: "6:00-2:30",  supervisor: "Angy",    workDays: [false,true,true,true,true,true,false] },
    { name: "Sarah Hajiali",       shift: "6:00-2:30",  supervisor: "Neyat",   workDays: [false,true,true,true,true,false,true] },
    { name: "Morgan Lankford",     shift: "6:00-2:30",  supervisor: "Neyat",   workDays: [false,true,false,true,true,true,true] },
    { name: "Unaisa Aslam",        shift: "6:00-2:30",  supervisor: "Neyat",   workDays: [false,true,true,false,true,true,true] },

    // ----- 8:00-4:30 team (7 agents) -----
    { name: "Bo Repko",            shift: "8:00-4:30",  supervisor: "Neyat",   workDays: [false,true,true,true,true,true,false] },
    { name: "Asia Campbell",       shift: "8:00-4:30",  supervisor: "Neyat",   workDays: [false,true,true,true,true,false,true] },
    { name: "Preston Panetti",     shift: "8:00-4:30",  supervisor: "Neyat",   workDays: [false,true,true,false,true,true,true] },
    { name: "Michael Scott Chavez",shift: "8:00-4:30",  supervisor: "Katie",   workDays: [false,true,true,true,true,false,true] },
    { name: "Andre Cordero",       shift: "8:00-4:30",  supervisor: "Katie",   workDays: [false,false,true,true,true,true,true] },
    { name: "Damian Doubrava",     shift: "8:00-4:30",  supervisor: "Katie",   workDays: [false,true,false,true,true,true,true] },
    { name: "Eri Dotson",          shift: "8:00-4:30",  supervisor: "Katie",   workDays: [false,true,true,true,true,false,true] },

    // ----- 11:30-8:00 team (15 agents) -----
    { name: "Bicky Purewal",       shift: "11:30-8:00", supervisor: "Lauren",  workDays: [false,true,true,true,true,true,false] },
    { name: "Jessie Gregory",      shift: "11:30-8:00", supervisor: "Lauren",  workDays: [false,true,true,true,true,true,false] },
    { name: "Enrico Davis",        shift: "11:30-8:00", supervisor: "Lauren",  workDays: [false,true,true,true,true,true,false] },
    { name: "Blanca Berumen",      shift: "11:30-8:00", supervisor: "Lauren",  workDays: [false,true,true,true,true,true,false] },
    { name: "Salia Kibibi",        shift: "11:30-8:00", supervisor: "Katie",   workDays: [false,true,true,false,true,true,true] },
    { name: "Brianna Miller",      shift: "11:30-8:00", supervisor: "Lauren",  workDays: [false,true,false,true,true,true,true] },
    { name: "Jada Brown",          shift: "11:30-8:00", supervisor: "Katie",   workDays: [false,true,true,true,true,false,true] },
    { name: "Sarah Al-Obaidi",     shift: "11:30-8:00", supervisor: "Ainsley", workDays: [false,false,true,true,true,true,true] },
    { name: "Ariashe Lowery",      shift: "11:30-8:00", supervisor: "Ainsley", workDays: [false,true,true,true,true,true,false] },
    { name: "Jeremy Carrillo",     shift: "11:30-8:00", supervisor: "Lauren",  workDays: [false,true,true,true,true,true,false] },
    { name: "Taylor Amos",         shift: "11:30-8:00", supervisor: "Ainsley", workDays: [false,true,true,true,true,true,false] },
    { name: "Bianca Young",        shift: "11:30-8:00", supervisor: "Ainsley", workDays: [false,true,true,false,true,true,true] },
    { name: "Lybah Nawaz",         shift: "11:30-8:00", supervisor: "Ainsley", workDays: [false,true,true,true,false,true,true] },
    { name: "Ramila Chaulagain",   shift: "11:30-8:00", supervisor: "Ainsley", workDays: [false,false,true,true,true,true,true] },
    { name: "Vitria Pinkston",     shift: "11:30-8:00", supervisor: "Ainsley", workDays: [false,true,false,true,true,true,true] }
  ],

  // Supervisors = filter chips on the Schedule/Roster tabs.
  supervisors: [
    { name: "Angy",    color: "#8b5cf6" },   // purple
    { name: "Neyat",   color: "#ec4899" },   // pink
    { name: "Katie",   color: "#0ea5e9" },   // sky blue
    { name: "Lauren",  color: "#10b981" },   // green
    { name: "Ainsley", color: "#f97316" }    // orange
  ],

  // Editors = who can unlock edit mode via the "Editing as" dropdown.
  editors: [
    "Neyat",
    "Lauren",
    "Angy",
    "Katie",
    "Ainsley"
  ],

  // Known time off on the books.
  timeOff: [
    { agent: "Unaisa Aslam", type: "Vacation", start: "2026-04-07", end: "2026-04-30", days: 18, status: "Approved", supervisor: "Neyat" }
  ]
};
Update April schedule
