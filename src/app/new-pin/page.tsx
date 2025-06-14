'use client';

import { handleNewPin } from "@/actions";

export default function NewPinPage () {
  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Submit a New Instagram Reel</h1>
      <form action={handleNewPin} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">
            Link to Instagram Reel
            <input
              type="url"
              name="reelUrl"
              required
              className="w-full border rounded px-3 py-2"
            />
          </label>
        </div>

        <div>
          <label className="block font-medium mb-1">
            Link to Instagram Profile
            <input
              type="url"
              name="profileUrl"
              required
              className="w-full border rounded px-3 py-2"
            />
          </label>
        </div>

        <div>
          <label className="block font-medium mb-1">
            Name of Instagram Profile
            <input
              type="text"
              name="profileName"
              required
              className="w-full border rounded px-3 py-2"
            />
          </label>
        </div>

        <div>
          <label className="block font-medium mb-1">
            Caption or Address
            <textarea
              name="captionOrAddress"
              rows={4}
              required
              className="w-full border rounded px-3 py-2"
            />
          </label>
        </div>

        <div>
          <label className="block font-medium mb-1">
            URL of Instagram Reel Image
            <input
              type="url"
              name="imageUrl"
              required
              className="w-full border rounded px-3 py-2"
            />
          </label>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Submit
        </button>
      </form>
    </main>
  );
}