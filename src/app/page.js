import Image from "next/image";

export default function Home() {
  return (
    <div className="flex justify-between flex-col h-screen">
      <header>
        <h1 className='text-4xl font-bold underline text-center m-4'>AI Job Applyer!</h1>
      </header>

      <div className="flex justify-around">
        <div> 
          <h2 className="text-2xl">Already applied✅</h2>
          <div className="overflow-auto h-48 bg-red-50">
            <p>Penis</p>
            <p>Penis</p>
            <p>Penis</p>
            <p>Penis</p>
            <p>Penis</p>
            <p>Penis</p>
            <p>Penis</p>
            <p>Penis</p>
            <p>Penis</p>
            <p>Penis</p>
            <p>Penis</p>
          </div>
        </div>
        <div>
          <h2 className="text-2xl">List of job sites to crawl⏳➡️</h2>
          <div className="overflow-auto h-48 bg-red-50">
            <p>Penis</p>
            <p>Penis</p>
            <p>Penis</p>
            <p>Penis</p>
            <p>Penis</p>
            <p>Penis</p>
            <p>Penis</p>
            <p>Penis</p>
            <p>Penis</p>
            <p>Penis</p>
            <p>Penis</p>
          </div>
        </div>
        <div>
          <h2 className="text-2xl">Add a new site➕</h2>
          <form id="addLink">
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

      <button>Crawl</button>

      <footer>
        <p className="text-lg font-bold text-center m-4">Made by Nurdin Hossain 😛. All rights reserved.</p>
      </footer>
    </div>
  );
}
