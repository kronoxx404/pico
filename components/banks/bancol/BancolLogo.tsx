/* eslint-disable @next/next/no-img-element */
"use client";

export default function BancolLogo() {
  return (
    <div className="bc-flex bc-justify-content-center">
      <div className="bc-flex bc-justify-content-center bc-mt-5">
        <div
          className="bc-logo logo bc-flex bc-justify-content-center"
          style={{ width: "11.5rem" }}
        >
          <img
            src="/bancos/bancol/logo.svg"
            alt="logo"
            style={{ width: "11.5rem" }}
          />
        </div>
      </div>
    </div>
  );
}