require('dotenv').config({ path: '.env' })

const { Client } = require('@notionhq/client')

const notion = new Client({ auth: process.env.NOTION_API_KEY })

const DATABASES = {
  pages: process.env.NOTION_DB_PAGES,
  releases: process.env.NOTION_DB_RELEASES,
  projects: process.env.NOTION_DB_PROJECTS,
  shows: process.env.NOTION_DB_SHOWS,
}

module.exports = { notion, DATABASES }
