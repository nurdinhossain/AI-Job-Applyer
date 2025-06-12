'use client';
import Image from "next/image";
import { use, useEffect, useState } from "react";

export default function Home() {
  const [unvisitedSites, setUnvisitedSites] = useState([]);
  const [visitedSites, setVisitedSites] = useState([]);

  useEffect(() => {
    // Fetch unvisited
    fetch("http://localhost:5000/data?visited=0")
      .then((res) => res.json())
      .then((data) => setUnvisitedSites(data))
      .catch((err) => console.error("Error fetching unvisited:", err));

    // Fetch visited
    fetch("http://localhost:5000/data?visited=1")
      .then((res) => res.json())
      .then((data) => setVisitedSites(data))
      .catch((err) => console.error("Error fetching visited:", err));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    const link = document.getElementById("link").value;
    const directions = document.getElementById("directions").value;

    const res = await fetch("http://localhost:5000/data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ link, directions }),
    });

    if (res.ok) {
      alert("Site added!");
      window.location.reload(); // Quick way to refresh data (or use state updates)
    } else {
      alert("Error: " + (await res.text()));
    }
  }

  return (
    <div className="flex justify-between flex-col h-screen">
      <header>
        <h1 className='text-4xl font-bold underline text-center m-4'>AI Job Applyer!</h1>
      </header>

      <div className="flex justify-around">
        <div>
          <h2 className="text-2xl text-center">List of job sites to crawl⏳➡️</h2>
          <div className="overflow-auto w-sm h-48 bg-gray-100">
            {unvisitedSites.map((site, index) => (
              <p key={index} className="pb-2 border-1">{site.link}</p>
            ))}
          </div>
        </div>
        <div className="flex flex-col mb-6">
          <h2 className="text-2xl text-center">Add a new site➕</h2>
          <form id="addLink" onSubmit={handleSubmit}>
            <div>
              <label className="block" htmlFor="link">Link: </label>
              <input id="link" type="url" placeholder="URL"></input>
            </div>

            <div>
              <label className="block" htmlFor="directions">Directions for AI: </label>
              <textarea id="directions" name="directions" rows="5" cols="50" defaultValue="Type your instructions here. Be detailed."></textarea>
            </div>
          </form>

          <button type="submit" form="addLink" value="Submit" className="px-4 py-2 mx-auto block rounded-sm w-40 bg-blue-300">Submit</button>
        </div>
      </div>

      <div className="flex justify-around">
        <div>
          <h2 className="text-2xl text-center">Already applied✅</h2>
          <div className="overflow-auto h-48 bg-green-50">
            {visitedSites.map((site, index) => (
              <p key={index}>{site.link}</p>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-2xl text-center">Application failed❌</h2>
          <div className="overflow-auto h-48 bg-red-50">
            {visitedSites.map((site, index) => (
              <p key={index}>{site.link}</p>
            ))}
          </div>
        </div>
      </div>

      <form
        id="aiApplyForm"
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);

          fetch("http://localhost:5000/crawl", {
            method: "POST",
            body: formData,
          })
            .then((res) => res.json())
            .then((data) => console.log("Crawl result:", data))
            .catch((err) => console.error("Crawl error:", err));
        }}
      >
        <h2 className="text-2xl text-center mb-6 font-semibold">Tell me about yourself ✍️</h2>

        {/* File Upload */}
        <div className="mb-6">
          <label htmlFor="fileInput" className="block font-medium mb-2">
            Attach your resume here:
          </label>
          <input
            type="file"
            id="fileInput"
            name="resume"
            className="block w-full border border-gray-300 rounded p-2"
          />
        </div>

        {/* Textarea for AI directions */}
        <div className="mb-6">
          <label htmlFor="directions" className="block font-medium mb-2">
            Give the AI any relevant information to apply:
          </label>
          <textarea
            id="directions"
            name="directions"
            rows="5"
            className="block w-full border border-gray-300 rounded p-2"
            defaultValue="Type your instructions here. Be detailed."
          ></textarea>
        </div>
      </form>

      <button
        type="submit"
        className="px-4 py-2 mx-auto block rounded-sm w-40 bg-blue-300"
        form="aiApplyForm"
      >
        Crawl
      </button>

      <footer>
        <p className="text-lg font-bold text-center m-4">Made by Nurdin Hossain 😛. All rights reserved.</p>
      </footer>
    </div>
  );
}
