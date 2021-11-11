import { IconDefinition } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tippy, { TippyProps } from '@tippyjs/react';
import cn from 'classnames';
import { MouseEvent, ReactNode } from 'react';

export interface ButtonProps {
  type?: 'button' | 'submit';
  size?: 'small' | 'normal' | 'large';
  theme?: 'outline' | 'link';
  startIcon?: IconDefinition;
  endIcon?: IconDefinition;
  classNames?: string;
  disabled?: boolean;
  tippyOptions?: TippyProps;
  onClick?: (event: MouseEvent) => void;
  children?: ReactNode;
}

export default function Button({
  type = 'button',
  size = 'normal',
  theme = 'outline',
  startIcon,
  endIcon,
  classNames = '',
  disabled = false,
  tippyOptions,
  onClick,
  children,
}: ButtonProps) {
  // set button content
  const buttonContent = [];

  if (startIcon) {
    buttonContent.push(
      <span key="start-icon" className={size === 'large' ? 'mr-2.5' : 'mr-2'}>
        <FontAwesomeIcon icon={startIcon} />
      </span>
    );
  }

  buttonContent.push(
    <span key="content" className="select-none">
      {children}
    </span>
  );

  if (endIcon) {
    buttonContent.push(
      <span key="end-icon" className={size === 'large' ? 'ml-2.5' : 'ml-2'}>
        <FontAwesomeIcon icon={endIcon} />
      </span>
    );
  }

  // set button classes

  const buttonSize = {
    small: 'px-3 py-2.5 text-sm',
    normal: 'px-5 py-4 text-base',
    large: 'px-6 py-5 text-xl',
  };

  const buttonTheme = {
    outline:
      'border-2 border-gray-900 shadow-hard active:shadow-none hover:underline focus:underline focus:outline-none disabled:opacity-50 disabled:pointer-events-none',
    link: 'focus:outline-none hover:underline disabled:opacity-20',
  };

  const button = (
    <button
      // eslint-disable-next-line react/button-has-type
      type={type}
      className={cn(
        `inline-flex flex-nowrap items-center leading-none font-semibold transition duration-150 ease-in-out ${buttonSize[size]} ${buttonTheme[theme]} ${classNames}`
      )}
      disabled={disabled}
      onClick={onClick}
    >
      {buttonContent}
    </button>
  );

  if (tippyOptions) {
    // disabled elements need to be wrapped in order for Tippy to work
    // accesibility issues. see: https://atomiks.github.io/tippyjs/v6/constructor/#disabled-elements
    return (
      // eslint-disable-next-line react/jsx-props-no-spreading
      <Tippy {...tippyOptions}>
        {disabled ? (
          <span tabIndex={0} className="focus:outline-none">
            {button}
          </span>
        ) : (
          button
        )}
      </Tippy>
    );
  }

  return button;
}
