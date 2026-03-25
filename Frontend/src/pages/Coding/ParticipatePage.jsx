import ImageCarousel from "../../components/ImageCarousel";

// Importing images from assets
import codingContestImg from "../../assets/coding_contests.png";
import teamWorkImg from "../../assets/teamwork.png";
import comingSoonImg from "../../assets/coming_soon.png";

const ParticipatePage = () => {
  const images = [codingContestImg, teamWorkImg, comingSoonImg];

  return (
    <main className="bg-ch-dark min-h-screen px-4 sm:px-6 lg:px-20 py-10">
      <section className="max-w-7xl mx-auto text-center mb-10">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-ch-text mb-4">
          Participate & Showcase Your Skills
        </h1>
        <p className="text-ch-muted max-w-2xl mx-auto text-base sm:text-lg">
          Join exciting challenges, compete with peers, and get recognized.
          Discover opportunities designed to help you grow!
        </p>
      </section>

      <section className="max-w-5xl mx-auto mb-16">
        <ImageCarousel images={images} />
      </section>

      <section className="max-w-4xl mx-auto card-surface p-6 sm:p-10 text-center">
        <h2 className="font-display text-2xl font-semibold text-ch-text mb-4">
          Ready to Get Started?
        </h2>
        <p className="text-ch-muted mb-6">
          Stay tuned for upcoming coding events and project collaborations. You
          can participate as an individual or form a team.
        </p>
        <button
          className="btn-outline cursor-not-allowed opacity-60"
          title="Coming Soon"
          disabled
        >
          Coming Soon
        </button>
      </section>
    </main>
  );
};

export default ParticipatePage;
