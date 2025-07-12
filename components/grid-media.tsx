"use client";
export default function GridMedia({ media }: { media: string[] }) { 
  let mediaLinks: string[] = [];
  media.forEach((item) => {
    if (item === null) { 
      // do nothing
    }
    if (typeof(item)==="string" && item.includes("https://")) { 
      mediaLinks.push(item);
    }
  })
  if (mediaLinks.length > 0) { 
    return (
      <div className="grid grid-cols-2 gap-4">
        {mediaLinks.map((item, index) => {
          if (item.includes("mp4")) { 
            return (
              <div key={index} className="relative">
                <video src={item} controls className="w-full h-full object-cover" />
              </div>
            )
          }
          return (
            <div key={index} className="relative">
              <img src={item} alt={`Image ${index}`} className="w-full h-full object-cover" />
            </div>
          )
        })}
    </div>
    )
  }
  else {
    return (
      <div>&nbsp;</div>
    )
  }
}