export async function run(fn) {
  try {
    await fn()
  } catch (p) {
    console.error(p.stderr)
    process.exit(p.exitCode)
  }
}
