import img1 from "./scri (1).png";
import img2 from "./Screenshot 2025-01-06 184802.png";
import img3 from "./Screenshot 2025-01-06 184349.png";
import img4 from "./Screenshot 2025-01-06 185003.png";
import imgtrf from "./traffic.png";
import imgtumor from "./tumor.png";
import leaf from "./damaged.jpg";

// New project images
import legalImg from "/data/projects_data/legal.png";
import yoloImg from "/data/projects_data/yolo.png";
import tumorNewImg from "/data/projects_data/tumor.png";
import ctfImg from "/data/projects_data/ctf.png";
import demImg from "/data/projects_data/dem.png";
import stacWebImg from "/data/projects_data/stac-web.png";

export const navItems = [
  { name: "About Me", link: "#about" },
  { name: "Skills", link: "#skills" },
  { name: "Projects", link: "#projects" },
  { name: "Achievements", link: "#achievements" },
  { name: "Certifications", link: "#certifications" },
  { name: "Experience", link: "#experience" },
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
    title: "Legal Document Analyzer",
    des: "GenAI-based legal document analyzer supporting PDF, image, and doc uploads. Uses OCR, LangGraph agents, and Gemini APIs with Next.js, Supabase, and LangChain for features like chat history, document comparison, originality verification, and Q&A.",
    img: legalImg,
    iconLists: ["/next.svg", "/ts.svg", "/tail.svg", "/gemini.svg", "/langchain.svg"],
    link: "Google Gen AI Hackathon - Sep 2025",
    github: "https://github.com/Kartavya728",
    website: "#"
  },
  {
    id: 2,
    title: "Vision Drive - YOLO Traffic Management",
    des: "YOLO-based traffic management model trained on 100k+ images. Detects vehicles, pedestrians, lanes, and signals in real time. Integrated with Streamlit for an interactive UI.",
    img: yoloImg,
    iconLists: ["/python.svg", "/tensorflow.svg", "/opencv.svg", "/stream.svg", "/c.svg"],
    link: "Feb 2025",
    github: "https://github.com/Kartavya728",
    website: "#"
  },
  {
    id: 3,
    title: "Tumor Detection Website",
    des: "AI-powered web app for brain tumor detection from MRI scans using a custom CNN model with convolution, pooling, and fully connected layers. Provides bounding boxes, probability scores, and processed image previews.",
    img: tumorNewImg,
    iconLists: ["/python.svg", "/tensorflow.svg", "/opencv.svg", "/react.svg", "/flask.svg"],
    link: "Sep 2025",
    github: "https://github.com/Kartavya728",
    website: "#"
  },
  {
    id: 4,
    title: "Capture the Flag Platform",
    des: "Developed a CTF competition platform with secure admin control, real-time scoreboard, automated answer verification, negative marking, and support for audio, PDF, DOC, and image uploads.",
    img: ctfImg,
    iconLists: ["/next.svg", "/tail.svg", "/ts.svg", "/node.svg", "/mongo.svg"],
    link: "STAC IIT Mandi - Aug 2025",
    github: "https://github.com/Kartavya728",
    website: "#"
  },
  {
    id: 5,
    title: "Lunar DEM Generation using Photoclinometry",
    des: "Developed a system to generate high-resolution Digital Elevation Models (DEM) of the lunar surface using photoclinometry. Processed NASA lunar datasets with ML, computer vision, and GIS tools to create accurate 3D topographic maps.",
    img: demImg,
    iconLists: ["/python.svg", "/opencv.svg", "/tensorflow.svg", "/gis.svg", "/nasa.svg"],
    link: "ISRO Hackathon - Jul 2025",
    github: "https://github.com/Kartavya728",
    website: "#"
  },
  {
    id: 6,
    title: "STAC IIT Mandi Website",
    des: "Designed and developed the STAC IIT Mandi website with astronomy-focused sections, complex UI designs, and integrated resources for space-related activities. Included interactive elements, event details, and knowledge-sharing modules.",
    img: stacWebImg,
    iconLists: ["/next.svg", "/tail.svg", "/ts.svg", "/three.svg", "/fm.svg"],
    link: "Astronomy Portal - Jun 2025",
    github: "https://github.com/Kartavya728",
    website: "#"
  },
  {
    id: 7,
    title: "Food Delivery Web",
    des: "A modern food delivery website that simplifies the ordering process. Users can browse menus, place orders, and track delivery statuses, powered by NodeJs, ReactJs, MongoDb, and Express.",
    img: img2,
    iconLists: ["/next.svg", "/tail.svg", "/ts.svg", "/stream.svg", "/c.svg"],
    link: "Tools: NodeJs, ReactJs, MongoDb, Express",
    github: "https://github.com/Kartavya728",
  },
  {
    id: 8,
    title: "A Website for College Clubs",
    des: "A dynamic website designed to help college clubs manage events, share updates, and interact with members. Built using ReactJs, Framer, and Tailwind CSS for a seamless user experience.",
    img: img1,
    iconLists: ["/re.svg", "/tail.svg", "/ts.svg", "/three.svg", "/fm.svg"],
    link: "Tools: ReactJs, Framer, CSS",
    github: "https://github.com/Kartavya728",
  },
  {
    id: 9,
    title: "Plant Health Detector",
    des: "A deep learning-based system that identifies plant species and detects diseases by analyzing leaf images. The model helps farmers and gardeners diagnose plant health issues accurately.",
    img: leaf,
    iconLists: ["/python.svg", "/tensorflow.svg", "/opencv.svg", "/flask.svg"],
    link: "Tools: Python, TensorFlow, OpenCV, Flask",
    github: "https://github.com/Kartavya728",
  },
  {
    id: 10,
    title: "A Website for Any College Fest",
    des: "A customizable website template for college festivals, featuring event schedules, registration systems, and live updates. Built using NextJs and NodeJs for a fast and responsive experience.",
    img: img3,
    iconLists: ["/re.svg", "/tail.svg", "/ts.svg", "/three.svg", "/c.svg"],
    link: "Tools: NextJs, NodeJs",
    github: "https://github.com/Kartavya728",
  },
  {
    id: 11,
    title: "Arduino Remote Control Page",
    des: "A page designed to control Arduino-based devices remotely. Utilizes Arduino IDE and Python for communication, providing users with the ability to control hardware through a simple web interface.",
    img: img4,
    iconLists: ["/next.svg", "/tail.svg", "/ts.svg", "/three.svg", "/gsap.svg"],
    link: "Tools: Arduino IDE, Python",
    github: "https://github.com/Kartavya728",
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
      "Google KrackHack 2025 was an incredible opportunity to push my limits in problem-solving and innovation. Participating in the hackathon conducted by the Google Developer Group at IIT Mandi, I worked on a Machine Learning and Deep Learning-based Traffic Management System. The project recognized various vehicles and lanes, providing real-time assistance to drivers while collecting traffic data. Integrating the model with a website added another layer of functionality, making the system both interactive and impactful.",
    name: "Google KrackHack 2025",
    img: "https://tse1.mm.bing.net/th?id=OIP.Z0QINSms7lBLyg-mjUQtGAHaHa&pid=Api&P=0&h=180",
    title: "Participant in Google KrackHack 2025 at IIT Mandi",
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
    desc: "Made various projects in React Js and Next Js also be the front-end devloper for website of Research Scoiety, IIT Mandi",
    className: "md:col-span-2",
    thumbnail: "/exp1.svg",
  },
  {
    id: 2,
    title: "Backend Devolpment",
    desc: "Know Node Js ,Express Js and use to with MongoDB ,Atlas and made various projects in it.",
    className: "md:col-span-2", // change to md:col-span-2
    thumbnail: "/exp2.svg",
  },
  {
    id: 3,
    title: "Machine Learning and Deep Learning",
    desc: "Know tensorflow and OpenCv train various models based on logistic reggrestion,Random Forest,CNN and LSTM.ALso know to use Ultralytics to tune YOLO model for projects",
    className: "md:col-span-2", // change to md:col-span-2
    thumbnail: "/exp3.svg",
  },
  {
    id: 4,
    title: "Competitive Programing",
    desc: "Solved 300+ leetcode problems and also completed DSA in c++ and able to use STL in coding compititions",
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
