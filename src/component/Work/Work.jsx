import { useState } from 'react';
import styles from './Work.module.css';
import gsc1 from "../../assets/gsc1.jpg";
import gsc2 from "../../assets/gsc2.jpg";
import teenfix1 from "../../assets/teenfix1.jpg";
import teenfix2 from "../../assets/teenfix2.jpg";

function Work() {
    const [activeTab, setActiveTab] = useState(0);

    const workExperience = [
        {
            role: "Part-Time Crew: Steward",
            company: "Golden Screen Cinemas",
            duration: "August 2024 - Present",
            description: [
                "Provided exceptional customer service, ensuring a positive movie-going experience for customers.",
                "Assisted with crowd control, seating, and ensuring compliance with health and safety protocols.",
                "Managed and operated cinema servers and projectors, ensuring seamless movie playback and minimizing technical disruptions during screenings."
            ],
            images: [gsc1, gsc2]
        },
        {
            role: "Phone Technician",
            company: "Teenfix Studio",
            duration: "August 2023 - November 2023",
            description: [
                "Diagnosed and repaired smartphones and tablets, ensuring fast service and high customer satisfaction.",
                "Managed inventory of parts and tools, ensuring efficient use of resources and minimizing delays in repairs.",
                "Provided technical support and customer education on device maintenance and troubleshooting.",
            ],
            images: [teenfix1, teenfix2]
        },
    ];

    return (
        <section id="work" className={styles.container}>
            <h1>Work Experience</h1>
            
            <div className={styles.workContainer}>
                <div className={styles.tabs}>
                    {workExperience.map((work, index) => (
                        <div
                            key={index}
                            className={`${styles.tab} ${activeTab === index ? styles.active : ''}`}
                            onClick={() => setActiveTab(index)}
                        >
                            <h3>{work.role}</h3>
                            <p>{work.company}</p>
                        </div>
                    ))}
                </div>

                <div className={styles.content}>
                    <div className={styles.header}>
                        <h3>{workExperience[activeTab].role}</h3>
                        <p className={styles.company}>{workExperience[activeTab].company}</p>
                        <p className={styles.duration}>{workExperience[activeTab].duration}</p>
                    </div>
                    <div className={styles.images}>
                        {workExperience[activeTab].images.map((image, index) => (
                            <img key={index} src={image} alt={`${workExperience[activeTab].role} ${index + 1}`} className={styles.image} />
                        ))}
                    </div>
                    <ul className={styles.description}>
                        {workExperience[activeTab].description.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}

export default Work;