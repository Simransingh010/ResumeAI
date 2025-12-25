"use client";

import React, { useContext } from "react";
import { handleSocialMedia } from "../units/handleSocialMedia";
import { ResumeContext } from "../../../../ResumeBuilder";
import { BsTrash3 } from "react-icons/bs";
import { removeSocialMedia } from "../units/removeSocialMedia";
import { SocialMedia as SocialMediaType } from "@/types/resume";

interface SocialMediaProps {
  socialMedia: SocialMediaType;
  index: number;
}

const SocialMedia = ({ socialMedia, index }: SocialMediaProps) => {
  const { resumeData, setResumeData } = useContext(ResumeContext);

  return (
    <div className="flex w-fill gap-5 items-top">
      <div className="flex-wrap-gap-2">
        <input
          type="text"
          placeholder="Social Media"
          name="socialMedia"
          className="w-full mb-0 other-input"
          value={socialMedia.socialMedia}
          onChange={(e) =>
            handleSocialMedia(resumeData, setResumeData, e, index)
          }
        />
        <input
          type="text"
          placeholder="Link"
          name="link"
          className="w-full mb-0 other-input"
          value={socialMedia.link}
          onChange={(e) =>
            handleSocialMedia(resumeData, setResumeData, e, index)
          }
        />
      </div>
      <button
        type="button"
        onClick={() => {
          removeSocialMedia(resumeData, setResumeData, index);
        }}
        aria-label="Remove"
        className="p-2 text-white h-fit bg-red-600 dark:bg-red-500 rounded text-xl hover:bg-red-700 dark:hover:bg-red-600 transition-colors"
      >
        <BsTrash3 />
      </button>
    </div>
  );
};

export default SocialMedia;
