import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Theater, TheaterIcon, Trash2, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Link, Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const AdminPage = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return Navigate({ to: "/" });
  }

  interface MovieType {
    _id: string;
    title: string;
    type: string;
    duration: number;
    imageUrl: string;
    videoUrl: string;
  }

  const navigate = useNavigate();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [movie, setMovie] = useState<MovieType[]>([]);
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<{
    video: File | null;
    image: File | null;
  }>({
    video: null,
    image: null,
  });

  useEffect(() => {
    getMovies();
  }, []);

  const getMovies = async () => {
    try {
      const Data = await fetch("http://localhost:5000/api/movies", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const response = await Data.json();
      setMovie(response);
    } catch (error) {
      console.log("error in fetting movies", error);
      toast.error("Failed to fetch movies");
    }
  };

  const handleSubmit = async () => {
    if (!files.image || !files.video) {
      toast.error("please select image and video");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("type", type);
    formData.append("duration", duration);
    formData.append("image", files.image);
    formData.append("video", files.video);

    try {
      const result = await fetch("http://localhost:5000/api/admin/create", {
        method: "POST",
        body: formData,
      });
      if (!result.ok) {
        return toast.error("Upload Failed");
      }
      const response = await result.json();
      console.log("Success:", response);
      toast.success("Movie uploaded successfully!");
      console.log(result);
      setTitle("");
      setDuration("");
      setType("");
      setFiles({ video: null, image: null });
      await getMovies();
      navigate("/admin");
    } catch (error) {
      console.log(error);
      toast.error("Movie  not uploaded!");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: String) => {
    try {
      await fetch(`http://localhost:5000/api/admin/delete/${id}`, {
        method: "DELETE",
      });
      await getMovies();
      toast.success("Delete Successfully");
    } catch (error) {
      console.log("error in deleting", error);
      toast.error("Deleting Failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900 to-black text-zinc-100 p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 mb-8">
          <Link to="/home" className="rounded-lg">
            <img
              src="/mx-player-logo-450x450.png"
              className="size-10 text-black"
            />
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Movies Manager</h1>
            <p className="text-zinc-400 mt-1">Manage your movie catalog</p>
          </div>
        </div>
      </div>
      <Tabs defaultValue="songs" className="  space-y-6">
        <TabsList className="p-1 bg-zinc-800/50">
          <TabsTrigger
            value="songs"
            className="data-[state=active]:bg-zinc-700 hover:cursor-pointer"
          >
            <Theater className="mr-2 size-4" />
            Movies
          </TabsTrigger>
        </TabsList>

        <TabsContent className="bg-black" value="songs">
          <Card>
            <CardHeader>
              <div className="flex  items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <TheaterIcon className="size-5 text-emerald-500" />
                    Movie Library
                  </CardTitle>
                  <CardDescription>Manage your movie tracks</CardDescription>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-emerald-500 hover:bg-emerald-600 hover:cursor-pointer text-black">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Movie
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="bg-zinc-900 text-white border-zinc-700 max-h-[80vh] overflow-auto">
                    <DialogHeader>
                      <DialogTitle>Add New Movie</DialogTitle>
                      <DialogDescription>
                        Add a new movie to your movie library
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                      <input
                        type="file"
                        accept="video/*"
                        ref={videoInputRef}
                        hidden
                        onChange={(e) =>
                          setFiles((prev) => ({
                            ...prev,
                            video: e.target.files![0],
                          }))
                        }
                      />

                      <input
                        type="file"
                        ref={imageInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={(e) =>
                          setFiles((prev) => ({
                            ...prev,
                            image: e.target.files![0],
                          }))
                        }
                      />
                      <div
                        className="flex items-center justify-center p-6 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer"
                        onClick={() => imageInputRef.current?.click()}
                      >
                        <div className="text-center">
                          {files.image ? (
                            <div className="space-y-2">
                              <div className="text-sm text-emerald-500 ">
                                Image selected:
                              </div>
                              <div className="text-xs text-zinc-400">
                                {files.image.name.slice(0, 20)}
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="p-3 bg-zinc-800 rounded-full inline-block mb-2">
                                <Upload className="h-6 w-6 text-zinc-400" />
                              </div>
                              <div className="text-sm text-zinc-400 mb-2">
                                Upload artwork
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs text-black"
                              >
                                Choose File
                              </Button>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Video File
                        </label>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            onClick={() => videoInputRef.current?.click()}
                            className="w-full text-black hover:cursor-pointer"
                          >
                            {files.video
                              ? files.video.name.slice(0, 20)
                              : "Choose Video File"}
                          </Button>
                        </div>
                      </div>

                      {/* other fields */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Title</label>
                        <Input
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="bg-zinc-800 border-zinc-700"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Type</label>
                        <Input
                          value={type}
                          onChange={(e) => setType(e.target.value)}
                          className="bg-zinc-800 border-zinc-700"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Duration (seconds)
                        </label>
                        <Input
                          type="number"
                          min="0"
                          className="bg-zinc-800 border-zinc-700"
                          value={duration}
                          onChange={(e) => {
                            const number = e.target.value;
                            setDuration(number);
                          }}
                        />
                      </div>
                    </div>

                    <DialogFooter>
                      <Button
                        variant="outline"
                        className="hover:cursor-pointer text-black"
                        onClick={() => navigate("/admin")}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSubmit}
                        className="hover:cursor-pointer"
                      >
                        {loading ? "Creating..." : "Add Movie"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
          </Card>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-zinc-800/50 ">
                <TableHead className="w-[50px] text-white"></TableHead>
                <TableHead className=" text-white">Title</TableHead>
                <TableHead className=" text-white">Type</TableHead>
                <TableHead className=" text-white">Duration</TableHead>
                <TableHead className="text-right text-white">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {movie.map((Movie) => (
                <TableRow
                  key={Movie._id || Math.random()}
                  className="hover:bg-zinc-800/50"
                >
                  <TableCell>
                    <img
                      src={Movie.imageUrl || "/placeholder.png"}
                      alt={Movie.title}
                      className="size-10 rounded object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{Movie.title}</TableCell>
                  <TableCell>{Movie.type}</TableCell>
                  <TableCell>{Movie.duration}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-300 hover:cursor-pointer hover:bg-red-400/10"
                        onClick={() => handleDelete(Movie._id)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default AdminPage;
