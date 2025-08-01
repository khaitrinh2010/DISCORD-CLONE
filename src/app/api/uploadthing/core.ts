import { createUploadthing, type FileRouter } from "uploadthing/next";
import {auth} from "@clerk/nextjs/server";

const f = createUploadthing();


// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
    // Define as many FileRoutes as you like, each with a unique routeSlug
    serverImage: f({ image: { maxFileSize: "4MB" } })
        // Set permissions and file types for this FileRoute
        .middleware(async ({ req }) => {
            // This code runs on your server before upload
            const user = await auth();
            if (!user) throw new Error("Unauthorized");
            console.log(user)
            return { userId: user.userId };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            // This code RUNS ON YOUR SERVER after upload
            console.log("Upload complete for userId:", metadata.userId);
            console.log("file url", file.url);
            return { uploadedBy: metadata.userId };
        }),
    messageFile: f(["image", "video", "audio", "pdf"])
        .middleware(async ({ req }) => {
            // This code runs on your server before upload
            const user = await auth();
            if (!user) throw new Error("Unauthorized");
            console.log(user)
            return { userId: user.userId };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            // This code RUNS ON YOUR SERVER after upload
            console.log("Upload complete for userId:", metadata.userId);
            console.log("file url", file.url);
            return { uploadedBy: metadata.userId };
        })

} satisfies FileRouter;
export type OurFileRouter = typeof ourFileRouter;
