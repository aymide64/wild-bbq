/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  MapPin, 
  Phone, 
  Clock, 
  Star, 
  Menu as MenuIcon, 
  X, 
  ChevronRight, 
  Utensils, 
  Truck, 
  Facebook, 
  Instagram,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
interface MenuItem {
  name: string;
  description: string;
  price?: string;
  image: string;
  category: 'meat' | 'side' | 'plate';
}

interface Review {
  author: string;
  rating: number;
  text: string;
  date: string;
}

// --- Constants ---
const BUSINESS_INFO = {
  name: "Wild Frontier BBQ",
  logoUrl: "https://scontent-los2-1.xx.fbcdn.net/v/t39.30808-6/306190539_452335520273200_3006741625387611652_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=1d70fc&_nc_ohc=DHhoGb19F3gQ7kNvwE5G7-_&_nc_oc=AdmSs0VzNkqRLH2N0hGD3EDSOTsu2hYV_2HbhiyfMXOjsPKuVbb-XY6mOp5TQGNH9is&_nc_zt=23&_nc_ht=scontent-los2-1.xx&_nc_gid=egGhxptNCno6mwNYzxHEXA&oh=00_AfvWApQcxKxa-Y7pE151rWTAP5ePaj1zTn6-5HooU9wWLg&oe=69A61154",
  address: "410 E Frontier Pkwy, Oberlin, KS 67749",
  phone: "(785) 470-4500",
  phoneRaw: "7854704500",
  hours: "Opens at 11:00 AM",
  rating: 4.9,
  reviewCount: 16,
  priceRange: "$10–20 per person",
  googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Wild+Frontier+BBQ+Oberlin+KS"
};

const MENU_ITEMS: MenuItem[] = [
  {
    name: "Smoked Brisket",
    description: "Slow-smoked for 14 hours over local hardwood. Tender, juicy, and perfectly barked.",
    image: "https://scontent-los4-1.xx.fbcdn.net/v/t1.6435-9/71092314_2684456148239716_7200304769557069824_n.jpg?stp=dst-jpg_s206x206_tt6&_nc_cat=100&ccb=1-7&_nc_sid=5df8b4&_nc_ohc=LTttAQFVnfcQ7kNvwHnz5Ue&_nc_oc=Admf30AZx9NoZOaEsKUetLNarPgKdEJMPsimlo2rM4Nuj0EgwKobfnEoy-tCOsiqr9w&_nc_zt=23&_nc_ht=scontent-los4-1.xx&_nc_gid=x27ntXs0OJ41yZzncDm6_g&oh=00_Afs4hU4LmM_AgMfqp9QEUCMuhvmh61o-uoPolkdQaIWJYA&oe=69C7F302",
    category: 'meat'
  },
  {
    name: "Pulled Pork",
    description: "Hand-pulled, seasoned with our signature frontier rub. Smoky and melt-in-your-mouth.",
    image: "https://scontent-los4-1.xx.fbcdn.net/v/t1.6435-9/67083063_2557807497571249_3994862838513401856_n.jpg?stp=c208.0.544.544a_dst-jpg_s206x206_tt6&_nc_cat=103&ccb=1-7&_nc_sid=5df8b4&_nc_ohc=3uszBxfwv4gQ7kNvwEAf2zh&_nc_oc=AdmYshZL7tHCwYp3fSUX7IIAWZcTF_lWC3igMZGx-vj_E1JVDfQe1_EABp_AOBolcqY&_nc_zt=23&_nc_ht=scontent-los4-1.xx&_nc_gid=so-3lYbMxXkG-AJhdIShpA&oh=00_AfsdmRDeU6o0dupE_sRkH8M8R2emFDx4-HaPo4qhPJDM4w&oe=69C7FB1E",
    category: 'meat'
  },
  {
    name: "BBQ Pork & Brisket Plates",
    description: "The best of both worlds. Served with two sides and a slice of Texas toast.",
    image: "https://scontent-los2-1.xx.fbcdn.net/v/t1.6435-9/71552994_2684456041573060_8809322049760657408_n.jpg?stp=dst-jpg_s206x206_tt6&_nc_cat=109&ccb=1-7&_nc_sid=5df8b4&_nc_ohc=5NCkAEvZuiYQ7kNvwHUTuoH&_nc_oc=Adk3FzR6sUAC5jSmZPqVP50ykLMskjctBGROjGgdH5sr1K8R9m3Bn0-NZnr-zmhmTMc&_nc_zt=23&_nc_ht=scontent-los2-1.xx&_nc_gid=x27ntXs0OJ41yZzncDm6_g&oh=00_AfvwYAhUmNBuo2k0jwpjrOd926_o6-UtDPypIO7Fa0NQ-A&oe=69C80814",
    category: 'plate'
  },
  {
    name: "Creamy Corn",
    description: "Sweet corn in a rich, velvety cream sauce. A local favorite.",
    image: "https://scontent-los2-1.xx.fbcdn.net/v/t1.6435-9/67302389_2555847927767206_2360938974240833536_n.jpg?stp=c139.0.682.682a_dst-jpg_s206x206_tt6&_nc_cat=107&ccb=1-7&_nc_sid=5df8b4&_nc_ohc=eOedJa5-ksMQ7kNvwFxZY7p&_nc_oc=AdkRaPR7RXWEeaFooIio4T4yW-6uZPKlnx2u-IVgL_opfL1sGzfpWWB38-vKQv63HXU&_nc_zt=23&_nc_ht=scontent-los2-1.xx&_nc_gid=so-3lYbMxXkG-AJhdIShpA&oh=00_Aft7I7i7CUPwnJx55e2jLNIWJ54v1xfDk-kBnNTi_C5bkQ&oe=69C7F0D6",
    category: 'side'
  },
  {
    name: "BBQ Beans",
    description: "Slow-cooked with brisket burnt ends and a touch of molasses.",
    image: "https://scontent-los4-1.xx.fbcdn.net/v/t1.6435-9/67245779_2574694472549218_1064877084515500032_n.jpg?stp=c202.0.556.556a_dst-jpg_s206x206_tt6&_nc_cat=104&ccb=1-7&_nc_sid=5df8b4&_nc_ohc=rvCyKZVO67QQ7kNvwHb9HqF&_nc_oc=AdnVQAm43HovNs-XDpYju4qYU6Wv6hAsoFt8Ab3w5D_l-VkLpZF_hZtJFFij0FQule8&_nc_zt=23&_nc_ht=scontent-los4-1.xx&_nc_gid=so-3lYbMxXkG-AJhdIShpA&oh=00_Afsq_-EZwTAvzrF6KoaLbwJz84aIQUIFFlmds6IGZuQS6A&oe=69C7F729",
    category: 'side'
  },
  {
    name: "Signature Potatoes",
    description: "Loaded with butter, sour cream, and topped with your choice of smoked meat.",
    image: "https://scontent-los4-1.xx.fbcdn.net/v/t1.6435-9/66403297_2542568735761792_7839201779270025216_n.jpg?stp=c0.79.720.720a_dst-jpg_s206x206_tt6&_nc_cat=104&ccb=1-7&_nc_sid=5df8b4&_nc_ohc=tDnem6HAjcwQ7kNvwFgEzKq&_nc_oc=Adkebnp6RIQr0F_ygJKQgWSUorZhiyBP8_ItHCziKTfSK44w5E6GtnR9WkHK2HA2Amo&_nc_zt=23&_nc_ht=scontent-los4-1.xx&_nc_gid=U0g5raO0hlg1cVx9F6Cqgw&oh=00_AfuHFopW9s9KAQnub19JwwTm6QyetIcJ9j21g5Y5sPC8ZA&oe=69C81316",
    category: 'side'
  }
];

const REVIEWS: Review[] = [
  {
    author: "Local Diner",
    rating: 5,
    text: "Food is off the hook good — it’s addicting!",
    date: "2 months ago"
  },
  {
    author: "Hwy 36 Traveler",
    rating: 5,
    text: "Brisket and pulled pork are so tasty. Best stop on the road.",
    date: "1 month ago"
  },
  {
    author: "BBQ Enthusiast",
    rating: 5,
    text: "Excellent service and friendly people. Authentic flavor.",
    date: "3 weeks ago"
  }
];

// --- Components ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Menu', href: '#menu' },
    { name: 'About', href: '#about' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Reviews', href: '#reviews' },
    { name: 'Catering', href: '#catering' },
    { name: 'Visit', href: '#visit' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-charcoal/95 backdrop-blur-md py-3 shadow-xl' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-fire/50 group-hover:border-fire transition-all">
            <img 
              src={BUSINESS_INFO.logoUrl} 
              alt={BUSINESS_INFO.name} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="font-display text-xl md:text-2xl tracking-tighter hidden sm:block">Wild Frontier BBQ</span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <a key={link.name} href={link.href} className="text-sm font-medium uppercase tracking-widest hover:text-fire transition-colors">
              {link.name}
            </a>
          ))}
          <a 
            href={`tel:${BUSINESS_INFO.phoneRaw}`}
            className="bg-fire hover:bg-burnt text-white px-6 py-2 rounded-full font-bold transition-all transform hover:scale-105"
          >
            Call to Order
          </a>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(true)}>
          <MenuIcon size={28} />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 bg-charcoal z-[60] flex flex-col p-8"
          >
            <div className="flex justify-between items-center mb-12">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-fire">
                  <img src={BUSINESS_INFO.logoUrl} alt={BUSINESS_INFO.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <span className="font-display text-xl">Wild Frontier</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <X size={32} />
              </button>
            </div>
            <div className="flex flex-col gap-8">
              {navLinks.map(link => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-3xl font-display uppercase tracking-tight hover:text-fire"
                >
                  {link.name}
                </a>
              ))}
              <a 
                href={`tel:${BUSINESS_INFO.phoneRaw}`}
                className="bg-fire text-center py-4 rounded-xl font-display text-xl mt-4"
              >
                Call to Order
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://scontent-los4-1.xx.fbcdn.net/v/t1.6435-9/66824634_2553960631289269_9058476242222710784_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=7b2446&_nc_ohc=xJkOXqbM7MQQ7kNvwEHekcn&_nc_oc=AdmiI99YYp1wtxxBC75fj6mYTEeJibux0OSMQP_HAoYgLQyelZuf0FNlc0t2vewrsc8&_nc_zt=23&_nc_ht=scontent-los4-1.xx&_nc_gid=aWE7I5EzdAVNaS9a7e5jQg&oh=00_AfuXiNrKGUaQQApvdfn7J5A9vI9vGKGcOSpqEeZIbFiWgw&oe=69C7CB97" 
          alt="Smoked Brisket" 
          className="w-full h-full object-cover scale-105 animate-pulse-slow"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/60 via-charcoal/40 to-charcoal"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block bg-fire/20 text-fire px-4 py-1 rounded-full text-xs font-bold uppercase tracking-[0.2em] mb-6 backdrop-blur-sm border border-fire/30">
            Oberlin's Finest Roadside BBQ
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl mb-6 leading-[0.9] text-shadow-lg">
            Real Smoke.<br />
            <span className="text-fire">Real Flavor.</span><br />
            No Shortcuts.
          </h1>
          <p className="text-lg md:text-2xl text-white/80 max-w-2xl mx-auto mb-10 font-light">
            Slow-smoked brisket, pulled pork, and classic BBQ sides in the heart of Oberlin, Kansas.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href={`tel:${BUSINESS_INFO.phoneRaw}`}
              className="w-full sm:w-auto bg-fire hover:bg-burnt text-white px-10 py-5 rounded-full font-display text-lg transition-all shadow-2xl shadow-fire/20 flex items-center justify-center gap-2"
            >
              <Phone size={20} />
              Call to Order
            </a>
            <a 
              href={BUSINESS_INFO.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-10 py-5 rounded-full font-display text-lg transition-all flex items-center justify-center gap-2"
            >
              <MapPin size={20} />
              Get Directions
            </a>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/30"
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
          <div className="w-1 h-2 bg-white/30 rounded-full"></div>
        </div>
      </motion.div>
    </section>
  );
};

const SocialProof = () => {
  return (
    <section id="reviews" className="py-24 bg-charcoal relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12 items-center">
          <div className="md:col-span-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="text-fire fill-fire" size={24} />
              ))}
            </div>
            <h2 className="text-4xl md:text-5xl mb-4">Trusted by Locals</h2>
            <div className="flex items-center justify-center md:justify-start gap-4">
              <div className="text-5xl font-display text-fire">{BUSINESS_INFO.rating}</div>
              <div className="text-left">
                <div className="text-sm uppercase tracking-widest text-white/50">Google Rating</div>
                <div className="text-sm font-bold">{BUSINESS_INFO.reviewCount} Verified Reviews</div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 grid sm:grid-cols-2 gap-6">
            {REVIEWS.slice(0, 2).map((review, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="glass-card p-8 relative"
              >
                <div className="absolute top-6 right-8 text-fire/20">
                  <Star size={48} fill="currentColor" />
                </div>
                <p className="text-xl italic mb-6 leading-relaxed text-white/90">"{review.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-fire/20 flex items-center justify-center text-fire font-bold">
                    {review.author[0]}
                  </div>
                  <div>
                    <div className="font-bold text-sm">{review.author}</div>
                    <div className="text-xs text-white/40 uppercase tracking-tighter">{review.date}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const About = () => {
  return (
    <section id="about" className="py-24 bg-smoke relative">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        <div className="relative">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-fire/10 rounded-full blur-3xl"></div>
          <img 
            src="https://scontent-los2-1.xx.fbcdn.net/v/t1.6435-9/67139690_2561471093871556_2269516893083664384_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=7b2446&_nc_ohc=pkjVzMa7q8kQ7kNvwH4CkN8&_nc_oc=AdndHY4PEk9rgfh9xwhE3qMws3SACLf-eI8--wwJUgzXFN5jSq4Pre1Dbj45sOH_cTA&_nc_zt=23&_nc_ht=scontent-los2-1.xx&_nc_gid=aWE7I5EzdAVNaS9a7e5jQg&oh=00_AfsKnIMLtGFOPfsGak9XkQ1qlwg5Xpegk04DJj6opMeYTA&oe=69C7BF51" 
            alt="Pitmaster at work" 
            className="rounded-3xl shadow-2xl relative z-10"
            referrerPolicy="no-referrer"
          />
          <div className="absolute -bottom-6 -right-6 bg-fire p-8 rounded-2xl shadow-xl z-20 hidden md:block">
            <div className="text-4xl font-display mb-1">14+</div>
            <div className="text-xs uppercase tracking-widest font-bold">Hours of Smoke</div>
          </div>
        </div>
        <div>
          <h2 className="text-5xl md:text-6xl mb-8 leading-tight">Authentic. Family-Run. <span className="text-fire">Wildly Good.</span></h2>
          <p className="text-xl text-white/70 leading-relaxed mb-8">
            Wild Frontier BBQ serves authentic, slow-smoked barbecue made with care, patience, and family tradition. From tender brisket and pulled pork to comforting homemade sides, every plate is cooked to satisfy — whether you’re passing through or feeding a crowd.
          </p>
          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-fire/10 rounded-xl text-fire">
                <Flame size={24} />
              </div>
              <div>
                <h4 className="font-bold mb-1">Hardwood Smoked</h4>
                <p className="text-sm text-white/50">Local wood for that deep, smoky flavor profile.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-fire/10 rounded-xl text-fire">
                <Utensils size={24} />
              </div>
              <div>
                <h4 className="font-bold mb-1">Homemade Sides</h4>
                <p className="text-sm text-white/50">Family recipes passed down through generations.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const MenuHighlights = () => {
  return (
    <section id="menu" className="py-24 bg-charcoal">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-7xl mb-4">Signature Flavors</h2>
          <p className="text-white/50 uppercase tracking-[0.3em] text-sm">Our most-wanted smoked meats & sides</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {MENU_ITEMS.map((item, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className="group relative overflow-hidden rounded-3xl bg-smoke border border-white/5 flex flex-col"
            >
              <div className="aspect-square overflow-hidden bg-charcoal">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-6 md:p-8 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl leading-none">{item.name}</h3>
                  <span className="text-fire font-mono text-sm">★ Signature</span>
                </div>
                <p className="text-white/60 text-sm leading-relaxed mb-6">
                  {item.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-widest font-bold text-white/30">{item.category}</span>
                  <ChevronRight className="text-fire group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <a 
            href={`tel:${BUSINESS_INFO.phoneRaw}`}
            className="inline-flex items-center gap-3 bg-fire hover:bg-burnt text-white px-12 py-6 rounded-full font-display text-xl transition-all shadow-2xl shadow-fire/30"
          >
            <Phone size={24} />
            Call to Order Full Menu
          </a>
        </div>
      </div>
    </section>
  );
};

const Gallery = () => {
  const images = [
    "https://scontent-los4-1.xx.fbcdn.net/v/t1.6435-9/75120118_2774644989220831_6503415616764903424_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=0327a3&_nc_ohc=Ed5S0S9jZE8Q7kNvwGj6Zu4&_nc_oc=Adk6HcyhwSNoMlWghwG9-NsVoxQYjGYyfMhg3zTNbh46VyH4qIYH08yosNMdMoCLllo&_nc_zt=23&_nc_ht=scontent-los4-1.xx&_nc_gid=ulXEJ08JaVkHQeyoEZTyMg&oh=00_Afu9xrApf52A_OLyCdmhBKD-lZM3VUbbVVO3rNWvdHPf9Q&oe=69C7B71E",
    "https://scontent-los2-1.xx.fbcdn.net/v/t1.6435-9/77093078_2828967263788603_5719085774549286912_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=0327a3&_nc_ohc=snm3cRBFULcQ7kNvwHLJWD2&_nc_oc=AdmgiF2XfLGefQu2IAepAImPUEzHq8dbZDnxocrOtqOdUEcvoZUjAUyIG6FR9uLF8xs&_nc_zt=23&_nc_ht=scontent-los2-1.xx&_nc_gid=rdXq3qxKKqsx7ICtZq0fwA&oh=00_Afu0_hWeStxwyT8aCGLUtOYX4Kkj7hFFuvda7i1RnlHzIA&oe=69C7C287",
    "https://scontent-los2-1.xx.fbcdn.net/v/t1.6435-9/70506207_2680648651953799_1704809984505675776_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=7b2446&_nc_ohc=Yo3a0Ed70CgQ7kNvwHPnP0A&_nc_oc=AdlUcja6Vd7qP2lL3_wNIJ-tennEowxY4Z-pIsqcOe4NXAol9AAiqJKdkeucCBAHVpU&_nc_zt=23&_nc_ht=scontent-los2-1.xx&_nc_gid=vng9MAubz63U5eqOoTDxTw&oh=00_AfsefmgLNVVdqd5J1XAjT1P2ItAQcZb_gxhOUPdMaOjLpA&oe=69C7B5EA",
    "https://scontent-los2-1.xx.fbcdn.net/v/t1.6435-9/70223809_2657623720922959_3634461262143815680_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=2a1932&_nc_ohc=FKx5k0tUEt4Q7kNvwEA9IM8&_nc_oc=AdkEWK_j83XEeg7PDLW5cNYBGYWWEVe56r_MlBMT4mxVn_Aa2g9UyH96ObAMQLVZJxw&_nc_zt=23&_nc_ht=scontent-los2-1.xx&_nc_gid=GOEKFJoCPWy1FH1Kvut4Bg&oh=00_Aft7AaJf-MfYR5q9MDER4dTLJe5xsvHEiRSnSezgK8crnw&oe=69C7C699",
    "https://scontent-los4-1.xx.fbcdn.net/v/t39.30808-6/553301122_25124889313769746_3211575069020758797_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=f798df&_nc_ohc=1lJbfhFLVLcQ7kNvwEWj9Lj&_nc_oc=AdnQtvYgShlv2cFeM6CUlQWYK2ujkvyeZ1w7YIChEUwveCWKRBnLt48MmGra9PYmCJI&_nc_zt=23&_nc_ht=scontent-los4-1.xx&_nc_gid=ImJJKEANAmgx4LyZW_wWOQ&oh=00_Afsx52T-v5woSqMmIOMGCozvmHX-d9EqW2mr9TSSjo-Z1Q&oe=69A62846",
    "https://scontent-los2-1.xx.fbcdn.net/v/t39.30808-6/551028184_25124889460436398_7323730026546097935_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=f798df&_nc_ohc=5eRNHVQzn9YQ7kNvwE3oxtx&_nc_oc=AdmA3Ax-Dpm4ja8f_T9U7UhYd0ltHwkMT8BlqM0Uy2VJf1ELPBfkOnDoVszNpMnKRu4&_nc_zt=23&_nc_ht=scontent-los2-1.xx&_nc_gid=781A72TvtFs9eSHZZYUNiA&oh=00_AfstCN4MPSwAXEVP4H-_XRRRwYlumHos66D_hBAKeJ7cVQ&oe=69A63483",
  ];

  return (
    <section id="gallery" className="py-24 bg-smoke">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-7xl mb-4">The Pit Gallery</h2>
          <p className="text-white/50 uppercase tracking-[0.3em] text-sm">A glimpse into the smoke</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
          {images.map((src, i) => (
            <motion.div 
              key={i}
              whileHover={{ scale: 1.02 }}
              className="aspect-square rounded-2xl md:rounded-[2rem] overflow-hidden border border-white/10"
            >
              <img 
                src={src} 
                alt={`Gallery image ${i + 1}`} 
                className="w-full h-full object-cover hover:rotate-2 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const RoadsideHighlight = () => {
  return (
    <section className="py-24 bg-wood-texture relative">
      <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-charcoal/80 backdrop-blur-xl p-12 md:p-20 rounded-[3rem] border border-white/10 shadow-3xl"
        >
          <h2 className="text-5xl md:text-7xl mb-8">Worth the Stop on <span className="text-fire">Hwy 36</span></h2>
          <p className="text-xl md:text-2xl text-white/80 leading-relaxed mb-10 max-w-3xl mx-auto font-light">
            A small takeout-style BBQ spot with picnic tables, big flavor, and a reputation that keeps people coming back. Whether you're a local or just passing through, the smoke will lead you here.
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-fire/20 flex items-center justify-center text-fire">
                <MapPin size={24} />
              </div>
              <span className="font-bold">Easy Access off Hwy 36</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-fire/20 flex items-center justify-center text-fire">
                <Utensils size={24} />
              </div>
              <span className="font-bold">Outdoor Picnic Seating</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Catering = () => {
  return (
    <section id="catering" className="py-24 bg-smoke">
      <div className="max-w-7xl mx-auto px-6">
        <div className="glass-card overflow-hidden grid md:grid-cols-2">
          <div className="p-12 md:p-20 flex flex-col justify-center">
            <div className="flex items-center gap-3 text-fire mb-6">
              <Truck size={32} />
              <span className="uppercase tracking-[0.3em] font-bold text-sm">Events & Groups</span>
            </div>
            <h2 className="text-5xl md:text-6xl mb-6">Catering & Custom Orders</h2>
            <p className="text-xl text-white/60 mb-10 leading-relaxed">
              Perfect for events, family gatherings, and group meals. We handle the smoke so you can handle the fun. Custom meat quantities and side trays available.
            </p>
            <a 
              href={`tel:${BUSINESS_INFO.phoneRaw}`}
              className="inline-flex items-center justify-center gap-3 bg-white text-charcoal hover:bg-white/90 px-10 py-5 rounded-full font-display text-lg transition-all"
            >
              Call for Catering
            </a>
          </div>
          <div className="relative h-80 md:h-auto">
            <img 
              src="https://scontent-los4-1.xx.fbcdn.net/v/t1.6435-9/64655908_2501759523176047_2251668769938079744_n.jpg?stp=c0.291.1133.1133a_dst-jpg_s206x206_tt6&_nc_cat=104&ccb=1-7&_nc_sid=5df8b4&_nc_ohc=hpsh2FXgH_sQ7kNvwFsNLfw&_nc_oc=AdkStczNJYGZKYrRynwKzdD066YgfRrEbgHoBXJmqO_nQq7GMMudZ8dfUPHPGvnJeYI&_nc_zt=23&_nc_ht=scontent-los4-1.xx&_nc_gid=U0g5raO0hlg1cVx9F6Cqgw&oh=00_AftrF1CrDao8Zyex79SA9r6DFPjaUlqscr02EFzXlW5gGA&oe=69C7F967" 
              alt="Catering spread" 
              className="absolute inset-0 w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-fire/20 mix-blend-overlay"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

const VisitInfo = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const now = new Date();
    const hours = now.getHours();
    // Simple logic: Open at 11 AM, close at 8 PM (assumed)
    setIsOpen(hours >= 11 && hours < 20);
  }, []);

  return (
    <section id="visit" className="py-24 bg-charcoal">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16">
        <div>
          <h2 className="text-5xl mb-12">Find the Frontier</h2>
          <div className="space-y-10">
            <div className="flex items-start gap-6">
              <div className="w-14 h-14 rounded-2xl bg-fire/10 flex items-center justify-center text-fire shrink-0">
                <MapPin size={28} />
              </div>
              <div>
                <div className="text-sm uppercase tracking-widest text-white/40 mb-1 font-bold">Location</div>
                <p className="text-2xl font-medium">{BUSINESS_INFO.address}</p>
                <a 
                  href={BUSINESS_INFO.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-fire hover:underline inline-flex items-center gap-1 mt-2 font-bold"
                >
                  Get Directions <ExternalLink size={14} />
                </a>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-14 h-14 rounded-2xl bg-fire/10 flex items-center justify-center text-fire shrink-0">
                <Clock size={28} />
              </div>
              <div>
                <div className="text-sm uppercase tracking-widest text-white/40 mb-1 font-bold">Hours</div>
                <div className="flex items-center gap-3">
                  <p className="text-2xl font-medium">{BUSINESS_INFO.hours}</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${isOpen ? 'bg-emerald-500/20 text-emerald-400' : 'bg-fire/20 text-fire'}`}>
                    {isOpen ? 'Open Now' : 'Closed Now'}
                  </span>
                </div>
                <p className="text-white/40 mt-1">Daily: 11:00 AM – 8:00 PM (or until sold out)</p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-14 h-14 rounded-2xl bg-fire/10 flex items-center justify-center text-fire shrink-0">
                <Phone size={28} />
              </div>
              <div>
                <div className="text-sm uppercase tracking-widest text-white/40 mb-1 font-bold">Contact</div>
                <p className="text-2xl font-medium">{BUSINESS_INFO.phone}</p>
                <p className="text-white/40 mt-1">Call for orders, catering, or daily specials.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 h-[500px] relative group bg-smoke">
          <iframe 
            width="100%" 
            height="100%" 
            frameBorder="0" 
            scrolling="no" 
            marginHeight={0} 
            marginWidth={0} 
            src="https://maps.google.com/maps?q=410%20E%20Frontier%20Pkwy,%20Oberlin,%20KS%2067749&t=&z=15&ie=UTF8&iwloc=&output=embed"
            className="grayscale invert brightness-75 contrast-125 opacity-60 group-hover:grayscale-0 group-hover:invert-0 group-hover:opacity-100 group-hover:brightness-100 transition-all duration-1000"
          ></iframe>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <a 
              href={BUSINESS_INFO.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-fire text-white px-8 py-4 rounded-full font-display text-lg shadow-2xl transform hover:scale-110 transition-all flex items-center gap-2 pointer-events-auto"
            >
              <MapPin size={20} /> Open in Google Maps
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-charcoal pt-24 pb-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-6xl md:text-8xl mb-8">Once You Taste It,<br /><span className="text-fire">You’ll Be Back.</span></h2>
          <a 
            href={`tel:${BUSINESS_INFO.phoneRaw}`}
            className="inline-flex items-center gap-3 bg-fire hover:bg-burnt text-white px-12 py-6 rounded-full font-display text-2xl transition-all shadow-2xl shadow-fire/40"
          >
            Call Wild Frontier BBQ
          </a>
        </div>

        <div className="grid md:grid-cols-4 gap-12 py-12 border-t border-white/5">
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-fire">
                <img src={BUSINESS_INFO.logoUrl} alt={BUSINESS_INFO.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <span className="font-display text-2xl">Wild Frontier</span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed">
              Authentic slow-smoked BBQ in Oberlin, KS. Real smoke, real flavor, no shortcuts.
            </p>
          </div>
          <div>
            <h4 className="font-display text-lg mb-6">Quick Links</h4>
            <ul className="space-y-4 text-sm text-white/60">
              <li><a href="#menu" className="hover:text-fire transition-colors">Menu Highlights</a></li>
              <li><a href="#about" className="hover:text-fire transition-colors">Our Story</a></li>
              <li><a href="#catering" className="hover:text-fire transition-colors">Catering Services</a></li>
              <li><a href="#visit" className="hover:text-fire transition-colors">Find Us</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display text-lg mb-6">Visit Us</h4>
            <div className="text-sm text-white/60 space-y-2">
              <p>{BUSINESS_INFO.address}</p>
              <p>{BUSINESS_INFO.phone}</p>
              <p className="text-fire font-bold">{BUSINESS_INFO.hours}</p>
            </div>
          </div>
          <div>
            <h4 className="font-display text-lg mb-6">Follow the Smoke</h4>
            <div className="flex gap-4">
              <a href="#" className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-fire transition-all">
                <Facebook size={20} />
              </a>
              <a href="#" className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-fire transition-all">
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-white/30 uppercase tracking-widest">
            © 2026 Wild Frontier BBQ. All Rights Reserved.
          </p>
          <div className="flex gap-8 text-xs text-white/30 uppercase tracking-widest">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const StickyCallButton = () => {
  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-6 left-6 right-6 z-40 md:hidden"
    >
      <a 
        href={`tel:${BUSINESS_INFO.phoneRaw}`}
        className="w-full bg-fire text-white py-4 rounded-2xl font-display text-xl shadow-2xl flex items-center justify-center gap-3"
      >
        <Phone size={24} />
        Call Now to Order
      </a>
    </motion.div>
  );
};

// --- Main App ---

export default function App() {
  return (
    <div className="min-h-screen bg-charcoal selection:bg-fire selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <SocialProof />
        <About />
        <Gallery />
        <MenuHighlights />
        <RoadsideHighlight />
        <Catering />
        <VisitInfo />
      </main>
      <Footer />
      <StickyCallButton />
    </div>
  );
}
