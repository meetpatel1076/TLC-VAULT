import React from "react";
import WarpText from "./WarpText";

const Header = () => {
  return (
    <main className=" bg-transparent">

      <div className="w-full px-10 pt-10">

        <WarpText
          text="TLC Vault"
          color="#f6f1e8"
          warpStrength={0.07}
          warpScale={1}
          speed={0.55}
          pointerInfluence={0.42}
          pointerStrength={0.38}
          refraction={0.018}
          ripple
          fontSize={140}
          fontWeight={800}
          style={{ height: "320px" }}
          fontFamily="MaskingRenta, sans-serif"
          letterSpacing="0.1em"
          lineHeight={0.91}
        />

      </div>

    </main>
  );
};

export default Header;