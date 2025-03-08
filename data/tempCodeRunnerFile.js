import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = "https://hyverjydcqlnzpajzfot.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5dmVyanlkY3FsbnpwYWp6Zm90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0MzAyNTIsImV4cCI6MjA1NzAwNjI1Mn0.PzVClN-nMtdHyA6zzLnsD7dONOZzfPGwHdkwx3cyB7o";
const supabase = createClient(supabaseUrl, supabaseKey);

// Sample Data
const projects = [
  {
    id: 1,
    title: "Smart Traffic Management",
    des: "An intelligent system using ML and DL to recognize vehicles, monitor lanes, and assist drivers. It provides real-time traffic data and integrates with a website for enhanced usability.",
    img: imgtrf,
    iconLists: ["/next.svg", "/tail.svg", "/ts.svg", "/stream.svg", "/c.svg"],
    link: "Tools: Python, TensorFlow, OpenCV, React, Flask",
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
    title: "Brain Tumor Detection",
    des: "An AI-powered tool that analyzes MRI scans to detect brain tumors. If a tumor is present, it highlights the affected area with a bounding box and provides a probability score. Integrated with a website for easy access.",
    img: imgtumor,
    iconLists: [
      "/python.svg",
      "/tensorflow.svg",
      "/opencv.svg",
      "/react.svg",
      "/flask.svg",
    ],
    link: "Tools: Python, TensorFlow, OpenCV, React, Flask",
  },
  {
    id: 4,
    title: "A Website for College Clubs",
    des: "A dynamic website designed to help college clubs manage events, share updates, and interact with members. Built using ReactJs, Framer, and Tailwind CSS for a seamless user experience.",
    img: img1,
    iconLists: ["/re.svg", "/tail.svg", "/ts.svg", "/three.svg", "/fm.svg"],
    link: "Tools: ReactJs, Framer, CSS",
  },
  {
    id: 5,
    title: "Plant Health Detector",
    des: "A deep learning-based system that identifies plant species and detects diseases by analyzing leaf images. The model helps farmers and gardeners diagnose plant health issues accurately.",
    img: leaf,
    iconLists: ["/python.svg", "/tensorflow.svg", "/opencv.svg", "/flask.svg"],
    link: "Tools: Python, TensorFlow, OpenCV, Flask",
  },
  {
    id: 6,
    title: "A Website for Any College Fest",
    des: "A customizable website template for college festivals, featuring event schedules, registration systems, and live updates. Built using NextJs and NodeJs for a fast and responsive experience.",
    img: img3,
    iconLists: ["/re.svg", "/tail.svg", "/ts.svg", "/three.svg", "/c.svg"],
    link: "Tools: NextJs, NodeJs",
  },
  {
    id: 7,
    title: "Arduino Remote Control Page",
    des: "A page designed to control Arduino-based devices remotely. Utilizes Arduino IDE and Python for communication, providing users with the ability to control hardware through a simple web interface.",
    img: img4,
    iconLists: ["/next.svg", "/tail.svg", "/ts.svg", "/three.svg", "/gsap.svg"],
    link: "Tools: Arduino IDE, Python",
  },
];

// Function to insert projects
const uploadProjects = async () => {
  const { data, error } = await supabase
    .from("projects") // Table name
    .insert(projects);

  if (error) console.error("Error uploading:", error);
  else console.log("Data uploaded successfully:", data);
};

uploadProjects();
