"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { Observer } from "gsap/Observer";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { TextPlugin } from "gsap/TextPlugin";

// Register the Observer plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(Observer, ScrollToPlugin, TextPlugin);
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

export default function CollectionsSlider({
  firstSectionRef,
  secondSectionRef,
  collectionsSliderRef,
}) {
  const sliderRef = useRef(null);
  const countRef = useRef(null);

  useEffect(() => {
    // Use collectionsSliderRef value if provided, otherwise use local ref
    const sliderElement = collectionsSliderRef?.current || sliderRef.current;
    if (!sliderElement) return;

    const sections = gsap.utils.toArray(".slide");
    const images = gsap.utils.toArray(".image").reverse();
    const slideImages = gsap.utils.toArray(".slide__img");
    const outerWrappers = gsap.utils.toArray(".slide__outer");
    const innerWrappers = gsap.utils.toArray(".slide__inner");
    const count = document.querySelector(".overlay__count");
    const wrap = gsap.utils.wrap(0, sections.length);
    let animating;
    let currentIndex = 0;
    let observerActive = false;

    gsap.set(outerWrappers, { xPercent: 100 });
    gsap.set(innerWrappers, { xPercent: -100 });
    gsap.set(".slide:nth-of-type(1) .slide__outer", { xPercent: 0 });
    gsap.set(".slide:nth-of-type(1) .slide__inner", { xPercent: 0 });

    function gotoSection(index, direction) {
      // Set animating flag to true to prevent multiple animations at once
      animating = true;

      // Wrap the index to ensure it stays within bounds (0 to sections.length-1)
      // If index becomes negative or exceeds the number of sections, it cycles back
      index = wrap(index);

      console.log(`Changing to slide: ${index + 1} of ${sections.length}`);

      // Check if this is the last slide
      if (index === sections.length - 1) {
        console.log("This is the last slide");
      }

      // Create a GSAP timeline for coordinating multiple animations
      // All animations in this timeline will run in parallel unless specified otherwise
      let tl = gsap.timeline({
        defaults: { duration: 1, ease: "expo.inOut" }, // Default animation settings
        onComplete: () => {
          // Re-enable scrolling when animation completes
          animating = false;
          console.log(
            `Animation complete - Current slide: ${currentIndex + 1}`,
          );
        },
      });

      // Get references to the current and next section elements
      let currentSection = sections[currentIndex];
      let heading = currentSection.querySelector(".slide__heading");
      let nextSection = sections[index];
      let nextHeading = nextSection.querySelector(".slide__heading");

      // Set up initial states for all elements
      // This sets z-index and visibility for proper layering during animation
      gsap.set([sections, images], { zIndex: 0, autoAlpha: 0 });
      gsap.set([sections[currentIndex], images[index]], {
        zIndex: 1,
        autoAlpha: 1,
      });
      gsap.set([sections[index], images[currentIndex]], {
        zIndex: 2,
        autoAlpha: 1,
      });

      // Start timeline animation sequence
      // The timeline runs multiple animations in parallel (with position parameter 0)
      tl.set(count, { text: index + 1 }, 0.32) // Update slide counter text
        .fromTo(
          outerWrappers[index],
          {
            xPercent: 100 * direction, // Start position (100% right or left)
          },
          { xPercent: 0 }, // End position (centered)
          0, // Position in timeline (0 = start together)
        )
        .fromTo(
          innerWrappers[index],
          {
            xPercent: -100 * direction, // Start position (opposite direction)
          },
          { xPercent: 0 }, // End position (centered)
          0, // Position in timeline
        )
        .to(
          heading,
          {
            "--width": 800, // CSS variable animation
            xPercent: 30 * direction, // Move current heading away
          },
          0, // Position in timeline
        )
        .fromTo(
          nextHeading,
          {
            "--width": 800,
            xPercent: -30 * direction, // Start position for next heading
          },
          {
            "--width": 200,
            xPercent: 0, // End position (centered)
          },
          0, // Position in timeline
        )
        .fromTo(
          images[index],
          {
            xPercent: 125 * direction, // Start position for next image
            scaleX: 1.5,
            scaleY: 1.3,
          },
          { xPercent: 0, scaleX: 1, scaleY: 1, duration: 1 }, // End position (centered, normal scale)
          0, // Position in timeline
        )
        .fromTo(
          images[currentIndex],
          { xPercent: 0, scaleX: 1, scaleY: 1 }, // Start position for current image
          {
            xPercent: -125 * direction, // Move current image away
            scaleX: 1.5,
            scaleY: 1.3,
          },
          0, // Position in timeline
        )
        .fromTo(
          slideImages[index],
          {
            scale: 2, // Start with larger scale
          },
          { scale: 1 }, // End with normal scale
          0, // Position in timeline
        )
        .timeScale(0.8); // Slow down the entire animation to 80% speed

      // Update the currentIndex to the new index
      // This is important for the next animation to know which slide is active
      currentIndex = index;
    }

    const observerInstance = Observer.create({
      type: "wheel,touch,pointer",
      preventDefault: true,
      wheelSpeed: -1,
      onUp: () => {
        if (animating || !observerActive) return;
        console.log("Scrolling DOWN - Going to next slide");
        gotoSection(currentIndex + 1, +1);
      },
      onDown: () => {
        if (animating || !observerActive) return;

        // If we're at the last slide, scroll to footer instead of trying to go to next slide
        if (currentIndex === sections.length - 1) {
          console.log("At last slide, cycling back to first slide");
          gotoSection(0, -1); // Go to first slide when at the last slide
          return;
        }

        console.log("Scrolling UP - Going to previous slide");
        gotoSection(currentIndex - 1, -1);
      },
      tolerance: 10,
      target: sliderElement,
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
      const shouldBeActive = isElementMostlyInViewport(sliderElement);

      if (shouldBeActive && !observerActive) {
        observerInstance.enable();
        observerActive = true;
        console.log("Observer enabled - Current slide:", currentIndex + 1);
      } else if (!shouldBeActive && observerActive) {
        observerInstance.disable();
        observerActive = false;
        console.log("Observer disabled - Last slide:", currentIndex + 1);
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
    console.log(`Initial slide: ${currentIndex + 1} of ${sections.length}`);

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
      className="relative h-[100vh] w-[100vw] overflow-hidden"
      ref={(el) => {
        // Set both the local ref and the passed ref if it exists
        sliderRef.current = el;
        if (collectionsSliderRef) collectionsSliderRef.current = el;
      }}
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

          width: 100vw;
          margin: 0 auto;
          height: 90vh;
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
          <p className="overlay__count">1</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="collections-footer">
        <p>Attire Alley Collection</p>
      </footer>
    </div>
  );
}
