import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section>
      <h1>Hi, I'm Scott Webster, a computer science student and developer</h1>
      <p>
        I'm working on building up my experience and skills, but have already
        progressed far.
      </p>

      <Link to="/projects">
        <button>View My Projects</button>
      </Link>
      <p></p>
      <Link to="/skills">
        <button>View My Skills</button>
      </Link>
      <p></p>
      <Link to="/contact">
        <button>Contact Me</button>
      </Link>
    </section>
  );
}
