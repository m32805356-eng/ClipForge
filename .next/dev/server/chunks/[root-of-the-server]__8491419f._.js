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
"[externals]/node:path [external] (node:path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:path", () => require("node:path"));

module.exports = mod;
}),
"[externals]/node:fs [external] (node:fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:fs", () => require("node:fs"));

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
"[project]/src/server/services/transcription.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TranscribeError",
    ()=>TranscribeError,
    "transcribeVideo",
    ()=>transcribeVideo
]);
/**
 * ClipForge — transcription orchestration service.
 *
 * Pipeline:
 *   1. Mark video status=EXTRACTING_AUDIO
 *   2. Extract 16kHz mono WAV via FFmpeg (Whisper's expected input)
 *   3. Mark video status=TRANSCRIBING
 *   4. Spawn Python transcribe.py with the WAV path
 *   5. Persist Transcript row (text + segments JSON + language + duration)
 *   6. Mark video status=READY
 *
 * On failure: mark video FAILED, rethrow so the API route can return 500.
 */ var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:path [external] (node:path, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:fs [external] (node:fs, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$repositories$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/server/db/repositories.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$clipforge$2f$server$2f$ffmpeg$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/clipforge/server/ffmpeg.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$clipforge$2f$server$2f$subprocess$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/clipforge/server/subprocess.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$clipforge$2f$paths$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/clipforge/paths.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$clipforge$2f$server$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/clipforge/server/logger.ts [app-route] (ecmascript)");
;
;
;
;
;
;
;
const log = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$clipforge$2f$server$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].scoped('transcribe');
const SCRIPTS_DIR = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].join(process.cwd(), 'scripts');
const TRANSCRIBE_SCRIPT = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].join(SCRIPTS_DIR, 'transcribe.py');
class TranscribeError extends Error {
    stderr;
    constructor(message, stderr){
        super(message), this.stderr = stderr;
        this.name = 'TranscribeError';
    }
}
async function transcribeVideo(videoId, opts = {}) {
    const modelSize = opts.modelSize ?? 'base';
    const language = opts.language ?? null;
    const wordTimestamps = opts.wordTimestamps ?? true;
    const video = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$repositories$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getVideo"])(videoId);
    if (!video) throw new TranscribeError(`Video not found: ${videoId}`);
    if (video.status === 'TRANSCRIBING' || video.status === 'EXTRACTING_AUDIO') {
        throw new TranscribeError(`Video is already being processed (status=${video.status})`);
    }
    const sourceAbs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$clipforge$2f$paths$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["resolveStoredPath"])(video.filePath);
    // 1. Extract audio.
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$repositories$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["updateVideoStatus"])(videoId, 'EXTRACTING_AUDIO', {
        progress: 10,
        message: 'Extracting audio…'
    });
    const audioDir = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].join(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$clipforge$2f$paths$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["OUTPUTS_DIR"], videoId);
    await __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["promises"].mkdir(audioDir, {
        recursive: true
    });
    const audioPath = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].join(audioDir, 'audio.wav');
    log.info('Extracting audio', {
        videoId,
        audioPath
    });
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$clipforge$2f$server$2f$ffmpeg$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["extractAudioForWhisper"])(sourceAbs, audioPath);
    } catch (e) {
        const msg = `Audio extraction failed: ${e.message}`;
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$repositories$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["updateVideoStatus"])(videoId, 'FAILED', {
            progress: 0,
            message: msg
        });
        throw new TranscribeError(msg);
    }
    // 2. Run Whisper via Python subprocess.
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$repositories$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["updateVideoStatus"])(videoId, 'TRANSCRIBING', {
        progress: 40,
        message: `Transcribing with ${modelSize} model…`
    });
    log.info('Running Whisper', {
        videoId,
        modelSize,
        language
    });
    let whisperResult;
    try {
        whisperResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$clipforge$2f$server$2f$subprocess$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["runPythonJson"])(TRANSCRIBE_SCRIPT, {
            audio_path: audioPath,
            model_size: modelSize,
            language,
            output_dir: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$clipforge$2f$paths$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MODELS_DIR"],
            word_timestamps: wordTimestamps
        }, {
            timeoutMs: 20 * 60 * 1000
        });
    } catch (e) {
        const stderr = e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$clipforge$2f$server$2f$subprocess$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SubprocessError"] ? e.stderr : undefined;
        const msg = `Whisper failed: ${e.message}`;
        log.error('Whisper failed', {
            videoId,
            stderr: stderr?.slice(0, 500)
        }, e);
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$repositories$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["updateVideoStatus"])(videoId, 'FAILED', {
            progress: 0,
            message: msg
        });
        throw new TranscribeError(msg, stderr);
    }
    // 3. Persist transcript.
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$repositories$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["updateVideoStatus"])(videoId, 'ANALYZING', {
        progress: 90,
        message: 'Saving transcript…'
    });
    const transcript = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$repositories$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createTranscriptRow"])({
        videoId,
        text: whisperResult.text,
        language: whisperResult.language,
        model: modelSize,
        segments: JSON.stringify(whisperResult.segments),
        duration: whisperResult.duration
    });
    // 4. Done.
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$repositories$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["updateVideoStatus"])(videoId, 'READY', {
        progress: 100,
        message: null
    });
    log.info('Transcription complete', {
        videoId,
        transcriptId: transcript.id,
        language: whisperResult.language,
        segments: whisperResult.segments.length
    });
    // Clean up the intermediate WAV to save disk.
    __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["promises"].unlink(audioPath).catch(()=>{});
    return {
        transcriptId: transcript.id,
        language: whisperResult.language,
        languageProbability: whisperResult.language_probability,
        duration: whisperResult.duration,
        segmentCount: whisperResult.segments.length,
        textPreview: whisperResult.text.slice(0, 200)
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
"[project]/src/app/api/videos/[id]/transcribe/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * POST /api/videos/[id]/transcribe
 *
 * Body (optional):
 *   { "modelSize": "base", "language": null, "wordTimestamps": true }
 *
 * Triggers the full transcription pipeline:
 *   extract audio → run Whisper (Python) → persist transcript → mark video READY
 *
 * This is a long-running operation (10s–10min depending on video length + model).
 * Returns the transcript summary on completion.
 */ __turbopack_context__.s([
    "POST",
    ()=>POST,
    "dynamic",
    ()=>dynamic,
    "maxDuration",
    ()=>maxDuration
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-route] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$services$2f$transcription$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/server/services/transcription.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$repositories$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/server/db/repositories.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$api$2f$responses$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/server/api/responses.ts [app-route] (ecmascript)");
;
;
;
;
const dynamic = 'force-dynamic';
const maxDuration = 1200 // 20 min ceiling
;
const RequestSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    modelSize: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        'tiny',
        'base',
        'small',
        'medium',
        'large-v3'
    ]).optional(),
    language: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().length(2).nullable().optional(),
    wordTimestamps: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().optional()
});
async function POST(req, { params }) {
    try {
        const { id } = await params;
        const video = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$repositories$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getVideo"])(id);
        if (!video) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$api$2f$responses$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["failNotFound"])('Video', id);
        let body = {};
        try {
            body = await req.json();
        } catch  {
        // Empty body is fine; defaults will be used.
        }
        const parsed = RequestSchema.safeParse(body);
        if (!parsed.success) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$api$2f$responses$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["fail"])('VALIDATION_ERROR', 'Invalid request body', 422, parsed.error.flatten());
        }
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$services$2f$transcription$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["transcribeVideo"])(id, parsed.data);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$api$2f$responses$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ok"])(result);
    } catch (e) {
        if (e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$services$2f$transcription$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TranscribeError"]) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$api$2f$responses$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["fail"])('TRANSCRIBE_FAILED', e.message, 500, e.stderr ? {
                stderr: e.stderr.slice(0, 1000)
            } : undefined);
        }
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$api$2f$responses$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["failInternal"])('Transcription failed', e);
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__8491419f._.js.map