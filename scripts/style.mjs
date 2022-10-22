import { $ } from 'zx'
import { program } from 'commander'
import { run } from './common.js'
import { mkdir } from 'fs/promises'

const opts = program
  .option('--rust-only')
  .option('--js-only')
  .option('--lint')
  .option('--fmt')
  .option('--check')
  .parse()
  .opts()

process.stdout.write(chalk.cyan('💡 Scope: '))
process.stdout.write(
  opts.jsOnly
    ? chalk.blue('Javascript')
    : opts.rustOnly
    ? chalk.blue('Rust')
    : 'all',
)
console.log()

if (opts.lint) {
  console.log(chalk.green(`🔎 Start linter...`))

  if (!opts.jsOnly) {
    await run(async () => {
      // see https://github.com/tauri-apps/tauri/issues/3142
      await mkdir('./dist', { recursive: true })
      await $`cd src-tauri && cargo clippy`
    })
  }

  if (!opts.rustOnly) {
    const lintArgs = [
      '--cache',
      // patterns
      'src/**/*.{ts,tsx}',
      'scripts/*.mjs',
    ]
    await run(() => $`pnpm exec eslint ${lintArgs}`)
  }
}

if (opts.fmt) {
  console.log(chalk.green(`✏️ Start formatter...`))

  if (!opts.jsOnly) {
    const fmtArgs = []
    if (opts.check) {
      fmtArgs.push('--check')
    }

    await run(() => $`cd src-tauri && cargo fmt ${fmtArgs}`)
  }

  if (!opts.rustOnly) {
    const fmtArgs = [
      '--parser',
      'typescript',
      // patterns
      'src/**/*.{ts,tsx}',
      'scripts/*.mjs',
    ]

    if (opts.check) {
      fmtArgs.push('--check')
    } else {
      fmtArgs.push('--write')
    }

    await run(() => $`pnpm exec prettier ${fmtArgs}`)
  }
}
