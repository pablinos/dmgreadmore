<?php
/**
 * Manages the _contains_dmg_readmore meta key when posts are saved
 *
 * @param int     $post_id Post ID.
 * @param WP_Post $post    Post object.
 */
function dmg_readmore_update_meta( $post_id, $post ) {
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return false;
	}

	if ( defined( 'WP_IMPORTING' ) && WP_IMPORTING ) {
		return false;
	}

	if ( 'post' !== $post->post_type ) {
		return false;
	}

	$has_readmore_block = false;

	if ( has_blocks( $post->post_content ) ) {
		$blocks = parse_blocks( $post->post_content );
		$has_readmore_block = dmg_readmore_find_block_in_content( $blocks );
	}

	if ( $has_readmore_block ) {
		update_post_meta( $post_id, '_contains_dmg_readmore', '1' );
		return true;
	}
	delete_post_meta( $post_id, '_contains_dmg_readmore' );
	return false;
}
add_action( 'wp_insert_post', 'dmg_readmore_update_meta', 10, 2 );

/**
 * Recursively searches for dmg/readmore block in content
 *
 * @param array $blocks Array of parsed blocks.
 * @return bool Whether the dmg/readmore block was found.
 */
function dmg_readmore_find_block_in_content( $blocks ) {
	if ( ! is_array( $blocks ) ) {
		return false;
	}

	foreach ( $blocks as $block ) {
		if ( 'dmg/readmore' === $block['blockName'] ) {
			return true;
		}

		if ( ! empty( $block['innerBlocks'] ) ) {
			$found_in_nested = dmg_readmore_find_block_in_content( $block['innerBlocks'] );
			if ( $found_in_nested ) {
				return true;
			}
		}
	}

	return false;
}
