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
  return (
    <header>
      <div className="page">
        <nav aria-label="Main">
          <a className="brand" href="#top">
            <Mark />
            <span>{profile.brand}</span>
          </a>
          <ul>
            {nav.map(({ id, label }) => (
              <li key={id}>
                <a href={`#${id}`} aria-current={active === id ? "true" : "false"}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
