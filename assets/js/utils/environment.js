/* eslint-disable no-console */
export const isDev = process.env.NODE_ENV === 'development'
export const isProd = process.env.NODE_ENV === 'production'
export const loggingConfig = { dev: true, prod: false }
export const logger = (...args) =>
  loggingConfig.dev && isDev
    ? console.log(...args)
    : loggingConfig.dev && loggingConfig.prod
    ? console.log(...args)
    : loggingConfig.prod && isProd
    ? console.log(...args)
    : null
export const getFileName = (fn) =>
  /\/\w+\.\w+/.exec(`${fn}`)[0].replace('/', '')
