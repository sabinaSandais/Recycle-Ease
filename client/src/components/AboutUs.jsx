import React from "react";
import "./AboutUs.css";
import bannerImage from "./assets/Banner.jpeg";
import { useEffect } from "react";
const AboutUs = () => {
  useEffect(() => {
    const searchItem = document.querySelector(".address-search");
    if (searchItem) searchItem.style.visibility = "hidden";
  }, []);

  return (
    <div className="about">
      <div className="container">
        <img src={bannerImage} alt="banner" className="banner" />
        <h4>Empowering Sustainable Choices with Convenience</h4>
        <p className="mainText">
          Welcome to <strong>RecycleEase</strong>, where technology meets
          sustainability to make your recycling experience seamless and
          efficient. Our mission is to eliminate the frustration of arriving at
          a recycling machine only to find it out of order or full, ensuring
          your efforts to care for our planet are as smooth as possible.
          <strong>What We Do</strong> RecycleEase provides real-time updates on
          the status of recycling machines at various locations, helping you
          plan your recycling trips efficiently. No more wasted journeys with
          bags of cans, only to be met with disappointment. Our app ensures that
          you always know which machines are operational and ready to accept
          your recyclables.
        </p>
        <h4>Our Story</h4>
        <p className="mainText">
          Born from a personal frustration with unreliable recycling points,
          RecycleEase was conceived with a simple yet powerful idea: What if you
          could check the status of recycling machines before you even leave
          home? This simple idea has grown into a comprehensive platform that
          helps thousands of eco-conscious individuals like you to recycle with
          confidence and ease.
        </p>
        <h4>Key Features</h4>
        <div className="grid">
          <div className="grid-item">
            <div className="feature-card1">
              <h6>Live Status Updates</h6>
              <p className="text">
                Instantly check whether a machine is open, closed, or full,
                through live notifications.
              </p>
            </div>
          </div>
          <div className="grid-item">
            <div className="feature-card2">
              <h6>Nearby Locations</h6>
              <p className="text">
                Find the closest operational recycling machines through our
                user-friendly Interface.{" "}
              </p>
            </div>
          </div>
          <div className="grid-item">
            <div className="feature-card1">
              <h6>Community Driven</h6>
              <p className="text">
                Feedback and updates from users like you help keep our
                information accurate and up-to-date.
              </p>
            </div>
          </div>
        </div>
        <h4>Our Vision</h4>
        <p className="mainText">
          We envision a world where recycling is straightforward and accessible
          for everyone. By bridging the gap between technology and
          sustainability, we aim to foster a community where recycling is not
          only a responsible choice but also a convenient one. We achieve this
          through our easy to navigate app, ensuring a hassle-free experience.
        </p>
        <h4>Join Us in Making a Difference</h4>
        <p className="mainText">
          Every can you recycle is a step towards a greener planet. With
          RecycleEase, you can make each step count. Download our app today and
          be part of a community that values efficiency, sustainability, and the
          power of informed choices.
        </p>
        <h4>Contact Us</h4>
        <p className="mainText">
          Have questions or feedback? We’d love to hear from you! Reach out to
          us at{" "}
          <a href="mailto:support@recycleease.com">support@recycleease.com</a>{" "}
          and let’s work together to make recycling easier for everyone.
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
