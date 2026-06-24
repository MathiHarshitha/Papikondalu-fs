import type { Metadata } from 'next';
import { Anchor, MapPin, Calendar, Users, Award } from 'lucide-react';

export const metadata: Metadata = { title: 'About Papikondalu' };

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <div className="bg-gradient-to-br from-godavari-800 to-godavari-900 text-white py-20">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-6">
            <Anchor className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-5">About Papikondalu</h1>
          <p className="text-white/80 text-lg leading-relaxed">
            Papikondalu, also known as Papi Hills, is a series of picturesque gorges on the Godavari river
            in Andhra Pradesh. Surrounded by dense forests and tribal villages, it is one of the most
            scenic river journeys in India.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16 max-w-4xl space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">The Godavari Experience</h2>
            <p className="text-muted-foreground leading-relaxed">
              The boat journey from Rajahmundry to Papikondalu stretches over 80 km through breathtaking
              gorges. The Godavari river, one of India's longest, carves through ancient hills, creating
              a natural wonder that attracts over 7 lakh tourists every year.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Along the way, you pass through tribal villages, spot exotic birds, and witness the
              dramatic landscape of the Eastern Ghats meeting the sacred river.
            </p>
          </div>
          <div className="bg-gradient-to-br from-godavari-100 to-godavari-200 dark:from-godavari-900 dark:to-godavari-800 rounded-2xl p-8 space-y-4">
            {[
              { icon: MapPin, label: 'Location', value: 'East Godavari & West Godavari, Andhra Pradesh' },
              { icon: Calendar, label: 'Best Season', value: 'October – March' },
              { icon: Users, label: 'Annual Visitors', value: '7 Lakh+' },
              { icon: Award, label: 'Tourism Since', value: '2003' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3">
                <Icon className="w-5 h-5 text-godavari-500 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="font-medium text-sm">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Why Papikondalu?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { title: 'Scenic Gorges', desc: 'Dramatic rock formations and lush green hills create a stunning backdrop for the Godavari river.' },
              { title: 'Tribal Culture', desc: "Visit ancient tribal villages and experience the rich heritage of Koya and Konda Reddy tribes." },
              { title: 'Rich Biodiversity', desc: 'The region is home to rare birds, crocodiles, otters, and diverse flora in its protected forests.' },
            ].map(({ title, desc }) => (
              <div key={title} className="p-5 rounded-2xl bg-card border space-y-2">
                <h3 className="font-semibold">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-godavari-50 dark:bg-godavari-950/30 rounded-2xl p-8 text-center space-y-4">
          <h2 className="text-2xl font-bold">Our Mission</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            We are committed to providing safe, sustainable, and unforgettable tourism experiences while
            preserving the natural beauty of the Godavari valley and supporting local tribal communities.
          </p>
        </div>
      </div>
    </div>
  );
}
