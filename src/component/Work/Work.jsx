import { useState, useEffect, useRef } from 'react';
import styles from './Work.module.css';
import gsc1 from "../../assets/gsc1.webp";
import gsc2 from "../../assets/gsc2.webp";
import teenfix1 from "../../assets/teenfix1.webp";
import teenfix2 from "../../assets/teenfix2.webp";
import daboss1 from "../../assets/daboss1.webp";
import daboss2 from "../../assets/daboss2.webp";
import inari1 from "../../assets/inari1.webp";
import inari2 from "../../assets/inari2.webp";

function Work() {
    const [activeTab, setActiveTab] = useState(0);
    const [imagesLoaded, setImagesLoaded] = useState({});
    const [isFirstLoad, setIsFirstLoad] = useState(true);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const workExperience = [
        {
            role: "Software Engineer Intern",
            company: "Inari Technology",
            duration: "March 2025 - Present",
            description: [
                "Developed and maintained internal software for efficiency and accuracy.",
                "Fixed bugs and optimized performance with cross-functional teams.",
                "Conducted code reviews and testing for quality assurance.",
            ],
            images: [inari1, inari2]
        },
        {
            role: "Computer Technician",
            company: "PC DaBoss Technology",
            duration: "January 2025 - March 2025",
            description: [
                "Assisted in diagnosing and repairing computer hardware and software issues.",
                "Provided technical support to customers and staff.",
                "Maintained inventory of computer parts and accessories.",
            ],
            images: [daboss1, daboss2]
        },
        {
            role: "Part-Time Crew: Steward",
            company: "Golden Screen Cinemas",
            duration: "August 2024 - December 2024",
            description: [
                "Delivered excellent customer service for a smooth movie-going experience.",
                "Assisted with crowd control, seating, and safety compliance.",
                "Operated servers and projectors for seamless screenings."
            ],
            images: [gsc1, gsc2]
        },
        {
            role: "Phone Technician",
            company: "Teenfix Studio",
            duration: "August 2023 - November 2023",
            description: [
                "Repaired smartphones and tablets with quick, high-quality service.",
                "Managed inventory for efficient repairs.",
                "Provided technical support and device maintenance guidance."
            ],
            images: [teenfix1, teenfix2]
        },
    ];

    // Improved image preloading
    useEffect(() => {
        const loadImages = async () => {
            // Start loading all images immediately
            const allImagePromises = workExperience.flatMap((work, workIndex) => 
                work.images.map(imageSrc => {
                    return new Promise((resolve) => {
                        const img = new Image();
                        img.onload = () => {
                            // Mark individual image as loaded
                            setImagesLoaded(prev => ({
                                ...prev,
                                [workIndex]: {
                                    ...(prev[workIndex] || {}),
                                    [imageSrc]: true
                                }
                            }));
                            resolve();
                        };
                        img.onerror = () => resolve(); // Still resolve even on error
                        img.src = imageSrc;
                    });
                })
            );

            // Wait for all images to load, then mark first load complete
            await Promise.all(allImagePromises);
            setIsFirstLoad(false);
        };

        loadImages();
    }, []);

    // Handle tab change
    const handleTabChange = (index) => {
        setActiveTab(index);
        setDropdownOpen(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <section id="work" className={styles.container}>
            <h1>Work Experience</h1>

            <div className={styles.workContainer}>
                {/* Mobile Dropdown */}
                <div className={styles.mobileDropdown} ref={dropdownRef}>
                    <div 
                        className={styles.dropdownToggle} 
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                        <div className={styles.dropdownSelected}>
                            <h3>{workExperience[activeTab].role}</h3>
                            <p>{workExperience[activeTab].company}</p>
                        </div>
                        <div className={`${styles.dropdownArrow} ${dropdownOpen ? styles.open : ''}`}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                    </div>
                    
                    {dropdownOpen && (
                        <div className={styles.dropdownMenu}>
                            {workExperience.map((work, index) => (
                                index !== activeTab && (
                                    <div
                                        key={index}
                                        className={styles.dropdownItem}
                                        onClick={() => handleTabChange(index)}
                                    >
                                        <h3>{work.role}</h3>
                                        <p>{work.company}</p>
                                    </div>
                                )
                            ))}
                        </div>
                    )}
                </div>

                {/* Desktop Tabs */}
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
                                {(!imagesLoaded[activeTab]?.[image] && isFirstLoad) ? (
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