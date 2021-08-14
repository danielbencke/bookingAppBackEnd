import handler from "./resources/handlerLambda";
import dynamoDb from "./resources/dynamodbConfig";

export const main = handler(async (event, context) => {
	const params = {
		TableName: process.env.tableName,
		// KeyConditionExpression = condition for the query
		// Return items matching the partition key
		KeyConditionExpression: "PK = :PK",
		// ExpressionAttributeValues equals the value in the condition
		// - ':PK': defines 'PK' to user id
		ExpressionAttributeValues: {
			":PK": event.requestContext.identity.cognitoIdentityId,
		},
	};

	const result = await dynamoDb.query(params);

	// Return the matching list of items in response body
	return result.Items;
});
