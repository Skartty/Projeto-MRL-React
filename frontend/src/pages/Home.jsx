import Header from "../components/HeaderHome";
import Hero from "../components/Hero";
import Sobre from "../components/Sobre";
import Servicos from "../components/Servicos";
import AuthSection from "../components/AuthSection";
import Avaliacoes from "../components/Avaliacoes"; 
import Footer from "../components/Footer";



function Home({ tema, setTema }) {  
  return (
    <>
    <Header tema={tema} setTema={setTema} />    
    <Hero />
    <Sobre tema={tema} />    
    <Servicos />
    <AuthSection />
    <Avaliacoes />
    <Footer />
    </>
  );
}

export default Home;