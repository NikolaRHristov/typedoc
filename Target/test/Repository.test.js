"use strict";
var __addDisposableResource = (this && this.__addDisposableResource) || function (env, value, async) {
    if (value !== null && value !== void 0) {
        if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
        var dispose, inner;
        if (async) {
            if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
            dispose = value[Symbol.asyncDispose];
        }
        if (dispose === void 0) {
            if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
            dispose = value[Symbol.dispose];
            if (async) inner = dispose;
        }
        if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
        if (inner) dispose = function() { try { inner.call(this); } catch (e) { return Promise.reject(e); } };
        env.stack.push({ value: value, dispose: dispose, async: async });
    }
    else if (async) {
        env.stack.push({ async: true });
    }
    return value;
};
var __disposeResources = (this && this.__disposeResources) || (function (SuppressedError) {
    return function (env) {
        function fail(e) {
            env.error = env.hasError ? new SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
            env.hasError = true;
        }
        function next() {
            while (env.stack.length) {
                var rec = env.stack.pop();
                try {
                    var result = rec.dispose && rec.dispose.call(rec.value);
                    if (rec.async) return Promise.resolve(result).then(next, function(e) { fail(e); return next(); });
                }
                catch (e) {
                    fail(e);
                }
            }
            if (env.hasError) throw env.error;
        }
        return next();
    };
})(typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
});
Object.defineProperty(exports, "__esModule", { value: true });
const repository_1 = require("../lib/converter/utils/repository");
const assert_1 = require("assert");
const fs_fixture_builder_1 = require("@typestrong/fs-fixture-builder");
const child_process_1 = require("child_process");
const TestLogger_1 = require("./TestLogger");
const path_1 = require("path");
const paths_1 = require("../lib/utils/paths");
function git(cwd, ...args) {
    const env = {
        GIT_AUTHOR_NAME: "test",
        GIT_AUTHOR_EMAIL: "test@example.com",
        GIT_AUTHOR_DATE: "2024-03-31T22:04:50.119Z",
        GIT_COMMITTER_NAME: "test",
        GIT_COMMITTER_EMAIL: "test@example.com",
        GIT_COMMITTER_DATE: "2024-03-31T22:04:50.119Z",
    };
    return (0, child_process_1.spawnSync)("git", ["-C", cwd, ...args], {
        encoding: "utf-8",
        windowsHide: true,
        env,
    });
}
describe("Repository", function () {
    describe("guessSourceUrlTemplate helper", () => {
        it("handles a personal GitHub HTTPS URL", () => {
            const mockRemotes = ["https://github.com/joebloggs/foobar.git"];
            (0, assert_1.deepStrictEqual)((0, repository_1.guessSourceUrlTemplate)(mockRemotes), "https://github.com/joebloggs/foobar/blob/{gitRevision}/{path}#L{line}");
        });
        it("handles a personal GitHub SSH URL", () => {
            const mockRemotes = ["git@github.com:TypeStrong/typedoc.git"];
            (0, assert_1.deepStrictEqual)((0, repository_1.guessSourceUrlTemplate)(mockRemotes), "https://github.com/TypeStrong/typedoc/blob/{gitRevision}/{path}#L{line}");
        });
        it("handles an enterprise GitHub URL", () => {
            const mockRemotes = ["git@github.acme.com:joebloggs/foobar.git"];
            (0, assert_1.deepStrictEqual)((0, repository_1.guessSourceUrlTemplate)(mockRemotes), "https://github.acme.com/joebloggs/foobar/blob/{gitRevision}/{path}#L{line}");
        });
        it("handles an enterprise GitHub URL", () => {
            const mockRemotes = [
                "ssh://org@bigcompany.githubprivate.com/joebloggs/foobar.git",
            ];
            (0, assert_1.deepStrictEqual)((0, repository_1.guessSourceUrlTemplate)(mockRemotes), "https://bigcompany.githubprivate.com/joebloggs/foobar/blob/{gitRevision}/{path}#L{line}");
        });
        it("handles a ghe.com URL", () => {
            const mockRemotes = [
                "ssh://org@bigcompany.ghe.com/joebloggs/foobar.git",
            ];
            (0, assert_1.deepStrictEqual)((0, repository_1.guessSourceUrlTemplate)(mockRemotes), "https://bigcompany.ghe.com/joebloggs/foobar/blob/{gitRevision}/{path}#L{line}");
        });
        it("handles a github.us URL", () => {
            const mockRemotes = [
                "ssh://org@bigcompany.github.us/joebloggs/foobar.git",
            ];
            (0, assert_1.deepStrictEqual)((0, repository_1.guessSourceUrlTemplate)(mockRemotes), "https://bigcompany.github.us/joebloggs/foobar/blob/{gitRevision}/{path}#L{line}");
        });
        it("handles a bitbucket URL", () => {
            const mockRemotes = [
                "https://joebloggs@bitbucket.org/joebloggs/foobar.git",
            ];
            (0, assert_1.deepStrictEqual)((0, repository_1.guessSourceUrlTemplate)(mockRemotes), "https://bitbucket.org/joebloggs/foobar/src/{gitRevision}/{path}#lines-{line}");
        });
        it("handles a bitbucket SSH URL", () => {
            const mockRemotes = ["git@bitbucket.org:joebloggs/foobar.git"];
            (0, assert_1.deepStrictEqual)((0, repository_1.guessSourceUrlTemplate)(mockRemotes), "https://bitbucket.org/joebloggs/foobar/src/{gitRevision}/{path}#lines-{line}");
        });
        it("handles a GitLab URL", () => {
            const mockRemotes = ["https://gitlab.com/joebloggs/foobar.git"];
            (0, assert_1.deepStrictEqual)((0, repository_1.guessSourceUrlTemplate)(mockRemotes), "https://gitlab.com/joebloggs/foobar/-/blob/{gitRevision}/{path}#L{line}");
        });
        it("handles a GitLab SSH URL", () => {
            const mockRemotes = ["git@gitlab.com:joebloggs/foobar.git"];
            (0, assert_1.deepStrictEqual)((0, repository_1.guessSourceUrlTemplate)(mockRemotes), "https://gitlab.com/joebloggs/foobar/-/blob/{gitRevision}/{path}#L{line}");
        });
        it("Gracefully handles unknown urls", () => {
            const mockRemotes = ["git@example.com"];
            (0, assert_1.deepStrictEqual)((0, repository_1.guessSourceUrlTemplate)(mockRemotes), undefined);
        });
    });
    describe("getURL", () => {
        const env_1 = { stack: [], error: void 0, hasError: false };
        try {
            const project = __addDisposableResource(env_1, (0, fs_fixture_builder_1.tempdirProject)(), false);
            afterEach(() => {
                project.rm();
            });
            it("Handles replacements", function () {
                project.addFile("test.js", "console.log('hi!')");
                project.write();
                git(project.cwd, "init", "-b", "test");
                git(project.cwd, "add", ".");
                git(project.cwd, "commit", "-m", "Test commit");
                git(project.cwd, "remote", "add", "origin", "git@github.com:TypeStrong/typedoc.git");
                const repo = repository_1.GitRepository.tryCreateRepository(project.cwd, "{gitRevision}/{gitRevision:short}/{path}/{line}", "", // revision, empty to get from repo
                "origin", // remote
                new TestLogger_1.TestLogger());
                (0, assert_1.ok)(repo);
                (0, assert_1.deepStrictEqual)(repo.getURL((0, paths_1.normalizePath)((0, path_1.join)(project.cwd, "test.js")), 1), "b53cc55bcdd9bc5920787a1d4a4a15fa24123b04/b53cc55b/test.js/1");
            });
        }
        catch (e_1) {
            env_1.error = e_1;
            env_1.hasError = true;
        }
        finally {
            __disposeResources(env_1);
        }
    });
});
describe("RepositoryManager - no git", () => { });
describe("RepositoryManager - git enabled", () => {
    let fix;
    const logger = new TestLogger_1.TestLogger();
    const manager = new repository_1.RepositoryManager("", "revision", "remote", "link:{path}", false, // disable git
    logger);
    before(function () {
        function createRepo(path) {
            git(path, "init", "-b", "test");
            git(path, "add", ".");
            git(path, "commit", "-m", "Test commit");
        }
        fix = (0, fs_fixture_builder_1.tempdirProject)();
        fix.addFile("root.txt");
        fix.addFile(".gitignore", "/ignored");
        fix.addSymlink("self", ".");
        fix.addSymlink("sub", "subfolder");
        fix.dir("subfolder", (dir) => {
            dir.addFile("sub.txt");
        });
        fix.dir("ignored", (dir) => {
            dir.addFile("ignored.txt");
        });
        fix.dir("sub_repo", (dir) => {
            dir.addFile("repo.txt");
        });
        try {
            fix.write();
        }
        catch (error) {
            if (process.platform === "win32") {
                // Don't have permission to create symlinks
                return this.skip();
            }
            throw error;
        }
        createRepo((0, path_1.join)(fix.cwd, "sub_repo"));
        createRepo(fix.cwd);
    });
    after(() => {
        fix.rm();
    });
    afterEach(() => {
        logger.expectNoOtherMessages();
        logger.reset();
    });
    it("Handles the simplest case", () => {
        const root = (0, paths_1.normalizePath)((0, path_1.join)(fix.cwd, "root.txt"));
        const repo = manager.getRepository(root);
        (0, assert_1.ok)(repo);
        (0, assert_1.deepStrictEqual)(repo.getURL(root, 1), "link:root.txt");
        (0, assert_1.deepStrictEqual)(repo.files, new Set([
            ".gitignore",
            "root.txt",
            "self",
            "sub",
            "sub_repo",
            "subfolder/sub.txt",
        ].map((f) => (0, paths_1.normalizePath)((0, path_1.join)(fix.cwd, f)))));
    });
    it("Handles a recursive self-symlink", () => {
        const root = (0, path_1.join)(fix.cwd, "self/self/self/root.txt");
        const repo = manager.getRepository(root);
        (0, assert_1.ok)(repo);
        // Ideally, this would probably be link:root.txt, but I'll
        // settle for not crashing right now.
        (0, assert_1.deepStrictEqual)(repo.getURL(root, 1), undefined);
        (0, assert_1.deepStrictEqual)(repo.files, new Set([
            ".gitignore",
            "root.txt",
            "self",
            "sub",
            "sub_repo",
            "subfolder/sub.txt",
        ].map((f) => (0, paths_1.normalizePath)((0, path_1.join)(fix.cwd, f)))));
    });
    it("Handles a nested repository", () => {
        const sub = (0, paths_1.normalizePath)((0, path_1.join)(fix.cwd, "sub_repo/repo.txt"));
        const repo = manager.getRepository(sub);
        (0, assert_1.ok)(repo);
        (0, assert_1.deepStrictEqual)(repo.path, (0, paths_1.normalizePath)((0, path_1.join)(fix.cwd, "sub_repo")));
        (0, assert_1.deepStrictEqual)(repo.getURL(sub, 1), "link:repo.txt");
        (0, assert_1.deepStrictEqual)(repo.files.size, 1);
    });
    it("Caches repositories", () => {
        // Load cache
        for (const path of [
            "root.txt",
            "self/self/self/root.txt",
            "sub_repo/repo.txt",
            "ignored/ignored.txt",
            "subfolder/sub.txt",
        ]) {
            manager.getRepository((0, path_1.join)(fix.cwd, path));
        }
        const root = (0, path_1.join)(fix.cwd, "root.txt");
        const rootIndirect = (0, path_1.join)(fix.cwd, "self/self/self/root.txt");
        const subfolder = (0, path_1.join)(fix.cwd, "subfolder/sub.txt");
        const repo = manager.getRepository(root);
        const repo2 = manager.getRepository(rootIndirect);
        const repo3 = manager.getRepository(subfolder);
        (0, assert_1.ok)(repo === repo2);
        (0, assert_1.ok)(repo === repo3);
        const sub = (0, path_1.join)(fix.cwd, "sub_repo/repo.txt");
        const subRepo = manager.getRepository(sub);
        const subRepo2 = manager.getRepository(sub);
        (0, assert_1.ok)(subRepo === subRepo2);
        (0, assert_1.deepStrictEqual)(manager["cache"], new Map([
            [(0, paths_1.normalizePath)(fix.cwd), repo],
            [(0, paths_1.normalizePath)((0, path_1.join)(fix.cwd, "self/self/self")), repo],
            [(0, paths_1.normalizePath)((0, path_1.join)(fix.cwd, "sub_repo")), subRepo],
            [(0, paths_1.normalizePath)((0, path_1.join)(fix.cwd, "ignored")), repo],
            [(0, paths_1.normalizePath)((0, path_1.join)(fix.cwd, "subfolder")), repo],
        ]));
    });
    it("Handles .gitignored paths", () => {
        const ign = (0, path_1.join)(fix.cwd, "ignored/ignored.txt");
        const repo = manager.getRepository(ign);
        (0, assert_1.deepStrictEqual)(repo?.path, (0, paths_1.normalizePath)(fix.cwd));
        (0, assert_1.deepStrictEqual)(repo.getURL(ign, 1), undefined);
    });
});
//# sourceMappingURL=Repository.test.js.map