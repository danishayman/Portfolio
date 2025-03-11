import { useState, useEffect } from 'react';
import styles from './Work.module.css';
import gsc1 from "../../assets/gsc1.jpg";
import gsc2 from "../../assets/gsc2.jpg";
import teenfix1 from "../../assets/teenfix1.jpg";
import teenfix2 from "../../assets/teenfix2.jpg";
import inari1 from "../../assets/inari1.jpg";
import inari2 from "../../assets/inari2.jpg";

function Work() {
    const [activeTab, setActiveTab] = useState(0);
    const [imagesLoaded, setImagesLoaded] = useState({});
    const [isFirstLoad, setIsFirstLoad] = useState(true);

    const workExperience = [
        {
            role: "Full Stack Developer Intern",
            company: "Inari Technology",
            duration: "March 2025 - Present",
            description: [
                "Developed and maintained software applications for internal use, improving operational efficiency and data accuracy.",
                "Collaborated with cross-functional teams to identify and address software bugs and performance issues.",
                "Participated in code reviews and testing to ensure high-quality software deliverables.",
            ],
            images: [inari1, inari2]
        },
        {
            role: "Part-Time Crew: Steward",
            company: "Golden Screen Cinemas",
            duration: "August 2024 - December 2024",
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

    // Improved image preloading
    useEffect(() => {
        const loadImages = async () => {
            const loadPromises = {};
            
            // Create a promise for each image
            workExperience.forEach((work, workIndex) => {
                loadPromises[workIndex] = Promise.all(
                    work.images.map(imageSrc => {
                        return new Promise((resolve) => {
                            const img = new Image();
                            img.onload = () => resolve();
                            img.onerror = () => resolve(); // Still resolve even on error to prevent hanging
                            img.src = imageSrc;
                        });
                    })
                );
            });
            
            // Mark each work experience's images as loaded when they finish
            for (const [workIndex, promise] of Object.entries(loadPromises)) {
                await promise;
                setImagesLoaded(prev => ({
                    ...prev,
                    [workIndex]: true
                }));
            }
            
            setIsFirstLoad(false);
        };
        
        loadImages();
    }, []);

    // Handle tab change
    const handleTabChange = (index) => {
        setActiveTab(index);
    };

    return (
        <section id="work" className={styles.container}>
            <h1>Work Experience</h1>
            
            <div className={styles.workContainer}>
                <div className={styles.tabs}>
                    {workExperience.map((work, index) => (
                        <div
                            key={index}
                            className={`${styles.tab} ${activeTab === index ? styles.active : ''}`}
                            onClick={() => handleTabChange(index)}
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
                            <div key={index} className={styles.imageContainer}>
                                {(!imagesLoaded[activeTab] && isFirstLoad) ? (
                                    <div className={styles.imagePlaceholder}>Loading...</div>
                                ) : (
                                    <img 
                                        src={image} 
                                        alt={`${workExperience[activeTab].role} ${index + 1}`} 
                                        className={styles.image} 
                                    />
                                )}
                            </div>
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