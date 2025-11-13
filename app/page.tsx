import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dumbbell,
  Heart,
  Users,
  Instagram,
  Facebook,
  Mail,
  ArrowRight,
  Sparkles,
  Target,
  Zap,
  Star,
} from "lucide-react"
import { getAllContent, getThemeSettings } from "@/lib/content"
import { ContactForm } from "@/components/contact-form"

// Helper function to convert hex to RGB
function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 236, g: 72, b: 153 }
}

export default async function SophieCarterFitness() {
  // Fetch all content and theme from Supabase
  const [content, theme] = await Promise.all([
    getAllContent(),
    getThemeSettings(),
  ])

  // Helper to get content with fallback
  const getContent = (section: string, field: string, fallback: string) => {
    return content[section]?.[field] || fallback
  }

  // Convert theme colors to RGB for use in gradients
  const primaryRgb = hexToRgb(theme.primaryColor)
  const secondaryRgb = hexToRgb(theme.secondaryColor)
  const accentRgb = hexToRgb(theme.accentColor)

  // Hero section content
  const heroTagline = getContent("hero", "tagline", "Empowering Women Through Fitness")
  const heroTitle = getContent("hero", "title", "Strong. Confident. Empowered.")
  const heroSubtitle = getContent(
    "hero",
    "subtitle",
    "Reach your fitness goals without stress or confusion. I'm here to guide you every step of the way with personalized training that fits your lifestyle."
  )
  const heroButtonText = getContent("hero", "buttonText", "Start Your Journey")

  // About section content
  const aboutTitle = getContent("about", "title", "Meet Your Personal Trainer")
  const aboutDescription = getContent(
    "about",
    "description",
    "Hi, I'm Sophie! I'm a 27-year-old personal trainer passionate about helping women feel empowered through fitness. I believe fitness should be enjoyable, not intimidating. Whether you're just starting out or looking to level up, I'll create a plan that works for you—no stress, no confusion, just results and confidence."
  )
  const aboutImage = getContent(
    "about",
    "image",
    "/professional-female-personal-trainer-smiling-confi.jpg"
  )
  const aboutStatsNumber = getContent("about", "statsNumber", "500+")
  const aboutStatsLabel = getContent("about", "statsLabel", "Women Empowered")

  // Services section content
  const servicesTitle = getContent("services", "title", "How I Can Help")
  const servicesSubtitle = getContent(
    "services",
    "subtitle",
    "Choose the service that fits your lifestyle and goals"
  )
  const service1Title = getContent("services", "service1Title", "1-on-1 Training")
  const service1Description = getContent(
    "services",
    "service1Description",
    "Personalized in-person sessions tailored to your goals, fitness level, and schedule. Get hands-on guidance and motivation."
  )
  const service2Title = getContent("services", "service2Title", "Online Coaching")
  const service2Description = getContent(
    "services",
    "service2Description",
    "Train anywhere with custom workout plans, video demonstrations, and ongoing support through our app."
  )
  const service3Title = getContent("services", "service3Title", "Nutrition Guidance")
  const service3Description = getContent(
    "services",
    "service3Description",
    "Simple, sustainable nutrition advice that complements your training and helps you feel your best inside and out."
  )

  // Testimonials section content
  const testimonialsTitle = getContent("testimonials", "title", "Success Stories")
  const testimonialsSubtitle = getContent(
    "testimonials",
    "subtitle",
    "Real transformations from real women"
  )
  const testimonial1Text = getContent(
    "testimonials",
    "testimonial1Text",
    '"Sophie completely transformed my relationship with fitness. I went from dreading workouts to actually looking forward to them! Down 2 dress sizes and feeling stronger than ever."'
  )
  const testimonial1Name = getContent("testimonials", "testimonial1Name", "Emma")
  const testimonial1Age = getContent("testimonials", "testimonial1Age", "Age 34")
  const testimonial2Text = getContent(
    "testimonials",
    "testimonial2Text",
    '"Best decision I ever made! Sophie\'s approach is so refreshing—no judgment, just genuine support. I\'ve gained so much confidence and strength in just 3 months."'
  )
  const testimonial2Name = getContent("testimonials", "testimonial2Name", "Rachel")
  const testimonial2Age = getContent("testimonials", "testimonial2Age", "Age 29")
  const testimonial3Text = getContent(
    "testimonials",
    "testimonial3Text",
    '"I was so intimidated by gyms before working with Sophie. She made everything feel achievable and fun. Now I\'m lifting weights I never thought possible and feeling amazing!"'
  )
  const testimonial3Name = getContent("testimonials", "testimonial3Name", "Jessica")
  const testimonial3Age = getContent("testimonials", "testimonial3Age", "Age 42")

  return (
    <div 
      className="min-h-screen bg-background" 
      style={{ 
        fontFamily: theme.fontFamily,
        '--primary-color': theme.primaryColor,
        '--secondary-color': theme.secondaryColor,
        '--accent-color': theme.accentColor,
      } as React.CSSProperties}
    >

      {/* Hero Section */}
      <section className="relative px-6 py-32 md:py-48 overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background: `linear-gradient(to bottom right, rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.1), rgba(${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}, 0.08), rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, 0.06))`,
          }}
        />
        <div
          className="absolute inset-0 -z-10"
          style={{
            background: `radial-gradient(ellipse at 30% 20%, rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.4), transparent 60%)`,
          }}
        />
        <div
          className="absolute inset-0 -z-10"
          style={{
            background: `radial-gradient(ellipse at 70% 80%, rgba(${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}, 0.35), transparent 60%)`,
          }}
        />
        <div
          className="absolute top-20 right-20 w-72 h-72 rounded-full blur-3xl -z-10"
          style={{
            backgroundColor: `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.2)`,
          }}
        />
        <div
          className="absolute bottom-20 left-20 w-96 h-96 rounded-full blur-3xl -z-10"
          style={{
            backgroundColor: `rgba(${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}, 0.2)`,
          }}
        />

        <div className="max-w-6xl mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <div
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/90 backdrop-blur-md rounded-full border mb-10 shadow-lg"
              style={{
                borderColor: `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.6)`,
                boxShadow: `0 10px 15px -3px rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.1)`,
              }}
            >
              <Sparkles
                className="w-4 h-4"
                style={{ color: theme.primaryColor }}
              />
              <span className="text-sm font-semibold text-gray-700">
                {heroTagline}
              </span>
            </div>

            <h1 className="text-7xl md:text-[8rem] font-bold text-gray-900 mb-10 text-balance leading-[0.9] tracking-tighter">
              {heroTitle.split(" ").map((word, idx, arr) => {
                const isLastWord = idx === arr.length - 1
                return isLastWord ? (
                  <span
                    key={idx}
                    className="bg-clip-text text-transparent"
                    style={{
                      backgroundImage: `linear-gradient(to right, ${theme.primaryColor}, ${theme.secondaryColor}, ${theme.accentColor})`,
                    }}
                  >
                    {word}
              </span>
                ) : (
                  <span key={idx}>{word} </span>
                )
              })}
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-14 max-w-3xl mx-auto leading-relaxed text-pretty font-light">
              {heroSubtitle}
            </p>

            <Button
              size="lg"
              className="group text-white rounded-full px-12 py-8 text-lg font-semibold shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-1"
              style={{
                background: `linear-gradient(to right, ${theme.primaryColor}, ${theme.secondaryColor})`,
                boxShadow: `0 20px 25px -5px rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.3)`,
              }}
            >
              {heroButtonText}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="px-6 py-32 md:py-40 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <div className="relative order-2 md:order-1">
              <div
                className="absolute -inset-6 rounded-[3.5rem] blur-3xl opacity-60 -z-10"
                style={{
                  background: `linear-gradient(to bottom right, rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.5), rgba(${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}, 0.5), rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, 0.5))`,
                }}
              />
              <div
                className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl ring-1 ring-gray-900/5"
                style={{
                  background: `linear-gradient(to bottom right, rgba(${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}, 0.1), rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.1), rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, 0.1))`,
                }}
              >
                <img
                  src={aboutImage}
                  alt="Sophie Carter - Personal Trainer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 bg-white rounded-3xl shadow-2xl p-8 border border-gray-100/50 backdrop-blur-sm">
                <div
                  className="text-5xl font-bold bg-clip-text text-transparent mb-2"
                  style={{
                    backgroundImage: `linear-gradient(to right, ${theme.primaryColor}, ${theme.secondaryColor})`,
                  }}
                >
                  {aboutStatsNumber}
                </div>
                <div className="text-sm text-gray-600 font-semibold">
                  {aboutStatsLabel}
                </div>
              </div>
            </div>

            <div className="space-y-8 order-1 md:order-2">
              <div
                className="inline-block px-5 py-2 rounded-full border shadow-sm"
                style={{
                  background: `linear-gradient(to right, rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.1), rgba(${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}, 0.1))`,
                  borderColor: `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.6)`,
                }}
              >
                <span
                  className="text-sm font-bold uppercase tracking-wider"
                  style={{ color: theme.primaryColor }}
                >
                  About Sophie
                </span>
              </div>

              <h2 className="text-6xl md:text-7xl font-bold text-gray-900 text-balance leading-[1.05] tracking-tight">
                {aboutTitle}
              </h2>

              <div className="space-y-5 text-lg text-gray-600 leading-relaxed">
                {aboutDescription.includes("\n\n") ? (
                  aboutDescription.split("\n\n").map((paragraph, idx) => (
                    <p key={idx} className={idx === 0 ? "text-xl" : ""}>
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <p className="text-xl">{aboutDescription}</p>
                )}
              </div>

              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center group">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg"
                    style={{
                      background: `linear-gradient(to bottom right, rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.1), rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.2))`,
                      boxShadow: `0 10px 15px -3px rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.1)`,
                    }}
                  >
                    <Target
                      className="w-7 h-7"
                      style={{ color: theme.primaryColor }}
                    />
                  </div>
                  <div className="text-sm font-bold text-gray-900">
                    Goal-Focused
                  </div>
                </div>
                <div className="text-center group">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg"
                    style={{
                      background: `linear-gradient(to bottom right, rgba(${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}, 0.1), rgba(${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}, 0.2))`,
                      boxShadow: `0 10px 15px -3px rgba(${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}, 0.1)`,
                    }}
                  >
                    <Heart
                      className="w-7 h-7"
                      style={{ color: theme.secondaryColor }}
                    />
                  </div>
                  <div className="text-sm font-bold text-gray-900">
                    Supportive
                  </div>
                </div>
                <div className="text-center group">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg"
                    style={{
                      background: `linear-gradient(to bottom right, rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, 0.1), rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, 0.2))`,
                      boxShadow: `0 10px 15px -3px rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, 0.1)`,
                    }}
                  >
                    <Zap
                      className="w-7 h-7"
                      style={{ color: theme.accentColor }}
                    />
                  </div>
                  <div className="text-sm font-bold text-gray-900">
                    Results-Driven
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="px-6 py-32 md:py-40 relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background: `linear-gradient(to bottom right, rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.06), rgba(${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}, 0.04), rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, 0.06))`,
          }}
        />
        <div
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl -z-10"
          style={{
            backgroundColor: `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.2)`,
          }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl -z-10"
          style={{
            backgroundColor: `rgba(${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}, 0.2)`,
          }}
        />

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div
              className="inline-block px-5 py-2 bg-white/90 backdrop-blur-sm rounded-full border mb-8 shadow-lg"
              style={{
                borderColor: `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.6)`,
                boxShadow: `0 10px 15px -3px rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.1)`,
              }}
            >
              <span
                className="text-sm font-bold uppercase tracking-wider"
                style={{ color: theme.primaryColor }}
              >
                Services
              </span>
            </div>
            <h2 className="text-6xl md:text-7xl font-bold text-gray-900 mb-8 text-balance tracking-tight">
              {servicesTitle}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto text-pretty leading-relaxed">
              {servicesSubtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="group relative bg-white border-0 rounded-[2.5rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 ring-1 ring-gray-900/5">
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `linear-gradient(to bottom right, rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0), rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.05), rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.1))`,
                }}
              />
              <CardContent className="relative p-12">
                <div
                  className="w-24 h-24 rounded-3xl flex items-center justify-center mb-10 shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500"
                  style={{
                    background: `linear-gradient(to bottom right, ${theme.primaryColor}, ${theme.secondaryColor})`,
                    boxShadow: `0 20px 25px -5px rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.3)`,
                  }}
                >
                  <Dumbbell className="w-11 h-11 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-5 tracking-tight">
                  {service1Title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg mb-8">
                  {service1Description}
                </p>
                <div
                  className="flex items-center font-bold group-hover:gap-3 transition-all duration-300"
                  style={{ color: theme.primaryColor }}
                >
                  Learn more
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                </div>
              </CardContent>
            </Card>

            <Card className="group relative bg-white border-0 rounded-[2.5rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 ring-1 ring-gray-900/5">
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `linear-gradient(to bottom right, rgba(${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}, 0), rgba(${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}, 0.05), rgba(${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}, 0.1))`,
                }}
              />
              <CardContent className="relative p-12">
                <div
                  className="w-24 h-24 rounded-3xl flex items-center justify-center mb-10 shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500"
                  style={{
                    background: `linear-gradient(to bottom right, ${theme.secondaryColor}, ${theme.accentColor})`,
                    boxShadow: `0 20px 25px -5px rgba(${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}, 0.3)`,
                  }}
                >
                  <Users className="w-11 h-11 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-5 tracking-tight">
                  {service2Title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg mb-8">
                  {service2Description}
                </p>
                <div
                  className="flex items-center font-bold group-hover:gap-3 transition-all duration-300"
                  style={{ color: theme.secondaryColor }}
                >
                  Learn more
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                </div>
              </CardContent>
            </Card>

            <Card className="group relative bg-white border-0 rounded-[2.5rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 ring-1 ring-gray-900/5">
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `linear-gradient(to bottom right, rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, 0), rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, 0.05), rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, 0.1))`,
                }}
              />
              <CardContent className="relative p-12">
                <div
                  className="w-24 h-24 rounded-3xl flex items-center justify-center mb-10 shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500"
                  style={{
                    background: `linear-gradient(to bottom right, ${theme.accentColor}, ${theme.primaryColor})`,
                    boxShadow: `0 20px 25px -5px rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, 0.3)`,
                  }}
                >
                  <Heart className="w-11 h-11 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-5 tracking-tight">
                  {service3Title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg mb-8">
                  {service3Description}
                </p>
                <div
                  className="flex items-center font-bold group-hover:gap-3 transition-all duration-300"
                  style={{ color: theme.accentColor }}
                >
                  Learn more
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="px-6 py-32 md:py-40 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div
              className="inline-block px-5 py-2 rounded-full border mb-8 shadow-sm"
              style={{
                background: `linear-gradient(to right, rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.1), rgba(${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}, 0.1))`,
                borderColor: `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.6)`,
              }}
            >
              <span
                className="text-sm font-bold uppercase tracking-wider"
                style={{ color: theme.primaryColor }}
              >
                Testimonials
              </span>
            </div>
            <h2 className="text-6xl md:text-7xl font-bold text-gray-900 mb-8 text-balance tracking-tight">
              {testimonialsTitle}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {testimonialsSubtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gradient-to-br from-pink-50/80 via-white to-white border-0 rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 ring-1 ring-gray-900/5">
              <CardContent className="p-10">
                <div className="flex gap-1.5 mb-8">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-pink-500"
                      style={{ color: theme.primaryColor }}
                    />
                  ))}
                </div>
                <p className="text-gray-700 text-lg leading-relaxed mb-10 italic font-light">
                  {testimonial1Text}
                </p>
                <div className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg"
                    style={{
                      background: `linear-gradient(to bottom right, ${theme.primaryColor}, ${theme.secondaryColor})`,
                    }}
                  >
                    {testimonial1Name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-lg">
                      {testimonial1Name}
                    </div>
                    <div className="text-sm text-gray-500 font-medium">
                      {testimonial1Age}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50/80 via-white to-white border-0 rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 ring-1 ring-gray-900/5">
              <CardContent className="p-10">
                <div className="flex gap-1.5 mb-8">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-purple-500"
                      style={{ color: theme.secondaryColor }}
                    />
                  ))}
                </div>
                <p className="text-gray-700 text-lg leading-relaxed mb-10 italic font-light">
                  {testimonial2Text}
                </p>
                <div className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg"
                    style={{
                      background: `linear-gradient(to bottom right, ${theme.secondaryColor}, ${theme.accentColor})`,
                    }}
                  >
                    {testimonial2Name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-lg">
                      {testimonial2Name}
                    </div>
                    <div className="text-sm text-gray-500 font-medium">
                      {testimonial2Age}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-50/80 via-white to-white border-0 rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 ring-1 ring-gray-900/5">
              <CardContent className="p-10">
                <div className="flex gap-1.5 mb-8">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-emerald-500"
                      style={{ color: theme.accentColor }}
                    />
                  ))}
                </div>
                <p className="text-gray-700 text-lg leading-relaxed mb-10 italic font-light">
                  {testimonial3Text}
                </p>
                <div className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg"
                    style={{
                      background: `linear-gradient(to bottom right, ${theme.accentColor}, ${theme.primaryColor})`,
                    }}
                  >
                    {testimonial3Name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-lg">
                      {testimonial3Name}
                    </div>
                    <div className="text-sm text-gray-500 font-medium">
                      {testimonial3Age}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="px-6 py-32 md:py-40 relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background: `linear-gradient(to bottom right, rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.1), rgba(${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}, 0.08), rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, 0.06))`,
          }}
        />
        <div
          className="absolute inset-0 -z-10"
          style={{
            background: `radial-gradient(ellipse at 50% 50%, rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.5), transparent 70%)`,
          }}
        />
        <div
          className="absolute top-20 right-20 w-96 h-96 rounded-full blur-3xl -z-10"
          style={{
            backgroundColor: `rgba(${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}, 0.3)`,
          }}
        />
        <div
          className="absolute bottom-20 left-20 w-96 h-96 rounded-full blur-3xl -z-10"
          style={{
            backgroundColor: `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.3)`,
          }}
        />

        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <div
              className="inline-block px-5 py-2 bg-white/90 backdrop-blur-md rounded-full border mb-8 shadow-lg"
              style={{
                borderColor: `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.6)`,
                boxShadow: `0 10px 15px -3px rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.1)`,
              }}
            >
              <span
                className="text-sm font-bold uppercase tracking-wider"
                style={{ color: theme.primaryColor }}
              >
                Get Started
              </span>
            </div>
            <h2 className="text-6xl md:text-7xl font-bold text-gray-900 mb-8 text-balance tracking-tight">
              Ready to Start?
            </h2>
            <p className="text-xl text-gray-600 text-pretty leading-relaxed">
              Let's chat about your fitness goals and find the perfect plan for you
            </p>
          </div>

          <ContactForm
            primaryColor={theme.primaryColor}
            secondaryColor={theme.secondaryColor}
            primaryRgb={primaryRgb}
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-16 mb-16">
            <div>
              <h3
                className="text-4xl font-bold mb-4 bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(to right, ${theme.primaryColor}, ${theme.secondaryColor}, ${theme.accentColor})`,
                }}
              >
                Sophie Carter Fitness
              </h3>
              <p className="text-gray-400 leading-relaxed text-lg">
                Empowering women through fitness, one journey at a time.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-5">
                Contact
              </h4>
              <a
                href="mailto:sophie@carterfitness.co.uk"
                className="text-white hover:text-pink-400 transition-colors flex items-center gap-3 text-lg group"
                style={{ "--hover-color": theme.primaryColor } as React.CSSProperties}
              >
                <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
                sophie@carterfitness.co.uk
              </a>
            </div>

            <div>
              <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-5">
                Follow
              </h4>
              <div className="flex gap-4">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all hover:scale-110 shadow-xl"
                  style={{
                    background: `linear-gradient(to bottom right, ${theme.primaryColor}, ${theme.secondaryColor})`,
                    boxShadow: `0 20px 25px -5px rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.2)`,
                  }}
                  aria-label="Instagram"
                >
                  <Instagram className="w-6 h-6" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all hover:scale-110 shadow-xl"
                  style={{
                    background: `linear-gradient(to bottom right, ${theme.secondaryColor}, ${theme.accentColor})`,
                    boxShadow: `0 20px 25px -5px rgba(${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}, 0.2)`,
                  }}
                  aria-label="Facebook"
                >
                  <Facebook className="w-6 h-6" />
                </a>
                <a
                  href="mailto:sophie@carterfitness.co.uk"
                  className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all hover:scale-110 shadow-xl"
                  style={{
                    background: `linear-gradient(to bottom right, ${theme.accentColor}, ${theme.primaryColor})`,
                    boxShadow: `0 20px 25px -5px rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, 0.2)`,
                  }}
                  aria-label="Email"
                >
                  <Mail className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>

          <div className="pt-10 border-t border-gray-800 text-center text-gray-400">
            <p className="text-base">
              © {new Date().getFullYear()} Sophie Carter Fitness. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
