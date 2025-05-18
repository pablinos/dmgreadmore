import { useBlockProps } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { postTitle, postLink } = attributes;

	if ( ! postTitle || ! postLink ) {
		return null;
	}

	return (
		<p { ...useBlockProps.save( { className: 'dmg-read-more' } ) }>
			Read More: <a href={ postLink }>{ postTitle }</a>
		</p>
	);
}
