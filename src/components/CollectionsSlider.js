"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { Observer } from "gsap/Observer";
import Link from "next/link";

// Register the Observer plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(Observer);
}

const collections = [
  {
    imgSrc1: "/landingpage/coverpagewoman.jpg",
    imgSrc2:
      "https://images.unsplash.com/photo-1698815614885-97a1b2d29669?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Women",
    linkHref: "/products/women",
  },
  {
    imgSrc1: "/landingpage/coverpageman3.png",
    imgSrc2:
      "https://images.unsplash.com/photo-1558603668-6570496b66f8?crop=entropy&cs=srgb&fm=jpg&ixid=MnwxNDU4OXwwfDF8cmFuZG9tfHx8fHx8fHx8MTY0NjMyMDUzOA&ixlib=rb-1.2.1&q=85&w=400",
    title: "Mens",
    linkHref: "/products/men",
  },
  {
    imgSrc1: "/landingpage/coverpagekids3.png",
    imgSrc2:
      "https://images.unsplash.com/photo-1589271243958-d61e12b61b97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNDU4OXwwfDF8cmFuZG9tfHx8fHx8fHx8MTY0NjMyMDU4NA&ixlib=rb-1.2.1&q=80&w=400",
    title: "Kids",
    linkHref: "/products/kids",
  },
];

export default function CollectionsSlider() {
  const sliderRef = useRef(null);
  const countRef = useRef(null);

  useEffect(() => {
    if (!sliderRef.current) return;

    const sections = gsap.utils.toArray(".slide");
    const images = gsap.utils.toArray(".image").reverse();
    const slideImages = gsap.utils.toArray(".slide__img");
    const outerWrappers = gsap.utils.toArray(".slide__outer");
    const innerWrappers = gsap.utils.toArray(".slide__inner");
    const count = document.querySelector(".count");
    const wrap = gsap.utils.wrap(0, sections.length);
    let animating;
    let currentIndex = 0;
    let observerActive = false;

    gsap.set(outerWrappers, { xPercent: 100 });
    gsap.set(innerWrappers, { xPercent: -100 });
    gsap.set(".slide:nth-of-type(1) .slide__outer", { xPercent: 0 });
    gsap.set(".slide:nth-of-type(1) .slide__inner", { xPercent: 0 });

    function gotoSection(index, direction) {
      animating = true;
      index = wrap(index);

      let tl = gsap.timeline({
        defaults: { duration: 1, ease: "expo.inOut" },
        onComplete: () => {
          animating = false;
        },
      });

      let currentSection = sections[currentIndex];
      let heading = currentSection.querySelector(".slide__heading");
      let nextSection = sections[index];
      let nextHeading = nextSection.querySelector(".slide__heading");

      gsap.set([sections, images], { zIndex: 0, autoAlpha: 0 });
      gsap.set([sections[currentIndex], images[index]], {
        zIndex: 1,
        autoAlpha: 1,
      });
      gsap.set([sections[index], images[currentIndex]], {
        zIndex: 2,
        autoAlpha: 1,
      });

      tl.set(count, { text: index + 1 }, 0.32)
        .fromTo(
          outerWrappers[index],
          {
            xPercent: 100 * direction,
          },
          { xPercent: 0 },
          0,
        )
        .fromTo(
          innerWrappers[index],
          {
            xPercent: -100 * direction,
          },
          { xPercent: 0 },
          0,
        )
        .to(
          heading,
          {
            "--width": 800,
            xPercent: 30 * direction,
          },
          0,
        )
        .fromTo(
          nextHeading,
          {
            "--width": 800,
            xPercent: -30 * direction,
          },
          {
            "--width": 200,
            xPercent: 0,
          },
          0,
        )
        .fromTo(
          images[index],
          {
            xPercent: 125 * direction,
            scaleX: 1.5,
            scaleY: 1.3,
          },
          { xPercent: 0, scaleX: 1, scaleY: 1, duration: 1 },
          0,
        )
        .fromTo(
          images[currentIndex],
          { xPercent: 0, scaleX: 1, scaleY: 1 },
          {
            xPercent: -125 * direction,
            scaleX: 1.5,
            scaleY: 1.3,
          },
          0,
        )
        .fromTo(
          slideImages[index],
          {
            scale: 2,
          },
          { scale: 1 },
          0,
        )
        .timeScale(0.8);

      currentIndex = index;
    }

    // Create observer with target explicitly set to the slider element
    const observerInstance = Observer.create({
      type: "wheel,touch,pointer",
      preventDefault: true,
      wheelSpeed: -1,
      onUp: () => {
        if (animating || !observerActive) return;
        gotoSection(currentIndex + 1, +1);
      },
      onDown: () => {
        if (animating || !observerActive) return;
        gotoSection(currentIndex - 1, -1);
      },
      tolerance: 10,
      target: sliderRef.current,
    });

    // Initially disable the observer
    observerInstance.disable();

    // Helper function to check if element is mostly in viewport
    function isElementMostlyInViewport(el) {
      if (!el) return false;
      const rect = el.getBoundingClientRect();
      const windowHeight =
        window.innerHeight || document.documentElement.clientHeight;
      const visibleHeight =
        Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
      const elementHeight = rect.bottom - rect.top;

      return visibleHeight > elementHeight * 0.7; // 70% visibility threshold
    }

    // Function to check and update observer state
    function updateObserverState() {
      const shouldBeActive = isElementMostlyInViewport(sliderRef.current);

      if (shouldBeActive && !observerActive) {
        observerInstance.enable();
        observerActive = true;
      } else if (!shouldBeActive && observerActive) {
        observerInstance.disable();
        observerActive = false;
      }
    }

    // Key handler that only works when the slider is active
    function handleKeyDown(e) {
      if (!observerActive) return;

      if ((e.code === "ArrowUp" || e.code === "ArrowLeft") && !animating) {
        gotoSection(currentIndex - 1, -1);
      }
      if (
        (e.code === "ArrowDown" ||
          e.code === "ArrowRight" ||
          e.code === "Space" ||
          e.code === "Enter") &&
        !animating
      ) {
        gotoSection(currentIndex + 1, 1);
      }
    }

    // Add scroll listener to update observer state
    window.addEventListener("scroll", updateObserverState);

    // Initial check
    updateObserverState();

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", updateObserverState);
      if (observerInstance) {
        observerInstance.disable();
      }
    };
  }, []);

  return (
    <div
      className="collections-slider relative h-[100vh] w-[100vw] overflow-hidden"
      ref={sliderRef}
    >
      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Sora&display=swap");

        .slide {
          height: 100%;
          width: 100%;
          top: 0;
          position: absolute;
          visibility: hidden;
        }

        .slide__outer,
        .slide__inner {
          width: 100%;
          height: 100%;
          overflow-y: hidden;
        }

        .slide__content {
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          height: 100%;
          width: 100%;
          top: 0;
        }

        .slide__container {
          position: relative;
          max-width: 1400px;
          width: 100vw;
          margin: 0 auto;
          height: 90vh;
          margin-bottom: 10vh;
          display: grid;
          grid-template-columns: repeat(10, 1fr);
          grid-template-rows: repeat(10, 1fr);
          grid-column-gap: 0px;
          grid-row-gap: 0px;
          padding: 0 1rem;
        }

        .slide__heading {
          --width: 200;
          display: block;
          text-align: left;
          font-size: clamp(5rem, 15vw, 15rem);
          font-weight: 900;
          margin: 0;
          padding: 0;
          color: #f2f1fc;
          z-index: 999;
          mix-blend-mode: difference;
          grid-area: 2 / 2 / 3 / 10;
          align-self: end;
        }

        .slide__img-cont {
          margin-top: 4rem;
          grid-area: 2 / 1 / 7 / 8;
          margin: 0;
          overflow: hidden;
        }

        .slide__img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .slide:nth-of-type(1) {
          visibility: visible;
        }
        .slide:nth-of-type(1) .slide__content {
          background-color: #6d597a;
        }

        .slide:nth-of-type(2) .slide__content {
          background-color: #355070;
        }

        .slide:nth-of-type(3) .slide__content {
          background-color: #b56576;
        }

        .slide:nth-of-type(4) .slide__content {
          background-color: #9a8c98;
        }

        .overlay {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 2;
        }

        .overlay__content {
          max-width: 1400px;
          width: 100vw;
          margin: 0 auto;
          padding: 0 1rem;
          height: 90vh;
          margin-bottom: 10vh;
          display: grid;
          grid-template-columns: repeat(10, 1fr);
          grid-template-rows: repeat(10, 1fr);
          grid-column-gap: 0px;
          grid-row-gap: 0px;
        }

        .overlay__img-cont {
          position: relative;
          overflow: hidden;
          margin: 0;
          grid-area: 4 / 3 / 9 / 11;
        }

        .overlay__img-cont img {
          position: absolute;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: 50% 50%;
        }

        .overlay__count {
          grid-area: 3 / 10 / 4 / 10;
          font-size: clamp(3rem, 4vw, 15rem);
          margin: 0;
          padding: 0;
          text-align: right;
          border-bottom: 7px white solid;
        }

        .collections-footer {
          position: absolute;
          z-index: 999;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
          width: 100%;
          height: 7em;
          font-family: "Sora", sans-serif;
          font-size: clamp(1.2rem, 2vw, 1rem);
        }

        .collections-footer a {
          color: #fff;
          text-decoration: none;
        }

        @media screen and (min-width: 900px) {
          .overlay__content,
          .slide__container {
            padding: 0 3rem;
            margin-top: 10vh;
            height: 80vh;
          }

          .overlay__img-cont {
            grid-area: 5 / 4 / 10 / 11;
          }

          .overlay__count {
            grid-area: 3 / 10 / 4 / 11;
          }

          .slide__img-cont {
            margin-top: 0;
            grid-area: 3 / 2 / 8 / 7;
          }

          .slide__heading {
            grid-area: 1 / 1 / 4 / 10;
          }
        }
      `}</style>

      {/* Slides */}
      {collections.map((collection, index) => (
        <section key={index} className="slide">
          <div className="slide__outer">
            <div className="slide__inner">
              <div className="slide__content">
                <div className="slide__container">
                  <h2 className="slide__heading">{collection.title}</h2>
                  <figure className="slide__img-cont">
                    <Image
                      className="slide__img"
                      src={collection.imgSrc1}
                      alt={`${collection.title} Collection`}
                      width={400}
                      height={400}
                    />
                  </figure>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Overlay */}
      <section className="overlay">
        <div className="overlay__content">
          <figure className="overlay__img-cont">
            {collections.map((collection, index) => (
              <Image
                key={index}
                className="image"
                src={collection.imgSrc2}
                alt={`${collection.title} Collection`}
                width={800}
                height={600}
              />
            ))}
          </figure>
        </div>
      </section>

      {/* Footer */}
      <footer className="collections-footer">
        <p>Attire Alley Collection</p>
      </footer>
    </div>
  );
}
