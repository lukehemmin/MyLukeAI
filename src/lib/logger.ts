/* eslint-disable no-console */
import fs from 'fs'
import path from 'path'
import util from 'util'

export function initLogger() {
    if (process.env.NEXT_RUNTIME === 'edge') return

    const logDir = path.join(process.cwd(), 'log')

    // Ensure log directory exists
    if (!fs.existsSync(logDir)) {
        try {
            fs.mkdirSync(logDir, { recursive: true })
        } catch (error) {
            console.error('Failed to create log directory:', error)
            return
        }
    }

    // Create log filename with timestamp: YYYY-MM-DD_HH-mm-ss.log
    const now = new Date()
    const timestamp = now.toISOString().replace(/T/, '_').replace(/\..+/, '').replace(/:/g, '-')
    const logFilePath = path.join(logDir, `${timestamp}.log`)

    const logStream = fs.createWriteStream(logFilePath, { flags: 'a' })

    // Hooks for console methods
    const originalLog = console.log
    const originalError = console.error
    const originalWarn = console.warn
    const originalInfo = console.info

    function writeToFile(level: string, args: any[]) {
        const time = new Date().toISOString()
        const msg = util.format(...args)
        const logEntry = `[${time}] [${level}] ${msg}\n`
        logStream.write(logEntry)
    }

    console.log = (...args: any[]) => {
        originalLog.apply(console, args)
        writeToFile('INFO', args)
    }

    console.error = (...args: any[]) => {
        originalError.apply(console, args)
        writeToFile('ERROR', args)
    }

    console.warn = (...args: any[]) => {
        originalWarn.apply(console, args)
        writeToFile('WARN', args)
    }

    console.info = (...args: any[]) => {
        originalInfo.apply(console, args)
        writeToFile('INFO', args)
    }

    // Handle errors writing to the stream
    logStream.on('error', (err) => {
        originalError('Error writing to log file:', err)
    })

    originalLog(`[Logger] Initialized. Logging to ${logFilePath}`)
}
