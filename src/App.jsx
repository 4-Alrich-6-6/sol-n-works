import { nav } from "./data.js";
import useActiveSection from "./hooks/useActiveSection.js";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import About from "./components/About.jsx";
import Projects from "./components/Projects.jsx";
import CaseStudy from "./components/CaseStudy.jsx";
import Footer from "./components/Footer.jsx";

export default function App() {
  const active = useActiveSection(nav.map((n) => n.id));

  return (
    <>
      <Header active={active} />
      <main id="top" className="page">
        <Hero />
        <About />
        <Projects />
        <CaseStudy />
      </main>
      <Footer />
    </>
  );
}
