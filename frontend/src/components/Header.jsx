import React from "react";
import WarpText from "./WarpText";

const Header = () => {
  return (
    <main className=" bg-transparent">

      <div className="w-full px-10 pt-10">

        <WarpText
          text="TLC VAULT"
          color="#f8f5ff"
          warpStrength={0.07}
          warpScale={1}
          speed={0.55}
          pointerInfluence={0.42}
          pointerStrength={0.38}
          refraction={0.018}
          ripple
          fontSize={160}
          fontWeight={800}
          style={{ height: "320px" }}
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          letterSpacing="-0.0001em"
          lineHeight={0.91}
        />

      </div>

    </main>
  );
};

export default Header;