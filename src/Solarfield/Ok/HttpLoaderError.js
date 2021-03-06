define(
	[
		'solarfield/ok-kit-js/src/Solarfield/Ok/ObjectUtils',
		'solarfield/ok-kit-js/src/Solarfield/Ok/CustomError'
	],
	function (
		ObjectUtils, CustomError
	) {
		"use strict";
		
		/**
		 * Error class which has additional info about the HttpLoader response.
		 * @class HttpLoaderError
		 * @extends CustomError
		 * @see HttpLoader#load
		 */
		var HttpLoaderError = ObjectUtils.extend(CustomError, {
			/**
			 * @param {string} aMessage
			 * @param {int=0} aCode
			 * @param {Error=} aPrevious
			 * @param {HttpLoaderResult} aResult
			 * @constructor
			 *
			 * @property {HttpLoaderErrorDetails} httpLoaderDetails - Details about the
			 */
			constructor: function HttpLoaderError(aMessage, aCode, aPrevious, aResult) {
				HttpLoaderError.super.call(this, aMessage, aCode, aPrevious);
				
				this.httpLoaderDetails = {
					result: aResult
				};
			}
		});
		
		return HttpLoaderError;
	}
);

/**
 * @typedef {{}} HttpLoaderErrorDetails - Additional info about the error.
 * @property {HttpLoaderResult} result - Any data returned by HttpLoader#load.
 */
 