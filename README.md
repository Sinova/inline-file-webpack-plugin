# Inline File Plugin

This plugin allows you to directly inject files into Webpack's output after all processing has finished. This is particularly useful when concatenating multiple files that were created via the [Extract Text Plugin](https://github.com/webpack-contrib/extract-text-webpack-plugin) such as CSS and SVG files.

## Usage

#### webpack.config.json
```JavaScript
const InlineFileWebpackPlugin = require('inline-file-webpack-plugin');

module.exports = {
	// ...

	plugins : [
		// ...

		new InlineFileWebpackPlugin({
			input     : './build/index.html', // The file in which to look for inlined paths
			output    : './build/final.html', // Optional - The output file (defaults to overwriting the input file)
			root_path : './build'             // Optional - The root directory from which inlined paths are resolved (defaults to the directory of the input file)
			prefix    : '[[[',                // Optional - The prefix for inlined paths (defaults to '[[[')
			suffix    : ']]]',                // Optional - The suffix for inlined paths (defaults to ']]]')
		}),
	],
};
```

#### ./build/index.html

This HTML file could possibly be generated using the [HTML Webpack Plugin](https://github.com/ampedandwired/html-webpack-plugin). The *style.css* and *icons.svg* could be generated using the [Extract Text Plugin](https://github.com/webpack-contrib/extract-text-webpack-plugin).

```HTML
<!DOCTYPE html>
<html>
	<head>
		<title>Example</title>
		<style>[[[./style.css]]]</style>
	</head>
	<body>
		<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
			<defs>
				[[[index.svg]]]
			</defs>
		</svg>
	</body>
</html>
```
