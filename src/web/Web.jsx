import { useEffect, useState } from 'react';
import Navbar from './Navbar.jsx';
import Hero from './Hero.jsx';
import About from './About.jsx';
import Gallery from './Gallery.jsx';
import Products from './Products.jsx';
import Reviews from './Reviews.jsx';
import Contact from './Contact.jsx';
import Footer from './Footer.jsx';
import useSiteEffects from './effects.js';
import './web.css';

function Loader() {
  const [done, setDone] = useState(!!sessionStorage.getItem('aneli_seen'));
  useEffect(() => {
    const root = document.documentElement;
    if (done) { root.classList.add('ready'); return () => root.classList.remove('ready'); }
    root.classList.add('loading');
    const id = setTimeout(() => { sessionStorage.setItem('aneli_seen', '1'); root.classList.remove('loading'); root.classList.add('ready'); setDone(true); }, 1500);
    return () => { clearTimeout(id); root.classList.remove('loading', 'ready'); };
  }, []);
  return <div className={`loader ${done ? 'done' : ''}`} aria-hidden="true"><img src="/logo.svg" alt="" /><b>Anéli</b><div className="bar"><i /></div></div>;
}

export default function Web(props) {
  const { t } = props;
  useSiteEffects();
  return (
    <>
      <Loader /><div className="progress" />
      <Navbar {...props} />
      <main><Hero t={t} /><About t={t} /><Gallery t={t} /><Products t={t} /><Reviews t={t} /><Contact t={t} /></main>
      <Footer t={t} />
      <a className="totop" href="#home" aria-label="Back to top">↑</a>
    </>
  );
}
