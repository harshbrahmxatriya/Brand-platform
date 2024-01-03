import React, { useState } from "react";
import styled from "styled-components";
import { motion as m } from "framer-motion";
import { Link } from "react-router-dom";

import Product1 from "/curologyC.jpg";
import Product2 from "/luminC.jpg";
import Product3 from "/armaniC.jpg";
import Product4 from "/ordinaryC.jpg";
import GetStarted from "./GetStarted";

const Section = styled.section`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: black;
`;
const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 100vh;
  padding: 3rem calc((100vw - 1300px) / 2);

  @media screen and (max-width: 768px) {
    grid-template-columns: 75% 25%;
  }
`;
const ColumnLeft = styled.div`
  display: flex;
  color: white;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 5rem 2rem;

  h1 {
    margin-bottom: 0.5rem;
    font-size: 2rem;
  }
  p {
    margin: 2rem 0;
    font-size: 4rem;
    line-height: 1.1;
  }
  @media screen and (max-width: 768px) {
    p {
      font-size: 3rem;
    }
  }
`;
const Button = styled(m.button)`
  padding: 1rem 3rem;
  font-size: 1rem;
  border: 2px solid white;
  border-radius: 4px;
  outline: none;
  cursor: pointer;
  color: white;
  background: transparent;
`;

const Image = styled(m.img)`
  position: absolute;
  width: 220px;
  height: 220px;
  border-radius: 1000px;
  object-fit: cover;
  object-position: 0px 70%;
`;
const ColumnRight = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  position: relative;

  ${Image}:nth-child(1) {
    top: 2px;
    left: 2px;
  }
  ${Image}:nth-child(2) {
    top: 80px;
    right: 10px;
  }
  ${Image}:nth-child(3) {
    top: 350px;
    left: 50px;
  }
  ${Image}:nth-child(4) {
    bottom: 40px;
    right: 105px;
  }
`;

const Hero = () => {
  const fadeLeft = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0 },
  };
  const handleShowGetStarted = () => {
    // setUserEmail(userEmail)
    // setShowGetStarted(true)
  };

  return (
    <>
      <m.div
        className="absolute "
        transition={{ duration: 0.5, ease: "easeOut" }}
        exit={{ opacity: 1 }}
      >
        <Section>
          <Container>
            <ColumnLeft>
              <m.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
              >
                Welcome to Our portal
              </m.h1>
              <m.p
                variants={fadeLeft}
                initial="hidden"
                animate="visible"
                transition={{ duration: 2 }}
              >
                Build Brands new way in new era
              </m.p>
              <Link to="/get-started">
                <Button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{
                    scale: 0.95,
                    backgroundColor: "#67F6E7",
                    border: "none",
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { duration: 1 } }}
                >
                  Get Started
                </Button>
              </Link>
            </ColumnLeft>
            <ColumnRight>
              <Image
                src={Product1}
                alt="product"
                whileTap={{ scale: 0.9 }}
                drag={true}
                dragConstraints={{ left: 0, right: 250, top: 0, bottom: 50 }}
                initial={{ opacity: 0, y: -100 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 2 } }}
              />
              <Image
                src={Product2}
                alt="product"
                whileTap={{ scale: 0.6 }}
                drag={true}
                dragConstraints={{ left: 50, right: 0, top: 0, bottom: 50 }}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0, transition: { duration: 2 } }}
              />
              <Image
                src={Product3}
                alt="product"
                whileTap={{ scale: 0.8 }}
                drag={true}
                dragConstraints={{ left: 0, right: 250, top: 0, bottom: 50 }}
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0, transition: { duration: 2 } }}
              />
              <Image
                src={Product4}
                alt="product"
                whileTap={{ scale: 0.9 }}
                drag={true}
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 2 } }}
              />
            </ColumnRight>
          </Container>
        </Section>
      </m.div>
    </>
  );
};

export default Hero;
