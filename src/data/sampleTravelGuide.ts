import { CustomCTA } from '@/components/travel-guide/CustomCTASection'

export const sampleTravelGuideData = {
  id: "rome-3-day-guide",
  title: "Rome in 3 Days: The Perfect Itinerary for First-Time Visitors",
  slug: "rome-3-day-perfect-itinerary",
  excerpt: "Discover the eternal city with our expertly crafted 3-day Rome itinerary. From the Colosseum to the Vatican, uncover the secrets of ancient Rome and create unforgettable memories.",
  content: `Rome wasn't built in a day, but you can certainly experience its magic in just three days! This comprehensive guide will take you through the most iconic sights, hidden gems, and authentic experiences that make Rome one of the world's most captivating destinations.

The eternal city seamlessly blends ancient history with modern Italian culture, creating an atmosphere that's both timeless and vibrant. From the moment you step into the cobblestone streets, you'll be transported back in time while enjoying the best of contemporary Roman life.

Our carefully crafted itinerary balances must-see attractions with authentic local experiences, ensuring you get the most out of your Roman holiday. Whether you're interested in ancient history, Renaissance art, or simply want to indulge in incredible Italian cuisine, this guide has everything you need.

Each day is designed to maximize your time while minimizing travel distances, allowing you to truly immerse yourself in the Roman experience. We've included insider tips, local recommendations, and practical advice to help you navigate the city like a pro.

From sunrise visits to the Colosseum to sunset aperitivos in Trastevere, every moment of your Roman adventure has been thoughtfully planned. Get ready to fall in love with the city that has captured hearts for over two millennia.

The best part? This itinerary is flexible enough to adapt to your interests and energy levels, ensuring that your Roman holiday is everything you've dreamed of and more. Let's begin your journey through the eternal city!`,
  featured_image: "https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=1200&h=600&fit=crop",
  published_at: "January 15, 2024",
  read_time_minutes: 12,
  author_name: "Aditya Aman",
  author_image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
  destination: "Rome, Italy",
  tags: ["Rome", "Italy", "3 Days", "First Time", "Ancient History", "Vatican", "Colosseum", "Food Guide"],
  cms_sections: [
    {
      id: "featured-tours",
      type: "product_carousel" as const,
      title: "Essential Rome Tours & Experiences",
      subtitle: "Skip the lines and maximize your time with these carefully selected tours",
      content: [
        {
          id: "colosseum-tour",
          title: "Colosseum Underground & Forum Skip-the-Line Tour",
          slug: "colosseum-underground-forum-tour",
          short_description: "Explore the underground chambers and arena floor of Rome's most iconic landmark with expert guides.",
          price: 89,
          rating: 4.8,
          review_count: 2847,
          duration: "3 hours",
          max_group_size: 15,
          main_image_url: "https://images.unsplash.com/photo-1539650116574-75c0c6d73613?w=400&h=300&fit=crop",
          featured: true,
          categories: { name: "Historical Tours" },
          cities: { name: "Rome" }
        },
        {
          id: "vatican-tour",
          title: "Vatican Museums & Sistine Chapel Early Access",
          slug: "vatican-museums-sistine-chapel-early-access",
          short_description: "Beat the crowds with exclusive early morning access to the Vatican Museums and Sistine Chapel.",
          price: 75,
          rating: 4.9,
          review_count: 1923,
          duration: "2.5 hours",
          max_group_size: 20,
          main_image_url: "https://images.unsplash.com/photo-1585159812596-d4b1f2d6c9e7?w=400&h=300&fit=crop",
          featured: true,
          categories: { name: "Art & Culture" },
          cities: { name: "Rome" }
        },
        {
          id: "food-tour",
          title: "Authentic Roman Food Tour in Trastevere",
          slug: "authentic-roman-food-tour-trastevere",
          short_description: "Discover the real flavors of Rome with tastings at local trattorias and markets.",
          price: 65,
          rating: 4.7,
          review_count: 1456,
          duration: "3.5 hours",
          max_group_size: 12,
          main_image_url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
          featured: false,
          categories: { name: "Food Tours" },
          cities: { name: "Rome" }
        }
      ],
      position: 1
    },
    {
      id: "categories",
      type: "category_carousel" as const,
      title: "Explore Rome by Interest",
      subtitle: "Choose your adventure based on what excites you most",
      content: [
        {
          id: "ancient-history",
          name: "Ancient History",
          slug: "ancient-history",
          description: "Discover the fascinating stories of Roman emperors, gladiators, and ancient civilizations.",
          image_url: "https://images.unsplash.com/photo-1513581166391-887a96ddeafd?w=400&h=300&fit=crop",
          experience_count: 28
        },
        {
          id: "art-culture",
          name: "Art & Culture",
          slug: "art-culture",
          description: "Immerse yourself in Renaissance masterpieces and Vatican treasures.",
          image_url: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=300&fit=crop",
          experience_count: 24
        },
        {
          id: "food-wine",
          name: "Food & Wine",
          slug: "food-wine",
          description: "Savor authentic Roman cuisine and discover local culinary traditions.",
          image_url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop",
          experience_count: 18
        }
      ],
      position: 2
    }
  ],
  itinerary_days: [
    {
      day: 1,
      title: "Ancient Rome & Imperial Glory",
      description: "Begin your Roman adventure with the iconic symbols of the ancient empire. Today focuses on the Colosseum, Roman Forum, and Palatine Hill - the heart of ancient Rome where emperors once ruled.",
      activities: [
        "Early morning Colosseum visit (8:00 AM - avoid crowds)",
        "Explore the Roman Forum and Palatine Hill",
        "Lunch at a traditional Roman osteria",
        "Afternoon visit to Capitoline Museums",
        "Sunset walk through the historic center"
      ],
      images: [
        "https://images.unsplash.com/photo-1539650116574-75c0c6d73613?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1513581166391-887a96ddeafd?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=800&h=600&fit=crop"
      ],
      tips: [
        "Book skip-the-line tickets in advance - the Colosseum sells out quickly",
        "Wear comfortable walking shoes - you'll be on your feet for hours",
        "Bring a water bottle - Rome has many free public fountains",
        "Visit early morning or late afternoon to avoid the midday heat",
        "Don't miss the underground chambers if you have the upgraded ticket"
      ]
    },
    {
      day: 2,
      title: "Vatican City & Papal Treasures",
      description: "Dedicate your second day to Vatican City, the world's smallest country packed with incredible art and history. From the Sistine Chapel to St. Peter's Basilica, prepare to be amazed.",
      activities: [
        "Early access to Vatican Museums (7:30 AM)",
        "Marvel at the Sistine Chapel ceiling",
        "Explore St. Peter's Basilica and climb the dome",
        "Lunch in the Vatican neighborhood",
        "Afternoon stroll through Castel Sant'Angelo",
        "Evening aperitivo near the Vatican"
      ],
      images: [
        "https://images.unsplash.com/photo-1585159812596-d4b1f2d6c9e7?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=800&h=600&fit=crop"
      ],
      tips: [
        "Book early access tickets to beat the crowds",
        "Dress modestly - shoulders and knees must be covered",
        "The dome climb has 551 steps - it's worth it for the views",
        "Audio guides are highly recommended for the Vatican Museums",
        "Allow at least 4-5 hours for the full Vatican experience"
      ]
    },
    {
      day: 3,
      title: "Roman Life & Hidden Gems",
      description: "Experience authentic Roman life in the charming neighborhoods of Trastevere and Campo de' Fiori. Discover local markets, artisan workshops, and the best gelato in the city.",
      activities: [
        "Morning exploration of Trastevere neighborhood",
        "Visit local markets and artisan shops",
        "Cooking class with a Roman family",
        "Afternoon at Villa Borghese and Galleria Borghese",
        "Sunset at Pincio Terrace overlooking the city",
        "Farewell dinner in a traditional Roman trattoria"
      ],
      images: [
        "https://images.unsplash.com/photo-1555992336-fb0d29498b13?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=800&h=600&fit=crop"
      ],
      tips: [
        "Trastevere is best explored on foot - get lost in the narrow streets",
        "Try supplì (rice balls) and maritozzo (sweet bread) - Roman specialties",
        "Book Galleria Borghese tickets in advance - they're timed entry",
        "The best gelato is at Giolitti, Fatamorgana, or Come il Latte",
        "Don't miss the Sunday morning market at Porta Portese"
      ]
    }
  ],
  faq_items: [
    {
      question: "What's the best time to visit Rome?",
      answer: "The best times to visit Rome are April-May and September-October when the weather is pleasant and crowds are more manageable. Summer (June-August) is hot and crowded, while winter (December-February) is mild but some attractions have reduced hours."
    },
    {
      question: "Do I need to book attractions in advance?",
      answer: "Yes, absolutely! Popular attractions like the Colosseum, Vatican Museums, and Galleria Borghese require advance bookings. We recommend booking at least 2-3 weeks ahead, especially during peak season (April-October)."
    },
    {
      question: "How much should I budget for 3 days in Rome?",
      answer: "Budget travelers can expect to spend €50-70 per day, mid-range travelers €100-150 per day, and luxury travelers €200+ per day. This includes accommodation, meals, attractions, and local transport."
    },
    {
      question: "Is the Roma Pass worth it?",
      answer: "The Roma Pass can be worth it if you plan to visit multiple attractions and use public transport frequently. The 3-day pass (€38.50) includes free entry to the first two attractions and discounts on others, plus unlimited public transport."
    },
    {
      question: "What should I wear when visiting religious sites?",
      answer: "Dress modestly when visiting churches and the Vatican. Cover your shoulders and knees - no shorts, tank tops, or short skirts. Many sites won't allow entry if you're not dressed appropriately."
    },
    {
      question: "How do I get around Rome?",
      answer: "Rome's historic center is very walkable. For longer distances, use the metro, buses, or trams. Taxis are available but can be expensive. We recommend walking for most attractions as they're close together."
    }
  ],
  gallery_images: [
    "https://images.unsplash.com/photo-1539650116574-75c0c6d73613?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1585159812596-d4b1f2d6c9e7?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1555992336-fb0d29498b13?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1513581166391-887a96ddeafd?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=400&h=400&fit=crop"
  ],
  custom_ctas: [
    {
      id: "cta-1",
      title: "Ready to Book Your Roman Adventure?",
      subtitle: "Don't wait - Rome's top attractions sell out fast!",
      description: "Secure your spot on the most popular Rome tours and experiences. Our expert-curated selection ensures you'll experience the best of the eternal city without the hassle.",
      button_text: "Book Rome Tours Now",
      button_link: "/tours?destination=rome",
      button_icon: "chevron-right" as const,
      gradient_type: "primary" as const,
      layout: "horizontal" as const,
      position: "middle" as const,
      enabled: true
    },
    {
      id: "cta-2",
      title: "Get More Italy Travel Guides",
      description: "Discover our complete collection of Italy travel guides including Florence, Venice, Naples, and the Amalfi Coast. Get insider tips and detailed itineraries for your perfect Italian adventure.",
      button_text: "Explore Italy Guides",
      button_link: "/travel-guide/italy",
      button_icon: "arrow-right" as const,
      gradient_type: "ocean" as const,
      layout: "vertical" as const,
      position: "bottom" as const,
      enabled: true
    }
  ] as CustomCTA[],
  seo_title: "Rome in 3 Days: Perfect First-Time Visitor's Itinerary Guide 2024",
  seo_description: "Discover the ultimate 3-day Rome itinerary for first-time visitors. Expert tips, must-see attractions, hidden gems, and insider recommendations for the perfect Roman holiday.",
  structured_data: {
    "@context": "https://schema.org",
    "@type": "TravelGuide",
    "name": "Rome in 3 Days: The Perfect Itinerary for First-Time Visitors",
    "description": "Discover the eternal city with our expertly crafted 3-day Rome itinerary. From the Colosseum to the Vatican, uncover the secrets of ancient Rome and create unforgettable memories.",
    "author": {
      "@type": "Person",
      "name": "Aditya Aman"
    },
    "datePublished": "2024-01-15T10:00:00Z",
    "image": "https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=1200&h=600&fit=crop",
    "about": {
      "@type": "Place",
      "name": "Rome",
      "addressCountry": "Italy"
    },
    "duration": "P3D",
    "itinerary": [
      {
        "@type": "Day",
        "name": "Ancient Rome & Imperial Glory",
        "description": "Begin your Roman adventure with the iconic symbols of the ancient empire."
      },
      {
        "@type": "Day", 
        "name": "Vatican City & Papal Treasures",
        "description": "Dedicate your second day to Vatican City, the world's smallest country packed with incredible art and history."
      },
      {
        "@type": "Day",
        "name": "Roman Life & Hidden Gems", 
        "description": "Experience authentic Roman life in the charming neighborhoods of Trastevere and Campo de' Fiori."
      }
    ]
  }
}