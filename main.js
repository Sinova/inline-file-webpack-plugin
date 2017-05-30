const fs   = require('fs');
const path = require('path');

const escape_regexp      = /[-[\]{}()*+?.,\\^$|#\s]/g;
const escape_regexp_with = '\\$&';

const defaults = {
	input     : null,
	output    : null,
	root_path : null,
	prefix    : '[[[',
	suffix    : ']]]',
	callbacks : {},
};

class InlineFileWebpackPlugin {
	constructor(config) {
		this.config = Object.assign({}, defaults, config);
	}

	apply(compiler) {
		const input     = this.config.input;
		const output    = this.config.output || input
		const root_path = this.config.root_path ? path.resolve(this.config.root_path) : path.dirname(input);
		const prefix    = this.config.prefix.replace(escape_regexp, escape_regexp_with);
		const suffix    = this.config.suffix.replace(escape_regexp, escape_regexp_with);
		const callbacks = this.config.callbacks || {};

		compiler.plugin('done', () => {
			fs.writeFileSync(output,
				fs.readFileSync(input, {encoding : 'utf8'})
					.replace(new RegExp(`${prefix}(.*?)${suffix}`, 'g'), (match, file) => {
						const text = fs.readFileSync(path.resolve(`${root_path}/${file}`), {encoding : 'utf8'});

						return callbacks[file] ? callbacks[file](text) : text;
					})
			);
		});
	}
}

module.exports = InlineFileWebpackPlugin;
