import Hero from "../components/Hero/Hero";
import Login from "../components/Login/Login";

const Home = () => {

  return (
    <section className="home">
      <div className="home__container container">
        <Hero/>
        <Login/>
      </div>
    </section>
  )
};

export default Home;