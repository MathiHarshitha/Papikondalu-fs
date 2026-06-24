import { PrismaClient, Role, PackageCategory, PackageStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create super admin
  const adminHash = await bcrypt.hash('Admin@123', 12);
  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@papikondalu.com' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'admin@papikondalu.com',
      phone: '+919876543210',
      passwordHash: adminHash,
      role: Role.SUPER_ADMIN,
      isEmailVerified: true,
    },
  });
  console.log('✅ Super admin created:', superAdmin.email);

  // Create sample packages
  const packages = [
    {
      name: 'Papikondalu Boat Safari - Day Trip',
      slug: 'papikondalu-boat-safari-day-trip',
      category: PackageCategory.BOAT_TOUR,
      description: 'Experience the majestic beauty of Papikondalu with a full-day boat safari along the Godavari river. Witness the stunning gorges, tribal villages, and breathtaking landscapes that make this journey unforgettable.',
      shortDescription: 'Full-day boat safari through the spectacular Papikondalu gorges on the Godavari river.',
      duration: '1 Day',
      durationDays: 1,
      durationNights: 0,
      startingPoint: 'Rajahmundry',
      endingPoint: 'Papikondalu',
      price: 1500,
      discountedPrice: 1200,
      capacity: 50,
      availableSeats: 50,
      itinerary: [
        { time: '06:00 AM', activity: 'Departure from Rajahmundry Boat Ghat' },
        { time: '08:00 AM', activity: 'Pass through Pattiseema barrage' },
        { time: '10:00 AM', activity: 'Reach Papikondalu gorges - sightseeing' },
        { time: '12:30 PM', activity: 'Lunch at tribal village' },
        { time: '02:00 PM', activity: 'Explore Kolluri and surroundings' },
        { time: '05:00 PM', activity: 'Return journey begins' },
        { time: '07:30 PM', activity: 'Arrive back at Rajahmundry' },
      ],
      includedServices: ['Boat ride (round trip)', 'Lunch', 'Guide', 'Life jackets', 'First aid'],
      excludedServices: ['Personal expenses', 'Camera fees', 'Beverages'],
      cancellationPolicy: '100% refund if cancelled 48 hours before. 50% if 24 hours. No refund within 24 hours.',
      highlights: ['Godavari river gorges', 'Tribal village visit', 'Scenic mountain views', 'Bird watching'],
      meetingPoint: 'Rajahmundry Boat Ghat, Near Godavari Bridge',
      meetingPointLat: 17.0005,
      meetingPointLng: 81.8040,
      status: PackageStatus.ACTIVE,
      isFeatured: true,
    },
    {
      name: 'Papikondalu Overnight Adventure',
      slug: 'papikondalu-overnight-adventure',
      category: PackageCategory.OVERNIGHT,
      description: 'A magical two-day experience deep in the Papikondalu hills. Stay overnight in a river-side camp and wake up to the sounds of nature.',
      shortDescription: '2-day overnight adventure with camping by the Godavari river.',
      duration: '2 Days / 1 Night',
      durationDays: 2,
      durationNights: 1,
      startingPoint: 'Rajahmundry',
      endingPoint: 'Rajahmundry',
      price: 3500,
      discountedPrice: 2999,
      capacity: 30,
      availableSeats: 30,
      itinerary: [
        { day: 1, activities: ['Morning departure from Rajahmundry', 'Boat journey through gorges', 'Tribal village visit', 'Riverside camp setup', 'Bonfire & cultural evening'] },
        { day: 2, activities: ['Sunrise boat ride', 'Trek to viewpoint', 'Breakfast', 'Return journey', 'Arrive by evening'] },
      ],
      includedServices: ['Boat ride', 'Camping tent', 'Meals (dinner + breakfast)', 'Guide', 'Bonfire'],
      excludedServices: ['Personal expenses', 'Travel to Rajahmundry', 'Tips'],
      cancellationPolicy: '100% refund if cancelled 72 hours before. 50% if 48 hours. No refund within 48 hours.',
      highlights: ['Overnight camping', 'Sunrise on Godavari', 'Tribal culture', 'Trekking', 'Stargazing'],
      meetingPoint: 'Rajahmundry Central Bus Stand',
      meetingPointLat: 17.0057,
      meetingPointLng: 81.7937,
      status: PackageStatus.ACTIVE,
      isFeatured: true,
    },
    {
      name: 'Family Godavari Cruise',
      slug: 'family-godavari-cruise',
      category: PackageCategory.FAMILY,
      description: 'Perfect for families - a comfortable cruise along the Godavari with special activities for children and scenic views for all.',
      shortDescription: 'Family-friendly day cruise on the Godavari river with activities for all ages.',
      duration: '1 Day',
      durationDays: 1,
      durationNights: 0,
      startingPoint: 'Rajahmundry',
      endingPoint: 'Papikondalu',
      price: 1200,
      discountedPrice: 999,
      capacity: 40,
      availableSeats: 40,
      itinerary: [
        { time: '07:00 AM', activity: 'Board at Rajahmundry Ghat' },
        { time: '09:30 AM', activity: 'Scenic Godavari cruise' },
        { time: '11:00 AM', activity: 'Reach Papikondalu' },
        { time: '01:00 PM', activity: 'Lunch & games for kids' },
        { time: '03:00 PM', activity: 'Return journey' },
        { time: '06:00 PM', activity: 'Arrive Rajahmundry' },
      ],
      includedServices: ['Boat ride', 'Lunch', 'Kids activities', 'Life jackets', 'Guide'],
      excludedServices: ['Personal expenses', 'Shopping'],
      cancellationPolicy: '100% refund if cancelled 48 hours before. 50% if 24 hours.',
      highlights: ['Family friendly', 'Kids activities', 'Comfortable seating', 'Photography spots'],
      meetingPoint: 'Rajahmundry Boat Ghat',
      meetingPointLat: 17.0005,
      meetingPointLng: 81.8040,
      status: PackageStatus.ACTIVE,
      isFeatured: true,
    },
  ];

  for (const pkg of packages) {
    await prisma.package.upsert({
      where: { slug: pkg.slug },
      update: {},
      create: pkg as any,
    });
  }
  console.log('✅ Sample packages created');
  console.log('🎉 Seeding complete!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
