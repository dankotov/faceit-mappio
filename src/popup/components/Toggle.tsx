/* eslint react/react-in-jsx-scope: 0 jsx-a11y/label-has-associated-control: 0 */
import colors from "../../shared/theme";

const Toggle = ({
  isToggled,
  onToggle,
}: {
  isToggled: boolean;
  onToggle: () => void;
}) => (
  <>
    <label>
      <input type="checkbox" checked={isToggled} onChange={onToggle} />
      <span className="slider" />
    </label>

    <style jsx>{`
      label {
        position: relative;
        display: inline-block;
        width: 55px;
        height: 24px;
      }

      label > input {
        opacity: 0;
        width: 0;
        height: 0;
      }

      .slider {
        position: absolute;
        cursor: pointer;

        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: 23px;

        background-color: ${colors.backgrey};
        transition: 0.4s ease-in-out;
      }

      .slider::before {
        box-sizing: border-box;
        position: absolute;
        content: "";

        height: 17px;
        width: 17px;
        top: 50%;
        transform: translate(6px, -50%);
        border-radius: 50%;

        background-color: ${colors.forewhite};
        transition: 0.4s ease-in-out;
      }

      input:checked + .slider {
        background-color: ${colors.faceitgreen};
      }
      input:checked + .slider::before {
        top: 50%;
        transform: translate(33px, -50%);
      }
    `}</style>
  </>
);

export default Toggle;
