import { useEffect, useRef, useState } from "react";
import { designProjects, projects } from "../data.js";
import Reveal from "./Reveal.jsx";

function Arrow({ dir, onClick }) {
  return (
    <button
      type="button"
      className={`arrow ${dir}`}
      onClick={onClick}
      aria-label={dir === "prev" ? "Previous project" : "Next project"}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M14.6014 4.46967C14.8943 4.76256 14.8943 5.23744 14.6014 5.53033L8.23741 11.8943C8.13978 11.9919 8.13978 12.1502 8.23741 12.2478L14.6014 18.6118C14.8943 18.9047 14.8943 19.3796 14.6014 19.6725C14.3085 19.9654 13.8336 19.9654 13.5407 19.6725L7.17675 13.3085C6.49333 12.6251 6.49333 11.517 7.17675 10.8336L13.5407 4.46967C13.8336 4.17678 14.3085 4.17678 14.6014 4.46967Z"
        />
      </svg>
    </button>
  );
}

export default function Projects() {
  const artworkDialog = useRef(null);
  const swipeStart = useRef(null);
  const suppressPreviewClick = useRef(false);
  const swipeClickTimeout = useRef(null);
  const [i, setI] = useState(0);
  const [direction, setDirection] = useState("");
  const [category, setCategory] = useState("software");
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const activeProjects = category === "software" ? projects : designProjects;
  const n = activeProjects.length;
  const p = activeProjects[i];
  const image = p && (p.image || p.logo);

  useEffect(() => {
    const dialog = artworkDialog.current;
    if (selectedArtwork && dialog && !dialog.open) dialog.showModal();
  }, [selectedArtwork]);

  const go = (step) => {
    if (!n) return;
    setDirection(step > 0 ? "next" : "prev");
    setI((current) => (current + step + n) % n);
  };
  const toggleCategory = () => {
    setCategory((current) => (current === "software" ? "design" : "software"));
    setDirection("");
    setI(0);
  };

  return (
    <section id="projects">
      <div className="projects-heading">
        <h2 key={category} className="project-category-title">
          {category === "software" ? "Software Projects" : "Design Projects"}
        </h2>
        <button
          type="button"
          className="project-toggle"
          onClick={toggleCategory}
          aria-label={`Switch to ${category === "software" ? "Design" : "Software"} Projects`}
        >
          {category === "software" ? "Design Projects" : "Software Projects"}
          <svg
            className="project-toggle-icon"
            viewBox="0 0 1024 1024"
            aria-hidden="true"
          >
            <path
              fill="currentColor"
              d="M118.656 438.656a32 32 0 0 1 0-45.248L416 96l4.48-3.776A32 32 0 0 1 461.248 96l3.712 4.48a32.064 32.064 0 0 1-3.712 40.832L218.56 384H928a32 32 0 1 1 0 64H141.248a32 32 0 0 1-22.592-9.344zM64 608a32 32 0 0 1 32-32h786.752a32 32 0 0 1 22.656 54.592L608 928l-4.48 3.776a32.064 32.064 0 0 1-40.832-49.024L805.632 640H96a32 32 0 0 1-32-32z"
            />
          </svg>
        </button>
      </div>
      {p ? (
        <Reveal className="carousel">
          <div
            className="carousel-swipe-area"
            onPointerDown={(event) => {
              if (
                event.pointerType === "mouse" ||
                (event.target instanceof Element && event.target.closest(".arrow"))
              ) {
                return;
              }
              window.clearTimeout(swipeClickTimeout.current);
              suppressPreviewClick.current = false;
              swipeStart.current = { x: event.clientX, y: event.clientY };
            }}
            onPointerUp={(event) => {
              const start = swipeStart.current;
              swipeStart.current = null;
              if (!start) return;

              const deltaX = event.clientX - start.x;
              const deltaY = event.clientY - start.y;
              if (Math.abs(deltaX) < 48 || Math.abs(deltaX) < Math.abs(deltaY) * 1.2) return;

              suppressPreviewClick.current = true;
              swipeClickTimeout.current = window.setTimeout(() => {
                suppressPreviewClick.current = false;
              }, 500);
              go(deltaX < 0 ? 1 : -1);
            }}
            onPointerCancel={() => {
              swipeStart.current = null;
            }}
            onClickCapture={(event) => {
              if (!suppressPreviewClick.current) return;
              event.preventDefault();
              event.stopPropagation();
              suppressPreviewClick.current = false;
              window.clearTimeout(swipeClickTimeout.current);
            }}
          >
            <div className={`carousel-top${category === "design" ? " design-carousel-top" : ""}`}>
              <Arrow dir="prev" onClick={() => go(-1)} />
              <div className={`logo-box${category === "design" ? " design-artwork" : ""}`}>
                {image ? (
                  category === "design" ? (
                    <button
                      type="button"
                      className="artwork-preview"
                      aria-label={`Open ${p.title} artwork`}
                      onClick={() =>
                        setSelectedArtwork({
                          src: `${import.meta.env.BASE_URL}${image}`,
                          title: p.title,
                        })
                      }
                    >
                      <img
                        key={`${category}-${i}`}
                        className={`project-logo${direction ? ` slide-${direction}` : ""}`}
                        src={`${import.meta.env.BASE_URL}${image}`}
                        alt={`${p.title} artwork`}
                      />
                    </button>
                  ) : (
                    <img
                      key={`${category}-${i}`}
                      className={`project-logo${direction ? ` slide-${direction}` : ""}`}
                      src={`${import.meta.env.BASE_URL}${image}`}
                      alt={`${p.title} logo`}
                    />
                  )
                ) : (
                  "Logo"
                )}
              </div>
              <Arrow dir="next" onClick={() => go(1)} />
            </div>

            <div className="project slide-down" key={`${category}-${i}`} aria-live="polite">
              <h3>{p.title}</h3>
              {p.text && <p className="desc">{p.text}</p>}
              {p.status && (
                <p className="meta">
                  <strong>Status:</strong>{" "}
                  <span className={`status ${p.status.toLowerCase()}`}>{p.status}</span>
                </p>
              )}
              {p.link && (
                <p className="meta">
                  <strong>Link:</strong>{" "}
                  <a href={p.link} target="_blank" rel="noreferrer">{p.link}</a>
                </p>
              )}
            </div>
          </div>
        </Reveal>
      ) : (
        <div className="projects-empty" role="status">
          Design projects coming soon.
        </div>
      )}
      <dialog
        ref={artworkDialog}
        className="resume-viewer artwork-viewer"
        aria-label={`${selectedArtwork?.title || "Design"} artwork preview`}
        onClick={(event) => {
          if (event.target === event.currentTarget) artworkDialog.current?.close();
        }}
        onClose={() => setSelectedArtwork(null)}
      >
        <button
          type="button"
          className="resume-viewer-close"
          aria-label="Close artwork preview"
          onClick={() => artworkDialog.current?.close()}
        >
          &times;
        </button>
        <div className="artwork-viewer-stage">
          {selectedArtwork && (
            <img
              className="resume-viewer-image"
              src={selectedArtwork.src}
              alt={selectedArtwork.title}
              draggable="false"
            />
          )}
        </div>
      </dialog>
    </section>
  );
}
