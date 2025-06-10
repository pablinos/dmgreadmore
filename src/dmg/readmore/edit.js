import { __ } from '@wordpress/i18n';
import { useCallback } from '@wordpress/element';
import { PanelBody, Placeholder } from '@wordpress/components';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { store } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import PostSelector from './components/PostSelector';
import PostSelectorModal from './components/PostSelectorModal';
import './editor.scss';

const EMPTY_OBJECT = {};
/**
 * The edit component for the block will render a Placeholder initially and then
 * once a post is selected, will render the representation of the Read More link.
 *
 * @param {Object}   props               Block props.
 * @param {Object}   props.attributes    Block attributes.
 * @param {Function} props.setAttributes Function to set block attributes.
 * @return {Element} Element to render.
 */
export default function Edit( { attributes, setAttributes } ) {
	const { postId } = attributes;
	const { postTitle, postLink } = useSelect(
		( select ) => {
			if ( ! postId ) {
				return EMPTY_OBJECT;
			}
			const post = select( store ).getEntityRecord(
				'postType',
				'post',
				postId
			);
			return {
				postTitle: post?.title.rendered,
				postLink: post?.link,
			};
		},
		[ postId ]
	);

	const handleSelectPost = useCallback(
		( post ) => {
			setAttributes( { postId: post.id } );
		},
		[ setAttributes ]
	);

	if (
		postId && postTitle && postLink &&
		( postTitle !== attributes.postTitle ||
			postLink !== attributes.postLink )
	) {
		setAttributes( {
			postTitle,
			postLink,
		} );
	}

	const inspectorControls = (
		<InspectorControls>
			<PanelBody title={ __( 'Post Selection', 'dmgreadmore' ) }>
				<PostSelectorModal
					selectedPostId={ postId }
					onSelectPost={ handleSelectPost }
				/>
			</PanelBody>
		</InspectorControls>
	);

	const blockProps = useBlockProps( { className: 'dmg-read-more' } );

	if ( ! postId ) {
		return (
			<div { ...blockProps }>
				{ inspectorControls }

				<Placeholder
					icon="admin-links"
					label={ __( 'DMG Read More', 'dmgreadmore' ) }
					instructions={ __(
						'Select a post to create a Read More link',
						'dmgreadmore'
					) }
				>
					<PostSelector
						selectedPostId={ postId }
						onSelectPost={ handleSelectPost }
					/>
				</Placeholder>
			</div>
		);
	}

	return (
		<>
			{ inspectorControls }

			<p { ...blockProps }>
				{ __( 'Read More:', 'dmgreadmore' ) }{ ' ' }
				<a href={ postLink }>{ postTitle }</a>
			</p>
		</>
	);
}
