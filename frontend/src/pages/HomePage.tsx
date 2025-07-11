import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Home, LogOut, PictureInPicture, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const admin = localStorage.getItem("admin");
  const isAdmin = admin === "true";
  if (!token) {
    return Navigate({ to: "/" });
  }
  interface MyMovie {
    _id: string;
    title: string;
    type: string;
    duration: number;
    imageUrl: string;
    videoUrl: string;
  }
  const [MyMovies, setMyMovies] = useState<MyMovie[]>([]);
  const [demand, setDemandMovies] = useState<MyMovie[]>([]);
  const [foryou, setForyou] = useState<MyMovie[]>([]);
  const [allmovie, setallmovie] = useState<MyMovie[]>([]);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            video.muted = false;
            const playPromise = video.play();
            if (playPromise !== undefined) {
              playPromise.catch((err) =>
                console.log("Autoplay blocked:", err.message)
              );
            }
          } else {
            video.pause();
            video.currentTime = 0;
            video.muted = true;
          }
        });
      },
      {
        threshold: 0.9,
      }
    );

    videoRefs.current.forEach((video) => {
      if (video) {
        observer.observe(video);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [MyMovies]);

  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (video) {
        if (i === selectedIndex) {
          video.currentTime = 0;
          video.muted = false;
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.catch((err) =>
              console.log("Autoplay blocked:", err.message)
            );
          }
        } else {
          video.pause();
          video.currentTime = 0;
        }
      }
    });
  }, [selectedIndex]);

  useEffect(() => {
    topMovies();
    DemandMovie();
    ForYouMovies();
    allMovies();
  }, []);
  const topMovies = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/movies/top", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const Data = await res.json();
      console.log("Fetched movies:", Data);
      setMyMovies(Data);
    } catch (error) {
      console.log("error in getting top movies", error);
    }
  };

  const ForYouMovies = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/movies/for-you", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const Data = await res.json();
      console.log("Fetched movies:", Data);
      setForyou(Data);
    } catch (error) {
      console.log("error in getting top movies", error);
    }
  };
  const allMovies = async () => {
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
      console.log("error in getting top movies", error);
    }
  };
  const DemandMovie = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/movies/on-demand", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const Data = await res.json();
      console.log("Fetched movies:", Data);
      setDemandMovies(Data);
    } catch (error) {
      console.log("error in getting top movies", error);
    }
  };
  return (
    <div className="w-full h-screen bg-gray-950">
      <div className="w-full h-[10vh]  flex justify-between bg-gradient-to-r from-gray-900 via-gray-600 to-gray-200 ">
        <div className="flex justify-center items-center animate-pulse hover:animate-spin">
          <img src="mx-player-logo-450x450.png" className="w-[4vw] ml-3" />
          <span className="text-white flex font-bold">
            MX <h1 className="font-normal"> PLAYER</h1>
          </span>
        </div>
        <div className="flex justify-around items-center">
          {isAdmin && (
            <div
              onClick={() => navigate("/admin")}
              className="text-white flex justify-center items-center cursor-pointer hover:text-blue-500"
            >
              <User className="h-12" />
              <h1 className="ml-1">Admin</h1>
            </div>
          )}
          <div
            onClick={() => navigate("/home")}
            className="text-white flex justify-center items-center cursor-pointer ml-5 hover:text-blue-500"
          >
            <Home className="h-12" />
            <h1 className="ml-1">Home</h1>
          </div>

          <div
            onClick={() => navigate("/video")}
            className="text-white flex justify-center items-center ml-5 cursor-pointer hover:text-blue-500"
          >
            <PictureInPicture className="h-12" />
            <h1 className="ml-1">Shows</h1>
          </div>
          <div
            onClick={() => navigate("/")}
            className="text-white flex  justify-center items-center ml-5 mr-3 cursor-pointer bg-red-500 rounded-md hover:bg-red-800 "
          >
            <LogOut className="h-7" />
            <h1 className="ml-1">LOGOUT</h1>
          </div>
        </div>
      </div>

      <ScrollArea className="w-full h-[90vh]  custom-scroll-hide  bg-black rounded-md">
        <Carousel>
          <CarouselContent>
            {MyMovies.map((MOVIE, index) => (
              <CarouselItem key={MOVIE._id}>
                <div className="w-screen h-[90vh] group relative">
                  <video
                    ref={(el) => {
                      videoRefs.current[index] = el;
                      if (el) {
                        el.onmouseenter = () => el.play();
                        el.onmouseleave = () => {
                          el.pause();
                          el.currentTime = 0;
                        };
                      }
                    }}
                    autoPlay
                    playsInline
                    poster={MOVIE.imageUrl}
                    className="w-screen h-[90vh] object-fill"
                    src={MOVIE.videoUrl}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-50 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
                    <h1 className="text-4xl font-bold truncate">
                      {MOVIE.title}
                    </h1>
                    <p className="text-3xl">{MOVIE.type}</p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="ml-15 bg-black" />
          <CarouselNext className="mr-1480 bg-black" />
        </Carousel>
        <div className="w-screen h-[35vh]">
          <h1 className="text-3xl ml-3 mt-3 mb-4 text-white font-bold">
            {" "}
            {"Movies On Demand >>>"}
          </h1>
          <ScrollArea className=" whitespace-nowrap flex h-[45vh]">
            <div className="flex w-max space-x-4">
              {demand.map((MOVIE) => (
                <div
                  onClick={() =>
                    navigate("/video", {
                      state: {
                        title: MOVIE.title,
                        imageUrl: MOVIE.imageUrl,
                        videoUrl: MOVIE.videoUrl,
                        duration: MOVIE.duration,
                        type: MOVIE.type,
                      },
                    })
                  }
                  key={MOVIE._id}
                  className="group hover: cursor-pointer  relative w-64 h-[43vh] overflow-hidden rounded-md shadow-md border-black"
                >
                  <img
                    className="w-full h-full object-cover  transition-transform duration-300 group-hover:scale-105 group-hover:animate-pulse"
                    src={MOVIE.imageUrl}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-70 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
                    <h1 className="text-lg font-bold truncate">
                      {MOVIE.title}
                    </h1>
                    <p className="text-sm">{MOVIE.type}</p>
                  </div>
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>

        <div className="w-screen h-[35vh] mt-[15vh]">
          <h1 className="text-3xl ml-3 mt-30 mb-4 text-white font-bold">
            {" "}
            {"Movies For You >>>"}
          </h1>
          <ScrollArea className="custom-scroll-hide  whitespace-nowrap flex h-[45vh]">
            <div className="flex w-max space-x-4">
              {foryou.map((MOVIE) => (
                <div
                  onClick={() =>
                    navigate("/video", {
                      state: {
                        title: MOVIE.title,
                        imageUrl: MOVIE.imageUrl,
                        videoUrl: MOVIE.videoUrl,
                        duration: MOVIE.duration,
                        type: MOVIE.type,
                      },
                    })
                  }
                  key={MOVIE._id}
                  className="group hover: cursor-pointer relative w-64 h-[43vh] overflow-hidden rounded-md shadow-md border-black"
                >
                  <img
                    className="w-full   h-full object-cover transition-transform duration-300 group-hover:scale-105 group-hover:animate-pulse"
                    src={MOVIE.imageUrl}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-70 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
                    <h1 className="text-lg font-bold truncate">
                      {MOVIE.title}
                    </h1>
                    <p className="text-sm">{MOVIE.type}</p>
                  </div>
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>

        <div className="w-screen h-[35vh] mt[15vh]">
          <h1 className="text-3xl ml-3 mt-30 mb-4 text-white font-bold">
            {" "}
            {"All Movies >>>"}
          </h1>
          <ScrollArea className=" whitespace-nowrap flex h-[45vh]">
            <div className="flex w-max space-x-4">
              {allmovie.map((MOVIE) => (
                <div
                  onClick={() =>
                    navigate("/video", {
                      state: {
                        title: MOVIE.title,
                        imageUrl: MOVIE.imageUrl,
                        ideoUrl: MOVIE.videoUrl,
                        duration: MOVIE.duration,
                        type: MOVIE.type,
                      },
                    })
                  }
                  key={MOVIE._id}
                  className="group  hover:cursor-pointer relative w-64 h-[43vh] overflow-hidden rounded-md shadow-md border-black"
                >
                  <img
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 group-hover:animate-pulse"
                    src={MOVIE.imageUrl}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-70 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
                    <h1 className="text-lg font-bold truncate">
                      {MOVIE.title}
                    </h1>
                    <p className="text-sm">{MOVIE.type}</p>
                  </div>
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </ScrollArea>
    </div>
  );
};

export default HomePage;
