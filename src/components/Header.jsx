import { useState } from "react";
import { nav, profile } from "../data.js";

function Mark() {
  return (
    <svg className="mark" viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <mask id="crescent-cut">
          <rect width="24" height="24" fill="#fff" />
          <circle cx="8.5" cy="15.5" r="8" fill="#000" />
        </mask>
      </defs>
      <circle cx="12.5" cy="11.5" r="9" fill="var(--accent)" mask="url(#crescent-cut)" />
    </svg>
  );
}

export default function Header({ active }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header>
      <div className="page">
        <nav className="site-navigation" aria-label="Main">
          <a className="brand" href="#top">
            <Mark />
            <span>{profile.brand}</span>
          </a>
          <button
            type="button"
            className="menu-toggle"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            aria-controls="primary-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
          <ul id="primary-navigation" className={menuOpen ? "is-open" : ""}>
            {nav.filter(({ id }) => id !== "contact").map(({ id, label }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  aria-current={active === id ? "true" : "false"}
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      {menuOpen && (
        <button
          type="button"
          className="menu-backdrop"
          aria-label="Close navigation menu"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </header>
  );
}
