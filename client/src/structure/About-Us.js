import About from "../components/About/About";
import Creators from "../components/Creators/Creators";

const AboutUs = () => {

  return (
    <section className="about-us">
      <div className="about-us__container container">
        <About />
        <Creators />
      </div>
    </section>
  )
};

export default AboutUs;