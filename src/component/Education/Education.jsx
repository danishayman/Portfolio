import styles from "./Education.module.css";

function Education() {
  const educationData = [
    {
      institution: "Universiti Sains Malaysia",
      degree: "Bachelor of Computer Science (Honours)(Intelligent Computing)",
      duration: "Oct 2022 - Present",
      achievements: ["Current CGPA: 3.42", "1 Semester Dean List"],
    },
    {
      institution: "Penang Matriculation College",
      degree: "Physical Science",
      duration: "July 2021 - July 2022",
      achievements: ["Graduated with grade 3.92"],
    },
    {
      institution: "SMK Bukit Jambul, High Performance School",
      degree: "Science Stream",
      duration: "Jan 2015 - Dec 2020",
      achievements: ["SPM: 3A+ 4A"],
    },
  ];

  return (
    <section id="education" className={styles.container}>
      <h1>Education</h1>
      <div className={styles.timeline}>
        {educationData.map((edu, index) => (
          <div key={index} className={styles.timelineItem}>
            <div className={styles.timelineDot}></div>
            <div className={styles.content}>
              <h3>{edu.institution}</h3>
              <p className={styles.degree}>{edu.degree}</p>
              <p className={styles.duration}>{edu.duration}</p>
              <ul className={styles.achievements}>
                {edu.achievements.map((achievement, achIndex) => (
                  <li key={achIndex}>✓ {achievement}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Education;
