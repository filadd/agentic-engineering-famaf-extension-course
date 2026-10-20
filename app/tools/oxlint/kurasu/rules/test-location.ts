import { defineRule } from "@oxlint/plugins";

const testFile = /\.test\.tsx?$/;
const testFolders = ["/apps/api/test/", "/apps/web/test/"];

/** Tests are integration tests and live only in apps/api/test and apps/web/test. */
export const testLocationRule = defineRule({
  meta: {
    type: "problem",
    docs: {
      description: "Keep test files in apps/api/test or apps/web/test.",
    },
    messages: {
      misplacedTest:
        "Move this test to apps/api/test (endpoints against the local stack) or apps/web/test (screens with MSW).",
    },
  },
  createOnce(context) {
    return {
      Program(node) {
        const filename = context.filename.replaceAll("\\", "/");

        if (testFile.test(filename) && !testFolders.some((folder) => filename.includes(folder))) {
          context.report({ node, messageId: "misplacedTest" });
        }
      },
    };
  },
});
