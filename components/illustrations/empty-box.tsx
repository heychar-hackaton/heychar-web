import type React from "react"

type EmptyBoxProps = {
    width?: string | number
    height?: string | number
    className?: string
}

export const EmptyBox: React.FC<EmptyBoxProps> = ({
    width = 161,
    height = 160,
    className = "",
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
            <title>Empty box illustration</title>
            <path
                d="M42.3936 130.312L77.7025 119.248V73.8867L42.3936 84.8654V130.312Z"
                fill="#D5DAE5"
            />
            <path
                d="M113.012 130.312L77.7026 119.248V73.8867L113.012 84.8654V130.312Z"
                fill="#F1F3FA"
            />
            <path
                d="M113.012 130.312L77.7026 119.248V73.8867L113.012 84.8654V130.312Z"
                fill="#AAB2C5"
                opacity="0.6"
            />
            <g opacity="0.13">
                <path
                    d="M42.3936 130.312L77.7025 119.248V73.8867L42.3936 84.8654V130.312Z"
                    fill="url(#paint0_linear_6007_2268)"
                />
                <path
                    d="M113.011 130.312L77.7025 119.248V73.8867L113.011 84.8654V130.312Z"
                    fill="url(#paint1_linear_6007_2268)"
                />
            </g>
            <path
                d="M77.7025 141.461L42.3936 130.397V85.0356L77.7025 96.0995V141.461Z"
                fill="#F1F3FA"
            />
            <path
                d="M77.7026 141.461L113.012 130.397V85.0356L77.7026 96.0995V141.461Z"
                fill="#D5DAE5"
            />
            <path
                d="M69.7025 133.461L42.3936 130.397V85.0356L77.7025 96.0995L69.7025 133.461Z"
                fill="url(#paint2_linear_6007_2268)"
                opacity="0.09"
            />
            <path
                d="M85.7026 125.461L113.012 130.397V85.0356L77.7026 96.0995L85.7026 125.461Z"
                fill="url(#paint3_linear_6007_2268)"
                opacity="0.2"
            />
            <path
                d="M77.7026 73.8867L61.1015 61.4612L25.2026 73.5463L42.3936 84.8654L77.7026 73.8867Z"
                fill="#D5DAE5"
            />
            <path
                d="M77.7026 73.8867L94.3038 61.4612L130.203 73.5463L113.012 84.8654L77.7026 73.8867Z"
                fill="#D5DAE5"
            />
            <path
                d="M42.3936 85.0356L77.7026 96.0995L60.0903 107.334L25.2026 95.759L42.3936 85.0356Z"
                fill="#F1F3FA"
            />
            <path
                d="M113.012 85.0356L77.7026 96.0995L95.315 107.334L130.203 95.759L113.012 85.0356Z"
                fill="#F1F3FA"
            />
            <path
                d="M87.5541 30.338C92.5007 43.7624 93.9751 46.7452 94.459 59.9731C94.273 62.9926 94.1576 66.276 92.734 68.9199C90.8329 72.9643 86.1828 75.7653 81.7895 75.8107C77.2636 75.8916 72.8265 73.1204 70.8293 68.8473C69.4242 66.254 69.4689 62.7067 71.3963 60.3522C73.4916 58.094 77.1778 57.531 79.8295 58.942C82.7464 60.2819 84.4874 63.0681 85.1323 66.0064C85.7772 68.9448 85.4938 72.1317 84.7067 75.0294C83.0604 82.0768 81.6969 82.4178 77.6596 94.3495"
                stroke="#AAB2C5"
                strokeDasharray="4 4"
                strokeMiterlimit="10"
                strokeWidth="2"
            />
            <path
                d="M93.5743 23.2325C93.5628 25.2065 91.7258 26.4152 89.3963 25.7849C86.9436 25.3668 85.2076 24.9359 85.0959 23.1741C85.1521 21.3673 87.1234 20.6601 89.4308 19.863C92.1973 18.7636 93.4178 21.3035 93.5743 23.2325Z"
                fill="#D5DAE5"
            />
            <path
                d="M77.7253 29.2689C78.9683 30.5485 81.589 30.9216 82.8661 28.967C84.2665 26.8003 85.4651 25.225 84.1773 23.7782C82.9343 22.4986 81.7245 23.3601 78.958 24.4594C76.7402 25.5909 76.2695 27.8671 77.7253 29.2689Z"
                fill="#D5DAE5"
            />
            <path
                d="M83.4609 21.1036C84.5922 20.6214 85.9474 20.9751 86.552 21.8882C86.8096 22.1776 87.1119 22.6341 87.2015 22.9685C88.1644 25.219 87.8616 27.4502 86.5624 27.9773C85.1398 28.7167 83.18 27.4498 82.4299 25.3215C82.2508 24.6528 82.1613 24.3184 82.0269 23.8169C81.8815 22.6016 82.3297 21.5857 83.4609 21.1036C83.6289 21.0586 83.4609 21.1036 83.4609 21.1036Z"
                fill="#AAB2C5"
            />
            <path
                d="M31.4599 57.3314H29.2699V55.1414H27.3927V57.3314H25.2026V59.2712H27.3927V61.4612H29.2699V59.2712H31.4599V57.3314Z"
                fill="url(#paint4_linear_6007_2268)"
            />
            <path
                d="M36.2704 112.279H34.0804V110.089H32.2032V112.279H30.0132V114.218H32.2032V116.408H34.0804V114.218H36.2704V112.279Z"
                fill="url(#paint5_linear_6007_2268)"
            />
            <path
                d="M132.008 112.403L129.329 111.05L130.682 108.37L128.385 107.211L127.032 109.89L124.352 108.537L123.154 110.911L125.834 112.263L124.481 114.943L126.778 116.103L128.131 113.423L130.81 114.776L132.008 112.403Z"
                fill="url(#paint6_linear_6007_2268)"
            />
            <defs>
                <linearGradient
                    gradientUnits="userSpaceOnUse"
                    id="paint0_linear_6007_2268"
                    x1="66.5563"
                    x2="61.7403"
                    y1="77.172"
                    y2="97.2218"
                >
                    <stop
                        offset="0.00289017"
                        stopColor="#606673"
                        stopOpacity="0"
                    />
                    <stop offset="1" stopColor="#373C47" />
                </linearGradient>
                <linearGradient
                    gradientUnits="userSpaceOnUse"
                    id="paint1_linear_6007_2268"
                    x1="66.5563"
                    x2="61.7403"
                    y1="77.172"
                    y2="97.2218"
                >
                    <stop
                        offset="0.00289017"
                        stopColor="#606673"
                        stopOpacity="0"
                    />
                    <stop offset="1" stopColor="#373C47" />
                </linearGradient>
                <linearGradient
                    gradientUnits="userSpaceOnUse"
                    id="paint2_linear_6007_2268"
                    x1="50.3096"
                    x2="58.7922"
                    y1="116.081"
                    y2="92.1228"
                >
                    <stop
                        offset="0.00289017"
                        stopColor="#6C80AA"
                        stopOpacity="0"
                    />
                    <stop offset="1" stopColor="#5D6A86" />
                </linearGradient>
                <linearGradient
                    gradientUnits="userSpaceOnUse"
                    id="paint3_linear_6007_2268"
                    x1="96.7584"
                    x2="97.4255"
                    y1="122.625"
                    y2="92.2228"
                >
                    <stop
                        offset="0.00289017"
                        stopColor="#314F91"
                        stopOpacity="0"
                    />
                    <stop offset="1" stopColor="#324264" />
                </linearGradient>
                <linearGradient
                    gradientUnits="userSpaceOnUse"
                    id="paint4_linear_6007_2268"
                    x1="28.3318"
                    x2="28.3318"
                    y1="55.3609"
                    y2="58.9082"
                >
                    <stop stopColor="#B0BACC" />
                    <stop offset="1" stopColor="#969EAE" />
                </linearGradient>
                <linearGradient
                    gradientUnits="userSpaceOnUse"
                    id="paint5_linear_6007_2268"
                    x1="33.1423"
                    x2="33.1423"
                    y1="110.308"
                    y2="113.855"
                >
                    <stop stopColor="#B0BACC" />
                    <stop offset="1" stopColor="#969EAE" />
                </linearGradient>
                <linearGradient
                    gradientUnits="userSpaceOnUse"
                    id="paint6_linear_6007_2268"
                    x1="129.398"
                    x2="127.207"
                    y1="108.059"
                    y2="112.399"
                >
                    <stop stopColor="#B0BACC" />
                    <stop offset="1" stopColor="#969EAE" />
                </linearGradient>
            </defs>
        </svg>
    )
}

export default EmptyBox
