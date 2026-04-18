// prisma/seed.ts
// Run with: npx prisma db seed
// Seeds the channels table with common UK marketplaces.
// logoSvg is left null — upload logos via PUT /api/channels/:slug/logo
// once you have the assets.

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const channels = [
  {
    slug: 'amazon-uk',
    displayName: 'Amazon UK',
    colour: '#FF9900',
  },
  {
    slug: 'ebay-uk',
    displayName: 'eBay UK',
    colour: '#E53238',
  },
  {
    slug: 'shopify',
    displayName: 'Shopify',
    colour: '#96BF48',
  },
  {
    slug: 'etsy',
    displayName: 'Etsy',
    colour: '#F1641E',
  },
  {
    slug: 'tiktok-shop',
    displayName: 'TikTok Shop',
    colour: '#010101',
  },
  {
    slug: 'onbuy',
    displayName: 'OnBuy',
    colour: '#E30613',
  },
  {
    slug: 'notonthehighstreet',
    displayName: 'Not On The High Street',
    colour: '#D4387E',
  },
  {
    slug: 'wayfair',
    displayName: 'Wayfair',
    colour: '#7F187F',
  },
  {
    slug: 'woocommerce',
    displayName: 'WooCommerce',
    colour: '#7F54B3',
  },
  {
    slug: 'fruugo',
    displayName: 'Fruugo',
    colour: '#F47920',
  },
  {
    slug: 'manomano',
    displayName: 'ManoMano',
    colour: '#00B1D2',
  },
  {
    slug: 'direct',
    displayName: 'Direct / Website',
    colour: '#1DFB9D',
  },
]

async function main() {
  console.log('Seeding channels…')

  for (const channel of channels) {
    await prisma.channel.upsert({
      where: { slug: channel.slug },
      update: {
        displayName: channel.displayName,
        colour: channel.colour,
      },
      create: {
        slug: channel.slug,
        displayName: channel.displayName,
        colour: channel.colour,
        isActive: true,
      },
    })
    console.log(`  ✓ ${channel.displayName}`)
  }

  console.log(`\nDone — ${channels.length} channels seeded.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
