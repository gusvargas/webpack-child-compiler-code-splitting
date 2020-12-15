const JsonpTemplatePlugin = require('webpack/lib/web/JsonpTemplatePlugin');
const SingleEntryPlugin = require('webpack/lib/SingleEntryPlugin');

module.exports = class ChildCompilerPlugin {
  apply(mainCompiler) {
    mainCompiler.hooks.make.tapAsync(
      'ChildCompilerPlugin',
      (compilation, callback) => {
        const childCompiler = compilation.createChildCompiler(
          'child',
          mainCompiler.options.output,
          [
            // new JsonpTemplatePlugin(), // required since `thisCompilation` taps are not copied
          ]
        );

        // prevent errors like "Conflict: Multiple assets emit to the same filename 0.js"
        // since the child compilation will result is identically named split chunks
        childCompiler.options.output.chunkFilename = `child-${mainCompiler.options.output.chunkFilename}`;

        new SingleEntryPlugin(
          mainCompiler.context,
          './src/index.js',
          'main-2'
        ).apply(childCompiler);

        childCompiler.runAsChild(callback);
      }
    );
  }
};
