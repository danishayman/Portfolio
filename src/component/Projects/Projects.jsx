import styles from "./Projects.module.css";
import law from "../../assets/law.png";
import gasket from "../../assets/3D gasket.png";
import ProjectCard from "../../common/ProjectCard";


function Projects() {
  return (
    <section id="projects" className={styles.container}>
      <h1 className="sectionTitle"> Projects </h1>
      <div className={styles.projectContainer}>

        <ProjectCard 
        src={law} link = "https://github.com/danishayman/Law-Firm-Management"
        h3 = "Law Firm Management" 
        p = "Law Firm Management App using JavaFX and Scene Builder"/>

        <ProjectCard 
        src={gasket} link = "https://danishayman.github.io/3D-Sierpinski-Gasket/"
        h3 = "3D Sierpinski Gasket" 
        p = "Interactive WebGL application that renders a 3D Sierpinski Gasket"/>

    
        <ProjectCard 
        src={law} link = "https://github.com/danishayman/Law-Firm-Management"
        h3 = "Law Firm Management" 
        p = "Law Firm Management App using JavaFX"/>


        <ProjectCard 
        src={gasket} link = "https://danishayman.github.io/3D-Sierpinski-Gasket/"
        h3 = "3D Sierpinski Gasket" 
        p = "Interactive WebGL application that renders a 3D Sierpinski Gasket"/>

      </div>
    </section>
  );
}

export default Projects;