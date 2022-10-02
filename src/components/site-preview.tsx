import Image from "next/image";
import React from "react";
import { _SiteData } from "../types/_site";

const SitePreview = ({ data }: { data: _SiteData }) => {
  return (
    <div className="h-screen overflow-y-auto bg-black">
      <div className="mx-auto max-w-2xl">
        <div className="mb-2 flex w-full items-center justify-center overflow-hidden rounded-full">
          {data.profileImage && (
            <Image
              width={190}
              height={190}
              src={data.profileImage}
              alt="profile"
            />
          )}
        </div>
        <h1 className="mb-4 text-center text-2xl text-white">
          {data.profileTitle}
        </h1>
        <div className=" px-8">
          {data.links.map((link) => {
            return (
              <button
                className="mb-4 flex w-full items-center justify-center rounded-lg border  border-white p-4"
                onClick={() => window.open(link.to, "_blank")}
                key={link.id}
              >
                {link.icon && (
                  <Image src={link.icon} alt={link.title + " icon"} />
                )}
                <div className="font-sans text-base text-white">
                  {link.title}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SitePreview;
