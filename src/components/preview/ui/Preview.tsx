"use client";

import React, { useContext } from "react";
import Image from "next/image";
import { ResumeContext } from "../../ResumeBuilder";
import DateRange from "../../utility/DateRange";

const Preview = () => {
  const { resumeData } = useContext(ResumeContext);

  if (!resumeData) {
    return <div className="preview bg-white p-8 max-w-[8.5in] mx-auto">Loading...</div>;
  }

  return (
    <div className="preview bg-white text-black p-8 max-w-[8.5in] mx-auto rm-padding-print shadow-lg rounded-lg">
      <div className="resume-content bg-white text-black">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-2">
            {resumeData.profilePicture && (
              <Image
                src={resumeData.profilePicture}
                alt="Profile"
                width={80}
                height={80}
                className="w-20 h-20 rounded-full object-cover"
                unoptimized
              />
            )}
            <div>
              <h1 className="name text-2xl font-bold text-black">{resumeData.name}</h1>
              <p className="profession text-lg text-gray-700">{resumeData.position}</p>
            </div>
          </div>
          <div className="contact text-sm text-gray-600 flex flex-wrap gap-3">
            {resumeData.contactInformation && (
              <a
                href={`tel:${resumeData.contactInformation.replace(/[^0-9+]/g, '')}`}
                className="text-gray-600 hover:text-fuchsia-600 transition-colors"
              >
                {resumeData.contactInformation}
              </a>
            )}
            {resumeData.email && (
              <a
                href={`mailto:${resumeData.email}`}
                className="text-gray-600 hover:text-fuchsia-600 transition-colors"
              >
                {resumeData.email}
              </a>
            )}
            {resumeData.address && <span>{resumeData.address}</span>}
          </div>
          {resumeData.socialMedia && resumeData.socialMedia.length > 0 && (
            <div className="social-media text-xs text-gray-600 flex flex-wrap gap-3 mt-2">
              {resumeData.socialMedia.map((social, index) => (
                <span key={index}>
                  {social.socialMedia}:{" "}
                  <a
                    href={social.link.startsWith('http') ? social.link : `https://${social.link}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-fuchsia-600 transition-colors underline"
                  >
                    {social.link}
                  </a>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Summary */}
        {resumeData.summary && (
          <div className="mb-6">
            <h2 className="section-title text-lg font-bold border-b-2 border-black mb-2 text-black">
              SUMMARY
            </h2>
            <p className="content text-sm text-gray-800">{resumeData.summary}</p>
          </div>
        )}

        {/* Work Experience */}
        {resumeData.workExperience && resumeData.workExperience.length > 0 && (
          <div className="mb-6">
            <h2 className="section-title text-lg font-bold border-b-2 border-black mb-2 text-black">
              WORK EXPERIENCE
            </h2>
            {resumeData.workExperience.map((work, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="content font-bold text-black">{work.position}</h3>
                    <p className="content text-gray-700">{work.company}</p>
                  </div>
                  <DateRange
                    startYear={work.startYear}
                    endYear={work.endYear}
                  />
                </div>
                {work.description && (
                  <p className="sub-content text-xs mt-1 text-gray-700">{work.description}</p>
                )}
                {work.keyAchievements && (
                  <ul className="ul-padding list-disc mt-2">
                    {work.keyAchievements.split("\n").map((achievement, i) => (
                      <li key={i} className="sub-content text-xs text-gray-700">
                        {achievement}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {resumeData.projects && resumeData.projects.length > 0 && (
          <div className="mb-6">
            <h2 className="section-title text-lg font-bold border-b-2 border-black mb-2 text-black">
              PROJECTS
            </h2>
            {resumeData.projects.map((project, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between items-start">
                  <h3 className="content font-bold text-black">{project.title}</h3>
                  <DateRange
                    startYear={project.startYear}
                    endYear={project.endYear}
                  />
                </div>
                {project.description && (
                  <p className="sub-content text-xs mt-1 text-gray-700">
                    {project.description}
                  </p>
                )}
                {project.keyAchievements && (
                  <ul className="ul-padding list-disc mt-2">
                    {project.keyAchievements
                      .split("\n")
                      .map((achievement, i) => (
                        <li key={i} className="sub-content text-xs text-gray-700">
                          {achievement}
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {resumeData.education && resumeData.education.length > 0 && (
          <div className="mb-6">
            <h2 className="section-title text-lg font-bold border-b-2 border-black mb-2 text-black">
              EDUCATION
            </h2>
            {resumeData.education.map((edu, index) => (
              <div key={index} className="mb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="content font-bold text-black">{edu.school}</h3>
                    <p className="sub-content text-xs text-gray-700">{edu.degree}</p>
                  </div>
                  <DateRange startYear={edu.startYear} endYear={edu.endYear} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {resumeData.skills && resumeData.skills.length > 0 && (
          <div className="mb-6">
            <h2 className="section-title text-lg font-bold border-b-2 border-black mb-2 text-black">
              SKILLS
            </h2>
            {resumeData.skills.map((skillGroup, index) => (
              <div key={index} className="mb-2">
                <h3 className="content font-bold text-black">{skillGroup.title}</h3>
                <p className="sub-content text-xs text-gray-700">
                  {skillGroup.skills.join(", ")}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Languages */}
        {resumeData.languages && resumeData.languages.length > 0 && (
          <div className="mb-6">
            <h2 className="section-title text-lg font-bold border-b-2 border-black mb-2 text-black">
              LANGUAGES
            </h2>
            <p className="content text-sm text-gray-800">{resumeData.languages.join(", ")}</p>
          </div>
        )}

        {/* Certifications */}
        {resumeData.certifications && resumeData.certifications.length > 0 && (
          <div className="mb-6">
            <h2 className="section-title text-lg font-bold border-b-2 border-black mb-2 text-black">
              CERTIFICATIONS
            </h2>
            <ul className="ul-padding list-disc">
              {resumeData.certifications.map((cert, index) => (
                <li key={index} className="content text-sm text-gray-800">
                  {cert}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Preview;
