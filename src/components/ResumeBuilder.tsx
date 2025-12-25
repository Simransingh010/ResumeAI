"use client";

import React, { createContext, useState, useEffect, useCallback, useMemo } from "react";
import Preview from "./preview/ui/Preview";
import DefaultResumeData from "./utility/DefaultResumeData";
import dynamic from "next/dynamic";
import Form from "./form/ui/Form";
import DownloadPdfButton from "./DownloadPdfButton";
import { ResumeData } from "@/types/resume";
import { useUndoRedo } from "@/hooks/useUndoRedo";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useAutoSave } from "@/hooks/useAutoSave";
import CommandPalette, { FiDownload, FiSave, FiRotateCcw, FiRotateCw, FiTrash2, FiSun, FiMoon } from "./ui/CommandPalette";
import ProgressIndicator from "./ui/ProgressIndicator";
import KeyboardShortcutsHelp from "./ui/KeyboardShortcutsHelp";
import Confetti from "./ui/Confetti";
import Toast from "./ui/Toast";
import ResumeScoreWidget from "./ui/ResumeScoreWidget";
import { FiCommand, FiHelpCircle, FiClock } from "react-icons/fi";

// Define context type
interface ResumeContextType {
  resumeData: ResumeData;
  setResumeData: (data: ResumeData) => void;
  handleProfilePicture: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

// Create context with proper initial value
const ResumeContext = createContext<ResumeContextType>({
  resumeData: DefaultResumeData,
  setResumeData: () => { },
  handleProfilePicture: () => { },
  handleChange: () => { },
});

// server side rendering false
const Print = dynamic(() => import("./utility/WinPrint"), {
  ssr: false,
});

const AUTO_SAVE_KEY = "atsense-resume-draft";

export default function ResumeBuilder() {
  // Undo/Redo state management
  const {
    state: resumeData,
    set: setResumeDataInternal,
    undo,
    redo,
    canUndo,
    canRedo,
    reset: resetHistory,
  } = useUndoRedo<ResumeData>(DefaultResumeData);

  // UI State
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isShortcutsHelpOpen, setIsShortcutsHelpOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [isDark, setIsDark] = useState(false);
  const [hasLoadedDraft, setHasLoadedDraft] = useState(false);

  // Auto-save functionality
  const { lastSaved, isSaving, forceSave, loadSaved, clearSaved } = useAutoSave({
    key: AUTO_SAVE_KEY,
    data: resumeData,
    delay: 2000,
    onSave: () => {
      // Silent save - no toast for auto-save
    },
  });

  // Load saved draft on mount
  useEffect(() => {
    if (!hasLoadedDraft) {
      const savedDraft = loadSaved();
      if (savedDraft && JSON.stringify(savedDraft) !== JSON.stringify(DefaultResumeData)) {
        setResumeDataInternal(savedDraft);
        setToast({ message: "Draft restored from your last session", type: "info" });
      }
      setHasLoadedDraft(true);
    }
  }, [hasLoadedDraft, loadSaved, setResumeDataInternal]);

  // Check dark mode
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  // Wrapper for setResumeData that triggers history
  const setResumeData = useCallback(
    (data: ResumeData) => {
      setResumeDataInternal(data);
    },
    [setResumeDataInternal]
  );

  // Profile picture handler
  const handleProfilePicture = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file instanceof Blob) {
        const reader = new FileReader();
        reader.onload = (event: ProgressEvent<FileReader>) => {
          if (event.target?.result) {
            setResumeData({ ...resumeData, profilePicture: event.target.result as string });
          }
        };
        reader.readAsDataURL(file);
      }
    },
    [resumeData, setResumeData]
  );

  // Generic change handler
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setResumeData({ ...resumeData, [e.target.name]: e.target.value });
    },
    [resumeData, setResumeData]
  );

  // Download PDF handler
  const handleDownloadPdf = useCallback(() => {
    const downloadBtn = document.querySelector('[aria-label="Download Resume as PDF"]') as HTMLButtonElement;
    downloadBtn?.click();
  }, []);

  // Save data handler
  const handleSaveData = useCallback(() => {
    forceSave();
    setToast({ message: "Resume saved successfully!", type: "success" });
  }, [forceSave]);

  // Clear data handler
  const handleClearData = useCallback(() => {
    if (window.confirm("Are you sure you want to clear all data? This cannot be undone.")) {
      resetHistory(DefaultResumeData);
      clearSaved();
      setToast({ message: "All data cleared", type: "info" });
    }
  }, [resetHistory, clearSaved]);

  // Toggle dark mode
  const toggleDarkMode = useCallback(() => {
    const newDark = !isDark;
    setIsDark(newDark);
    if (newDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  // Undo handler with toast
  const handleUndo = useCallback(() => {
    if (undo()) {
      setToast({ message: "Undo successful", type: "info" });
    }
  }, [undo]);

  // Redo handler with toast
  const handleRedo = useCallback(() => {
    if (redo()) {
      setToast({ message: "Redo successful", type: "info" });
    }
  }, [redo]);

  // Command palette commands
  const commands = useMemo(
    () => [
      {
        id: "save",
        label: "Save Resume",
        shortcut: "⌘S",
        icon: <FiSave className="w-4 h-4" />,
        action: handleSaveData,
        category: "Actions",
      },
      {
        id: "download",
        label: "Download PDF",
        shortcut: "⌘D",
        icon: <FiDownload className="w-4 h-4" />,
        action: handleDownloadPdf,
        category: "Actions",
      },
      {
        id: "undo",
        label: "Undo",
        shortcut: "⌘Z",
        icon: <FiRotateCcw className="w-4 h-4" />,
        action: handleUndo,
        category: "Edit",
      },
      {
        id: "redo",
        label: "Redo",
        shortcut: "⌘⇧Z",
        icon: <FiRotateCw className="w-4 h-4" />,
        action: handleRedo,
        category: "Edit",
      },
      {
        id: "clear",
        label: "Clear All Data",
        icon: <FiTrash2 className="w-4 h-4" />,
        action: handleClearData,
        category: "Danger",
      },
      {
        id: "toggle-theme",
        label: isDark ? "Switch to Light Mode" : "Switch to Dark Mode",
        icon: isDark ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />,
        action: toggleDarkMode,
        category: "Preferences",
      },
      {
        id: "shortcuts",
        label: "Keyboard Shortcuts",
        shortcut: "?",
        icon: <FiHelpCircle className="w-4 h-4" />,
        action: () => setIsShortcutsHelpOpen(true),
        category: "Help",
      },
    ],
    [handleSaveData, handleDownloadPdf, handleUndo, handleRedo, handleClearData, isDark, toggleDarkMode]
  );

  // Keyboard shortcuts
  useKeyboardShortcuts([
    { key: "k", ctrl: true, callback: () => setIsCommandPaletteOpen(true), description: "Open command palette" },
    { key: "s", ctrl: true, callback: handleSaveData, description: "Save resume" },
    { key: "d", ctrl: true, callback: handleDownloadPdf, description: "Download PDF" },
    { key: "z", ctrl: true, callback: handleUndo, description: "Undo" },
    { key: "z", ctrl: true, shift: true, callback: handleRedo, description: "Redo" },
    { key: "?", callback: () => setIsShortcutsHelpOpen(true), description: "Show shortcuts" },
    { key: "Escape", callback: () => { setIsCommandPaletteOpen(false); setIsShortcutsHelpOpen(false); }, description: "Close dialogs" },
  ]);

  // Calculate progress sections
  const progressSections = useMemo(() => [
    { id: "personal", label: "Personal", isComplete: !!(resumeData.name && resumeData.email) },
    { id: "summary", label: "Summary", isComplete: !!resumeData.summary && resumeData.summary.length > 20 },
    { id: "experience", label: "Experience", isComplete: resumeData.workExperience.length > 0 },
    { id: "education", label: "Education", isComplete: resumeData.education.length > 0 },
    { id: "skills", label: "Skills", isComplete: resumeData.skills.length > 0 },
  ], [resumeData]);

  // Track if confetti has been shown for current completion state
  const [hasShownConfetti, setHasShownConfetti] = useState(false);

  // Check for completion and show confetti
  useEffect(() => {
    const allComplete = progressSections.every((s) => s.isComplete);
    if (allComplete && !hasShownConfetti) {
      setShowConfetti(true);
      setHasShownConfetti(true);
      setToast({ message: "🎉 Amazing! Your resume is complete!", type: "success" });
      setTimeout(() => setShowConfetti(false), 4000);
    } else if (!allComplete && hasShownConfetti) {
      // Reset so confetti can show again if user completes resume again
      setHasShownConfetti(false);
    }
  }, [progressSections, hasShownConfetti]);

  // Scroll to section
  const scrollToSection = useCallback((sectionId: string) => {
    const sectionMap: Record<string, string> = {
      personal: "Personal Information",
      summary: "Summary",
      experience: "Work Experience",
      education: "Education",
      skills: "Skills",
    };
    const sectionTitle = sectionMap[sectionId];
    const allTitles = document.querySelectorAll("h2.input-title");
    allTitles.forEach((el) => {
      if (el.textContent === sectionTitle) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }, []);

  return (
    <>
      <ResumeContext.Provider
        value={{
          resumeData,
          setResumeData,
          handleProfilePicture,
          handleChange,
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-screen bg-gray-50 dark:bg-gray-950">
          {/* Form Panel */}
          <div className="bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-6 lg:p-8 overflow-y-auto h-screen exclude-print">
            <div className="max-w-2xl mx-auto">
              {/* Header with actions */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white">Resume Builder</h2>
                <div className="flex items-center gap-2">
                  {/* Auto-save indicator */}
                  {lastSaved && (
                    <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                      <FiClock className="w-3 h-3" />
                      <span>{isSaving ? "Saving..." : `Saved ${lastSaved.toLocaleTimeString()}`}</span>
                    </div>
                  )}

                  {/* Undo/Redo buttons */}
                  <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <button
                      onClick={handleUndo}
                      disabled={!canUndo}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Undo (⌘Z)"
                    >
                      <FiRotateCcw className="w-4 h-4" />
                    </button>
                    <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />
                    <button
                      onClick={handleRedo}
                      disabled={!canRedo}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Redo (⌘⇧Z)"
                    >
                      <FiRotateCw className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Command palette button */}
                  <button
                    onClick={() => setIsCommandPaletteOpen(true)}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors border border-gray-200 dark:border-gray-700"
                    title="Command Palette (⌘K)"
                  >
                    <FiCommand className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Progress Indicator */}
              <ProgressIndicator
                sections={progressSections}
                onSectionClick={scrollToSection}
              />

              {/* Resume Score Widget */}
              <ResumeScoreWidget resumeData={resumeData} />

              {/* Form */}
              <Form />
            </div>
          </div>

          {/* Preview Panel */}
          <div className="bg-gray-100 dark:bg-gray-950 p-6 lg:p-8 overflow-y-auto h-screen sticky top-0">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Live Preview
              </h3>
              <span className="text-xs text-gray-500 dark:text-gray-500 bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded">
                Updates in real-time
              </span>
            </div>
            <Preview />
          </div>
        </div>

        {/* Download Button */}
        <DownloadPdfButton resumeName={resumeData.name || "resume"} />
        <Print />

        {/* Command Palette */}
        <CommandPalette
          isOpen={isCommandPaletteOpen}
          onClose={() => setIsCommandPaletteOpen(false)}
          commands={commands}
        />

        {/* Keyboard Shortcuts Help */}
        <KeyboardShortcutsHelp
          isOpen={isShortcutsHelpOpen}
          onClose={() => setIsShortcutsHelpOpen(false)}
        />

        {/* Confetti */}
        <Confetti isActive={showConfetti} />

        {/* Toast */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </ResumeContext.Provider>
    </>
  );
}

export { ResumeContext };
