import { useEffect, useRef, useState } from "react";
import { certificates, expertise, profile, technicalSkills } from "../data.js";
import Reveal from "./Reveal.jsx";

const tabs = ["Main", "Expertise", "Certificates"];

export default function About() {
  const resumePreviewUrl = `${import.meta.env.BASE_URL}Tecson_RESUME.png`;
  const resumeDialog = useRef(null);
  const resumeViewerImage = useRef(null);
  const resumeStage = useRef(null);
  const certificateDialog = useRef(null);
  const dragStart = useRef(null);
  const tabRefs = useRef([]);
  const [activeTab, setActiveTab] = useState("Main");
  const [zoomed, setZoomed] = useState(false);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  useEffect(() => {
    const dialog = certificateDialog.current;
    if (selectedCertificate && dialog && !dialog.open) dialog.showModal();
  }, [selectedCertificate]);

  const clampPan = (x, y) => {
    const stage = resumeStage.current;
    const image = resumeViewerImage.current;
    if (!stage || !image) return { x, y };

    const maxX = Math.max(0, (image.offsetWidth * 2 - stage.clientWidth) / 2);
    const maxY = Math.max(0, (image.offsetHeight * 2 - stage.clientHeight) / 2);

    return {
      x: Math.max(-maxX, Math.min(maxX, x)),
      y: Math.max(-maxY, Math.min(maxY, y)),
    };
  };

  const toggleZoom = () => {
    setZoomed(!zoomed);
    if (zoomed) setPan({ x: 0, y: 0 });
  };

  const openResume = (event) => {
    const dialog = resumeDialog.current;
    if (!dialog || dialog.open) return;

    const start = event.currentTarget.getBoundingClientRect();
    dialog.showModal();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const end = dialog.getBoundingClientRect();
    if (end.width === 0 || end.height === 0) return;
    const startCenterX = start.left + start.width / 2;
    const startCenterY = start.top + start.height / 2;
    const endCenterX = end.left + end.width / 2;
    const endCenterY = end.top + end.height / 2;

    dialog.animate(
      [
        {
          transform: `translate(${startCenterX - endCenterX}px, ${startCenterY - endCenterY}px) scale(${start.width / end.width}, ${start.height / end.height})`,
          opacity: 0.6,
        },
        { transform: "translate(0, 0) scale(1, 1)", opacity: 1 },
      ],
      { duration: 480, easing: "cubic-bezier(0.2, 0.7, 0.2, 1)" },
    );
  };

  const selectTabByKeyboard = (event, index) => {
    let nextIndex;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
    else if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = tabs.length - 1;
    else return;

    event.preventDefault();
    setActiveTab(tabs[nextIndex]);
    tabRefs.current[nextIndex]?.focus();
  };

  return (
    <section id="about">
      <h2>About me</h2>
      <Reveal className="about">
        <div className="about-tabs" role="tablist" aria-label="About me information">
          {tabs.map((tab, index) => (
            <button
              key={tab}
              ref={(element) => {
                tabRefs.current[index] = element;
              }}
              type="button"
              id={`about-tab-${index}`}
              role="tab"
              aria-selected={activeTab === tab}
              aria-controls={`about-panel-${index}`}
              tabIndex={activeTab === tab ? 0 : -1}
              onClick={() => setActiveTab(tab)}
              onKeyDown={(event) => selectTabByKeyboard(event, index)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div
          id={`about-panel-${tabs.indexOf(activeTab)}`}
          className="about-panel"
          role="tabpanel"
          aria-labelledby={`about-tab-${tabs.indexOf(activeTab)}`}
          tabIndex={0}
        >
          {activeTab === "Main" && (
            <>
              <p className="about-description">{profile.about}</p>
              <div className="about-actions">
                <button type="button" className="btn primary" onClick={openResume}>
                  View Resume
                </button>
                <a className="btn" href="#projects">View Projects</a>
              </div>
              <div className="experience">
                <h3>Project experience</h3>
                <article>
                  <h4>Academic software projects</h4>
                  <p>
                    Built web-based projects including HIVE, a group participation
                    tracking application, and Ready Job Go, a platform for finding
                    local short-term work.
                  </p>
                </article>
                <article>
                  <h4>Visual design projects</h4>
                  <p>
                    Created portfolio work across logo design, infographics,
                    product menus, and other visual brand assets.
                  </p>
                </article>
              </div>
            </>
          )}

          {activeTab === "Expertise" && (
            <div className="expertise-content">
              <h3>Tools & areas</h3>
              <ul className="expertise-list">
                {expertise.map((item) => <li key={item}>{item}</li>)}
              </ul>
              <h3>Technical skills</h3>
              <ul className="skill-list">
                {technicalSkills.map((skill) => (
                  <li key={skill.title}>
                    <h4>{skill.title}</h4>
                    <p>{skill.tools}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === "Certificates" && (
            <div className="certificates">
              <h3>Certificates & badges</h3>
              <ul className="certificate-list">
                {certificates.map((certificate) => (
                  <li key={certificate.image}>
                    <span>{certificate.title}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedCertificate({
                          title: certificate.title,
                          image: `${import.meta.env.BASE_URL}certs/${certificate.image}`,
                        })
                      }
                    >
                      View {certificate.type}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Reveal>

      <dialog
        ref={resumeDialog}
        className="resume-viewer"
        aria-label="Resume preview"
        onClick={(event) => {
          if (event.target === event.currentTarget) resumeDialog.current?.close();
        }}
        onClose={() => {
          setZoomed(false);
          setPan({ x: 0, y: 0 });
          dragStart.current = null;
        }}
      >
        <button
          type="button"
          className="resume-viewer-close"
          aria-label="Close resume preview"
          onClick={() => resumeDialog.current?.close()}
        >
          &times;
        </button>
        <div
          ref={resumeStage}
          className={`resume-viewer-stage${zoomed ? " is-zoomed" : ""}`}
          role="button"
          tabIndex={0}
          aria-pressed={zoomed}
          aria-label={
            zoomed
              ? "Resume zoomed. Drag to pan, or press Enter to reset."
              : "Resume preview. Double-click or press Enter to zoom."
          }
          onDoubleClick={toggleZoom}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              toggleZoom();
            } else if (zoomed && event.key.startsWith("Arrow")) {
              event.preventDefault();
              const distance = 40;
              const dx = event.key === "ArrowLeft" ? distance : event.key === "ArrowRight" ? -distance : 0;
              const dy = event.key === "ArrowUp" ? distance : event.key === "ArrowDown" ? -distance : 0;
              setPan((current) => clampPan(current.x + dx, current.y + dy));
            }
          }}
          onPointerDown={(event) => {
            if (!zoomed || event.button !== 0) return;
            event.currentTarget.setPointerCapture(event.pointerId);
            dragStart.current = { x: event.clientX - pan.x, y: event.clientY - pan.y };
          }}
          onPointerMove={(event) => {
            if (!dragStart.current) return;
            setPan(clampPan(event.clientX - dragStart.current.x, event.clientY - dragStart.current.y));
          }}
          onPointerUp={(event) => {
            dragStart.current = null;
            if (event.currentTarget.hasPointerCapture(event.pointerId)) {
              event.currentTarget.releasePointerCapture(event.pointerId);
            }
          }}
          onPointerCancel={() => {
            dragStart.current = null;
          }}
          onWheel={(event) => {
            if (!zoomed) return;
            event.preventDefault();
            setPan((current) => clampPan(current.x - event.deltaX, current.y - event.deltaY));
          }}
        >
          <img
            ref={resumeViewerImage}
            className="resume-viewer-image"
            src={resumePreviewUrl}
            alt="Resume"
            draggable="false"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoomed ? 2 : 1})`,
            }}
          />
        </div>
        <a
          className="btn resume-download"
          href={`${import.meta.env.BASE_URL}${profile.resumeUrl}`}
          download={profile.resumeUrl}
        >
          Download Resume (.pdf)
        </a>
      </dialog>

      <dialog
        ref={certificateDialog}
        className="resume-viewer artwork-viewer"
        aria-label={`${selectedCertificate?.title || "Certificate"} preview`}
        onClick={(event) => {
          if (event.target === event.currentTarget) certificateDialog.current?.close();
        }}
        onClose={() => setSelectedCertificate(null)}
      >
        <button
          type="button"
          className="resume-viewer-close"
          aria-label="Close certificate preview"
          onClick={() => certificateDialog.current?.close()}
        >
          &times;
        </button>
        <div className="artwork-viewer-stage">
          {selectedCertificate && (
            <img
              className="resume-viewer-image"
              src={selectedCertificate.image}
              alt={selectedCertificate.title}
              draggable="false"
            />
          )}
        </div>
      </dialog>
    </section>
  );
}
