import type { AnalysisResult } from "@/app/analyze/page";

interface Props {
  result: AnalysisResult;
}

export default function AnalysisResults({ result }: Props) {
  const getGrade = () => {
    if (result.score >= 80) return { letter: 'A', color: 'text-green-600' };
    if (result.score >= 60) return { letter: 'B', color: 'text-blue-600' };
    if (result.score >= 40) return { letter: 'C', color: 'text-orange-600' };
    return { letter: 'D', color: 'text-red-600' };
  };

  const grade = getGrade();

  return (
    <div className="space-y-12">
      {/* Score Header - Clean and Bold */}
      <div className="text-center py-12 border-b-2 border-gray-200 dark:border-gray-700">
        <h1 className="text-7xl font-black mb-6 text-gray-900 dark:text-gray-100">
          Your Resume Scored a <span className={grade.color}>{grade.letter}</span>
        </h1>
        <p className="text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
          {result.score >= 80
            ? "Excellent work! Your resume is well-optimized and ready to impress recruiters."
            : result.score >= 60
              ? "You're on the right track, but your resume could use some tuning up. Review our analysis below to take it to the next level."
              : result.score >= 40
                ? "Your resume needs significant improvement. Focus on the recommendations below to boost your score."
                : "Your resume requires major revisions. Follow our detailed feedback to make it competitive."}
        </p>

        {/* Simple Score Display */}
        <div className="mt-8 inline-block">
          <div className="text-8xl font-black text-gray-900 dark:text-gray-100">{result.score}</div>
          <div className="text-xl text-gray-500 dark:text-gray-400 font-semibold">out of 100</div>
        </div>
      </div>

      {/* Section Scores - Minimal Cards */}
      {result.sections && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {result.sections.documentSynopsis && (
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700">
              <div className="text-5xl font-black text-gray-900 dark:text-gray-100 mb-3">{result.sections.documentSynopsis.score}</div>
              <div className="text-base font-bold text-gray-600 dark:text-gray-400">Document Quality</div>
            </div>
          )}
          {result.sections.dataIdentification && (
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700">
              <div className="text-5xl font-black text-gray-900 dark:text-gray-100 mb-3">{result.sections.dataIdentification.score}</div>
              <div className="text-base font-bold text-gray-600 dark:text-gray-400">Contact Info</div>
            </div>
          )}
          {result.sections.lexicalAnalysis && (
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700">
              <div className="text-5xl font-black text-gray-900 dark:text-gray-100 mb-3">{result.sections.lexicalAnalysis.score}</div>
              <div className="text-base font-bold text-gray-600 dark:text-gray-400">Writing Quality</div>
            </div>
          )}
          {result.sections.semanticAnalysis && (
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700">
              <div className="text-5xl font-black text-gray-900 dark:text-gray-100 mb-3">{result.sections.semanticAnalysis.score}</div>
              <div className="text-base font-bold text-gray-600 dark:text-gray-400">Content Depth</div>
            </div>
          )}
        </div>
      )}

      {/* Detailed Analysis - List Style */}
      {result.sections && (
        <div className="space-y-10">
          {/* Document Synopsis */}
          {result.sections.documentSynopsis && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Document Synopsis</h2>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">

                {result.sections.documentSynopsis.atsCompliance && (
                  <div className="p-6 flex items-start gap-6">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <circle cx="10" cy="10" r="8" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">ATS Compliance</h3>
                        <span className={`text-2xl ${result.sections.documentSynopsis.atsCompliance.status === 'pass' ? 'text-green-600' : 'text-red-600'}`}>
                          {result.sections.documentSynopsis.atsCompliance.status === 'pass' ? '✓' : '✗'}
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">{result.sections.documentSynopsis.atsCompliance.message}</p>
                    </div>
                  </div>
                )}

                {result.sections.documentSynopsis.fileType && (
                  <div className="p-6 flex items-start gap-6">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <circle cx="10" cy="10" r="8" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">File Type</h3>
                        <span className="text-2xl text-green-600">✓</span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">
                        The file type of your resume is: <span className="font-bold">{result.sections.documentSynopsis.fileType.value}</span>.
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">{result.sections.documentSynopsis.fileType.message}</p>
                    </div>
                  </div>
                )}

                {result.sections.documentSynopsis.fileSize && (
                  <div className="p-6 flex items-start gap-6">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <circle cx="10" cy="10" r="8" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">File Size</h3>
                        <span className="text-2xl text-green-600">✓</span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">
                        The file size of your resume is: <span className="font-bold">{result.sections.documentSynopsis.fileSize.value}</span>.
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">{result.sections.documentSynopsis.fileSize.message}</p>
                    </div>
                  </div>
                )}

                {result.sections.documentSynopsis.pageCount && (
                  <div className="p-6 flex items-start gap-6">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <circle cx="10" cy="10" r="8" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Page Count</h3>
                        <span className="text-2xl text-green-600">✓</span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">
                        Your resume contains <span className="font-bold">{result.sections.documentSynopsis.pageCount.value} page</span>.
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">{result.sections.documentSynopsis.pageCount.message}</p>
                    </div>
                  </div>
                )}

                {result.sections.documentSynopsis.wordCount && (
                  <div className="p-6 flex items-start gap-6">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <circle cx="10" cy="10" r="8" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Word Count</h3>
                        <span className="text-2xl text-green-600">✓</span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">
                        Your resume contains <span className="font-bold">{result.sections.documentSynopsis.wordCount.value} words</span>.
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">{result.sections.documentSynopsis.wordCount.message}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Data Identification */}
          {result.sections.dataIdentification && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Data Identification</h2>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">

                {result.sections.dataIdentification.phoneNumber && (
                  <div className="p-6 flex items-start gap-6">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <circle cx="10" cy="10" r="8" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Phone Number</h3>
                        <span className={`text-2xl ${result.sections.dataIdentification.phoneNumber.detected ? 'text-green-600' : 'text-red-600'}`}>
                          {result.sections.dataIdentification.phoneNumber.detected ? '✓' : '✗'}
                        </span>
                      </div>
                      {result.sections.dataIdentification.phoneNumber.detected && result.sections.dataIdentification.phoneNumber.value && (
                        <p className="text-gray-700 dark:text-gray-300 mb-1">
                          Detected: <span className="font-bold">{result.sections.dataIdentification.phoneNumber.value}</span>
                        </p>
                      )}
                      <p className="text-gray-600 dark:text-gray-400">{result.sections.dataIdentification.phoneNumber.message}</p>
                    </div>
                  </div>
                )}

                {result.sections.dataIdentification.email && (
                  <div className="p-6 flex items-start gap-6">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <circle cx="10" cy="10" r="8" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">E-mail Address</h3>
                        <span className={`text-2xl ${result.sections.dataIdentification.email.detected ? 'text-green-600' : 'text-red-600'}`}>
                          {result.sections.dataIdentification.email.detected ? '✓' : '✗'}
                        </span>
                      </div>
                      {result.sections.dataIdentification.email.detected && result.sections.dataIdentification.email.value && (
                        <p className="text-gray-700 dark:text-gray-300 mb-1">
                          We have successfully detected your e-mail address on your resume as: <span className="font-bold">{result.sections.dataIdentification.email.value}</span>
                        </p>
                      )}
                      <p className="text-gray-600 dark:text-gray-400">{result.sections.dataIdentification.email.message}</p>
                    </div>
                  </div>
                )}

                {result.sections.dataIdentification.linkedIn && (
                  <div className="p-6 flex items-start gap-6">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <circle cx="10" cy="10" r="8" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">LinkedIn URL</h3>
                        <span className={`text-2xl ${result.sections.dataIdentification.linkedIn.detected ? 'text-green-600' : 'text-red-600'}`}>
                          {result.sections.dataIdentification.linkedIn.detected ? '✓' : '✗'}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">{result.sections.dataIdentification.linkedIn.message}</p>
                    </div>
                  </div>
                )}

                {result.sections.dataIdentification.education && (
                  <div className="p-6 flex items-start gap-6">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <circle cx="10" cy="10" r="8" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Education</h3>
                        <span className={`text-2xl ${result.sections.dataIdentification.education.detected ? 'text-green-600' : 'text-red-600'}`}>
                          {result.sections.dataIdentification.education.detected ? '✓' : '✗'}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">{result.sections.dataIdentification.education.message}</p>
                    </div>
                  </div>
                )}

                {result.sections.dataIdentification.workHistory && (
                  <div className="p-6 flex items-start gap-6">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <circle cx="10" cy="10" r="8" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Work History</h3>
                        <span className={`text-2xl ${result.sections.dataIdentification.workHistory.detected ? 'text-green-600' : 'text-red-600'}`}>
                          {result.sections.dataIdentification.workHistory.detected ? '✓' : '✗'}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">{result.sections.dataIdentification.workHistory.message}</p>
                    </div>
                  </div>
                )}

                {result.sections.dataIdentification.skills && (
                  <div className="p-6 flex items-start gap-6">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <circle cx="10" cy="10" r="8" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Skills / Achievements</h3>
                        <span className={`text-2xl ${result.sections.dataIdentification.skills.detected ? 'text-green-600' : 'text-red-600'}`}>
                          {result.sections.dataIdentification.skills.detected ? '✓' : '✗'}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">{result.sections.dataIdentification.skills.message}</p>
                    </div>
                  </div>
                )}

                {result.sections.dataIdentification.dateFormatting && (
                  <div className="p-6 flex items-start gap-6">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <circle cx="10" cy="10" r="8" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Date Formatting</h3>
                        <span className={`text-2xl ${result.sections.dataIdentification.dateFormatting.status === 'pass' ? 'text-green-600' : 'text-red-600'}`}>
                          {result.sections.dataIdentification.dateFormatting.status === 'pass' ? '✓' : '✗'}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">{result.sections.dataIdentification.dateFormatting.message}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Lexical Analysis */}
          {result.sections.lexicalAnalysis && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Lexical Analysis</h2>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">

                {result.sections.lexicalAnalysis.personalPronouns && (
                  <div className="p-6 flex items-start gap-6">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <circle cx="10" cy="10" r="8" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Personal Pronouns</h3>
                        <span className={`text-2xl ${result.sections.lexicalAnalysis.personalPronouns.count === 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {result.sections.lexicalAnalysis.personalPronouns.count === 0 ? '✓' : '✗'}
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 mb-1">
                        We detected <span className="font-bold">{result.sections.lexicalAnalysis.personalPronouns.count} occurrences</span> of personal pronouns on your resume.
                      </p>
                      {result.sections.lexicalAnalysis.personalPronouns.examples && result.sections.lexicalAnalysis.personalPronouns.examples.length > 0 && (
                        <p className="text-gray-700 dark:text-gray-300 mb-1">
                          <span className="font-bold">{result.sections.lexicalAnalysis.personalPronouns.examples.join(', ')}</span>
                        </p>
                      )}
                      <p className="text-gray-600 dark:text-gray-400">{result.sections.lexicalAnalysis.personalPronouns.message}</p>
                    </div>
                  </div>
                )}

                {result.sections.lexicalAnalysis.numericizedData && (
                  <div className="p-6 flex items-start gap-6">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <circle cx="10" cy="10" r="8" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Numericized Data</h3>
                        <span className={`text-2xl ${result.sections.lexicalAnalysis.numericizedData.status === 'pass' ? 'text-green-600' : 'text-red-600'}`}>
                          {result.sections.lexicalAnalysis.numericizedData.status === 'pass' ? '✓' : '✗'}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">{result.sections.lexicalAnalysis.numericizedData.message}</p>
                    </div>
                  </div>
                )}

                {result.sections.lexicalAnalysis.vocabularyLevel && (
                  <div className="p-6 flex items-start gap-6">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <circle cx="10" cy="10" r="8" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Vocabulary Level</h3>
                        <span className="text-2xl text-green-600">✓</span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">
                        The vocabulary level on your resume is a <span className="font-bold">{result.sections.lexicalAnalysis.vocabularyLevel.score} out of 10</span>. {result.sections.lexicalAnalysis.vocabularyLevel.message}
                      </p>
                    </div>
                  </div>
                )}

                {result.sections.lexicalAnalysis.readingLevel && (
                  <div className="p-6 flex items-start gap-6">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <circle cx="10" cy="10" r="8" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Reading Level</h3>
                        <span className="text-2xl text-green-600">✓</span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">
                        The reading level on your resume is a <span className="font-bold">{result.sections.lexicalAnalysis.readingLevel.score} out of 10</span>. {result.sections.lexicalAnalysis.readingLevel.message}
                      </p>
                    </div>
                  </div>
                )}

                {result.sections.lexicalAnalysis.commonWords && result.sections.lexicalAnalysis.commonWords.length > 0 && (
                  <div className="p-6 flex items-start gap-6">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <circle cx="10" cy="10" r="8" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Common Words</h3>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 mb-3">The following are some of the most frequently-used words on your resume:</p>
                      <div className="flex flex-wrap gap-2">
                        {result.sections.lexicalAnalysis.commonWords.map((word, idx) => (
                          <span key={idx} className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-gray-900 dark:text-gray-100 font-bold rounded-md border border-blue-200 dark:border-blue-800">
                            {word}
                          </span>
                        ))}
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mt-3">Each of these words appear in your resume multiple times, which is a good thing! The words that appear the most often on your resume should help represent the archetype you are attempting to take on as a job seeker.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Semantic Analysis */}
          {result.sections.semanticAnalysis && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Semantic Analysis</h2>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">

                {result.sections.semanticAnalysis.measurableAchievements && (
                  <div className="p-6 flex items-start gap-6">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <circle cx="10" cy="10" r="8" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Measurable Achievements</h3>
                      </div>
                      {result.sections.semanticAnalysis.measurableAchievements.examples && result.sections.semanticAnalysis.measurableAchievements.examples.length > 0 && (
                        <div className="mb-3">
                          <p className="text-gray-700 dark:text-gray-300 mb-3">The following are some of the measurable achievements listed on your resume (not all of them may be listed):</p>
                          <div className="space-y-2">
                            {result.sections.semanticAnalysis.measurableAchievements.examples.map((achievement, idx) => (
                              <div key={idx} className="px-4 py-2 bg-green-50 dark:bg-green-900/20 text-gray-900 dark:text-gray-100 font-bold rounded-md border border-green-200 dark:border-green-800">
                                {achievement}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      <p className="text-gray-700 dark:text-gray-300">
                        Your resume contains around <span className="font-bold">{result.sections.semanticAnalysis.measurableAchievements.count} measurable achievements</span>. {result.sections.semanticAnalysis.measurableAchievements.message}
                      </p>
                    </div>
                  </div>
                )}

                {result.sections.semanticAnalysis.softSkills && (
                  <div className="p-6 flex items-start gap-6">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <circle cx="10" cy="10" r="8" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Soft Skills</h3>
                      </div>
                      {result.sections.semanticAnalysis.softSkills.list && result.sections.semanticAnalysis.softSkills.list.length > 0 && (
                        <div className="mb-3">
                          <p className="text-gray-700 dark:text-gray-300 mb-3">The following are some of the soft skills listed on your resume (not all skills may be listed):</p>
                          <div className="flex flex-wrap gap-2">
                            {result.sections.semanticAnalysis.softSkills.list.map((skill, idx) => (
                              <span key={idx} className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-gray-900 dark:text-gray-100 font-bold rounded-md border border-purple-200 dark:border-purple-800">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      <p className="text-gray-700 dark:text-gray-300">
                        Your resume contains a total of around <span className="font-bold">{result.sections.semanticAnalysis.softSkills.count} soft skills</span>. {result.sections.semanticAnalysis.softSkills.message}
                      </p>
                    </div>
                  </div>
                )}

                {result.sections.semanticAnalysis.hardSkills && (
                  <div className="p-6 flex items-start gap-6">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <circle cx="10" cy="10" r="8" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Hard Skills</h3>
                      </div>
                      {result.sections.semanticAnalysis.hardSkills.list && result.sections.semanticAnalysis.hardSkills.list.length > 0 && (
                        <div className="mb-3">
                          <p className="text-gray-700 dark:text-gray-300 mb-3">The following are some of the hard skills listed on your resume (not all skills may be listed):</p>
                          <div className="flex flex-wrap gap-2">
                            {result.sections.semanticAnalysis.hardSkills.list.map((skill, idx) => (
                              <span key={idx} className="px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-gray-900 dark:text-gray-100 font-bold rounded-md border border-indigo-200 dark:border-indigo-800">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      <p className="text-gray-700 dark:text-gray-300">
                        Your resume contains a total of around <span className="font-bold">{result.sections.semanticAnalysis.hardSkills.count} hard skills</span>. {result.sections.semanticAnalysis.hardSkills.message}
                      </p>
                    </div>
                  </div>
                )}

                {result.sections.semanticAnalysis.skillsEfficiencyRatio && (
                  <div className="p-6 flex items-start gap-6">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <circle cx="10" cy="10" r="8" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Skills Efficiency Ratio</h3>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">
                        The skills efficiency ratio of your resume is <span className="font-bold">{result.sections.semanticAnalysis.skillsEfficiencyRatio.value}</span>. {result.sections.semanticAnalysis.skillsEfficiencyRatio.message}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
