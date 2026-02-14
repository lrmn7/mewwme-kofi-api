import Loki from 'lokijs'
import path from 'path'
import fs from 'fs'

async function main() {
  const dataFilePath = process.argv[2]
  if (!dataFilePath) {
    console.error('Usage: node export.js /path/to/kofi_data.json')
    process.exit(1)
  }

  const adapter = new Loki.LokiFsAdapter()
  const db = new Loki(dataFilePath, { adapter, autoload: true })

  await new Promise((resolve, reject) => {
    db.loadDatabase({}, (err) => {
      if (err) reject(err)
      else resolve()
    })
  })

  const col = db.getCollection('webhookPayloads')
  if (!col) {
    console.error('Collection "webhookPayloads" not found in DB.')
    process.exit(1)
  }

  const allData = col.data
  const exportPath = path.resolve(process.cwd(), 'webhookPayloads.json')
  const cleanData = col.data.map(({ $loki, meta, ...rest }) => rest)
  fs.writeFileSync(exportPath, JSON.stringify(cleanData, null, 2))

  console.log(`Exported ${allData.length} webhookPayloads to ${exportPath}`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
