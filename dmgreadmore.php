<?php
/**
 * Plugin Name:       DMG Read More
 * Description:       A block that allows linking to a selected post.
 * Version:           0.1.0
 * Requires at least: 6.7
 * Requires PHP:      7.4
 * Author:            Paul Bunkham
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       dmgreadmore
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

require_once plugin_dir_path( __FILE__ ) . 'meta-management.php';
require_once plugin_dir_path( __FILE__ ) . 'wp-cli-command.php';

function dmgreadmore_block_init() {
    $block_json_path = __DIR__ . '/build/dmg/readmore/block.json';
    register_block_type( $block_json_path );
}
add_action( 'init', 'dmgreadmore_block_init' );
