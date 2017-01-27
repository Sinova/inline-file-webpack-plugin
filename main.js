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
};

class InlineFileWebpackPlugin {
	constructor(config) {
		this.config = Object.assign({}, defaults, config);
	}

	apply(compiler) {
		const root_path = this.config.root_path ? path.resolve(this.config.root_path) : path.dirname(this.config.input);
		const prefix    = this.config.prefix.replace(escape_regexp, escape_regexp_with);
		const suffix    = this.config.suffix.replace(escape_regexp, escape_regexp_with);

		compiler.plugin('done', () => {
			fs.writeFileSync(this.config.output || this.config.input,
				fs.readFileSync(this.config.input, {encoding : 'utf8'})
					.replace(new RegExp(`${prefix}(.*?)${suffix}`, 'g'), (match, file) => {
						return fs.readFileSync(path.resolve(`${root_path}/${file}`), {encoding : 'utf8'});
					})
			);
		});
	}
}

module.exports = InlineFileWebpackPlugin;
