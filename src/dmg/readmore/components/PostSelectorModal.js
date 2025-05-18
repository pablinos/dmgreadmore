import { useState, useCallback } from '@wordpress/element';
import { Button, Modal } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { store as coreDataStore } from '@wordpress/core-data';
import PostSelector from './PostSelector';

const PostSelectorModal = ( { selectedPostId, onSelectPost } ) => {
	const [ isOpen, setIsOpen ] = useState( false );

	const selectedPost = useSelect(
		( select ) => {
			if ( ! selectedPostId ) {
				return null;
			}
			return select( coreDataStore ).getEntityRecord(
				'postType',
				'post',
				selectedPostId
			);
		},
		[ selectedPostId ]
	);

	const openModal = useCallback( () => setIsOpen( true ), [ setIsOpen ] );;
	const closeModal = useCallback( () => setIsOpen( false ), [ setIsOpen ] );

	const handleSelectPost = useCallback( ( postId ) => {
		onSelectPost( postId );
		closeModal();
	}, [ onSelectPost, closeModal ] );

	return (
		<div className="dmg-post-selector-modal">
			<div className="dmg-post-selector-modal__current">
				{ selectedPost ? (
					<p>
						<strong>
							{ __( 'Selected Post:', 'dmgreadmore' ) }
						</strong>
						<br /> { selectedPost.title.rendered }
					</p>
				) : (
					<p>{ __( 'No post selected', 'dmgreadmore' ) }</p>
				) }
			</div>

			<Button variant="secondary" onClick={ openModal }>
				{ selectedPost
					? __( 'Change Post', 'dmgreadmore' )
					: __( 'Select Post', 'dmgreadmore' ) }
			</Button>

			{ isOpen && (
				<Modal
					title={ __( 'Select a Post', 'dmgreadmore' ) }
					onRequestClose={ closeModal }
					className="dmg-post-selector-modal__content"
				>
					<PostSelector
						selectedPostId={ selectedPostId }
						onSelectPost={ handleSelectPost }
					/>
				</Modal>
			) }
		</div>
	);
};

export default PostSelectorModal;
