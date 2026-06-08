"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function TextToVideo() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");

  if (status === "unauthenticated") {
    router.push("/auth/login");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      toast.error("Please enter a description");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/text-to-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate video");
      }

      const data = await response.json();
      setVideoUrl(data.videoUrl);
      toast.success("Video generated successfully!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark via-slate-900 to-dark">
      {/* Header */}
      <div className="bg-slate-950 border-b border-slate-800 py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold">📝 Text to Video</h1>
        <p className="text-slate-400 mt-2">Create stunning videos from text descriptions</p>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="card">
            <h2 className="text-2xl font-bold mb-6">Describe Your Video</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Text Input */}
              <div>
                <label className="block text-sm font-medium mb-2">Video Description</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the video in detail. Include scenes, actions, emotions, colors, and mood..."
                  className="input-field min-h-40 resize-none"
                  required
                />
              </div>

              {/* Video Settings */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Duration</label>
                  <select className="input-field">
                    <option>10 seconds</option>
                    <option>15 seconds</option>
                    <option>30 seconds</option>
                    <option>60 seconds</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Style</label>
                  <select className="input-field">
                    <option>Realistic</option>
                    <option>Animated</option>
                    <option>Cinematic</option>
                    <option>Artistic</option>
                    <option>3D</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Music</label>
                  <select className="input-field">
                    <option>Ambient</option>
                    <option>Upbeat</option>
                    <option>Cinematic</option>
                    <option>Dramatic</option>
                    <option>None</option>
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full disabled:opacity-50"
              >
                {loading ? "Generating Video..." : "Create Video"}
              </button>
            </form>

            {/* Writing Tips */}
            <div className="mt-8 pt-8 border-t border-slate-700">
              <h3 className="font-bold mb-4">💡 Writing Tips:</h3>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>• Be specific and descriptive</li>
                <li>• Include emotions and atmosphere</li>
                <li>• Mention colors and lighting</li>
                <li>• Describe camera movements</li>
                <li>• Add pacing and transitions</li>
              </ul>
            </div>
          </div>

          {/* Output Section */}
          <div className="card">
            <h2 className="text-2xl font-bold mb-6">Generated Video</h2>

            {videoUrl ? (
              <div className="space-y-4">
                <video
                  src={videoUrl}
                  controls
                  className="w-full rounded-lg bg-slate-900"
                />
                <div className="space-y-2">
                  <button className="btn-primary w-full">Download Video</button>
                  <button className="btn-secondary w-full">Share</button>
                  <button className="w-full px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg font-semibold transition">
                    Generate Another
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-96 bg-slate-900 rounded-lg">
                <div className="text-center">
                  <div className="text-6xl mb-4">🎬</div>
                  <p className="text-slate-400">Your generated video will appear here</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Examples */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <div className="text-4xl mb-2">🌅</div>
            <h3 className="font-bold mb-2">Scenic Videos</h3>
            <p className="text-slate-400 text-sm">
              Create beautiful landscape and nature videos with smooth transitions
            </p>
          </div>
          <div className="card">
            <div className="text-4xl mb-2">🎭</div>
            <h3 className="font-bold mb-2">Storytelling</h3>
            <p className="text-slate-400 text-sm">
              Generate videos that tell compelling stories with AI narration
            </p>
          </div>
          <div className="card">
            <div className="text-4xl mb-2">📱</div>
            <h3 className="font-bold mb-2">Social Media</h3>
            <p className="text-slate-400 text-sm">
              Perfect for TikTok, Instagram, and YouTube Shorts
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
