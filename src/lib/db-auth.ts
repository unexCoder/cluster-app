import {
  SecretsManagerClient,
  GetSecretValueCommand,
  GetSecretValueCommandInput,
  GetSecretValueCommandOutput,
} from '@aws-sdk/client-secrets-manager';

interface DatabaseCredentials {
  username: string;
  password: string;
  engine: string;
  host: string;
  port: number;
  dbname?: string;
  dbInstanceIdentifier?: string;
}

/**
 * Retrieves a secret from AWS Secrets Manager
 * @param secretName - The name or ARN of the secret
 * @param region - AWS region (default: sa-east-1)
 * @returns The secret value as a string or parsed JSON object
 */

export async function getSecret(
  secretName: string = process.env.SECRET_NAME || 'rds!db-541292c3-faa1-428f-b5be-70ee52200632',
  region: string = process.env.AWS_REGION || 'sa-east-1'
): Promise<string | DatabaseCredentials> {
  
  // Create a Secrets Manager client
  const client = new SecretsManagerClient({
    region: region,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    }
  });

  const input: GetSecretValueCommandInput = {
    SecretId: secretName,
  };

  const command = new GetSecretValueCommand(input);

  try {
    const response: GetSecretValueCommandOutput = await client.send(command);

    if (!response.SecretString) {
      throw new Error('Secret string is empty or undefined');
    }

    const secret = response.SecretString;

    // Try to parse as JSON (common for RDS secrets)
    try {
      return JSON.parse(secret) as DatabaseCredentials;
    } catch {
      // Return as plain string if not JSON
      return secret;
    }
  } catch (error) {
    // For a list of exceptions thrown, see
    // https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
    console.error('Error retrieving secret:', error);
    throw error;
  }
}

/**
 * Example usage for RDS database credentials
 */
export async function getDatabaseCredentials(): Promise<DatabaseCredentials> {
  const secret = await getSecret();

  if (typeof secret === 'string') {
    throw new Error('Expected JSON credentials but received string');
  }

  return secret;
}

// Example usage:
// (async () => {
//   try {
//     const credentials = await getDatabaseCredentials();
//     console.log('Database Host:', credentials.host);
//     console.log('Database Port:', credentials.port);
//     console.log('Username:', credentials.username);
//     // Use credentials.password for database connection
//   } catch (error) {
//     console.error('Failed to retrieve credentials:', error);
//   }
// })();