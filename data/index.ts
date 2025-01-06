import img1 from "./scri (1).png";
import img2 from "./Screenshot 2025-01-06 184802.png";
import img3 from "./Screenshot 2025-01-06 184349.png";
import img4 from "./Screenshot 2025-01-06 185003.png";

export const navItems = [
  { name: "About", link: "#about" },
  { name: "Projects", link: "#projects" },
  { name: "Skills", link: "#testimonials" },
  { name: "Contact", link: "#contact" },
];

export const gridItems = [
  {
    id: 1,
    title: "I am a Mern Stack Devloper and Open to work on various projects",
    description: "",
    className: "lg:col-span-3 md:col-span-6 md:row-span-4 lg:min-h-[60vh]",
    imgClassName: "w-full h-full",
    titleClassName: "justify-end",
    img: "/b1.svg",
    spareImg: "",
  },
  {
    id: 2,
    title: "Connect With me on linkedIn and GitHub To collaborate",
    description: "",
    className: "lg:col-span-2 md:col-span-3 md:row-span-2",
    imgClassName: "",
    titleClassName: "justify-start",
    img: "",
    spareImg: "",
  },
  {
    id: 3,
    title: "My tech stack",
    description: "Here's What I know",
    className: "lg:col-span-2 md:col-span-3 md:row-span-2",
    imgClassName: "",
    titleClassName: "justify-center",
    img: "",
    spareImg: "",
  },
  {
    id: 4,
    title: "Tech enthusiast with a passion for web-development.",
    description: "LinkedIn-Kartavya Suryawanshi \n GitHub-Kartavya728",
    className: "lg:col-span-2 md:col-span-3 md:row-span-1",
    imgClassName: "",
    titleClassName: "justify-start",
    img: "/grid.svg",
    spareImg: "/b4.svg",
  },

  {
    id: 5,
    title: "Currently part of Exodia'25 Web-dev team",
    description: "The Inside Scoop",
    className: "md:col-span-3 md:row-span-2",
    imgClassName: "absolute right-0 bottom-0 md:w-96 w-60",
    titleClassName: "justify-center md:justify-start lg:justify-center",
    img: "/b5.svg",
    spareImg: "/grid.svg",
  },
  {
    id: 6,
    title: "Do you want to start a project together?",
    description: "",
    className: "lg:col-span-2 md:col-span-3 md:row-span-1",
    imgClassName: "",
    titleClassName: "justify-center md:max-w-full max-w-60 text-center",
    img: "",
    spareImg: "",
  },
];

export const projects = [
  {
    id: 1,
    title: "A Website for College Clubs",
    des: "A dynamic website designed to help college clubs manage events, share updates, and interact with members. Built using ReactJs, Framer, and Tailwind CSS for a seamless user experience.",
    img: img1,
    iconLists: ["/re.svg", "/tail.svg", "/ts.svg", "/three.svg", "/fm.svg"],
    link: "Tools: ReactJs, Framer, CSS",
  },
  {
    id: 2,
    title: "Food Delivery Web",
    des: "A modern food delivery website that simplifies the ordering process. Users can browse menus, place orders, and track delivery statuses, powered by NodeJs, ReactJs, MongoDb, and Express.",
    img: img2,
    iconLists: ["/next.svg", "/tail.svg", "/ts.svg", "/stream.svg", "/c.svg"],
    link: "Tools: NodeJs, ReactJs, MongoDb, Express..",
  },
  {
    id: 3,
    title: "A Website for Any College Fest",
    des: "A customizable website template for college festivals, featuring event schedules, registration systems, and live updates. Built using NextJs and NodeJs for a fast and responsive experience.",
    img: img3,
    iconLists: ["/re.svg", "/tail.svg", "/ts.svg", "/three.svg", "/c.svg"],
    link: "Tools: NextJs, NodeJs",
  },
  {
    id: 4,
    title: "Arduino Remote Control Page",
    des: "A page designed to control Arduino-based devices remotely. Utilizes Arduino IDE and Python for communication, providing users with the ability to control hardware through a simple web interface.",
    img: img4,
    iconLists: ["/next.svg", "/tail.svg", "/ts.svg", "/three.svg", "/gsap.svg"],
    link: "Tools: Arduino IDE, Python",
  },
];

export const testimonials = [
  {
    quote:
      "Working on Robo-Car War was an incredible experience. The challenge of building a car using ESP and motor drivers was both fun and intellectually stimulating. The entire team collaborated effectively to bring our robot to life, and the competition pushed us to think creatively and problem-solve on the spot.",
    name: "Robo-Car War",
    img: "https://tse1.mm.bing.net/th?id=OIP.sgtP6X-5JFhwsQ0Sb3AcHgHaHa&pid=Api&P=0&h=180",
    title:
      "Intra IIT competition of creating your own car using ESP and motor drivers and competing",
  },
  {
    quote:
      "The TIP Hackathon was a fantastic opportunity to apply my skills and create a project that could solve real-world problems. The collaborative atmosphere allowed me to work closely with others to develop an innovative solution. It was an excellent way to learn and grow as a developer, and the experience was truly rewarding.",
    name: "TIP Hackathon",
    img: "https://cdn.dribbble.com/userupload/11324582/file/original-3f3d21323c64a43b64a56b3c0e580ec0.png?crop=237x0-1677x1080&resize=1600x1200",
    title:
      "Intra IIT competition of making your own project to solve daily life problems",
  },
  {
    quote:
      "Exodia'25 was an unforgettable experience, being a part of the web development team was both challenging and rewarding. The teamwork and creativity that went into building the website were remarkable, and it was amazing to see our efforts come together for such a large-scale event at IIT Mandi.",
    name: "Exodia'25",
    img: "https://tse4.mm.bing.net/th?id=OIP.sXFT0d5ysD2_p2BPlVFpuAHaHa&pid=Api&P=0&h=180",
    title: "Part of web-dev team for Exodia'25 of IIT Mandi",
  },
  {
    quote:
      "The Winter Project was a great opportunity to contribute to the web development of the Literary Society's website. The project taught me a lot about working with teams, meeting deadlines, and delivering a functional product. It was fulfilling to see the website live and helping the society showcase their events and activities.",
    name: "Winter Project",
    img: "https://i.pinimg.com/originals/8a/bd/f9/8abdf9db2bc347cae4b996403ef0ce77.png",
    title: "Team member for web-development of Literary Society website",
  },
];

export const companies = [
  {
    id: 1,
    name: "cloudinary",
    img: "/react.png",
    nameImg: "/react.png",
  },
  {
    id: 2,
    name: "appwrite",
    img: "/app.svg",
    nameImg: "/appName.svg",
  },
  {
    id: 3,
    name: "HOSTINGER",
    img: "/host.svg",
    nameImg: "/hostName.svg",
  },
  {
    id: 4,
    name: "stream",
    img: "/s.svg",
    nameImg: "/streamName.svg",
  },
  {
    id: 5,
    name: "docker.",
    img: "/dock.svg",
    nameImg: "/dockerName.svg",
  },
];

export const workExperience = [
  {
    id: 1,
    title: "Frontend Devolpment",
    desc: "Assisted in the development of a web-based platform using React.js, enhancing interactivity.",
    className: "md:col-span-2",
    thumbnail: "/exp1.svg",
  },
  {
    id: 2,
    title: "Backend Devolpment",
    desc: "Designed and developed mobile app for both iOS & Android platforms using React Native.",
    className: "md:col-span-2", // change to md:col-span-2
    thumbnail: "/exp2.svg",
  },
  {
    id: 3,
    title: "Learning ML",
    desc: "Led the dev of a mobile app for a client, from initial concept to deployment on app stores.",
    className: "md:col-span-2", // change to md:col-span-2
    thumbnail: "/exp3.svg",
  },
  {
    id: 4,
    title: "Competitive Programing",
    desc: "Developed and maintained user-facing features using modern frontend technologies.",
    className: "md:col-span-2",
    thumbnail: "/exp4.svg",
  },
];

export const socialMedia = [
  {
    id: 1,
    img: "/git.svg",
  },
  {
    id: 2,
    img: "/twit.svg",
  },
  {
    id: 3,
    img: "/link.svg",
  },
];
