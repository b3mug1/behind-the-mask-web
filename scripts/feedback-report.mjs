// Research-team report: aggregated counts only. Individual rows are never fetched or printed.
// Usage (needs SUPABASE_URL and SUPABASE_SECRET_KEY in the environment or .env.local):
//   npm run report:feedback
//   npm run report:feedback -- --csv feedback-summary.csv
import { writeFile } from 'node:fs/promises'

const QUESTIONS = [
  {
    key: 'usefulness',
    title: 'Question 1: Was this guide useful?',
    options: [
      ['very_useful', 'Very useful'],
      ['somewhat_useful', 'Somewhat useful'],
      ['not_very_useful', 'Not very useful'],
      ['not_useful_at_all', 'Not useful at all'],
    ],
  },
  {
    key: 'learning',
    title: 'Question 2: Did you learn something new from this guide?',
    options: [
      ['yes_definitely', 'Yes, definitely'],
      ['yes_a_little', 'Yes, a little'],
      ['no_not_really', 'No, not really'],
      ['no_nothing_new', 'No, nothing new'],
    ],
  },
  {
    key: 'intention',
    title: 'Question 3: Would you use these principles in your online communication?',
    options: [
      ['definitely', 'Definitely'],
      ['probably', 'Probably'],
      ['probably_not', 'Probably not'],
      ['definitely_not', 'Definitely not'],
    ],
  },
]

const baseUrl = (process.env.SUPABASE_URL ?? '').replace(/\/+$/, '')
const secretKey = process.env.SUPABASE_SECRET_KEY ?? ''
if (!baseUrl || !secretKey) {
  console.error('Set SUPABASE_URL and SUPABASE_SECRET_KEY (see .env.example).')
  process.exit(1)
}

const csvPathIndex = process.argv.indexOf('--csv')
const csvPath = csvPathIndex !== -1 ? process.argv[csvPathIndex + 1] : null

const response = await fetch(`${baseUrl}/rest/v1/rpc/guide_feedback_counts`, {
  method: 'POST',
  headers: {
    apikey: secretKey,
    Authorization: `Bearer ${secretKey}`,
    'content-type': 'application/json',
  },
  body: '{}',
})
if (!response.ok) {
  console.error(`Could not load aggregated counts (HTTP ${response.status}). Check the migration and the secret key.`)
  process.exit(1)
}

/** @type {{ question: string; answer: string; total: number }[]} */
const rows = await response.json()
const countFor = (question, answer) =>
  Number(rows.find((row) => row.question === question && row.answer === answer)?.total ?? 0)

// Total = responses that answered question 1 (every valid submission answers all three).
const total = QUESTIONS[0].options.reduce((sum, [value]) => sum + countFor('usefulness', value), 0)
const pct = (count) => (total === 0 ? '0.0' : ((count / total) * 100).toFixed(1))

const lines = []
lines.push(`Total valid consented submissions: ${total}`)
lines.push('')
for (const question of QUESTIONS) {
  lines.push(question.title)
  for (const [value, label] of question.options) {
    const count = countFor(question.key, value)
    lines.push(`  ${label.padEnd(20)} ${String(count).padStart(5)}   ${pct(count).padStart(5)}%`)
  }
  lines.push('')
}

const csvRows = [['question', 'answer', 'count', 'percent_of_total']]
for (const question of QUESTIONS) {
  for (const [value] of question.options) {
    const count = countFor(question.key, value)
    csvRows.push([question.key, value, String(count), pct(count)])
  }
}
const csv = csvRows.map((row) => row.join(',')).join('\n') + '\n'

console.log(lines.join('\n'))
if (csvPath) {
  await writeFile(csvPath, csv, 'utf8')
  console.log(`CSV written to ${csvPath}`)
}
console.log(
  [
    'Slide 11 wording (fill in only from the numbers above):',
    `After sharing the website with ${total} voluntary participants, ` +
      `${pct(countFor('usefulness', 'very_useful') + countFor('usefulness', 'somewhat_useful'))}% found the guide useful, ` +
      `${pct(countFor('learning', 'yes_definitely') + countFor('learning', 'yes_a_little'))}% reported learning something new, and ` +
      `${pct(countFor('intention', 'definitely') + countFor('intention', 'probably'))}% said they would probably or definitely use the principles.`,
    'Note: these are self-reported answers. They show reported usefulness, self-reported learning and intended future behavior, not verified changes in real-world online behavior.',
  ].join('\n'),
)
