import { useEffect, useRef, useState } from "react";
import { certificates, profile } from "../data.js";
import Reveal from "./Reveal.jsx";

export default function About() {
  const resumePreviewUrl = `${import.meta.env.BASE_URL}Tecson_RESUME.png`;
  const resumeDialog = useRef(null);
  const resumeThumbnail = useRef(null);
  const resumeViewerImage = useRef(null);
  const resumeStage = useRef(null);
  const certificateDialog = useRef(null);
  const dragStart = useRef(null);
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

  const openResume = () => {
    const dialog = resumeDialog.current;
    const image = resumeThumbnail.current;
    if (!dialog || dialog.open || !image) return;

    const start = image.getBoundingClientRect();
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
      {
        duration: 480,
        easing: "cubic-bezier(0.2, 0.7, 0.2, 1)",
      },
    );
  };

  return (
    <section id="about">
      <h2>About me</h2>
      <div className="about">
        <Reveal delay={1} className="about-text">
          <p>{profile.about}</p>
          <a
            className="btn"
            href={`${import.meta.env.BASE_URL}${profile.resumeUrl}`}
            download={profile.resumeUrl}
          >
            Download Resume
          </a>
          <div className="certificates">
            <h3>My Certificates / Badges:</h3>
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
        </Reveal>
        <Reveal delay={2} className="about-resume">
          <button
            type="button"
            className="resume-preview"
            aria-label="Open resume in a zoomed view"
            onClick={openResume}
          >
            <img
              ref={resumeThumbnail}
              src={resumePreviewUrl}
              alt="Resume preview"
            />
          </button>
        </Reveal>
      </div>
      <dialog
        ref={resumeDialog}
        className="resume-viewer"
        aria-label="Resume preview"
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            resumeDialog.current?.close();
          }
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
              const dx =
                event.key === "ArrowLeft"
                  ? distance
                  : event.key === "ArrowRight"
                    ? -distance
                    : 0;
              const dy =
                event.key === "ArrowUp"
                  ? distance
                  : event.key === "ArrowDown"
                    ? -distance
                    : 0;
              setPan((current) => clampPan(current.x + dx, current.y + dy));
            }
          }}
          onPointerDown={(event) => {
            if (!zoomed || event.button !== 0) return;
            event.currentTarget.setPointerCapture(event.pointerId);
            dragStart.current = {
              x: event.clientX - pan.x,
              y: event.clientY - pan.y,
            };
          }}
          onPointerMove={(event) => {
            if (!dragStart.current) return;
            setPan(
              clampPan(
                event.clientX - dragStart.current.x,
                event.clientY - dragStart.current.y,
              ),
            );
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
            setPan((current) =>
              clampPan(
                current.x - event.deltaX,
                current.y - event.deltaY,
              ),
            );
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
