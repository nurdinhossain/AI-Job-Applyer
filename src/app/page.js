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
        <div className="flex flex-col">
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

          <button type="submit" form="addLink" value="Submit">Submit</button>
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

      <button>Crawl</button>

      <footer>
        <p className="text-lg font-bold text-center m-4">Made by Nurdin Hossain 😛. All rights reserved.</p>
      </footer>
    </div>
  );
}
