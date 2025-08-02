import { client } from "@/sanity/lib/client";

export async function fetchImageDetails(imageId: string) {
  const imageQuery = `*[_type == "images" && _id == $imageId]{
    mainImage {
      asset->{
        url,
        metadata {
          dimensions {
            width,
            height
          }
        }
      },
      alt
    }
}[0]`;

  return await client.fetch(imageQuery, { imageId });
}

export async function fetchVideoDetails(videoId: string) {
  const videoQuery = `*[_type == "videos" && _id == $videoId]{
    video {
      asset->{
        url
      },
      alt
    }
}[0]`;

  return await client.fetch(videoQuery, { videoId });
}
