import handler from "./resources/handlerLambda";
import dynamoDb from "./resources/dynamodbConfig";

export const main = handler(async (event, context) => {
	const params = {
		TableName: process.env.tableName,
		IndexName: process.env.indexName,
		// KeyConditionExpression defines the condition for the query
		// - "GSI1 = :GSI1 and bookingDate =:bookingDate": only return items with matching GSI1 and bookingDate (partition and sort key)
		KeyConditionExpression: "GSI1 = :GSI1 and bookingDate =:bookingDate",

		// ExpressionAttributeValues equals to the value in the condition
		// event.queryStringParameters.type and .data are parameters passed through URL
		ExpressionAttributeValues: {
			":GSI1": event.queryStringParameters.type,
			":bookingDate": event.queryStringParameters.date,
		},
	};

	const result = await dynamoDb.query(params);

	// Return the matching list of items in response body
	return result.Items;
});
