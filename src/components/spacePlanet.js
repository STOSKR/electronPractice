import React, { useEffect } from 'react';

const Space = () => {
    useEffect(() => {
        const script = document.createElement('script');
        script.type = 'module';
        script.src = 'https://unpkg.com/@splinetool/viewer@1.6.8/build/spline-viewer.js';
        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
        };
    }, []);

    return (
        <>
            <spline-viewer url="https://prod.spline.design/TWk6e2ifRdOuunHz/scene.splinecode"></spline-viewer>
            <style jsx>{`
        spline-viewer {
            display: block;
            width: 100%;
            height: 100vh; /* Ajusta la altura según sea necesario */
        }
        `}</style>
        </>
    );
};

export default Space;
