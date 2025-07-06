import { connectToDatabase } from './mongo';

/**
 * A utility to wrap any MongoDB operation with a database connection.
 * @param operation - A function that takes a Mongoose model and returns a promise with the result.
 * @returns The result of the operation or throws an error.
 */
export async function runDBOperation<T>(
  operation: () => Promise<T>
): Promise<T> {
  try {
    await connectToDatabase();

    return await operation();
  } catch (error) {
    console.error('Database operation failed:', error);
    throw new Error('Database operation failed');
  }
}

/**
 * example usage // !requires test
 *     const newUser = await runDBOperation(async () => {
 *      const user = new User({ name, email });
 *       User.findById(userId)
 *      await user.save();
 *          return user;
 *      });
 */