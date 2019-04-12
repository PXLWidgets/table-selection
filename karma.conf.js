module.exports = function(config) {

    const karmaPlugins = [
        require("karma-chai"),
        require("karma-chrome-launcher"),
        require("karma-coverage"),
        require("karma-coveralls"),
        require("karma-mocha"),
        require("karma-mocha-reporter"),
        require("karma-remap-coverage"),
        require("karma-sinon"),
        require("karma-sourcemap-loader"),
        require("karma-webpack"),
    ];

    const options = {
        autoWatch: true,
        client: {
            clearContext: false, // leave Spec Runner output visible in browser
        },
        files: [
            __dirname + "/test/karma-test-shim.spec.ts",
        ],
        frameworks: ["mocha", "chai", "sinon"],
        mime: {
            "text/x-typescript": ["ts", "tsx"],
        },
        plugins: karmaPlugins,
        singleRun: false,

        preprocessors: {
            [__dirname + "/test/karma-test-shim.spec.ts"]: ["webpack", "sourcemap"],
            [__dirname + "/src/**/*.ts"]: ["coverage"],
        },

        webpack: {
            devtool: "inline-source-map",
            mode: "development",
            module: {
                rules: [
                    {
                        exclude: /node_modules/,
                        loader: "ts-loader",
                        options: {
                            compilerOptions: {
                                declaration: false,
                                outDir: __dirname,
                            },
                        },
                        test: /\.ts$/,
                    },
                    // instrument only testing sources with Istanbul
                    {
                        enforce: "post",
                        exclude: /(\.(e2e|spec|mock|spec-helper)\.ts|node_modules)$/,
                        loader: "istanbul-instrumenter-loader?embedSource=true&noAutoWrap=true",
                        test: /\.ts$/,
                    },
                ],
            },
            resolve: {
                extensions: [".ts", ".js"],
            },
        },

        reporters: [
            "remap-coverage",
            "coverage",
            "mocha",
        ],

        browsers: ["ChromeHeadless"],

        mochaReporter: {
            showDiff: true,
        },

        coverageReporter: {
            type: "in-memory",
        },

        remapCoverageReporter: {
            cobertura: "./coverage/cobertura.xml",
            html: "./coverage/html",
            json: "./coverage/coverage.json",
            lcovonly: "./coverage/lcov.info",
            "text-summary": null,
        },
    };

    if (process.env.TRAVIS) {
        options.autoWatch = false;
        options.singleRun = true;
        options.concurrency = 1;
        options.reporters.push("coveralls");
    }

    config.set(options);
};
