/**
 * External dependencies
 */
import '@testing-library/jest-dom';

// Set up global mocks that might be needed across multiple test files

// Mock the WordPress i18n functions
global.__ = ( text ) => text;
global.sprintf = jest.fn( ( format, ...args ) => {
	return format.replace( /%s/g, () => args.shift() );
} );
