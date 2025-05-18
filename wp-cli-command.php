<?php
/**
 * WP-CLI commands for DMG Read More block
 */

if ( defined( 'WP_CLI' ) && WP_CLI ) {

	/**
	 * Search for posts containing dmg/readmore blocks within a date range
	 */
	class DMG_Readmore_Command {

		/**
		 * Search for posts containing dmg/readmore blocks
		 *
		 * ## OPTIONS
		 *
		 * [--date-after=<date>]
		 * : Find posts published after this date (format: YYYY-MM-DD)
		 *
		 * [--date-before=<date>]
		 * : Find posts published before this date (format: YYYY-MM-DD)
		 *
		 * [--resync]
		 * : Rescan post content and update meta values
		 *
		 * [--batch-size=<number>]
		 * : Number of posts to process in each batch (default: 100)
		 *
		 * ## EXAMPLES
		 *
		 *     # Search for posts with readmore blocks in the last 30 days
		 *     $ wp dmg-read-more search
		 *
		 *     # Search for posts with readmore blocks in a specific date range
		 *     $ wp dmg-read-more search --date-after=2023-01-01 --date-before=2023-12-31
		 *
		 *     # Rescan posts and update meta values
		 *     $ wp dmg-read-more search --resync
		 *
		 * @param array $args Command arguments
		 * @param array $assoc_args Command options
		 */
		public function search( $args, $assoc_args ) {
			// Set default date range (last 30 days)
			$date_after = isset( $assoc_args['date-after'] ) ? $assoc_args['date-after'] : date( 'Y-m-d', strtotime( '-30 days' ) );
			$date_before = isset( $assoc_args['date-before'] ) ? $assoc_args['date-before'] : date( 'Y-m-d' );

			// Validate date formats
			if ( isset( $assoc_args['date-after'] ) && ! preg_match( '/^\d{4}-\d{2}-\d{2}$/', $date_after ) ) {
				WP_CLI::error( __( 'The date-after parameter must be in YYYY-MM-DD format.', 'dmgreadmore' ) );
			}

			if ( isset( $assoc_args['date-before'] ) && ! preg_match( '/^\d{4}-\d{2}-\d{2}$/', $date_before ) ) {
				WP_CLI::error( __( 'The date-before parameter must be in YYYY-MM-DD format.', 'dmgreadmore' ) );
			}

			$resync = ! empty( $assoc_args['resync'] );
			$batch_size = isset( $assoc_args['batch-size'] ) ? (int) $assoc_args['batch-size'] : 100;

			if ( $resync ) {
				WP_CLI::log( sprintf( __( 'Rescanning posts from %s to %s and updating meta values', 'dmgreadmore' ), $date_after, $date_before ) );
			} else {
				WP_CLI::log( sprintf( __( 'Searching for posts with dmg/readmore blocks from %s to %s', 'dmgreadmore' ), $date_after, $date_before ) );
			}
			$paged = 1;
			$found_posts = 0;
			$updated_posts = 0;

			do {
				$query_args = array(
					'post_type'      => 'post',
					'post_status'    => 'publish',
					'date_query'     => array(
						array(
							'after'     => $date_after,
							'before'    => $date_before,
							'inclusive' => true,
						),
					),
					'posts_per_page' => $batch_size,
					'paged'          => $paged,
					'no_found_rows'  => true,
				);

				// Only filter by meta if not resyncing
				if ( ! $resync ) {
					$query_args['meta_query'] = array(
						array(
							'key'     => '_contains_dmg_readmore',
							'value'   => '1',
							'compare' => '=',
						),
					);
					$query_args['fields'] = 'ids';
				}

				$query = new WP_Query( $query_args );

				foreach ( $query->posts as $post ) {

					if ( $resync ) {
						$current_meta = get_post_meta( $post->ID, '_contains_dmg_readmore', true );
						$has_readmore_block = dmg_readmore_update_meta( $post->ID, $post );

						if ( $has_readmore_block && '1' !== $current_meta ) {
							$updated_posts++;
						} elseif ( ! $has_readmore_block && '1' === $current_meta ) {
							$updated_posts++;
						}

						if ( $has_readmore_block ) {
							WP_CLI::log( $post->ID );
							$found_posts++;
						}
					} else {
						WP_CLI::log( $post );
						$found_posts++;
					}
				}

				$paged++;

			} while ( count( $query->posts ) > 0 );

			if ( $found_posts > 0 ) {
				WP_CLI::success(
					sprintf(
						// translators: %d: Number of posts found
						_n( 'Found %d post with dmg/readmore blocks', 'Found %d posts with dmg/readmore blocks', $found_posts, 'dmgreadmore' ),
						$found_posts
					)
				);
			} else {
				WP_CLI::warning( __( 'No posts found with dmg/readmore blocks in the specified date range', 'dmgreadmore' ) );
			}

			if ( $resync ) {
				$updated_message = sprintf(
					// translators: %d: Number of posts updated
					_n( 'Updated meta for %d post.', 'Updated meta for %d posts.', $updated_posts, 'dmgreadmore' ),
					$updated_posts
				);

				WP_CLI::success( $updated_message );
			}
		}
	}

	WP_CLI::add_command( 'dmg-read-more', 'DMG_Readmore_Command' );
}
