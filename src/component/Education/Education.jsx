import styles from "./Education.module.css";

function Education() {
  const educationData = [
    {
      institution: "Universiti Pendidikan Sultan Idris",
      degree: "Diploma in Computer Science (Internet Computing)",
      duration: "Jun 2019 - Sep 2021",
      achievements: [
        "Graduated with grade 3.83",
        "5 Semester Dean List"
      ]
    },
    {
      institution: "SM Sains Kubang Pasu",
      degree: "Science Stream",
      duration: "Jan 2014 - Dec 2018",
      achievements: [
        "SPM: 2A+ 5A"
      ]
    }
  ];

  return (
    <section id="education" className={styles.container}>
      <h2>Education</h2>
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