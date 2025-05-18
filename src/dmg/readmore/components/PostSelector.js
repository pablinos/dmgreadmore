import { useState, useMemo, useCallback } from '@wordpress/element';
import { DataViews } from '@wordpress/dataviews';
import { useEntityRecords } from '@wordpress/core-data';
import { __ } from '@wordpress/i18n';

const EMPTY_ARRAY = [];

const PostSelector = ( { onSelectPost } ) => {
	const primaryField = 'id';

	const defaultLayouts = {
		table: {
			layout: {
				primaryField,
			},
		},
		list: {
			layout: {
				primaryField,
			},
		},
	};

	const [ view, setView ] = useState( {
		type: 'table',
		perPage: 10,
		page: 1,
		layout: defaultLayouts.table.layout,
		fields: [ 'id' ],
		titleField: 'title',
	} );

	const [ queryArgs, setQueryArgs ] = useState( {
		per_page: view.perPage,
		page: view.page,
	} );

	const {
		records: posts,
		isResolving,
		totalItems,
		totalPages,
	} = useEntityRecords( 'postType', 'post', queryArgs );

	const changeView = useCallback(
		( newView ) => {
			const newQueryArgs = {
				per_page: newView.perPage,
				page: newView.page || 1,
			};
			if ( newView.search ) {
				if ( /^\d+$/.test( newView.search ) ) {
					newQueryArgs.include = newView.search;
				} else {
					newQueryArgs.search = newView.search;
				}
			}
			setQueryArgs( newQueryArgs );
			setView( newView );
		},
		[ setQueryArgs, setView ]
	);

	const fields = [
		{
			id: 'id',
			label: __( 'ID' ),
			enableGlobalSearch: true,
		},
		{
			id: 'title',
			label: __( 'Title' ),
			getValue: ( { item } ) => item.title.rendered,
			enableGlobalSearch: true,
			enableHiding: false,
		},
	];

	const paginationInfo = useMemo(
		() => ( { totalItems, totalPages } ),
		[ totalItems, totalPages ]
	);

	return (
		<div className="dmg-post-selector">
			<DataViews
				data={ posts || EMPTY_ARRAY }
				isLoading={ isResolving }
				view={ view }
				onChangeView={ changeView }
				paginationInfo={ paginationInfo }
				defaultLayouts={ defaultLayouts }
				isItemClickable={ () => true }
				onClickItem={ onSelectPost }
				fields={ fields }
			/>
		</div>
	);
};

export default PostSelector;
