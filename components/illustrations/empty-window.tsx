import type React from 'react';

type EmptyWindowProps = {
  width?: string | number;
  height?: string | number;
  className?: string;
};

export const EmptyWindow: React.FC<EmptyWindowProps> = ({
  width = 161,
  height = 160,
  className = '',
}) => {
  return (
    <svg
      className={className}
      fill="none"
      height={height}
      viewBox="0 0 161 160"
      width={width}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Empty window illustration</title>
      <path
        d="M77.9026 132.32C105.903 132.32 128.603 109.62 128.603 81.5197C128.603 53.4197 105.803 30.7197 77.9026 30.7197C49.9026 30.7197 27.2026 53.4197 27.2026 81.5197C27.2026 109.62 49.9026 132.32 77.9026 132.32Z"
        fill="#F5F6FA"
      />
      <g filter="url(#filter0_dd_6006_1061)">
        <path
          d="M126.214 54.8363V113.674C126.214 115.4 124.775 116.839 123.049 116.839H33.6414C31.9151 116.911 30.4766 115.472 30.4766 113.746V54.8363C30.4766 53.038 31.9151 51.6714 33.6414 51.6714H123.049C124.847 51.6714 126.214 53.11 126.214 54.8363Z"
          fill="url(#paint0_linear_6006_1061)"
        />
      </g>
      <path
        d="M126.214 54.8363V59.3678H30.4766V54.8363C30.4766 53.038 31.9151 51.6714 33.6414 51.6714H123.049C124.847 51.6714 126.214 53.11 126.214 54.8363Z"
        fill="url(#paint1_linear_6006_1061)"
      />
      <path
        d="M65.1462 82.1694C66.6161 82.1694 67.8076 80.9779 67.8076 79.508C67.8076 78.0382 66.6161 76.8467 65.1462 76.8467C63.6764 76.8467 62.4849 78.0382 62.4849 79.508C62.4849 80.9779 63.6764 82.1694 65.1462 82.1694Z"
        fill="#989FB0"
      />
      <path
        d="M91.6159 82.1694C93.0858 82.1694 94.2773 80.9779 94.2773 79.508C94.2773 78.0382 93.0858 76.8467 91.6159 76.8467C90.1461 76.8467 88.9546 78.0382 88.9546 79.508C88.9546 80.9779 90.1461 82.1694 91.6159 82.1694Z"
        fill="#989FB0"
      />
      <path
        d="M82.6969 99.6477H74.3531C73.0584 99.6477 71.9795 98.5688 71.9795 97.274C71.9795 95.9793 73.0584 94.9004 74.3531 94.9004H82.6249C83.9197 94.9004 84.9986 95.9793 84.9986 97.274C85.0705 98.5688 83.9916 99.6477 82.6969 99.6477Z"
        fill="#989FB0"
      />
      <path
        d="M34.7203 56.8502C35.3162 56.8502 35.7992 56.3672 35.7992 55.7713C35.7992 55.1754 35.3162 54.6924 34.7203 54.6924C34.1244 54.6924 33.6414 55.1754 33.6414 55.7713C33.6414 56.3672 34.1244 56.8502 34.7203 56.8502Z"
        fill="#E8EBF3"
      />
      <path
        d="M38.1009 56.8502C38.6968 56.8502 39.1798 56.3672 39.1798 55.7713C39.1798 55.1754 38.6968 54.6924 38.1009 54.6924C37.505 54.6924 37.022 55.1754 37.022 55.7713C37.022 56.3672 37.505 56.8502 38.1009 56.8502Z"
        fill="#E8EBF3"
      />
      <path
        d="M41.5535 56.8502C42.1494 56.8502 42.6325 56.3672 42.6325 55.7713C42.6325 55.1754 42.1494 54.6924 41.5535 54.6924C40.9577 54.6924 40.4746 55.1754 40.4746 55.7713C40.4746 56.3672 40.9577 56.8502 41.5535 56.8502Z"
        fill="#E8EBF3"
      />
      <path
        d="M122.33 44.0471C121.61 44.0471 121.035 43.4717 121.035 42.7524V28.2947C121.035 27.5754 121.61 27 122.33 27C123.049 27 123.624 27.5754 123.624 28.2947V42.7524C123.624 43.4717 123.049 44.0471 122.33 44.0471Z"
        fill="#989FB0"
      />
      <path
        d="M132.831 55.1243C132.831 54.405 133.406 53.8296 134.126 53.8296H148.583C149.303 53.8296 149.878 54.405 149.878 55.1243C149.878 55.8436 149.303 56.419 148.583 56.419H134.126C133.406 56.419 132.831 55.8436 132.831 55.1243Z"
        fill="#989FB0"
      />
      <path
        d="M131.68 45.7732C131.177 45.2697 131.177 44.4065 131.68 43.903L141.966 33.6891C142.47 33.1856 143.333 33.1856 143.836 33.6891C144.34 34.1926 144.34 35.0558 143.836 35.5593L133.622 45.7732C133.047 46.2767 132.184 46.2767 131.68 45.7732Z"
        fill="#989FB0"
      />
      <defs>
        <filter
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
          height="83.1699"
          id="filter0_dd_6006_1061"
          width="113.737"
          x="21.4766"
          y="46.6714"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            result="hardAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="4.5" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.397708 0 0 0 0 0.47749 0 0 0 0 0.575 0 0 0 0.15 0"
          />
          <feBlend
            in2="BackgroundImageFix"
            mode="normal"
            result="effect1_dropShadow_6006_1061"
          />
          <feColorMatrix
            in="SourceAlpha"
            result="hardAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset dy="1" />
          <feGaussianBlur stdDeviation="0.5" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.03 0"
          />
          <feBlend
            in2="effect1_dropShadow_6006_1061"
            mode="normal"
            result="effect2_dropShadow_6006_1061"
          />
          <feBlend
            in="SourceGraphic"
            in2="effect2_dropShadow_6006_1061"
            mode="normal"
            result="shape"
          />
        </filter>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id="paint0_linear_6006_1061"
          x1="78.3139"
          x2="78.3139"
          y1="50.1639"
          y2="117.544"
        >
          <stop stopColor="#FDFEFF" />
          <stop offset="0.9964" stopColor="#ECF0F5" />
        </linearGradient>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id="paint1_linear_6006_1061"
          x1="78.3527"
          x2="78.3527"
          y1="51.9387"
          y2="56.2586"
        >
          <stop stopColor="#B0BACC" />
          <stop offset="1" stopColor="#969EAE" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default EmptyWindow;
