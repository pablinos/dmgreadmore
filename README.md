# DMG Read More

Block that creates a 'Read More' link to another post.

- `npm install` - to bring supporting packages
- `wp-env start` - to setup a local WP environment
- `npm run start` - to build and watch for changes
- `wp-env run cli wp eval-file /var/www/html/wp-content/plugins/dmgreadmore/scripts/generateposts.php 1000` - to generate a thousand test posts
- Add the DMG Read More block to a post, and select a post to link to. It uses a DataView to display the posts, so they can be paged through and searched for.
- `wp-env run cli wp dmg-read-more search` - searches for post IDs that use the block
	- To make this efficient post meta is stored to flag the post as using the block, at the point the post is saved.
	- A `--resync` option can be added to the command which means that the post content will be searched and the metadata updated as the block is found.
	- In future this could be extended to store the ID of the post being linked to in the meta, which would mean youcould search for all links to a particular post. This could be important because the post title or link might change, and with the current implementation that would mean the old details will be saved in the linking post.

## To Do
- Add tests
- Create an improved icon
- Improve the data view paging to prevent the current flicker

