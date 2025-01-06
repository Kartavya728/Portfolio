import { gridItems } from "@/data";
import { BentoGrid, BentoGridItem } from "./ui/BentoGrid";
import { TextGenerateEffect } from "./ui/TextGenerateEffect";

const Grid = () => {
  return (
    <div>
      <h1 className="heading">
        <span className="text-purple">About Me</span>
      </h1>
      <section id="about">
        <BentoGrid className="w-full py-20">
          {gridItems.map((item, i) => (
            <BentoGridItem
              id={item.id}
              key={i}
              title={item.title}
              description={item.description}
              // remove icon prop
              // remove original classname condition
              className={item.className}
              img={item.img}
              imgClassName={item.imgClassName}
              titleClassName={item.titleClassName}
              spareImg={item.spareImg}
            />
          ))}
        </BentoGrid>
      </section>
    </div>
  );
};

export default Grid;
