import colors from "../../shared/theme";

const Loading = () => (
  <>
    <div className="loader">
      <div className="loader-dot"></div>
      <div className="loader-dot"></div>
      <div className="loader-dot"></div>
      <div className="loader-dot"></div>
    </div>

    <style jsx>{`
      .loader {
        width: 55px;
        height: 24px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .loader .loader-dot {
        width: 11px;
        height: 11px;
        border-radius: 50%;
        display: inline-block;
        background-color: white;
        transform: scale(0.4);
        animation: loadot 0.6s infinite;
      }

      .loader-dot:nth-child(2) {
        animation-delay: 0.3s;
      }
      .loader-dot:nth-child(4) {
        animation-delay: 0.3s;
      }

      @keyframes loadot {
        0%,
        100% {
          transform: scale(0.4);
        }
        50% {
          transform: scale(1);
          background-color: ${colors.faceitorange};
        }
      }
    `}</style>
  </>
);

export default Loading;
