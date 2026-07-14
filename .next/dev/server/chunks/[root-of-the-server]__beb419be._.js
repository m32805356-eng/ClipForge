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
"[project]/src/server/services/highlight-detection.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DURATION_RANGES",
    ()=>DURATION_RANGES,
    "HighlightError",
    ()=>HighlightError,
    "detectHighlights",
    ()=>detectHighlights
]);
/**
 * ClipForge — highlight detection service.
 *
 * Analyzes transcript segments to detect engaging moments across 6 categories:
 *   - hook       : strong opening / attention-grabbing statements
 *   - emotional  : feeling-laden language, personal stakes
 *   - story      : narrative markers ("so then", "I remember", "it started")
 *   - funny      : humor cues (laughter, exaggeration, punchline shapes)
 *   - educational: explanations, definitions, "how to", "this is why"
 *   - viral      : shareable punchlines, surprising claims, quotable lines
 *
 * Approach:
 *   - Heuristic scoring per segment, combining:
 *     • keyword/phrase pattern matches (weighted)
 *     • structural signals (questions, numbers, superlatives, negations)
 *     • lexical density (longer/richer sentences)
 *     • position bias (first 10% = hook boost, last 10% = payoff boost)
 *   - Adjacent high-scoring segments are merged into a single highlight
 *     spanning the combined time range, with the peak score preserved.
 *   - Each highlight gets a generated title (first ~8 words) + reasoning.
 *
 * This is fully deterministic and local — no API calls. An optional LLM-based
 * refinement pass could be layered on top later.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$repositories$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/server/db/repositories.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$clipforge$2f$server$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/clipforge/server/logger.ts [app-route] (ecmascript)");
;
;
;
;
const log = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$clipforge$2f$server$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].scoped('highlights');
class HighlightError extends Error {
    constructor(message){
        super(message);
        this.name = 'HighlightError';
    }
}
/** Pattern libraries. Each entry: [regex, weight]. */ const PATTERNS = {
    hook: [
        {
            re: /\b(welcome|let'?s (start|begin|dive)|today (we|i|let'?s)|in this video|by the end)\b/i,
            weight: 3,
            label: 'opening hook'
        },
        {
            re: /\b(you won'?t believe|stop (what you'?re doing|scrolling)|wait (until|till))\b/i,
            weight: 4,
            label: 'pattern interrupt'
        },
        {
            re: /\b(the (biggest|most|number one|secret)|nobody talks about|here'?s the thing)\b/i,
            weight: 3,
            label: 'bold claim'
        },
        {
            re: /\b(question|ask yourself|have you ever)\b/i,
            weight: 2,
            label: 'rhetorical question'
        }
    ],
    emotional: [
        {
            re: /\b(i (feel|felt|was|am)|love|hate|afraid|scared|worried|excited|amazing|incredible|terrible|awful|heart|pain|joy|dream)\b/i,
            weight: 3,
            label: 'emotional language'
        },
        {
            re: /\b(cry|tears|laugh|smile|breakthrough|devastat|tragic|beautiful)\b/i,
            weight: 3,
            label: 'strong feeling'
        },
        {
            re: /\b(i (lost|gained|gave up|kept going)|changed my life|turned (it )?around)\b/i,
            weight: 4,
            label: 'personal stakes'
        },
        {
            re: /\b(thank(ful|s)|grateful|blessed|appreciate)\b/i,
            weight: 2,
            label: 'gratitude'
        }
    ],
    story: [
        {
            re: /\b(so then|and then|i remember|it (all )?started|back (in|then)|years ago|one day)\b/i,
            weight: 3,
            label: 'narrative marker'
        },
        {
            re: /\b(suddenly|out of nowhere|that'?s when|everything changed)\b/i,
            weight: 3,
            label: 'turning point'
        },
        {
            re: /\b(he (said|told)|she (said|told)|they (said|told)|we went|i went)\b/i,
            weight: 2,
            label: 'dialogue/action'
        },
        {
            re: /\b(story|back in the day|long story short|to make a long)\b/i,
            weight: 2,
            label: 'story cue'
        }
    ],
    funny: [
        {
            re: /\b(lol|haha|lmao|rofl|joke|funny|hilarious|kidding)\b/i,
            weight: 3,
            label: 'humor cue'
        },
        {
            re: /\b(obviously|clearly|duh|of course|right\?)\b/i,
            weight: 1,
            label: 'sarcasm cue'
        },
        {
            re: /\b(worst|dumbest|stupidest|ridiculous|absurd)\b/i,
            weight: 2,
            label: 'exaggeration'
        }
    ],
    educational: [
        {
            re: /\b(this is (why|how|because)|the reason|that'?s why|so the key|the trick)\b/i,
            weight: 3,
            label: 'explanation'
        },
        {
            re: /\b(learn|understand|explain|define|means|basically|in other words)\b/i,
            weight: 2,
            label: 'teaching'
        },
        {
            re: /\b(step (1|one|2|two)|first you|then you|finally you|how to)\b/i,
            weight: 3,
            label: 'instructional'
        },
        {
            re: /\b(example|for instance|imagine|think of it (like|as))\b/i,
            weight: 2,
            label: 'example'
        },
        {
            re: /\b(tip|trick|hack|secret|pro tip)\b/i,
            weight: 3,
            label: ' actionable tip'
        }
    ],
    viral: [
        {
            re: /\b(mind.?blown|game.?changer|next level|blew my mind|changed everything)\b/i,
            weight: 4,
            label: 'wow factor'
        },
        {
            re: /\b(secret|nobody knows|hidden|underground|banned)\b/i,
            weight: 3,
            label: 'exclusivity'
        },
        {
            re: /\b(free|no cost|zero|100%|guarantee(d)?)\b/i,
            weight: 2,
            label: 'irresistible offer'
        },
        {
            re: /\b(you (can|could|should)|try this|do this|stop doing)\b/i,
            weight: 2,
            label: 'call to action'
        },
        {
            re: /\b(no (cloud|api|fees|subscription|monthly))\b/i,
            weight: 3,
            label: 'value proposition'
        },
        {
            re: /\b(open source|local|your own|right on your)\b/i,
            weight: 2,
            label: 'positioning'
        }
    ]
};
/** Structural signals applied to all categories as multipliers. */ function structuralSignals(text) {
    let multiplier = 1;
    const tags = [];
    // Numbers / statistics boost credibility + shareability.
    if (/\b\d+(\.\d+)?%?\b/.test(text)) {
        multiplier += 0.15;
        tags.push('has-number');
    }
    // Questions engage.
    if (text.includes('?')) {
        multiplier += 0.1;
        tags.push('question');
    }
    // Superlatives.
    if (/\b(best|worst|biggest|most|least|fastest|cheapest|simplest)\b/i.test(text)) {
        multiplier += 0.15;
        tags.push('superlative');
    }
    // Negations / contrasts ("not X, but Y").
    if (/\bnot\b/i.test(text) && /\b(but|however|instead|rather)\b/i.test(text)) {
        multiplier += 0.1;
        tags.push('contrast');
    }
    // Rule of three (comma-separated lists of 3).
    if ((text.match(/,/g) || []).length >= 2) {
        multiplier += 0.05;
        tags.push('list');
    }
    return {
        multiplier,
        tags
    };
}
/** Score a single segment for a given category. Returns 0..1 + matched labels. */ function scoreSegmentForCategory(seg, category, totalDuration) {
    const text = seg.text;
    if (!text) return {
        score: 0,
        labels: []
    };
    let raw = 0;
    const labels = [];
    for (const { re, weight, label } of PATTERNS[category]){
        if (re.test(text)) {
            raw += weight;
            labels.push(label);
        }
    }
    // Structural multiplier.
    const struct = structuralSignals(text);
    for (const tag of struct.tags)labels.push(tag);
    raw *= struct.multiplier;
    // Length density: reward segments with more substance (cap at 25 words).
    const wordCount = seg.words.length || text.split(/\s+/).length;
    const lengthBonus = Math.min(wordCount / 25, 1) * 0.5;
    raw += lengthBonus;
    // Position bias.
    const midpoint = (seg.start + seg.end) / 2;
    const position = totalDuration > 0 ? midpoint / totalDuration : 0;
    if (position < 0.1) raw *= 1.2; // opening hook boost
    if (position > 0.9) raw *= 1.1; // closing payoff boost
    // Squash to 0..1 via a soft curve so small advantages compound.
    const score = 1 - Math.exp(-raw / 3);
    return {
        score: Math.min(score, 1),
        labels
    };
}
/** Build a short title from the segment text (first ~8 words, title-cased). */ function buildTitle(text) {
    const words = text.trim().split(/\s+/).slice(0, 8).join(' ');
    if (!words) return 'Untitled moment';
    // Strip leading conjunctions for a cleaner title.
    const cleaned = words.replace(/^(and|but|so|then|because|when|while|if)\s+/i, '');
    // Capitalize first letter.
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}
/** Build human-readable reasoning from matched labels + score. */ function buildReasoning(category, labels, score, position) {
    const posDesc = position < 0.15 ? 'near the start' : position > 0.85 ? 'near the end' : 'in the middle';
    const confidence = score > 0.7 ? 'High' : score > 0.45 ? 'Moderate' : 'Low';
    const labelStr = labels.length > 0 ? labels.slice(0, 3).join(', ') : 'general engagement';
    return `${confidence} confidence ${category} moment ${posDesc}. Signals: ${labelStr}.`;
}
const DURATION_RANGES = {
    'under-30': {
        min: 15,
        max: 29,
        label: 'Under 30 seconds'
    },
    '30-60': {
        min: 30,
        max: 60,
        label: '30 to 60 seconds'
    },
    '60-plus': {
        min: 60,
        max: 90,
        label: '1 minute+'
    }
};
/**
 * Custom prompt keywords — when the user provides a custom prompt like
 * "find the emotional moments" or "find key tips", these map to extra
 * pattern libraries that boost matching segments.
 */ const CUSTOM_PROMPT_PATTERNS = [
    // Emotional cues
    {
        re: /\b(feel|felt|emotion|heart|love|hate|cry|tears|joy|pain|fear|afraid|scared|amazing|incredible|terrible|awful|beautiful|devastat|tragic|breakthrough)\b/i,
        weight: 4,
        label: 'emotional'
    },
    // Funny cues
    {
        re: /\b(funny|hilarious|joke|laugh|lol|haha|kidding|ridiculous|absurd|silly|hilarious)\b/i,
        weight: 4,
        label: 'funny'
    },
    // Tips / educational
    {
        re: /\b(tip|advice|recommend|should|try|do this|hack|trick|secret|pro tip|key|important|remember|don'?t forget|make sure)\b/i,
        weight: 4,
        label: 'tip'
    },
    // Story / narrative
    {
        re: /\b(story|i remember|it started|back then|so then|one day|suddenly|that'?s when|everything changed)\b/i,
        weight: 4,
        label: 'story'
    },
    // Hooks / attention
    {
        re: /\b(wait|stop|listen|look|here'?s|did you know|imagine|picture this|what if)\b/i,
        weight: 4,
        label: 'hook'
    },
    // Viral / quotable
    {
        re: /\b(game.?changer|mind.?blown|never|always|nobody|everybody|secret|truth|lie|myth)\b/i,
        weight: 3,
        label: 'viral'
    }
];
/**
 * Score a segment against a custom prompt. Uses keyword overlap between the
 * prompt and the segment text, plus the CUSTOM_PROMPT_PATTERNS library.
 */ function scoreSegmentForCustomPrompt(seg, customPrompt, totalDuration) {
    const text = seg.text.toLowerCase();
    const prompt = customPrompt.toLowerCase();
    let raw = 0;
    const labels = [];
    // 1. Direct keyword overlap: split prompt into words, check each against segment text.
    const promptWords = prompt.split(/\s+/).filter((w)=>w.length > 3 && ![
            'find',
            'that',
            'this',
            'with',
            'from',
            'have',
            'they',
            'them',
            'were',
            'been',
            'will',
            'would',
            'could',
            'should'
        ].includes(w));
    let overlapCount = 0;
    for (const w of promptWords){
        if (text.includes(w)) {
            overlapCount++;
        }
    }
    if (overlapCount > 0) {
        raw += Math.min(overlapCount * 1.5, 6);
        labels.push(`prompt-match (${overlapCount})`);
    }
    // 2. Pattern library — boost segments matching common "what the user wants" cues.
    for (const { re, weight, label } of CUSTOM_PROMPT_PATTERNS){
        // Only apply patterns whose label relates to the prompt keywords.
        const labelWords = label.split(/[\s-]+/);
        const promptMentionsCategory = labelWords.some((lw)=>prompt.includes(lw));
        if (promptMentionsCategory && re.test(seg.text)) {
            raw += weight;
            labels.push(`prompt:${label}`);
        }
    }
    // 3. Structural multiplier.
    const struct = structuralSignals(seg.text);
    for (const tag of struct.tags)labels.push(tag);
    raw *= struct.multiplier;
    // 4. Length density.
    const wordCount = seg.words.length || seg.text.split(/\s+/).length;
    const lengthBonus = Math.min(wordCount / 25, 1) * 0.5;
    raw += lengthBonus;
    // 5. Position bias.
    const midpoint = (seg.start + seg.end) / 2;
    const position = totalDuration > 0 ? midpoint / totalDuration : 0;
    if (position < 0.1) raw *= 1.2;
    if (position > 0.9) raw *= 1.1;
    const score = 1 - Math.exp(-raw / 3);
    return {
        score: Math.min(score, 1),
        labels
    };
}
/**
 * Adjust a highlight's time boundaries to fit within the target duration range.
 * Snaps to sentence boundaries (segment edges) while staying within [min, max].
 */ function adjustToDurationRange(highlight, segments, target) {
    const range = DURATION_RANGES[target];
    const currentDuration = highlight.end - highlight.start;
    // If already in range, return as-is.
    if (currentDuration >= range.min && currentDuration <= range.max) {
        return highlight;
    }
    // If too short: extend forward (then backward) to reach min, snapping to segment edges.
    if (currentDuration < range.min) {
        let newEnd = highlight.start + range.min;
        // Snap forward to the nearest segment end that doesn't exceed max.
        for (const seg of segments){
            if (seg.end > highlight.start && seg.end <= highlight.start + range.max) {
                if (seg.end >= newEnd) {
                    newEnd = seg.end;
                    break;
                }
            }
        }
        newEnd = Math.min(newEnd, highlight.start + range.max);
        // If still too short, extend the start backward.
        let newStart = highlight.start;
        if (newEnd - newStart < range.min) {
            newStart = Math.max(0, newEnd - range.min);
            // Snap backward to nearest segment start.
            for(let i = segments.length - 1; i >= 0; i--){
                const seg = segments[i];
                if (seg.start < newEnd && seg.start >= newEnd - range.max) {
                    if (newEnd - seg.start >= range.min) {
                        newStart = seg.start;
                        break;
                    }
                }
            }
        }
        return {
            ...highlight,
            start: newStart,
            end: newEnd
        };
    }
    // If too long: trim from the end first, then the start, snapping to segment edges.
    if (currentDuration > range.max) {
        let newEnd = highlight.start + range.max;
        // Snap backward to nearest segment end within range.
        for(let i = segments.length - 1; i >= 0; i--){
            const seg = segments[i];
            if (seg.end <= highlight.start + range.max && seg.end > highlight.start + range.min) {
                newEnd = seg.end;
                break;
            }
        }
        let newStart = highlight.start;
        if (newEnd - newStart > range.max) {
            newStart = newEnd - range.max;
        }
        if (newEnd - newStart < range.min) {
            newEnd = newStart + range.min;
        }
        return {
            ...highlight,
            start: newStart,
            end: newEnd
        };
    }
    return highlight;
}
/** Merge overlapping/adjacent highlights within the same category. */ function mergeAdjacent(highlights, gapSeconds = 1.5) {
    if (highlights.length === 0) return [];
    const sorted = [
        ...highlights
    ].sort((a, b)=>a.start - b.start);
    const merged = [
        sorted[0]
    ];
    for(let i = 1; i < sorted.length; i++){
        const prev = merged[merged.length - 1];
        const cur = sorted[i];
        if (cur.category === prev.category && cur.start - prev.end <= gapSeconds) {
            // Extend prev, keep the higher score + richer reasoning.
            prev.end = Math.max(prev.end, cur.end);
            if (cur.score > prev.score) {
                prev.score = cur.score;
                prev.title = cur.title;
                prev.reasoning = cur.reasoning;
            }
            prev.excerpt = prev.excerpt + ' ' + cur.excerpt;
        } else {
            merged.push(cur);
        }
    }
    return merged;
}
async function detectHighlights(videoId, opts = {}) {
    const maxHighlights = opts.maxHighlights ?? 12;
    const minScore = opts.minScore ?? 0.25;
    const customPrompt = opts.customPrompt?.trim() || null;
    const targetDuration = opts.targetDuration ?? null;
    const transcript = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$repositories$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getTranscript"])(videoId);
    if (!transcript) {
        throw new HighlightError('No transcript found — transcribe the video first.');
    }
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$repositories$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["updateVideoStatus"])(videoId, 'ANALYZING', {
        progress: 50,
        message: 'Detecting highlights…'
    });
    let segments = [];
    try {
        segments = JSON.parse(transcript.segments);
    } catch  {
        throw new HighlightError('Transcript segments are corrupt.');
    }
    if (segments.length === 0) {
        throw new HighlightError('Transcript has no segments (video may have no speech).');
    }
    const totalDuration = transcript.duration ?? segments[segments.length - 1]?.end ?? 0;
    log.info('Detecting highlights', {
        videoId,
        segmentCount: segments.length,
        duration: totalDuration,
        customPrompt: customPrompt ? customPrompt.slice(0, 60) : null,
        targetDuration
    });
    const categories = [
        'hook',
        'emotional',
        'story',
        'funny',
        'educational',
        'viral'
    ];
    const all = [];
    for (const seg of segments){
        for (const category of categories){
            const { score, labels } = scoreSegmentForCategory(seg, category, totalDuration);
            if (score < minScore) continue;
            const position = totalDuration > 0 ? (seg.start + seg.end) / 2 / totalDuration : 0;
            all.push({
                start: seg.start,
                end: seg.end,
                title: buildTitle(seg.text),
                reasoning: buildReasoning(category, labels, score, position),
                category,
                score: Math.round(score * 100) / 100,
                excerpt: seg.text.trim()
            });
        }
        // If a custom prompt is provided, also score the segment against it.
        // Segments that match the prompt get a "hook" category (most versatile)
        // with reasoning that references the user's prompt.
        if (customPrompt) {
            const { score, labels } = scoreSegmentForCustomPrompt(seg, customPrompt, totalDuration);
            if (score >= minScore) {
                const position = totalDuration > 0 ? (seg.start + seg.end) / 2 / totalDuration : 0;
                const posDesc = position < 0.15 ? 'near the start' : position > 0.85 ? 'near the end' : 'in the middle';
                const confidence = score > 0.7 ? 'High' : score > 0.45 ? 'Moderate' : 'Low';
                all.push({
                    start: seg.start,
                    end: seg.end,
                    title: buildTitle(seg.text),
                    reasoning: `${confidence} confidence match for user prompt "${customPrompt.slice(0, 50)}" ${posDesc}. Signals: ${labels.slice(0, 3).join(', ')}.`,
                    category: 'hook',
                    score: Math.round(score * 100) / 100,
                    excerpt: seg.text.trim()
                });
            }
        }
    }
    // Merge adjacent same-category highlights, then take top-N by score.
    const merged = mergeAdjacent(all);
    let ranked = merged.sort((a, b)=>b.score - a.score).slice(0, maxHighlights);
    // If a target duration is specified, adjust each highlight's boundaries
    // to fit within the target range, snapping to sentence/segment edges.
    if (targetDuration) {
        const range = DURATION_RANGES[targetDuration];
        log.info('Adjusting highlights to target duration', {
            target: targetDuration,
            range
        });
        ranked = ranked.map((h)=>adjustToDurationRange(h, segments, targetDuration));
    }
    // Persist.
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$repositories$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createHighlights"])(ranked.map((h)=>({
            videoId,
            start: h.start,
            end: h.end,
            title: h.title,
            reasoning: h.reasoning,
            category: h.category,
            score: h.score,
            excerpt: h.excerpt
        })));
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$db$2f$repositories$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["updateVideoStatus"])(videoId, 'READY', {
        progress: 100,
        message: null
    });
    log.info('Highlights detected', {
        videoId,
        detected: all.length,
        merged: merged.length,
        kept: ranked.length
    });
    return {
        count: ranked.length,
        highlights: ranked
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
"[project]/src/app/api/videos/[id]/highlights/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * POST /api/videos/[id]/highlights
 * Runs heuristic highlight detection on the video's transcript.
 *
 * Body (optional):
 *   {
 *     "maxHighlights": 12,
 *     "minScore": 0.25,
 *     "customPrompt": "Find the emotional moments",
 *     "targetDuration": "30-60"  // "under-30" | "30-60" | "60-plus"
 *   }
 *
 * - customPrompt: free-text instructions from the user. Segments matching the
 *   prompt's keywords get an extra score boost and are included in the results.
 * - targetDuration: adjusts highlight boundaries to fit the target range:
 *     under-30 → 15-29s, 30-60 → 30-60s, 60-plus → 60-90s.
 *   Boundaries snap to sentence (segment) edges while staying within range.
 *
 * Returns the detected highlights (also persisted to DB).
 */ __turbopack_context__.s([
    "POST",
    ()=>POST,
    "dynamic",
    ()=>dynamic,
    "maxDuration",
    ()=>maxDuration
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-route] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$services$2f$highlight$2d$detection$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/server/services/highlight-detection.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$api$2f$responses$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/server/api/responses.ts [app-route] (ecmascript)");
;
;
;
const dynamic = 'force-dynamic';
const maxDuration = 120;
const RequestSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    maxHighlights: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().min(1).max(50).optional(),
    minScore: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().min(0).max(1).optional(),
    customPrompt: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(500).optional(),
    targetDuration: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        'under-30',
        '30-60',
        '60-plus'
    ]).optional()
});
async function POST(req, { params }) {
    try {
        const { id } = await params;
        let body = {};
        try {
            body = await req.json();
        } catch  {
        // empty body → defaults
        }
        const parsed = RequestSchema.safeParse(body);
        if (!parsed.success) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$api$2f$responses$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["fail"])('VALIDATION_ERROR', 'Invalid request body', 422, parsed.error.flatten());
        }
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$services$2f$highlight$2d$detection$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["detectHighlights"])(id, parsed.data);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$api$2f$responses$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ok"])(result);
    } catch (e) {
        if (e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$services$2f$highlight$2d$detection$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HighlightError"]) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$api$2f$responses$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["fail"])('HIGHLIGHT_FAILED', e.message, 400);
        }
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2f$api$2f$responses$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["failInternal"])('Highlight detection failed', e);
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__beb419be._.js.map