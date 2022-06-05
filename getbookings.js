import handler from "./resources/handlerLambda";
import dynamoDb from "./resources/dynamodbConfig";

export const main = handler(async (event, context) => {
	const params = {
		TableName: process.env.tableName,

		Key: {
			PK: event.requestContext.identity.cognitoIdentityId, // The id of the author
			SK: event.pathParameters.id, // The id of the booking from the path
		},
	};

	const result = await dynamoDb.get(params);
	if (!result.Item) {
		throw new Error("Item not found.");
	}

	// Return the retrieved item
	return result.Item;
});
