"use client";
import img1 from "../data/node.png";
import img2 from "../data/react.png";
import img3 from "../data/arduino.png";
import img4 from "../data/mongo.png";
import img5 from "../data/postman.png";
import img6 from "../data/next.png";
import React from "react";
import { testimonials } from "@/data";
import { InfiniteMovingCards } from "./ui/InfiniteCards";
import Image from "next/image";

const Clients = () => {
  return (
    <section id="testimonials" className="py-20">
      <h1 className="heading">
        My Participations in Various
        <span className="text-purple"> Events & Competition</span>
      </h1>

      <div className="flex flex-col items-center max-lg:mt-10">
        <div className="h-[50vh] md:h-[30rem] rounded-md flex flex-col antialiased items-center justify-center relative overflow-hidden">
          <InfiniteMovingCards
            items={testimonials}
            direction="right"
            speed="slow"
          />
        </div>

        <div className="flex flex-wrap justify-around items-center gap-4 md:gap-16 max-lg:mt-10">
          <div className="flex gap-4 flex-wrap justify-around w-full">
            <Image
              src={img1}
              alt="Centered Circle Image"
              height={50}
              width={150}
              className="flex-shrink-0"
            />
            <Image
              src={img2}
              alt="Centered Circle Image"
              height={50}
              width={150}
              className="flex-shrink-0"
            />
            <Image
              src={img3}
              alt="Centered Circle Image"
              height={50}
              width={150}
              className="flex-shrink-0"
            />
            <Image
              src={img4}
              alt="Centered Circle Image"
              height={50}
              width={150}
              className="flex-shrink-0"
            />
            <Image
              src={img5}
              alt="Centered Circle Image"
              height={50}
              width={150}
              className="flex-shrink-0"
            />
            <Image
              src={img6}
              alt="Centered Circle Image"
              height={50}
              width={150}
              className="flex-shrink-0"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Clients;
