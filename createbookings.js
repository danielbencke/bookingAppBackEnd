import * as uuid from "uuid";
import handler from "./resources/handlerLambda";
import dynamoDb from "./resources/dynamodbConfig";
import { ulid } from "ulid";

export const main = handler(async (event, context) => {
	const data = JSON.parse(event.body);
	for (let i = 0; i < data.bookings.length; i++) {
		// create a booking order item into Dynamo from map elements coming from the body
		const params = {
			TableName: process.env.tableName,
			Item: {
				// The attributes of the item in our DynamoDb table
				// PK: The id of the currently user logged in retrieved by our cognito user pool
				PK: event.requestContext.identity.cognitoIdentityId,
				SK: ulid() + uuid.v1(), // unique identifiers: uuid and ulid sorted by time
				GSI1: data.bookings[i][0], // Parsed from request body
				email: data.email,
				bookingDate: data.bookings[i][1],
				ttl: new Date(data.bookings[i][1]).getTime() / 1000 + 7 * 24 * 60 * 60, // Add Unix timestamp +7 days from the booking date
			},
		};

		await dynamoDb.put(params);
	}
	return;
});
