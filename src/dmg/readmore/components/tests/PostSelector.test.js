import { render, screen } from '@testing-library/react';
import { useEntityRecords } from '@wordpress/core-data';
import PostSelector from '../PostSelector';

jest.mock( '@wordpress/core-data', () => ( {
	useEntityRecords: jest.fn(),
} ) );

jest.mock( '@wordpress/dataviews', () => ( {
	DataViews: ( { data, onClickItem } ) => (
		<div data-testid="mock-dataviews">
			{ data.map( ( item ) => (
				<button
					key={ item.id }
					data-testid={ `post-item-${ item.id }` }
					onClick={ () => onClickItem( item.id ) }
				>
					{ item.title.rendered }
				</button>
			) ) }
		</div>
	),
} ) );

describe( 'PostSelector', () => {
	const mockPosts = [
		{
			id: 1,
			title: { rendered: 'Test Post 1' },
		},
		{
			id: 2,
			title: { rendered: 'Test Post 2' },
		},
	];

	const mockEntityRecordsResponse = {
		records: mockPosts,
		isResolving: false,
		totalItems: 2,
		totalPages: 1,
	};

	beforeEach( () => {
		useEntityRecords.mockReturnValue( mockEntityRecordsResponse );
	} );

	afterEach( () => {
		jest.clearAllMocks();
	} );

	it( 'renders without crashing', () => {
		const onSelectPost = jest.fn();
		render( <PostSelector onSelectPost={ onSelectPost } /> );

		expect( screen.getByTestId( 'mock-dataviews' ) ).toBeInTheDocument();
	} );

	it( 'passes the correct props to DataViews', () => {
		const onSelectPost = jest.fn();
		render( <PostSelector onSelectPost={ onSelectPost } /> );

		expect( screen.getByText( 'Test Post 1' ) ).toBeInTheDocument();
		expect( screen.getByText( 'Test Post 2' ) ).toBeInTheDocument();
	} );

	it( 'calls onSelectPost when a post is clicked', () => {
		const onSelectPost = jest.fn();
		render( <PostSelector onSelectPost={ onSelectPost } /> );

		screen.getByText( 'Test Post 1' ).click();

		expect( onSelectPost ).toHaveBeenCalledWith( 1 );
	} );

	it( 'handles loading state correctly', () => {
		useEntityRecords.mockReturnValue( {
			...mockEntityRecordsResponse,
			isResolving: true,
			records: null,
		} );

		const onSelectPost = jest.fn();
		render( <PostSelector onSelectPost={ onSelectPost } /> );

		expect( screen.getByTestId( 'mock-dataviews' ) ).toBeInTheDocument();
		expect( screen.queryByText( 'Test Post 1' ) ).not.toBeInTheDocument();
	} );
} );
