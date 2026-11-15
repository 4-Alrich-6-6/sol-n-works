import { caseStudies } from "../data.js";
import Reveal from "./Reveal.jsx";

export default function CaseStudy() {
  return (
    <section id="case-study">
      <h2>Case Study</h2>
      <div className="cases">
        {caseStudies.map((c, i) => (
          <Reveal key={i} as="article" className="case" delay={i}>
            <div className="case-copy">
              <h3>{c.title}</h3>
              <p>{c.text}</p>
              {c.link && <a href={c.link} target="_blank" rel="noreferrer">Read the case study</a>}
            </div>
            <div className="case-media">
              <iframe
                className="case-slides"
                src={c.slidesUrl}
                title={`${c.title} presentation`}
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
              <a
                className="btn case-download"
                href={`${import.meta.env.BASE_URL}${c.pdfUrl}`}
                download
              >
                Download (.pdf)
              </a>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
