import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create demo venues
  const venues = await Promise.all([
    prisma.venue.upsert({
      where: { slug: 'whelans-dublin' },
      update: {},
      create: {
        name: "Whelan's",
        slug: 'whelans-dublin',
        description: 'Premier live music venue in Dublin',
        address: '25 Wexford Street',
        city: 'Dublin',
        country: 'Ireland',
        eircode: 'D02 YX88',
        capacity: 500,
        verified: true,
        user: {
          create: {
            email: 'venue@whelans.com',
            password: await bcrypt.hash('demo123', 10),
            name: "Whelan's Venue Team",
            role: 'VENUE',
            emailVerified: true,
          },
        },
      },
    }),
    prisma.venue.upsert({
      where: { slug: '3arena-dublin' },
      update: {},
      create: {
        name: '3Arena',
        slug: '3arena-dublin',
        description: 'Ireland\'s largest indoor arena',
        address: 'North Wall Quay',
        city: 'Dublin',
        country: 'Ireland',
        eircode: 'D01 X5E9',
        capacity: 9500,
        verified: true,
        user: {
          create: {
            email: 'venue@3arena.com',
            password: await bcrypt.hash('demo123', 10),
            name: '3Arena Team',
            role: 'VENUE',
            emailVerified: true,
          },
        },
      },
    }),
    prisma.venue.upsert({
      where: { slug: 'vicar-street' },
      update: {},
      create: {
        name: 'Vicar Street',
        slug: 'vicar-street',
        description: 'Iconic Dublin concert venue',
        address: 'Vicar Street',
        city: 'Dublin',
        country: 'Ireland',
        eircode: 'D08 YD57',
        capacity: 2500,
        verified: true,
        user: {
          create: {
            email: 'venue@vicarstreet.com',
            password: await bcrypt.hash('demo123', 10),
            name: 'Vicar Street Team',
            role: 'VENUE',
            emailVerified: true,
          },
        },
      },
    }),
    prisma.venue.upsert({
      where: { slug: 'marlay-park' },
      update: {},
      create: {
        name: 'Marlay Park',
        slug: 'marlay-park',
        description: 'Outdoor concert venue in Dublin',
        address: 'Marlay Road',
        city: 'Dublin',
        country: 'Ireland',
        capacity: 25000,
        verified: true,
        user: {
          create: {
            email: 'venue@marlaypark.com',
            password: await bcrypt.hash('demo123', 10),
            name: 'Marlay Park Events',
            role: 'VENUE',
            emailVerified: true,
          },
        },
      },
    }),
  ]);

  console.log(`✅ Created ${venues.length} venues`);

  // Create demo artists
  const artists = await Promise.all([
    prisma.artist.upsert({
      where: { slug: 'the-corrs' },
      update: {},
      create: {
        name: 'The Corrs',
        slug: 'the-corrs',
        genre: 'Pop/Rock',
        bio: 'Irish band known for their pop-folk sound',
        verified: true,
        minPrice: 50,
        maxPrice: 150,
        user: {
          create: {
            email: 'artist@thecorrs.com',
            password: await bcrypt.hash('demo123', 10),
            name: 'The Corrs Management',
            role: 'ARTIST',
            emailVerified: true,
          },
        },
      },
    }),
    prisma.artist.upsert({
      where: { slug: 'sam-smith' },
      update: {},
      create: {
        name: 'Sam Smith',
        slug: 'sam-smith',
        genre: 'Pop',
        bio: 'Grammy Award-winning British singer',
        verified: true,
        minPrice: 60,
        maxPrice: 120,
        user: {
          create: {
            email: 'artist@samsmith.com',
            password: await bcrypt.hash('demo123', 10),
            name: 'Sam Smith Team',
            role: 'ARTIST',
            emailVerified: true,
          },
        },
      },
    }),
    prisma.artist.upsert({
      where: { slug: 'irish-comedy-gala' },
      update: {},
      create: {
        name: 'Irish Comedy Gala',
        slug: 'irish-comedy-gala',
        genre: 'Comedy',
        bio: 'Annual showcase of Ireland\'s best comedians',
        verified: true,
        minPrice: 25,
        maxPrice: 45,
        user: {
          create: {
            email: 'artist@comedy.ie',
            password: await bcrypt.hash('demo123', 10),
            name: 'Irish Comedy Gala',
            role: 'ARTIST',
            emailVerified: true,
          },
        },
      },
    }),
  ]);

  console.log(`✅ Created ${artists.length} artists`);

  // Get venue IDs
  const whelans = await prisma.venue.findUnique({ where: { slug: 'whelans-dublin' } });
  const arena = await prisma.venue.findUnique({ where: { slug: '3arena-dublin' } });
  const vicar = await prisma.venue.findUnique({ where: { slug: 'vicar-street' } });
  const marlay = await prisma.venue.findUnique({ where: { slug: 'marlay-park' } });

  // Get artist IDs
  const corrs = await prisma.artist.findUnique({ where: { slug: 'the-corrs' } });
  const samSmith = await prisma.artist.findUnique({ where: { slug: 'sam-smith' } });
  const comedyGala = await prisma.artist.findUnique({ where: { slug: 'irish-comedy-gala' } });

  // Create events
  const events = [
    {
      title: 'The Corrs Live in Dublin',
      slug: 'the-corrs-dublin-2026',
      description: 'Experience the magic of The Corrs live at 3Arena. The Irish quartet brings their classic hits and new material for an unforgettable night.',
      date: new Date('2026-05-15'),
      time: '20:00',
      doorsOpen: '18:30',
      ageRestriction: 'All ages',
      status: 'PUBLISHED' as const,
      isFeatured: true,
      venueId: arena!.id,
      artistId: corrs!.id,
      ticketTiers: {
        create: [
          { name: 'General Admission', price: 65, quantity: 5000, sold: 0 },
          { name: 'Premium', price: 95, quantity: 2000, sold: 0 },
          { name: 'VIP', price: 150, quantity: 500, sold: 0 },
        ],
      },
    },
    {
      title: 'Sam Smith - Dublin',
      slug: 'sam-smith-dublin-2026',
      description: 'Grammy winner Sam Smith brings their incredible live show to Dublin for one night only.',
      date: new Date('2026-05-28'),
      time: '20:00',
      doorsOpen: '19:00',
      ageRestriction: 'All ages',
      status: 'PUBLISHED' as const,
      isFeatured: true,
      venueId: arena!.id,
      artistId: samSmith!.id,
      ticketTiers: {
        create: [
          { name: 'General Admission', price: 70, quantity: 6000, sold: 0 },
          { name: 'Front Stage', price: 95, quantity: 2000, sold: 0 },
          { name: 'VIP Package', price: 120, quantity: 500, sold: 0 },
        ],
      },
    },
    {
      title: 'Irish Comedy Gala 2026',
      slug: 'irish-comedy-gala-2026',
      description: 'The annual Irish Comedy Gala returns to Vicar Street with the best comedians from across Ireland.',
      date: new Date('2026-04-20'),
      time: '20:00',
      doorsOpen: '19:00',
      ageRestriction: '18+',
      status: 'PUBLISHED' as const,
      isFeatured: true,
      venueId: vicar!.id,
      artistId: comedyGala!.id,
      ticketTiers: {
        create: [
          { name: 'Standard', price: 35, quantity: 2000, sold: 0 },
          { name: 'Premium', price: 45, quantity: 500, sold: 0 },
        ],
      },
    },
    {
      title: 'Summer Sessions at Marlay Park',
      slug: 'marlay-park-summer-2026',
      description: 'Ireland\'s biggest outdoor concert series returns with three incredible nights of music.',
      date: new Date('2026-06-12'),
      time: '17:00',
      doorsOpen: '15:00',
      ageRestriction: 'All ages',
      status: 'PUBLISHED' as const,
      isFeatured: true,
      venueId: marlay!.id,
      ticketTiers: {
        create: [
          { name: 'General Admission', price: 85, quantity: 15000, sold: 0 },
          { name: 'VIP Pit', price: 150, quantity: 2000, sold: 0 },
        ],
      },
    },
    {
      title: 'Acoustic Sessions - Whelan\'s',
      slug: 'whelans-acoustic-april-2026',
      description: 'An intimate night of acoustic performances at Dublin\'s beloved Whelan\'s.',
      date: new Date('2026-04-18'),
      time: '20:00',
      doorsOpen: '19:00',
      ageRestriction: '18+',
      status: 'PUBLISHED' as const,
      venueId: whelans!.id,
      ticketTiers: {
        create: [
          { name: 'General Admission', price: 18, quantity: 400, sold: 0 },
        ],
      },
    },
    {
      title: 'Jazz in the Cellar',
      slug: 'jazz-cellar-april-2026',
      description: 'Weekly jazz sessions featuring the best Irish and international jazz musicians.',
      date: new Date('2026-04-25'),
      time: '21:00',
      doorsOpen: '20:00',
      ageRestriction: '18+',
      status: 'PUBLISHED' as const,
      venueId: whelans!.id,
      ticketTiers: {
        create: [
          { name: 'Entry', price: 15, quantity: 200, sold: 0 },
        ],
      },
    },
    {
      title: 'Forbidden Fruit Festival',
      slug: 'forbidden-fruit-2026',
      description: 'Dublin\'s premier electronic and alternative music festival returns for another incredible edition.',
      date: new Date('2026-05-30'),
      time: '14:00',
      doorsOpen: '12:00',
      ageRestriction: '18+',
      status: 'PUBLISHED' as const,
      isFeatured: true,
      venueId: marlay!.id,
      ticketTiers: {
        create: [
          { name: 'Weekend Ticket', price: 120, quantity: 8000, sold: 0 },
          { name: 'VIP Weekend', price: 200, quantity: 1000, sold: 0 },
        ],
      },
    },
    {
      title: 'The Workmans Club - Open Mic',
      slug: 'workmans-open-mic-april',
      description: 'Weekly open mic night at The Workmans Club. Sign up at the door.',
      date: new Date('2026-04-10'),
      time: '20:00',
      doorsOpen: '19:00',
      ageRestriction: '18+',
      status: 'PUBLISHED' as const,
      venueId: whelans!.id,
      ticketTiers: {
        create: [
          { name: 'Free Entry', price: 0, quantity: 100, sold: 0 },
        ],
      },
    },
  ];

  for (const eventData of events) {
    const { ticketTiers, ...eventInfo } = eventData;
    await prisma.event.upsert({
      where: { slug: eventInfo.slug },
      update: {},
      create: {
        ...eventInfo,
        ticketTiers: {
          create: ticketTiers.create,
        },
      },
    });
  }

  console.log(`✅ Created ${events.length} events`);

  // Create a demo user
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@fanscript.com' },
    update: {},
    create: {
      email: 'demo@fanscript.com',
      password: await bcrypt.hash('demo123', 10),
      name: 'Demo User',
      role: 'FAN',
      emailVerified: true,
    },
  });

  console.log(`✅ Created demo user: demo@fanscript.com / demo123`);

  console.log('\n🎉 Seeding complete!');
  console.log('\n📋 Summary:');
  console.log('- Venues: Whelan\'s, 3Arena, Vicar Street, Marlay Park');
  console.log('- Events: 8 upcoming events');
  console.log('- Demo user: demo@fanscript.com / demo123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
