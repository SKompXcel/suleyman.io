#!/usr/bin/env node
/**
 * Small helper to exchange a GitHub App JWT for an installation token
 * without needing Postman. It reads configuration from environment variables
 * (or `.env.local`) and prints the token + expiry time.
 */

const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const fetchFn =
  typeof fetch === 'function'
    ? fetch
    : async (...args) => {
        const { default: nodeFetch } = await import('node-fetch')
        return nodeFetch(...args)
      }

async function main() {
  loadEnvFile('.env.local')

  const appId = getEnvValue(['GITHUB_APP_ID', 'github_app_id'])
  const installationId = getEnvValue(['GITHUB_INSTALLATION_ID', 'github_installation_id'])
  let privateKey = getEnvValue(['GITHUB_PRIVATE_KEY', 'github_private_key'])

  if (!appId || !installationId || !privateKey) {
    throw new Error(
      'Missing required env vars. Please set GITHUB_APP_ID, GITHUB_INSTALLATION_ID, and GITHUB_PRIVATE_KEY in .env.local or your shell.'
    )
  }

  privateKey = normalizePrivateKey(privateKey)
  const jwt = generateJwt(appId, privateKey)
  const { token, expires_at: expiresAt } = await requestInstallationToken({ installationId, jwt })

  console.log('\n✅ Installation token generated!')
  console.log('Token: ' + token)
  console.log('Expires at: ' + expiresAt)
  console.log('\nCopy the token above into your .env.local as GITHUB_TOKEN to refresh your projects data.')
}

function loadEnvFile(filename) {
  const filePath = path.resolve(process.cwd(), filename)
  if (!fs.existsSync(filePath)) return

  const contents = fs.readFileSync(filePath, 'utf8')
  contents
    .split(/\r?\n/)
    .filter((line) => line && !line.trim().startsWith('#'))
    .forEach((line) => {
      const idx = line.indexOf('=')
      if (idx === -1) return
      const key = line.slice(0, idx).trim()
      const value = line.slice(idx + 1).trim()
      if (!(key in process.env)) {
        process.env[key] = value
      }
    })
}

function getEnvValue(keys) {
  for (const key of keys) {
    if (process.env[key]) {
      return process.env[key]
    }
  }
  return null
}

function normalizePrivateKey(key) {
  if (!key) return key

  let normalized = key.trim()

  // Convert escaped newlines first
  normalized = normalized.replace(/\\n/g, '\n')

  const header = '-----BEGIN RSA PRIVATE KEY-----'
  const footer = '-----END RSA PRIVATE KEY-----'

  if (!normalized.includes(header) || !normalized.includes(footer)) {
    return normalized
  }

  // Remove header/footer and whitespace to rebuild clean PEM formatting
  const body = normalized
    .replace(header, '')
    .replace(footer, '')
    .replace(/\s+/g, '')

  const chunks = body.match(/.{1,64}/g) || []
  return [header, ...chunks, footer, ''].join('\n')
}

function generateJwt(appId, privateKey) {
  const now = Math.floor(Date.now() / 1000)
  const payload = {
    iat: now - 60,
    exp: now + 540,
    iss: appId,
  }

  const header = { alg: 'RS256', typ: 'JWT' }
  const encodedHeader = base64Url(header)
  const encodedPayload = base64Url(payload)
  const unsignedToken = `${encodedHeader}.${encodedPayload}`
  const signature = crypto
    .createSign('RSA-SHA256')
    .update(unsignedToken)
    .sign(privateKey, 'base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')

  return `${unsignedToken}.${signature}`
}

function base64Url(input) {
  const json = typeof input === 'string' ? input : JSON.stringify(input)
  return Buffer.from(json)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}

async function requestInstallationToken({ installationId, jwt }) {
  const response = await fetchFn(
    `https://api.github.com/app/installations/${installationId}/access_tokens`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwt}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    }
  )

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`GitHub responded with ${response.status}: ${error}`)
  }

  return response.json()
}

main().catch((error) => {
  console.error('\n❌ Failed to generate installation token')
  console.error(error.message || error)
  process.exitCode = 1
})
