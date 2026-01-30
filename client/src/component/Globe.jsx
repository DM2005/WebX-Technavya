import React, { useRef, useEffect } from "react";
import Globe from "react-globe.gl";

const CloudGlobe = () => {
  const globeRef = useRef();

  useEffect(() => {
    const interval = setInterval(() => {
      const controls = globeRef.current?.controls?.();
      if (controls) {
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.8;
        controls.enableZoom = false;
        clearInterval(interval);
      }
    }, 100);
  }, []);

  return (
    <div className="h-full w-full">
      <Globe
        ref={globeRef}
        globeImageUrl="https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg"


        // backgroundImageUrl="https://unpkg.com/three-globe/example/img/night-sky.png"
        showAtmosphere={true}
        atmosphereColor="lightgreen"
        atmosphereAltitude={0.10}
      />
    </div>
  );
};

export default CloudGlobe;
