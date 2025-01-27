import styles from "./Projects.module.css";
import gasket from "../../assets/gasket.png";
import law from "../../assets/law.png";
import drink from "../../assets/drink.png";
import compiler from "../../assets/compiler.png";
import cervical from "../../assets/cervical.png";
import tensorflow from "../../assets/tensorflow.png";
import creditcard from "../../assets/creditcard.png";
import rainmeter from "../../assets/rainmeter.png";
import disk from "../../assets/disk.png";
import teapot from "../../assets/teapot.png";
import Speaker from "../../assets/speaker.png";
import ProjectCard from "../../common/ProjectCard";

function Projects() {
  return (
    <section id="projects" className={styles.container}>
      <h1 className="sectionTitle">Projects</h1>
      <div className={styles.projectContainer}>



        <ProjectCard
          src={teapot}
          link="https://danishayman.github.io/WebGL-Objects/"
          h3="Interactive 3D Objects"
          p="WebGL Application"
        />

        <ProjectCard
          src={Speaker}
          link="https://github.com/danishayman/Speaker-Change-Detection/blob/main/Speaker-Change-Detection.ipynb"
          h3="Speaker Change Detection"
          p="Neural Network Model"
        />

        <ProjectCard
          src={law}
          link="https://github.com/danishayman/Law-Firm-Management"
          h3="Law Firm Management"
          p="JavaFx Application"
        />
        <ProjectCard
          src={drink}
          link="https://github.com/danishayman/drink-your-water-discord-bot"
          h3="Drink Your Water"
          p="Discord Bot"
        />

        <ProjectCard
          src={tensorflow}
          link="https://github.com/danishayman/Low-Level-Tensorflow/blob/main/CPC251_Assignment1_GroupNo.ipynb"
          h3="Low Level Tensorflow"
          p="Neural Network Model"
        />

        <ProjectCard
          src={gasket}
          link="https://danishayman.github.io/3D-Sierpinski-Gasket/"
          h3="3D Sierpinski Gasket"
          p="WebGL Application"
        />

        <ProjectCard
          src={creditcard}
          link="https://github.com/danishayman/Credit-Card-Fraud-Detection/blob/main/FraudDetection.ipynb"
          h3="Credit Card Fraud Detection"
          p="Machine Learning Model"
        />

        <ProjectCard
          src={cervical}
          link="https://github.com/danishayman/Cervical-Cancer-Predictive-Model/blob/main/Project%20Cancer.ipynb"
          h3="Cervical Cancer Prediction"
          p="Machine Learning Model"
        />

        <ProjectCard
          src={rainmeter}
          link="https://github.com/danishayman/Code-Geass-Rainmeter"
          h3="Interactive Rainmeter UI"
          p="Customized Desktop Interface"
        />


      </div>
    </section>
  );
}

export default Projects;
