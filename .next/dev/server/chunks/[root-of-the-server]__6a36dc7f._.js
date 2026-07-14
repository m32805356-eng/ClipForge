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
"[project]/src/app/api/stats/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * GET /api/stats
 * Returns aggregated dashboard stats: video/clip/highlight counts + storage.
 */ __turbopack_context__.s([
    "GET",
    ()=>GET,
    "dynamic",
    ()=>dynamic
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$repositories$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/server/db/repositories.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$api$2f$responses$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/server/api/responses.ts [app-route] (ecmascript)");
;
;
const dynamic = 'force-dynamic';
async function GET(_req) {
    try {
        const stats = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$repositories$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDashboardStats"])();
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$api$2f$responses$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ok"])(stats);
    } catch (e) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$api$2f$responses$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["failInternal"])('Failed to load stats', e);
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__6a36dc7f._.js.map