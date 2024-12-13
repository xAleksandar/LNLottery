const AnimatedCheckmark = () => (
  <div>
    <div className="animated-checkmark"></div>
    <style jsx>{`
      .animated-checkmark {
        display: inline-block;
        width: 24px;
        height: 24px;
        border: solid 3px #33ff77;
        border-radius: 50%;
        position: relative;
        animation: scaleUp 0.5s ease-out;
      }
      .animated-checkmark::after {
        content: "";
        position: absolute;
        top: 50%;
        left: 25%;
        width: 6px;
        height: 12px;
        border: solid #33ff77;
        border-width: 0 3px 3px 0;
        transform: rotate(45deg) translate(-50%, -50%);
        animation: drawCheckmark 0.3s ease-out 0.2s forwards;
        opacity: 0;
      }
      @keyframes scaleUp {
        from {
          transform: scale(0);
        }
        to {
          transform: scale(1);
        }
      }
      @keyframes drawCheckmark {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
    `}</style>
  </div>
);

export default AnimatedCheckmark;
