import Header from "../components/Navigation/Header";
import Footer from "../components/Navigation/Footer";

const AboutUs = () => {
  const teamMembers = [
    { name: "Aditya Gupta" },
    { name: "Ishan Ray" },
    { name: "Pratham Varma" },
    { name: "Priyanshu Mishra" },
  ];

  return (
    <>
      <Header />
      <main className="bg-white min-h-screen py-16 px-6 font-inter text-gray-900">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">About Us</h1>
          <h2 className="text-gray-500 font-medium text-base mb-10">
            Building the future of coding education
          </h2>

          <p className="text-[0.95rem] leading-relaxed mb-6">
            <span className="font-semibold">CodeHat</span> is a platform
            designed to make coding education accessible, engaging, and focused
            on skill development. We believe in creating an environment where
            learners can practice, compete, and grow without the pressure of
            ranks or popularity.
          </p>

          <p className="text-[0.95rem] leading-relaxed mb-6">
            Our mission is simple: provide clean, anonymous problem-solving
            through a level-based approach that emphasizes fair competition and
            meaningful learning.
          </p>

          <hr className="my-10 border-gray-300" />

          <h3 className="text-xl font-semibold mb-6">The Team</h3>

          <div className="relative mb-10">
            {/* Decorative code bracket */}
            <div className="absolute -left-2 top-0 bottom-0 flex flex-col justify-between text-gray-300 text-2xl font-mono">
              <span>&#123;</span>
              <span>&#125;</span>
            </div>

            <div className="pl-6 space-y-3">
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="group flex items-center gap-3 py-2 px-4 rounded-md hover:bg-gray-50 transition-all"
                >
                  <span className="text-gray-400 font-mono text-sm group-hover:text-gray-600 transition-colors">
                    0{index + 1}
                  </span>
                  <div className="h-px w-8 bg-gray-300 group-hover:w-12 group-hover:bg-gray-400 transition-all"></div>
                  <span className="text-base font-medium text-gray-900 group-hover:translate-x-1 transition-transform">
                    {member.name}
                  </span>
                </div>
              ))}
            </div>

            {/* Bottom decorative line */}
            <div className="mt-4 flex items-center gap-2 text-gray-300">
              <div className="h-px flex-1 bg-gray-200"></div>
              <span className="text-xs font-mono">
                team.length = {teamMembers.length}
              </span>
              <div className="h-px flex-1 bg-gray-200"></div>
            </div>
          </div>

          <hr className="my-10 border-gray-300" />

          <h3 className="text-xl font-semibold mb-6">What We Value</h3>

          <div className="space-y-5 mb-10">
            <div>
              <h4 className="text-base font-semibold mb-1">Innovation</h4>
              <p className="text-[0.95rem] leading-relaxed text-gray-700">
                Continuously improving our platform to enhance the learning
                experience.
              </p>
            </div>

            <div>
              <h4 className="text-base font-semibold mb-1">Community</h4>
              <p className="text-[0.95rem] leading-relaxed text-gray-700">
                Building a supportive environment where learners help each other
                grow.
              </p>
            </div>

            <div>
              <h4 className="text-base font-semibold mb-1">Excellence</h4>
              <p className="text-[0.95rem] leading-relaxed text-gray-700">
                Committed to delivering high-quality content and a seamless user
                experience.
              </p>
            </div>
          </div>

          <p className="text-[0.95rem] leading-relaxed mt-10">
            Whether you're just starting out or you're a seasoned developer,
            CodeHat has something for you. Join us on this journey to master
            programming.
          </p>

          <p className="text-sm text-gray-500 mt-10 italic">
            Last updated: November 2025
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default AboutUs;
