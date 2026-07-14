module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/node:fs [external] (node:fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:fs", () => require("node:fs"));

module.exports = mod;
}),
"[externals]/node:path [external] (node:path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:path", () => require("node:path"));

module.exports = mod;
}),
"[project]/src/lib/db.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "db",
    ()=>db
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs, [project]/node_modules/@prisma/client)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:fs [external] (node:fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:path [external] (node:path, cjs)");
;
;
;
// Ensure the database directory exists (needed for fresh deploys).
const dbUrl = process.env.DATABASE_URL ?? '';
if (dbUrl.startsWith('file:')) {
    const dbPath = dbUrl.replace('file:', '');
    const dbDir = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].dirname(dbPath);
    if (!(0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["existsSync"])(dbDir)) {
        try {
            (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["mkdirSync"])(dbDir, {
                recursive: true
            });
        } catch  {
        // Directory creation may fail in read-only environments — that's OK,
        // Prisma will report the error on first query.
        }
    }
}
const globalForPrisma = globalThis;
const db = globalForPrisma.prisma ?? new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__["PrismaClient"]({
    log: ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : [
        'query'
    ]
});
if ("TURBOPACK compile-time truthy", 1) globalForPrisma.prisma = db;
}),
"[externals]/node:child_process [external] (node:child_process, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:child_process", () => require("node:child_process"));

module.exports = mod;
}),
"[project]/src/lib/clipforge/server/logger.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * ClipForge — server-side structured logger.
 *
 * Minimal, dependency-free logger that writes JSON lines to stdout/stderr.
 * Designed for local single-user use: informative but not noisy.
 *
 * Levels (in order): debug < info < warn < error
 * Level is controlled by CLIPFORGE_LOG_LEVEL env var (default: info).
 */ __turbopack_context__.s([
    "logger",
    ()=>logger
]);
const LEVEL_ORDER = {
    debug: 10,
    info: 20,
    warn: 30,
    error: 40
};
const ENV_LEVEL = process.env.CLIPFORGE_LOG_LEVEL ?? 'info';
function shouldLog(level) {
    return (LEVEL_ORDER[level] >= LEVEL_ORDER[ENV_LEVEL]) ?? LEVEL_ORDER.info;
}
function emit(level, message, ctx = {}, error) {
    if (!shouldLog(level)) return;
    const record = {
        ts: new Date().toISOString(),
        level,
        msg: message,
        ...ctx
    };
    if (error) {
        record.error = error instanceof Error ? {
            name: error.name,
            message: error.message,
            stack: error.stack
        } : String(error);
    }
    const line = JSON.stringify(record);
    if (level === 'error' || level === 'warn') {
        process.stderr.write(line + '\n');
    } else {
        process.stdout.write(line + '\n');
    }
}
const logger = {
    debug: (msg, ctx)=>emit('debug', msg, ctx),
    info: (msg, ctx)=>emit('info', msg, ctx),
    warn: (msg, ctx, error)=>emit('warn', msg, ctx, error),
    error: (msg, ctx, error)=>emit('error', msg, ctx, error),
    /** Scoped logger that prepends a component tag to every message. */ scoped: (scope)=>({
            debug: (msg, ctx)=>emit('debug', msg, {
                    ...ctx,
                    scope
                }),
            info: (msg, ctx)=>emit('info', msg, {
                    ...ctx,
                    scope
                }),
            warn: (msg, ctx, error)=>emit('warn', msg, {
                    ...ctx,
                    scope
                }, error),
            error: (msg, ctx, error)=>emit('error', msg, {
                    ...ctx,
                    scope
                }, error)
        })
};
}),
"[project]/src/lib/clipforge/server/subprocess.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SubprocessError",
    ()=>SubprocessError,
    "runCommand",
    ()=>runCommand,
    "runFfmpeg",
    ()=>runFfmpeg,
    "runFfprobe",
    ()=>runFfprobe,
    "runPythonJson",
    ()=>runPythonJson
]);
/**
 * ClipForge — typed subprocess runner.
 *
 * Wraps Node's child_process with:
 *   - Promise-based API
 *   - Timeout protection (kills process tree on expiry)
 *   - Captured stdout/stderr (with size caps to avoid memory blowups)
 *   - Optional streaming progress callback (line-by-line stderr parsing)
 *   - Structured logging
 *
 * Used to invoke ffmpeg, ffprobe, and Python scripts (Whisper, MediaPipe).
 */ var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$child_process__$5b$external$5d$__$28$node$3a$child_process$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:child_process [external] (node:child_process, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:fs [external] (node:fs, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$clipforge$2f$server$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/clipforge/server/logger.ts [app-route] (ecmascript)");
;
;
;
const MAX_CAPTURE_BYTES = 2 * 1024 * 1024 // 2 MiB per stream
;
class SubprocessError extends Error {
    exitCode;
    stderr;
    stdout;
    constructor(message, exitCode, stderr, stdout){
        super(message), this.exitCode = exitCode, this.stderr = stderr, this.stdout = stdout;
        this.name = 'SubprocessError';
    }
}
function runCommand(command, args, opts = {}) {
    return new Promise((resolve, reject)=>{
        const start = Date.now();
        const log = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$clipforge$2f$server$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].scoped('subprocess');
        let proc;
        try {
            proc = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$child_process__$5b$external$5d$__$28$node$3a$child_process$2c$__cjs$29$__["spawn"])(command, args, {
                cwd: opts.cwd ?? process.cwd(),
                env: {
                    ...process.env,
                    ...opts.env
                },
                stdio: [
                    'ignore',
                    'pipe',
                    'pipe'
                ]
            });
        } catch (e) {
            reject(new Error(`Failed to spawn ${command}: ${e.message}`));
            return;
        }
        let stdout = '';
        let stderr = '';
        let stdoutBuf = '';
        let stderrBuf = '';
        let killed = false;
        let timer;
        const onTimeout = ()=>{
            killed = true;
            log.warn('Process killed: timeout', {
                command,
                args,
                timeoutMs: opts.timeoutMs
            });
            proc.kill('SIGKILL');
        };
        if (opts.timeoutMs && opts.timeoutMs > 0) {
            timer = setTimeout(onTimeout, opts.timeoutMs);
        }
        if (opts.signal) {
            opts.signal.addEventListener('abort', ()=>{
                killed = true;
                proc.kill('SIGKILL');
            }, {
                once: true
            });
        }
        proc.stdout?.on('data', (chunk)=>{
            if (stdout.length < MAX_CAPTURE_BYTES) stdout += chunk.toString('utf8');
            stdoutBuf += chunk.toString('utf8');
            let nl;
            while((nl = stdoutBuf.indexOf('\n')) >= 0){
                const line = stdoutBuf.slice(0, nl).replace(/\r$/, '');
                stdoutBuf = stdoutBuf.slice(nl + 1);
                opts.onStdoutLine?.(line);
            }
        });
        proc.stderr?.on('data', (chunk)=>{
            if (stderr.length < MAX_CAPTURE_BYTES) stderr += chunk.toString('utf8');
            stderrBuf += chunk.toString('utf8');
            let nl;
            while((nl = stderrBuf.indexOf('\n')) >= 0){
                const line = stderrBuf.slice(0, nl).replace(/\r$/, '');
                stderrBuf = stderrBuf.slice(nl + 1);
                opts.onStderrLine?.(line);
            }
        });
        proc.on('error', (err)=>{
            if (timer) clearTimeout(timer);
            reject(new Error(`Failed to execute ${command}: ${err.message}`));
        });
        proc.on('close', (code)=>{
            if (timer) clearTimeout(timer);
            const durationMs = Date.now() - start;
            const exitCode = code ?? -1;
            const ok = exitCode === 0;
            log.debug('Process finished', {
                command,
                exitCode,
                durationMs,
                ok
            });
            const result = {
                exitCode,
                stdout,
                stderr,
                durationMs,
                ok
            };
            if (ok) resolve(result);
            else {
                reject(new SubprocessError(killed ? `${command} timed out after ${opts.timeoutMs}ms` : `${command} exited with code ${exitCode}`, exitCode, stderr, stdout));
            }
        });
    });
}
function runFfmpeg(args, opts = {}) {
    return runCommand('ffmpeg', [
        '-hide_banner',
        '-loglevel',
        'error',
        '-y',
        ...args
    ], opts);
}
function runFfprobe(args, opts = {}) {
    return runCommand('ffprobe', [
        '-v',
        'quiet',
        '-print_format',
        'json',
        ...args
    ], opts);
}
async function runPythonJson(scriptPath, payload, opts = {}) {
    // Prefer the venv python3 (has faster-whisper, yt-dlp installed) if it exists.
    // Fall back to system python3.
    const venvPython = '/home/z/.venv/bin/python3';
    const pythonBin = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["existsSync"])(venvPython) ? venvPython : 'python3';
    const result = await runCommand(pythonBin, [
        scriptPath
    ], {
        ...opts,
        env: {
            ...opts.env,
            CLIPFORGE_PYTHON_PAYLOAD: JSON.stringify(payload)
        }
    });
    try {
        return JSON.parse(result.stdout);
    } catch (e) {
        throw new SubprocessError(`Python script ${scriptPath} returned invalid JSON: ${e.message}`, result.exitCode, result.stderr, result.stdout);
    }
}
}),
"[project]/src/lib/clipforge/paths.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DATABASE_FILE",
    ()=>DATABASE_FILE,
    "MODELS_DIR",
    ()=>MODELS_DIR,
    "OUTPUTS_DIR",
    ()=>OUTPUTS_DIR,
    "PROJECT_ROOT",
    ()=>PROJECT_ROOT,
    "SCRIPTS_DIR",
    ()=>SCRIPTS_DIR,
    "UPLOADS_DIR",
    ()=>UPLOADS_DIR,
    "resolveStoredPath",
    ()=>resolveStoredPath,
    "toStoredPath",
    ()=>toStoredPath
]);
/**
 * ClipForge — canonical project paths.
 *
 * All paths are resolved relative to the project root so they work regardless
 * of the current working directory (important because Next.js API routes and
 * Python subprocesses may have different CWDs).
 */ var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:path [external] (node:path, cjs)");
;
const PROJECT_ROOT = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].resolve(process.cwd());
const UPLOADS_DIR = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].join(PROJECT_ROOT, 'uploads');
const OUTPUTS_DIR = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].join(PROJECT_ROOT, 'outputs');
const MODELS_DIR = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].join(PROJECT_ROOT, 'models');
const SCRIPTS_DIR = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].join(PROJECT_ROOT, 'scripts');
const DATABASE_FILE = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].join(PROJECT_ROOT, 'db', 'custom.db');
function resolveStoredPath(stored) {
    return __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].isAbsolute(stored) ? stored : __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].join(PROJECT_ROOT, stored);
}
function toStoredPath(absolute) {
    const rel = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].relative(PROJECT_ROOT, absolute);
    if (rel.startsWith('..')) {
        throw new Error(`Refusing to store path outside project root: ${absolute}`);
    }
    return rel;
}
}),
"[project]/src/server/services/health.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "checkHealth",
    ()=>checkHealth
]);
/**
 * ClipForge — system health checker.
 *
 * Probes each subsystem the app depends on:
 *   - SQLite database (Prisma round-trip)
 *   - FFmpeg + ffprobe binaries
 *   - Python 3 + (optionally) faster-whisper availability
 *   - Local disk free space
 *
 * Aggregated status:
 *   - ok       → every component ok
 *   - degraded → some non-critical components down (e.g. whisper not installed)
 *   - down     → database or ffmpeg unavailable
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/db.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$clipforge$2f$server$2f$subprocess$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/clipforge/server/subprocess.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:fs [external] (node:fs, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$clipforge$2f$paths$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/clipforge/paths.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$clipforge$2f$server$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/clipforge/server/logger.ts [app-route] (ecmascript)");
;
;
;
;
;
;
const log = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$clipforge$2f$server$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].scoped('health');
const startedAt = Date.now();
// Prefer the venv python3 (has faster-whisper, yt-dlp installed) if it exists.
const PYTHON_BIN = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["existsSync"])('/home/z/.venv/bin/python3') ? '/home/z/.venv/bin/python3' : 'python3';
async function checkDatabase() {
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].$queryRaw`SELECT 1`;
        return {
            name: 'database',
            status: 'ok',
            detail: 'SQLite via Prisma',
            version: 'sqlite'
        };
    } catch (e) {
        return {
            name: 'database',
            status: 'down',
            detail: e.message
        };
    }
}
async function checkBinary(name, versionFlag) {
    try {
        const r = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$clipforge$2f$server$2f$subprocess$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["runCommand"])(name, [
            versionFlag
        ], {
            timeoutMs: 5000
        });
        const firstLine = r.stdout.split('\n').find((l)=>l.trim()) ?? '';
        const version = firstLine.match(/version\s+([0-9.\-a-z]+)/i)?.[1];
        return {
            name,
            status: 'ok',
            version,
            detail: firstLine.slice(0, 120)
        };
    } catch (e) {
        return {
            name,
            status: 'down',
            detail: e.message
        };
    }
}
async function checkPython() {
    try {
        const r = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$clipforge$2f$server$2f$subprocess$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["runCommand"])(PYTHON_BIN, [
            '--version'
        ], {
            timeoutMs: 5000
        });
        const version = r.stdout.trim().split(' ')[1];
        return {
            name: 'python',
            status: 'ok',
            version,
            detail: r.stdout.trim()
        };
    } catch (e) {
        return {
            name: 'python',
            status: 'down',
            detail: e.message
        };
    }
}
async function checkWhisper() {
    try {
        const r = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$clipforge$2f$server$2f$subprocess$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["runCommand"])(PYTHON_BIN, [
            '-c',
            'import faster_whisper; print(faster_whisper.__version__)'
        ], {
            timeoutMs: 8000
        });
        const version = r.stdout.trim();
        return {
            name: 'whisper',
            status: 'ok',
            version,
            detail: 'faster-whisper ready'
        };
    } catch  {
        return {
            name: 'whisper',
            status: 'degraded',
            detail: 'faster-whisper not installed (transcription will not work)'
        };
    }
}
async function checkDisk() {
    try {
        // Ensure our local folders exist (creating if missing)
        await __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["promises"].mkdir(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$clipforge$2f$paths$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["UPLOADS_DIR"], {
            recursive: true
        });
        await __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["promises"].mkdir(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$clipforge$2f$paths$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["OUTPUTS_DIR"], {
            recursive: true
        });
        // Best-effort free-space probe. Node has no built-in statfs; use df via subprocess.
        let freeBytes = 0;
        let totalBytes = 0;
        try {
            const r = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$clipforge$2f$server$2f$subprocess$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["runCommand"])('df', [
                '-B1',
                '-P',
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$clipforge$2f$paths$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["OUTPUTS_DIR"]
            ], {
                timeoutMs: 3000
            });
            const lines = r.stdout.trim().split('\n');
            const parts = lines[1]?.split(/\s+/);
            if (parts && parts.length >= 4) {
                totalBytes = parseInt(parts[1], 10);
                freeBytes = parseInt(parts[3], 10);
            }
        } catch  {
        // Fallback: use os.freemem as an extremely rough proxy is wrong; just report unknown.
        }
        return {
            name: 'disk',
            status: freeBytes > 1 * 1024 * 1024 * 1024 ? 'ok' : 'degraded',
            detail: `uploads/ and outputs/ writable. Free: ${(freeBytes / 1e9).toFixed(1)} GB`,
            version: `${(freeBytes / 1e9).toFixed(1)}GB free / ${(totalBytes / 1e9).toFixed(1)}GB total`
        };
    } catch (e) {
        return {
            name: 'disk',
            status: 'down',
            detail: e.message
        };
    }
}
async function checkHealth() {
    const components = await Promise.all([
        checkDatabase(),
        checkBinary('ffmpeg', '-version'),
        checkBinary('ffprobe', '-version'),
        checkPython(),
        checkWhisper(),
        checkDisk()
    ]);
    const hasDown = components.some((c)=>c.status === 'down' && (c.name === 'database' || c.name === 'ffmpeg' || c.name === 'ffprobe'));
    const hasDegraded = components.some((c)=>c.status === 'degraded' || c.status === 'down');
    let status = 'ok';
    if (hasDown) status = 'down';
    else if (hasDegraded) status = 'degraded';
    log.debug('Health checked', {
        status,
        components: components.map((c)=>c.name).join(',')
    });
    return {
        status,
        uptime: Date.now() - startedAt,
        components
    };
}
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/src/server/api/responses.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fail",
    ()=>fail,
    "failInternal",
    ()=>failInternal,
    "failNotFound",
    ()=>failNotFound,
    "failZod",
    ()=>failZod,
    "ok",
    ()=>ok
]);
/**
 * ClipForge — Next.js API response helpers.
 *
 * Standardizes JSON envelopes + error handling across all routes.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$clipforge$2f$server$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/clipforge/server/logger.ts [app-route] (ecmascript)");
;
;
function ok(data, status = 200) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(data, {
        status
    });
}
function fail(code, message, status = 400, details) {
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$clipforge$2f$server$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].warn('API error', {
        code,
        message,
        status
    });
    const body = {
        error: {
            code,
            message,
            details
        }
    };
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(body, {
        status
    });
}
function failZod(error) {
    return fail('VALIDATION_ERROR', 'Request validation failed', 422, error.flatten());
}
function failNotFound(resource, id) {
    return fail('NOT_FOUND', `${resource} not found: ${id}`, 404);
}
function failInternal(message, error) {
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$clipforge$2f$server$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].error('Internal error', {
        message
    }, error);
    return fail('INTERNAL_ERROR', message, 500);
}
}),
"[project]/src/app/api/health/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * GET /api/health
 * Returns aggregated system health: database, ffmpeg, ffprobe, python, whisper, disk.
 */ __turbopack_context__.s([
    "GET",
    ()=>GET,
    "dynamic",
    ()=>dynamic
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$services$2f$health$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/server/services/health.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$api$2f$responses$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/server/api/responses.ts [app-route] (ecmascript)");
;
;
const dynamic = 'force-dynamic';
async function GET(_req) {
    try {
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$services$2f$health$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["checkHealth"])();
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$api$2f$responses$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ok"])(result);
    } catch (e) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$api$2f$responses$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["failInternal"])('Health check failed', e);
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__b6a8c9d3._.js.map