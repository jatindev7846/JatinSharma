export default function Footer() {
  const words = ["Jatin", "Sharma"];
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__mark" data-split aria-hidden="true">
          {words.map((w, wi) => (
            <span className="footer__word" key={w}>
              {[...w].map((c, i) => (
                <span className="w" key={i}>
                  <span className="wi" style={{ "--i": wi * 5 + i, "--step": "45ms" }}>
                    {c}
                  </span>
                </span>
              ))}
            </span>
          ))}
        </div>
        <div className="footer__in">
          <p>© {new Date().getFullYear()} Jatin Sharma · React Native developer</p>
          <a href="#top">Back to top ↑</a>
        </div>
      </div>
    </footer>
  );
}
