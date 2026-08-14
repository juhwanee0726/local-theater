import MainPage from "#/MainPage";
import GalleryPage from "#/media/pages/GalleryPage";
import ImagePage from "#/media/pages/ImagePage";
import VideoPage from "#/media/pages/VideoPage";
import { createBrowserRouter } from "react-router";

const mediaRouter = createBrowserRouter([
    {
        path: "/",
        element: <MainPage />
    },
    {
        path: "/videos",
        element: <GalleryPage type="video" />
    },
    {
        path: "/videos/:id",
        element: <VideoPage/>
    },
    {
        path: "/images",
        element: <GalleryPage type="image" />
    },
    {
        path: "/images/:id",
        element: <ImagePage />
    }, 
])

export default mediaRouter;
