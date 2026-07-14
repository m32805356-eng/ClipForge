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
"[project]/src/server/db/repositories.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createHighlights",
    ()=>createHighlights,
    "createTranscriptRow",
    ()=>createTranscriptRow,
    "createVideo",
    ()=>createVideo,
    "deleteVideo",
    ()=>deleteVideo,
    "getDashboardStats",
    ()=>getDashboardStats,
    "getTranscript",
    ()=>getTranscript,
    "getVideo",
    ()=>getVideo,
    "listHighlights",
    ()=>listHighlights,
    "listVideos",
    ()=>listVideos,
    "updateVideoStatus",
    ()=>updateVideoStatus
]);
/**
 * ClipForge — Prisma repository helpers.
 *
 * Centralizes all DB access so API routes stay thin and the query surface
 * is easy to audit. Each repo function is pure (no side effects beyond DB)
 * and returns plain data (no Prisma model instances leaking).
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/db.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$clipforge$2f$paths$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/clipforge/paths.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$clipforge$2f$server$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/clipforge/server/logger.ts [app-route] (ecmascript)");
;
;
;
const log = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$clipforge$2f$server$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].scoped('repo');
async function createVideo(input) {
    const filePath = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$clipforge$2f$paths$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["toStoredPath"])(input.filePath);
    log.info('Creating video record', {
        filename: input.filename,
        filePath
    });
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].video.create({
        data: {
            filename: input.filename,
            storageName: input.storageName,
            filePath,
            mimeType: input.mimeType,
            sizeBytes: input.sizeBytes,
            status: 'UPLOADED'
        }
    });
}
async function getVideo(id) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].video.findUnique({
        where: {
            id
        },
        include: {
            transcript: true,
            highlights: {
                orderBy: {
                    start: 'asc'
                }
            },
            clips: {
                orderBy: {
                    createdAt: 'desc'
                }
            }
        }
    });
}
async function updateVideoStatus(id, status, patch = {}) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].video.update({
        where: {
            id
        },
        data: {
            status,
            ...patch
        }
    });
}
async function listVideos(opts) {
    const where = {};
    if (opts.status) where.status = opts.status;
    if (opts.search) {
        where.filename = {
            contains: opts.search
        };
    }
    const [items, total] = await Promise.all([
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].video.findMany({
            where,
            orderBy: {
                createdAt: 'desc'
            },
            skip: (opts.page - 1) * opts.pageSize,
            take: opts.pageSize,
            include: {
                _count: {
                    select: {
                        clips: true
                    }
                }
            }
        }),
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].video.count({
            where
        })
    ]);
    return {
        items: items.map((v)=>({
                id: v.id,
                filename: v.filename,
                sizeBytes: v.sizeBytes,
                duration: v.duration,
                width: v.width,
                height: v.height,
                thumbnail: v.thumbnail,
                status: v.status,
                progress: v.progress,
                message: v.message,
                clipCount: v._count.clips,
                createdAt: v.createdAt.toISOString()
            })),
        total,
        page: opts.page,
        pageSize: opts.pageSize
    };
}
async function deleteVideo(id) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].video.delete({
        where: {
            id
        }
    });
}
async function createTranscriptRow(input) {
    log.info('Creating transcript row', {
        videoId: input.videoId,
        language: input.language
    });
    // Upsert so re-transcribing replaces the old transcript.
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].transcript.upsert({
        where: {
            videoId: input.videoId
        },
        create: {
            videoId: input.videoId,
            text: input.text,
            language: input.language,
            model: input.model,
            segments: input.segments,
            duration: input.duration
        },
        update: {
            text: input.text,
            language: input.language,
            model: input.model,
            segments: input.segments,
            duration: input.duration
        }
    });
}
async function getTranscript(videoId) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].transcript.findUnique({
        where: {
            videoId
        }
    });
}
async function createHighlights(inputs) {
    if (inputs.length === 0) return {
        count: 0
    };
    // Replace existing highlights for this video (only one set at a time).
    const videoId = inputs[0].videoId;
    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].highlight.deleteMany({
        where: {
            videoId
        }
    });
    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].highlight.createMany({
        data: inputs
    });
    return {
        count: inputs.length
    };
}
async function listHighlights(videoId) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].highlight.findMany({
        where: {
            videoId
        },
        orderBy: {
            start: 'asc'
        }
    });
}
async function getDashboardStats() {
    const [videoCounts, clipCounts, highlightTotal, highlightsByCategory, storageAgg, durationAgg] = await Promise.all([
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].video.groupBy({
            by: [
                'status'
            ],
            _count: true
        }),
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].clip.groupBy({
            by: [
                'status'
            ],
            _count: true
        }),
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].highlight.count(),
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].highlight.groupBy({
            by: [
                'category'
            ],
            _count: true
        }),
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].video.aggregate({
            _sum: {
                sizeBytes: true
            }
        }),
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].video.aggregate({
            _sum: {
                duration: true
            }
        })
    ]);
    const videoMap = Object.fromEntries(videoCounts.map((c)=>[
            c.status,
            c._count
        ]));
    const clipMap = Object.fromEntries(clipCounts.map((c)=>[
            c.status,
            c._count
        ]));
    const categoryMap = Object.fromEntries(highlightsByCategory.map((c)=>[
            c.category,
            c._count
        ]));
    // Outputs storage: sum of clip sizes
    const clipStorage = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].clip.aggregate({
        _sum: {
            sizeBytes: true
        }
    });
    return {
        videos: {
            total: Object.values(videoMap).reduce((a, b)=>a + b, 0),
            ready: videoMap.READY ?? 0,
            processing: (videoMap.UPLOADED ?? 0) + (videoMap.PROBING ?? 0) + (videoMap.EXTRACTING_AUDIO ?? 0) + (videoMap.TRANSCRIBING ?? 0) + (videoMap.ANALYZING ?? 0),
            failed: videoMap.FAILED ?? 0
        },
        clips: {
            total: Object.values(clipMap).reduce((a, b)=>a + b, 0),
            ready: clipMap.READY ?? 0,
            processing: (clipMap.QUEUED ?? 0) + (clipMap.CUTTING ?? 0) + (clipMap.CROPPING ?? 0) + (clipMap.SUBTITLING ?? 0) + (clipMap.RENDERING ?? 0)
        },
        highlights: {
            total: highlightTotal,
            byCategory: categoryMap
        },
        storage: {
            uploadsBytes: storageAgg._sum.sizeBytes ?? 0,
            outputsBytes: clipStorage._sum.sizeBytes ?? 0,
            totalBytes: (storageAgg._sum.sizeBytes ?? 0) + (clipStorage._sum.sizeBytes ?? 0)
        },
        totalDurationSeconds: durationAgg._sum.duration ?? 0
    };
}
}),
"[externals]/node:child_process [external] (node:child_process, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:child_process", () => require("node:child_process"));

module.exports = mod;
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
"[project]/src/lib/clipforge/server/ffmpeg.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "extractAudioForWhisper",
    ()=>extractAudioForWhisper,
    "extractThumbnail",
    ()=>extractThumbnail,
    "probeVideo",
    ()=>probeVideo
]);
/**
 * ClipForge — FFmpeg / ffprobe domain helpers.
 *
 * Thin wrappers that turn raw subprocess output into typed domain objects.
 * All time values are seconds (float).
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$clipforge$2f$server$2f$subprocess$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/clipforge/server/subprocess.ts [app-route] (ecmascript)");
;
function parseFps(rate) {
    if (!rate) return 0;
    const [num, den] = rate.split('/').map(Number);
    if (!den || den === 0) return 0;
    return num / den;
}
async function probeVideo(filePath) {
    const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$clipforge$2f$server$2f$subprocess$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["runFfprobe"])([
        '-show_format',
        '-show_streams',
        filePath
    ]);
    const data = JSON.parse(result.stdout || '{}');
    const videoStream = data.streams?.find((s)=>s.codec_type === 'video');
    const audioStream = data.streams?.find((s)=>s.codec_type === 'audio');
    return {
        duration: parseFloat(data.format?.duration ?? '0') || 0,
        width: videoStream?.width ?? 0,
        height: videoStream?.height ?? 0,
        codec: videoStream?.codec_name ?? 'unknown',
        fps: parseFps(videoStream?.avg_frame_rate || videoStream?.r_frame_rate),
        bitrate: parseInt(data.format?.bit_rate ?? '0', 10) || 0,
        hasAudio: !!audioStream,
        formatLong: data.format?.format_long_name ?? 'unknown'
    };
}
async function extractThumbnail(inputPath, outPath, atSeconds = 1, width = 640) {
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$clipforge$2f$server$2f$subprocess$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["runFfmpeg"])([
        '-ss',
        String(Math.max(0, atSeconds)),
        '-i',
        inputPath,
        '-frames:v',
        '1',
        '-vf',
        `scale=${width}:-2`,
        '-q:v',
        '3',
        outPath
    ]);
}
async function extractAudioForWhisper(inputPath, outPath) {
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$clipforge$2f$server$2f$subprocess$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["runFfmpeg"])([
        '-i',
        inputPath,
        '-vn',
        '-ac',
        '1',
        '-ar',
        '16000',
        '-c:a',
        'pcm_s16le',
        outPath
    ]);
}
}),
"[project]/src/lib/clipforge/constants.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * ClipForge — shared constants.
 */ /** Vertical output resolution for social-media clips (Phase 6). */ __turbopack_context__.s([
    "ACCEPTED_VIDEO_EXTS",
    ()=>ACCEPTED_VIDEO_EXTS,
    "ACCEPTED_VIDEO_MIME",
    ()=>ACCEPTED_VIDEO_MIME,
    "HIGHLIGHT_CATEGORIES",
    ()=>HIGHLIGHT_CATEGORIES,
    "MAX_UPLOAD_BYTES",
    ()=>MAX_UPLOAD_BYTES,
    "SUBTITLE_STYLES",
    ()=>SUBTITLE_STYLES,
    "VERTICAL_HEIGHT",
    ()=>VERTICAL_HEIGHT,
    "VERTICAL_WIDTH",
    ()=>VERTICAL_WIDTH
]);
const VERTICAL_WIDTH = 1080;
const VERTICAL_HEIGHT = 1920;
const MAX_UPLOAD_BYTES = 2 * 1024 * 1024 * 1024;
const ACCEPTED_VIDEO_MIME = [
    'video/mp4',
    'video/quicktime',
    'video/x-matroska',
    'video/webm',
    'video/x-msvideo',
    'video/mpeg'
];
const ACCEPTED_VIDEO_EXTS = [
    '.mp4',
    '.mov',
    '.mkv',
    '.webm',
    '.avi',
    '.mpeg',
    '.mpg'
];
const SUBTITLE_STYLES = [
    {
        id: 'bold-white',
        label: 'Bold White',
        description: 'High-contrast classic caption'
    },
    {
        id: 'karaoke',
        label: 'Karaoke Pop',
        description: 'Word-by-word highlight as spoken'
    },
    {
        id: 'neon-amber',
        label: 'Neon Amber',
        description: 'Glowing forge-themed caption'
    },
    {
        id: 'minimal',
        label: 'Minimal Lower',
        description: 'Subtle lower-third style'
    }
];
const HIGHLIGHT_CATEGORIES = [
    {
        id: 'hook',
        label: 'Hook',
        color: 'oklch(0.75 0.17 58)'
    },
    {
        id: 'emotional',
        label: 'Emotional',
        color: 'oklch(0.7 0.16 290)'
    },
    {
        id: 'story',
        label: 'Story',
        color: 'oklch(0.7 0.15 145)'
    },
    {
        id: 'funny',
        label: 'Funny',
        color: 'oklch(0.78 0.14 95)'
    },
    {
        id: 'educational',
        label: 'Educational',
        color: 'oklch(0.65 0.16 200)'
    },
    {
        id: 'viral',
        label: 'Viral',
        color: 'oklch(0.65 0.2 15)'
    }
];
}),
"[project]/src/server/services/video-upload.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "UploadValidationError",
    ()=>UploadValidationError,
    "ingestUploadedVideo",
    ()=>ingestUploadedVideo,
    "removeVideoCompletely",
    ()=>removeVideoCompletely,
    "validateUpload",
    ()=>validateUpload
]);
/**
 * ClipForge — video upload orchestration service.
 *
 * Pipeline:
 *   1. Validate mime + extension + size (reject early on bad input)
 *   2. Generate a safe storage name (cuid + ext)
 *   3. Stream the uploaded File to disk under uploads/
 *   4. Create DB row (status=PROBING)
 *   5. ffprobe for duration/dimensions → update row
 *   6. Extract thumbnail at ~1s (or midpoint for short clips) → update row
 *   7. Mark status=READY
 *
 * On any failure, the row is marked FAILED and the partial file is removed.
 */ var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:fs [external] (node:fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:path [external] (node:path, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$paralleldrive$2f$cuid2$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@paralleldrive/cuid2/index.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$paralleldrive$2f$cuid2$2f$src$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@paralleldrive/cuid2/src/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$repositories$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/server/db/repositories.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$clipforge$2f$server$2f$ffmpeg$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/clipforge/server/ffmpeg.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$clipforge$2f$paths$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/clipforge/paths.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$clipforge$2f$constants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/clipforge/constants.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$clipforge$2f$server$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/clipforge/server/logger.ts [app-route] (ecmascript)");
;
;
;
;
;
;
;
;
const log = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$clipforge$2f$server$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].scoped('upload');
class UploadValidationError extends Error {
    code;
    constructor(message, code){
        super(message), this.code = code;
        this.name = 'UploadValidationError';
    }
}
function validateUpload(file) {
    if (file.sizeBytes <= 0) {
        throw new UploadValidationError('File is empty', 'EMPTY_FILE');
    }
    if (file.sizeBytes > __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$clipforge$2f$constants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MAX_UPLOAD_BYTES"]) {
        throw new UploadValidationError(`File exceeds ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$clipforge$2f$constants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MAX_UPLOAD_BYTES"]} byte limit`, 'FILE_TOO_LARGE');
    }
    const ext = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].extname(file.filename).toLowerCase();
    const mimeOk = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$clipforge$2f$constants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ACCEPTED_VIDEO_MIME"].includes(file.mimeType);
    const extOk = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$clipforge$2f$constants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ACCEPTED_VIDEO_EXTS"].includes(ext);
    // Accept if either mime OR extension matches (some browsers send generic mime).
    if (!mimeOk && !extOk) {
        throw new UploadValidationError(`Unsupported file type: ${file.mimeType || ext || 'unknown'}`, 'UNSUPPORTED_TYPE');
    }
}
async function ingestUploadedVideo(file) {
    validateUpload(file);
    const ext = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].extname(file.filename).toLowerCase() || '.mp4';
    const storageName = `${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$paralleldrive$2f$cuid2$2f$src$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createId"])()}${ext}`;
    const filePath = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].join(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$clipforge$2f$paths$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["UPLOADS_DIR"], storageName);
    // Ensure dir exists.
    await __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["promises"].mkdir(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$clipforge$2f$paths$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["UPLOADS_DIR"], {
        recursive: true
    });
    // Stream file to disk.
    log.info('Writing upload to disk', {
        filename: file.filename,
        storageName,
        sizeBytes: file.sizeBytes
    });
    const writeStream = (await __turbopack_context__.A("[externals]/node:fs [external] (node:fs, cjs, async loader)")).createWriteStream(filePath);
    const reader = file.file.stream().getReader();
    try {
        while(true){
            const { done, value } = await reader.read();
            if (done) break;
            writeStream.write(Buffer.from(value));
        }
    } finally{
        writeStream.end();
        await new Promise((resolve, reject)=>{
            writeStream.on('finish', resolve);
            writeStream.on('error', reject);
        });
    }
    // Create DB record.
    const video = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$repositories$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createVideo"])({
        filename: file.filename,
        storageName,
        filePath,
        mimeType: file.mimeType,
        sizeBytes: file.sizeBytes
    });
    try {
        // Probe.
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$repositories$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["updateVideoStatus"])(video.id, 'PROBING', {
            progress: 30
        });
        const probe = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$clipforge$2f$server$2f$ffmpeg$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["probeVideo"])(filePath);
        log.info('Probed video', {
            id: video.id,
            duration: probe.duration,
            w: probe.width,
            h: probe.height
        });
        // Thumbnail at ~1s, or midpoint for very short clips.
        const thumbAt = Math.min(1, Math.max(0, probe.duration / 2));
        const thumbDir = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].join(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$clipforge$2f$paths$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["OUTPUTS_DIR"], video.id);
        await __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["promises"].mkdir(thumbDir, {
            recursive: true
        });
        const thumbAbs = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].join(thumbDir, 'thumb.jpg');
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$clipforge$2f$server$2f$ffmpeg$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["extractThumbnail"])(filePath, thumbAbs, thumbAt, 640);
        const thumbStored = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$clipforge$2f$paths$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["toStoredPath"])(thumbAbs);
        // Finalize.
        const updated = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$repositories$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["updateVideoStatus"])(video.id, 'READY', {
            progress: 100,
            duration: probe.duration,
            width: probe.width,
            height: probe.height,
            thumbnail: thumbStored
        });
        return {
            id: updated.id,
            filename: updated.filename,
            storageName: updated.storageName,
            filePath: updated.filePath,
            thumbnail: updated.thumbnail,
            duration: updated.duration,
            width: updated.width,
            height: updated.height,
            status: updated.status
        };
    } catch (err) {
        log.error('Upload post-processing failed', {
            id: video.id
        }, err);
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$repositories$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["updateVideoStatus"])(video.id, 'FAILED', {
            progress: 0,
            message: err.message
        });
        // Leave the source file on disk so the user can retry / inspect; don't auto-delete.
        throw err;
    }
}
async function removeVideoCompletely(videoId, filePath) {
    const abs = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].isAbsolute(filePath) ? filePath : __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].join(process.cwd(), filePath);
    try {
        await __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["promises"].unlink(abs);
    } catch (e) {
        if (e.code !== 'ENOENT') throw e;
    }
    // Remove outputs/<videoId>/ dir (thumbnails, clips, etc.)
    const outDir = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].join(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$clipforge$2f$paths$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["OUTPUTS_DIR"], videoId);
    await __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["promises"].rm(outDir, {
        recursive: true,
        force: true
    });
    log.info('Removed video artifacts', {
        videoId,
        abs,
        outDir
    });
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
"[project]/src/app/api/videos/[id]/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * GET /api/videos/[id]
 * Returns a single video with transcript, highlights, and clips.
 *
 * DELETE /api/videos/[id]
 * Removes the video file, outputs dir, and DB record.
 */ __turbopack_context__.s([
    "DELETE",
    ()=>DELETE,
    "GET",
    ()=>GET,
    "dynamic",
    ()=>dynamic
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$repositories$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/server/db/repositories.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$services$2f$video$2d$upload$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/server/services/video-upload.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$api$2f$responses$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/server/api/responses.ts [app-route] (ecmascript)");
;
;
;
const dynamic = 'force-dynamic';
async function GET(_req, { params }) {
    try {
        const { id } = await params;
        const video = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$repositories$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getVideo"])(id);
        if (!video) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$api$2f$responses$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["failNotFound"])('Video', id);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$api$2f$responses$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ok"])({
            id: video.id,
            filename: video.filename,
            storageName: video.storageName,
            filePath: video.filePath,
            mimeType: video.mimeType,
            sizeBytes: video.sizeBytes,
            duration: video.duration,
            width: video.width,
            height: video.height,
            thumbnail: video.thumbnail,
            status: video.status,
            progress: video.progress,
            message: video.message,
            createdAt: video.createdAt.toISOString(),
            updatedAt: video.updatedAt.toISOString(),
            transcript: video.transcript ? {
                id: video.transcript.id,
                text: video.transcript.text,
                language: video.transcript.language,
                segments: video.transcript.segments,
                duration: video.transcript.duration
            } : null,
            highlights: video.highlights.map((h)=>({
                    id: h.id,
                    start: h.start,
                    end: h.end,
                    title: h.title,
                    reasoning: h.reasoning,
                    category: h.category,
                    score: h.score,
                    excerpt: h.excerpt
                })),
            clips: video.clips.map((c)=>({
                    id: c.id,
                    title: c.title,
                    filePath: c.filePath,
                    thumbnail: c.thumbnail,
                    width: c.width,
                    height: c.height,
                    duration: c.duration,
                    sizeBytes: c.sizeBytes,
                    hasSubtitles: c.hasSubtitles,
                    subtitleStyle: c.subtitleStyle,
                    status: c.status,
                    createdAt: c.createdAt.toISOString()
                }))
        });
    } catch (e) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$api$2f$responses$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["failInternal"])('Failed to load video', e);
    }
}
async function DELETE(_req, { params }) {
    try {
        const { id } = await params;
        const video = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$repositories$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getVideo"])(id);
        if (!video) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$api$2f$responses$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["failNotFound"])('Video', id);
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$services$2f$video$2d$upload$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["removeVideoCompletely"])(video.id, video.filePath);
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$repositories$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["deleteVideo"])(video.id);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$api$2f$responses$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ok"])({
            id,
            deleted: true
        });
    } catch (e) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$api$2f$responses$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["failInternal"])('Failed to delete video', e);
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__3262d9e3._.js.map