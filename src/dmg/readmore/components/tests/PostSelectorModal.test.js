import { render, screen, fireEvent } from '@testing-library/react';
import PostSelectorModal from '../PostSelectorModal';

const mockGetEntityRecord = jest.fn().mockReturnValue( {
	id: 42,
	title: { rendered: 'Test Post Title' },
} );

const mockSelect = jest.fn().mockReturnValue( {
	getEntityRecord: mockGetEntityRecord,
} );

const mockUseSelect = jest.fn();
jest.mock( '@wordpress/data', () => {
	return {
		__esModule: true,
		// Mock useSelect with the factory pattern to avoid hoisting issues
		useSelect: ( ...args ) => mockUseSelect( ...args ),
		createRegistrySelector: ( fn ) => fn,
		createSelector: ( fn ) => fn,
		select: () => mockSelect(),
	};
} );

jest.mock( '@wordpress/core-data', () => ( {
	store: {
		name: 'core',
	},
} ) );

jest.mock( '@wordpress/components', () => ( {
	Button: ( { children, onClick } ) => (
		<button onClick={ onClick }>{ children }</button>
	),
	Modal: ( { children, title, onRequestClose } ) => (
		<div data-testid="mock-modal">
			<button onClick={ onRequestClose }>Close</button>
			<h2>{ title }</h2>
			<div>{ children }</div>
		</div>
	),
} ) );

jest.mock( '../PostSelector', () => ( {
	__esModule: true,
	default: ( { onSelectPost } ) => (
		<div data-testid="mock-post-selector">
			<button
				data-testid="select-post-button"
				onClick={ () => onSelectPost( 123 ) }
			>
				Select Post 123
			</button>
		</div>
	),
} ) );

describe( 'PostSelectorModal', () => {
	beforeEach( () => {
		jest.clearAllMocks();

		mockUseSelect.mockImplementation( ( callback ) => {
			return callback( () => mockSelect() );
		} );
	} );

	afterEach( () => {
		jest.clearAllMocks();
	} );

	it( 'renders with no selected post', () => {
		mockUseSelect.mockReturnValue( null );

		const onSelectPost = jest.fn();
		render(
			<PostSelectorModal
				selectedPostId={ null }
				onSelectPost={ onSelectPost }
			/>
		);

		expect( screen.getByText( 'No post selected' ) ).toBeInTheDocument();
		expect( screen.getByText( 'Select Post' ) ).toBeInTheDocument();
	} );

	it( 'renders with a selected post', () => {
		const onSelectPost = jest.fn();
		render(
			<PostSelectorModal
				selectedPostId={ 42 }
				onSelectPost={ onSelectPost }
			/>
		);

		expect( screen.getByText( 'Selected Post:' ) ).toBeInTheDocument();
		expect( screen.getByText( 'Test Post Title' ) ).toBeInTheDocument();
		expect( screen.getByText( 'Change Post' ) ).toBeInTheDocument();
	} );

	it( 'opens the modal when the button is clicked', () => {
		const onSelectPost = jest.fn();
		render(
			<PostSelectorModal
				selectedPostId={ 42 }
				onSelectPost={ onSelectPost }
			/>
		);

		expect( screen.queryByTestId( 'mock-modal' ) ).not.toBeInTheDocument();
		fireEvent.click( screen.getByText( 'Change Post' ) );
		expect( screen.getByTestId( 'mock-modal' ) ).toBeInTheDocument();
	} );

	it( 'closes the modal when a post is selected', () => {
		const onSelectPost = jest.fn();
		render(
			<PostSelectorModal
				selectedPostId={ 42 }
				onSelectPost={ onSelectPost }
			/>
		);

		fireEvent.click( screen.getByText( 'Change Post' ) );
		expect( screen.getByTestId( 'mock-modal' ) ).toBeInTheDocument();
		fireEvent.click( screen.getByTestId( 'select-post-button' ) );
		expect( screen.queryByTestId( 'mock-modal' ) ).not.toBeInTheDocument();
		expect( onSelectPost ).toHaveBeenCalledWith( 123 );
	} );

	it( 'closes the modal when the close button is clicked', () => {
		const onSelectPost = jest.fn();
		render(
			<PostSelectorModal
				selectedPostId={ 42 }
				onSelectPost={ onSelectPost }
			/>
		);

		fireEvent.click( screen.getByText( 'Change Post' ) );
		expect( screen.getByTestId( 'mock-modal' ) ).toBeInTheDocument();

		fireEvent.click( screen.getByText( 'Close' ) );
		expect( screen.queryByTestId( 'mock-modal' ) ).not.toBeInTheDocument();
		expect( onSelectPost ).not.toHaveBeenCalled();
	} );
} );
