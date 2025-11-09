import admin from "firebase-admin";
import fs from "fs";

// Load Firebase service account
const serviceAccount = JSON.parse(
  fs.readFileSync("./backend/serviceAccountKey.json", "utf8")
);

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const addSampleCourses = async () => {
  const courses = [
    {
      name: "Introduction to Computer Science",
      institution: "Botho University",
      requirements: [{ courseName: "Mathematics", grade: "C" }],
      description: "Basic concepts of programming and computer systems.",
      createdAt: new Date(),
    },
    {
      name: "Data Structures and Algorithms",
      institution: "Botho University",
      requirements: [{ courseName: "Introduction to Computer Science", grade: "B" }],
      description: "Advanced programming concepts and algorithms.",
      createdAt: new Date(),
    },
    {
      name: "Web Development",
      institution: "National University of Lesotho",
      requirements: [{ courseName: "HTML Basics", grade: "C" }],
      description: "Building modern web applications.",
      createdAt: new Date(),
    },
    {
      name: "Database Management",
      institution: "National University of Lesotho",
      requirements: [{ courseName: "Introduction to Computer Science", grade: "C" }],
      description: "Designing and managing databases.",
      createdAt: new Date(),
    },
    {
      name: "Software Engineering",
      institution: "Limkokwing University",
      requirements: [{ courseName: "Data Structures", grade: "B" }],
      description: "Principles of software development.",
      createdAt: new Date(),
    },
  ];

  for (const course of courses) {
    await db.collection("courses").add(course);
    console.log(`Added course: ${course.name}`);
  }

  console.log("Sample courses added successfully!");
};

addSampleCourses().catch(console.error);
