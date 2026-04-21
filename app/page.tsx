import ClientShell from "@/components/ClientShell";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <ClientShell>
      <Navbar />
      <main>
        <Hero />
        <div
          style={{
            background: "linear-gradient(180deg, var(--bg) 0%, var(--bg-card) 50%, var(--bg) 100%)",
          }}
        >
          <About />
          <Experience />
          <Skills />
          <Projects />
          <Contact />
        </div>
      </main>
      <Footer />
    </ClientShell>
  );
}
