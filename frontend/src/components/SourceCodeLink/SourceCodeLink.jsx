function SourceCodeLink({ left, right }) {
  const position = left ? "left" : right ? "right" : "";

  return (
    <ul className={`nav navbar-nav pull-xs-${position}`}>
      <li className="nav-item">
        <a
          className="nav-link"
          href="https://github.com/BBM480GradProj/full-stack"
        >
          <i className="ion-social-github"></i> Source code
        </a>
      </li>
    </ul>
  );
}

export default SourceCodeLink;
