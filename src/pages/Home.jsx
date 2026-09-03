import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import DestinationExplorer from "../components/DestinationExplorer";
import AIAssistant from "../components/AIAssistant";
import ItineraryGenerator from "../components/ItineraryGenerator";
import "./Home.css";

function Home() {
  return (
    <main className="home">
      <Navbar />

      <Hero />

      <DestinationExplorer />

      <AIAssistant />

      <ItineraryGenerator />
    </main>
  );
}

export default Home;