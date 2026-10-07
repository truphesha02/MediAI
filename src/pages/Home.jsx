import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import AISection from "../components/AISection";
import Stats from "../components/Stats";
import Footer from "../components/Footer";

function Home() {
  return (
    <div>

      {/* Navigation */}
      <Navbar />


      {/* Hero / Home Section */}

      <section id="home">
        <Hero />
      </section>


      {/* Features Section */}

      <section
        id="features"
        className="scroll-mt-24"
      >
        <Features />
      </section>


      {/* About Section */}

      <section
        id="about"
        className="scroll-mt-24"
      >
        <AISection />
      </section>


      {/* Statistics */}

      <Stats />


      {/* Contact / Footer */}

      <section
        id="contact"
        className="scroll-mt-24"
      >
        <Footer />
      </section>

    </div>
  );
}

export default Home;