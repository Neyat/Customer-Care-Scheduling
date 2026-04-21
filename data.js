// Default seed data for Customer Solutions Team Hub
// Anyone can edit this in-browser; changes persist in localStorage.
// Use Export/Import JSON to share state across the team.

window.DEFAULT_DATA = {
  agents: [
    { name: "Amber Bailey",        shift: "8:00-4:30",   supervisor: "Lauren Montanye",  workDays: [false,true,true,true,true,true,false] },
    { name: "Andre Cordero",       shift: "8:00-4:30",   supervisor: "Alex Blair",       workDays: [false,true,false,true,true,true,true] },
    { name: "Ariashe Lowery",      shift: "9:00-5:30",   supervisor: "Lauren Montanye",  workDays: [false,true,true,true,true,true,false] },
    { name: "Asia Campbell",       shift: "8:00-4:30",   supervisor: "Angy Chang",       workDays: [false,true,true,true,true,false,true] },
    { name: "Balrupe Purewal",     shift: "11:30-8:00",  supervisor: "Shelby Coldiron",  workDays: [false,true,true,true,true,true,false] },
    { name: "Bianca Vernando",     shift: "6:00-2:30",   supervisor: "Shelby Coldiron",  workDays: [false,true,true,false,true,true,true] },
    { name: "Blanca Berumen",      shift: "11:30-8:00",  supervisor: "Shelby Coldiron",  workDays: [false,true,false,true,true,true,true] },
    { name: "Bo Repko",            shift: "6:00-2:30",   supervisor: "Lauren Montanye",  workDays: [false,false,true,true,true,true,true] },
    { name: "Brianna Miller",      shift: "9:00-5:30",   supervisor: "Angy Chang",       workDays: [false,true,true,true,true,true,false] },
    { name: "Chassidy Williams",   shift: "6:00-2:30",   supervisor: "Shelby Coldiron",  workDays: [false,true,true,true,true,true,false] },
    { name: "Chisa Ordu",          shift: "11:30-8:00",  supervisor: "Neyat Abraha",     workDays: [false,true,true,true,true,true,false] },
    { name: "Cristie Avant",       shift: "8:00-4:30",   supervisor: "Shelby Coldiron",  workDays: [false,true,true,true,true,true,false] },
    { name: "Damian Doubrava",     shift: "8:00-4:30",   supervisor: "Alex Blair",       workDays: [false,true,false,true,true,true,true] },
    { name: "Enrico Davis",        shift: "11:30-8:00",  supervisor: "Lauren Montanye",  workDays: [false,true,true,true,true,true,false] },
    { name: "Eri Dotson",          shift: "8:00-4:30",   supervisor: "Alex Blair",       workDays: [false,true,true,true,false,true,true] },
    { name: "Jada Brown",          shift: "9:00-5:30",   supervisor: "Alex Blair",       workDays: [false,true,true,true,true,true,false] },
    { name: "Jeremy Carillo",      shift: "11:30-8:00",  supervisor: "Neyat Abraha",     workDays: [false,true,false,true,true,true,true], pto: true },
    { name: "Jessie Gregory",      shift: "11:30-8:00",  supervisor: "Neyat Abraha",     workDays: [false,true,true,true,true,true,false] },
    { name: "Lybah Shah Nawz",     shift: "9:00-5:30",   supervisor: "Neyat Abraha",     workDays: [false,true,true,true,true,true,false] },
    { name: "Michael Chavez",      shift: "6:00-2:30",   supervisor: "Alex Blair",       workDays: [false,true,true,true,true,true,false] },
    { name: "Morgan Lankford",     shift: "6:00-2:30",   supervisor: "Shelby Coldiron",  workDays: [false,true,false,true,true,true,true] },
    { name: "Preston Panetti",     shift: "8:00-4:30",   supervisor: "Alex Blair",       workDays: [false,true,true,false,true,true,true] },
    { name: "Rachel Dunlap",       shift: "9:00-5:30",   supervisor: "Lauren Montanye",  workDays: [false,true,true,true,true,true,false] },
    { name: "Ramila Chaulagain",   shift: "8:00-4:30",   supervisor: "Neyat Abraha",     workDays: [false,false,true,true,true,true,true] },
    { name: "Rosa Nuno",           shift: "6:00-2:30",   supervisor: "Neyat Abraha",     workDays: [false,true,true,true,true,true,false] },
    { name: "Salia Kibibi",        shift: "9:00-5:30",   supervisor: "Angy Chang",       workDays: [false,true,true,true,true,true,false] },
    { name: "Sam De Castro",       shift: "6:00-2:30",   supervisor: "Alex Blair",       workDays: [false,true,true,true,true,true,false] },
    { name: "Sarah Al-Obaidi",     shift: "8:00-4:30",   supervisor: "Neyat Abraha",     workDays: [false,true,true,true,true,true,false] },
    { name: "Sarah Hajali",        shift: "6:00-2:30",   supervisor: "Shelby Coldiron",  workDays: [false,false,true,true,true,true,true] },
    { name: "Taylor Amos",         shift: "9:00-5:30",   supervisor: "Lauren Montanye",  workDays: [false,true,true,true,true,true,false] },
    { name: "Unaisa Aslam",        shift: "11:30-8:00",  supervisor: "Lauren Montanye",  workDays: [false,true,true,true,true,true,false], pto: true },
    { name: "Vitria Pinkston",     shift: "9:00-5:30",   supervisor: "Angy Chang",       workDays: [false,true,true,true,true,true,false] }
  ],
  // "supervisors" are the reports-to assignments shown as filter chips in the roster.
  // This list comes from what's in the agent data.
  supervisors: [
    { name: "Shelby Coldiron", color: "#ef4444" },
    { name: "Neyat Abraha",    color: "#ec4899" },
    { name: "Alex Blair",      color: "#f97316" },
    { name: "Lauren Montanye", color: "#10b981" },
    { name: "Angy Chang",      color: "#8b5cf6" }
  ],
  // "editors" are the supervisor team members allowed to make changes to this hub.
  // Anyone not in this list sees the hub in view-only mode.
  editors: [
    "Neyat",
    "Lauren",
    "Angy",
    "Katie",
    "Ainsley"
  ],
  timeOff: [
    { agent: "Lauren Montanye",  type: "Vacation",  start: "2026-01-31", end: "2026-02-08", days: 5,   status: "Approved", supervisor: "" },
    { agent: "Zhane Alexander",  type: "Jiffy",     start: "2026-02-02", end: "2026-02-02", days: 1,   status: "Approved", supervisor: "" },
    { agent: "Jeremy Carillo",   type: "Jiffy",     start: "2026-02-03", end: "2026-02-03", days: 1,   status: "Approved", supervisor: "Neyat Abraha" },
    { agent: "Ananya SenthilKumar", type: "Jiffy",  start: "2026-02-04", end: "2026-02-04", days: 1,   status: "Approved", supervisor: "Shelby Coldiron" },
    { agent: "Jeremy Carillo",   type: "Half Jiffy",start: "2026-02-04", end: "2026-02-04", days: 0.5, status: "Approved", supervisor: "Neyat Abraha" },
    { agent: "Ananya SenthilKumar", type: "Vacation", start: "2026-02-05", end: "2026-02-07", days: 2, status: "Approved", supervisor: "Shelby Coldiron" },
    { agent: "Ananya SenthilKumar", type: "Jiffy",  start: "2026-02-09", end: "2026-02-10", days: 2,   status: "Approved", supervisor: "Shelby Coldiron" },
    { agent: "Bianca Vernando",  type: "Half Jiffy",start: "2026-02-09", end: "2026-02-09", days: 0.5, status: "Approved", supervisor: "Shelby Coldiron" },
    { agent: "Jeremy Carillo",   type: "Jiffy",     start: "2026-02-09", end: "2026-02-11", days: 3,   status: "Approved", supervisor: "Neyat Abraha" },
    { agent: "Unaisa Aslam",     type: "Half Jiffy",start: "2026-02-09", end: "2026-02-09", days: 0.5, status: "Approved", supervisor: "Lauren Montanye" },
    { agent: "Rosa Nuno",        type: "Vacation",  start: "2026-02-12", end: "2026-02-12", days: 1,   status: "Approved", supervisor: "Neyat Abraha" },
    { agent: "Hiam Hajiali",     type: "Jiffy",     start: "2026-02-12", end: "2026-02-12", days: 1,   status: "Approved", supervisor: "" },
    { agent: "Cristie Avant",    type: "Jiffy",     start: "2026-02-13", end: "2026-02-13", days: 1,   status: "Approved", supervisor: "Shelby Coldiron" },
    { agent: "Denia Bradley",    type: "Half Jiffy",start: "2026-02-13", end: "2026-02-13", days: 0.5, status: "Approved", supervisor: "Alex Blair" },
    { agent: "Rosa Nuno",        type: "Vacation",  start: "2026-02-14", end: "2026-02-14", days: 1,   status: "Approved", supervisor: "Neyat Abraha" },
    { agent: "Eri Dotson",       type: "Vacation",  start: "2026-02-14", end: "2026-02-14", days: 1,   status: "Approved", supervisor: "Alex Blair" },
    { agent: "Denia Bradley",    type: "Half Jiffy",start: "2026-02-14", end: "2026-02-14", days: 0.5, status: "Approved", supervisor: "Alex Blair" },
    { agent: "Ramila Chaulagain",type: "Vacation",  start: "2026-03-10", end: "2026-03-14", days: 4,   status: "Pending",  supervisor: "Neyat Abraha" },
    { agent: "Unaisa Aslam",     type: "Vacation",  start: "2026-04-07", end: "2026-04-30", days: 18,  status: "Approved", supervisor: "Lauren Montanye" }
  ]
};
