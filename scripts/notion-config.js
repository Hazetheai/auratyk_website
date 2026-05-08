require('dotenv').config({ path: '.env' })

const { Client } = require('@notionhq/client')

const requiredVars = [
  'NOTION_API_KEY',
  'NOTION_DB_PAGES',
  'NOTION_DB_RELEASES',
  'NOTION_DB_PROJECTS',
  'NOTION_DB_SHOWS',
]
for (const key of requiredVars) {
  if (!process.env[key]) {
    throw new Error(`Missing required env var: ${key}. Check .env file.`)
  }
}

const notion = new Client({ auth: process.env.NOTION_API_KEY })

const DATABASES = {
  pages: process.env.NOTION_DB_PAGES,
  releases: process.env.NOTION_DB_RELEASES,
  projects: process.env.NOTION_DB_PROJECTS,
  shows: process.env.NOTION_DB_SHOWS,
}

module.exports = { notion, DATABASES }
