require('dotenv').config()
const knex = require('knex')
const ProjectsService = require('./projects/projects-service')

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL,
})

console.log(ProjectsService.getAllProjects())