import PodcastCard from "@/components/cards/PodcastCard";
import { podcastData } from "@/lib/constants";

export default function Home() {
  return (
    <div className="mt-9 flex flex-col gap-9">
      <section className="flex flex-col gap-5">
        <h1 className="text-20 font-bold text-white-1">Trending Podcasts</h1>

        <div className="podcast_grid">
          {podcastData.map((podcast) => (
            <PodcastCard
              key={podcast.id}
              title={podcast.title}
              description={podcast.description}
              imgUrl={podcast.imgURL}
              podcastId={podcast.id}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
