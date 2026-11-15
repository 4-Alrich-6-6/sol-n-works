import { profile } from "../data.js";

export default function Hero() {
  return (
    <section id="home" className="hero">
      <div className="hero-inner">
        <div className="hero-copy">
          <h1>{profile.headline}</h1>
          <p>{profile.intro}</p>
          <div className="actions">
            <a className="btn primary" href="#projects">See my works</a>
            <a className="btn" href="#contact">Get in touch</a>
          </div>
        </div>

        <div className="hero-photo">
          <img src={`${import.meta.env.BASE_URL}${profile.photo}`} alt={profile.name} />
        </div>
      </div>
    </section>
  );
}
