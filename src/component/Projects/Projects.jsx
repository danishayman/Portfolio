import styles from "./Projects.module.css";
import gasket from "../../assets/gasket.webp";
import law from "../../assets/law.webp";
import drink from "../../assets/drink.webp";
import cervical from "../../assets/cervical.webp";
import tensorflow from "../../assets/tensorflow.webp";
import creditcard from "../../assets/creditcard.webp";
import teapot from "../../assets/teapot.webp";
import Speaker from "../../assets/speaker.webp";
import bird from "../../assets/bird.webp";
import homestay from "../../assets/homestay.webp";
import extinguisher from "../../assets/extinguisher.webp";
import ProjectCard from "../../common/ProjectCard";

function Projects() {
  return (
    <section id="projects" className={styles.container}>
      <h1 className="sectionTitle">Projects</h1>
      <div className={styles.projectContainer}>

        <ProjectCard
          src={homestay}
          link="https://tuahcemerlang.vercel.app/"
          h3= {
            <>
              Tuah Cemerlang
              <br />
              Homestay
            </>
          }
          p="Next.js Application"
        />

        <ProjectCard
          src={extinguisher}
          link="https://github.com/danishayman/FireExtinguisherTrackingSystem"
          h3="Fire Extinguisher Tracking System"
          p="ASP.NET Application"
        />

        <ProjectCard
          src={bird}
          link="https://github.com/danishayman/Flappy-Bird-AI"
          h3="Flappy Bird AI"
          p="Neural Network Model"
        />


        <ProjectCard
          src={teapot}
          link="https://danishayman.github.io/3D-Objects-Playground/"
          h3="3D Objects Playground"
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


      </div>
    </section>
  );
}

export default Projects;
