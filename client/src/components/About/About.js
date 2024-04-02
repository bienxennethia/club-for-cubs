import React from "react";

import "./About.scss";
import { ReactComponent as Logo } from "../../icons/logo.svg";

const About = () => {

  return (
    <div className="about">
      <div className="about__header">
        <h6 className="about__subtitle">About</h6>
        <h1 className="about__title">Club for Cubs</h1>
      </div>
      <div className="about__content">
        <div className="about__logo">
          <Logo className="logo" />
        </div>
        <div className="about__text">
          <p>Welcome to the online website of the San Beda University Manila Senior High School Club for Cubs!  Here, we're dedicated to fostering a vibrant and inclusive community where Grade 11 and 12 students can explore, engage, and excel in a diverse array of co-curricular and interest clubs.</p>
          <p>At the heart of our mission is the belief that extracurricular involvement enriches the high school experience, nurturing personal growth, leadership skills, and lifelong friendships. Whether you're passionate about the arts, sciences, sports, service, or anything in between, there's a club here just waiting for you to join in and make your mark.</p>
          <p>Through this platform, we aim to provide comprehensive information about the myriad of clubs available to our Cubs. From academic and cultural organizations to sports teams and community service initiatives, there's something for everyone. Discover clubs that align with your interests, goals, and aspirations, and embark on a journey of self-discovery and skill development.</p>
        </div>
      </div>
    </div>
  )
}

export default About;