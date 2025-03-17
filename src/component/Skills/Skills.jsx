import styles from "./Skills.module.css";
import htmlIconDark from "../../assets/html-dark.svg";
import htmlIconLight from "../../assets/html-light.svg";
import cssIconDark from "../../assets/css-dark.svg";
import cssIconLight from "../../assets/css-light.svg";
import javascriptIconDark from "../../assets/javascript-dark.svg";
import javascriptIconLight from "../../assets/javascript-light.svg";
import pythonIconDark from "../../assets/python-dark.svg"; // Add Python icon
import pythonIconLight from "../../assets/python-light.svg"; // Add Python icon
import javaIconDark from "../../assets/java-dark.svg"; // Add Java icon
import javaIconLight from "../../assets/java-light.svg"; // Add Java icon
import cppIconDark from "../../assets/cpp-dark.svg"; // Add C++ icon
import cppIconLight from "../../assets/cpp-light.svg"; // Add C++ icon
import sqlIconDark from "../../assets/sql-dark.svg"; // Add SQL icon
import sqlIconLight from "../../assets/sql-light.svg"; // Add SQL icon
import pandasIconDark from "../../assets/pandas-dark.svg"; // Add Pandas icon
import pandasIconLight from "../../assets/pandas-light.svg"; // Add Pandas icon
import numpyIconDark from "../../assets/numpy-dark.svg"; // Add NumPy icon
import numpyIconLight from "../../assets/numpy-light.svg"; // Add NumPy icon
import gitIconDark from "../../assets/git-dark.svg"; // Add Git icon
import gitIconLight from "../../assets/git-light.svg"; // Add Git icon
import tensorflowIconDark from "../../assets/tensorflow-dark.svg"; // Add TensorFlow icon
import tensorflowIconLight from "../../assets/tensorflow-light.svg"; // Add TensorFlow icon
import scikitLearnIconDark from "../../assets/scikit-learn-dark.svg"; // Add Scikit-learn icon
import scikitLearnIconLight from "../../assets/scikit-learn-light.svg"; // Add Scikit-learn icon
import reactIconDark from "../../assets/react-dark.svg";
import reactIconLight from "../../assets/react-light.svg";
import nodeIconDark from "../../assets/node-dark.svg";
import nodeIconLight from "../../assets/node-light.svg";
import csharpIconDark from "../../assets/csharp-dark.svg"; // Add C# icon
import csharpIconLight from "../../assets/csharp-light.svg"; // Add C# icon
import aspnetIconLight from "../../assets/aspnet-light.svg";
import aspnetIconDark from "../../assets/aspnet-dark.svg";
import SkillList from "../../common/SkillList";
import { useTheme } from "../../common/ThemeContext";

function Skills() {
  const { theme } = useTheme();

  // Theme-based icon selection for each skill
  const icons = {
    html: theme === "light" ? htmlIconLight : htmlIconDark,
    css: theme === "light" ? cssIconLight : cssIconDark,
    javascript: theme === "light" ? javascriptIconLight : javascriptIconDark,
    python: theme === "light" ? pythonIconLight : pythonIconDark,
    java: theme === "light" ? javaIconLight : javaIconDark,
    cpp: theme === "light" ? cppIconLight : cppIconDark,
    sql: theme === "light" ? sqlIconLight : sqlIconDark,
    pandas: theme === "light" ? pandasIconLight : pandasIconDark,
    numpy: theme === "light" ? numpyIconLight : numpyIconDark,
    git: theme === "light" ? gitIconLight : gitIconDark,
    tensorflow: theme === "light" ? tensorflowIconLight : tensorflowIconDark,
    scikitLearn: theme === "light" ? scikitLearnIconLight : scikitLearnIconDark,
    react: theme === "light" ? reactIconLight : reactIconDark,
    node: theme === "light" ? nodeIconLight : nodeIconDark,
    csharp: theme === "light" ? csharpIconLight : csharpIconDark,
    aspnet: theme === "light" ? aspnetIconLight : aspnetIconDark,
  };

  return (
    <section id="skills" className={styles.container}>
      <h1 className="sectionTitle">Skills</h1>
      <div className={styles.skillList}>
        <SkillList src={icons.html} skill="HTML" />
        <SkillList src={icons.css} skill="CSS" />
        <SkillList src={icons.react} skill="React.js" />
        <SkillList src={icons.node} skill="Node.js" />
        <SkillList src={icons.aspnet} skill="ASP.NET" />
      </div>
      <hr />
      <div className={styles.skillList}>
        <SkillList src={icons.python} skill="Python" />
        <SkillList src={icons.java} skill="Java" />
        <SkillList src={icons.cpp} skill="C++" />
        <SkillList src={icons.javascript} skill="JavaScript" />
        <SkillList src={icons.sql} skill="SQL" />
        <SkillList src={icons.csharp} skill="C#" />
      </div>
      <hr />
      <div className={styles.skillList}>
        <SkillList src={icons.pandas} skill="Pandas" />
        <SkillList src={icons.numpy} skill="NumPy" />
        <SkillList src={icons.git} skill="Git" />
        <SkillList src={icons.tensorflow} skill="TensorFlow" />
        <SkillList src={icons.scikitLearn} skill="Scikit-learn" />
      </div>
    </section>
  );
}

export default Skills;
