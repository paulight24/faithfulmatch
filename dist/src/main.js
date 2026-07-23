"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const swagger_1 = require("@nestjs/swagger");
const helmet_1 = require("helmet");
const path = require("path");
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const transform_interceptor_1 = require("./common/interceptors/transform.interceptor");
const prisma_service_1 = require("./prisma/prisma.service");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { rawBody: true });
    const config = app.get(config_1.ConfigService);
    const reflector = app.get(core_1.Reflector);
    const apiUrl = config.get('apiUrl');
    if (apiUrl) {
        const prisma = app.get(prisma_service_1.PrismaService);
        const { count } = await prisma.profilePhoto.aggregate({
            _count: { _all: true },
            where: { url: { startsWith: '/api/v1/uploads/' } },
        }).then((r) => ({ count: r._count._all }));
        if (count > 0) {
            await prisma.$executeRawUnsafe(`UPDATE profile_photos SET url = CONCAT(?, '/uploads/', storageKey) WHERE url LIKE '/api/v1/uploads/%'`, apiUrl);
            console.log(`Repaired ${count} profile photo(s) with relative URLs.`);
        }
    }
    app.set('trust proxy', 1);
    const storageProvider = config.get('storage.provider') ?? 'local';
    if (storageProvider === 'local') {
        const uploadDir = path.resolve(config.get('storage.uploadDir') ?? 'uploads');
        app.useStaticAssets(uploadDir, { prefix: '/api/v1/uploads' });
    }
    else {
        const { STORAGE_PROVIDER } = await Promise.resolve().then(() => require('./infrastructure/storage/storage-provider.interface'));
        const storage = app.get(STORAGE_PROVIDER);
        app.use('/api/v1/uploads', async (req, res) => {
            const storageKey = req.path.replace(/^\//, '');
            if (!storageKey)
                return res.status(404).json({ error: 'Not found' });
            try {
                const buffer = await storage.getFileBuffer(storageKey);
                const ext = path.extname(storageKey).toLowerCase();
                const mime = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg';
                res.set('Content-Type', mime);
                res.set('Cache-Control', 'public, max-age=31536000, immutable');
                res.send(buffer);
            }
            catch {
                res.status(404).json({ error: 'Not found' });
            }
        });
    }
    app.use((0, helmet_1.default)());
    app.set('etag', false);
    const appUrl = config.get('appUrl') ?? 'http://localhost:4200';
    const adminUrl = config.get('adminUrl') ?? 'http://localhost:4300';
    const isProduction = config.get('nodeEnv') === 'production';
    const allowedOrigins = [
        appUrl,
        adminUrl,
        'http://localhost:4200',
        'http://localhost:4300',
        'http://localhost:3000',
        'https://empoweredforwealth.com',
        'https://faithfulmatch.love',
        'https://www.faithfulmatch.love',
        'https://localhost',
        'capacitor://localhost',
    ];
    app.enableCors({
        origin: isProduction
            ? allowedOrigins
            :
                (origin, callback) => {
                    if (!origin || allowedOrigins.includes(origin) || /^http:\/\/(localhost|(\d{1,3}\.){3}\d{1,3})(:\d+)?$/.test(origin)) {
                        callback(null, true);
                    }
                    else {
                        callback(new Error('Not allowed by CORS'));
                    }
                },
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    });
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    app.useGlobalFilters(new http_exception_filter_1.GlobalExceptionFilter());
    app.useGlobalInterceptors(new transform_interceptor_1.TransformInterceptor());
    const nodeEnv = config.get('nodeEnv');
    if (nodeEnv !== 'production') {
        const swaggerConfig = new swagger_1.DocumentBuilder()
            .setTitle('FaithfulMatch.love API')
            .setDescription('Christ-centered matchmaking API')
            .setVersion('1.0')
            .addBearerAuth()
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
        swagger_1.SwaggerModule.setup('api/docs', app, document);
    }
    const port = config.get('port') ?? 3000;
    await app.listen(port);
    console.log(`FaithfulMatch API running on http://localhost:${port}/api/v1`);
    console.log(`Health: http://localhost:${port}/api/v1/health`);
    if (nodeEnv !== 'production') {
        console.log(`Swagger: http://localhost:${port}/api/docs`);
    }
}
bootstrap();
//# sourceMappingURL=main.js.map