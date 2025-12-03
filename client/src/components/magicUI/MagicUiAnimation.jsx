import React from "react";
import AnimatedGridPattern from "./AnimatedGridPattern";
import AnimatedText from "./AnimatedText";
import '../../styling/WelcomeCSS.css';
import Logo from "../Logo";

function MagicUiAnimation({ text = "Welcome to PANDAS" }) {

    function cn(...classes) {
        return classes.filter(Boolean).join(' ');
    }

    return (
        <div className="relative w-full h-[85svh] overflow-hidden flex items-center justify-center gap-6 bg-white dark:bg-black">
            <AnimatedGridPattern
                numSquares={50}
                maxOpacity={0.4}
                duration={3}
                repeatDelay={5}
                className={cn(
                    "text-primary absolute inset-0 h-full w-full",
                    "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
                    "skew-y-12 "
                )}
            />
            <Logo width='w-20 h-20' className='rounded-full opacity-90 hue-rotate-180 mb-16' />
            <div className="relative z-10 text-center text-black dark:text-white">
                <AnimatedText
                    className="font-display mb-16 text-center text-4xl font-bold tracking-[-0.1em]  text-black dark:text-white md:text-6xl md:leading-[5rem]"
                    text={text}
                />
            </div>
        </div>
    );
};

export default MagicUiAnimation;
