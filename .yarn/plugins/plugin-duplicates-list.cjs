// - Получить cwd и конфигурацию (Configuration)
// - Получить project (Project)
// - Получить state установки (restoreInstallState)
// - При итерации фильтровать virtual (structUtils)
// - Пройтись по storedPackages
module.exports = {
    name: `plugin-duplicates-list`,
    factory: (require) => {
        const { BaseCommand } = require(`@yarnpkg/cli`);
        const { Configuration, Project, structUtils } = require("@yarnpkg/core");
        const cwd = process.cwd();

        const dupMap = {};

        class DuplicatesCommand extends BaseCommand {
            static paths = [['duplicates']];

            async execute() {
                const configuration = await Configuration.find(cwd, null);
                const { project } = await Project.find(configuration, cwd);

                await project.restoreInstallState();

                for (let [_key, pkg] of project.storedPackages) {
                    const pkgName = pkg.name;
                    const pkgVer = pkg.version;

                    dupMap[pkgName] ??= new Set();
                    dupMap[pkgName].add(pkgVer);
                }

                for (let pkgName in dupMap) {
                    const versions = dupMap[pkgName];

                    if (versions.size > 1) {
                        this.context.stdout.write(`${pkgName}: ${Array.from(versions).join(' ')}\n`);
                    }
                }
            }
        }

        return {
            commands: [
                DuplicatesCommand,
            ],
        };
    },
};
