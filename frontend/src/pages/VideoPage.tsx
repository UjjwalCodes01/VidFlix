import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

const VideoPage = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    Navigate({ to: "/" });
  }
  interface movie {
    _id: string;
    title: string;
    type: string;
    duration: number;
    imageUrl: string;
    videoUrl: string;
  }
  const [allmovie, setallmovie] = useState<movie[]>([]);
  const location = useLocation();
  const navigate = useNavigate();

  const { title, type, duration, imageUrl, videoUrl } = location.state || {};

  useEffect(() => {
    getMovies();
  }, []);

  const getMovies = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/movies/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const Data = await res.json();
      console.log("Fetched movies:", Data);
      setallmovie(Data);
    } catch (error) {
      toast.error("unable to get all movies");
    }
  };
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="px-4 py-6 flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <div className="">
            <video
              src={videoUrl}
              controls
              autoPlay
              className="w-full rounded-lg shadow-lg bg-black"
            />
          </div>
          <div className=" bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black to-transparent">
            <h1 className="text-3xl lg:text-4xl font-bold">{title}</h1>
            <p className="text-lg text-gray-300">{type}</p>
          </div>
        </div>
        <div className="lg:w-1/3 flex-none space-y-4">
          <img
            src={imageUrl}
            alt={title}
            className="rounded-lg shadow-md w-full object-cover"
          />
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">{title}</h2>
            <p className="text-gray-400">
              {type} • {duration} secs
            </p>
          </div>
        </div>
      </div>

      <section className="mt-12 px-4">
        <h2 className="text-2xl font-bold mb-4">You Might Also Like</h2>
        <ScrollArea className="whitespace-nowrap px-1">
          <div className="inline-flex space-x-4">
            {allmovie.map((m) => (
              <div
                key={m._id}
                onClick={() => navigate("/video", { state: m })}
                className="relative w-48 h-72 rounded-lg overflow-hidden cursor-pointer group transition-transform transform hover:scale-105"
              >
                <img
                  src={m.imageUrl}
                  alt={m.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 w-full p-2 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity">
                  <h3 className="text-sm font-semibold text-white truncate">
                    {m.title}
                  </h3>
                  <p className="text-xs text-gray-300">{m.type}</p>
                </div>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </section>
    </div>
  );
};

export default VideoPage;
